import { Coordinate } from "./location"

interface SuggestPlaceReqBody {
    coord: Coordinate,
    q: string
}

export { SuggestPlaceReqBody }