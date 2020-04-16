import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';
import { Parameter } from '../model/Service';


@Injectable()
export class PlanService {
    
    constructor(public http: Http) {
    }

    public GetPlanListByCondition(LOCATION_ID: number, NUM_OF_DAY: number, FORM_TOTAL: number, TO_TOTAL: number, LIST_HOBBY: any[], TOUR_TYPE_ID = 1) : Observable<any>{
       var data = {
            "LOCATION_ID":LOCATION_ID.toString(),
            "LOCATION_CODE": Parameter.planLevel,
            "numberDay":NUM_OF_DAY.toString(),
            // "FROM_TOTAL":FORM_TOTAL.toString(),
            // "TO_TOTAL":TO_TOTAL.toString(),
            "hobbyTour": LIST_HOBBY,
            "RATE":null,
            "tourType" : TOUR_TYPE_ID,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('TourApp/GetListToursApp'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetSuggestTour(LOCATION_ID: number, NUM_OF_DAY: number, FORM_TOTAL: number, TO_TOTAL: number, LIST_HOBBY: any[], TOUR_TYPE_ID = 1) : Observable<any>{
         var data = {
            "LOCATION_ID":LOCATION_ID.toString(),
            "LOCATION_CODE": Parameter.planLevel,
            "NUM_OF_DAY":NUM_OF_DAY.toString(),
            "FROM_TOTAL":FORM_TOTAL,
            "TO_TOTAL":TO_TOTAL,
            "LIST_HOBBY": this.arrayToString(LIST_HOBBY),
            "RATE":null,
            "TOUR_TYPE_ID" : TOUR_TYPE_ID,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        //console.log(data);
        return this.http.post(Services.ServerURL('TourApp/GetSuggestTourApp'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    private arrayToString (arr: any[]): string {
        if(arr.length > 0) {
            var str = "";
            if(arr.length > 1) {
                for (var index = 0; index < arr.length - 1; index++) {
                str += arr[index] + ",";
                }
            }
            str += arr[arr.length - 1];
            return str;
        } else {
            return "";
        }
    }

    public CreateTour (
        // TOUR_ID: number, 
        TOUR_NAME: string, 
        LOCATION_ID: number, 
        NUM_OF_DAY: number,
        FORM_TOTAL: number, 
        TO_TOTAL: number,
        LIST_HOBBY,
        IS_SHARE: number,
        LIST_DETAIL: any[],
        FROM_DATE: string,
        TO_DATE: string,
        TOUR_TYPE_ID = 1,
        listCheckTour: any[]
        // DATE_CREATE: string
    ): Observable<any> {
        var data = {
            "tourId": 0,
            // "USER_TOUR_ID": USER_TOUR_ID,
            "name": TOUR_NAME,
            // "LOCATION_ID": "607",
            "checkTour": listCheckTour,
            "NUMBER_OF_DAY": NUM_OF_DAY,
            "hobby": LIST_HOBBY,
            "data": LIST_DETAIL,
            "fromDate": FROM_DATE,
            "tourType" : TOUR_TYPE_ID,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        
        //console.log(data);
        // return this.http.post(Services.ServerURL('f'), data, { headers: Services.ContentHeaders })
        //     .map(m => Services.extractResult(m));
        return this.http.post(Services.ServerURL('TourApp/CreateOrUpdateTour'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
    }

    public GetListTourByUser() {
        var data = {
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('TourApp/GetListTourByUserLoginApp'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
    }
    
    public GetTourById(id: number) {
        var data = {
            "ID": id,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('TourApp/DetailTourApp'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
    }

    public PlanDetailEdit(tourId: number, TOUR_NAME: string, NUM_OF_DAY, FORM_TOTAL, TO_TOTAL, LIST_HOBBY, RATE, IS_SHARE, USER_TOUR_ID, FROM_DATE, TO_DATE, LIST_DETAIL: any[], TOUR_TYPE_ID = 1, listCheckTour: any[]) {
        // console.log(tourId);console.log(day);console.log(listdetail);
        var data = {
            "tourId": tourId.toString(),
            // "USER_TOUR_ID": USER_TOUR_ID,
            "name": TOUR_NAME,
            // "LOCATION_ID": "607",
            "checkTour": listCheckTour,
            "NUMBER_OF_DAY": NUM_OF_DAY,
            "hobby": LIST_HOBBY == null || LIST_HOBBY == undefined ? "" : LIST_HOBBY,
            "data": LIST_DETAIL,
            "fromDate": FROM_DATE,
            "tourType" : TOUR_TYPE_ID,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        //console.log(data);
        return this.http.post(Services.ServerURL('TourApp/CreateOrUpdateTour'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
    }
    // public PlanDetailEditOneDay(tourId: number, DAY: string, LIST_DETAIL: any[]) {
    //     // console.log(tourId);console.log(day);console.log(listdetail);
    //     var data = {
    //         "TOUR_ID": tourId.toString(),
    //         "DAY": DAY,
    //         "LIST_DETAIL": LIST_DETAIL,
    //         "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //         "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
    //     };
    //     console.log(data);
    //     return this.http.post(Services.ServerURL('SearchEngine/SearchTour/EditTourDetail'), data, { headers: Services.ContentHeaders })
    //     .map(m => Services.extractResult(m));
    // }

    // public DeleteDayDetail(tourId: number, daydetailid: number) {
    //     var data = {
    //         "TOUR_ID" : tourId.toString(),
    //         "TOUR_DETAIL_ID": daydetailid.toString(),
    //         "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //         "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
    //     };
    //     console.log(data);
    //     return this.http.post(Services.ServerURL('SearchEngine/SearchTour/DeleteTourDetail'), data, { headers: Services.ContentHeaders })
    //     .map(m => Services.extractResult(m));
    // }

    // public MapTour(tourId: number, FROM_DATE, TO_DATE) {
    //     var data = {
    //         "TOUR_ID" : tourId.toString(),
    //         "FROM_DATE": FROM_DATE,
    //         "TO_DATE": TO_DATE,
    //         "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //         "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
    //     };
    //     console.log(data);
    //     return this.http.post(Services.ServerURL('SearchEngine/SearchTour/AddTourToUser'), data, { headers: Services.ContentHeaders })
    //     .map(m => Services.extractResult(m));
    // }
    public ShareTour(tourId: number, shareStatus: number) {
        var data = {
            "ID": tourId.toString(),
            "IS_SHARE": shareStatus.toString(),
            "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        //console.log(data);
        return this.http.post(Services.ServerURL('TourApp/ToggleShareOrUnsharePlanApp'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
    }

    // public GetTourLocation() {
    //     var data = {
    //     };
    //     console.log(data);
    //     return this.http.post(Services.ServerURL('SearchEngine/SearchTour/GetTourLocation'), data, { headers: Services.ContentHeaders })
    //     .map(m => Services.extractResult(m));
    // }

    public DeleteTour(id) {
        var data = {
            "TOUR_ID": id,
        };
        return this.http.post(Services.ServerURL('TourApp/DeleteTour'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
    }
}
