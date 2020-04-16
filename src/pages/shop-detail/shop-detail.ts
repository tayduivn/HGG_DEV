import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService, ShoppingService } from "../../providers";
import { TranslateService } from "../../translate";

import { MapRoutePage } from "../map-route/map-route";

import _ from 'lodash';
import moment from 'moment';
import { UserRateDetailPage } from "../user-rate/user-rate";
import { LoginPage } from "../login/login";
import { UserImagesPage } from "../user-images/user-images";
import { UserNotePage } from "../user-note/user-note";
import { PlanChoicePage } from "../plan-choice/plan-choice";
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shop-detail',
  templateUrl: 'shop-detail.html'
})
export class ShopDetailPage extends PageBase {

    shop: any;
    listProduct: any[];
    bookId: number;
    placeId: number;
    placeCode: string;
    isUserWish: boolean;
    disableAddPlan: any;

    listImage: any[] = [];

    obj: any;
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController,
        public shoppingservice: ShoppingService,
        public toastCtrl: ToastController,
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.shop = this.navParams.get("item");
        this.obj = this.navParams.get("obj");
        this.isUserWish = navParams.get('isUserWish') == undefined ? false:navParams.get('isUserWish');
        this.listProduct = [];
        this.disableAddPlan = this.navParams.get("disableAddPlan");
        if(this.disableAddPlan == null || this.disableAddPlan == undefined) {
            this.disableAddPlan = false;
        }
    }

    init() {
        this.GetShopProduct();
        this.checkToken().then(data => {
            if (data) {
                this.checkBookMark(this.shop.ID, this.shop.CODE);
            } else {
                this.bookId = 0;
                this.placeId = 0;
                this.placeCode = "";
            }
        });

        if(this.shop.PLACE_IMAGE != null && this.shop.PLACE_IMAGE.length > 0) {
            this.shop.PLACE_IMAGE.forEach(element => {
                this.listImage.push(this.changeURL(element.IMAGE_URL));
            });
        } else {
            this.listImage.push("assets/images/noimage.png");
        }
    }
    checkBookMark(resId, code) {
        this.shoppingservice.checkBookMark(resId,code,"PLACE").subscribe(
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
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }

    toggleSaveWishList() {
        this.checkToken().then(data => {
            if(data) {
                if(this.bookId == 0) {
                    this.searchLocationService.saveWishListH(this.shop.ID, this.shop.CODE, "PLACE").subscribe(
                        data => {
                            if (data.Code === 200) {
                                this.bookId = data.Result.ID;
                                this.placeId = data.Result.PLACE_ID;
                                this.placeCode = data.Result.PLACE_CODE;
                                this.shop.COUNT_LIKE = this.shop.COUNT_LIKE + 1;
                                this.showToastWithCloseButton("Thêm yêu thích");
                            } else {
                                this.checkBookMark(this.shop.ID, this.shop.CODE);
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
                                this.shop.COUNT_LIKE = this.shop.COUNT_LIKE - 1;
                                this.showToastWithCloseButton("Bỏ yêu thích");
                            } else {
                                this.checkBookMark(this.shop.ID, this.shop.CODE);
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
   
    call(mobNumber) {
        mobNumber = encodeURIComponent(mobNumber);
        window.open("tel:" + mobNumber);
    }
    gotoRate() {
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(UserRateDetailPage, { objectId: this.shop.ID, typeId: this.shop.CODE, type: "PLACE"  });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }

    gotoUserImage() {
        this.navCtrl.push(UserImagesPage, { objectId: this.shop.Shop_Id, typeId: 5, name: this.shop.Shop_Name });
    }

    gotoLocation() {
        this.navCtrl.push(MapRoutePage, { locations: this.shop.GEO_LOCATION, type: "shop" });
    }
    note() {
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(UserNotePage, { objectId: this.shop.ID, typeId: this.shop.CODE, name: "", locationType: "PLACE" });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }
    GetShopProduct() {
        this.listProduct = [];
        this.listProduct =this.shop.PLACE_PRODUCT;
        // this.shoppingservice.GetShopProduct(this.shop.Shop_Id).subscribe(data => {
        //     if(data.Code === 200) {
        //         this.listProduct = data.Result;
        //     }
        // });
    }
    addToPlan() {
        //console.log(this.hotel);
        this.checkToken().then(data => {
            if (!data) {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            } else {
                var shop = {
                    id: this.shop.ID,
                    type: this.shop.CODE,
                    NATION_ID: this.shop.NATION_ID,
                    PROVINCE_ID: this.shop.PROVINCE_ID,
                    CITY_ID: this.shop.CITY_ID,
                    price: this.shop.TO_AVG_PRICE,
                    locations:this.shop.GEO_LOCATION,
                    open_time:this.shop.OPEN_TIME,
                    close_time:this.shop.CLOSE_TIME,
                    imgURL:this.shop.IMAGE,
                    name:this.shop.NAME,
                };
                this.navCtrl.push(PlanChoicePage, { location: shop });
            }
        });

    }

    ionViewDidLeave() {
        if(this.obj != undefined) {
            this.obj.book_id = this.bookId;
        }
    }
}
