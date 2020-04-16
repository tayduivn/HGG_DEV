import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Parameter } from '../model/Service';


@Injectable()
export class Services {

    public static get Ip(): string {
        /**
         * xxx
         */
        var ip = "https://myhagiang.vn/";
        // var ip = "https://localhost:44338/";
        //var ip = "https://vlg.dalatcity.org/";
		// var ip = "https://vinhlongtourist.vn/";
        // var ip = "http://20.10.10.109:8082/";
        // var ip = "http://20.10.10.109:8280/";
        // var ip = "http://localhost:51772/";
        //var ip = "http://192.168.1.12:51772/";
        // var ip = "http://113.161.191.253/portal/";
        return ip;
    }

    public static ServerURL(url: string, api: string = 'api/'): string {
        var ip = this.Ip;
        return ip + api + url;
    }

    public static get ContentHeaders(): Headers {
        let contentHeaders = new Headers();
        contentHeaders.append('Content-Type', 'application/json');
        contentHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        contentHeaders.append('UnitCode', Parameter.portalcode);
        return contentHeaders;
    }

    // parse data from json to object
    public static extractResult(res: Response) {
        let body = res.json();
        return body || {};
    }


    private static getTokenExpirationDate(): Date {
        var date = new Date(localStorage.getItem('expires'));
        return date;
    };

    public static isTokenExpired() {
        var date = this.getTokenExpirationDate();
        if (date == null) {
            return false;
        }

        // Token expired?
        return !(date.valueOf() > new Date().valueOf());
    };

    public static tokenNotExpired() {
        var token = localStorage.getItem('access_token');
        return token !== null && token !== '' && !this.isTokenExpired();
    }

    public static mapToObject(value: Array<any>, args: string[]): any {
        var keyText = "key";
        var valueText = "value";
        if (args.length >= 2) {
            keyText = args[0];
            valueText = args[1];
        }

        var object = {};

        for (let i = 0; i < value.length; i++) {
            Object.assign(object, {
                [value[i][keyText]]: value[i][valueText]
            })
        }

        return object;
    }

    public static getImageUrl(value, args = '') {
        var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (!regExp.test(value)) {
            value = encodeURI(value);
            if (args == "") {
                value = localStorage.getItem('ImageServer') + value;
            } else {
                value = args + value;
            }
        } else {
        }
        return value;
    }
}
