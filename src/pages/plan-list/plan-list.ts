import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { User } from '../../model/User';
import { Hobby } from '../../model/Hobby';
import { PlanDetailPage } from '../plan-detail/plan-detail';
import { PlanDateEditPage } from "../plan-date-edit/plan-date-edit";

import { LookUpPage } from "../look-up/look-up";
import { EventShowPage } from "../event-show/event-show";
import { PlanSavedListPage } from "../plan-saved-list/plan-saved-list";
import { MapPage } from "../map/map";
import { OverViewPage } from "../over-view/over-view";
import { PlanService } from "../../providers/plan-service";

import { Plan } from "../../model/Plan";
import { PlanDayDetail } from "../../model/PlanDayDetail";
import { PlanDetail } from "../../model/PlanDetail";

import _ from 'lodash';
import moment from 'moment';
import { Parameter } from '../../model/Service';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-list',
  templateUrl: 'plan-list.html'
})
export class ListPlanPage extends PageBase {

  listPlan : Plan[];
  dateFrom: any;
  dateTo: any;

  listImage: any[];

  isSuggest: boolean;
  plan: any;
  chooseTour: boolean;
  switchPage: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public showUserInfo: ShowUserInfo,
    public eventService: EventService,
    public loadingCtrl: LoadingController,
    private _translate: TranslateService,
    public alertCtrl: AlertController,
    public hobbyService: HobbyService,
    public planService: PlanService,
    public UltilitiesService: UltilitiesService,
    public toastCtrl: ToastController
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
      this.listPlan = this.navParams.get("listPlan");
      this.dateFrom = this.navParams.get("datefrom");
      this.dateTo = this.navParams.get("dateto");
      this.plan = this.navParams.get("plan");
      this.isSuggest = this.navParams.get("isSuggest");
      // console.log(this.listPlan);
      this.chooseTour = false;
      this.switchPage = false;
      this.listImage = [
        "assets/iconImages/imagelist1.jpg",
        "assets/iconImages/imagelist2.jpg",
        "assets/iconImages/imagelist3.jpg",
        "assets/iconImages/imagelist4.jpg",
      ];
  }

  init() {
  }

  getListAlbum(item: any) {
    var image = [];
    var imageDefault = this.listImage;
    // console.log(imageDefault);
    // console.log(item);
    // if(item.LIST_PLACE_OF_TOUR_IN_DAY != null) {
    //   item.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
    //     if(element.LIST_DAY_DETAILS != null) {
    //       element.LIST_DAY_DETAILS.forEach(element1 => {
    //         if (element1.LOCATION_AVATAR != null && element1.LOCATION_AVATAR != "") {
    //           image.push(this.changeURL(element1.LOCATION_AVATAR));
    //         }
    //       });
    //     }
    //   });
    // }
    if(item.ListImage != null) {
      var limit = 4;
      if(item.ListImage < 4) {
        limit = image.length;
      }
      for (var i = 0; i < limit; i++) {
        if(item.ListImage[i] != null) {
          imageDefault[i] = this.changeURL(item.ListImage[i]);
        }
      }
    }
    
    return imageDefault;
  }

  gotoDetail(item) {
    this.chooseTour = true;
    this.navCtrl.pop();
    //console.log(item);
    this.planService.GetTourById(item.ID).subscribe(data => {
      if(data.Code === 200) {
        this.navCtrl.push(PlanDetailPage, {item: data.Result, datefrom: this.dateFrom, dateto: this.dateTo});
      }
      
    });
  }

  changeToEditTour() {
    this.switchPage = true;
    this.navCtrl.pop();
    // this.navCtrl.push(ListPlanPage, {listPlan: this.listPlan, datefrom: this.plan.checkindate, dateto: this.plan.checkoutdate});
    this.navCtrl.push(PlanDateEditPage, {item: this.plan, datefrom: this.dateFrom, dateto: this.dateTo, isNew: true, canEdit: true, isSuggest: true, listPlan: this.listPlan});
  }

  changeToListTour() {
    // this.navCtrl.pop();
    // this.navCtrl.push(ListPlanPage, {listPlan: this.listPlan, datefrom: this.dateFrom, dateto: this.dateTo});
  }

  ionViewWillUnload() {
      if(!this.switchPage && !this.chooseTour) {
          this.checkToken().then(data => {
              if(data) {
                let alert = this.alertCtrl.create({
                  title: this.translateService.translate('warning.title'),
                  subTitle: this.translateService.translate('info.requestcreate'),
                  buttons: [
                    {
                        text: 'OK',
                        handler: data => {
                            // this.change(this.convertToRequest(this.list));
                          this.save();
                              // this.update();
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'Cancel'
                    }
                  ],

              });
              alert.present();
            } else {
              let toast = this.toastCtrl.create({
                message: this.translateService.translate('warning.suggestlogin'),
                duration: 2000,
                position: 'middle'
              });

              toast.onDidDismiss(() => {
                //console.log('Dismissed toast');
              });

            toast.present();
          }
      });
    }
  }

  save() {
    var TOUR_NAME = this.plan.NAME;
    var LOCATION_ID = Parameter.portalifier;
    var NUM_OF_DAY = this.plan.TOTAL_NUMBER_DAY;
    var FORM_TOTAL = this.plan.FROM_TOTAL; 
    var TO_TOTAL = this.plan.TO_TOTAL; 
    var LIST_HOBBY = this.plan.LIST_HOBBY_ID;
    var IS_SHARE = 0;
    var LIST_DETAIL = [];

    if(this.plan.L_LIST_DETAIL != null) {
      this.plan.L_LIST_DETAIL.forEach(element => {
        if(element.L_DAY_DETAIL != null) {
          element.L_DAY_DETAIL.forEach(elementDD => {
            var detail = { 
              // "TOUR_ID":elementDD.TOUR_ID,
              // "SORT_DAY":elementDD.SORT_DAY,
              // "DAY":elementDD.DAY,
              // "LOCATION_ID":elementDD.LOCATION_ID,
              // "LOCATION_TYPE":elementDD.LOCATION_TYPE,
              // "STATUS":elementDD.STATUS,
              // "LOCATION_START_TIME": "9:00",
              // "LOCATION_DESCRIPTION":elementDD.DESCRIPTION
              "TOUR_ID": elementDD.TOUR_ID,
              "SORT_DAY": 1,
              "DAY": elementDD.LOCATION_DAY,
              "PLACE_ID": elementDD.LOCATION_ID,
              "PLACE_CODE": elementDD.LOCATION_TYPE,
              "STATUS": elementDD.STATUS,
              "START_TIME": elementDD.LOCATION_START_TIME,
              "NATION_ID": elementDD.NATION_ID,
              "CITY_ID": elementDD.CITY_ID,
              "PROVINCE_ID": elementDD.PROVINCE_ID
            };
            LIST_DETAIL.push(detail);
          });
        }
      });
    }
    // console.log(LIST_DETAIL);
    this.CreateTour(TOUR_NAME, LOCATION_ID, NUM_OF_DAY, FORM_TOTAL, TO_TOTAL, LIST_HOBBY, 0, LIST_DETAIL, this.plan.TOUR_TYPE_ID);
  }

  CreateTour (
      // TOUR_ID: number, 
      TOUR_NAME: string, 
      LOCATION_ID: number, 
      NUM_OF_DAY: number,
      F_TOTAL: number, 
      TO_TOTAL: number,
      LIST_HOBBY: string,
      IS_SHARE: number,
      LIST_DETAIL: any[],
      TOUR_TYPE_ID
  ) {
    var listCheckTour = [];
      LIST_DETAIL.forEach(element => {
        listCheckTour.push({
          PLACE_ID: element.PLACE_ID,
          NATION_ID: element.NATION_ID,
          PROVINCE_ID: element.PROVINCE_ID,
          CITY_ID: element.CITY_ID
        })
      });
    this.planService.CreateTour(TOUR_NAME, LOCATION_ID, NUM_OF_DAY, F_TOTAL, TO_TOTAL, LIST_HOBBY, IS_SHARE, LIST_DETAIL, this.convertDateString(new Date(this.dateFrom), "/"), this.convertDateString(new Date(this.dateTo), "/"), TOUR_TYPE_ID, listCheckTour).subscribe(
      data => {
          if (data.Code === 200) {
              // console.log("create ok");
                let alert = this.alertCtrl.create({
                  title: this.translateService.translate('info.title'),
                  subTitle: this.translateService.translate('info.successfulcreate'),
                  buttons: [
                    {
                        text: 'OK',
                        handler: data => {
                            this.navCtrl.setRoot(OverViewPage);
                        }
                    }
                  ],

              });
              alert.present();
          } else {
              this.showError(data.Message, false)
          }
      },
      error => {
          this.showError(this.translateService.translate("network.error"), false);
      });
  }
}
