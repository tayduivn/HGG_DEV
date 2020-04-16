import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';
/*
  Generated class for the UltilitiesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TourGuideService {

    constructor(public http: Http) {
        //console.log('Hello UltilitiesService Provider');
    }

    public Search(name = null, cardnumber = null, pageIndex): Observable<any> {
        var data = {
            "NAME": name,
            "CARD_NUMBER": cardnumber,
            "PAGE_SIZE": 10,
	        "PAGE_NUMBER": pageIndex,
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('TourGuide/GetList'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

}
