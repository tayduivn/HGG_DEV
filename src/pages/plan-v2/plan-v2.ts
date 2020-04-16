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
import { PlanDateEditPage } from "../plan-date-edit/plan-date-edit";

import { ListPlanPage } from "../plan-list/plan-list";

import _ from 'lodash';
import { LoginPage } from "../login/login";
import { Parameter } from '../../model/Service';
//import moment from 'moment';

/*
  Generated class for the PlanV2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-v2',
  templateUrl: 'plan-v2.html'
})
export class PlanV2Page extends PageBase {

  today: any;
  currentUser: User;
  plan = { placename: "", location: Parameter.portalifier, checkindate: null, checkoutdate: null, budget: -1, lengthDate: 1 };

  listHobbies: any[];
  listHobbiesChoice = [];
  listHobiesChoiceId = [];

  resultPlan: any;
  planType: any;

  listPlan: any[];

  listLocationId: any[];

  rangePrice: any;
  isRangePrice: boolean = false;

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
      this.listHobbies = [];
      this.listLocationId = [];
      this.plan.placename = Parameter.cityName_EN + ", VN, Vietnam";
      this.listPlan = [];
      this.listHobiesChoiceId = [];
      this.planType = 1;
      this.rangePrice = { lower: 100000, upper: 500000 };
  }

  init() {
    this.today = new Date().toISOString(); 
    this.plan.checkindate = new Date().toISOString();
    this.plan.checkoutdate = new Date().toISOString(); 
    this.plan.budget = -1;
    this.loadHobbies();
    // this.getLocationList();
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
                          name: element.NAME,
                          checked: false,
                          id: element.ID
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
                          name: element.NAME,
                          checked: false,
                          id: element.ID
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
        } else {
            item.checked = false;
        }
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
      var checkoutdate = this.addDay(this.plan.checkindate, this.plan.lengthDate - 1);

      // Convert both dates to milliseconds
      var date1_ms = checkindate.getTime();
      var date2_ms = checkoutdate.getTime();
      
      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;
        
      // Convert back to days and return
      var diff = Math.round(difference_ms/one_day) + 1;

      if(diff > 7) {
        this.showError(this.translateService.translate("error.invalidmaximum"));
      } else {
        var lower = -1;
        var upper = -1;
        if(this.isRangePrice) {
          lower = this.rangePrice.lower;
          upper = this.rangePrice.upper;
        }
        this.planService.GetPlanListByCondition(Parameter.portalifier, diff , -1, -1, this.listHobiesChoiceId, this.planType).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listPlan = _.concat(this.listPlan, data.Result);
                    //console.log(this.listPlan);
                    setTimeout(() => {
                        this.loading.dismiss();
                        this.changePageToSuggestPlan();
                    });
                
                    // if(this.listPlan.length <= 0) {
                    //     this.showError("Không tìm thấy lịch trình nào phù hợp.", false);
                    // } else {
                    //     this.navCtrl.push(ListPlanPage, {listPlan: this.listPlan, datefrom: this.plan.checkindate, dateto: this.plan.checkoutdate});
                    // }
                    
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
      var checkoutdate = this.addDay(this.plan.checkindate, this.plan.lengthDate - 1);

      // Convert both dates to milliseconds
      var date1_ms = checkindate.getTime();
      var date2_ms = checkoutdate.getTime();
      
      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;
        
      // Convert back to days and return
      var diff = Math.round(difference_ms/one_day) + 1;

      if(diff > 7) {
        this.showError(this.translateService.translate("error.invalidmaximum"));
      } else {
          var lower = -1;
          var upper = -1;
        //   if(this.isRangePrice) {
        //       lower = this.rangePrice.lower;
        //       upper = this.rangePrice.upper;
        //   }
          this.planService.GetSuggestTour(Parameter.portalifier, diff , lower, upper, this.listHobiesChoiceId, this.planType).subscribe(
            data => {
                if (data.Code === 200) {
                    var plan = data.Result[0];
                    //console.log(plan);
                    var plandetail = [];
                    
                    if(plan.TOUR_DETAIL.length > 0) {
                        for (var index = 0; index < diff; index++) {
                            var day_detail = [];
                            var sort = 1;
                            plan.TOUR_DETAIL.forEach(element => {
                                if(element.DAY == index + 1) {
                                    var addDate = this.addDay(this.plan.checkindate, index);
                                    var addDateString = this.convertDateString(addDate, "-", 2);
                                    var daylocation = {
                                        LOCATION_AVG_PRICE: element.PLACE.TO_AVG_PRICE,
                                        LOCATION_DAY: element.DAY,
                                        LOCATION_DESCRIPTION: element.PLACE.DESCRIPTION,
                                        LOCATION_GOOGLE: element.PLACE.GEO_LOCATION,
                                        TOUR_DETAIL_ID: 0,
                                        LOCATION_AVATAR: element.PLACE.IMAGE,
                                        LOCATION_ADDRESS: element.PLACE.ADDRESS,
                                        LOCATION_NAME: element.PLACE.NAME,
                                        LOCATION_ID: element.PLACE_ID,
                                        LOCATION_TYPE: element.PLACE_CODE,
                                        SORT_DAY: 1,
                                        LOCATION_START_TIME: addDateString + "T" + element.START_TIME.split('T')[1],
                                        TOUR_ID: 0,
                                        LOCATION_OPEN_TIME: element.PLACE.OPEN_TIME,
                                        LOCATION_CLOSE_TIME: element.PLACE.CLOSE_TIME,
                                        NATION_ID: element.PLACE.NATION_ID,
                                        CITY_ID: element.PLACE.CITY_ID,
                                        PROVINCE_ID: element.PLACE.PROVINCE_ID
                                    };
                                    day_detail.push(daylocation);
                                }
                            });
                            var dayItem = {
                                DAY: index + 1,
                                TOUR_ID: 0,
                                LIST_DAY_DETAILS: day_detail,
                            };
                            plandetail.push(dayItem);
                        }
                    }
                    var planconvert = {
                        CITY_ID: plan.CITY_ID,
                        COUNT_LIKE:plan.COUNT_LIKE,
                        COUNT_PRINT:plan.COUNT_PRINT,
                        COUNT_VIEW:plan.COUNT_VIEW,
                        CREATE_DATE: plan.CREATE_DATE,
                        FROM_DATE:this.plan.checkindate,
                        FROM_TOTAL: plan.FROM_TOTAL,
                        TO_TOTAL: plan.TO_TOTAL,
                        ID: 0,
                        IS_SHARE: 0,
                        LIST_HOBBY_ID: plan.LIST_HOBBY_ID,
                        LANGUAGE_ID: plan.LANGUAGE_ID,
                        LIST_PLACE_OF_TOUR_IN_DAY: plandetail,
                        TOUR_NAME: plan.NAME,
                        NATION_ID: plan.NATION_ID,
                        PROVINCE_ID: plan.PROVINCE_ID,
                        TOTAL_NUMBER_DAY: diff
                    };
                    //console.log(planconvert);
                    setTimeout(() => {
                        // this.loading.dismiss();
                    });
                    if(data.Result.length > 0) {
                        this.navCtrl.push(PlanDateEditPage, {item: planconvert, datefrom: this.plan.checkindate, dateto: checkoutdate.toISOString(), isNew: true, canEdit: true, isSuggest: true, listPlan: this.listPlan});
                    }
                
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
      this.planType = ts;
    }

    // getLocationList () {
    //     this.planService.GetTourLocation().subscribe(
    //         data => {
    //             if (data.Code === 200) {
    //                 var plan = data.Result;

    //                 // console.log(data.Result);

    //                 setTimeout(() => {
    //                 });
    //             } else {
    //                 this.showError(data.Message, false)
    //             }

    //         },
    //         error => {
    //             this.showError(error, false);
    //         }
    //     );
    // }
    checkHistory() {
        this.checkToken().then(data => {
            if(!data) {
                var modal = this.modalCtrl.create(LoginPage);
                modal.present();
            } else {
                this.navCtrl.push(PlanSavedListPage);
            }
        });
    }
}
