import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { PageBase } from '../../providers/page-base';
import { BookingRestaurantPage } from '../booking-restaurant/booking-restaurant';
import { RestaurantService, SearchLocationService, ShowUserInfo, UltilitiesService } from "../../providers";
import { MapRoutePage } from "../map-route/map-route";
import { HotelDetailPage } from "../hotel-detail/hotel-detail";
import { SightSeeingPage } from "../sight-seeing/sight-seeing";
import { PlanChoicePage } from "../plan-choice/plan-choice";
import { Restaurant } from "../../model/Restaurant";
import { LocationSearchResult } from "../../model/LocationSearchResult";
import { TranslateService } from "../../translate";
import { CameraPage } from "../camera/camera";
import { UserImagesPage } from "../user-images/user-images";
import { UserRateDetailPage } from "../user-rate/user-rate";
import { UserFeedbackDetailPage } from "../user-feedback-detail/user-feedback-detail";

import _ from 'lodash';
import { LoginPage } from "../login/login";
import { UserNotePage } from "../user-note/user-note";
import { Place } from "../../model/Place";
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { Facebook } from '@ionic-native/facebook';
import { Services } from "../../providers/services";


declare var google;
declare var Swiper;

@Component({
    selector: 'page-entertainment-detail',
    templateUrl: 'entertainment-detail.html',
})
export class EntertainmentDetailPage extends PageBase {
    @ViewChild("scroll") scroll1: any;
    // result: any;
    result1: Place;
    restaurant: any;
    id: any;
    code: any;
    listResult: any[] = [];
    directionsService: any;
    listNearby = [];
    listNearbySee = [];
    listNearbyStay = [];
    listNearbyEat = [];
    type: any;
    hasNearbyType: boolean;
    swiper4: any;
    currentSwiper4: any;
    disableAddPlan: boolean;
    bookId: number;
    placeId: number;
    placeCode: string;
    isUserWish: boolean;
    itemFromListPage: any;
    current_type: any;
    directionVertical: boolean;
    listFoods = [];

