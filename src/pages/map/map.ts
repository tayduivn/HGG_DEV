import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform, ModalController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

import { EventShowPage } from '../event-show/event-show';
import { LookUpPage } from '../look-up/look-up';

import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';
import { UserPage } from "../user/user";
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService, ShoppingService } from '../../providers';
import { Hobby } from '../../model/Hobby';
import { Service } from '../../model/Service';
//import { LocationSearch } from '../../model/LocationSearch';
import { PlanPage } from "../plan/plan";
import { PlanV2Page } from "../plan-v2/plan-v2";
import { OverViewPage } from "../over-view/over-view";
import { SightSeeingPage } from "../sight-seeing/sight-seeing";
import { ShowUserInfo } from "../../providers/show-user-info";

import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';
import { ARView } from "../ar-view/ar-view";
import { ShopDetailPage } from '../shop-detail/shop-detail';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var google;
declare var MarkerWithLabel;

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage extends PageBase {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    options: any;
    styles: any;

    listLocation = [];

    filterOption = { see: true, stay: true, eat: true, shop: true, entertainment: true, other: true, range: 0.4, rating: 0, money: "0-100000000" };
    strType: any[];
    search: any;

    listResult = []; listResultC: any[];
    listMarker = [];

    chosenMarker: any;
    chosenIndex: any;

    listHobiesTravel: any[];
    listHobiesFB: any[];
    listServicesTravel: any[];
    listServicesFB: any[];
    listServicesFO: any[];

    listHobiesChoice3 = [];
    listHobiesChoice2 = [];

    listHobiesChoiceId = [];
    listServicesChoice1 = [];
    listServicesChoice2 = [];
    listServicesChoice3 = [];
    listServicesChoiceId = [];

    currentMarker: any;

    listPrices: any[];

    latitude: any;
    longitude: any;

    currentClick: any;

    public isLocationEnabled: boolean = false;
    directionsService: any;
    directionsDisplay: any[];

    duration: any;
    distance: any;

    listUpdate: any[];

    defaultLat: any;
    defaultLng: any;

    tabActive: boolean;

    page_on: boolean = true;

    checkfail: boolean = false;
    play_one: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
        private _DIAGNOSTIC: Diagnostic,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public platform: Platform,
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController,
        public shoppingService: ShoppingService,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listHobiesTravel = [];
        this.listHobiesFB = [];
        this.listServicesTravel = [];
        this.listServicesFB = [];
        this.listServicesFO = [];
        this.listUpdate = [];
        this.strType = ["HOTEL", "RESTAURANT", "TPLACE", "SHOP", "ENTERTAINMENT"];
        this.listResultC = [];
        this.directionsDisplay = [];
        this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
        this.latitude = this.defaultLat;
        this.longitude = this.defaultLng;
        this.currentClick = { imgURL: "", name: "", address: "", range: "" };
        this.directionsService = new google.maps.DirectionsService();
        // this.isLocationAvailable();

        this.tabCamKeyActive();

    }

    tabCamKeyActive() {
        this.showUserInfo.getCamKey().subscribe((data) => {
            if (data.Code === 200) {
                if (data.Result == "" || data.Result == null || data.Result == undefined || data.Result == "null" || data.Result == "undefined") {
                    this.tabActive = false;
                } else {
                    this.tabActive = true;
                }
            } else {
                this.tabActive = false;
            }
        }, error => {
            this.tabActive = false;
        });
    }

    caseNoLatLng() {
        this.latitude  = this.defaultLat;
        this.longitude = this.defaultLng;
        this.initMap(this.latitude, this.longitude);
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
        this.showLoading();
        this.geolocation.getCurrentPosition({maximumAge: 10000, enableHighAccuracy: true}).then((data: any) => {
            this.latitude = data.coords.latitude;
            this.longitude = data.coords.longitude;
            this.initMap(this.latitude, this.longitude);
        }).catch((error: any) => {
            this.latitude = this.defaultLat;
            this.longitude = this.defaultLng;
            this.initMap(this.latitude, this.longitude);
            this.loading.dismiss();
            this.showError(this.translateService.translate("gps.error1"));
        });
        
        // } else {
        //     this._DIAGNOSTIC.isLocationAvailable().then((isAvailable) => {
        //         this.geolocation.getCurrentPosition({
        //             timeout: 16000, maximumAge: 10000, enableHighAccuracy: true
        //         })
        //         .then((data : any) =>
        //         {
        //             this.latitude  = data.coords.latitude;
        //             this.longitude = data.coords.longitude;
        //             this.initMap(this.latitude, this.longitude);
        //         })
        //         .catch((error : any) =>
        //         {
        //             console.log('Error getting location', error);
        //         });
        //     });
        // }

        // this._DIAGNOSTIC.isLocationAvailable()
        // .then((isAvailable) => {
        //     this.isLocationAvailable = isAvailable;
        //     if(!isAvailable && !this.platform.is("ios")) {
        //         this.initMap(false);
        //         this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode, permissionStatus) => {
        //             // this.showError(locationMode + ", " + permissionStatus);
        //             this._DIAGNOSTIC.isLocationAvailable().then((isAvailable) => {
        //                 if(isAvailable) {
        //                     this.initMap();
        //                 }
        //             });

        //         });
        //         let alert = this.alertCtrl.create({
        //             title: this.translateService.translate("error.title"),
        //             subTitle: "Hiện không bật GPS, hệ thống hoạt động không chính xác",
        //             buttons: [{
        //                 text: "OK",
        //                 handler: () => {
        //                     // if() {
        //                     //     this._DIAGNOSTIC.switchToSettings();
        //                     // } else {
        //                         this._DIAGNOSTIC.switchToLocationSettings();
        //                     // }
        //                 }
        //             }]
        //         });
        //         alert.present();

        //     } else {
        //         this.initMap();
        //     }
        // })
        // .catch((error : any) =>
        // {
        //     console.dir('Location is:' + error);
        // });
    }

    init() {
        this.search = "";
        this.options = {
            frequency: 3000,
            enableHighAccuracy: true
        };

        this.styles = {
            hide: [
                {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'transit',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    elementType: 'geometry', stylers: [{ color: '#ebe3cd' }]
                },
                {
                    elementType: 'labels.text.fill', stylers: [{ color: '#523735' }]
                },
                {
                    elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }]
                },
                {
                    featureType: 'administrative',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#c9b2a6' }]
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#dcd2be' }]
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#ae9e90' }]
                },
                {
                    featureType: 'landscape.natural',
                    elementType: 'geometry',
                    stylers: [{ color: '#dfd2ae' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f1e6' }]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'geometry',
                    stylers: [{ color: '#fdfcf8' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{ color: '#f8c967' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#e9bc62' }]
                },
                {
                    featureType: 'road.highway.controlled_access',
                    elementType: 'geometry',
                    stylers: [{ color: '#e98d58' }]
                },
                {
                    featureType: 'road.highway.controlled_access',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#db8555' }]
                },
                {
                    featureType: 'road.local',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#806b63' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#b9d3c2' }]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        };
        
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

    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }

    getCurrentMarker(latitude, longitude) {
        let latLng = new google.maps.LatLng(latitude, longitude);
        this.map.setCenter(latLng);
        this.map.panTo(latLng);

        this.currentMarker.setMap(this.map);
        this.currentMarker.setPosition(latLng);
        setTimeout(() => {
            this.loading.dismiss().then(() => {
                this.loadHobbies();
                
                this.changeFilterMoneyToString();
                this.loadServices().then(() => {
                    this.play_one = 0;
                });
            });
        });
    }

    initMap(latitude, longitude) {
        let mapOptions = {
            zoom: 18,
            disableDefaultUI: true,
            styles: this.styles['hide']
            //mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.currentMarker = new google.maps.Marker({
            icon: "assets/images/current-resize.gif",
        });

        this.getCurrentMarker(latitude, longitude);
        google.maps.event.addListener(this.map, 'dragend', () => { this.updateListLication(this.map.getCenter().lat(), this.map.getCenter().lng()) });
    }

    updateListLication(lat, lng) {
        //send filter option to server
        //get and transfer to list location

        //show
        this.loadListLocation();
    }

    moveToLocation(lat, lng) {
        this.geolocation.getCurrentPosition(this.options).then((position) => {
            var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.panTo(center);

            this.currentMarker.setPosition(center);
        }, (err) => {
            //console.log(err);
        });

    }

    changeFilterRatingToString() {
        switch (this.filterOption.rating) {
            case 1:
                return "0-5";
            case 2:
                return "5-7";
            case 3:
                return "7-9";
            case 4:
                return "9-10";
            default:
                return null;
        }
    }

    changeFilterMoneyToString() {
        this.listPrices = [];
        this.filterOption.money = "0-100000000";
        if (this.filterOption.eat == false && this.filterOption.see == false && this.filterOption.stay == true) {
            this.listPrices = [
                { "name": this.translateService.translate("map.any"), "value": "0-100000000" },
                { "name": this.translateService.translate("map.lower") + " 500.000đ", "value": "0-500000" },
                { "name": "500.000đ - 1.000.000đ", "value": "500000-1000000" },
                { "name": "1.000.000đ - 3.000.000đ", "value": "1000000-3000000" },
                { "name": "3.000.000đ - 5.000.000đ", "value": "3000000-5000000" },
                { "name": "5.000.000đ - 10.000.000đ", "value": "5000000-10000000" },
                { "name": this.translateService.translate("map.higher") + " 10.000.000đ", "value": "10000000-100000000" },
            ];
        } else if (this.filterOption.eat == true && this.filterOption.see == false && this.filterOption.stay == false) {
            this.listPrices = [
                { "name": this.translateService.translate("map.any"), "value": "0-100000000" },
                { "name": this.translateService.translate("map.lower") + " 100.000đ", "value": "0-100000" },
                { "name": "100.000đ - 300.000đ", "value": "100000-300000" },
                { "name": "300.000đ - 500.000đ", "value": "300000-500000" },
                { "name": this.translateService.translate("map.higher") + " 500.000đ", "value": "500000-100000000" },
            ];
        } else if (this.filterOption.eat == false && this.filterOption.see == true && this.filterOption.stay == false) {
            this.listPrices = [
                { "name": this.translateService.translate("map.any"), "value": "0-100000000" },
                { "name": this.translateService.translate("map.free"), "value": "0-0" },
                { "name": this.translateService.translate("map.fee"), "value": "1-100000000" },
            ];
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

    // set to display on map
    loadListLocation() {
        this.showLoading();
        this.listLocation = [];
        var mapCenter = this.map.getCenter();
        // console.log(this.listHobiesChoiceId);
        this.searchLocationService.SearchByCondition(this.filterOption.range * 1000, mapCenter.lat(), mapCenter.lng(), this.listHobiesChoiceId, this.listServicesChoiceId, this.changeFilterRatingToString(), this.filterOption.money, this.strType).subscribe(
            data => {
                //console.log(data);
                if (data.Code === 200) {
                    this.listResultC = [];
                    this.listResultC = _.concat(this.listResultC, data.Result);
                    // console.log(this.listResultC);
                    //let data1 = moment().format('YYYYMMDD');
                    //console.log(data.Result);
                    if (this.listResultC.length > 0) {
                        this.listResultC.forEach(element => {
                            if (element.GEO_LOCATION != null) {
                                this.listLocation.push({
                                    id: element.LOCATION_ID,
                                    name: element.LOCATION_NAME,
                                    imgURL: element.LOCATION_AVATAR ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png",
                                    type: element.LOCATION_TYPE,
                                    latitude: parseFloat(element.GEO_LOCATION.split(",")[0].trim()),
                                    longitude: parseFloat(element.GEO_LOCATION.split(",")[1].trim()),
                                    address: element.LOCATION_ADDRESS,
                                    locationType: { slug: this.getSlugType(element.LOCATION_TYPE) },
                                    subType: element.SUBTYPE,
                                    locations: element.GEO_LOCATION,
                                });
                            }
                        });
                        //console.log(this.listLocation);
                    }

                    // console.log(this.listLocation);
                    this.loadMarker();
                    setTimeout(() => {
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
    }

    getImageForType(type): string {
        return "assets/images/" + type + ".png";
    }

    getAllLocation() {
        this.loadListLocation();
    }

    // changeToHomePage() {
    //     this.navCtrl.setRoot(EventShowPage);
    // }
    // changeToUserPage() {
    //     this.navCtrl.setRoot(UserPage);
    // }
    // changeToPlanPage() {
    //     this.navCtrl.setRoot(PlanV2Page);
    // }
    // changeToOverViewPage() {
    //     this.navCtrl.setRoot(OverViewPage);
    // }
    closePopUpSearch() {
        document.getElementById("searchPopUp").style.display = "none";
    }
    openPopUpSearch() {
        document.getElementById("searchPopUp").style.display = "block";
    }

    chooseFilter(ts: string) {
        this.chooseFilterOnPopUp(ts);
    }

    updateListHint() {
        if (((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            // this.showLoading();
            //console.log(this.search);
            this.searchLocationService.SearchByNameAndType(this.search, "map", 0, 30).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listUpdate = [];
                        this.listUpdate = _.concat(this.listUpdate, data.Result);
                        // this.listUpdate[0].Location_Name
                        // console.log(this.listResult);

                        // this.listResult.forEach(element => {
                        //     this.listlocation.push({
                        //         id: element.Location_Id, 
                        //         name: element.Location_Name, 
                        //         imgURL: element.Image_Url ? element.Image_Url : "assets/iconImages/noimage.png", 
                        //         type: element.Location_Type
                        //     });
                        // });

                        // document.getElementById("filter").style.display = "none";

                        setTimeout(() => {
                            // this.loading.dismiss();
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
            this.listUpdate = [];
        }

    }

    changeMainText(ts: string) {
        this.search = ts;
        this.listUpdate = [];
        this.searchAction();
    }

    chooseFilterOnPopUp(ts: string) {
        switch (ts) {
            case "see":
                this.filterOption.see = true;
                this.filterOption.eat = false;
                this.filterOption.stay = false;
                this.filterOption.shop = false;
                this.filterOption.entertainment = false;
                // this.filterOption.all = false;
                // if(this.filterOption.see == true) {
                //     this.filterOption.see = false;
                // } else {
                //     this.filterOption.see = true;
                // }
                break;
            case "eat":
                this.filterOption.see = false;
                this.filterOption.eat = true;
                this.filterOption.shop = false;
                this.filterOption.stay = false;
                this.filterOption.entertainment = false;
                // if(this.filterOption.eat == true) {
                //     this.filterOption.eat = false;
                // } else {
                //     this.filterOption.eat = true;
                // }
                break;
            case "stay":
                this.filterOption.see = false;
                this.filterOption.eat = false;
                this.filterOption.shop = false;
                this.filterOption.stay = true;
                this.filterOption.entertainment = false;
                // if(this.filterOption.stay == true) {
                //     this.filterOption.stay = false;
                // } else {
                //     this.filterOption.stay = true;
                // }
                break;
            case "shop":
                this.filterOption.see = false;
                this.filterOption.eat = false;
                this.filterOption.stay = false;
                this.filterOption.shop = true;
                this.filterOption.entertainment = false;
                // if(this.filterOption.stay == true) {
                //     this.filterOption.stay = false;
                // } else {
                //     this.filterOption.stay = true;
                // }
                break;
            case "entertainment":
                this.filterOption.see = false;
                this.filterOption.eat = false;
                this.filterOption.stay = false;
                this.filterOption.shop = false;
                this.filterOption.entertainment = true;
                break;
            case "all":
                this.filterOption.see = true;
                this.filterOption.eat = true;
                this.filterOption.stay = true;
                this.filterOption.shop = true;
                this.filterOption.entertainment = true;
                // if(this.filterOption.see == true && this.filterOption.stay == true && this.filterOption.eat == true && this.filterOption.other == true) {
                //     this.filterOption.see = false;
                //     this.filterOption.stay = false;
                //     this.filterOption.eat = false;
                //     this.filterOption.other = false;
                // } else {
                //     this.filterOption.see = true;
                //     this.filterOption.stay = true;
                //     this.filterOption.eat = true;
                //     this.filterOption.other = true;
                // }
                break;
            case "other":
                // if(this.filterOption.other == true) {
                //     this.filterOption.other = false;
                // } else {
                //     this.filterOption.other = true;
                // }
                break;
        }
        this.strType = [];
        if (this.filterOption.stay == true) {
            this.strType.push("HOTEL");
        }
        if (this.filterOption.eat == true) {
            this.strType.push("RESTAURANT");
        }
        if (this.filterOption.see == true) {
            this.strType.push("TPLACE");
        }
        if (this.filterOption.shop == true) {
            this.strType.push("SHOP");
        }
        if (this.filterOption.entertainment == true) {
            this.strType.push("ENTERTAINMENT");
        }
        this.loadHobbies();
        this.loadServices();
        this.changeFilterMoneyToString();
        this.loadListLocation();
    }

    //load marker
    loadMarker() {
        this.listMarker.forEach(element => {
            element.setMap(null);
        });
        this.listMarker = [];

        // console.log(this.listLocation);

        this.listLocation.forEach(element => {
            var icon = "assets/images/" + element.locationType.slug + ".png";

            if (element.type == "RESTAURANT") {
                icon = "assets/images/" + element.subType + ".png";
            }

            var marker = new MarkerWithLabel({
                map: this.map,
                position: new google.maps.LatLng(element.latitude, element.longitude),
                icon: { url: icon, size: new google.maps.Size(25, 28), scaledSize: new google.maps.Size(25, 28) },
                labelContent: element.name,
                labelAnchor: new google.maps.Point(18, 12),
                labelClass: "my-custom-class-for-label", // your desired CSS class
                labelInBackground: true,
            });
            google.maps.event.addListener(marker, 'click', () => { this.updateChosenMarker(marker); });
            this.listMarker.push(marker);
        });
    }

    openPopUpChoosingMethod() {
        document.getElementById("choosingMethod").style.display = "block";
    }
    closePopUpChoosingMethod() {
        document.getElementById("choosingMethod").style.display = "none";
    }

    updateChosenMarker(marker) {
        this.chosenMarker = marker;

        // console.log(this.chosenMarker);
        this.showLoading();
        this.listMarker.forEach((element, index) => {
            if (element == this.chosenMarker) {
                this.chosenIndex = index;
            }
        });

        var request = {
            origin: new google.maps.LatLng(this.latitude, this.longitude),
            destination: new google.maps.LatLng(this.listLocation[this.chosenIndex].latitude, this.listLocation[this.chosenIndex].longitude),
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.directionsService.route(request, (response, status) => {
            var distance = "";
            if (status == google.maps.DirectionsStatus.OK) {
                // console.log(response);
                distance = response.routes[0].legs[0].distance.text;
            }

            this.currentClick = { imgURL: this.listLocation[this.chosenIndex].imgURL, name: this.listLocation[this.chosenIndex].name, address: this.listLocation[this.chosenIndex].address, range: distance };

            setTimeout(() => {
                this.loading.dismiss();
                this.openPopUpChoosingMethod();
            });
        });
    }

    showWay() {

        if (this.directionsDisplay.length > 0) {
            this.directionsDisplay.forEach(element => {
                element.setMap(null);
            });
        }

        let latLng = new google.maps.LatLng(this.latitude, this.longitude);
        this.map.setCenter(latLng);

        var directionsDisplayItem = new google.maps.DirectionsRenderer();

        this.currentMarker.setMap(this.map);
        this.currentMarker.setPosition(latLng);

        var destination = null;

        destination = new google.maps.LatLng(this.listLocation[this.chosenIndex].latitude, this.listLocation[this.chosenIndex].longitude);

        directionsDisplayItem.setMap(this.map);

        var request = {
            origin: latLng,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };

        // console.log(latLng.lat());
        // console.log(latLng.lng());

        this.duration = "";
        this.distance = "";

        this.directionsService.route(request, (response, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplayItem.setDirections(response);
                //directionsDisplay.setOptions( { suppressMarkers: true } );
                directionsDisplayItem.setOptions({
                    markerOptions: {
                        opacity: .1,
                        icon: "assets/images/current-resize.gif"
                    }
                });
                this.duration = directionsDisplayItem.directions.routes[0].legs[0].duration.text;
                this.distance = directionsDisplayItem.directions.routes[0].legs[0].distance.text;
                this.directionsDisplay.push(directionsDisplayItem);
            }
        });
    }

    gotoDetail() {
        this.listMarker.forEach((element, index) => {
            if (element == this.chosenMarker) {
                //    console.log(this.listLocation[index])
                if (this.listLocation[index].locationType.slug == "eat") {
                    this.navCtrl.push(RestaurantDetailPage, { item: this.listLocation[index].id, code: this.listLocation[index].type, obj: this.listLocation[index] });
                } else if (this.listLocation[index].locationType.slug == "stay") {
                    this.navCtrl.push(HotelDetailPage, { item: this.listLocation[index].id, code: this.listLocation[index].type, obj: this.listLocation[index] });
                }else if (this.listLocation[index].locationType.slug == "entertainment") {
                    this.navCtrl.push(EntertainmentDetailPage, { item: this.listLocation[index].id, code: this.listLocation[index].type, obj: this.listLocation[index] });
                } else if (this.listLocation[index].locationType.slug == "see") {
                    // this.navCtrl.push(SightSeeingPage, { item: this.listLocation[index].id });
                    this.navCtrl.push(SightSeeingPage, { item: this.listLocation[index].id, code: this.listLocation[index].type, obj: this.listLocation[index] });
                } else if (this.listLocation[index].locationType.slug == "shop") {
                    // this.navCtrl.push(SightSeeingPage, { item: this.listLocation[index].id });
                    // this.navCtrl.push(SightSeeingPage, { item: this.listLocation[index].id ,code : this.listLocation[index].type, obj: this.listLocation[index] });
                    this.shoppingService.GetShopDetailH(this.listLocation[index].id, this.listLocation[index].type).subscribe(data => {
                        if (data.Code === 200) {
                            let shop = data.Result;
                            this.navCtrl.push(ShopDetailPage, { item: shop });
                        }
                    });
                }
            }
        });
        this.chosenIndex = null;
        this.closePopUpChoosingMethod();
    }

    clearText() {
        this.search = "";
        this.listUpdate = [];
        this.listResult = [];
    }

    //get from server after search
    searchAction() {
        this.listUpdate = [];
        this.getResultSearch();
    }
    getResultSearch() {
        if (((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            this.listResult = [];
            // console.log(this.search);
            this.showLoading();
            this.searchLocationService.SearchByName(this.search).subscribe(
                data => {
                    //console.log(data);
                    if (data.Code === 200) {
                        this.listResultC = [];
                        this.listResultC = _.concat(this.listResultC, data.Result);
                        if (this.listResultC.length > 0) {
                            this.listResultC.forEach(element => {
                                //console.log(this.listResultC);
                                if (element.GEO_LOCATION != null) {
                                    this.listResult.push({
                                        id: element.LOCATION_ID,
                                        name: element.LOCATION_NAME,
                                        imgURL: element.LOCATION_AVATAR ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png",
                                        type: element.LOCATION_TYPE,
                                        latitude: parseFloat(element.GEO_LOCATION.split(",")[0].trim()),
                                        longitude: parseFloat(element.GEO_LOCATION.split(",")[1].trim()),
                                        locationType: { slug: this.getSlugType(element.LOCATION_TYPE) }
                                    });
                                }
                            });
                        }

                        setTimeout(() => {
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
        }

    }
    getSlugType(id) {
        switch (id) {
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
            default:
                return "other";
        }
    }
    showAll() {
        if (this.listResult.length > 0) {
            this.listLocation = this.listResult;
            this.map.setCenter(new google.maps.LatLng(this.listResult[0].latitude, this.listResult[0].longitude));
            this.loadMarker();
            this.closePopUpSearch();
        }
    }
    showNearby() {
        if (this.chosenIndex != null) {
            var lat = this.listLocation[this.chosenIndex].latitude;
            var lng = this.listLocation[this.chosenIndex].longitude;
            this.updateListLication(this.listLocation[this.chosenIndex].latitude, this.listLocation[this.chosenIndex].longitude);
            this.map.setCenter(new google.maps.LatLng(lat, lng));
        } else {
            this.updateListLication(this.map.getCenter().lat(), this.map.getCenter().lng());
        }

        this.closePopUpChoosingMethod();
    }
    gotoLocation(location) {
        this.map.setCenter(new google.maps.LatLng(location.latitude, location.longitude));
        this.updateListLication(location.latitude, location.longitude);
        this.closePopUpSearch();
    }

    choosingFilterPopUpOpen() {
        this.chosenIndex = null;
        document.getElementById("choosingFilter").style.display = "block";
    }
    closePopUpChoosingFilter() {
        document.getElementById("choosingFilter").style.display = "none";
    }
    // vnt 22/12
    loadHobbies() {
        this.listHobiesTravel = [];
        this.listHobiesChoice3 = [];
        this.listHobiesChoice2 = [];
        this.listHobiesFB = [];
        if (this.filterOption.see == true) {
            // console.log("enter see");
            this.hobbyService.GetListTravel().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listHobiesTravel = _.concat(this.listHobiesTravel, data.Result);
                        // console.log(data.Result);
                        this.listHobiesTravel.forEach(element => {
                            this.listHobiesChoice3.push(
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
                        this.showError(data.Message)
                    }
                },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                });
        }
        if (this.filterOption.eat == true) {
            this.hobbyService.GetListFB().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listHobiesFB = _.concat(this.listHobiesFB, data.Result);
                        // console.log(this.listHobiesFB);
                        this.listHobiesFB.forEach(element => {
                            this.listHobiesChoice2.push(
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
                        this.showError(data.Message)
                    }
                },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                });
        }
    }
    //ok
    async loadServices() {
        this.listServicesChoice1 = [];
        this.listServicesChoice2 = [];
        this.listServicesChoice3 = [];
        this.listServicesTravel = [];
        this.listServicesFB = [];
        this.listServicesFO = [];
        if (this.filterOption.see == true) {
            this.serviceGetting.GetListTravel().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listServicesTravel = _.concat(this.listServicesTravel, data.Result);
                        this.listServicesTravel.forEach(element => {
                            this.listServicesChoice3.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        // console.log(this.listServicesChoice3);
                        setTimeout(() => {
                        });
                    } else {
                        this.showError(data.Message)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                }
            );
        }

        if (this.filterOption.eat == true) {
            this.serviceGetting.GetListFB().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listServicesFB = _.concat(this.listServicesFB, data.Result);
                        this.listServicesFB.forEach(element => {
                            this.listServicesChoice2.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        // console.log(this.listServicesChoice2);
                        setTimeout(() => {
                        });
                    } else {
                        this.showError(data.Message)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                }
            );
        }

        if (this.filterOption.stay == true) {
            this.serviceGetting.GetListFO().subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listServicesFO = _.concat(this.listServicesFO, data.Result);
                        this.listServicesFO.forEach(element => {
                            this.listServicesChoice1.push(
                                {
                                    name: element.NAME,
                                    checked: false,
                                    id: element.ID,
                                    code: element.CODE
                                }
                            );
                        });
                        // console.log(this.listServicesChoice1);
                        setTimeout(() => {
                        });
                    } else {
                        this.showError(data.Message)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                }
            );
        }
    }

    submit() {

        this.listHobiesChoiceId = [];
        this.listHobiesChoice3.forEach(element => {
            if (element.checked) {
                this.listHobiesChoiceId.push(element.id);
            }
        });
        this.listHobiesChoice2.forEach(element => {
            if (element.checked) {
                this.listHobiesChoiceId.push(element.id);
            }
        });

        this.listServicesChoiceId = [];
        this.listServicesChoice1.forEach(element => {
            if (element.checked) {
                this.listServicesChoiceId.push(element.code + "_" + element.id);
            }
        });
        this.listServicesChoice2.forEach(element => {
            if (element.checked) {
                this.listServicesChoiceId.push(element.code + "_" + element.id);
            }
        });
        this.listServicesChoice3.forEach(element => {
            if (element.checked) {
                this.listServicesChoiceId.push(element.code + "_" + element.id);
            }
        });
        this.showNearby();
        this.closePopUpChoosingFilter();
    }

    changeValue(item) {
        if (item.checked == false) {
            item.checked = true;
        } else {
            item.checked = false;
        }
    }
    gotoCameraView() {
        var lang = localStorage.getItem("currentLangauge");
        var startupConfiguration: any = { "camera_position": "back" };
        var that: any = this;
        this.showUserInfo.getCamUrl().subscribe((data) => {
            WikitudePlugin.loadARchitectWorld(
                function (success) {
                },
                function (fail) {
                },
                data.Result + "?lang=" + lang,
                ["geo"],
                <JSON>startupConfiguration
            );

            WikitudePlugin.setOnUrlInvokeCallback(
                function closeWikitudePlugin() {
                    WikitudePlugin.close();
                }
            );
        });
    }
}
