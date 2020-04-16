import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";

import { Booking } from "../../model/Booking";
import { BookingDetail } from "../../model/BookingDetail";
import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-booking-detail',
  templateUrl: 'booking-detail.html'
})
export class BookingDetailPage extends PageBase {

  item: Booking;

  constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public geolocation: Geolocation,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.item = this.navParams.get("item");
    }

  init() {
  }

  showDays(datefrom, dateto) {
    return this.dateDiffNight(datefrom, dateto) + " " + this.translateService.translate('data.night');
  }
}
