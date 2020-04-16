import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, ShowUserInfo, UltilitiesService } from '../../providers';

import { PlanSavedListPage } from "../plan-saved-list/plan-saved-list";
import { UserBookingPage } from "../user-booking/user-booking";
import { UserChangeInfoPage } from "../user-change-info/user-change-info";
import { UserHobbiesPage } from "../user-hobbies/user-hobbies";
import { UserWishListPage } from "../user-wishlist/user-wishlist";

import { TranslateService } from "../../translate";

import { OverViewPage } from "../over-view/over-view";
import { PlanV2Page } from "../plan-v2/plan-v2";
import { EventShowPage } from "../event-show/event-show";
import { MapPage } from "../map/map";
import { ListNotePage } from "../list-note/list-note";

/*
  Generated class for the MapRoute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage extends PageBase {

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
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
    }

  init() {
      
  }

  UserInfoChange() {
    this.navCtrl.push(UserChangeInfoPage);
  }

  UserHobbies() {
    this.navCtrl.push(UserHobbiesPage);
  }

  UserBooking() {
    this.navCtrl.push(UserBookingPage);
  }

  UserPlanSaved() {
    this.navCtrl.push(PlanSavedListPage);
  }

  UserWishList() {
    this.navCtrl.push(UserWishListPage);
  }

  UserNote() {
    this.navCtrl.push(ListNotePage);
  }
}
