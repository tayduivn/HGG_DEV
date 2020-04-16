import { Injectable,  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services';
import 'rxjs/add/operator/map';

/*
  Generated class for the HotelService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HotelService {

    constructor(public http: Http) {
        //console.log('Hello HotelService Provider');
    }

    public GetHotelInfo(id: number, code: string): Observable<any> {
        var data = {
            "ID": id,
            "CODE": code,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('PlaceGuest/GetPlaceInfo'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetRoomFormat() {
        var data = {
            "CODE": 'RKIND', // luôn luôn phải có với bất cứ api nào
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetRoomType() {
        var data = {
            "CODE": 'RTYPE', // luôn luôn phải có với bất cứ api nào
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public pushHotel(model:any, app_id: any) {
        var fPrice = null;
        var tPrice = null;
        var prices = model.price.split("-");
        if(prices.length == 2){
            fPrice = prices[0];
            tPrice = prices[1];
        }

        var data = {
            APP_ID: app_id,
            LANGUAGE_ID: localStorage.getItem('currentLangauge'),
            PLACE_CODE: "HOTEL",
            UNIT_CODE: localStorage.getItem('PortalCode'),
            // ObjectTypeId: 1,
            START_DATE: model.checkin,
            END_DATE:  model.checkout,
            FROM_AVG_PRICE : fPrice,
            TO_AVG_PRICE: tPrice,
            NAME: model.name,
            EMAIL: model.email,
            PHONE: model.telephone,
            ROOM_TYPE_NAME: model.roomTypeName,
            ROOM_TYPE: model.roomType,
            ROOM_FORMAT_NAME: model.roomFormatName,
            ROOM_FORMAT: model.roomFormat,
            ROOM_QUANTITY: model.roomQuantity,
            DISTANCE: model.distance,
            GEO_LOCATION: model.location,
            QUICKBOOKING: true
        };
        return this.http.post(Services.ServerURL('BookingGuest/QuickBooking'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public BookingHotel(
        booking_name: string,
        total_money: number,
        service_price: number,
        tour_id: number,
        booking_type: number,
        guest_name: string,
        guest_phone: string,
        guest_email: string,
        guest_location_level1: 0,
        guest_nationality: 0,
        guest_note: string,
        from_date: string,
        room_format: number,
        price: 0,
        to_date: string,
        numbers_room: number,
        hotel_id: number,
        status: 1,
        room_type: number,
        use_app: number) {
        var data = {
            "booking_name": booking_name,
            "total_money": total_money,
            "service_price": service_price,
            "tour_id": tour_id,
            "booking_type": booking_type,
            "guest_name": guest_name,
            "guest_phone": guest_phone,
            "guest_email": guest_email,
            "guest_location_level1": guest_location_level1,
            "guest_nationality": guest_nationality,
            "guest_note": guest_note,
            "from_date": from_date,
            "room_type": room_type,
            "price": price,
            "to_date": to_date,
            "numbers_room": numbers_room,
            "hotel_id": hotel_id,
            "status": status,
            "room_format": room_format,
            "use_app": use_app,
            "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('Booking/InsertBooking'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetRoomAV(datefrom, dateto, hotelID, roomTypeID, roomFormatID) {
        var data = {
            "FDate": datefrom,
            "TDate": dateto,
            "Hotel_Portal_ID": hotelID.toString(),
            "Room_Format_ID": parseInt(roomFormatID),
            "Room_Type_ID": parseInt(roomTypeID),
            "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        //console.log(data);
        return this.http.post(Services.ServerURL('Booking/GetRoomAv'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public checkBookMark(id, code, type) {
        var data = {
            "ID":id,
            "CODE":code,
            "TYPE": type
        };
        return this.http.post(Services.ServerURL('PlaceGuest/CheckBookmark'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public getHotelType() {
        var data = {
            "CODE": "HTYPE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }   
    public getEntertainmentType() {
        var data = {
            "CODE": "ETYPE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetRoomAndFormatByHotelID(hotelId) {
        var data = {
            "hotel_id": hotelId,
            "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('Hotel/GetHoTelTypeAndFormat'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
}
