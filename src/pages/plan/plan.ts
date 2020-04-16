import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { User } from '../../model/User';
import { Hobby } from '../../model/Hobby';
import { PlanDetailPage } from '../plan-detail/plan-detail';
import { UserPage } from "../user/user";
import { LookUpPage } from "../look-up/look-up";
import { EventShowPage } from "../event-show/event-show";
import { PlanSavedListPage } from "../plan-saved-list/plan-saved-list";
import { MapPage } from "../map/map";
import { OverViewPage } from "../over-view/over-view";
import { PlanService } from "../../providers/plan-service";
import { Plan } from "../../model/Plan";
import { PlanDayDetail } from "../../model/PlanDayDetail";
import { PlanDetail } from "../../model/PlanDetail";

import { ListPlanPage } from "../plan-list/plan-list";
import { PlanDateEditPage } from "../plan-date-edit/plan-date-edit";

import _ from 'lodash';
import moment from 'moment';
import { Parameter } from '../../model/Service';

/*
  Generated class for the Plan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html'
})
export class PlanPage extends PageBase {

  today: any;
  currentUser: User;
  plan = { placename: "", checkindate: null, checkoutdate: null, budget: 0, numberofday: 1, type: 1 };

  listHobbies: Hobby[];
  listHobbiesChoice = [];
  listHobiesChoiceId = [];

  resultPlan: any;

  listPlan: Plan[];

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
    public modalCtrl: ModalController
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
      this.currentUser = this.authService.getUserInfo();
      //console.log(this.currentUser);
      this.listHobbies = [];
      this.plan.placename = Parameter.cityName_EN + ", VN, Vietnam";
      this.listPlan = [];
      this.listHobiesChoiceId = [];
  }

  init() {
    this.today = new Date().toISOString(); 
    
    this.plan.checkindate = new Date().toISOString();
    this.plan.checkoutdate = new Date().toISOString(); 
    this.plan.budget = -1;

    this.loadHobbies();
  }
  changeCheckoutDate() {
    if(this.plan.checkindate < this.today) {
      let alert = this.alertCtrl.create({
        title: this.translateService.translate("error.title"),
        subTitle: this.translateService.translate("error.invaliddatefrom"),
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              this.plan.checkindate = this.today;
            }
          }
        ]
      });
      alert.present();
    }

    if(this.plan.checkindate > this.plan.checkoutdate) {
      this.plan.checkoutdate = this.plan.checkindate;
    }
  }
  changeCheckinDate() {
    if(this.plan.checkoutdate < this.today) {
      let alert = this.alertCtrl.create({
        title: this.translateService.translate("error.title"),
        subTitle: this.translateService.translate("error.invaliddatefrom"),
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              this.plan.checkindate = this.today;
              this.plan.checkoutdate = this.today;
            }
          }
        ]
      });
      alert.present();
    }
    if(this.plan.checkoutdate < this.plan.checkindate) {
      this.plan.checkindate = this.plan.checkoutdate;
    }
  }

  loadHobbies() {
    this.showLoading();
    
    this.listHobbiesChoice = [];
    this.listHobiesChoiceId = [];
    this.hobbyService.GetListFB().subscribe(
        data => {
            if (data.Code === 200) {
                this.listHobbies = [];
                this.listHobbies = _.concat(this.listHobbies, data.Result);
                
                this.listHobbies.forEach(element => {
                  this.listHobbiesChoice.push(
                      {
                          name: element.Travel_Service_Name,
                          checked: false,
                          id: element.Travel_Service_Id
                      }
                  );
                });
                setTimeout(() => {
                });
                //console.log(this.listHobbiesChoice);
            } else {
                this.showError(data.Message)
            }

        },
        error => {
            this.showError(error);
        });
       
       this.hobbyService.GetListTravel().subscribe(
        data => {
            if (data.Code === 200) {
                this.listHobbies = [];
                this.listHobbies = _.concat(this.listHobbies, data.Result);
                
                this.listHobbies.forEach(element => {
                  this.listHobbiesChoice.push(
                      {
                          name: element.Travel_Service_Name,
                          checked: false,
                          id: element.Travel_Service_Id
                      }
                  );
                });
                //console.log(this.listHobbiesChoice);
                setTimeout(() => {
                    this.loading.dismiss();
                });
            } else {
                this.showError(data.Message)
            }

        },
        error => {
            this.showError(error);
        });
    }
    changeValue(item) {
        if(item.checked == false) {
            item.checked = true;
            // if(this.listHobiesChoiceId.indexOf(item.id) < 0) {
            //   this.listHobiesChoiceId.push(item.id);
            // }
        } else {
            item.checked = false;
            // if(this.listHobiesChoiceId.indexOf(item.id) >= 0) {
            //   this.listHobiesChoiceId.slice(this.listHobbiesChoice.indexOf(item.id), 1);
            // }
        }
        // console.log(this.listHobiesChoiceId);
    }

    submit() {
      this.showLoading();
      this.listPlan = [];
      this.listHobiesChoiceId = [];

      this.listHobbiesChoice.forEach(element => {
        if(element.checked == true) {
          if(this.listHobiesChoiceId.indexOf(element.id) < 0) {
            this.listHobiesChoiceId.push(element.id);
          }
        }
      });
      
      var one_day=1000*60*60*24;

      var checkindate = new Date(this.plan.checkindate);
      var checkoutdate = new Date(this.plan.checkoutdate);

      // Convert both dates to milliseconds
      var date1_ms = checkindate.getTime();
      var date2_ms = checkoutdate.getTime();
      
      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;
        
      // Convert back to days and return
      var diff = Math.round(difference_ms/one_day) + 1;

      if(diff > 4) {
        this.showError(this.translateService.translate("error.invalidmaximum"));
      } else {
        this.planService.GetPlanListByCondition(3, diff , 0, this.plan.budget, this.listHobiesChoiceId, this.plan.type).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listPlan = _.concat(this.listPlan, data.Result);
                    
                    // this.listHobbies.forEach(element => {
                    //   this.listHobbiesChoice.push(
                    //       {
                    //           name: element.Travel_Service_Name,
                    //           checked: false,
                    //           id: element.Travel_Service_Id
                    //       }
                    //   );
                    // });
                    
                    setTimeout(() => {
                        this.loading.dismiss();
                        this.changePageToSuggestPlan();
                    });
                    //console.log(this.listPlan);

                    // if(this.listPlan.length <= 0) {
                    //     this.showError("Không tìm thấy lịch trình nào phù hợp.", false);
                    // } else {
                    //     this.navCtrl.push(ListPlanPage, {listPlan: this.listPlan, datefrom: this.plan.checkindate, dateto: this.plan.checkoutdate});
                    // }
                    // this.navCtrl.push(PlanDetailPage, {item: this.resultPlan});
                    
                } else {
                    this.showError(data.Message)
                }

            },
            error => {
                this.showError(error);
            });
      }
      
    }

    changePageToSuggestPlan() {
    //   this.showLoading();
      this.listHobiesChoiceId = [];

      this.listHobbiesChoice.forEach(element => {
        if(element.checked == true) {
          if(this.listHobiesChoiceId.indexOf(element.id) < 0) {
            this.listHobiesChoiceId.push(element.id);
          }
        }
      });
      
      var one_day=1000*60*60*24;

      var checkindate = new Date(this.plan.checkindate);
      var checkoutdate = new Date(this.plan.checkoutdate);

      // Convert both dates to milliseconds
      var date1_ms = checkindate.getTime();
      var date2_ms = checkoutdate.getTime();
      
      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;
        
      // Convert back to days and return
      var diff = Math.round(difference_ms/one_day) + 1;

      if(diff > 4) {
        this.showError(this.translateService.translate("error.invalidmaximum"));
      } else {
          var lower = -1;
          var upper = -1;
        //   if(this.isRangePrice) {
        //       lower = this.rangePrice.lower;
        //       upper = this.rangePrice.upper;
        //   }
          this.planService.GetSuggestTour(3, diff , lower, upper, this.listHobiesChoiceId, this.plan.type).subscribe(
            data => {
                if (data.Code === 200) {
                    // console.log(data.Result);

                    var plan = data.Result;

                    setTimeout(() => {
                        // this.loading.dismiss();
                    });
                    
                    this.navCtrl.push(PlanDateEditPage, {item: plan, datefrom: this.plan.checkindate, dateto: checkoutdate.toISOString(), isNew: true, canEdit: true, isSuggest: true, listPlan: this.listPlan});
                
                    // if(this.listPlan.length <= 0) {
                    //     this.showError("Không tìm thấy lịch trình nào phù hợp.", false);
                    // } else {
                    //     this.navCtrl.push(ListPlanPage, {listPlan: this.listPlan, datefrom: this.plan.checkindate, dateto: this.plan.checkoutdate});
                    // }
                    
                } else {
                    this.showError(data.Message, false)
                }

            },
            error => {
                this.showError(error, false);
            });
      }
    }

    setPlanType(ts) {
        this.plan.type = ts;
    }
}
