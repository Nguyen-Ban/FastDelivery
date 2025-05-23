// components/OrderListener.tsx
import { useEffect } from "react";
import { useSocketDriver } from "../contexts/socker.driver.context";
import { useOrderDriver } from "@/contexts/order.driver.context";

export const OrderDriverListener = () => {
  const { socket } = useSocketDriver();
  const { setHasOrder, setPickupDropoffDistance, setDriverPickupDistance,
    setOrderMain, setOrderDetail, setOrderLocation, setOrderSenderReceiver,
    setOrderSpecialDemand, setDriverPickupPolyline, setOrderId } = useOrderDriver();

  useEffect(() => {
    if (!socket) return;
    console.log("🚚 OrderListener mounted");

    const onRequest = (response: any) => {
      console.log("🚚 Order request:", response.data);
      if (response.success) {
        const data = response.data;
        setHasOrder(true);
        setPickupDropoffDistance(data.pickupDropoffDistance);
        setDriverPickupDistance(data.driverPickupDistance);
        setOrderMain(data.orderMain);
        setOrderDetail(data.orderDetail);
        setOrderLocation(data.orderLocation);
        setOrderSenderReceiver(data.orderSenderReceiver);
        setOrderSpecialDemand(data.orderSpecialDemand);
        setDriverPickupPolyline(data.driverPickupPolyline);
      }
    };

    socket.on("order:request", onRequest);

    socket.on('order:create', (response: any) => {
      console.log("🚚 Order created:", response.data);
      if (response.success) {
        const data = response.data;
        setOrderId(data.orderId);
      }
    });

    return () => {
      socket.off("order:request", onRequest);
    };
  }, [socket]);

  return null;
};
