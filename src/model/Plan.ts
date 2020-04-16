import { PlanDetail } from "./PlanDetail";
export class Plan {
    TOUR_ID: number;
    TOUR_NAME: string;
    LOCATION_ID: number;
    TOTAL_NUMBER_DAY: number;
    F_TOTAL: number;
    T_TOTAL: number;
    LIST_HOBBY: string;
    STATUS: number;
    IS_SHARE: number;
    VOIDED: number;
    DATE_CREATE: string;
    USER_TOUR_ID: number;
    TOUR_TYPE_ID: number;
    LIST_PLACE_OF_TOUR_IN_DAY: PlanDetail[];
}