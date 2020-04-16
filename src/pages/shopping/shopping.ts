import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PageBase } from '../../providers/page-base';
import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { SearchLocationService, HobbyService, ServiceGetting, ShoppingService, UltilitiesService } from '../../providers';
import { ShopDetailPage } from "../shop-detail/shop-detail";

import _ from 'lodash';
//import moment from 'moment';

/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shopping',
  templateUrl: 'shopping.html'
})
export class ShoppingListPage extends PageBase {

    listShop: any[];
    listShopFilter: any[];
    typeListShop: any[];
    isback: any;
    title: string;

    @ViewChild('showChild') showChild: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public searchLocationService: SearchLocationService,
        public shoppingService: ShoppingService,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listShop = [];
        this.listShopFilter = [];
        this.typeListShop = [];
        this.isback = false;
        this.title = "Địa điểm mua sắm";
    }

    init() {
        this.getShoppingListPage();
        this.getShoppingTypeListPage();
    }

    allShopType() {
        this.getShoppingListPage();
        this.closeAllListMenu();
    }

    chooseType(event:MouseEvent, typeId) {
        this.showLoading();
        this.listShop = this.listShopFilter;
        this.listShop = _.filter(this.listShop, function(shop) { return shop.Shop_Type_Id == typeId; });
        setTimeout(() => {
            this.loading.dismiss();
        });
        this.closeAllListMenu();
    }

    getShoppingListPage() {
        this.showLoading();
        this.shoppingService.GetShoppingListPage().subscribe(
        data => {
            if (data.Code === 200) {
                this.listShop = [];
                this.listShop = data.Result;
                this.listShopFilter = data.Result;
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

    getShoppingTypeListPage() {
        this.shoppingService.GetTypeShoppingListPage().subscribe(
        data => {
            if (data.Code === 200) {
                this.typeListShop = [];
                this.typeListShop = data.Result;
            } else {
                this.showError(data.Message)
            }
        },
        error => {
            this.showError(this.translateService.translate("network.error"));
        }
        );
    }

    showContentList(event, ts: string) {
            var target = this.showChild.nativeElement;
            if(target.style.visibility == "hidden") {
                this.closeAllListMenu();
                target.style.visibility = "visible";
                target.style.opacity = "1";
                target.style.zIndex = "2";
                target.style.transform = "translateY(0%)";
                target.style.transitionDelay = "0s, 0s, 0.3s";
                target.style.transitionProperty = "all, visibility, z-index";
                target.style.transitionDuration = "0.3s, 0s, 0s";
                target.style.transitionTimingFunction = "ease-in-out, linear, linear";
            } else {
                target.setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            }
        }

        closeAllListMenu() {
            var element = document.getElementsByClassName('content-list');
            var element1 = document.getElementsByClassName('type-top-list');
            var arr = [].slice.call(element);
            var arr1 = [].slice.call(element1);

            for (var index = 0; index < arr.length; index++) {
                var item = element.item(index);
                item.setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            }
            for (var index = 0; index < arr1.length; index++) {
                var item = element1.item(index);
                item.setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            }
        }

    gotoDetail(item) {
        this.isback = true;
        // this.navCtrl.push();
        //this.getChildType(item);
        
    }

    goBack() {
        //this.getListParentType();
        this.isback = false;
        this.title = "Tiện ích du lịch";
    }
    allArea() {
        let alert = this.alertCtrl.create({
            title: 'Thông báo',
            subTitle: 'Chức năng đang được cập nhật',
            buttons: [
            {
                text: 'OK',
                handler: () => {
                    this.closeAllListMenu();
                }
            }
            ]
        });
        alert.present();
    }
//   chooseType(ts) {
//     let alert = this.alertCtrl.create({
//         title: 'Thông báo',
//         subTitle: 'Chức năng đang được cập nhật',
//         buttons: [
//           {
//             text: 'OK',
//             handler: () => {
//                 this.closeAllListMenu();
//             }
//           }
//         ]
//       });
//       alert.present();
//   }
    gotoShopDetail(shop) {
        //console.log(shop);
        this.navCtrl.push(ShopDetailPage, {item: shop});
    }
}
