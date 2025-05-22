

interface LocationPoint {
    title: string;
    address: string;
    position: Position | null;
}

interface Position {
    lat: number;
    lng: number;
}

export type { LocationPoint, Position };
