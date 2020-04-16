import { PlacePointImage } from "./PlacePointImage";
import { PlacePointService } from "./PlacePointService";
export class PlacePoint {
    PLACE_CODE: string;
    PLACE_ID: number;
    ID: number;
    AREA_ID: number;
    TYPE_ID: number;
    KIND_ID: number;
    NAME: string;
    DESCRIPTION: string;
    STATUS: number;
    CREATE_USER_ID: string;
    CREATE_DATE: Date;
    UPDATE_USER_ID: string;
    UPDATE_DATE: Date;
    PRICE: number;
    LANGUAGE_ID: string;
    IMAGE_URL: string;
    PLACE_POINT_IMAGE: PlacePointImage[];
    PLACE_POINT_SERVICE: PlacePointService[];
    
}