import { PlacePointTypeImage } from "./PlacePointTypeImage";
import { PlacePointTypeService } from "./PlacePointTypeService";
export class PlacePointType {
    PLACE_CODE: string;
    PLACE_ID: number;
    ID: number;
    NAME: number;
    AREA_ID: number;
    TYPE_ID: number;
    KIND_ID: number;
    CONTENT: string;
    DESCRIPTION: string;
    STATUS: number;
    CREATE_USER_ID: string;
    CREATE_DATE: Date;
    UPDATE_USER_ID: string;
    UPDATE_DATE: Date;
    AVG_PRICE: number;
    LANGUAGE_ID: string;
    IMAGE_URL: string;
    PLACE_POINT_TYPE_IMAGE: PlacePointTypeImage[];
    PLACE_POINT_TYPE_SERVICE: PlacePointTypeService[];
    
}