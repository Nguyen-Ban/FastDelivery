// components/OrderListener.tsx
import { useEffect } from "react";
import { useSocketDriver } from "../contexts/socker.driver.context";
import { useOrderDriver } from "@/contexts/order.driver.context";

export const OrderListener = () => {
  const { socket } = useSocketDriver();
  const { setHasOrder, setPickupDropoffDistance, setDriverPickupDistance, setPrice, setPickupLocation, setDropoffLocation, setPackageDetails } = useOrderDriver();

  useEffect(() => {
    if (!socket) return;
    console.log("🚚 OrderListener mounted");

    const onRequest = (response: any) => {
      console.log("🚚 Order request:", response.data.pickupDropoffDistance);
      if (response.success) {
        const data = response.data;
        setHasOrder(true);
        setPickupDropoffDistance(data.pickupDropoffDistance);
        setDriverPickupDistance(data.driverPickupDistance);
        setPrice(data.price);
        setPickupLocation(data.pickupLocation);
        setDropoffLocation(data.dropoffLocation);
        setPackageDetails(data.packageDetails);

      }
    };

    socket.on("order:request", onRequest);

    return () => {
      socket.off("order:request", onRequest);
    };
  }, [socket]);

  return null;
};
