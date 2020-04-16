import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, PlanService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { PlanDateDetailPage } from '../plan-date-detail/plan-date-detail';
import { PlanDateEditPage } from "../plan-date-edit/plan-date-edit";

import { Plan } from "../../model/Plan";
import { PlanDayDetail } from "../../model/PlanDayDetail";
import { PlanDetail } from "../../model/PlanDetail";

import _ from 'lodash';
import moment from 'moment';
import { Parameter } from '../../model/Service';

/*
  Generated class for the PlanDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-detail',
  templateUrl: 'plan-detail.html'
})
export class PlanDetailPage extends PageBase {

  currentUser: any;

  plan: any;
  // days : any[];
  // showCount: any;
  // fDate: any;
  totalPlace: any;
  datefrom: any;
  dateto: any;
  datestartshow: string;
  createAlready: boolean;

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
    public PlanService: PlanService,
    public UltilitiesService: UltilitiesService
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
      this.currentUser = this.authService.getUserInfo();
      this.plan = this.navParams.get("item");
      this.datefrom = this.navParams.get("datefrom");
      this.dateto = this.navParams.get("dateto");
      this.fillUpDate();
      this.createAlready = false;
  }

  init() {
    this.totalPlace = this.getTotalPlace();
    var dateStart = new Date(this.datefrom);
    this.datestartshow = this.convertDateString(dateStart, "-");
  }

  getTotalPlace(): string {
    var total = 0;
    // if(this.plan.L_LIST_DETAIL != null) {
      for (var index = 0; index < this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length; index++) {
        if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY[index].LIST_DAY_DETAILS != null) {
          total += this.plan.LIST_PLACE_OF_TOUR_IN_DAY[index].LIST_DAY_DETAILS.length;
        }
      }
      // this.days.forEach(element => {
      //   total += element.locations.length;
      // });
      return total.toString();
    // }
    // return "0";
  }

  fillUpDate() {
    var listDay = [];
    if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
      if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length < this.plan.TOTAL_NUMBER_DAY) {
        for (var index = 0; index < this.plan.TOTAL_NUMBER_DAY; index++) {
          var planDay = new PlanDetail();
          planDay.DAY = index + 1;
          planDay.LIST_DAY_DETAILS = [];
          //console.log(planDay.DAY);
          if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length > 0) {
            this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
              if(element.DAY == index + 1) {
                planDay.LIST_DAY_DETAILS = element.LIST_DAY_DETAILS;
              }
            });
          }
          planDay.TOUR_ID = this.plan.TOUR_ID;
          listDay.push(planDay);
          //console.log(listDay);
        }
        this.plan.LIST_PLACE_OF_TOUR_IN_DAY = listDay;
      }
    } else {
      for (var index = 0; index < this.plan.TOTAL_NUMBER_DAY; index++) {
        var planDay = new PlanDetail();
        planDay.DAY = index + 1;
        planDay.LIST_DAY_DETAILS = null;
        //console.log(planDay.DAY);
        // if(this.plan.L_LIST_DETAIL.length > 0) {
        //   this.plan.L_LIST_DETAIL.forEach(element => {
        //     if(element.DAY == index + 1) {
        //       planDay.L_DAY_DETAIL = element.L_DAY_DETAIL;
        //     }
        //   });
        // }
        planDay.TOUR_ID = this.plan.TOUR_ID;
        listDay.push(planDay);
        //console.log(listDay);
        this.plan.LIST_PLACE_OF_TOUR_IN_DAY = listDay;
      }
    }

    //console.log(this.plan);
    
  }

  // CreateTour (
  //     // TOUR_ID: number, 
  //     TOUR_NAME: string, 
  //     LOCATION_ID: number, 
  //     NUM_OF_DAY: number,
  //     F_TOTAL: number, 
  //     TO_TOTAL: number,
  //     LIST_HOBBY: string,
  //     IS_SHARE: number,
  //     LIST_DETAIL: any[],
  //     TOUR_TYPE_ID: any
  // ) {
  //   this.PlanService.CreateTour(TOUR_NAME, LOCATION_ID, NUM_OF_DAY, F_TOTAL, TO_TOTAL, LIST_HOBBY, IS_SHARE, LIST_DETAIL, this.convertDateString(new Date(this.datefrom), "/"), this.convertDateString(new Date(this.dateto), "/"),TOUR_TYPE_ID).subscribe();
  //   this.createAlready = true;
  // }

  // save() {
  //   var TOUR_ID = this.plan.TOUR_ID;
  //   var TOUR_NAME = this.plan.TOUR_NAME;
  //   var LOCATION_ID = this.plan.LOCATION_ID;
  //   var NUM_OF_DAY = this.plan.TOTAL_NUMBER_DAY;
  //   var FORM_TOTAL = this.plan.F_TOTAL; 
  //   var LIST_HOBBY = this.plan.LIST_HOBBY;
  //   var IS_SHARE = 0;
  //   var LIST_DETAIL = [];

  //   this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
  //     element.LIST_DAY_DETAILS.forEach(elementDD => {
  //       var detail = { 
  //         "TOUR_ID":elementDD.TOUR_ID,
  //         "SORT":elementDD.SORT_DAY,
  //         "DAY":elementDD.LOCATION_DAY,
  //         "OBJECT_ID":elementDD.LOCATION_ID,
  //         "OBJECT_TYPE_ID":elementDD.LOCATION_TYPE,
  //         "STATUS":elementDD.STATUS,
  //         "TIME": "9:00",
  //         "DESCRIPTION":elementDD.LOCATION_DESCRIPTION
  //       };
  //     });
  //   });
  // }

  gotoPlanDayDetail(item: PlanDetail) {
    this.navCtrl.push(PlanDateDetailPage, { TOUR_ID: this.plan.TOUR_ID, data: { dayname: item.DAY, locations: item.LIST_DAY_DETAILS }, canEdit: false, datefrom: this.datefrom });
  }

  gotoEdit() {
    //console.log(this.plan);
    var tempPlan = new Plan();
    tempPlan.TOUR_NAME = Parameter.cityName_VN + ", "+ this.convertDateString(new Date(this.datefrom), "/");
    tempPlan.LOCATION_ID = this.plan.LOCATION_ID;
    tempPlan.TOTAL_NUMBER_DAY = this.plan.TOTAL_NUMBER_DAY;
    tempPlan.F_TOTAL = this.plan.FROM_TOTAL;
    tempPlan.T_TOTAL = this.plan.TO_TOTAL;
    tempPlan.LIST_HOBBY = this.plan.LIST_HOBBY_ID;
    tempPlan.IS_SHARE = 0;
    tempPlan.LIST_PLACE_OF_TOUR_IN_DAY = this.plan.LIST_PLACE_OF_TOUR_IN_DAY;
    this.navCtrl.push(PlanDateEditPage, {item: tempPlan, datefrom: this.datefrom, dateto: this.dateto, isNew: true, canEdit: true});
  }

  getPlanTotalLocation(item) {
    if(item.LIST_DAY_DETAILS != null) {
      return item.LIST_DAY_DETAILS.length;
    }
    return 0;
  }

  // // getDayCount(): string {
  // //   return this.days.length.toString();
  // // }

  // // getFirstDate(): string {
  // //   return this.days[0].date;
  // // }

  // getTotalPlace(): string {
  //   var total = 0;
  //   if(this.plan.L_LIST_DETAIL != null) {
  //     for (var index = 0; index < this.plan.L_LIST_DETAIL.length; index++) {
  //       total += this.plan.L_LIST_DETAIL[index].L_DAY_DETAIL.length;
  //     }
  //     // this.days.forEach(element => {
  //     //   total += element.locations.length;
  //     // });
  //     return total.toString();
  //   } else {
  //     return "0";
  //   }
  // }

  // gotoPlanDayDetail(item) {
  //   this.navCtrl.push(PlanDateDetailPage, { TOUR_ID: this.plan.ID, data: { dayname: item.DAY, locations: item.L_DAY_DETAIL } });
  // }

  // // getPlanTitle(item) {
  // //   var date = new Date(parseInt(item.date.split('-')[2]), parseInt(item.date.split('-')[1]), parseInt(item.date.split('-')[0]));

  // //   var arrayDate = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

  // //   return "Ngày " + (this.getIndexDay(item) + 1) + ", " +arrayDate[date.getDay()] + ", " + date.getUTCDate() + "-" + date.getUTCMonth() + "-" + date.getUTCFullYear() ;
  // // }

  // // getIndexDay(item) {
  // //   for (var index = 0; index < parseInt(this.showCount); index++) {
  // //     if(item == this.days[index]) {
  // //       return index;
  // //     }
  // //   }
  // // }

  // getPlanTotalLocation(item) {
  //   return item.L_DAY_DETAIL == null ? "0" : item.L_DAY_DETAIL.length;
  // }

  // gotoEdit() {
  //   this.navCtrl.push(PlanDateEditPage, {item: this.plan, datefrom: this.datefrom, dateto: this.dateto});
  // }

  // choose() {
  //   console.log(this.datefrom);
  //   console.log(this.dateto);
  //   this.PlanService.MapTour(this.plan.TOUR_ID, this.convertDateString(new Date(this.datefrom), "/"), this.convertDateString(new Date(this.dateto), "/")).subscribe(
  //     data => {
  //       if(data.Code === 200) {
  //         let alert = this.alertCtrl.create({
  //           title: this.translateService.translate("info.title"),
  //           subTitle: this.translateService.translate("info.succesfullymodify"),
  //           buttons: [
  //             {
  //               text: 'OK',
  //               handler: data => {
  //                 this.navCtrl.pop();
  //               }
  //             }],

  //         });
  //         alert.present();
  //       } else {
  //         this.showError(data.Message, false);
  //       }
  //     }, error => {
  //       this.showError(this.translateService.translate("network.error"), false);
  //     }
  //   );
  // }
}