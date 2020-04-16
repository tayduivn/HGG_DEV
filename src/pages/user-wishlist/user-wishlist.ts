import { Component, ViewChild } from '@angular/core';
import { updateImgs } from "ionic-angular/components/content/content";
import { NavController, NavParams, AlertController, LoadingController, Platform, Img } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService, ShoppingService, EventService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { MapRoutePage } from "../map-route/map-route";
import { Diagnostic } from '@ionic-native/diagnostic';
import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { SightSeeingPage } from '../sight-seeing/sight-seeing';
import { Content, ModalController } from "ionic-angular";

import _ from 'lodash';
import { LoginPage } from "../login/login";
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { EventDetailPage } from "../event-detail/event-detail";
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/*
  Generated class for the MapRoute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-user-wishlist',
    templateUrl: 'user-wishlist.html'
})
export class UserWishListPage extends PageBase {
    @ViewChild(Content) _content: Content;
    listWishList: any[];
    public isLocationEnabled: boolean = false;
    latitude: any;
    longitude: any;
    loaded: boolean;

    defaultLat: any;
    defaultLng: any;

    current_tab: any;

    page_on: boolean = true;

    checkfail: boolean = false;
    play_one: any = 0;

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
        private _DIAGNOSTIC: Diagnostic,
        public platform: Platform,
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController,
        public shoppingService: ShoppingService,
        public eventService: EventService,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listWishList = [];
        this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
        this.current_tab = 'yt';
    }

    ngAfterViewInit() {
        if (this._content) {
            this._content.imgsUpdate = () => {
                if (this._content._scroll.initialized && this._content._imgs.length && this._content.isImgsUpdatable()) {
                    // reset cached bounds
                    this._content._imgs.forEach((img: Img) => {
                        img._rect = null;
                        img._srcAttr = function (srcAttr) {
                            var /** @type {?} */ imgEle = this._img;
                            var /** @type {?} */ renderer = this._renderer;
                            if (imgEle && imgEle.src !== srcAttr) {
                                renderer.setElementAttribute(this._img, 'src', srcAttr);
                                renderer.setElementAttribute(this._img, 'onerror', "this.src='assets/iconImages/noimage.png'");
                            }
                        };
                    });
                    // use global position to calculate if an img is in the viewable area
                    updateImgs(this._content._imgs, this._content._cTop * -1, this._content.contentHeight, this._content.directionY, 1400, 400);
                }
            };
        }
    }

    caseNoLatLng() {
        this.latitude = this.defaultLat;
        this.longitude = this.defaultLng;
        this.getAllWishlist(this.latitude, this.longitude, false);
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
        //Desktop coding
        // this.getAllWishlist();

        //Only for iOS and android
        this.listWishList = [];
        this.checkToken().then(data => {
            if (data) {
                this._content.scrollToTop();
                this.showLoading();
                var geolocationOptions = {
                    enableHighAccuracy: true,
                    maximumAge: 3000
                };
                this.geolocation.getCurrentPosition(geolocationOptions)
                .then((loc : any) => {
                    //Your logic here
                    this.latitude = loc.coords.latitude;
                    this.longitude = loc.coords.longitude;
                    this.getAllWishlist(this.latitude, this.longitude, false);
                }).catch((error1 : any) => {
                    this.latitude = this.defaultLat;
                    this.longitude = this.defaultLng;
                    this.getAllWishlist(this.latitude, this.longitude, false);
                    this.showError(this.translateService.translate("gps.error1"));
                });
            } else {
                this.loading.dismiss();
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
                modal.onDidDismiss(() => {
                    this.checkToken().then(data => {
                        if (data) {
                            var geolocationOptions = {
                                enableHighAccuracy: true,
                                maximumAge: 3000
                            };
                            this.geolocation.getCurrentPosition(geolocationOptions)
                            .then((loc : any) => {
                                //Your logic here
                                this.latitude = loc.coords.latitude;
                                this.longitude = loc.coords.longitude;
                                this.getAllWishlist(this.latitude, this.longitude, false);
                            }).catch((error1 : any) => {
                                this.latitude = this.defaultLat;
                                this.longitude = this.defaultLng;
                                this.getAllWishlist(this.latitude, this.longitude, false);
                                this.showError(this.translateService.translate("gps.error1"));
                            });
                        }
                    });
                });
            }
        });
    }

    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }

    init() {
        // this.getAllWishlist();
        this.checkToken().then(data => {
            if(data) {
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
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
                modal.onDidDismiss(() => {
                    this.checkToken().then(data => {
                        if(data) {
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
                    });
                });
            }
        });

    }

    getAllWishlist(latitude, longitude, loading = true) {
        this.ShowUserInfo.getAllWishlist(latitude, longitude).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listWishList = _.concat(this.listWishList, data.Result);
                    // this.listWishList.unshift([{}]);
                    // console.log(this.listWishList)
                    setTimeout(() => {
                        this.loading.dismiss().then(data => {
                            this.play_one = 0;
                        });
                    });
                } 
                // else if (data.Code !== 404) {
                //     this.showError(data.Message);
                // } 
                else {
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
        
    }

    getAllMustSee(latitude, longitude, loading = true) {
        if (loading) {
            this.showLoading();
        }
        this._content.scrollToTop();
        this.listWishList = [];
        this.ShowUserInfo.getAllMustSee(latitude, longitude).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listWishList = _.concat(this.listWishList, data.Result);
                    // this.listWishList.unshift([{}]);
                    // console.log(this.listWishList)
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                } else if (data.Code != 404) {
                    this.showError(data.Message);
                }else{
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );

    }

    directionMap(event: MouseEvent, location) {
        event.stopPropagation();
        this.navCtrl.push(MapRoutePage, { locations: location.GEO_LOCATION, type: this.getType(location.CODE) });
    }

    getType(types) {
        switch (types) {
            case "HOTEL":
                return "stay";
            case "RESTAURANT":
                return "eat";
            case "TPLACE":
                return "see";
            case "SHOP":
                return "shop";
            case "ENTERTAINMENT":
                return "entertainment";
            case "N_EVENTS":
                return "event";
        }
    }

    gotoDetail(obj) {
        if (obj.CODE == "HOTEL") {
            this.navCtrl.push(HotelDetailPage, { item: obj.ID, code: obj.CODE });
        } else if (obj.CODE == "RESTAURANT") {
            this.navCtrl.push(RestaurantDetailPage, { item: obj.ID, code: obj.CODE });
        } else if (obj.CODE == "TPLACE") {
            this.navCtrl.push(SightSeeingPage, { item: obj.ID, code: obj.CODE });
        } else if (obj.CODE == "ENTERTAINMENT") {
            this.navCtrl.push(EntertainmentDetailPage, { item: obj.ID, code: obj.CODE });
        } else if (obj.CODE == "SHOP") {
            this.shoppingService.GetShopDetailH(obj.ID, obj.CODE).subscribe(data => {
                if (data.Code === 200) {
                    let shop = data.Result;
                    this.navCtrl.push(ShopDetailPage, { item: shop });
                }

            });
        } else if (obj.CODE == "N_EVENTS") {
            this.eventService.GetDetailH(obj.ID, obj.CODE).subscribe(data => {
                if (data.Code === 200) {
                    this.navCtrl.push(EventDetailPage, { item: data.Result });
                }
            });
        }
    }

    removeWishList(love) {
        var type = love.CODE != null ? ((love.CODE.indexOf("_") !== -1) ? "NEWS" : "PLACE") : "PLACE";
        this.searchLocationService.removeSaveWishListH(love.ID, love.CODE, type).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listWishList = this.listWishList.filter(obj => obj !== love);
                    // this.listWishList = _.filter(this.listWishList, function (item) {
                    //     return (item.ID != love.ID && item.CODE != love.CODE);
                    // });
                } else {
                    this.showError(data.Message)
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }
    changeListItem(ts: string) {
        switch (ts) {
            case 'gy':
                this.getAllMustSee(this.latitude, this.longitude);
                this.current_tab = 'gy';
                break;
            case 'yt':
                this.getAllWishlist(this.latitude, this.longitude);
                this.current_tab = 'yt';
                break;
        }
    }
}
