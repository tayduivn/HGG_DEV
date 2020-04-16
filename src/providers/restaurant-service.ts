import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';


@Injectable()
export class RestaurantService {
    
    constructor(public http: Http) {
    }

    public GetRestaurantInfo(id: number, code:string) : Observable<any>{
        var data = {
            "ID": id,
            "CODE": code,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        //console.log(data);
        return this.http.post(Services.ServerURL('PlaceGuest/GetPlaceInfo'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public BookingRestaurant(
        booking_name: string,
        booking_type: 2,
        tour_id: 0,
        booking_date: string,
        restaurant_id: number,
        adult: number,
        booking_time: string,
        status: 1,
        note: string,
        service_price: number,
        total_money: number,
        price: number,
        guest_name: string,
        guest_phone: string,
        guest_email: string,
        guest_note: string,
        guest_location_level1: 0,
        guest_nationality: 0,
        use_app: number
    ) : Observable<any>{
        var data = {
            "booking_name": booking_name,
            "booking_type": booking_type,
            "tour_id": tour_id,
            "booking_date": booking_date,
            "restaurant_id": restaurant_id,
            "adult": adult,
            "booking_time": booking_time,
            "status": status,
            "note": note,
            "service_price": service_price,
            "total_money": total_money,
            "price": price,
            "guest_name": guest_name,
            "guest_phone": guest_phone,
            "guest_email": guest_email,
            "guest_note": guest_note,
            "guest_location_level1": guest_location_level1,
            "guest_nationality": guest_nationality,
            "use_app": use_app,
            "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('Booking/InsertBooking'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    // public checkBookMark(resId) {
    //     var data = {
    //         "object_id":resId,
    //         "object_type":2,
    //         "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //         "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
    //     };
    //     return this.http.post(Services.ServerURL('Bookmark/CheckBookmark'), data, { headers: Services.ContentHeaders })
    //         .map(m => Services.extractResult(m));
    // }
    public checkBookMark(id, code, type) {
        var data = {
            "ID":id,
            "CODE":code,
            "TYPE": type
        };
        return this.http.post(Services.ServerURL('PlaceGuest/CheckBookmark'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetPromotionbyPlace(id: number, code:string) : Observable<any>{
        var data = {
            "ID": id,
            "CODE": code,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('PlaceGuest/GetPromotionbyPlace'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
}
