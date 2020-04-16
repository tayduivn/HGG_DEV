import { Component, } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService } from "../../providers";
import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the DetailPromotionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-promotion-modal',
    templateUrl: 'promotion-modal.html'
})
export class DetailPromotionPage extends PageBase {

    listPromotion: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService,
        public viewCtrl: ViewController

    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listPromotion = this.navParams.get("data_promotion");
    }

    init() {
        //console.log(this.listPromotion)
    }

    dismissModalPromotion() {
        this.viewCtrl.dismiss();
    }
}
