import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';

/*
  Generated class for the SightSeeingService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SightSeeingService {

  constructor(public http: Http) {
    //console.log('Hello SightSeeingService Provider');
  }

  public GetRestaurantInfo(id: number, code: string): Observable<any> {
    var data = {
      "ID": id,
      "CODE": code,
      "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    };
    //console.log(data);
    return this.http.post(Services.ServerURL('PlaceGuest/GetPlaceInfo'), data, { headers: Services.ContentHeaders })
      .map(m => Services.extractResult(m));
  }

  //   public checkBookMark(seeId) {
  //       var data = {
  //           "object_id":seeId,
  //           "object_type":3,
  //           "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
  //           "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
  //       };
  //       return this.http.post(Services.ServerURL('Bookmark/CheckBookmark'), data, { headers: Services.ContentHeaders })
  //           .map(m => Services.extractResult(m));
  //   }
  public checkBookMark(id, code, type) {
    var data = {
      "ID": id,
      "CODE": code,
      "TYPE": type
    };
    return this.http.post(Services.ServerURL('PlaceGuest/CheckBookmark'), data, { headers: Services.ContentHeaders })
      .map(m => Services.extractResult(m));
  }

}
