import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { PageBase } from '../../providers/page-base';

import { SightSeeingService, SearchLocationService, ShowUserInfo, UltilitiesService, RestaurantService } from "../../providers";

import { SightSeeing } from "../../model/SightSeeing";
import { LocationSearchResult } from "../../model/LocationSearchResult";
import { MapRoutePage } from "../map-route/map-route";

import { HotelDetailPage } from "../hotel-detail/hotel-detail";
import { RestaurantDetailPage } from "../restaurant-detail/restaurant-detail";
import { PlanChoicePage } from "../plan-choice/plan-choice";
import { NearbyListPage } from "../nearby-list/nearby-list";
import { UserRateDetailPage } from "../user-rate/user-rate";

import { TranslateService } from "../../translate";

import { CameraPage } from "../camera/camera";
import { UserImagesPage } from "../user-images/user-images";
import { UserFeedbackDetailPage } from "../user-feedback-detail/user-feedback-detail";

import _ from 'lodash';
import moment from 'moment';
import { LoginPage } from "../login/login";
import { UserNotePage } from "../user-note/user-note";
import { Place } from "../../model/Place";
import { TourArPage } from '../tour-ar/tour-ar';
declare var google;
declare var Swiper;

import { Facebook } from '@ionic-native/facebook';
import { Services } from "../../providers/services";
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';

