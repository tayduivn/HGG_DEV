import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, ViewController, ModalController } from 'ionic-angular';
import { ShowUserInfo } from '../../providers/show-user-info';
import { RegisterPage } from '../register/register';
import { OverViewPage } from '../over-view/over-view';

import { TranslateService } from '../../translate';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
//import firebase from 'firebase';

import { ExchangeRatePage } from '../exchange-rate/exchange-rate';
import { AuthService, Services } from '../../providers'
import { User } from '../../model/User';
import firebase from 'firebase';
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    loading: Loading;
    registerCredentials: User = new User();
    userfacebook = { username: '', password: '' };
    dataUserFb: any;
    infoRes: User = new User();
    constructor(
        // private nav: NavController,
        private auth: AuthService,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public facebook: Facebook,
        public viewCtrl: ViewController,
        public ShowUserInfo: ShowUserInfo,
        public modalCtrl: ModalController,
        private authService: AuthService,
        private googlePlus: GooglePlus
    ) {
        //console.log(this.auth.getUserInfo());
    }

    public ionViewDidLoad() {
        if (Services.tokenNotExpired()) {
            // this.nav.setRoot(OverViewPage);
        }
    }

    public createAccount() {
        let modal = this.modalCtrl.create(RegisterPage);
        modal.present();
    }

    showInfo(message: any) {
        let alert = this.alertCtrl.create({
            title: "Thông báo (Information)",
            message: message,
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {
                        
                    }
                }
            ]
        });
        alert.present();
    }

    public loginWithFacebook() {
        this.showLoading();
        this.facebook.login(["email", "public_profile"]).then((response: FacebookLoginResponse) => {
            this.facebook.getLoginStatus().then((res: FacebookLoginResponse) => {
                if (res.status == "connected") {
                    this.facebook.api('me?fields=id,email,first_name,last_name,picture.width(512).height(512).as(avatar),birthday,gender', []).then(profile => {
                        if (profile['email'] == null || profile['email'] == undefined || profile['email'] == '') {
                            profile['email'] = "fb" + res.authResponse.userID + "@facebook.com";
                        }
                        this.infoRes.Email = profile['email'];
                        this.infoRes.FirstName = profile['first_name'];
                        this.infoRes.LastName = profile['last_name'];
                        this.infoRes.AvatarUrl = profile['avatar']['data']['url'];
                        this.infoRes.Birthday = profile['birthday'];
                        this.infoRes.Gender = profile['gender'];
                        this.infoRes.Provider = "Facebook";
                        this.infoRes.ProviderKey = profile['id'];
                        // this.showInfo(JSON.stringify(res));
                        this.loginExternalSystem(this.infoRes);
                    });
                } else if (res.status === "not_authorized") {
                    this.showError("The user is logged in to Facebook, but has not authenticated your app");
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                    this.facebook.logout();
                } else {
                    this.showError("the user isn't logged in to Facebook");
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                    this.facebook.logout();
                }
            }).catch(err => {
                setTimeout(() => {
                    this.loading.dismiss();
                });
                this.facebook.logout();
            });
        }).catch(err => {
            setTimeout(() => {
                this.loading.dismiss();
            });
            this.facebook.logout();
        });
    }

    public loginWithGoogle() {
        this.showLoading();
        //xxx
        this.googlePlus.login({
            'scopes': 'email',
            'webClientId': '319954393877-ahuk1to0ll98mr60h7fi0fbs4o22h3qg.apps.googleusercontent.com',
            'offline': true
        })
        .then(res => {
            this.infoRes.AvatarUrl = res.imageUrl;
            this.infoRes.Email = res.email;
            this.infoRes.FirstName = res.givenName;
            this.infoRes.LanguageId = res.language;
            this.infoRes.LastName = res.familyName;
            this.infoRes.Provider = "Google";
            this.infoRes.ProviderKey = res.userId;
            // this.showInfo(JSON.stringify(res));
            this.loginExternalSystem(this.infoRes);
        })
        .catch(err => {
            //console.log("Google plus failure: " + JSON.stringify(err));
            this.showInfo("Google plus failure: " + JSON.stringify(err));
            setTimeout(() => {
                this.loading.dismiss();
            });
            this.googlePlus.disconnect();
        });
    }

    public loginExternalSystem(user) {
        this.auth.login(user)
            .subscribe(
            data => {
                var img = "assets/images/user.png";
                if (data.Avatar != null && data.Avatar != "") {
                    img = data.Avatar;
                }
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('expires_in', data.expires_in);
                localStorage.setItem('token_type', data.token_type);
                localStorage.setItem('UserName', data.UserName);
                localStorage.setItem('FirstName', data.FirstName);
                localStorage.setItem('LastName', data.LastName);
                localStorage.setItem('AvatarUrl', img);
                localStorage.setItem('Address', data.Address);
                localStorage.setItem('Role', data.Role);
                localStorage.setItem('RoleLevel', data.RoleLevel);
                localStorage.setItem('UnitCode', data.UnitCode);
                localStorage.setItem('ImageServer', data.ImageServer);
                localStorage.setItem('CenterLocation', data.CenterLocation);
                localStorage.setItem('LanguageId', data.LanguageId);
                localStorage.setItem('Email', data.Email);
                localStorage.setItem('Phone', data.Phone);
                localStorage.setItem('expires', data['.expires']);
                localStorage.setItem('SessionCode', data.SessionCode);
                //this.showError(JSON.stringify(data));
                setTimeout(() => {
                    this.loading.dismiss();
                    // this.nav.setRoot(OverViewPage);
                    this.viewCtrl.dismiss();
                    this.ShowUserInfo.showUserBar({
                        FirstName: localStorage.getItem("FirstName"),
                        Email: localStorage.getItem("Email"),
                        AvatarUrl: localStorage.getItem("AvatarUrl"),
                        LanguageId: localStorage.getItem("LanguageId"),
                        LastName: localStorage.getItem("LastName"),
                        UserName: localStorage.getItem("UserName"),
                        Phone: localStorage.getItem("Phone"),
                        Address: localStorage.getItem("Address")
                    });
                });
            },
            error => {
                //console.log(error);
                this.showError(this.translateService.translate(error.json().error_description));
                setTimeout(() => {
                    this.loading.dismiss();
                });
                this.facebook.logout();
                this.googlePlus.disconnect();
            }
            );
    }

    public login() {
        this.showLoading();
        this.registerCredentials.Provider = "Login";

        this.auth.login(this.registerCredentials)
            .subscribe(
            data => {
                //console.log(data);
                var img = "assets/images/user.png";
                if (data.Avatar != null && data.Avatar != "") {
                    img = data.Avatar;
                }
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('expires_in', data.expires_in);
                localStorage.setItem('token_type', data.token_type);
                localStorage.setItem('UserName', data.UserName);
                localStorage.setItem('FirstName', data.FirstName);
                localStorage.setItem('LastName', data.LastName);
                localStorage.setItem('AvatarUrl', img);
                localStorage.setItem('Address', data.Address);
                localStorage.setItem('Role', data.Role);
                localStorage.setItem('RoleLevel', data.RoleLevel);
                localStorage.setItem('UnitCode', data.UnitCode);
                localStorage.setItem('ImageServer', data.ImageServer);
                localStorage.setItem('CenterLocation', data.CenterLocation);
                localStorage.setItem('LanguageId', data.LanguageId);
                localStorage.setItem('Email', data.Email);
                localStorage.setItem('Phone', data.Phone);
                localStorage.setItem('expires', data['.expires']);
                localStorage.setItem('SessionCode', data.SessionCode);

                setTimeout(() => {
                    this.loading.dismiss();
                    // this.nav.setRoot(OverViewPage);
                    this.viewCtrl.dismiss();
                    this.ShowUserInfo.showUserBar({
                        FirstName: localStorage.getItem("FirstName"),
                        Email: localStorage.getItem("Email"),
                        AvatarUrl: localStorage.getItem("AvatarUrl"),
                        LanguageId: localStorage.getItem("LanguageId"),
                        LastName: localStorage.getItem("LastName"),
                        UserName: localStorage.getItem("UserName"),
                        Phone: localStorage.getItem("Phone"),
                        Address: localStorage.getItem("Address")
                    });
                });
            },
            error => {
                //console.log(error);
                try {
                    this.showError(this.translateService.translate(error.json().error_description));
                } catch(ex) {
                    this.showError(this.translateService.translate(error.error_description));
                }
            });
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/images/loading.gif" />'
        });
        this.loading.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: this.translateService.translate('login.fail.title'),
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}