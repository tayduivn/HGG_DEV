import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';


@Injectable()
export class HobbyService {
    
    constructor(public http: Http) {
    }

    // public GetList() : Observable<any>{
    //     var data = {
    //         "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //         "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
    //     };
    //     return this.http.post(Services.ServerURL('Management/Hobby/GetList'), data, { headers: Services.ContentHeaders })
    //         .map(m => Services.extractResult(m));
    // }

    // public GetListFO() : Observable<any>{
    //     var data = {
    //         "Travel_Service_Type": "FO_SERVICE",
    //         "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //         "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
    //     };
    //     return this.http.post(Services.ServerURL('Management/Hobby/GetList'), data, { headers: Services.ContentHeaders })
    //         .map(m => Services.extractResult(m));
    // }

    public GetListFB() : Observable<any>{
        var data = {
            "CODE": "HOBBY",
            "VALUE" : "RESTAURANT",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
           // "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListTravel() : Observable<any>{
        var data = {
            "CODE": "HOBBY",
            "VALUE" : "TPLACE",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
           // "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }


}
