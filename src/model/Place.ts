import { PlaceImage } from "./PlaceImage";
import { PlaceService } from "./PlaceService";
import { PlacePoint } from "./PlacePoint";
import { PlacePointType } from "./PlacePointType";
import { PlaceProduct } from "./PlaceProduct";

export class Place {
    CODE: string;
    ID: number;
    GEO_LOCATION: string;
    ADDRESS: string;
    CITY_ID: number;
    PROVINCE_ID: number;
    NATION_ID: number;
    IMAGE: string;
    EMAIL: string;
    PHONE_NO: string;
    TYPE_ID: number;
    BANK_ID: number;
    BANK_NUMBER: string;
    STATUS: number;
    USE_APP: number;
    PORTAL_ID: number;
    CREATE_USER_ID: string;
    CREATE_DATE: Date;
    UPDATE_USER_ID: string;
    UPDATE_DATE: Date;
    FROM_AVG_PRICE: number;
    TO_AVG_PRICE: number;
    FB_URL: string;
    BUSINESS_ID: number;
    UNIT_ID: number;
    WARD_ID: number;
    OPEN_TIME: Date;
    CLOSE_TIME: Date;
    VISIT_TIME: number;
    BEST_FROM_TIME: Date;
    BEST_TO_TIME: Date;
    LANGUAGE_ID: string;
    NAME: string;
    NAME2: string;
    DESCRIPTION: string;
    CONTENT: string;
    TAG: string;
    TAX_CODE: string;
    GROUP_ID1: number;
    GROUP_ID2: number;
    GROUP_ID3: number;
    UNIT_CODE: string;
    COUNT_VIEW: number;
    COUNT_LIKE: number;
    TYPE_CODE: string;
    ALTITUDE: number;
    USE_SITE: boolean;
    SITE_ID: number;
    BUSINESS_CODE: string;
    ADMINISTRATOR_ID: string;
    PLACE_IMAGE: PlaceImage[];
    PLACE_SERVICE: PlaceService[];
    PLACE_POINT: PlacePoint[];
    PLACE_PRODUCT: PlaceProduct[];
    PLACE_POINT_TYPE1: PlacePointType[];
    URL_3D: string;
}