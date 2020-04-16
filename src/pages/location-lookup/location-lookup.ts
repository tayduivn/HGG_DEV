import { Component, ViewChild } from '@angular/core';
import {
    NavController, NavParams, AlertController, LoadingController, ToastController, Img, Platform, ModalController
} from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService, EventService, ShoppingService } from "../../providers";
import { TranslateService } from "../../translate";
import { LocationSearch } from "../../model/LocationSearch";
import { LookUpPage } from "../look-up/look-up";
import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';
import { SightSeeingPage } from '../sight-seeing/sight-seeing';
import { MapRoutePage } from "../map-route/map-route";
import { Content } from "ionic-angular";
import { updateImgs } from "ionic-angular/components/content/content";
import { SpeechRecognition,  SpeechRecognitionListeningOptionsAndroid, SpeechRecognitionListeningOptionsIOS } from '@ionic-native/speech-recognition'
import _ from 'lodash';
import moment from 'moment';
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { EventDetailPage } from "../event-detail/event-detail";
import { LoginPage } from "../login/login";
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-location-lookup',
    templateUrl: 'location-lookup.html'
})
export class LocationLookupPage extends PageBase {
    @ViewChild(Content) _content: Content;
    search: any;
    listResult: any[];
    listlocation: any[];
    listUpdate: any[];
    searchType: any;
    loaded: boolean;
    androidOption: SpeechRecognitionListeningOptionsAndroid;
    iosOption: SpeechRecognitionListeningOptionsIOS;
    defaultLat: any;
    defaultLng: any;
    latitude: any;
    longitude: any;
    total: any;
    pageIndex: any;

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
        public toastCtrl: ToastController,
        private speech: SpeechRecognition,
        public platform: Platform,
        public UltilitiesService: UltilitiesService,
        public _DIAGNOSTIC: Diagnostic,
        public geolocation: Geolocation,
        public eventService: EventService,
        public shoppingService: ShoppingService,
        public modalCtrl: ModalController,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listResult = [];
        this.listlocation = [];
        this.searchType = this.navParams.get("searchType");
        if (this.searchType == undefined) {
            this.searchType = null;
        }
        this.speech.getSupportedLanguages().catch((data)=>{
            //console.log(data);
        });
        this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
    }

    caseNoLatLng() {
        this.latitude  = this.defaultLat;
        this.longitude = this.defaultLng;
        this.getResultSearch(this.latitude, this.longitude);
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
                            // this.searchDestination();
                        } else {
                            var cr = await this.locationAccuracy.canRequest();
                            if(cr) {
                                // the accuracy option will be ignored by iOS
                                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                    (data) => {
                                        // this.searchDestination();
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
                                            this.searchDestination();
                                        } else {
                                            var cr = await this.locationAccuracy.canRequest();
                                            if(cr) {
                                                // the accuracy option will be ignored by iOS
                                                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                                    (data) => {
                                                        this.searchDestination();
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
                                        this.searchDestination();
                                    }
                                });
                            } else {
                                this.searchDestination();
                            }
                        });
                    }
                } else if(this.platform.is("ios") && locationMode === this._DIAGNOSTIC.permissionStatus.NOT_REQUESTED) {
                    this._DIAGNOSTIC.requestLocationAuthorization().then(data => {
                        if(data == this._DIAGNOSTIC.permissionStatus.DENIED) {
                            this.errorNoPermission();
                            this.caseNoLatLng();
                        } else {
                            this.searchDestination();
                        }
                    }, err => {
                        this.errorNoPermission();
                        this.caseNoLatLng();
                    });
                }
            });
        }
        
    }

    init() {
        // if(this.plt.is('cordova')) {
        //     this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode) => {
        //         if(this.page_on && ((this.plt.is("android") && locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF)
        //             || (this.plt.is("ios") && ( locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
        //                 || locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE
        //         )))) {
        //             if(this.first_time == 2) {
        //                 this.showLoading();
        //                 this.geolocation.getCurrentPosition()
        //                 .then((data : any) =>
        //                 {
        //                     this.latitude  = data.coords.latitude;
        //                     this.longitude = data.coords.longitude;
        //                     this.getResultSearch(this.latitude, this.longitude);
        //                     this.listUpdate = [];
        //                     // this.getResultType(this.latitude, this.longitude, false);
        //                 })
        //                 .catch((error1 : any) => {
        //                     this.latitude  = this.defaultLat;
        //                     this.longitude = this.defaultLng;
        //                     this.getResultSearch(this.latitude, this.longitude);
        //                     this.listUpdate = [];
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
                                        this.searchDestination();
                                    }
                                });
                            } else {
                                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                                if(!cp2.hasPermission) {
                                    this.errorNoPermission();
                                } else {
                                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                                        
                                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                                            this.searchDestination();
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
                this.searchDestination();
            }
        });
    }
    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }
    async getPermission(): Promise<void> {
        try {
            const permission = this.speech.requestPermission();
            //console.log(permission);
        }
        catch (e) {
            //console.log(e);
        }
    }
    getCode(id){

        switch (id) {
            case 1:
                return "HOTEL";
            case "1":
                return "HOTEL";
                
            case 2:
                return "RESTAURANT";
            case "2":
                return "RESTAURANT";
            case 3:
                return "TPLACE";
            case "3":
                return "TPLACE";
            case 5:
                return  "SHOP";
            case "5":
                return  "SHOP"; 
            case 7:
                return "N_EVENTS";
            case "7":
                return "N_EVENTS";
            case 8:
                return "ENTERTAINMENT";
            case "8":
                return "ENTERTAINMENT";
            default:
                return "HOTEL,RESTAURANT,TPLACE,SHOP,N_EVENTS,ENTERTAINMENT";
        }
     }
    listenForSpeech(): void {
        this.speech.requestPermission();
        var option: any;
        if (this.platform.is('ios')) {
            this.iosOption = {
                language: 'vi-VN',
                showPartial: false
            }
            option = this.iosOption;
        } else {
            this.androidOption = {
                language: 'vi-VN'
            }
            option = this.androidOption;
        }
        this.speech.isRecognitionAvailable()
        .then((available: boolean) => {
            if(!available)
            {
                this.speech.stopListening();
            }
        });
        this.speech.startListening(option).subscribe(data =>
        // lay nhan dien am thanh va xu ly ke qua
        {
            if (data.length > 0) {

                this.search = data[0];
                // this.searchDestination();
                this.init();
            }
        }

        )

         if (this.platform.is('ios')) {
            // this.speech.stopListening().catch(data=>{
            //     console.log(JSON.stringify(data));
            // })

            //this.speech.startListening();
            let _alert = this.alertCtrl.create(
                {
                    title:'',
                    message: this.translateService.translate('recognitioning'),// 
                    buttons:[{
                        text:this.translateService.translate('recognitioning.stop'),
                        handler:()=>{
                            this.speech.stopListening();
                        }
                    }]
                }
            );
            _alert.present();
        }
    }
    scrollToTop() {
        this._content.scrollToTop();
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

    searchDestination() {
        this.scrollToTop();
        var geolocationOptions = {
            enableHighAccuracy: true,
            maximumAge: 3000
        };
        if(this.search != "" && this.search != null) {
            this.showLoading();

            this.geolocation.getCurrentPosition(geolocationOptions).then((loc : any) =>
            {
                //Your logic here
                this.latitude  = loc.coords.latitude;
                this.longitude = loc.coords.longitude;
                this.getResultSearch(this.latitude, this.longitude);
                this.listUpdate = [];
            }).catch((error1 : any) => {
                this.latitude  = this.defaultLat;
                this.longitude = this.defaultLng;
                this.getResultSearch(this.latitude, this.longitude);
                this.listUpdate = [];
                this.showError(this.translateService.translate("gps.error1"));
            });
        }
    }

    updateListHint() {
        if (((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            // this.showLoading();
            //console.log(this.search);
            var code = this.getCode(this.searchType);
            this.searchLocationService.SearchByNameAndType(this.search,code, 0, 30).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listUpdate = [];
                        this.listlocation = [];
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

    getResultSearch(lat, lng) {
        this.listResult = [];
        if (((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            this.listlocation = [];
            // this.showLoading();
            var code = this.getCode(this.searchType);
            this.pageIndex = 0;
            this.searchLocationService.SearchByNameAndTypeDistance(this.search, code, lat+","+lng, 0, 10).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.total = data.Message.split("-")[1];
                        this.listResult = _.concat(this.listResult, data.Result);
                        // console.log(this.listResult);
                        this.listResult.forEach(element => {
                            // this.listlocation.push({
                            //     id: element.Location_Id, 
                            //     name: element.Location_Name, 
                            //     imgURL: element.Image_Url ? element.Image_Url : "assets/iconImages/noimage.png", 
                            //     type: element.Location_Type
                            // });
                            this.listlocation.push({
                                // id: element.Location_Id,
                                // name: element.Location_Name,
                                // imgURL: element.Image_Url ? this.changeURL(element.Image_Url) : "assets/iconImages/noimage.png",
                                // type: element.Location_Type,
                                // book_id: element.Book_Id,
                                // total_bm: element.Total_Bookmark,
                                // address: element.Location_Address,
                                // distance: Math.round(element.Distance_Sort * 1.3),
                                // googlemap: element.Google_Location
                                id: element.LOCATION_ID,
                                name: element.LOCATION_NAME, 
                                imgURL: (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png", 
                                type: element.LOCATION_TYPE,
                                book_id:element.LOCATION_LIKE_ID,
                                total_bm: element.LOCATION_TOTAL_LIKE,
                                address: element.LOCATION_ADDRESS,
                                distance: Math.round(element.LOCATION_DISTANCE * 1.3 *1000),
                                googlemap: element.GEO_LOCATION,
                            });

                        });

                        // document.getElementById("filter").style.display = "none";
                        setTimeout(() => {
                            this.loading.dismiss().then(data => {
                                this.play_one = 0;
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
        }
    }

    pagedFunction(infiniteScroll) {

        if(this.total == 10) {
            if (((this.search != "") || (typeof this.search !== undefined)) && this.search) {
                this.pageIndex = this.pageIndex + 1;
                // this.showLoading();
                var code = this.getCode(this.searchType);
                this.searchLocationService.SearchByNameAndTypeDistance(this.search, code, this.latitude+","+this.longitude, this.pageIndex, 10).subscribe(
                    data => {
                        if (data.Code === 200) {
                            this.listResult = [];
                            this.total = data.Message.split("-")[1];
                            this.listResult = _.concat(this.listResult, data.Result);
                            // console.log(this.listResult);
                            this.listResult.forEach(element => {
                                // this.listlocation.push({
                                //     id: element.Location_Id, 
                                //     name: element.Location_Name, 
                                //     imgURL: element.Image_Url ? element.Image_Url : "assets/iconImages/noimage.png", 
                                //     type: element.Location_Type
                                // });
                                this.listlocation.push({
                                    // id: element.Location_Id,
                                    // name: element.Location_Name,
                                    // imgURL: element.Image_Url ? this.changeURL(element.Image_Url) : "assets/iconImages/noimage.png",
                                    // type: element.Location_Type,
                                    // book_id: element.Book_Id,
                                    // total_bm: element.Total_Bookmark,
                                    // address: element.Location_Address,
                                    // distance: Math.round(element.Distance_Sort * 1.3),
                                    // googlemap: element.Google_Location
                                    id: element.LOCATION_ID,
                                    name: element.LOCATION_NAME, 
                                    imgURL: (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR != "") ? this.changeURL(element.LOCATION_AVATAR) : "assets/iconImages/noimage.png", 
                                    type: element.LOCATION_TYPE,
                                    book_id:element.LOCATION_LIKE_ID,
                                    total_bm: element.LOCATION_TOTAL_LIKE,
                                    address: element.LOCATION_ADDRESS,
                                    distance: Math.round(element.LOCATION_DISTANCE * 1.3 *1000),
                                    googlemap: element.GEO_LOCATION,
                                });
    
                            });
    
                            // document.getElementById("filter").style.display = "none";
                            setTimeout(() => {
                                infiniteScroll.complete();
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
        } else {
            infiniteScroll.complete();
        }
        
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
            default:
                return this.translateService.translate("lctlk.all");
        }
    }

    directionMap(event:MouseEvent, location) {
        event.stopPropagation();
        this.navCtrl.push(MapRoutePage, { locations: location.googlemap, type: this.getType(location.type) });
    }

    getType(types) {
        //console.log(types);
        switch (types) {
            case "HOTEL":
                return "stay";
            case "RESTAURANT":
                return "eat";      
            case "TPLACE":
                return "see";
            case "SHOP":
                return "shop";
            case "N_EVENTS":
                return "event";
            case "ENTERTAINMENT":
                return "entertainment";
        }
    }

    showContentList(event, ts: string) {
        //   console.log(event);
        var target = event.srcElement.nextElementSibling;
        if (event.srcElement.localName == "img") {
            target = event.srcElement.parentNode.nextElementSibling;
        }
        if (target.style.visibility == "hidden") {
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
        }
    }

    changeMainText(ts: string) {
        
        this.search = ts;
        this.listUpdate = [];
        // this.searchDestination();
        this.init();
    }

    clearText() {
        this.search = "";
        this.listUpdate = [];
        this.listlocation = [];
        // this.scrollToTop();
    }

    updateType(ts: number) {
        this.searchType = ts;
        this.listUpdate = [];
        // document.getElementById("type").setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        this.closeAllListMenu();
        // this.searchDestination();
        this.init();
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
    changeType(ts) {
        this.navCtrl.push(LookUpPage, { data: ts });
    }

    toggleSaveWishList(event: MouseEvent, location) {
        var type = location.id != null ? ((location.type.indexOf("_") !== -1) ? "EVENTS" : "PLACE") : "PLACE";
        event.stopPropagation();
        this.checkToken().then(
            data => {
            if(data) {
                if(location.book_id == 0) {
                    this.searchLocationService.saveWishListH(location.id, location.type, type).subscribe(
                        data => {
                            if (data.Code === 200) {
                                location.book_id = data.Result.ID;
                               // location.id = data.Result.PLACE_ID;
                                //location.type = data.Result.PLACE_CODE;
                                location.total_bm = location.total_bm + 1;
                                this.showToastWithCloseButton(this.translateService.translate("mysaved.tick"));
                            } else {
                                // this.showError(data.Message, false)
                                // this.searchDestination();
                                this.init();
                            }
                        },
                        error => {
                            this.showError(this.translateService.translate("network.error"), false);
                        }
                    );
                } else {
                    this.searchLocationService.removeSaveWishListH(location.id,location.type, type).subscribe(
                        data => {
                            if (data.Code === 200) {
                                location.book_id = 0;  
                                location.total_bm = location.total_bm - 1;
                                this.showToastWithCloseButton(this.translateService.translate("mysaved.untick"));
                            } else {
                                // this.showError(data.Message, false)
                                // this.searchDestination();
                                this.init();
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
                    // this.searchDestination();
                    this.init();
                });
            }
        });
        return false;
    }

    showToastWithCloseButton(message: string) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 1,
            showCloseButton: false,
            position: 'middle'
        });
        toast.present();
    }

    // gotoDetail(obj) {
    //     debugger
    //     if (obj.type == 1) {
    //         this.navCtrl.push(HotelDetailPage, { item: obj.id, obj: obj });
    //     } else if (obj.type == 2) {
    //         this.navCtrl.push(RestaurantDetailPage, { item: obj.id, obj: obj });
    //     } else if (obj.type == 3) {
    //         this.navCtrl.push(SightSeeingPage, { item: obj.id, obj: obj });
    //     } else if (obj.type == 5) {
    //         this.shoppingService.GetShopDetail(obj.id).subscribe(data => {
    //             if(data.Code === 200) {
    //                 let shop = data.Result;
    //                 console.log(shop);
    //                 this.navCtrl.push(ShopDetailPage, {item: shop});
    //             }
                
    //         });
            
    //     } else if (obj.type == 7) {
    //         this.eventService.GetDetail(obj.id).subscribe(data => {
    //             if(data.Code === 200) {
    //                 // this.current_event = data.Result[0];
    //                 // console.log(this.current_event);
    //                 // this.navCtrl.push(EventDetailPage, { id: obj.id });
    //                 this.navCtrl.push(EventDetailPage, { item: data.Result[0] });
    //             }
    //         });
    //     }
    // }

    gotoDetail(obj) {
        if (obj.type == "HOTEL") {
            this.navCtrl.push(HotelDetailPage, { item: obj.id, code:obj.type, obj: obj });
        } else if (obj.type == "RESTAURANT") {
            this.navCtrl.push(RestaurantDetailPage, { item: obj.id, code:obj.type, obj: obj });
        } else if (obj.type == "TPLACE") {
            this.navCtrl.push(SightSeeingPage, { item: obj.id, code: obj.type, obj: obj });
        } else if (obj.type == "ENTERTAINMENT") {
            this.navCtrl.push(EntertainmentDetailPage, { item: obj.id, code: obj.type, obj: obj });
        } else if (obj.type == "SHOP") {
            this.shoppingService.GetShopDetail(obj.id).subscribe(data => {
                if(data.Code === 200) {
                    let shop = data.Result;
                    this.navCtrl.push(ShopDetailPage, {item: shop, obj: obj});
                }
            });
            
        } else if (obj.type == "N_EVENTS" || obj.type == "N_NEWS") {
            this.eventService.GetDetailH(obj.id,obj.type).subscribe(data => {
                if(data.Code === 200) {
                    this.navCtrl.push(EventDetailPage, { item: data.Result, obj: obj });
                }
            });
        }
    }
}
