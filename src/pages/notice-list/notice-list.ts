import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService, EventService } from "../../providers";
import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';
import { NoticeDetailPage } from '../notice-detail/notice-detail';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notice-list',
  templateUrl: 'notice-list.html'
})
export class NoticeListPage extends PageBase {

  listNotice: any[] = [];

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public hotelService: HotelService,
      public searchLocationService: SearchLocationService,
      public translateService: TranslateService,
      public ShowUserInfo: ShowUserInfo,
      public UltilitiesService: UltilitiesService,
      public EventService: EventService
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
  }

  init() {
    this.loadNoticeList();
  }

  loadNoticeList() {
    this.EventService.GetListSeparatedLC("N_NOTICE").subscribe(data => {
      if(data.Code === 200) {
        this.listNotice = data.Result;
      }
    });
  }

  goToDetail(item) {
    this.EventService.GetDetailH(item.ID, item.CODE).subscribe(data => {
      if(data.Code === 200) {
        this.navCtrl.push(NoticeDetailPage, {item: data.Result});
      }
    });
  }
}
