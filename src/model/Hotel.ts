import { RoomPrice } from "./RoomPrice";
import { HotelService } from "./HotelService";

import { HotelImage } from "./HotelImage";
import { HotelConvenient } from "./HotelConvenient";
import { RoomImage } from "./RoomImage";
import { RoomService } from "./RoomService";

export class Hotel {
    Hotel_Id: number;
    Hotel_Name: string;
    Address: string;
    Phone: string;
    Email: string;
    Tax_Code: string;
    Hotel_Type: number;
    Hotel_Description: string;
    Policy: string;
    Google_Location: string;
    Hotel_Note: string;
    Use_App: number;
    Location_Id: number;
    Location_Name: number;
    Avg_Price: number;
    Rate: number;
    Group_Id: number;
    Room_Price: RoomPrice[];
    Hotel_Service: HotelService[];
    Hotel_Image: HotelImage[];
    Hotel_Convenient: HotelConvenient[];
    Room_Image: RoomImage[];
    Room_Service: RoomService[];
    Total_Bookmark: number;
    Url_3D: string;
}