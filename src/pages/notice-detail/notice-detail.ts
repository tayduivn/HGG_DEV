import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService } from "../../providers";
import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notice-detail',
  templateUrl: 'notice-detail.html'
})
export class NoticeDetailPage extends PageBase {

  news: any;
  news_title: string;
  news_content: string;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public hotelService: HotelService,
      public searchLocationService: SearchLocationService,
      public translateService: TranslateService,
      public ShowUserInfo: ShowUserInfo,
      public UltilitiesService: UltilitiesService
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
  }

  init() {
    this.news = this.navParams.get("item");
    if(this.news != null) {
      this.news_title = this.news.TITLE;
      this.news_content = this.news.CONTENT;
    }
  }
}
