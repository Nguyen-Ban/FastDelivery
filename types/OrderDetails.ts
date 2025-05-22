import type { PACKAGE_TYPES } from "@/constants/PackageTypes";

interface SenderReceiver {
    name: string;
    phoneNumber: string;
}

interface GoodsDetails {
    packageType: PACKAGE_TYPES | null;
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    sizeName?: string | null;
}

interface SpecialDemands {
    handDelivery?: boolean;
    fragileDelivery?: boolean;
    donateDriver?: number;
    homeMoving?: boolean;
    loading?: boolean;
    businessValue?: number;
    eDocument?: boolean;
    waiting?: boolean;
}

export type { SenderReceiver, GoodsDetails, SpecialDemands };
