import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';
/*
  Generated class for the UltilitiesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ExchangeRateService {
    perpage:number = 50;
  constructor(public http: Http) {
    //console.log('Hello UltilitiesService Provider');
  }

  public load(start:number=0) {

    return new Promise(resolve => {
      
      this.http.get('https://www.reddit.com/r/gifs/new/.json')
        .map(res => res.json())
        .subscribe(data => {

          resolve(data);

        });
    });
  }
  
}