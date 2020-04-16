import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";

import { Booking } from "../../model/Booking";
import { BookingDetail } from "../../model/BookingDetail";

import { BookingDetailPage } from "../booking-detail/booking-detail";
import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the MapRoute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-booking',
  templateUrl: 'user-booking.html'
})
export class UserBookingPage extends PageBase {

  listBooking: Booking[];

  constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
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
        this.listBooking = [];
    }

  init() {
      this.getListBooking();
  }

  getListBooking() {
    this.showLoading();
    this.listBooking = [];
    this.ShowUserInfo.getUserBooking().subscribe(
       data => {
            if (data.Code === 200) {
                this.listBooking = _.concat(this.listBooking, data.Result);
                // console.log( this.listBooking);
                setTimeout(() => {
                    this.loading.dismiss();
                });
            } else {
                this.showError(data.Message);
            }
        },
        error => {
            this.showError(this.translateService.translate("network.error"));
        }
    );
  }
  gotoDetailBooking(item) {
    //console.log(item);
    this.navCtrl.push(BookingDetailPage, {item: item});
  }
}
