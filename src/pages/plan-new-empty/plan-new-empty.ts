import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, PlanService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { PlanDateChoicePage } from '../plan-date-choice/plan-date-choice';
import _ from 'lodash';
import { Parameter } from '../../model/Service';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-new-empty',
  templateUrl: 'plan-new-empty.html'
})
export class PlanNewEmptyPage extends PageBase {
  plan = { placename: Parameter.cityName_VN + ", Việt Nam", checkindate: null, checkoutdate: null, budget: 0, numberofday: 1, note: "", type: 1 };
  today: any;
  location: any;
  types: any;
  listHobbies: any[];
  listHobbiesChoice: any[];
  listHobiesChoiceId: any[];
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
      this.location = this.navParams.get("location");
      //console.log(this.location);
      this.listHobbies = [];
      this.listHobbiesChoice = [];
      this.listHobiesChoiceId = [];
      this.loadHobbies();
  }

  init() {

    this.today = new Date().toISOString(); 
    this.plan.checkindate = new Date().toISOString();
    this.plan.checkoutdate = new Date().toISOString(); 
    this.plan.budget = 0;

  }
  changeCheckoutDate() {
    if(this.plan.checkindate < this.today) {
      let alert = this.alertCtrl.create({
        title: this.translateService.translate('error.title'),
        subTitle: this.translateService.translate('error.invaliddatefrom'),
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
        title: this.translateService.translate('error.title'),
        subTitle: this.translateService.translate('error.invaliddatefrom'),
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

  submit() {
    this.showLoading();
    var day = [];
    var createTourDay = {
			// "TOUR_ID":1,
			// "SORT_DAY": 1,
			// "DAY": 1,
			// "LOCATION_ID": this.location.id,
			// "LOCATION_TYPE": this.location.type,
			// "STATUS": 1,
			// "LOCATION_START_TIME":"09:00",
			// "DESCRIPTION": this.plan.note,
      "TOUR_ID": 0,
      "SORT_DAY": 1,
      "DAY": 1,
      "PLACE_ID": this.location.id,
      "PLACE_CODE": this.location.type,
      "STATUS": 1,
      "START_TIME": "09:00",
      "NATION_ID": this.location.NATION_ID,
      "CITY_ID": this.location.CITY_ID,
      "PROVINCE_ID": this.location.PROVINCE_ID
    };
    day.push(createTourDay);
    this.listHobbiesChoice.forEach(element => {
      if(element.checked == true) {
        if(this.listHobiesChoiceId.indexOf(element.id) < 0) {
          this.listHobiesChoiceId.push(element.id);
        }
      }
    });
    var listCheckTour = [];
      day.forEach(element => {
        listCheckTour.push({
          PLACE_ID: element.PLACE_ID,
          NATION_ID: element.NATION_ID,
          PROVINCE_ID: element.PROVINCE_ID,
          CITY_ID: element.CITY_ID
        })
      });

      this.CreateTour(this.plan.placename + " " + this.todayString(), Parameter.portalifier, this.dateDiff(this.plan.checkindate, this.plan.checkoutdate), -1, -1, this.arrayToString(this.listHobiesChoiceId), 0, day, this.plan.type, listCheckTour);
    // this.PlanService.CreateTour(
    //   this.plan.placename + " " + this.todayString(),
    //   607,
    //   this.dateDiff(this.plan.checkindate, this.plan.checkoutdate), 
    //   0, 
    //   0, 
    //   this.arrayToString(this.listHobiesChoiceId), 
    //   0, 
    //   day, 
    //   this.convertDateString(new Date(this.plan.checkindate), "/"), 
    //   this.convertDateString(new Date(this.plan.checkoutdate), "/"), 
    //   this.plan.type,
    //   listCheckTour
    // ).subscribe(
    //   data => {
    //     if(data.Code === 200) {
    //       this.loading.dismiss();
    //       let alert = this.alertCtrl.create({
    //           title: this.translateService.translate('info.title'),
    //           subTitle: this.translateService.translate('info.successfulcreate'),
    //           buttons: [{
    //             text: "OK",
    //             handler: () => {
    //               this.navCtrl.pop();
    //               this.navCtrl.pop();
    //             }
    //           }],
    //       });
    //       alert.present();
          
    //     } else {
    //       this.showError(data.Message);
    //     }
    //   },
    //   error => {
    //       this.showError(this.translateService.translate("network.error"));
    //   }
    // );
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
      TOUR_TYPE_ID,
      listCheckTour: any[]
  ) {
    //var dateTo = this.addDay(this.datefrom, NUM_OF_DAY - 1);
    this.PlanService.CreateTour(TOUR_NAME, LOCATION_ID, NUM_OF_DAY, F_TOTAL, TO_TOTAL, LIST_HOBBY, IS_SHARE, LIST_DETAIL, this.convertDateString(new Date(this.plan.checkindate), "/"), this.convertDateString(new Date(this.plan.checkoutdate), "/"), TOUR_TYPE_ID, listCheckTour).subscribe(
      data => {
          if (data.Code === 200) {
              // console.log("create ok");
                setTimeout(() => {
                  this.loading.dismiss();
                });
                let alert = this.alertCtrl.create({
                  title: this.translateService.translate("info.title"),
                  subTitle: this.translateService.translate("info.successfulcreate"),
                  buttons: [
                    {
                        text: 'OK',
                        handler: data => {
                            this.navCtrl.pop();
                            this.navCtrl.pop();
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

  private arrayToString (arr: any[]): string {
      if(arr.length > 0) {
          var str = "";
          if(arr.length > 1) {
              for (var index = 0; index < arr.length - 1; index++) {
              str += arr[index] + ",";
              }
          }
          str += arr[arr.length - 1];
          return str;
      } else {
          return "";
      }
  }

  setPlanType(ts) {
    this.plan.type = ts;
  }

  todayString(): string {
    var today = new Date();

    return today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear();
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
}
