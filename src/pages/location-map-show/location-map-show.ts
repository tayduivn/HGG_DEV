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
  selector: 'page-location-map-show',
  templateUrl: 'location-map-show.html'
})
export class LocationMapShowPage extends PageBase {

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
  }
}
