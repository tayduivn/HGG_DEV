import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { Services } from './services';
import { Base } from './base';

import { TranslateService } from "../translate";

import { ShowUserInfo } from "./show-user-info";
import { UltilitiesService } from "./index";
import { Parameter } from '../model/Service';

export abstract class PageBase extends Base {
    public loading: Loading;
    useVD: any;
    useGT: any;
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public translateService: TranslateService, public showUserInfo: ShowUserInfo, public UltilitiesService: UltilitiesService) { 
        super(navCtrl, loadingCtrl, alertCtrl, translateService);

        this.useVD = Parameter.useVD;
        this.useGT = Parameter.useGT;
        // localStorage.setItem('access_token', data.access_token);
        // localStorage.setItem('expires_in', data.expires_in);
        // localStorage.setItem('token_type', data.token_type);
        // localStorage.setItem('UserName', data.UserName);
        // localStorage.setItem('FirstName', data.FirstName);
        // localStorage.setItem('LastName', data.LastName);
        // localStorage.setItem('AvatarUrl', data.AvatarUrl);
        // localStorage.setItem('LanguageId', data.LanguageId);
        // localStorage.setItem('Email', data.Email);
        // localStorage.setItem('Phone', data.Phone);
        // localStorage.setItem('expires', data['.expires']);
        // localStorage.setItem('SessionCode', data.SessionCode);
        // localStorage.setItem('ImageServer', data.ImageServer);
        // localStorage.setItem('AppVersion', data.AppVersion);
    }

    checkToken() {
        return new Promise(resolve => {
            var hasToken = Services.tokenNotExpired();
            resolve(hasToken);
        });
        // return Services.tokenNotExpired();
    }

    canActivate() {
        if (!Services.tokenNotExpired()) {
            // this.navCtrl.setRoot(LoginPage);
            this.showUserInfo.showUserBar(null);
        } else {
            this.showUserInfo.showUserBar({
                FirstName: localStorage.getItem("FirstName"),
                Email: localStorage.getItem("Email"),
                AvatarUrl: localStorage.getItem("AvatarUrl"),
                LanguageId: localStorage.getItem("LanguageId"),
                LastName: localStorage.getItem("LastName"),
                UserName: localStorage.getItem("UserName"),
                Phone: localStorage.getItem("Phone"),
                Address: localStorage.getItem("Address")
            });
        }
        
    }

    checkConfig() {
        var imgsv = localStorage.getItem('ImageServer');
        var center = localStorage.getItem('CenterLocation');
        if (!Services.tokenNotExpired() || imgsv == "null" || center == "null" || imgsv == null || center == null) {
            this.UltilitiesService.GetUrlImage().subscribe(data => {
                localStorage.setItem('ImageServer', data.Result);
            });
            this.UltilitiesService.GetCenterLocation().subscribe(data => {
                localStorage.setItem('CenterLocation', data.Result);
            });
        }
    }

    convertDateString(date: Date, split: string, type = 1) {
        var day = date.getDate() > 9 ? date.getDate().toString() : "0"+ date.getDate().toString();
        var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1).toString() : "0"+ (date.getMonth()+1).toString();
        if(type == 1) {
            return day + split + month + split + date.getFullYear();
        } else if(type == 2) {
            return date.getFullYear() + split + month + split + day;
        }
        
    }
    dateDiff(from, to) {
        var one_day=1000*60*60*24;

        var checkindate = new Date(from);
        var checkoutdate = new Date(to);

        // Convert both dates to milliseconds
        var date1_ms = checkindate.getTime();
        var date2_ms = checkoutdate.getTime();
        
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        
        // Convert back to days and return
        var diff = Math.round(difference_ms/one_day) + 1;
        return diff;
    }

    compareTime(from, to) {
        var checkindate = new Date(from);
        var checkoutdate = new Date(to);

        // Convert both dates to milliseconds
        var date1_ms = checkindate.getTime();
        var date2_ms = checkoutdate.getTime();
        
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        
        return difference_ms >= 0;
    }

    getMinusTime(to, from) {
        if(this.compareTime(from, to)) {
            var checkindate = new Date(from);
            var checkoutdate = new Date(to);

            // Convert both dates to milliseconds
            var date1_ms = checkindate.getTime();
            var date2_ms = checkoutdate.getTime();
            
            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;
            
            return Math.round(difference_ms / 1000 / 60);
        } else {
            return 0;
        }
    }

    dateDiffNight(from, to) {
        var one_day=1000*60*60*24;

        var checkindate = new Date(from);
        var checkoutdate = new Date(to);

        // Convert both dates to milliseconds
        var date1_ms = checkindate.getTime();
        var date2_ms = checkoutdate.getTime();
        
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        
        // Convert back to days and return
        var diff = Math.round(difference_ms/one_day);

        return diff;
    }

    addDay(from, num) {
        var one_day=1000*60*60*24;

        var checkindate = new Date(from);
        // var checkoutdate = new Date();

        // Convert both dates to milliseconds
        var date1_ms = checkindate.getTime();
        // var date2_ms = checkoutdate.getTime();
        
        // Calculate the difference in milliseconds
        var date_ms = date1_ms + num * one_day;
        
        // Convert back to days and return
        // var diff = Math.round(difference_ms/one_day) + 1;
        var checkoutdate = new Date(date_ms);

        return checkoutdate;
    }

    addMinutes(from, num) {
        var time_add=1000*60*num;

        var checkindate = new Date(from);
        // var checkoutdate = new Date();

        // Convert both dates to milliseconds
        var date1_ms = checkindate.getTime();
        // var date2_ms = checkoutdate.getTime();
        
        // Calculate the difference in milliseconds
        var date_ms = date1_ms + time_add;
        
        // Convert back to days and return
        // var diff = Math.round(difference_ms/one_day) + 1;
        var result = new Date(date_ms);

        return result;
    }

    minusDay(from, num) {
        var one_day=1000*60*60*24;

        var checkindate = new Date(from);
        // var checkoutdate = new Date();

        // Convert both dates to milliseconds
        var date1_ms = checkindate.getTime();
        // var date2_ms = checkoutdate.getTime();
        
        // Calculate the difference in milliseconds
        var date_ms = date1_ms - num * one_day;
        
        // Convert back to days and return
        // var diff = Math.round(difference_ms/one_day) + 1;
        var checkoutdate = new Date(date_ms);

        return checkoutdate;
    }

    changeURL(value: string, args: string = ""): any {

        //var index = value.indexOf("http");
        // var r = new RegExp('/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g');
        // if (!r.test(value)) {
        //     
        // }
        var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (!regExp.test(value)) {
            value = encodeURI(value);
            if (args == "")
                value = localStorage.getItem('ImageServer') + value;
            else
                value = args + value;
        } else {
        }
        return value;
    }
}
