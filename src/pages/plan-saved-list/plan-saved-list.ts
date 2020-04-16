import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { MapPage } from "../map/map";
import { LookUpPage } from "../look-up/look-up";
import { EventShowPage } from "../event-show/event-show";
import { PlanPage } from "../plan/plan";
import { PlanDetailPage } from "../plan-detail/plan-detail";
import { OverViewPage } from "../over-view/over-view";

import { PlanService} from "../../providers/plan-service";
import { PlanDateEditPage } from "../plan-date-edit/plan-date-edit";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the PlanSavedList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-saved-list',
  templateUrl: 'plan-saved-list.html'
})
export class PlanSavedListPage extends PageBase {

  currentUser: any;
  listResult: any[];
  locationID: number;
  id: number;
  listShow: any[];

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
      // console.log(this.currentUser);
      this.listResult = [];
      this.listShow = [];
  }
  init() {
    // this.listResult = this.getListPlan();
    // console.log(this.listResult);

    // this.listResult.forEach(element => {
    //   this.listShow.push({
    //     name: element.name,
    //     id: element.id,
    //     price: element.moneyExpected,
    //     dates: this.showTime(element)
    //   });
    // });
  }

  ionViewWillEnter() {
    this.getListTourByID();
  }

  showTime(item): string {
    if(item.days != null) {
      return this.translateService.translate('userbooking.fromdate') + " " + item.days[0].date + " "+ this.translateService.translate('userbooking.todate') + " " + item.days[item.days.length - 1].date;
    }
    return "";
  }

  gotoDetail(item) {
    // this.navCtrl.push(PlanDetailPage, {item: this.getDataByID(item.TOUR_ID)});
    this.getDataByID(item);
  }

  getDataByID(item) {
    this.showLoading();
    this.PlanService.GetTourById(item.ID).subscribe(
      data => {
        //console.log(data);
        if (data.Code === 200) {
          
          // this.listShow = _.concat(this.listShow, data.Result);
          var result = data.Result;

          //console.log(result);
          
          this.navCtrl.push(PlanDateEditPage, {item: result, datefrom: item.FROM_DATE, dateto: item.TO_DATE, isNew: false, canEdit: true, planhistory: item.ID});
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

  remove(event, item) {
    //console.log(item);
    event.stopPropagation();
    let alert = this.alertCtrl.create({
      title: this.translateService.translate("error.title"),
      subTitle: this.translateService.translate('warning.deleteplan'),
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.PlanService.DeleteTour(item.ID).subscribe(data => {
              if(data.Code == 200) {
                this.listShow.forEach((element, index) => {
                  //console.log(element);
                  if(element.ID == item.ID) {
                    this.listShow.splice(index, 1);
                  }
                });
              } else {
                this.showError(data.Message);
              }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    alert.present();
    
    return false;
  }

//   changeToMapPage() {
//       this.navCtrl.setRoot(MapPage);
//   }
//   changeToHomePage() {
//       this.navCtrl.setRoot(EventShowPage);
//   }
//   changeToLookUpPage () {
//       this.navCtrl.setRoot(LookUpPage);
//   }
//   changeToPlanPage() {
//       this.navCtrl.setRoot(PlanPage);
//   }
//   changeToOverViewPage() {
//       this.navCtrl.setRoot(OverViewPage);
//   }

  getListTourByID() { 
    this.showLoading();
    this.listShow = [];
    this.PlanService.GetListTourByUser().subscribe(
      data => {
        //console.log(data);
        if (data.Code === 200) {
            this.listShow = _.concat(this.listShow, data.Result);

            // console.log(this.listShow);
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
}
