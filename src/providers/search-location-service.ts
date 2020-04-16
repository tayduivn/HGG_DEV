import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';
import { Service, Parameter } from '../model/Service';

/*
  Generated class for the SearchLocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SearchLocationService {

    constructor(public http: Http) {
        //console.log('Hello SearchLocationService Provider');
    }

    public SearchByCondition(distance: number = 1000, lattitude: number, longitude: number, Hobby: any[], Service: any[], Rate: String, Price: String, LocationType: any[], page_size = null, page_index = null): Observable<any> {
        var data = {
            "distance": distance/1000,
            "geo": lattitude + "," + longitude,
            "lhobbies": this.arrayToString(Hobby),
            "lservices": this.arrayToString(Service),
            "placeName": null,
            "Rate": Rate,
            "Price": Price,
            "locationType": this.arrayToString(LocationType),
            "page_size": page_size,
            "pageIndex": page_index,
            // "location_level3": null,
            "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        //console.log(data);
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public SearchByName(name: String): Observable<any> {
        var data = {
            // "Distance_x": null,
            // "Google_Location": null,
            // "Hobby": null,
            // "Service": null,
            "placeName": name,
            // "Rate": null,
            // "Price": null,
            // "Location_Type": null,
            // "location_level3": null,
            "locationType": "HOTEL,RESTAURANT,TPLACE,SHOP,ENTERTAINMENT",
            "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public SearchByNameDistance(name: String, Google_Location): Observable<any> {
        var data = {
            "distance": "75000000",
            "geo": Google_Location,
            "Name": name,
            "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào            
            // "Hobby": null,
            // "Service": null,
            // "Rate": null,
            // "Price": null,
            // "Location_Type": null,
            // "location_level3": null,
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('Booking/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public SearchByType(typeId: string, Google_Location, page_size, page_index, hotel_type): Observable<any> {
        var data = {
            "distance": "75000000",
            "geo": Google_Location,
            // "Hobby": null,
            // "Service": null,
            // "Name": null,
            // "Rate": null,
            // "Price": null,
            "locationType": typeId,
            // "location_level3": null,
            "page_size": page_size,
            "pageIndex": page_index,
            "ltypes": hotel_type,
            "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public SearchByTypeAndServices(typeId: string, Google_Location, page_size, page_index, hotel_type,serviceArray: any[]): Observable<any> {
        var data = {
            "distance": "75000000",
            "geo": Google_Location,
            // "Hobby": null,
            // "Service": null,
            // "Name": null,
            // "Rate": null,
            // "Price": null,
            "locationType": typeId,
            "lservices": this.arrayToString(serviceArray),
            // "location_level3": null,
            "page_size": page_size,
            "pageIndex": page_index,
            "ltypes": hotel_type,
            "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public SearchByNameAndType(name: string, typeId: string, pageIndex, page_size): Observable<any> {
        var data = {
            "distance": null,
            "geo": null,
            "Hobby": null,
            "Service": null,
            "Name": name,
            "Rate": null,
            "Price": null,
            "Location_Type": typeId,
            "location_level3": null,
            "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        if(typeId == "map") {
            typeId = "HOTEL,SHOP,RESTAURANT,TPLACE,ENTERTAINMENT";
        }
        var data1 = {
            "placeName": name,
            "lservices": null,
            "ltypes": null,
            "lhobbies": null,
            "geo": null,
            "page_size": page_size,
            "pageIndex": pageIndex,
            "sortType": null,
            "priceFrom": null,
            "priceTo": null,
            "rateFrom": null,
            "rateTo": null,
            "distance": null,
            "locationType": typeId,
            "lang": localStorage.getItem('currentLangauge'),
            "portalCode": null,
            "sortComment": null,
            "sortLike": "vi"
        }
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data1, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public SearchForPlan(name: string, typeId: number/*, locationLevel2: any*/, page_size, page_index): Observable<any> {
        var data = {};
        /*if(locationLevel2 == -1 || locationLevel2 == "-1") {
            locationLevel2 = null;
        }*/
        if (typeId == null) {
            data = {
                "placeName": name,
                "locationType": "TPLACE,RESTAURANT,SHOP",
                "page_size": page_size,
                "pageIndex": page_index,
                /*"location_level2": locationLevel2,*/
                "lang": localStorage.getItem('currentLangauge')
            };
        } else {
            data = {
                "placeName": name,
                "locationType": typeId,
                "page_size": page_size,
                "pageIndex": page_index,
                /*"location_level2": locationLevel2,*/
                "lang": localStorage.getItem('currentLangauge')
            };
        }
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public SearchByNameAndTypeDistance(name: string, typeId: string, Google_Location, pageIndex, page_size): Observable<any> {
        var data = {
            "distance": "75000000",
            "geo": Google_Location,
            "lhobbies": null,
            "lservices": null,
            "placeName": name,
            "rateFrom": null,
            "locationType": typeId,
            "page_size": page_size,
            "pageIndex": pageIndex,
            "lang": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public SearchByFilterBar(locationType: any[], locationLevel2: any[], priceRange: string, hobbyArray: any[], serviceArray: any[]): Observable<any> {
        var data = {
            "Distance_x": null,
            "Google_Location": null,
            "Hobby": this.arrayToString(hobbyArray),
            "Service": this.arrayToString(serviceArray),
            "Name": null,
            "Rate": null,
            "Price": priceRange,
            "location_type": this.arrayToString(locationType),
            "location_level3": null,
            "location_level2": this.arrayToString(locationLevel2),
            "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        if(Parameter.searchLevel == "WARD") {
            data = {
                "Distance_x": null,
                "Google_Location": null,
                "Hobby": this.arrayToString(hobbyArray),
                "Service": this.arrayToString(serviceArray),
                "Name": null,
                "Rate": null,
                "Price": priceRange,
                "location_type": this.arrayToString(locationType),
                "location_level3": this.arrayToString(locationLevel2),
                "location_level2": null,
                "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
                "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
            };
        }
            
        return this.http.post(Services.ServerURL('Booking/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public SearchByFilterBarDistance(locationType: any[], locationLevel2: any[], priceRange: string, hobbyArray: any[], serviceArray: any[], Google_Location, page_size, page_index, shop_type, hotel_type): Observable<any> {
        var data = {
            "distance": "75000000",
            "geo": Google_Location,
            "lhobbies": this.arrayToString(hobbyArray),
            "lservices": this.arrayToString(serviceArray),
            "placeName": null,
            "Rate": null,
            "Price": priceRange,
            "locationType": this.arrayToString(locationType),
            "location_level3": null,
            "location_level2": this.arrayToString(locationLevel2),
            // "shop_type_id": shop_type,
            "ltypes": hotel_type != null ? "" + hotel_type : null,
            "page_size": page_size,
            "pageIndex": page_index,
            "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        if(Parameter.searchLevel == "WARD") {
            data = {
                "distance": "75000000",
                "geo": Google_Location,
                "lhobbies": this.arrayToString(hobbyArray),
                "lservices": this.arrayToString(serviceArray),
                "placeName": null,
                "Rate": null,
                "Price": priceRange,
                "locationType": this.arrayToString(locationType),
                "location_level3": this.arrayToString(locationLevel2),
                "location_level2": null,
                // "shop_type_id": shop_type,
                "ltypes": hotel_type != null ? "" + hotel_type : null,
                "page_size": page_size,
                "pageIndex": page_index,
                "lang": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
                //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
            };
        }
        return this.http.post(Services.ServerURL('GeneralGuest/SearchLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    private arrayToString(arr: any[]): string {
        if (arr.length > 0) {
            var str = "";
            if (arr.length > 1) {
                for (var index = 0; index < arr.length - 1; index++) {
                    str += arr[index] + ",";
                }
            }
            str += arr[arr.length - 1];
            return str;
        } else {
            return null;
        }
    }

    public saveWishList(obId: number, obType: number): Observable<any> {
        var data = {
            "PLACE_ID": obId,
            "PLACE_CODE": obType,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UserBookmarkGuest/InsertBookmark'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public saveWishListH(obId: number, obType: string, type: string): Observable<any> {
        var data = {
            "ID": obId,
            "CODE": obType,
            "TYPE": type,
            "SUBJECT": "subject",
            "CONTENT": "content",
        };
        return this.http.post(Services.ServerURL('PlaceGuest/SaveWishList'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
        
    }

    public removeSaveWishList(bookId: number): Observable<any> {
        var data = {
            "book_id": bookId,
            "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UserBookmarkGuest/DeleteBookmark'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }


    public removeSaveWishListH(obId: number, obType: string, code: string): Observable<any> {
        var data = {
            "ID": obId,
            "CODE": obType,
            "TYPE": code
        };
        return this.http.post(Services.ServerURL('PlaceGuest/RemoveSaveWishList'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

}