/*
  Generated class for the SightSeeing page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-sight-seeing',
    templateUrl: 'sight-seeing.html'
})
export class SightSeeingPage extends PageBase {

    @ViewChild("scroll") scroll1: any;

    id: any;
    code: any;
    // result: SightSeeing;
    result1: Place;
    sightseeing: any;
    listResult: any[] = [];
    listNearby = [];
    directionsService: any;
    listNearbySee = [];
    listNearbyStay = [];
    listNearbyEat = [];
    type: any;
    swiper4: any;
    currentSwiper4: any;
    hasNearbyType: boolean;
    bookId: number;
    placeId: number;
    placeCode: string;
    disableAddPlan: boolean;
    isUserWish: boolean;
    itemFromListPage: any;
    current_type: any;

    listImage: any[] = [];
    listPromotion: any[] = [];
    imgsPro: any[] = [];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public sightSeeingService: SightSeeingService,
        public restaurantService: RestaurantService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public toastCtrl: ToastController,
        public UltilitiesService: UltilitiesService,
        public fb: Facebook,
        public modalCtrl: ModalController
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.id = this.navParams.get("item");
        this.code = this.navParams.get("code");
        this.itemFromListPage = navParams.get('obj');
        this.isUserWish = navParams.get('isUserWish') == undefined ? false:navParams.get('isUserWish');
        this.disableAddPlan = this.navParams.get("disableAddPlan");
        if(this.disableAddPlan == undefined) {
            this.disableAddPlan = false;
        }
        // this.directionsService = new google.maps.DirectionsService;
        this.listNearbySee = [];
        this.listNearbyStay = [];
        this.listNearbyEat = [];
        this.type = "địa điểm du lịch";
        this.getSightSeeingInfo(true);
        this.current_type = this.code;
        // this.checkBookMark(this.id);
        this.imgsPro = ["assets/images/try/promotions-1.jpg","assets/images/try/promotions-2.jpg","assets/images/try/promotions-3.jpg"];
    }

    init() {
        this.checkToken().then(data => {
            if(data == true) {
                this.checkBookMark(this.id, this.code);
            } else {
                this.bookId = 0;
                this.placeId = 0;
                this.placeCode = "";
            }
        });
        this.getPromotion(this.id,this.code);
        // this.swiper4 = new Swiper('.swiper-container-4', {
        //     // pagination: '.swiper-pagination',
        //     slidesPerView: 'auto',
        //     paginationClickable: true,
        //     spaceBetween: 5
        // });

        // //console.log(this.swiper4);

        // if (Array.isArray(this.swiper4)) {
        //     this.currentSwiper4 = this.swiper4[this.swiper4.length - 1];
        // } else {
        //     this.currentSwiper4 = this.swiper4;
        // }
    }

    ionViewDidLeave() {
        if(this.itemFromListPage != undefined) {
            this.itemFromListPage.book_id = this.bookId;
        }
    }

    gotoRate() {
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(UserRateDetailPage, { objectId: this.id, typeId: this.code, type: "PLACE"  });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }
    getSightSeeingInfo(resize) {
        if (resize) {
            this.showLoading();
        }
        this.sightSeeingService.GetRestaurantInfo(this.id,this.code).subscribe(
            data => {
                if (data.Code == 200) {
                    this.result1 = data.Result;

                    //console.log(this.result);

                    var img = "assets/iconImages/noimage.png";
                    if (this.result1.IMAGE != null && this.result1.IMAGE != "") {
                        img = this.changeURL(this.result1.IMAGE);
                    } else {
                        if (this.result1.PLACE_IMAGE != null && this.result1.PLACE_IMAGE.length > 0) {
                            img = this.result1.PLACE_IMAGE[0].IMAGE_URL;
                        }
                    }

                    var images = [];
                    if (this.result1.PLACE_IMAGE != null && this.result1.PLACE_IMAGE.length > 0) {
                        this.result1.PLACE_IMAGE.forEach(element => {
                            images.push({
                                id: element.ID,
                                name: element.IMAGE_URL
                            });
                        });
                    }

                    this.sightseeing = {
                        id: this.result1.ID,
                        code: this.result1.CODE,
                        imgURL: img,
                        name: this.result1.NAME,
                        address: this.result1.ADDRESS,
                        phonenumber: this.result1.PHONE_NO,
                        website: "",
                        email: this.result1.EMAIL,
                        aboutus: this.result1.DESCRIPTION,
                        images: this.result1.PLACE_IMAGE,
                        locations: this.result1.GEO_LOCATION,
                        open_time: this.result1.OPEN_TIME,
                        close_time: this.result1.CLOSE_TIME,
                        type: "TPLACE",
                        total_bookmark: this.result1.COUNT_LIKE,
                        price: this.result1.TO_AVG_PRICE,
                        NATION_ID: this.result1.NATION_ID,
                        PROVINCE_ID: this.result1.PROVINCE_ID,
                        CITY_ID: this.result1.CITY_ID,
                        url_3d: this.result1.URL_3D,
                        //url_3d: "http://vr360vn.com/du-an-360/ihome-pham-van-chieu-can-ho-A209M/"
                    };
                    if(data.Result.PLACE_IMAGE != null && data.Result.PLACE_IMAGE.length > 0) {
                        data.Result.PLACE_IMAGE.forEach(element => {
                            this.listImage.push(this.changeURL(element.IMAGE_URL));
                        });
                    } else {
                        //this.listImage.push("assets/images/noimage.png");
                    }

                    //console.log(this.sightseeing);

                    if(this.loading != null && this.loading != undefined) {
                        this.loading.dismiss();
                    }

                    setTimeout(() => {
                        this.getNearby(this.sightseeing, resize, this.code);
                    }, 1500);
                    
                    //   setTimeout(() => {
                    //       this.loading.dismiss();
                    //   });
                } else {
                    this.showError(data.Message);
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }
    showDirection() {
        this.navCtrl.push(MapRoutePage, { locations: this.sightseeing.locations, type: "see" });
    }

    getNearby(restaurant, resize, type) {
        // this.showLoading();

        if (restaurant.locations != null) {
            let latitude = parseFloat(restaurant.locations.split(",")[0]);
            let longitude = parseFloat(restaurant.locations.split(",")[1]);
            var start = new google.maps.LatLng(latitude, longitude);
            this.searchLocationService.SearchByCondition(2000, latitude, longitude, [], [], null, null, [type.toString()], 25, 0).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listResult = [];
                        // this.listResult = _.concat(this.listResult, data.Result);
                        //let data1 = moment().format('YYYYMMDD');
                        //console.log(data1);
                        // console.log(this.listResult);
                        // this.listNearby = [];
                        // if (this.listResult.length > 0) {

                        data.Result.forEach(element => {
                            if(element.LOCATION_ID != this.sightseeing.id) {
                                if (this.hasNearbyType == false) {
                                    this.hasNearbyType = true;

                                    // console.log(this.currentSwiper4);
                                }
                                if (element.GEO_LOCATION != null) {
                                    let destination = new google.maps.LatLng(
                                        parseFloat(element.GEO_LOCATION.split(",")[0]),
                                        parseFloat(element.GEO_LOCATION.split(",")[1])
                                    );
                                    var request = {
                                        origin: start,
                                        destination: destination,
                                        travelMode: google.maps.TravelMode.DRIVING
                                    };
                                    var duration = "";
                                    var distance = "";
                                    if (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR && element.LOCATION_AVATAR != "") {
                                        element.LOCATION_AVATAR_DP = this.changeURL(element.LOCATION_AVATAR);
                                    } else {
                                        element.LOCATION_AVATAR_DP = "assets/images/noimage.png";
                                    }

                                    var distanceCalc = element.LOCATION_DISTANCE*1000*1.2;
                                    distance = (Math.round(distanceCalc/100))/10 + " km";
                                    var durationCalc = Math.round(6*(Math.round(distanceCalc/100))/10 + 1);
                                    duration = durationCalc + " phút";

                                    element.DISTANCE_CALC = distance;
                                    element.DURATION_CALC = duration;
                                    this.listResult.push(element);

                                    // var html = "";
                                        
                                    // html += '<div class="swiper-slide swiper-slide-2">';
                                    // html +=     '<div class="info">';
                                    // if(element.LOCATION_AVATAR != null) {
                                    //     html +=     '<img src="'+this.changeURL(element.LOCATION_AVATAR)+'" data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
                                    // } else {
                                    //     html +=     '<img src="assets/iconImages/noimage.png" data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'" />';
                                    // }
                                    // html +=         '<h5 data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'">'+element.LOCATION_NAME+'</h5>';
                                    // html +=         '<p data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'"><span class="distance" data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'"><span class="icon distance-icon" data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'"></span>&nbsp;'+ distance +'</span>&nbsp;<span class="duration" data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'"><span class="icon duration-icon" data-id="'+element.LOCATION_ID+'" data-type="'+element.LOCATION_TYPE+'"></span>&nbsp;'+ duration +'</span></p>';
                                    // html +=     '</div>';
                                    // html += '</div>';

                                    // this.currentSwiper4.appendSlide(html);

                                    // this.directionsService.route(request, (response, status) => {
                                    //     if (status == google.maps.DirectionsStatus.OK) {
                                    //         //directionsDisplay.setOptions( { suppressMarkers: true } );
                                    //         //console.log(response);
                                    //         duration = response.routes[0].legs[0].duration.text;
                                    //         distance = response.routes[0].legs[0].distance.text;
                                    //     } else {
                                    //         var distanceCalc = element.LOCATION_DISTANCE + 300;
                                    //         distance = (Math.round(distanceCalc / 100)) / 10 + " km";
                                    //         var durationCalc = (Math.round(element.LOCATION_DISTANCE / 360)) + 1;
                                    //         duration = durationCalc + " phút";
                                    //     }

                                    //     // this.listNearby.push({
                                    //     //     id: element.Location_Id,
                                    //     //     name: element.Location_Name,
                                    //     //     type: element.Location_Type,
                                    //     //     duration: duration,
                                    //     //     distance: distance,
                                    //     //     imgURL: img
                                    //     // });
                                    //     // console.log(duration + ", " + distance);
                                    //     var html = "";

                                    //     html += '<div class="swiper-slide swiper-slide-2">';
                                    //     html += '<div class="info">';
                                    //     if (element.LOCATION_AVATAR != null) {
                                    //         html += '<img src="' + this.changeURL(element.LOCATION_AVATAR) + '" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
                                    //     } else {
                                    //         html += '<img src="assets/iconImages/noimage.png" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '" />';
                                    //     }
                                    //     html += '<h5 data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '">' + element.LOCATION_NAME + '</h5>';
                                    //     html += '<p data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"><span class="distance" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"><span class="icon distance-icon" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"></span>&nbsp;' + distance + '</span>&nbsp;<span class="duration" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"><span class="icon duration-icon" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"></span>&nbsp;' + duration + '</span></p>';
                                    //     html += '</div>';
                                    //     html += '</div>';

                                    //     // console.log(html);

                                    //     this.currentSwiper4.appendSlide(html);
                                    //     // if(element.Location_Type == "1") {
                                    //     //     this.listNearbyStay.push({
                                    //     //         id: element.Location_Id,
                                    //     //         name: element.Location_Name,
                                    //     //         type: element.Location_Type,
                                    //     //         duration: duration,
                                    //     //         distance: distance,
                                    //     //         imgURL: img
                                    //     //     });
                                    //     // } else if(element.Location_Type == "2") {
                                    //     //     this.listNearbyEat.push({
                                    //     //         id: element.Location_Id,
                                    //     //         name: element.Location_Name,
                                    //     //         type: element.Location_Type,
                                    //     //         duration: duration,
                                    //     //         distance: distance,
                                    //     //         imgURL: img
                                    //     //     });
                                    //     // } else if(element.Location_Type == "3") {
                                    //     //     this.listNearbySee.push({
                                    //     //         id: element.Location_Id,
                                    //     //         name: element.Location_Name,
                                    //     //         type: element.Location_Type,
                                    //     //         duration: duration,
                                    //     //         distance: distance,
                                    //     //         imgURL: img
                                    //     //     });
                                    //     // }
                                    // });
                                }
                            }
                            
                        });
                            //this.listNearby = this.listNearbySee;
                        // } else {
                        //     this.hasNearbyType = false;
                        // }
                        // console.log(this.listNearby);
                        if (resize) {
                            setTimeout(() => {
                                this.loading.dismiss();
                            });
                        }
                    } else {
                        this.showError(data.Message, resize)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"), resize);
                }
            );
        }
    }

    checkBookMark(seeId,code) {
        this.sightSeeingService.checkBookMark(seeId,code,"PLACE").subscribe(
            data => {
                if (data.Code === 200) {
                    if (data.Result == null) {
                        this.bookId = 0;
                        this.placeId = 0;
                        this.placeCode = "";
                    } else {
                        this.bookId = data.Result[0].ID;
                        this.placeId = data.Result[0].PLACE_ID;
                        this.placeCode = data.Result[0].PLACE_CODE;
                    }
                } else {
                    this.showError(data.Message);
                }
            }
            // ,
            // error => {
            //     this.showError(this.translateService.translate("network.error"));
            // }
        );
    }

    toggleSaveWishList() {
        this.checkToken().then(data => {
            if(data) {
                if(this.bookId == 0) {
                    this.searchLocationService.saveWishListH(this.sightseeing.id, this.sightseeing.code, "PLACE").subscribe(
                        data => {
                            if (data.Code === 200) {
                                this.bookId = data.Result.ID;
                                this.placeId = data.Result.PLACE_ID;
                                this.placeCode = data.Result.PLACE_CODE;
                                this.sightseeing.total_bookmark = this.sightseeing.total_bookmark + 1;
                                this.showToastWithCloseButton("Thêm yêu thích");
                            } else {
                                this.checkBookMark(this.id, this.code);
                            }
                        },
                        error => {
                            this.showError(this.translateService.translate("network.error"), false);
                        }
                    );
                } else {
                    this.searchLocationService.removeSaveWishListH(this.placeId, this.placeCode, "PLACE").subscribe(
                        data => {
                            if (data.Code === 200) {
                                this.bookId = 0;
                                this.sightseeing.total_bookmark = this.sightseeing.total_bookmark - 1;
                                this.showToastWithCloseButton("Bỏ yêu thích");
                            } else {
                                this.checkBookMark(this.id, this.code);
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
                    this.checkBookMark(this.id, this.code);
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

    changeType(type) {
        // this.currentSwiper4.removeAllSlides();

        if(this.scroll1 != null) {
            this.scroll1._scrollContent.nativeElement.scrollTo({ left: 0, top: 0 });
        }

        this.getNearby(this.sightseeing, false, type);
        switch (type) {
            case "TPLACE":
                this.current_type = "TPLACE";
                this.type = this.translateService.translate('map.placel');
                break;
            case "HOTEL":
                this.current_type = "HOTEL";
                this.type = this.translateService.translate('map.hotel');
                break;
            case "RESTAURANT":
                this.current_type = "RESTAURANT";
                this.type = this.translateService.translate('map.restaurant');
                break;
            case "ENTERTAINMENT":
                this.current_type = "ENTERTAINMENT";
                this.type = this.translateService.translate('overview.entertainment');
                break;
        }
    }

    onClickTopBooking(event) {
        if (event.srcElement.attributes["data-id"] != undefined && event.srcElement.attributes["data-type"] != undefined) {
            var dataId = event.srcElement.attributes["data-id"].value;
            var dataType = event.srcElement.attributes["data-type"].value;

            this.gotoDetail(dataId, dataType);
        }
    }

    gotoDetail(id, type) {
        if (type == "HOTEL") {
            this.navCtrl.push(HotelDetailPage, { item: id, code: type, swiper4: this.swiper4 });
        } else if (type == "RESTAURANT") {
            this.navCtrl.push(RestaurantDetailPage, { item: id, code: type, swiper4: this.swiper4 });
        } else if (type == "TPLACE") {
            this.navCtrl.push(SightSeeingPage, { item: id, code: type, swiper4: this.swiper4 });
        } else if (type == "ENTERTAINMENT") {
            this.navCtrl.push(EntertainmentDetailPage, { item: id, code: type, swiper4: this.swiper4 });
        }
    }

    gotoReport() {
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(UserFeedbackDetailPage, { objectId: this.id, typeId: 1, name: this.sightseeing.name });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }
    
    addToPlan() {
        //console.log(this.sightseeing);
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(PlanChoicePage, { location: this.sightseeing });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }

    gotoUserImage() {
        this.navCtrl.push(UserImagesPage, { objectId: this.id, typeId: 3, name: this.sightseeing.name });
    }
    takePicture() {
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(CameraPage, { objectId: this.id, typeId: 3, name: this.sightseeing.name });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
        
    }
    call(mobNumber) {
        mobNumber = encodeURIComponent(mobNumber);
        window.open("tel:" + mobNumber);
    }
    note() {
        this.checkToken().then(data => {
            if(data) {
                // this.navCtrl.push(UserNotePage, { objectId: this.id, typeId: 3, name: this.sightseeing.name });
                this.navCtrl.push(UserNotePage, { objectId: this.id, typeId: this.code, name: "", locationType: "PLACE" });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }
    watchvideo() {
        if (this.sightseeing.url_3d != null) {
            this.navCtrl.push(TourArPage, { url3d: this.sightseeing.url_3d });
        }
    }
    
    gotoShared() {
        this.UltilitiesService.GetShareLink(
            {
                "SharedType": "place",
                "SharedId":  this.sightseeing.id,
                "SharedCode":  this.sightseeing.code
            }
        ).subscribe(data=>{
            if(data.Code == 200){
                this.fb.showDialog(
                    {
                        method: 'share',
                        href: data.Result.Url,
                        caption: 'Such caption, very feed.',
                        description: 'Much description',
                        quote:  data.Result.Content,
                        hashtag: data.Result.HashTag,
                        imageURL: Services.getImageUrl(this.sightseeing.imgURL)
                    });
            }
            
        });
    }
    getPromotion(id, code) {
        this.listPromotion = [];
        this.restaurantService.GetPromotionbyPlace(id, code).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listPromotion = _.concat(this.listPromotion, data.Result);
                    console.log(this.listPromotion);
                } else if (data.Code != 404) {
                    this.showError(data.Message);
                }
            },
            error => {
            }
        );
    }

    sp(item) {
        var ft = new Date(item.FROM_DATE);
        var tt = new Date(item.TO_DATE);
        var pp = this.alertCtrl.create({
            title: this.translateService.translate('toolbox.promotion'),
            subTitle: this.translateService.translate('ucp.subtitle') + ": " + item.NAME,
            message: this.translateService.translate('mapqb.time') + ": " + this.convertDateString(ft, "/") + " - " + this.convertDateString(tt, "/") + "\n"  + item.CONTENT,
            buttons: [
                {
                    role: 'cancel',
                    text: this.translateService.translate('tl.cancel')
                }
            ]
        });

        pp.present();
    }
}
