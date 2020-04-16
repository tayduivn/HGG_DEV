import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { UserInfo } from "../../model/UserInfo";
import { AuthService } from '../../providers/auth-service';
import { UserChangeInfoPage } from '../user-change-info/user-change-info';

@Component({
    selector: 'page-user-show-info',
    templateUrl: 'user-show-info.html'
})
export class UserShowInfoPage extends PageBase {

    user: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public authService: AuthService,
        public utilityService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, utilityService);
        this.user = {
            username: localStorage.getItem("UserName"),
            email: localStorage.getItem("Email"),
            fullname: localStorage.getItem("FirstName") + ' ' + localStorage.getItem("LastName"),
            avatar: localStorage.getItem("AvatarUrl"),
            language: localStorage.getItem("LanguageId"),
            address: localStorage.getItem("Address"),
            phone: localStorage.getItem("Phone")
        }
    }

    init() { }


    ionViewDidLoad() { }

    updateUserInfo() {
        this.navCtrl.push(UserChangeInfoPage, { option: "ChangeUserInfo" });
    }

    changePassword() {
        this.navCtrl.push(UserChangeInfoPage, { option: "ChangeUserPassword" });
    }

    logout() {
        this.authService.logout().subscribe(res => { 
            //console.log(res.currentUser); 
        });
        localStorage.setItem('access_token', null);
        localStorage.setItem('expires_in', null);
        localStorage.setItem('token_type', null);
        localStorage.setItem('UserName', null);
        localStorage.setItem('FirstName', null);
        localStorage.setItem('LastName', null);
        localStorage.setItem('AvatarUrl', null);
        localStorage.setItem('LanguageId', null);
        localStorage.setItem('Email', null);
        localStorage.setItem('Phone', null);
        localStorage.setItem('expires', null);
        localStorage.setItem('SessionCode', null);
        localStorage.setItem('ImageServer', null);
        localStorage.setItem('AppVersion', null);
    }

}
