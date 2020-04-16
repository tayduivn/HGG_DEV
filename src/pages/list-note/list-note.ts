import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform, ModalController, Events } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService, EventService, ShoppingService } from "../../providers";
import { TranslateService } from "../../translate";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";
import { UserNotePage } from "../user-note/user-note";
import { LoginPage } from "../login/login";
import { HotelDetailPage } from "../hotel-detail/hotel-detail";
import { RestaurantDetailPage } from "../restaurant-detail/restaurant-detail";
import { SightSeeingPage } from "../sight-seeing/sight-seeing";
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { EventDetailPage } from "../event-detail/event-detail";
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
/**
 * Generated class for the ListNotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-list-note',
    templateUrl: 'list-note.html',
})
export class ListNotePage extends PageBase {

    latitude: any;
    longitude: any;
    defaultLocation: any;
    listlocation: any[];

    // defaultLat: any;
    // defaultLng: any;

    page_on: boolean = true;
    first_time: boolean = true;

    checkfail: boolean = false;
    play_one: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService,
        public _DIAGNOSTIC: Diagnostic,
        public geolocation: Geolocation,
        public platform: Platform,
        public modalCtrl: ModalController,
        public eventService: EventService,
        public shoppingService: ShoppingService,
        private events: Events,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions,

    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listlocation = [];
        // this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        // this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
    }

    init() {
        this.defaultLocation = localStorage.getItem("CenterLocation");

        // this.isLocationAvailable();
        // if(this.platform.is("cordova")) {
        //     this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode) => {
        //         if (this.page_on && ((this.platform.is("android") && locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF)
        //             || (this.platform.is("ios") && (locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
        //                 || locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE
        //             )))) {

        //             if(this.first_time >= 1 && this.platform.is("ios")) {
        //                 this.showLoading();
        
        //                 this.geolocation.getCurrentPosition()
        //                 .then((data: any) => {
        //                     this.latitude = data.coords.latitude;
        //                     this.longitude = data.coords.longitude;
        //                     this.getListNoteByUser(this.latitude + "," + this.longitude);
        //                 })
        //                 .catch((error1: any) => {
        //                     this.getListNoteByUser(this.defaultLocation);
        //                     this.showError(this.translateService.translate("gps.error1"));
        //                 });

        //             } else if(this.platform.is("android")) {
        //                 this.showLoading();
        
        //                 this.geolocation.getCurrentPosition()
        //                 .then((data: any) => {
        //                     this.latitude = data.coords.latitude;
        //                     this.longitude = data.coords.longitude;
        //                     this.getListNoteByUser(this.latitude + "," + this.longitude);
        //                 })
        //                 .catch((error1: any) => {
        //                     this.getListNoteByUser(this.defaultLocation);
        //                     this.showError(this.translateService.translate("gps.error1"));
        //                 });
        //             }
        //             this.first_time++;
        //         }
        //     });
        // }
        this.platform.ready().then(() => {
            if(this.platform.is('cordova')) {
                this.checkGPS().then(() => {
                    setTimeout(async () => {
                        if(this.checkfail == true) {
                            this.caseNoLatLng();
                        } else {
                            if(this.platform.is('ios')) {
                                this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
                                    if(status == this._DIAGNOSTIC.permissionStatus.DENIED) {
                                        this.errorNoGPS();
                                    } else {
                                        this.isLocationAvailable();
                                    }
                                });
                            } else {
                                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                                if(!cp2.hasPermission) {
                                    this.errorNoPermission();
                                } else {
                                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                                        
                                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                                            this.isLocationAvailable();
                                        } else {
                                            var alert = this.warningDeviceOnly();
                                            this.caseNoLatLng();
                                        }
                                    });
                                }
                            }
                        }
                    }, 500);
                });
            } else {
                this.isLocationAvailable();
            }
        });
    }

    caseNoLatLng() {
        this.getListNoteByUser(this.defaultLocation);
    }

    errorNoGPS() {
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("error.title"),
            subTitle: this.translateService.translate("gps.error1"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    errorNoPermission() {
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("error.title"),
            subTitle: this.translateService.translate("gps.error1"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    warningDeviceOnly() {
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("info.title"),
            subTitle: this.translateService.translate("info.deviceonly"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    infoChangeGPS() {
        var alert = this.alertCtrl.create({
            title: this.translateService.translate('info.title'),
            subTitle: this.translateService.translate("info.gps"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    async checkGPS() {
        var ie = await this._DIAGNOSTIC.isLocationEnabled();
        if(this.platform.is('android')) {
            var cp = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            if(!cp.hasPermission) {
                await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            }
        }
        
        if(ie) {
            if(this.platform.is('android')) {
                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                if(!cp2.hasPermission) {
                    this.checkfail = true;
                    this.errorNoPermission();
                } else {
                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                            // this.isLocationAvailable();
                        } else {
                            var cr = await this.locationAccuracy.canRequest();
                            if(cr) {
                                // the accuracy option will be ignored by iOS
                                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                    (data) => {
                                        // this.isLocationAvailable();
                                    },
                                    error => {
                                        this.warningDeviceOnly();
                                        // this.caseNoLatLng();
                                        this.checkfail = true;
                                    }
                                );
                            }
                        }
                    });
                }
            } else if(this.platform.is('ios')) {
                this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
                    switch(status){
                        case this._DIAGNOSTIC.permissionStatus.NOT_REQUESTED:
                            console.log("Permission not requested");
                            break;
                        case this._DIAGNOSTIC.permissionStatus.DENIED:
                            this.checkfail = true;
                            this.errorNoPermission();
                            break;
                        case this._DIAGNOSTIC.permissionStatus.GRANTED:
                            break;
                    }
                });
            }
        } else {
            this.checkfail = true;
            let alert = this.errorNoGPS();
            alert.onDidDismiss((data) => {
                this._DIAGNOSTIC.switchToLocationSettings();
            });
            this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode) => {
                
                if(this.page_on 
                    && ((this.platform.is("android") && (locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF))
                    || (this.platform.is("ios") && ( locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
                    || locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE)))
                ) {
                    if(this.play_one == 0) {
                        this.play_one = 1;
                        let alert = this.infoChangeGPS();
                        alert.onDidDismiss(async data => {
                            if(this.platform.is('android')) {
                                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                                if(!cp2.hasPermission) {
                                    this.errorNoPermission();
                                } else {
                                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                                            this.isLocationAvailable();
                                        } else {
                                            var cr = await this.locationAccuracy.canRequest();
                                            if(cr) {
                                                // the accuracy option will be ignored by iOS
                                                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                                    (data) => {
                                                        this.isLocationAvailable();
                                                    },
                                                    error => {
                                                        this.warningDeviceOnly();
                                                        this.caseNoLatLng();
                                                    }
                                                );
                                            }
                                        }
                                    });
                                }
                            } else if(this.platform.is('ios')) {
                                // this.isLocationAvailable();
                                this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
                                    if(status == this._DIAGNOSTIC.permissionStatus.DENIED) {
                                        this.errorNoPermission();
                                        this.caseNoLatLng();
                                    } else {
                                        this.isLocationAvailable();
                                    }
                                });
                            } else {
                                this.isLocationAvailable();
                            }
                        });
                    }
                } else if(this.platform.is("ios") && locationMode === this._DIAGNOSTIC.permissionStatus.NOT_REQUESTED) {
                    this._DIAGNOSTIC.requestLocationAuthorization().then(data => {
                        if(data == this._DIAGNOSTIC.permissionStatus.DENIED) {
                            this.errorNoPermission();
                            this.caseNoLatLng();
                        } else {
                            this.isLocationAvailable();
                        }
                    }, err => {
                        this.errorNoPermission();
                        this.caseNoLatLng();
                    });
                }
            });
        }
        
    }

    isLocationAvailable() {

        this.geolocation.getCurrentPosition({
            maximumAge: 3000, enableHighAccuracy: true
        }).then((data: any) => {
            this.latitude = data.coords.latitude;
            this.longitude = data.coords.longitude;
            this.getListNoteByUser(this.latitude + "," + this.longitude);
        }).catch((error: any) => {
            this.getListNoteByUser(this.defaultLocation);
            this.showError(this.translateService.translate("gps.error1"));
        });
        
    }

    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }

    getListNoteByUser(location) {
        this.listlocation = [];
        this.UltilitiesService.GetLocationByNote(location).subscribe(data => {
            if (data.Code === 200) {
                data.Result.forEach(note => {
                    if (note.Content != null && note.Content != undefined && note.Content != "") {
                        this.listlocation.push(note);
                    }
                });
                setTimeout(() => {
                    this.loading.dismiss().then(data => {
                        this.play_one = 0;
                    });
                });
            }
        }, err => {
            this.showError(this.translateService.translate("network.error"));
        });
    }

    openNote(event: MouseEvent, location) {
        event.stopPropagation();
        this.checkToken().then(data => {
            if (data) {
                this.events.subscribe('back-load-list', (paramsVar) => {

                    this.isLocationAvailable();

                    /// Do stuff with "paramsVar"
                    this.events.unsubscribe('back-load-list'); // unsubscribe this event
                })
                this.navCtrl.push(UserNotePage, { objectId: location.Location_Id, typeId: location.Location_Code, name: location.Location_Name, locationType: location.Location_Type });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }
    gotoDetail(obj) {
        if (obj.Location_Code == "HOTEL") {
            this.navCtrl.push(HotelDetailPage, { item: obj.Location_Id, code: obj.Location_Code });
        } else if (obj.Location_Code == "RESTAURANT") {
            this.navCtrl.push(RestaurantDetailPage, { item: obj.Location_Id, code: obj.Location_Code });
        } else if (obj.Location_Code == "TPLACE") {
            this.navCtrl.push(SightSeeingPage, { item: obj.Location_Id, code: obj.Location_Code });
        } else if (obj.Location_Code == "ENTERTAINMENT") {
            this.navCtrl.push(EntertainmentDetailPage, { item: obj.Location_Id, code: obj.Location_Code });
        } else if (obj.Location_Code == "SHOP") {
            this.shoppingService.GetShopDetailH(obj.Location_Id, obj.Location_Code).subscribe(data => {
                if (data.Code === 200) {
                    let shop = data.Result;
                    this.navCtrl.push(ShopDetailPage, { item: shop });
                }
            });

        } else if (obj.Location_Code == "N_EVENTS" || obj.Location_Code == "N_NEWS") {
            this.eventService.GetDetailH(obj.Location_Id, obj.Location_Code).subscribe(data => {
                if (data.Code === 200) {
                    this.navCtrl.push(EventDetailPage, { item: data.Result });
                }
            });
        }
    }
}
