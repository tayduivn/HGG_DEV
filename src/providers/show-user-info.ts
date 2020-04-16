import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserInfo } from '../model/UserInfo';

import { Services } from "./services";
import { Parameter } from '../model/Service';

/*
  Generated class for the ShowUserInfo provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ShowUserInfo {

    constructor(public http: Http) {
        //console.log('Hello ShowUserInfo Provider');
    }


    getUrlImage(value: string, args: string = ""): any {
        //var index = value.indexOf("http");
        // var r = new RegExp('/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g');
        // if (!r.test(value)) {
        //     
        // }
        var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (!regExp.test(value)) {
            if (args == "") {
                value = localStorage.getItem('ImageServer') + value;
            } else {
                value = args + value;
            }
        } else {
        }
        return value;
    }

    showUserBar(user: UserInfo) {
        var element = document.getElementById("show-user-info");

        var menu = document.getElementById("menu-side-box");
        var lastMenuItem = menu.children[0].childNodes[3].childNodes[1].childNodes[1].childNodes[menu.children[0].childNodes[3].childNodes[1].childNodes[1].childNodes.length - 2].attributes["style"];

        if (user != null) {
            var divImageOpen = "<div class='image-avatar'>";
            var image = '<img src="' + this.getUrlImage(user.AvatarUrl) + '" class="user-image" alt="Avatar" />';
            var divImageClose = "</div>";
            var username = '<p class="user-name">' + user.UserName + '</p><br/>';
            var email = '<p class="user-email">' + user.Email + '</p>';
            element.innerHTML = divImageOpen + image + divImageClose + username + email;
            lastMenuItem.nodeValue = "display: block;";
        } else {
            element.innerHTML = '';
            lastMenuItem.nodeValue = "display: none;";
        }
    }

    clearUserBar() {
        var element = document.getElementById("show-user-info");
        element.innerHTML = '';
    }

    getUserHobbies() {
        var data = {
            "language_id": localStorage.getItem('currentLangauge')
        };
        return this.http.post(Services.ServerURL('UserHobbyGuest/GetListUserHobby'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    insertHobbies(id: number) {
        var data = {
            "HOBBY_ID": id.toString()
        };
        return this.http.post(Services.ServerURL('UserHobbyGuest/InsertHobby'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    deleteHobbies(id: number) {
        var data = {
            "HOBBY_ID": id.toString()
        };
        return this.http.post(Services.ServerURL('UserHobbyGuest/DeleteHobby'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    changePassword(OldPassword, NewPassword, ConfirmPassword) {
        var data = {
            "OldPassword": OldPassword,
            "NewPassword": NewPassword,
            "ConfirmPassword": ConfirmPassword,
            "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('AccountApp/ChangePassword'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    updateUserInfo(model: any) {
        var data = {
            "FirstName": model.FirstName,
            "LastName": model.LastName,
            "Phone": model.Phone,
            "Address": model.Address,
            "LanguageId": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        }
        return this.http.post(Services.ServerURL('AccountApp/ChangeInfomation'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    getUserBooking() {
        // var data = {
        //     "booking_type": 0,
        //     "status": 0,
        //     "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
        //     "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        // };
        var data1 = {
            //"booking_type": 0,
            //"status": 0,
            //"language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
           // "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        return this.http.post(Services.ServerURL('UserBooking/GetListBookingByGuest'), data1, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }

    getAllWishlist(lat = null, lng = null) {
        var data;
        if (lat != null && lng != null) {
            data = {
                "GOOGLE_LOCATION": lat + "," + lng,
                "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào               
            };
            return this.http.post(Services.ServerURL('PlaceGuest/GetListPlaceByBookmark'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
        } else {
            data = {
                "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
            };
            return this.http.post(Services.ServerURL('PlaceGuest/GetListPlaceByBookmark'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
        }
    }

    getAllMustSee(lat = null, lng = null) {
        var data;
        if (lat != null && lng != null) {
            data = {
                "GOOGLE_LOCATION": lat + "," + lng,
                "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào               
            };
            return this.http.post(Services.ServerURL('PlaceGuest/GetListPlaceByMustSee'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
        } else {
            data = {
                "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
            };
            return this.http.post(Services.ServerURL('PlaceGuest/GetListPlaceByMustSee'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
        }
    }

    getCamKey() {
        var data = {
            key: Parameter.getCamKey
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetCamKey'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
    getCamUrl() {
        var data = {
        };
        return this.http.post(Services.ServerURL('UtilitiesGuest/GetCamUrl'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m));
    }
}
