import { Coordinate } from "./models";

interface SuggestPlaceReqBody {
    coord: Coordinate,
    q: string
}

export { SuggestPlaceReqBody }