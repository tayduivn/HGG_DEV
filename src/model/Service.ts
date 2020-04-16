
export class Service {
    Travel_Service_Id: number;
    Travel_Service_Type: string;
    User_Created: number;
    Travel_Service_Icon: string;
    Travel_Service_Location: string;
    Travel_Service_Name: string;
    Travel_Service_Description: string;
    Service_Level: string;
    Language_Id: string;
}

export class Parameter {
    /**
     * xxx
     */
    static portalifier: number = 25;
    static portalcode: string = "HGG";
    static weather: string = "1252420";
    static cityName_VN: string = "Hà Giang";
    static cityName_EN: string = "Ha Giang";
    // static appstorify: string = "1240096481";
    static planLevel: string = "PROVINCE";
    static searchLevel: string = "CITY";
    static getCamKey: string = "GET_MAP";
    static useGT: boolean = true;
    static useVD: boolean = false;
}