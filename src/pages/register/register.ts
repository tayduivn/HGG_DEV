import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GlobalValidator, AuthService, Services, ShowUserInfo } from '../../providers'
import { LoginPage } from '../login/login'
import { TranslateService } from "../../translate/index";

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    loading: Loading;
    public todo: FormGroup;
    constructor(public navCtrl: NavController,
        private alertCtrl: AlertController,
        private navParams: NavParams,
        private formBuilder: FormBuilder,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
        private translate: TranslateService,
        private ShowUserInfo: ShowUserInfo
    ) {
        this.todo = this.formBuilder.group({
            UserName: ['', [Validators.required]],
            Email: ['', [Validators.required, GlobalValidator.mailFormat]],
            Password: ['', [Validators.required, Validators.minLength(6)]],
            FirstName: ['', [Validators.required, Validators.minLength(2)]],
            LastName: ['', [Validators.required, Validators.minLength(2)]],
            Provider: "Register"
        });
    }

    ionViewDidLoad() {
    }

    logForm() {
        this.showLoading();
        if(this.validateUserName(this.todo.value.UserName)) {
            this.checkEmail(this.todo.value.Email).then(data => {
                if(data) {
                    this.authService.login(this.todo.value).subscribe(
                        result => {
                            //console.log(result);
                            
                            this.loading.dismiss();

                            var img = "assets/images/user.png";
                            if (result.Avatar != null && result.Avatar != "") {
                                img = result.Avatar;
                            }
                            localStorage.setItem('access_token', result.access_token);
                            localStorage.setItem('expires_in', result.expires_in);
                            localStorage.setItem('token_type', result.token_type);
                            localStorage.setItem('UserName', result.UserName);
                            localStorage.setItem('FirstName', result.FirstName);
                            localStorage.setItem('LastName', result.LastName);
                            localStorage.setItem('AvatarUrl', img);
                            localStorage.setItem('ImageServer', result.ImageServer);
                            localStorage.setItem('CenterLocation', result.CenterLocation);
                            localStorage.setItem('LanguageId', result.LanguageId);
                            localStorage.setItem('Email', result.Email);
                            localStorage.setItem('Phone', result.Phone);
                            localStorage.setItem('expires', result['.expires']);
                            localStorage.setItem('SessionCode', result.SessionCode);

                            setTimeout(() => {
                                this.loading.dismiss();
                                // this.nav.setRoot(OverViewPage);
                                this.navCtrl.pop();
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
                            
                            this.navCtrl.pop();

                            let alert = this.alertCtrl.create({
                                title: this.translate.translate('info.title'),
                                subTitle: this.translate.translate('info.successfulregister'),
                                buttons: [
                                    {
                                        text: 'OK',
                                        handler: () => {
                                            
                                        }
                                    }
                                ]
                            });
                            alert.present();

                        },
                        error => {
                            this.showError(this.translate.translate(error.json().error_description));
                        },
                    );
                } else {
                    this.showError(this.translate.translate('error.invalidmail'));
                }
            });
        } else {
            this.showError(this.translate.translate('token.usernameHaveSpecialString'));
        }
        
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/images/loading.gif" />'
        });
        this.loading.present();
        setTimeout(() => {
            this.loading.dismiss();
        }, 10000);
    }

    showError(text, loading = true) {
        if(loading) {
            setTimeout(() => {
                this.loading.dismiss();
            });
        }
        let alert = this.alertCtrl.create({
            title: this.translate.translate('error.title'),
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }

    checkEmail(email) {
        return new Promise(resolve => {
            var filter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/igm;
            var proper = filter.test(email);
            resolve(proper);
        });
    }
    validatePhone(phone) {
        return new Promise(resolve => {
            var re = /^\+?\d{2}|\0(?:\-?|\ ?)(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
            var proper = re.test(phone);
            resolve(proper);
        });
    }

    validateUserName(username) {
        var re = /^[a-z0-9_.]{6,200}$/;
        return re.test(username);
    }
}
