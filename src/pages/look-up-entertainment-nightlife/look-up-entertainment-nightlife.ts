import { Component, ViewChild } from '@angular/core';
import { updateImgs } from "ionic-angular/components/content/content";
import { Content } from "ionic-angular";
import { NavController, NavParams, AlertController, LoadingController, ToastController, Platform, Img, VirtualScroll, ModalController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { SightSeeingPage } from '../sight-seeing/sight-seeing';
import { MapRoutePage } from "../map-route/map-route";
import { PageBase } from '../../providers/page-base';

import { SearchLocationService, UltilitiesService, HobbyService, ServiceGetting, ShoppingService, EventService, HotelService } from '../../providers';
import { LocationLookupPage } from "../location-lookup/location-lookup";
import { Hobby } from "../../model/Hobby";
import { Service, Parameter } from "../../model/Service";
import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import _ from 'lodash';
import { LoginPage } from "../login/login";
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { EventDetailPage } from "../event-detail/event-detail";
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
    selector: 'page-look-up-entertainment-nightlife',
    templateUrl: 'look-up-entertainment-nightlife.html',
})
export class LookUpEntertainmentNightlifePage extends PageBase {
    @ViewChild(Content) _content: Content;
    @ViewChild('virtualScroll', { read: VirtualScroll }) virtualScroll: VirtualScroll;
    search: string;
    searchType: any;
    checkType: any;
    listlocation = [];
    listResult: any[];
    listLocationId: any[];
    listArea: any[];
    listChoiceAreaId: any[];
    bookId: number;
    listHobies: Hobby[];
    listServices: any[];
    listServicesBF: any[];
    listHobiesChoice = [];
    listHobiesChoiceId = [];
    listServicesChoice = [];
    listServicesChoiceBestResFor = [];
    listServicesChoiceId = [];
    lstServiceForEntertainment:any[] = [];
    listPlaces: any[];
    listSession:any[] = [];
    list = [];

    priceRange: string;

    listPrices: any[];

    listCategory: any[];
    listCategoryChoice: any[];

    isLocationEnabled: boolean;
    latitude: number;
    longitude: number;

    page_index: number;
    total: number;
    categoryMenu: boolean;
    priceMenu: boolean;
    serviceMenu: boolean;
    locationMenu: boolean;
    defaultLat: any;
    defaultLng: any;
    code: any;
    shop_type: any;
    entertainment_type: any = null;
    hotel_type: any;
    restaurant_type: any;
    sightseeing_type: any;
    ItemPlace: any;
    itemservice:any;
    isEntertained: any;
    
    page_on: boolean = true;
    first_time: boolean = true;

