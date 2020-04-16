import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';


@Injectable()
export class EventService {
    
    constructor(public http: Http) {
    }

    public GetList(pageSize: number = 10, pageNumber: number = 1) : Observable<any>{
        var data = {
            "Page_Size": pageSize,
            "Page_Number": pageNumber,
            "Language_Id": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('NewsGuest/GetListPageNews'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    //nvt
    public GetListByCode(code ,pageSize: number = 10, page_index: number = 1) : Observable<any>{
        var data = {
            "PAGE_SIZE": pageSize,
            "PAGE_NUMBER": page_index,
            "CODE": code,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('NewsGuest/GetListPageNewsByCode'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetListTopNews(top: number = 5) : Observable<any>{
        var data = {
            "TOP": top,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('NewsGuest/GetListTopNews'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public GetDetail(id) : Observable<any>{
        var data = {
            "News_Id": id,
            "Language_Id": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('NewsGuest/GetSingle'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    public GetDetailH(id: number, code: string) : Observable<any>{
        var data = {
            "ID": id,
            "CODE": code,
            "Language_Id": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('NewsGuest/GetSingle'), data, { headers: Services.ContentHeaders })
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

    public GetListSeparatedLC(code) {
        var data = {
            "CODE": code,
            "Language_Id": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('NewsGuest/GetListPageSeparatedLC'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
}
