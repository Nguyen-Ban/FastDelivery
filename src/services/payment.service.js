const request = require('request');
const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');

const VNP_TMNCODE = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_API = process.env.VNP_API;
const VNP_RETURNURL = process.env.VNP_RETURNURL;

class PaymentService {
    constructor() {
        this.sortObject = this.sortObject.bind(this);
    }

    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    createPaymentUrl(orderData) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let ipAddr = orderData.ipAddr;
        let tmnCode = VNP_TMNCODE;
        let secretKey = VNP_HASHSECRET;
        let vnpUrl = VNP_URL;
        let returnUrl = VNP_RETURNURL;
        let orderId = orderData.orderId;
        let amount = orderData.amount;
        let bankCode = orderData.bankCode;
        let locale = orderData.language || 'vn';
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (typeof bankCode === 'string' && bankCode.trim() !== '') {

            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = this.sortObject(vnp_Params);
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
        return { paymentUrl: vnpUrl, orderId: orderId };
    }

    verifyReturnUrl(vnp_Params) {
        let secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = this.sortObject(vnp_Params);
        let secretKey = VNP_HASHSECRET;
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        if (secureHash === signed) {
            return { code: vnp_Params['vnp_ResponseCode'], message: 'Payment verification successful', data: vnp_Params };
        } else {
            return { code: '97', message: 'Invalid signature', data: vnp_Params };
        }
    }

    verifyIpn(vnp_Params) {
        let secureHash = vnp_Params['vnp_SecureHash'];
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = this.sortObject(vnp_Params);
        let secretKey = VNP_HASHSECRET;
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        let paymentStatus = '0';
        let checkOrderId = true;
        let checkAmount = true;
        if (secureHash === signed) {
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus == "0") {
                        if (rspCode == "00") {
                            return { RspCode: '00', Message: 'Success', data: vnp_Params };
                        } else {
                            return { RspCode: '00', Message: 'Failed', data: vnp_Params };
                        }
                    } else {
                        return { RspCode: '02', Message: 'This order has been updated to the payment status', data: vnp_Params };
                    }
                } else {
                    return { RspCode: '04', Message: 'Amount invalid', data: vnp_Params };
                }
            } else {
                return { RspCode: '01', Message: 'Order not found', data: vnp_Params };
            }
        } else {
            return { RspCode: '97', Message: 'Checksum failed', data: vnp_Params };
        }
    }

    queryTransaction(queryData) {
        return new Promise((resolve, reject) => {
            process.env.TZ = 'Asia/Ho_Chi_Minh';
            let date = new Date();
            let vnp_TmnCode = VNP_TMNCODE;
            let secretKey = VNP_HASHSECRET;
            let vnp_Api = VNP_API;
            let vnp_TxnRef = queryData.orderId;
            let vnp_TransactionDate = queryData.transDate;
            let vnp_RequestId = moment(date).format('HHmmss');
            let vnp_Version = '2.1.0';
            let vnp_Command = 'querydr';
            let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
            let vnp_IpAddr = queryData.ipAddr;
            let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
            let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
            let hmac = crypto.createHmac("sha512", secretKey);
            let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");
            let dataObj = {
                'vnp_RequestId': vnp_RequestId,
                'vnp_Version': vnp_Version,
                'vnp_Command': vnp_Command,
                'vnp_TmnCode': vnp_TmnCode,
                'vnp_TxnRef': vnp_TxnRef,
                'vnp_OrderInfo': vnp_OrderInfo,
                'vnp_TransactionDate': vnp_TransactionDate,
                'vnp_CreateDate': vnp_CreateDate,
                'vnp_IpAddr': vnp_IpAddr,
                'vnp_SecureHash': vnp_SecureHash
            };
            request({
                url: vnp_Api,
                method: "POST",
                json: true,
                body: dataObj
            }, function (error, response, body) {
                if (error) {
                    reject({ error: 'Failed to query transaction', details: error });
                } else {
                    resolve(body);
                }
            });
        });
    }

    refund(refundData) {
        return new Promise((resolve, reject) => {
            process.env.TZ = 'Asia/Ho_Chi_Minh';
            let date = new Date();
            let vnp_TmnCode = VNP_TMNCODE;
            let secretKey = VNP_HASHSECRET;
            let vnp_Api = VNP_API;

            let vnp_TxnRef = refundData.orderId;
            let vnp_TransactionDate = refundData.transDate;
            let vnp_Amount = refundData.amount * 100;
            let vnp_TransactionType = refundData.transType;
            let vnp_CreateBy = refundData.user;
            let currCode = 'VND';


            let vnp_RequestId = moment(date).format('HHmmss');
            let vnp_Version = '2.1.0';
            let vnp_Command = 'refund';
            let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

            let vnp_IpAddr = refundData.ipAddr;

            let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
            let vnp_TransactionNo = '0'
            let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
            let hmac = crypto.createHmac("sha512", secretKey);
            let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");
            let dataObj = {
                'vnp_RequestId': vnp_RequestId,
                'vnp_Version': vnp_Version,
                'vnp_Command': vnp_Command,
                'vnp_TmnCode': vnp_TmnCode,
                'vnp_TransactionType': vnp_TransactionType,
                'vnp_TxnRef': vnp_TxnRef,
                'vnp_Amount': vnp_Amount,
                'vnp_TransactionNo': vnp_TransactionNo,
                'vnp_CreateBy': vnp_CreateBy,
                'vnp_OrderInfo': vnp_OrderInfo,
                'vnp_TransactionDate': vnp_TransactionDate,
                'vnp_CreateDate': vnp_CreateDate,
                'vnp_IpAddr': vnp_IpAddr,
                'vnp_SecureHash': vnp_SecureHash
            };
            request({
                url: vnp_Api,
                method: "POST",
                json: true,
                body: dataObj
            }, function (error, response, body) {
                if (error) {
                    reject({ error: 'Failed to process refund', details: error });
                } else {
                    resolve(body);
                }
            });
        });
    }
}

module.exports = new PaymentService(); 