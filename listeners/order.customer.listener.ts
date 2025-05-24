// components/OrderListener.tsx
import { useOrder } from "@/contexts/order.context";
import { useSockerCustomer } from "@/contexts/socker.customer.context";
import { useEffect } from "react";


export const OrderCustomerListener = () => {
  const { socket } = useSockerCustomer();
  const { setDriverInfo, setOrderId, setDriverFound } = useOrder();

  useEffect(() => {
    if (!socket) return;
    console.log("🚚 OrderListener mounted");

    const onRequest = (response: any) => {
      console.log("🚚 Order created:", response.data);
      if (response.success) {
        const data = response.data;
        setDriverInfo(data.driverInfo);
        setOrderId(data.orderId);
        setDriverFound(true);
      }
    };

    socket.on("order:create", onRequest);


    return () => {
      socket.off("order:create", onRequest);
    };
  }, [socket]);

  return null;
};