    listImage: any[] = [];
    listPromotion: any[] = [];
    imgsPro: any[] = [];


    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public restaurantService: RestaurantService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public toastCtrl: ToastController,
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController,
        public fb: Facebook,
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.id = navParams.get('item');
        this.code = navParams.get('code');
        this.itemFromListPage = navParams.get('obj');
        this.isUserWish = navParams.get('isUserWish') == undefined ? false : navParams.get('isUserWish');
        this.disableAddPlan = this.navParams.get("disableAddPlan");
        if (this.disableAddPlan == undefined) {
            this.disableAddPlan = false;
        }
        // this.directionsService = new google.maps.DirectionsService;
        this.listNearbySee = [];
        this.listNearbyStay = [];
        this.listNearbyEat = [];
        this.listFoods = [];
        this.hasNearbyType = true;
        this.directionVertical = false;
        this.imgsPro = ["assets/images/try/promotions-1.jpg","assets/images/try/promotions-2.jpg","assets/images/try/promotions-3.jpg"];
    }

    init() {
        this.current_type = this.code;
        this.type = "Nhà hàng";
        this.restaurant = new Restaurant();
        this.getRestaurant(this.id, true, this.code);
        this.getPromotion(this.id,this.code);
        this.checkToken().then(data => {
            if (data && !this.disableAddPlan) {
                this.checkBookMark(this.id, this.code);
            } else {
                this.bookId = 0;
                this.placeId = 0;
                this.placeCode = "";
            }
        });
        // this.getFoods();
        // setTimeout(() => {
        //     this.loading.dismiss();
        // });
        // window.addEventListener("resize", () => {
        //     this.listNearbySee = [];
        //     this.listNearbyStay = [];
        //     this.listNearbyEat = [];
        //     this.type = "địa điểm du lịch";
        //     this.restaurant = new Restaurant();
        //     this.getRestaurant(this.id);
        // });

        // this.swiper4 = new Swiper('.swiper-container-4', {
        //     // pagination: '.swiper-pagination',
        //     slidesPerView: 'auto',
        //     paginationClickable: true,
        //     spaceBetween: 5
        // });

        // if (Array.isArray(this.swiper4)) {
        //     this.currentSwiper4 = this.swiper4[this.swiper4.length - 1];
        // } else {
        //     this.currentSwiper4 = this.swiper4;
        // }
    }

    ionViewDidLeave() {
        if (this.itemFromListPage != undefined && !this.disableAddPlan) {
            this.itemFromListPage.book_id = this.bookId;
        }
    }

    getRestaurant(id, resize, code) {
        if (resize) {
            this.showLoading();
        }
        this.restaurantService.GetRestaurantInfo(id, code).subscribe(
            data => {
                if (data.Code === 200) {
                    this.result1 = data.Result;

                    var img = "assets/iconImages/noimage.png";
                    if (this.result1.IMAGE != null) {
                        img = this.result1.IMAGE;
                    }

                    if (this.result1.PLACE_PRODUCT != null && this.result1.PLACE_PRODUCT.length > 0) {
                        this.result1.PLACE_PRODUCT.forEach(item => {
                            var newItem = item;
                            newItem.IMAGE_URL = this.changeURL(item.IMAGE_URL);
                            this.listFoods.push(newItem);
                        });
                    }

                    this.restaurant = {
                        id: this.result1.ID,
                        code: this.result1.CODE,
                        imgURL: img,
                        name: this.result1.NAME,
                        address: this.result1.ADDRESS,
                        phonenumber: this.result1.PHONE_NO,
                        website: "",
                        email: this.result1.EMAIL,
                        type: "ENTERTAINMENT",
                        aboutus: this.result1.DESCRIPTION,
                        foods: this.result1.PLACE_PRODUCT,
                        locations: this.result1.GEO_LOCATION,
                        foodsArrayCount: this.result1.PLACE_PRODUCT != null ? this.result1.PLACE_PRODUCT.length : 0,
                        use_app: this.result1.USE_APP,
                        total_bookmark: this.result1.COUNT_LIKE,
                        open_time: this.result1.OPEN_TIME,
                        close_time: this.result1.CLOSE_TIME,
                        price: this.result1.TO_AVG_PRICE,
                        NATION_ID: this.result1.NATION_ID,
                        PROVINCE_ID: this.result1.PROVINCE_ID,
                        CITY_ID: this.result1.CITY_ID,
                        url_3d: this.result1.URL_3D,
                    };
                    if (data.Result.PLACE_IMAGE != null && data.Result.PLACE_IMAGE.length > 0) {
                        data.Result.PLACE_IMAGE.forEach(element => {
                            this.listImage.push(this.changeURL(element.IMAGE_URL));
                        });
                    } else {
                        //this.listImage.push("assets/images/noimage.png");
                    }

                    if (this.loading != null && this.loading != undefined) {
                        this.loading.dismiss();
                    }

                    setTimeout(() => {
                        this.getNearby(this.restaurant, resize, code);
                    }, 1500);

                } else {
                    this.showError(data.Message);
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }

    gotoRestaurantBooking() {
        this.checkToken().then(data => {
            if (data) {
                this.navCtrl.push(BookingRestaurantPage, { item: this.id, name: this.restaurant.name, use_app: this.restaurant.use_app });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();

            }
        });

    }

    showDirection() {
        this.navCtrl.push(MapRoutePage, { locations: this.restaurant.locations, type: "entertainment" });
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
                            
                        data.Result.forEach(element => {
                            if (element.LOCATION_ID == this.restaurant.id && element.LOCATION_TYPE == 'ENTERTAINMENT') {

                            } else {
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
                                    var img = "assets/images/noimage.png";
                                    if (element.LOCATION_AVATAR != null && element.LOCATION_AVATAR && element.LOCATION_AVATAR != "") {
                                        element.LOCATION_AVATAR_DP = this.changeURL(element.LOCATION_AVATAR);
                                    } else {
                                        element.LOCATION_AVATAR_DP = "assets/images/noimage.png";
                                    }

                                    var distanceCalc = element.LOCATION_DISTANCE * 1000 * 1.2;
                                    distance = (Math.round(distanceCalc / 100)) / 10 + " km";
                                    var durationCalc = Math.round(6 * (Math.round(distanceCalc / 100)) / 10 + 1);
                                    duration = durationCalc + " phút";

                                    element.DISTANCE_CALC = distance;
                                    element.DURATION_CALC = duration;
                                    this.listResult.push(element);

                                    // var html = "";

                                    // html += '<div class="swiper-slide swiper-slide-2">';
                                    // html += '<div class="info">';
                                    // if (element.LOCATION_AVATAR != null) {
                                    //     html += '<img src="' + this.changeURL(element.LOCATION_AVATAR) + '" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
                                    // } else {
                                    //     html += '<img src="assets/iconImages/noimage.png" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '" />';
                                    // }
                                    // html += '<h5 data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '">' + element.LOCATION_NAME + '</h5>';
                                    // html += '<p data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"><span class="distance" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"><span class="icon distance-icon" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"></span>&nbsp;' + distance + '</span>&nbsp;<span class="duration" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"><span class="icon duration-icon" data-id="' + element.LOCATION_ID + '" data-type="' + element.LOCATION_TYPE + '"></span>&nbsp;' + duration + '</span></p>';
                                    // html += '</div>';
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
                                    //         distance = (Math.round(distanceCalc/100))/10 + " km";
                                    //         var durationCalc = (Math.round(element.LOCATION_DISTANCE/360)) + 1;
                                    //         duration = durationCalc + " phút";
                                    //     }

                                    // });
                                }
                            }

                        });
                        
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
    gotoRate() {
        this.checkToken().then(data => {
            if (data) {
                this.navCtrl.push(UserRateDetailPage, { objectId: this.id, typeId: this.code, type: "PLACE" });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });

    }
    changeType(type) {
        // this.currentSwiper4.removeAllSlides();
        if(this.scroll1 != null) {
            this.scroll1._scrollContent.nativeElement.scrollTo({ left: 0, top: 0 });
        }
        this.getNearby(this.restaurant, false, type);
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

    checkBookMark(resId, code) {
        this.restaurantService.checkBookMark(resId, code, "PLACE").subscribe(
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
            },
            // error => {
            //     this.showError(this.translateService.translate("network.error"));
            // }
        );
    }

    toggleSaveWishList() {
        this.checkToken().then(data => {
            if (data) {
                if (this.bookId == 0) {
                    this.searchLocationService.saveWishListH(this.restaurant.id, this.restaurant.code, "PLACE").subscribe(
                        data => {
                            if (data.Code === 200) {
                                this.bookId = data.Result.ID;
                                this.placeId = data.Result.PLACE_ID;
                                this.placeCode = data.Result.PLACE_CODE;
                                this.restaurant.total_bookmark = this.restaurant.total_bookmark + 1;
                                this.showToastWithCloseButton("Thêm yêu thích");
                            } else {
                                this.checkBookMark(this.id, this.code);
                            }
                        },
                        // error => {
                        //     this.showError(this.translateService.translate("network.error"), false);
                        // }
                    );
                } else {
                    this.searchLocationService.removeSaveWishListH(this.placeId, this.placeCode, "PLACE").subscribe(
                        data => {
                            if (data.Code === 200) {
                                this.bookId = 0;
                                this.restaurant.total_bookmark = this.restaurant.total_bookmark - 1;
                                this.showToastWithCloseButton("Bỏ yêu thích");
                            } else {
                                this.checkBookMark(this.id, this.code);
                            }
                        },
                        // error => {
                        //     this.showError(this.translateService.translate("network.error"), false);
                        // }
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

    gotoReport() {
        this.checkToken().then(data => {
            if (data) {
                this.checkToken().then(data => {
                    if (data) {
                        this.navCtrl.push(UserFeedbackDetailPage, { objectId: this.id, typeId: 1, name: this.restaurant.name });
                    } else {
                        let modal = this.modalCtrl.create(LoginPage);
                        modal.present();
                    }
                });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }

    addToPlan() {
        //console.log(this.restaurant);
        this.checkToken().then(data => {
            if (data) {
                this.navCtrl.push(PlanChoicePage, { location: this.restaurant });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }

    takePicture() {
        this.checkToken().then(data => {
            if (data) {
                this.navCtrl.push(CameraPage, { objectId: this.id, typeId: 2, name: this.restaurant.name });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });

    }

    gotoUserImage() {
        this.navCtrl.push(UserImagesPage, { objectId: this.id, typeId: 2, name: this.restaurant.name });
    }

    call(mobNumber) {
        mobNumber = encodeURIComponent(mobNumber);
        window.open("tel:" + mobNumber);
    }

    note() {
        this.checkToken().then(data => {
            if (data) {
                // this.navCtrl.push(UserNotePage, { objectId: this.id, typeId: 2, name: this.restaurant.name });
                this.navCtrl.push(UserNotePage, { objectId: this.id, typeId: this.code, name: "", locationType: "PLACE" });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }
    gotoShared() {
        this.UltilitiesService.GetShareLink(
            {
                "SharedType": "place",
                "SharedId": this.restaurant.id,
                "SharedCode": this.restaurant.code
            }
        ).subscribe(data => {
            if (data.Code == 200) {
                this.fb.showDialog(
                    {
                        method: 'share',
                        href: data.Result.Url,
                        caption: 'Such caption, very feed.',
                        description: 'Much description',
                        quote: data.Result.Content,
                        hashtag: data.Result.HashTag,
                        imageURL: Services.getImageUrl(this.restaurant.imgURL)
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
