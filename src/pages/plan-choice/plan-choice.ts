import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { PlanDateChoicePage } from '../plan-date-choice/plan-date-choice';
import { PlanNewEmptyPage } from "../plan-new-empty/plan-new-empty";
import { PlanService } from "../../providers/plan-service";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the PlanChoice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-choice',
  templateUrl: 'plan-choice.html'
})
export class PlanChoicePage extends PageBase {

  currentUser: any;
  listResult: any[];
  location: any;
  id: number;
  listLocations: any[];
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
      //console.log(this.currentUser);
      this.listResult = [];
      // this.listLocations = this.navParams.get("locations");
      this.location = this.navParams.get("location");
      this.listShow = [];
  }

  init() {
    this.getListTourByID();
  }
  getSubtitle(item) {
    return this.translateService.translate("pc.fromdate") + " " + this.convertDateString(new Date(item.FROM_DATE), "-") + " " + this.translateService.translate("pc.todate") + " " + this.convertDateString(new Date(item.TO_DATE), "-");
  }

  gotochooseDayPlan(item) {
    // this.navCtrl.push(PlanDateChoicePage, {data: {location: this.location, plan: item}});
    this.getDataByID(item);
  }

  createNewPlan() {
    this.navCtrl.push(PlanNewEmptyPage, {location: this.location});
  }

  getListTourByID() { 
    this.showLoading();
    this.listShow = [];
    this.PlanService.GetListTourByUser().subscribe(
      data => {
        //console.log(data);
        if (data.Code === 200) {
            this.listShow = _.concat(this.listShow, data.Result);

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
  getDataByID(item) {
    this.PlanService.GetTourById(item.ID).subscribe(
      data => {
            if (data.Code === 200) {
                // this.listShow = _.concat(this.listShow, data.Result);
                var result = data.Result;

                this.navCtrl.push(PlanDateChoicePage, {item: result, datefrom: item.FROM_DATE, dateto: item.TO_DATE, location: this.location});
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
