interface Coordinate {
    lat: number,
    lng: number
}

interface Location {
    title: string;
    address: string;
    coord: Coordinate
}

interface MapLocation extends Location {
    id: string;
    distance?: number;
}


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

export {
    LocationContextType, LocationState, MapLocation,
    Coordinate, Location
};