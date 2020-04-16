import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { PageBase } from '../../providers/page-base';
import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { SearchLocationService, UltilitiesService, HobbyService, ServiceGetting } from '../../providers';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilityLocation } from "../../model/UtilityLocation";
import { UtilityLocationDetailPage } from "../utility-location-detail/utility-location-detail";
import { MapRoutePage } from "../map-route/map-route";

import _ from 'lodash';
import moment from 'moment';
import { Diagnostic } from "@ionic-native/diagnostic";
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
    selector: 'page-utility-location-list',
    templateUrl: 'utility-location-list.html'
})
export class UtilityLocationListPage extends PageBase {

    utility: any;
    currentLocation: string;
    options: any;
    listResultC: UtilityLocation[];
    listLocation: any[];

    isLocationEnabled: boolean;
    latitude: number;
    longitude: number;

    defaultLat: any;
    defaultLng: any;

    page_on: boolean = true;
    checkfail: boolean = false;

    play_one: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private geolocation: Geolocation,
        private _DIAGNOSTIC: Diagnostic,
        public alertCtrl: AlertController,
        public searchLocationService: SearchLocationService,
        public ultilitiesService: UltilitiesService,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public platform: Platform,
        public UltilitiesService: UltilitiesService,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listResultC = [];
        this.listLocation = [];
        this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
    }

    init() {
        this.options = {
            frequency: 3000,
            enableHighAccuracy: true
        };
        this.utility = this.navParams.get("utilities");
        this.currentLocation = "";

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
                                            // var cr = await this.locationAccuracy.canRequest();
                                            // if(cr) {
                                            //     // the accuracy option will be ignored by iOS
                                            //     this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                            //         (data) => {
                                            //             this.isLocationAvailable();
                                            //         },
                                            //         error => {
                                            //             var alert = this.warningDeviceOnly();
                                            //             alert.onDidDismiss(data => {
                                            //                 this._DIAGNOSTIC.switchToLocationSettings();
                                            //             });
                                            //             this.caseNoLatLng();
                                            //         }
                                            //     );
                                            // }
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

    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }

    caseNoLatLng() {
        this.latitude  = this.defaultLat;
        this.longitude = this.defaultLng;
        this.getCurrentLocation(this.latitude, this.longitude, false);
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

    isLocationAvailable()
    {
        var geolocationOptions = {
            enableHighAccuracy: true,
            maximumAge: 3000
        };
        this.showLoading();

        this.geolocation.getCurrentPosition(geolocationOptions).then((loc : any) =>
            {
                //Your logic here
                this.latitude  = loc.coords.latitude;
                this.longitude = loc.coords.longitude;
                this.getCurrentLocation(this.latitude, this.longitude, false);
            }).catch((error1 : any) => {
                this.latitude  = this.defaultLat;
                this.longitude = this.defaultLng;
                this.getCurrentLocation(this.latitude, this.longitude, false);
                this.showError(this.translateService.translate("gps.error1"));
            });
    }

  getCurrentLocation(latitude, longitude, loading = true) {
    // this.showLoading();
    // this.geolocation.getCurrentPosition(this.options).then((position) => {
        this.currentLocation = latitude + "," + longitude;
        this.getListLocation(loading);
    // }, (err) => {
        // console.log(err);
    // });
  }

  getListLocation(loading) {
    
    this.listResultC = [];
    this.listLocation = [];
    this.ultilitiesService.GetListLocation(this.utility.id, this.currentLocation).subscribe(
      data => {
            if (data.Code === 200) {
                this.listResultC = _.concat(this.listResultC, data.Result);
                this.listResultC.forEach(element => {
                    var img = "assets/iconImages/noimage.png";
                    if(element.IMAGE != "" && element.IMAGE != null) {
                        img = element.IMAGE;
                    }
                    this.listLocation.push({
                        id: element.ID,
                        range: Math.round(element.Distance*10)/10+"m",
                        name: element.NAME,
                        address: element.ADDRESS,
                        description: element.DESCRIPTION,
                        location: element.GEO_LOCATION,
                        alias: element.NAME2,
                        phone: element.PHONE,
                        imgURL: img
                    });
                });
                setTimeout(() => {
                    this.loading.dismiss().then(() => {
                        this.play_one = 0;
                    });
                });
            }
            //  else {
            //     this.showError(data.Message);
            // }

        },
        error => {
            this.showError(this.translateService.translate("network.error"));
        }
    );
  }

//   gotoDetail(item) {
//       this.navCtrl.push(UtilityLocationDetailPage, {item: item});
//   }

  showDirection(item) {
    // console.log(this.utility.alias);
    this.navCtrl.push(MapRoutePage, {locations: item.location, type: "utility"});
  }

}
