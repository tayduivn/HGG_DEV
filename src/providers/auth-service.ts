import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/User';
import { Http, Headers } from '@angular/http';
import { Services } from './services';

import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";

import 'rxjs/add/operator/map';

import 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Parameter } from '../model/Service';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
    currentUser: User;
    constructor(public http: Http, public googlePlus: GooglePlus, public facebook: Facebook) {
       // console.log('Hello AuthService Provider');
    }

    public login(credentials) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'UnitCode': Parameter.portalcode });
        let data = "";
        if(credentials.Provider == "Register" || credentials.Provider == "Facebook" || credentials.Provider == "Google") {
            if(credentials.Provider == "Register") {
                data = "grant_type=password&username="+credentials.UserName+"&password="+credentials.Password+"&email="+credentials.Email+"&firstname="+credentials.FirstName+"&lastname="+credentials.LastName+"&imageurl="+credentials.AvatarUrl+"&birthday="+credentials.Birthday+"&gender="+credentials.Gender+"&provider="+credentials.Provider+"&providerid="+credentials.ProviderKey;
            } else {
                data = "grant_type=password&email="+credentials.Email+"&firstname="+credentials.FirstName+"&lastname="+credentials.LastName+"&imageurl="+credentials.ImageURL+"&birthday="+credentials.Birthday+"&gender="+credentials.Gender+"&provider="+credentials.Provider+"&providerid="+credentials.ProviderKey;
            }
            
        } else {
            if((credentials.Password === "" || credentials.UserName === "" || credentials.UserName === null || credentials.Password === null)) {
                return Observable.throw({
                    "error_description":"login.missingusernameorpassword",
                });
            } else {
                data = 'grant_type=password&username=' + credentials.UserName + '&password=' + credentials.Password;
            }
        }
        //console.log(data);
        return this.http.post(Services.ServerURL('token', ''), data, { headers: headers })
                .map(m => Services.extractResult(m));
    }

    public register(user: User) {
        //  var data = {
        //     "Page_Size": pageSize,
        //     "Page_Number": pageNumber,
        //     "Language_Id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        //     "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        // };
        return this.http.post(Services.ServerURL('Account/Register'), user, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    public getUserInfo(): User {
        return this.currentUser;
    }

    public logout() {
        return Observable.create(observer => {
            this.currentUser = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('SessionCode')
            localStorage.removeItem('expires_in');
            localStorage.removeItem('token_type');
            localStorage.removeItem('userName');
            localStorage.removeItem('expires');

            this.googlePlus.disconnect();
            this.facebook.logout();

            observer.next({ accessLogin: false, currentUser: this.currentUser });
            observer.complete();
        });
    }

}
