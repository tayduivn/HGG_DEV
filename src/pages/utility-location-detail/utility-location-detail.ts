import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PageBase } from '../../providers/page-base';
import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { SearchLocationService, UltilitiesService, HobbyService, ServiceGetting } from '../../providers';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilityLocation } from "../../model/UtilityLocation";
import { MapRoutePage } from "../map-route/map-route";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-utility-location-detail',
  templateUrl: 'utility-location-detail.html'
})
export class UtilityLocationDetailPage extends PageBase {

  utility: any;

  constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private geolocation: Geolocation,
        public alertCtrl: AlertController,
        public searchLocationService: SearchLocationService,
        public ultilitiesService: UltilitiesService,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);

      this.utility = this.navParams.get("item");
  }

  init() {

  }

  showDirection() {
    //console.log(this.utility.alias);
    this.navCtrl.push(MapRoutePage, {locations: this.utility.location, type: "utility"});
  }
}
