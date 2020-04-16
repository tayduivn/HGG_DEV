import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';
import { Parameter } from '../model/Service';
/*
  Generated class for the UltilitiesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UltilitiesService {

    constructor(public http: Http) {
        //console.log('Hello UltilitiesService Provider');
    }

    public GetPromotionList(): Observable<any> {
        var data = {
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('PlaceGuest/GetListPlaceByPromotion'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetTopLike(): Observable<any> {
        var data = {
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('PlaceGuest/GetListPlaceByTopLike'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListArea(locationLevel2: number): Observable<any> {
        var data = {
            "PARENT_ID": locationLevel2,
            "CODE": Parameter.searchLevel,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            //"SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('LocationApp/GetListLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListUtility() {
        var data = {
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetListTypeParent'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListChildUtility(id: number) {
        var data = {
            "PARENT_ID": id,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetListTypeChild'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListLocation(id: number, location: string) {
        var data = {
            "GOOGLE_LOCATION": location,
            "PARENT_ID": id,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetList'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetHotLineNumber() {
        var data = {
            "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetHotLine'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetUrlImage() {
        var data = {

        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetUrlImage'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetFanPage() {
        var data = {

        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetFanPage'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetShareLink(data) {
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetShareLink'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetCenterLocation() {
        var data = {

        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetCenterLocation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public SaveUserNote(id, type, content, location_type) {
        var data = {
            "Location_Id": id,
            "Location_Code": type,
            "Content": content,
            "Subject": "Note",
            "Language_Id": localStorage.getItem('currentLangauge'),
            "Location_Type": location_type
        };
        return this.http.post(Services.ServerURL('NoteGuest/SaveNote'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetUserNote(id, type, location_type) {
        var data = {
            "Location_Id": id,
            "Location_Code": type,
            "Language_Id": localStorage.getItem('currentLangauge'),
            "Location_Type": location_type
        };
        return this.http.post(Services.ServerURL('NoteGuest/GetNote'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetLocationByNote(googlelocation) {
        var data = {
            "language_id": "vi",
            "google_location": googlelocation
        };
        return this.http.post(Services.ServerURL('NoteGuest/GetLocationByNote'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public CalcExchangeRates(Input, CurrencyCode, IsToVN) {
        var data = {
            "Input": Input,
            "CurrencyCode": CurrencyCode,
            "IsToVN": IsToVN
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/ExchangeRates'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetListExchangeRates() {
        var data = {};
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetExchangeRates'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    getVersion() {
        var data = {
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetAppVersion'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetReviewByObject(id, code, type) {
        var data = {
            "ID": id,
            "CODE": code,
            "TYPE": type
        };
        return this.http.post(Services.ServerURL('PlaceGuest/GetReviewByObject'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public SaveReview(id, code, type, content, rate) {
        var data = {
            "Id": id,
            "Code": code,
            "Content": content,
            "Subject": "Review",
            "Type": type,
            "Rate": rate
        };
        return this.http.post(Services.ServerURL('PlaceGuest/SaveReview'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    getInfoContact() {
        var data = {
            LanguageId: localStorage.getItem("currentLangauge")
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetSigSysparamCode'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    GetUtilityID(code) {
        var data = {
            CODE: code,
            LanguageId: localStorage.getItem("currentLangauge")
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetUtilityID'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    GetListField() {
        var data = {
            LanguageId: localStorage.getItem("currentLangauge")
        };
        return this.http.post(Services.ServerURL('ComplaintGuest/GetFields'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
}
