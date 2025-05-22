// components/OrderListener.tsx
import { useEffect } from "react";
import { useSocketDriver } from "../contexts/socker.driver.context";
import { useOrderDriver } from "@/contexts/order.driver.context";

export const OrderListener = () => {
  const { socket } = useSocketDriver();
  const { setHasOrder, setPickupDropoffDistance, setDriverPickupDistance,
    setOrderMain, setOrderDetail, setOrderLocation, setOrderSenderReceiver, setOrderSpecialDemand, setPolyline } = useOrderDriver();

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
        setPolyline(data.polyline);
      }
    };

    socket.on("order:request", onRequest);

    return () => {
      socket.off("order:request", onRequest);
    };
  }, [socket]);

  return null;
};