    checkfail: boolean = false;
    play_one: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public searchLocationService: SearchLocationService,
        public ultilitiesService: UltilitiesService,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public toastCtrl: ToastController,
        private geolocation: Geolocation,
        private _DIAGNOSTIC: Diagnostic,
        public platform: Platform,
        public modalCtrl: ModalController,
        public shoppingService: ShoppingService,
        public eventService: EventService,
        public hotelService: HotelService,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, ultilitiesService);
        this.listResult = [];
        this.listHobies = [];
        this.listServices = [];
        this.listChoiceAreaId = [];
        this.listCategory = [];
        this.listCategoryChoice = [];
        this.page_index = 0;
        this.total = 10;
        this.priceRange = "0-100000000";
        this.searchType = this.navParams.get("data");
        this.checkType = this.navParams.get("data");
        this.ItemPlace = "0";
        this.itemservice = "0";
        this.code = "";
        // console.log(this.searchType);
        this.isEntertained = this.navParams.get("isEntertained");
        if (this.isEntertained == undefined || this.isEntertained == null) {
            this.isEntertained = false;
        }

        this.locationMenu = false;
        this.serviceMenu = false;
        this.priceMenu = false;
        this.categoryMenu = false;

        this.shop_type = null;
        this.restaurant_type = null;
        this.hotel_type = null;
        this.sightseeing_type = null;
        // this.loadListCategories();
        // this.loadListArea();
        // this.loadServices();
        // this.changeFilterMoneyToString();
        this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);

    }

    init() {
        this.bookId = 0;
        this.LstPlaces();
        this.LstSession();
        if (this.searchType == "9") {
            this.serviceGetting.GetLisNightLifife().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listServices = data.Result;
                        // console.log(data.Result)
                        this.listServices.forEach(element => {
                            this.listServicesChoice.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        this.listServicesChoiceId = [];
                        this.listServicesChoice.forEach(element => {
                            this.listServicesChoiceId.push(element.code + "_" + element.id);
                        });
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
                        this.showError(data.Message, false)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                }
            );

        } else {
            
        }
        // var geolocationOptions = {
        //     enableHighAccuracy: true,
        //     maximumAge: 3000
        // };
        // this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode) => {
        //     if (this.page_on && ((this.platform.is("android") && locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF)
        //         || (this.platform.is("ios") && (locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
        //             || locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE
        //         )))) {
        //         if(this.first_time == 2) {
        //             this.showLoading();
        //             this.geolocation.getCurrentPosition(geolocationOptions).then((loc : any) =>
        //             {
        //                 this.latitude = loc.coords.latitude;
        //                 this.longitude = loc.coords.longitude;
        //                 this.getResultType(this.latitude, this.longitude, false);
        //             }).catch((error1 : any) => {
        //                 this.latitude = this.defaultLat;
        //                 this.longitude = this.defaultLng;
        //                 this.getResultType(this.latitude, this.longitude, false);
        //                 this.showError(this.translateService.translate("gps.error1"));
        //             });
        //         }
        //         this.first_time++;
        //     } 
        // });
        
    }

    caseNoLatLng() {
        this.latitude  = this.defaultLat;
        this.longitude = this.defaultLng;
        this.getResultType(this.latitude, this.longitude);
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

    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }

    LstPlaces() {
        this.listPlaces = [
            {
                "name": "Tất cả",
                "value": "0"
            },
            {
                "name": this.translateService.translate("lctlk.eat"),
                "value": "999"
            },
            {
                "name": this.translateService.translate("lctlk.entertainment"),
                "value": "8"
            }
            , {
                "name": this.translateService.translate("lctlk.see"),
                "value": "3"
            }
        ]
    }
    LstSession() {
        this.listSession = [
            {
                "name": "Tất cả",
                "value": "0"
            },
            {
                "name": "Ban đêm",
                "value": "1"
            }
        ]
    }
    changeWindowSize() {
        var itemList = document.getElementsByTagName("ion-item");
        var h = 0;
        var counting = 0;
        var bool = false;
        for (var i = 0; i < itemList.length; i++) {
            var element = itemList[i];
            if (element.classList.contains("loc-item")) {
                if (!bool) {
                    h = element.clientHeight;
                    bool = true;
                }
                var index = parseInt(element.attributes["id"].value.split("-")[1]);
                element.attributes["style"].nodeValue = "transform: translate3d(0px," + h * index + "px, 0px);";
                counting++;
            }
        }

        var list = document.getElementsByClassName("list-loc")[0];
        list.attributes["style"].nodeValue = "height: " + counting * h + "px;"
    }

    scrollToTop() {
        this._content.scrollToTop();
    }

    isLocationAvailable() {
        this.showLoading();

        var geolocationOptions = {
            enableHighAccuracy: true,
            maximumAge: 3000
        };
        this.geolocation.getCurrentPosition(geolocationOptions).then((loc : any) =>
        {
            //Your logic here
            this.latitude  = loc.coords.latitude;
            this.longitude = loc.coords.longitude;
            this.getResultType(this.latitude, this.longitude, false);
        }).catch((error1 : any) => {
            this.latitude  = this.defaultLat;
            this.longitude = this.defaultLng;
            this.getResultType(this.latitude, this.longitude, false);
            this.showError(this.translateService.translate("gps.error1"));
        });
    }

    // showToast(text) {
    //     let toast = this.toastCtrl.create({
    //         message: text,
    //         duration: 1,
    //         showCloseButton: true,
    //         position: 'bottom'
    //     });

    //     toast.onDidDismiss(() => {
    //         console.log('Dismissed toast');
    //     });

    //     toast.present();
    // }

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

    arraytoString(arr: any[]): string {
        var s = "";

        arr.forEach((element, index) => {
            if (index < arr.length - 1) {
                s += element + ",";
            }
        });

        s = s + arr[arr.length - 1];

        return s;
    }

    stringtoArray(s: string): any[] {
        var arr = [];
        if (s.indexOf(",") >= 0) {
            arr = s.split(",");
        } else {
            if (s.length > 0) {
                arr.push(s);
            }
        }
        return arr;
    }

    gotoDetail(obj) {
        var sta = localStorage.getItem("seen");
        var arr = this.stringtoArray(sta);
        if (arr.indexOf(obj.id.toString()) < 0) {
            arr.push(obj.id.toString() + "|" + obj.type.toString());
        }
        // console.log(arr);
        obj.seen = true;
        var ats = this.arraytoString(arr);
        localStorage.setItem("seen", ats);

        if (obj.type == "HOTEL") {
            this.navCtrl.push(HotelDetailPage, { item: obj.id, code: obj.type, obj: obj });
        }
        if (obj.type == "ENTERTAINMENT") {
            this.navCtrl.push(EntertainmentDetailPage, { item: obj.id, code: obj.type, obj: obj });
        }
        else if (obj.type == "RESTAURANT") {
            this.navCtrl.push(RestaurantDetailPage, { item: obj.id, code: obj.type, obj: obj });
        } else if (obj.type == "TPLACE") {
            this.navCtrl.push(SightSeeingPage, { item: obj.id, code: obj.type, obj: obj });
        } else if (obj.type == "ENTERTAINMENT") {
            this.navCtrl.push(EntertainmentDetailPage, { item: obj.id, code: obj.type, obj: obj });
        } else if (obj.type == "SHOP") {
            this.shoppingService.GetShopDetailH(obj.id, obj.type).subscribe(data => {
                if (data.Code === 200) {
                    let shop = data.Result;
                    this.navCtrl.push(ShopDetailPage, { item: shop, obj: obj });
                }
            });
        } else if (obj.type == "N_EVENTS") {
            this.eventService.GetDetailH(obj.id, obj.type).subscribe(data => {
                if (data.Code === 200) {
                    // this.current_event = data.Result[0];
                    // console.log(this.current_event);
                    // this.navCtrl.push(EventDetailPage, { id: obj.id });
                    this.navCtrl.push(EventDetailPage, { item: data.Result, obj: obj });
                }
            }, error => {
                //console.log(error)
            });
        }
        this.closeAllListMenu();
    }

    showTypeText(searchType) {
        switch (parseInt(searchType)) {
            case 1:
                return this.translateService.translate("lctlk.stay");
            case 2:
                return this.translateService.translate("lctlk.eat");
            case 3:
                return this.translateService.translate("lctlk.see");
            case 5:
                return this.translateService.translate("lctlk.shopping");
            case 7:
                return this.translateService.translate("lctlk.event");
            case 8:
                return this.translateService.translate("lctlk.entertainment");
            case 9:
                return this.translateService.translate("lctlk.nightlife");
            case 999:
                return this.translateService.translate("overview.karaoke");
            default:
                return this.translateService.translate("lctlk.all");
        }
    }

    updateType(ts) {
        this.searchType = ts;
        this.hotel_type = null;
        this.isEntertained = false;

        this.isLocationAvailable();

        this.closeAllListMenu();
    }

    closeAllListMenu() {
        var element = document.getElementsByClassName('content-list');
        var element1 = document.getElementsByClassName('type-top-list');
        var arr = [].slice.call(element);
        var arr1 = [].slice.call(element1);

        for (var index = 0; index < arr.length; index++) {
            var item = element.item(index);
            item.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        }
        for (var index = 0; index < arr1.length; index++) {
            var item = element1.item(index);
            item.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        }
    }

    showContentList(event, ts: string) {
        var target = event.srcElement.nextElementSibling;
        if (event.srcElement.localName == "img") {
            target = event.srcElement.parentNode.nextElementSibling;
        }
        // console.log(target);
        if (target.style.visibility == "hidden") {
            this.closeAllListMenu();
            switch (ts) {
                case 'location':
                    this.locationMenu = true;
                    this.serviceMenu = false;
                    this.priceMenu = false;
                    this.categoryMenu = false;

                    break;
                case 'service':
                    this.locationMenu = false;
                    this.serviceMenu = true;
                    this.priceMenu = false;
                    this.categoryMenu = false;

                    break;
                case 'price':
                    this.locationMenu = false;
                    this.serviceMenu = false;
                    this.priceMenu = true;
                    this.categoryMenu = false;

                    break;
                case 'category':
                    this.locationMenu = false;
                    this.serviceMenu = false;
                    this.priceMenu = false;
                    this.categoryMenu = true;
                    break;
            }
            target.style.visibility = "visible";
            target.style.opacity = "1";
            target.style.zIndex = "2";
            target.style.transform = "translateY(0%)";
            //document.getElementById(ts).style.webkitTransform = "translateY(0%)";
            target.style.transitionDelay = "0s, 0s, 0.3s";
            //document.getElementById(ts).style.webkitTransitionDelay = "0s, 0s, 0.3s";
            target.style.transitionProperty = "all, visibility, z-index";
            //document.getElementById(ts).style.webkitTransitionProperty = "all, visibility, z-index";
            target.style.transitionDuration = "0.3s, 0s, 0s";
            //document.getElementById(ts).style.webkitTransitionDuration = "0.3s, 0s, 0s";
            //document.getElementById(ts).style.webkitTransitionTimingFunction = "ease-in-out, linear, linear";
            target.style.transitionTimingFunction = "ease-in-out, linear, linear";
        } else {
            target.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            // document.getElementById(ts).setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            this.locationMenu = false;
            this.serviceMenu = false;
            this.priceMenu = false;
            this.categoryMenu = false;
        }
    }
    chooseArea(id: number) {
        this.listChoiceAreaId = [];
        this.listChoiceAreaId.push(id);
        this.getResultFilter();
        this.closeAllListMenu();
    }
    allArea() {
        this.listChoiceAreaId = [];
        this.getResultFilter();
        // document.getElementById("location").setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        this.closeAllListMenu();
    }

    updatePriceRange(ts: string) {
        this.priceRange = ts;
        //console.log(this.priceRange);
        this.getResultFilter();
        // document.getElementById("price").setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        this.closeAllListMenu();
    }

    changeFilterMoneyToString() {
        this.listPrices = [];
        this.priceRange = "0-100000000";
        if (this.searchType == "1") {
            this.listPrices = [
                { "name": this.translateService.translate("map.any"), "value": "0-100000000" },
                { "name": this.translateService.translate("map.lower") + " 500.000đ", "value": "0-500000" },
                { "name": "500.000đ - 1.000.000đ", "value": "500000-1000000" },
                { "name": "1.000.000đ - 3.000.000đ", "value": "1000000-3000000" },
                { "name": "3.000.000đ - 5.000.000đ", "value": "3000000-5000000" },
                { "name": "5.000.000đ - 10.000.000đ", "value": "5000000-10000000" },
                { "name": this.translateService.translate("map.higher") + " 10.000.000đ", "value": "10000000-100000000" },
            ];
        } else if (this.searchType == "2") {
            this.listPrices = [
                { "name": this.translateService.translate("map.any"), "value": "0-100000000" },
                { "name": this.translateService.translate("map.lower") + " 100.000đ", "value": "0-100000" },
                { "name": "100.000đ - 300.000đ", "value": "100000-300000" },
                { "name": "300.000đ - 500.000đ", "value": "300000-500000" },
                { "name": this.translateService.translate("map.higher") + " 500.000đ", "value": "500000-100000000" },
            ];
        } else if (this.searchType == "3") {
            this.listPrices = [
                { "name": this.translateService.translate("map.any"), "value": "0-100000000" },
                { "name": this.translateService.translate("map.free"), "value": "0-0" },
                { "name": this.translateService.translate("map.fee"), "value": "1-100000000" },
            ];
        } else if (this.searchType == null) {
            this.listPrices = [];
        }
        // switch(this.filterOption.rating) {
        //     case 1:
        //         return "0-500000";
        //     case 2:
        //         return "500000-1000000";
        //     case 3:
        //         return "1000000-3000000";
        //     case 4:
        //         return "3000000-5000000";
        //     case 5:
        //         return "5000000-10000000";
        //     case 6:
        //         return "10000000-100000000";
        //     default:
        //         return null;
        // }
    }

    getResultType(latitude, longitude, loading = true) {
        if (!loading) {
            this.scrollToTop();
        }
        if (loading) {
            this.showLoading();
        }
        this.page_index = 0;
        this.listlocation = [];
        this.listHobiesChoiceId = [];
        this.listChoiceAreaId = [];
        this.priceRange = "0-100000000";
        // console.log(this.searchType);
        let code = this.getCode(this.searchType);
        var sta = localStorage.getItem("seen");
        var arr = this.stringtoArray(sta);
        // console.log(this.listServicesChoiceId);
        this.searchLocationService.SearchByTypeAndServices(code, latitude + "," + longitude, 10, this.page_index, this.hotel_type, this.listServicesChoiceId).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listResult = [];
                    this.listResult = _.concat(this.listResult, data.Result);
                    this.total = data.Message.split("-")[1];
                    this.listResult.forEach(element => {
                        // console.log(localStorage.getItem("seen"));
                        this.listlocation.push({
                            id: element.LOCATION_ID,
                            name: element.LOCATION_NAME,
                            imgURL: (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png",
                            type: element.LOCATION_TYPE,
                            book_id: element.LOCATION_LIKE_ID,
                            total_bm: element.LOCATION_TOTAL_LIKE,
                            address: element.LOCATION_ADDRESS,
                            distance: Math.round(element.LOCATION_DISTANCE * 1.3 * 1000),
                            googlemap: element.GEO_LOCATION,
                            seen: arr.length > 0 ? arr.indexOf(element.LOCATION_ID.toString() + "|" + element.LOCATION_TYPE) >= 0 : false
                        });
                    });
                    setTimeout(() => {
                        this.loading.dismiss().then(() => {
                            this.loadListArea();
                            this.loadListCategories();
                            this.changeFilterMoneyToString();
                            this.loadServices().then(() => {
                                this.play_one = 0;
                            });;
                        });
                    });
                } else {
                    this.showError(data.Message)
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );


        // var listPageImage = document.getElementsByTagName("img");
        // for (var index = 0; index < listPageImage.length; index++) {
        //     listPageImage.item(index).onerror =  function() {
        //         listPageImage.item(index).src = "assets/iconImages/noimage.png";
        //     };
        // }

    }
    getCode(id) {
        switch (id) {
            case 1:
                return "HOTEL";
            case "1":
                return "HOTEL";

            case 2:
            case 999:
                return "RESTAURANT";
            case "2":
            case "999":
                return "RESTAURANT";
            case 3:
                return "TPLACE";
            case "3":
                return "TPLACE";
            case 5:
                return "SHOP";
            case "5":
                return "SHOP";
            case 7:
                return "N_EVENTS";
            case "7":
                return "N_EVENTS";
            case 8:
                return "ENTERTAINMENT";
            case "8":
                return "ENTERTAINMENT";
            default:
                return "RESTAURANT,TPLACE,ENTERTAINMENT";
        }
    }
    getResultFilter() {
        this.showLoading();
        this.page_index = 0;
        this.geolocation.getCurrentPosition()
            .then((data: any) => {
                this.latitude = data.coords.latitude;
                this.longitude = data.coords.longitude;
                this.listlocation = [];
                var searchType = [];
                var code = this.getCode(this.searchType);
                if (this.searchType != null) {
                    searchType.push(code);
                }
                var sta = localStorage.getItem("seen");
                var arr = this.stringtoArray(sta);

                if(this.listServicesChoiceId.length == 0) {
                    // this.listServices.forEach(element => {
                    //     this.listServicesChoice.push(
                    //         {
                    //             name: element.NAME,
                    //             checked: false,
                    //             id: element.ID,
                    //             code: element.CODE
                    //         }
                    //     );
                    // });
                    this.listServicesChoiceId = [];
                    this.listServicesChoice.forEach(element => {
                        this.listServicesChoiceId.push(element.code + "_" + element.id);
                    });
                }

                this.searchLocationService.SearchByFilterBarDistance(searchType, this.listChoiceAreaId, this.priceRange, this.listHobiesChoiceId, this.listServicesChoiceId, this.latitude + "," + this.longitude, 10, this.page_index, this.shop_type, this.hotel_type).subscribe(
                    data => {
                        if (data.Code === 200) {
                            // console.log(data.Result)
                            this.listResult = [];
                            this.listResult = _.concat(this.listResult, data.Result);

                            this.total = data.Message.split("-")[1];

                            this.listResult.forEach(element => {
                                // check book mark
                                this.listlocation.push({
                                    id: element.LOCATION_ID,
                                    name: element.LOCATION_NAME,
                                    imgURL: (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png",
                                    type: element.LOCATION_TYPE,
                                    book_id: element.LOCATION_LIKE_ID,
                                    total_bm: element.LOCATION_TOTAL_LIKE,
                                    address: element.LOCATION_ADDRESS,
                                    distance: Math.round(element.LOCATION_DISTANCE * 1.3 * 1000),
                                    googlemap: element.GEO_LOCATION,
                                    seen: arr.length > 0 ? arr.indexOf(element.LOCATION_ID.toString() + "|" + element.LOCATION_TYPE) >= 0 : false
                                });
                            });
                            setTimeout(() => {
                                this.scrollToTop();
                                this.loading.dismiss();
                            });
                        } else {
                            this.showError(data.Message)
                        }
                    },
                    error => {
                        this.showError(this.translateService.translate("network.error"));
                    }
                );
            })
            .catch((error: any) => {
                //console.log('Error getting location', error);
            });
    }
    checkBookMark(id, code) {
        this.hotelService.checkBookMark(id, code, "PLACE").subscribe(
            data => {
                if (data.Code === 200) {
                    if (data.Result == null) {
                        this.bookId = 0;
                    } else {
                        this.bookId = data.Result[0].ID;
                    }
                } else {
                    this.showError(data.Message);
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }

    loadListArea() {
        // this.showLoading();
        this.listArea = [];
        this.ultilitiesService.GetListArea(Parameter.portalifier).subscribe(
            data => {
                if (data.Code === 200) {
                    //console.log(data.Result);
                    this.listLocationId = [];
                    this.listLocationId = _.concat(this.listLocationId, data.Result);

                    this.listLocationId.forEach(element => {
                        this.listArea.push({
                            id: element.ID,
                            name: element.NAME,
                            code: element.CODE
                        });
                    });

                    setTimeout(() => {
                    });
                } else {
                    this.showError(data.Message, false);
                }

            },
            error => {
                this.showError(this.translateService.translate("network.error"), false);
            }
        );
    }

    async loadServices() {
        this.listServicesChoice = [];
        this.listServices = [];
        this.listServicesBF = [];
        this.listServicesChoiceBestResFor = [];
       
        if (this.searchType == "8") {
            //loại giải trí
            this.serviceGetting.GetListEntertainmentCategory().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listServices = _.concat(this.listServices, data.Result);
                        this.listServices.forEach(element => {
                            this.listServicesChoice.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        //console.log(this.listServicesChoice);
                        setTimeout(() => {
                        });
                    } else {
                        this.showError(data.Message, false)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                }
            );

            this.serviceGetting.GetLisNightLifife().subscribe(
                data => {
                    if (data.Code === 200) {
                        data.Result.forEach(element => {
                            this.lstServiceForEntertainment.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        setTimeout(() => {
                        });
                    } else {
                        this.showError(data.Message, false)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                }
            );

        }
        // về đêm
        if (this.searchType == "9") {
            this.serviceGetting.GetLisNightLifife().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listServices = _.concat(this.listServices, data.Result);
                        this.listServices.forEach(element => {
                            this.listServicesChoice.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        //console.log(this.listServicesChoice);
                        setTimeout(() => {
                        });
                    } else {
                        this.showError(data.Message, false)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                }
            );

        }
        
        if (this.searchType == null) {
            this.listServicesChoice = [];
            this.listServices = [];
        }
    }

    updateChoice(itemH) {
        if (itemH.checked == true) {
            itemH.checked = false;
        } else {
            itemH.checked = true;
        }
    }
    updatePlaceChoice(ts: any) {
        this.ItemPlace = ts.value;
        this.searchType = ts.value;
        this.getResultFilter();
        this.closeAllListMenu();
    }
    // buổi lấy những entertainment có service type là NIGHTLIFE
    updatePlaceService(ts: any) {
        this.itemservice = ts.value;
        this.listServicesChoiceId = [];
        console.log(this.lstServiceForEntertainment)
        if(ts.value == "1"){
            this.lstServiceForEntertainment.forEach(element => {
                this.listServicesChoiceId.push(element.code + "_" + element.id);
            });
        }
        console.log(this.listServicesChoiceId)
        this.getResultFilter();
        this.closeAllListMenu();
    }
    updateHobbyChoice() {
        this.listHobiesChoiceId = [];
        this.listHobiesChoice.forEach(element => {
            if (element.checked) {
                this.listHobiesChoiceId.push(element.id);
            }
        });
        this.getResultFilter();
        this.closeAllListMenu();
    }

    updateServiceChoice() {
        // 8 là giải trí
        this.listServicesChoiceId = [];
            this.listServicesChoice.forEach(element => {
                if (element.checked) {
                    this.listServicesChoiceId.push(element.code + "_" + element.id);
                }
            });
        this.getResultFilter();
        this.closeAllListMenu();
    }
    updateEntertainmentChoice(){
        console.log(this.listServicesChoiceId)
        this.hotel_type = null;
        if (this.searchType == "8") {
            this.listServicesChoice.forEach(element => {
                    if (element.checked) {
                        this.hotel_type = this.hotel_type + element.id + ",";
                    }
            });
        }
        this.getResultFilter();
        this.closeAllListMenu();
    }
    resetEntertainmentChoice(){
        this.listServicesChoice.forEach(element => {
            if (element.checked) {
                element.checked = false;
            }
        });
        this.hotel_type = null;
        this.getResultFilter();
        this.closeAllListMenu();
    }

    resetServiceChoice() {
        this.listServicesChoice.forEach(element => {
            if (element.checked) {
                element.checked = false;
            }
        });
        if (this.searchType == "9") {

        } else {
            this.listServicesChoiceId = [];
            this.hotel_type = null;
        }

        this.getResultFilter();
        this.closeAllListMenu();
    }

    moveToLocationLookup() {
        this.navCtrl.push(LocationLookupPage, { searchType: this.searchType });
    }

    loadListCategories() {
        if (this.searchType == "3") {
            this.serviceGetting.GetListTravelCategory().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listCategory = [];
                        this.listCategoryChoice = [];
                        this.listCategory = _.concat(this.listCategory, data.Result);
                        this.listCategory.forEach(element => {
                            this.listCategoryChoice.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        //console.log(this.listCategoryChoice);
                        setTimeout(() => {
                            // this.loading.dismiss();
                        });
                    } else {
                        this.showError(data.Message, false);
                    }
                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                });
        }
        if (this.searchType == "2") {
            this.serviceGetting.GetListRestaurantCategory().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listCategory = [];
                        this.listCategoryChoice = [];
                        this.listCategory = _.concat(this.listCategory, data.Result);
                        // console.log(data.Result)
                        this.listCategory.forEach(element => {
                            this.listCategoryChoice.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        //console.log(this.listCategoryChoice);
                        setTimeout(() => {
                            // this.loading.dismiss();
                        });
                    } else {
                        this.showError(data.Message, false);
                    }
                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                });
        }
        if (this.searchType == "1") {
            this.listCategory = [];
            this.listCategoryChoice = [];
            this.hotelService.getHotelType().subscribe(data => {
                if (data.Code === 200) {
                    data.Result.forEach(element => {
                        this.listCategoryChoice.push(
                            {
                                name: element.NAME,
                                checked: false,
                                id: element.ID,
                                code: element.CODE
                            }
                        );
                    });
                }
            });
        }

        if (this.searchType == "5") {
            this.shoppingService.GetTypeShoppingListPage().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listCategory = [];
                        this.listCategoryChoice = [];
                        this.listCategory = _.concat(this.listCategory, data.Result);
                        this.listCategory.forEach(element => {
                            this.listCategoryChoice.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        //console.log(this.listCategoryChoice);
                        setTimeout(() => {
                            // this.loading.dismiss();
                        });
                    } else {
                        this.showError(data.Message, false);
                    }
                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                });
        }

        if (this.searchType == null || this.searchType == "7") {
            this.listCategory = [];
            this.listCategoryChoice = [];
        }
    }

    setEntertainment() {
        this.hotel_type = 'ENTERTAINMENT';
        this.isEntertained = true;
        this.searchType = '999';
        this.isLocationAvailable();
        this.closeAllListMenu();
        // this.getResultFilter();
    }

    updatingFunction(item) {
        //console.log(this.searchType);
        if (item == null) {
            this.sightseeing_type = null;
            this.restaurant_type = null;
            // this.listServicesChoiceId = [];
            this.hotel_type = null;
            this.shop_type = null;
            this.entertainment_type = null;
            this.getResultFilter();
        } else {
            if (this.searchType == "1" || this.searchType == "2" || this.searchType == "3" || this.searchType == "5" || this.searchType == "8" || this.searchType == 1 || this.searchType == 2 || this.searchType == 3 || this.searchType == 5 || this.searchType == 8) {
                this.hotel_type = item.id;
                this.getResultFilter();
            }

            if (this.searchType == null || this.searchType == "7" || this.searchType == 7) {
                this.hotel_type = null;
                this.getResultFilter();
            }
            // }
        }

        this.closeAllListMenu();
    }

    toggleSaveWishList(event: MouseEvent, location) {
        var type = location.id != null ? ((location.type.indexOf("_") !== -1) ? "EVENTS" : "PLACE") : "PLACE";
        event.stopPropagation();
        this.checkToken().then(
            data => {
                if (data) {
                    if (location.book_id == 0) {
                        this.searchLocationService.saveWishListH(location.id, location.type, type).subscribe(
                            data => {
                                if (data.Code === 200) {
                                    location.book_id = data.Result.ID;
                                    // location.id = data.Result.PLACE_ID;
                                    //location.type = data.Result.PLACE_CODE;
                                    location.total_bm = location.total_bm + 1;
                                    this.showToastWithCloseButton(this.translateService.translate("mysaved.tick"));
                                } else {
                                    this.showError(data.Message, false)
                                }
                            },
                            error => {
                                this.showError(this.translateService.translate("network.error"), false);
                            }
                        );
                    } else {
                        this.searchLocationService.removeSaveWishListH(location.id, location.type, type).subscribe(
                            data => {
                                if (data.Code === 200) {
                                    location.book_id = 0;
                                    location.total_bm = location.total_bm - 1;
                                    this.showToastWithCloseButton(this.translateService.translate("mysaved.untick"));
                                } else {
                                    this.showError(data.Message, false)
                                }
                            },
                            error => {
                                this.showError(this.translateService.translate("network.error"), false);
                            }
                        );
                    }
                } else {
                    let modal = this.modalCtrl.create(LoginPage);
                    modal.present();

                    modal.onDidDismiss(data => {
                        this.getResultFilter();
                    })
                }
            });
        return false;
    }

    directionMap(event: MouseEvent, latLngMap, type) {
        event.stopPropagation();
        console.log(type);
        if (type == "HOTEL") {
            this.navCtrl.push(MapRoutePage, { locations: latLngMap, type: "stay" });
        } else if (type == "RESTAURANT") {
            this.navCtrl.push(MapRoutePage, { locations: latLngMap, type: "eat" });
        } else if (type == "TPLACE") {
            this.navCtrl.push(MapRoutePage, { locations: latLngMap, type: "see" });
        } else if (type == "SHOP") {
            this.navCtrl.push(MapRoutePage, { locations: latLngMap, type: "shop" });
        } else if (type == "N_EVENTS") {
            this.navCtrl.push(MapRoutePage, { locations: latLngMap, type: "event" });
        }else if (type == "ENTERTAINMENT") {
            this.navCtrl.push(MapRoutePage, { locations: latLngMap, type: "entertainment" });
        }
    }

    showToastWithCloseButton(message: string) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: false,
            duration: 1,
            position: "middle"
        });
        toast.present();
    }

    doInfinite(infiniteScroll) {

        if (this.total == 10) {
            this.page_index = this.page_index + 1;
            var searchType = [];
            if (this.searchType != null) {
                let code = this.getCode(this.searchType);
                searchType.push(code);
            } else {
                let code = this.getCode(null);
                searchType.push(code);
            }
            var sta = localStorage.getItem("seen");
            var arr = this.stringtoArray(sta);
            this.searchLocationService.SearchByFilterBarDistance(searchType, this.listChoiceAreaId, this.priceRange, this.listHobiesChoiceId, this.listServicesChoiceId, this.latitude + "," + this.longitude, 10, this.page_index, this.shop_type, this.hotel_type).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listResult = [];
                        this.listResult = _.concat(this.listResult, data.Result);

                        this.total = data.Message.split("-")[1];

                        this.listResult.forEach(element => {

                            this.listlocation.push({
                                id: element.LOCATION_ID,
                                name: element.LOCATION_NAME,
                                imgURL: (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png",
                                type: element.LOCATION_TYPE,
                                book_id: element.LOCATION_LIKE_ID,
                                total_bm: element.LOCATION_TOTAL_LIKE,
                                address: element.LOCATION_ADDRESS,
                                distance: Math.round(element.LOCATION_DISTANCE * 1.3 * 1000),
                                googlemap: element.GEO_LOCATION,
                                seen: arr.length > 0 ? arr.indexOf(element.LOCATION_ID.toString()) >= 0 : false
                            });
                        });
                        setTimeout(() => {
                            for (var index = 0; index < document.images.length; index++) {
                                var element = document.images[index];
                                if (element.parentElement.localName == "ion-img") {
                                    element.setAttribute("onerror", "this.src='assets/iconImages/noimage.png'");
                                }
                            }
                            infiniteScroll.complete();
                        });
                    } else {
                        this.page_index = this.page_index - 1;
                        this.showError(data.Message, false);
                    }
                    // console.log(this.listlocation.length);
                    // console.log(this.total);
                    // console.log(this.page_index);
                },
                error => {
                    this.page_index = this.page_index - 1;
                    this.showError(this.translateService.translate("network.error"), false);
                }
            );
        } else {
            infiniteScroll.complete();
        }
    }

}
