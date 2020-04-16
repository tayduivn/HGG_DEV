import { BookingDetail } from "./BookingDetail";

export class Booking {
    Booking_Id: number;
    Status: number;
    Date_Created: string;
    Booking_Code: string;
    Booking_Name: string;
    Total_Money: number;
    User_Created: number;
    Service_Price: number;
    Tour_Id: number;
    Booking_Type: number;
    Voided: number;
    Guest_Name: string;
    Guest_Phone: string;
    Guest_Email: string;
    Guest_Location_Level1: number;
    Guest_Nationality: number;
    Guest_Note: string;
    Detail: BookingDetail;
}