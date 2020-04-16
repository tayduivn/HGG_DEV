/// <reference path="WikitudePlugin.d.ts" />
import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service';
import { TranslateService } from '../translate';

import { EventShowPage } from '../pages/event-show/event-show';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';

import { OverViewPage } from '../pages/over-view/over-view';

import { PlanPage } from '../pages/plan/plan';
import { PlanV2Page } from '../pages/plan-v2/plan-v2';
import { UserChangeInfoPage } from '../pages/user-change-info/user-change-info';
import { UserShowInfoPage } from '../pages/user-show-info/user-show-info';
// import { PlanSavedListPage } from '../pages/plan-saved-list/plan-saved-list';
// import { AppAvailability } from '@ionic-native/app-availability';

import { QuickBookingPage } from '../pages/quick-booking/quick-booking';
import { RecorderPage } from '../pages/recorder/recorder';
import { CameraEmotionPage } from '../pages/camera-emotion/camera-emotion';
import { UserPage } from "../pages/user/user";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";
import { ShowUserInfo } from "../providers/index";
import { LookUpPage } from "../pages/look-up/look-up";
import { UltilitiesService } from "../providers/ultilities-service";

import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Parameter } from '../model/Service';
import { Facebook } from '@ionic-native/facebook';
import { NewsPage } from '../pages/news/news';
@Component({
    templateUrl: 'app.html',
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage: any = OverViewPage;
    pages: Array<{ title: string, component: any, id: string, icon: string, submenu: any[], submenuid: string }>;

    public translatedText: string;
    public supportedLangs: any[];
    private currentLanguage: any;
    private token: any;

    public version: any;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public authService: AuthService,
        private _translate: TranslateService,
        private _DIAGNOSTIC: Diagnostic,
        private geolocation: Geolocation,
        private showUserInfo: ShowUserInfo,
        private UltilitiesService: UltilitiesService,
        private appVersion: AppVersion,
        private market: Market,
        private alertCtrl: AlertController,
        private fb: Facebook,
        private iab: InAppBrowser
    ) {
        this.initializeApp();

        this.version = "1.0.0";

        // set our app's pages
        this.pages = [
            { title: 'menu.overview', icon: 'assets/iconImages/houses.png', component: OverViewPage, id: "OverViewPage", submenu: [], submenuid: "" },
            {
                title: 'Ngôn ngữ - Language', icon: 'assets/images/icon-design/icon-lang.png', component: null, id: "LanguageList", submenu: [
                    { title: 'Tiếng Việt', icon: 'assets/images/icon-design/lang-vn.png', component: null, id: "ChangeLangVie" },
                    { title: 'English', icon: 'assets/images/icon-design/lang-en.png', component: null, id: "ChangeLangEng" },
                ], submenuid: "language-sub-menu"
            },
            { title: 'menu.eventlist', icon: 'assets/images/icon-design/icon-56.png', component: EventShowPage, id: "EventShowPage", submenu: [], submenuid: "" },
            { title: 'menu.newslist', icon: 'assets/images/icon-design/icon-news.png', component: NewsPage, id: "NewsPage", submenu: [], submenuid: "" },
            { title: 'menu.quickbooking', icon: 'assets/iconImages/quick-booking.png', component: QuickBookingPage, id: "QuickBooking", submenu: [], submenuid: "" },
            // { title: 'menu.plan', component: PlanPage, id: "Plan" },
            { title: 'menu.planv2', icon: 'assets/iconImages/plan.png', component: PlanV2Page, id: "PlanV2Page", submenu: [], submenuid: "" },
            // { title: 'menu.plansaved', component: PlanSavedListPage, id: "PlanSaved" },
            // { title: 'menu.setting', icon: 'assets/iconImages/setting.png' ,component: SettingLanguagePage, id: "SettingLanguagePage" },//
            // { title: 'menu.account', icon: 'assets/iconImages/account.png' ,component: UserPage, id: "UserPage" },
            // { title: 'menu.emotion', icon: 'assets/images/icon-design/icon-42.png', component: CameraEmotionPage, id: "CameraEmotionPage", submenu: [], submenuid: "" },//
            { title: 'menu.FanPage', icon: 'assets/images/icon-design/icon-fb.png', component: null, id: "FanPage", submenu: [], submenuid: "" },
            { title: 'menu.sharedApp', icon: 'assets/images/icon-design/icon-shareapp.png', component: null, id: "SharedApp", submenu: [], submenuid: "" },
            { title: 'menu.logoff', icon: 'assets/iconImages/logout.png', component: LoginPage, id: "Logout", submenu: [], submenuid: "" },
        ];
    }

    ionViewWillEnter() {

    }

    getInForUserLogin() {
        this.menu.close();
        this.nav.setRoot(UserPage);
    }

    initializeApp() {
        this.subscribeToLangChanged();
        // set language
        var lang = localStorage.getItem('currentLangauge');

        //if (!this.tokenNotExpired()) {
        //    localStorage.setItem('ImageServer', null);
        //    localStorage.setItem('CenterLocation', null);
        //}

        if (lang == null || lang === '') {
            lang = 'vi';
        } else if(lang == "vi_VN") {
            lang = 'vi';
            localStorage.setItem('currentLangauge', "vi");
        } else if(lang == "en_US") {
            lang = 'en';
            localStorage.setItem('currentLangauge', "en");
        }

        this._translate.setDefaultLang(lang);
        this._translate.enableFallback(true);
        this.selectLang(lang);
        // set language
        // var lang = localStorage.getItem('currentLangauge');

        // if (lang == null || lang === '') {
        //     lang = 'vi';
        // } else if(lang == "vi_VN") {
        //     localStorage.setItem('currentLangauge', "vi");
        // } else if(lang == "en_US") {
        //     localStorage.setItem('currentLangauge', "en");
        // }

        // this._translate.setDefaultLang(lang);
        // this._translate.enableFallback(true);
        // this.selectLang(lang);
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString("#2C9CD3");

            this.UltilitiesService.GetUrlImage().subscribe(data => {
                localStorage.setItem('ImageServer', data.Result);
            });
            this.UltilitiesService.GetCenterLocation().subscribe(data => {
                localStorage.setItem('CenterLocation', data.Result);
            });

            this.showUserInfo.getCamKey().subscribe((data) => {

                WikitudePlugin._sdkKey = data.Result;;

                WikitudePlugin.isDeviceSupported(
                    function (success) {
                        console.log("Your platform supports Camera!");
                    },
                    function (fail) {
                        console.log("Your platform failed to run Camera: " + fail);
                    },
                    [WikitudePlugin.FeatureGeo]
                );

                WikitudePlugin.setOnUrlInvokeCallback(function (url) {
                    if (url.indexOf('captureScreen') > -1) {
                        WikitudePlugin.captureScreen(
                            (absoluteFilePath) => {
                                console.log("snapshot stored at:\n" + absoluteFilePath);
                            },
                            (errorMessage) => {
                                console.log(errorMessage);
                            },
                            true, null
                        );
                    } else {
                        alert(url + "not handled");
                    }
                });

                /**
                 * Define the generic ok callback
                 */
                WikitudePlugin.onWikitudeOK = function () {
                    console.log("Things went ok.");
                }

                /**
                 * Define the generic failure callback
                 */
                WikitudePlugin.onWikitudeError = function () {
                    console.log("Something went wrong");
                }
            });


            this.splashScreen.hide();

            // this.isAvailableLocation();

            //console.log(this.authService.getUserInfo());
            this.subscribeToLangChanged();

            // // set language
            // var lang = localStorage.getItem('currentLangauge');

            // //if (!this.tokenNotExpired()) {
            // //    localStorage.setItem('ImageServer', null);
            // //    localStorage.setItem('CenterLocation', null);
            // //}

            // if (lang == null || lang === '') {
            //     lang = 'vi';
            // } else if(lang == "vi_VN") {
            //     lang = 'vi';
            //     localStorage.setItem('currentLangauge', "vi");
            // } else if(lang == "en_US") {
            //     lang = 'en';
            //     localStorage.setItem('currentLangauge', "en");
            // }

            // this._translate.setDefaultLang(lang);
            // this._translate.enableFallback(true);
            // this.selectLang(lang);
            this.token = localStorage.getItem('access_token');

            // if(localStorage.getItem("seen") == null) {
            localStorage.setItem("seen", "");
            // }
            this.UltilitiesService.getVersion().subscribe(res => {
                this.appVersion.getVersionNumber().then(data => {
                    this.version = data;
                    if(this.isNewVersion(res.Result, data)) {
                        this.appVersion.getPackageName().then(data1 => {
                            let alert = this.alertCtrl.create({
                                title: "Thông báo (Information)",
                                message:
                                    `<p>Đã có phiên bản mới: `+ res.Result +`. Xin vui lòng cập nhật lên phiên bản mới nhất.</p>
                                    <p>(There's a new version of app: `+ res.Result +`. Please update to latest version)</p>`,
                                buttons: [
                                    {
                                        text: 'OK',
                                        role: 'cancel',
                                        handler: () => {
                                            if(this.platform.is("ios")){
                                                let browser = this.iab.create('itms-apps://itunes.apple.com/app/id'+res.Message);
                                            } else if(this.platform.is("android")) {
                                                this.market.open(data1);
                                            }
                                        }
                                    }
                                ]
                            });
                            alert.present();
                        });
                    }
                });
            });
        });
    }

    private isNewVersion(newVersion, currentVersion) {
        var newlist = newVersion.split(".");
        var currentlist = currentVersion.split(".");

        if(this.n(newlist[0]) > this.n(currentlist[0])) {
            return true;
        } else if(this.n(newlist[0]) == this.n(currentlist[0])) {
            if(this.n(newlist[1]) > this.n(currentlist[1])) {
                return true;
            } else if(this.n(newlist[1]) == this.n(currentlist[1])) {
                if(this.n(newlist[2]) > this.n(currentlist[2])) {
                    return true;
                }
            }
        }

        return false;
    }

    private n(str) {
        return parseInt(str);
    }

    private getTokenExpirationDate(): Date {
        var date = new Date(localStorage.getItem('expires'));
        return date;
    };

    public isTokenExpired() {
        var date = this.getTokenExpirationDate();
        if (date == null) {
            return false;
        }

        // Token expired?
        return !(date.valueOf() > new Date().valueOf());
    }

    public tokenNotExpired() {
        var token = localStorage.getItem('access_token');
        return token !== null && token !== '' && !this.isTokenExpired();
    }

    openPage(page) {
        // close the menu when clicking a link from the menu

        // navigate to the new page if it is not the current page
        if (page.id == "Logout") {
            this.menu.close();
            this.logout();
            this.nav.setRoot(OverViewPage);
        } else if (page.id == 'FanPage') {
            this.openFanPage();
        } else if (page.id == "SharedApp") {
            this.SharedApp();
        } else if (page.id == "EventShowPage") {
            this.menu.close();
            this.nav.push(LookUpPage, { data: '7' });
        } else if (page.id == "LanguageList") {
            var language_menu = document.getElementById("language-sub-menu");
            if (language_menu.style.display == "block") {
                language_menu.style.display = "none";
            } else {
                language_menu.style.display = "block";
            }
        } else if (page.id == "ChangeLangEng") {
            this.menu.close();
            this.changeLang("en");
            this.nav.setRoot(OverViewPage);
        } else if (page.id == "ChangeLangVie") {
            this.menu.close();
            this.changeLang("vi");
            this.nav.setRoot(OverViewPage);
        } else {
            this.menu.close();
            let view = this.nav.getActive();
            if (view.component.name == page.id) {

            } else {
                this.nav.setRoot(page.component);
            }
        }
    }

    changeLang(p) {
        this._translate.setDefaultLang(p);
        this._translate.enableFallback(true);
        this.selectLang(p);
    }

    subscribeToLangChanged() {
        return this._translate.onLangChanged.subscribe((x: any) => this.refreshText());
    }

    refreshText() {
        this.translatedText = this._translate.instant('put');
    }

    selectLang(lang: string) {
        localStorage.setItem('currentLangauge', lang);
        this.currentLanguage = lang;
        this._translate.use(lang);
        this.refreshText();
    }

    logout() {
        this.authService.logout().subscribe(res => {
            // console.log(res.currentUser);
            console.log(res);
            localStorage.setItem('access_token', null);
            localStorage.setItem('expires_in', null);
            localStorage.setItem('token_type', null);
            localStorage.setItem('UserName', null);
            localStorage.setItem('ID', null);
            localStorage.setItem('Address', null);
            localStorage.setItem('FirstName', null);
            localStorage.setItem('LastName', null);
            localStorage.setItem('Gender', null);
            localStorage.setItem('AvatarUrl', null);
            localStorage.setItem('LanguageId', null);
            localStorage.setItem('Email', null);
            localStorage.setItem('Phone', null);
            localStorage.setItem('expires', null);
            localStorage.setItem('SessionCode', null);
            localStorage.setItem('Role', null);
            localStorage.setItem('RoleLevel', null);
            localStorage.setItem('UnitCode', null);
            localStorage.setItem('AppVersion', null);
            this.showUserInfo.clearUserBar();
        });
    }

    openFanPage() {
        this.UltilitiesService.GetFanPage().subscribe(data => {
            if (data.Code == 200) {
                let app = "";
                if (this.platform.is('ios')) {
                    app = 'fb://profile/' + data.Result;
                } else if (this.platform.is('android')) {
                    app = 'fb://page/' + data.Result;
                }
                window.open(app, '_system', 'location=no');
            }

        });

    }

    SharedApp() {

        this.UltilitiesService.GetShareLink(
            {
                "SharedType": "app",
            }
        ).subscribe(data => {
            if (data.Code == 200) {
                this.fb.showDialog(
                    {
                        method: 'share',
                        href: data.Result.Url,
                        quote: data.Result.Content,
                        hashtag: data.Result.HashTag,
                        imageURL: data.Result.Url
                    });
            }

        });
    }
}
