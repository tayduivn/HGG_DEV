import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Services } from './services';
import { Parameter } from '../model/Service';
/*
  Generated class for the UltilitiesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WeatherService {

  constructor(public http: Http) {
    //console.log('Hello UltilitiesService Provider');
  }

  // public getCurrentWeather() {
  //   return this.http.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid='+Parameter.weather+' and u="c"&format=json&env=store').map(m => Services.extractResult(m));
  // }

  getCurrentWeather() {
    var data = {

    };
    return this.http.post(Services.ServerURL('UtilitiesGuest/GetWeathers'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
  }
}