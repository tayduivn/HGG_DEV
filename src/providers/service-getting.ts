import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';


@Injectable()
export class ServiceGetting {
    
    constructor(public http: Http) {
    }

    public GetListFO() : Observable<any>{
        var data = {
            "CODE": "HSERVICE", // khách sạn(nghỉ ngơi)
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListServiceType'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetListFB() : Observable<any>{
        var data = {
            "CODE": "RSERVICE", // dịch vụ nhà hàng
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListServiceType'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    
    public GetListTravel() : Observable<any>{
        var data = {
            "CODE": "TPSERVICE", // dịch vụ địa điểm
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListServiceType'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListTravelCategory() : Observable<any>{
        var data = {
            "CODE": "TPTYPE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetListEntertainmentCategory() : Observable<any>{
        var data = {
            "CODE": "ETYPE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetLisNightLifife() : Observable<any>{
        var data = {
            "CODE": "NIGHTLIFE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListServiceType'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListRestaurantCategory() : Observable<any>{
        var data = {
            "CODE": "RESTYPE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), 
            //"SessionCode": localStorage.getItem('SessionCode') 
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
}
