import { Location } from "./models";

interface LocationState {
    location?: Location;
    hasLocationPermission: boolean;
    isLoading: boolean;
    error?: string;
}


interface LocationContextType extends LocationState {
    requestLocationPermission: () => Promise<boolean>;
    getCurrentLocation: () => Promise<Location | null>;
}

export { LocationContextType, LocationState }