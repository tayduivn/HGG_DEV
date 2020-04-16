import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, PlanService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { PlanDateDetailPage } from '../plan-date-detail/plan-date-detail';
import { OverViewPage } from "../over-view/over-view";

import { Plan } from "../../model/Plan";
import { PlanDayDetail } from "../../model/PlanDayDetail";
import { PlanDetail } from "../../model/PlanDetail";
import { ListPlanPage } from "../plan-list/plan-list";

import _ from 'lodash';
import moment from 'moment';
import { LoginPage } from "../login/login";
import { Parameter } from '../../model/Service';
/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-date-edit',
  templateUrl: 'plan-date-edit.html'
})
export class PlanDateEditPage extends PageBase {

  currentUser: any;

  plan: any;
  // days : any[];
  // showCount: any;
  // fDate: any;
  totalPlace: any;
  datefrom: any;
  datestartshow: string;
  dateto: any;
  listDelete: any[];
  listOriginalID: any[];
  isNew: boolean;
  canEdit: boolean;
  originListPlan: PlanDetail[];
  originDayPlan: number;
  planhistory: any;
  didSaved: boolean;
  TOUR_TYPE_ID: any;
  isSuggest: boolean;
  listPlan: any[];
  switchPage: boolean;
  didModify: boolean = false;

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
    public UltilitiesService: UltilitiesService,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
      this.plan = this.navParams.get("item");
      console.log(this.plan);
      this.datefrom = this.navParams.get("datefrom");
      var dateStart = new Date(this.datefrom);
      this.datestartshow = dateStart.getDate() + "-" + (dateStart.getMonth() + 1) + "-" + dateStart.getFullYear();
      this.dateto = this.navParams.get("dateto");
      this.isNew = this.navParams.get("isNew");
      this.isSuggest = this.navParams.get("isSuggest");
      this.listPlan = this.navParams.get("listPlan");
      if(this.isSuggest == undefined) {
        this.isSuggest = false;
      }
      this.switchPage = false;
      this.didSaved = false;
      this.canEdit = this.navParams.get("canEdit");
      this.planhistory = this.navParams.get("planhistory");
      this.TOUR_TYPE_ID = this. navParams.get("TOUR_TYPE_ID");
      if(this.planhistory == undefined || this.planhistory == null) {
        this.planhistory = -1;
      }
      this.originDayPlan = this.plan.TOTAL_NUMBER_DAY;
      this.originListPlan = [];
      if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
        this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
          this.originListPlan.push(element);
        });
      }
      // console.log(this.plan.L_LIST_DETAIL[0].L_DAY_DETAIL);

      this.listOriginalID = [];

      if(this.plan != null) {
        if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
          this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
            if(element.LIST_DAY_DETAILS != null) {
              element.LIST_DAY_DETAILS.forEach(element1 => {
                this.listOriginalID.push({
                  ID: element1.LOCATION_ID,
                  TYPE: element1.LOCATION_TYPE,
                  TIME: element1.LOCATION_START_TIME
                });
              });
            }
          });
        }
      }

      this.listDelete = [];

      this.fillUpDate();
      //console.log(this.listOriginalID);
      // this.listOriginalID = this.getlistId(this.plan);
  }

  ionViewWillEnter() {
    // console.log(this.plan);
  }

  init() {
    // this.days = this.plan.days;
    // this.showCount = this.getDayCount();
    // this.fDate = this.getFirstDate();
    this.totalPlace = this.getTotalPlace();
    var dateStart = new Date(this.datefrom);
    this.datestartshow = this.convertDateString(dateStart, "-");
  }

  // getDayCount(): string {
  //   return this.days.length.toString();
  // }

  // getFirstDate(): string {
  //   return this.days[0].date;
  // }

  getTotalPlace(): string {
    var total = 0;
    if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
      for (var index = 0; index < this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length; index++) {
        if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY[index].LIST_DAY_DETAILS != null) {
          total += this.plan.LIST_PLACE_OF_TOUR_IN_DAY[index].LIST_DAY_DETAILS.length;
        }
      }
      // this.days.forEach(element => {
      //   total += element.locations.length;
      // });
      return total.toString();
    }
    return "0";
  }

  fillUpDate() {
    var listDay = [];
    if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
      if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length < this.plan.TOTAL_NUMBER_DAY) {
        for (var index = 0; index < this.plan.TOTAL_NUMBER_DAY; index++) {
          var planDay = new PlanDetail();
          planDay.DAY = index + 1;
          planDay.LIST_DAY_DETAILS = [];
          // console.log(planDay.DAY);
          if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length > 0) {
            this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
              if(element.DAY == index + 1) {
                planDay.LIST_DAY_DETAILS = element.LIST_DAY_DETAILS;
              }
            });
          }
          planDay.TOUR_ID = this.plan.TOUR_ID;
          listDay.push(planDay);
          // console.log(listDay);
        }
        this.plan.LIST_PLACE_OF_TOUR_IN_DAY = listDay;
      }
    } else {
      for (var index = 0; index < this.plan.TOTAL_NUMBER_DAY; index++) {
        var planDay = new PlanDetail();
        planDay.DAY = index + 1;
        planDay.LIST_DAY_DETAILS = null;
        // console.log(planDay.DAY);
        // if(this.plan.L_LIST_DETAIL.length > 0) {
        //   this.plan.L_LIST_DETAIL.forEach(element => {
        //     if(element.DAY == index + 1) {
        //       planDay.L_DAY_DETAIL = element.L_DAY_DETAIL;
        //     }
        //   });
        // }
        planDay.TOUR_ID = this.plan.TOUR_ID;
        listDay.push(planDay);
        // console.log(listDay);
        this.plan.LIST_PLACE_OF_TOUR_IN_DAY = listDay;
      }
    }

    // console.log(this.plan);
    
  }

  // getlistId(plan) {
  //   var idlist = [];
  //   if(plan.L_LIST_DETAIL != null) {
  //     this.plan.L_LIST_DETAIL.forEach(element => {
  //       if(element.L_DAY_DETAIL != null) {
  //         element.L_DAY_DETAIL.forEach(elementDay => {
  //           idlist.push(elementDay.OBJECT_ID);
  //         });
  //       }
  //     });
  //   }
  //   return idlist;
  // }

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
    var dateTo = this.addDay(this.datefrom, NUM_OF_DAY - 1);
    this.PlanService.CreateTour(TOUR_NAME, LOCATION_ID, NUM_OF_DAY, F_TOTAL, TO_TOTAL, LIST_HOBBY, IS_SHARE, LIST_DETAIL, this.convertDateString(new Date(this.datefrom), "/"), this.convertDateString(dateTo, "/"), TOUR_TYPE_ID, listCheckTour).subscribe(
      data => {
          if (data.Code === 200) {
              // console.log("create ok");
                let alert = this.alertCtrl.create({
                  title: this.translateService.translate("info.title"),
                  subTitle: this.translateService.translate("info.successfulcreate"),
                  buttons: [
                    {
                        text: 'OK',
                        handler: data => {
                            this.navCtrl.setRoot(OverViewPage);
                            this.didSaved = true;
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

  save() {
    this.checkToken().then(data => {
      if(data) {
        var TOUR_ID = this.plan.ID;
        var TOUR_NAME = this.plan.TOUR_NAME;
        var LOCATION_ID = Parameter.portalifier;
        var NUM_OF_DAY = this.plan.TOTAL_NUMBER_DAY;
        var FORM_TOTAL = this.plan.FROM_TOTAL; 
        var TO_TOTAL = this.plan.TO_TOTAL; 
        var LIST_HOBBY = this.plan.LIST_HOBBY_ID == undefined || this.plan.LIST_HOBBY_ID == null ? "" : this.plan.LIST_HOBBY_ID;
        var IS_SHARE = 0;
        var LIST_DETAIL = [];

        if(this.isNew) {
          if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
            this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
              if(element.LIST_DAY_DETAILS != null) {
                element.LIST_DAY_DETAILS.forEach(elementDD => {
                  // console.log(elementDD.TIME.split('T')[1].split(':')[0] + ":" + elementDD.TIME.split('T')[1].split(':')[1]);
                  elementDD.LOCATION_START_TIME = elementDD.LOCATION_START_TIME.split('T')[1].split(':')[0] + ":" + elementDD.LOCATION_START_TIME.split('T')[1].split(':')[1];
                  var detail = { 
                    // "TOUR_ID":elementDD.TOUR_ID,
                    // "SORT_DAY":elementDD.SORT_DAY,
                    // "DAY":elementDD.LOCATION_DAY,
                    // "LOCATION_ID":elementDD.LOCATION_ID,
                    // "LOCATION_TYPE":elementDD.LOCATION_TYPE,
                    // "STATUS":elementDD.STATUS,
                    // "LOCATION_START_TIME": elementDD.LOCATION_START_TIME,
                    // "LOCATION_DESCRIPTION":elementDD.LOCATION_DESCRIPTION
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
          var listCheckTour = [];
          LIST_DETAIL.forEach(element => {
            listCheckTour.push({
              PLACE_ID: element.PLACE_ID,
              NATION_ID: element.NATION_ID,
              PROVINCE_ID: element.PROVINCE_ID,
              CITY_ID: element.CITY_ID
            })
          });
          //console.log(LIST_DETAIL);
          this.CreateTour(TOUR_NAME, LOCATION_ID, this.plan.TOTAL_NUMBER_DAY, FORM_TOTAL, TO_TOTAL, LIST_HOBBY, 0, LIST_DETAIL, this.TOUR_TYPE_ID, listCheckTour);
        }
      } else {
        let modal = this.modalCtrl.create(LoginPage);
        modal.present();
      }
    });
    
  }

  updateDayTour(listdetail: any[], willBack) {
    var dateTo = this.addDay(this.datefrom, (this.plan.TOTAL_NUMBER_DAY - 1));
    var listCheckTour = [];
    if(listdetail != undefined && listdetail != null && listdetail.length > 0) {
      listdetail.forEach(element => {
        listCheckTour.push({
          PLACE_ID: element.PLACE_ID,
          NATION_ID: element.NATION_ID,
          PROVINCE_ID: element.PROVINCE_ID,
          CITY_ID: element.CITY_ID
        })
      });
    }
    // console.log(listdetail);
    
    this.PlanService.PlanDetailEdit(this.plan.TOUR_ID, this.plan.TOUR_NAME, this.plan.TOTAL_NUMBER_DAY, this.plan.F_TOTAL, this.plan.T_TOTAL, this.plan.LIST_HOBBY, null, this.plan.IS_SHARE.toString(), this.planhistory, this.convertDateString(new Date(this.datefrom), "/"), this.convertDateString(dateTo, "/"), listdetail, this.TOUR_TYPE_ID, listCheckTour).subscribe(
      data => {
          if (data.Code === 200) {
            // this.getDayTour(this.TOUR_ID,this.daytitle);
              // console.log(data);
              let alert = this.alertCtrl.create({
                title: this.translateService.translate("info.title"),
                subTitle: this.translateService.translate("info.saved"),
                buttons: [
                  {
                      text: 'OK',
                      handler: data => {
                          if(willBack) {
                            this.didModify = true;
                            this.navCtrl.pop();
                          }
                      }
                  }
                ],
              });
              alert.present();
          } else {
              this.showError(data.Message, false);
          }
      },
      error => {
          this.showError(error, false);
      });
  }

  gotoPlanDayDetail(item: PlanDetail) {
    // var LIST_DETAIL_BLOCK = [];
    // item.L_DAY_DETAIL.forEach(element => {
    //   var LIST_DETAIL = {
    //     "ID": element.ID,
    //     "TOUR_ID": element.TOUR_ID,
    //     "SORT": element.SORT,
    //     "DAY": element.DAY,
    //     "OBJECT_ID": element.OBJECT_ID,
    //     "OBJECT_TYPE_ID": element.OBJECT_TYPE_ID,
    //     "STATUS": element.STATUS,
    //     "VOIDED":element.VOIDED,
    //     "TIME": element.TIME,
    //     "DESCRIPTION": element.DESCRIPTION
    //   };
    //   LIST_DETAIL_BLOCK.push(LIST_DETAIL);
    // });

    // console.log(LIST_DETAIL_BLOCK);
    if(item.LIST_DAY_DETAILS == null) {
        item.LIST_DAY_DETAILS = [];
    }
    this.navCtrl.push(PlanDateDetailPage, { TOUR_ID: this.plan.TOUR_ID, data: { dayname: item.DAY, locations: item.LIST_DAY_DETAILS }, isNew: this.isNew, canEdit: this.canEdit, plan: this.plan, listDelete: this.listDelete, datefrom: this.datefrom });
  }

  // getPlanTitle(item) {
  //   var date = new Date(parseInt(item.date.split('-')[2]), parseInt(item.date.split('-')[1]), parseInt(item.date.split('-')[0]));

  //   var arrayDate = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

  //   return "Ngày " + (this.getIndexDay(item) + 1) + ", " +arrayDate[date.getDay()] + ", " + date.getUTCDate() + "-" + date.getUTCMonth() + "-" + date.getUTCFullYear() ;
  // }

  // getIndexDay(item) {
  //   for (var index = 0; index < parseInt(this.showCount); index++) {
  //     if(item == this.days[index]) {
  //       return index;
  //     }
  //   }
  // }


  // ionViewWillLeave() {
    // var newidlist = this.getlistId(this.plan);

    // var didChange = false;

    // if(this.listOriginalID.length != newidlist.length) {
    //   didChange = true;
    // } else {
    //   for (var index = 0; index < this.listOriginalID.length; index++) {
    //     var element = this.listOriginalID[index];
    //     var elementNew = newidlist[index];
    //     if(element != elementNew) {
    //       didChange = true;
    //     }
    //   }
    // }

    // if(didChange == true) {
    //   let alert = this.alertCtrl.create({
    //       title: "Cảnh báo",
    //       subTitle: "Đã có sự thay đổi trong lịch trình, bạn có muốn lưu lại sự thay đổi này?",
    //       buttons: [
    //         {
    //             text: 'OK',
    //             handler: data => {
                    
    //             }
    //         },
    //         {
    //             text: 'Cancel',
    //             handler: data => {
                    
    //             }
    //         }
    //       ],

    //   });
    //   alert.present();
    // }
  // }

  getPlanTotalLocation(item) {
    if(item.LIST_DAY_DETAILS != null) {
      return item.LIST_DAY_DETAILS.length;
    }
    return 0;
  }
  addDayToPlan() {
    if(this.plan.TOTAL_NUMBER_DAY > 6) {
      this.showError(this.translateService.translate("error.invalidmax7"), false);
    } else {
      this.plan.TOTAL_NUMBER_DAY = this.plan.TOTAL_NUMBER_DAY + 1;
      this.fillUpDate();
      // console.log(this.plan);
    }
    // console.log(this.originDayPlan);
  }

  deleteDayFromPlan(item) {
    event.stopPropagation();
    if(this.plan.TOTAL_NUMBER_DAY < 2) {
      this.showError(this.translateService.translate("error.invalidmin1"), false);
    } else {
      var alert = this.alertCtrl.create({
        title: this.translateService.translate("warning.title"),
        subTitle: this.translateService.translate("warning.deleteplan"),
        buttons: [
          {
            text: "OK",
            handler: () => {
              if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
                this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach((element, index) => {
                  if(element.DAY == item.DAY) {
                    if(element.LIST_DAY_DETAILS != null) {
                      element.LIST_DAY_DETAILS.forEach(element3 => {
                        if(element3.TOUR_ID != 0) {
                          this.listDelete.push(element3);
                        }
                      });
                    }
                    for (var i = index + 1; i < this.plan.LIST_PLACE_OF_TOUR_IN_DAY.length; i++) {
                      var element1 = this.plan.LIST_PLACE_OF_TOUR_IN_DAY[i];
                      if(element1.LIST_DAY_DETAILS != null) {
                        if(element1.LIST_DAY_DETAILS.length > 0) {
                          element1.LIST_DAY_DETAILS.forEach(element2 => {
                            element2.LOCATION_DAY = element1.DAY - 1;
                          });
                        }
                      }
                      element1.DAY = element1.DAY - 1;
                    }
                    this.plan.LIST_PLACE_OF_TOUR_IN_DAY.splice(index, 1);
                  }
                });
              }
              this.plan.TOTAL_NUMBER_DAY = this.plan.TOTAL_NUMBER_DAY - 1;
              this.fillUpDate();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      alert.present();
      // if(this.plan.L_LIST_DETAIL != null) {
      //   this.plan.L_LIST_DETAIL.forEach((element, index) => {
      //     if(element.DAY == item.DAY) {
      //       if(element.L_DAY_DETAIL != null) {
      //         element.L_DAY_DETAIL.forEach(element3 => {
      //           if(element3.ID != 0) {
      //             this.listDelete.push(element3);
      //           }
      //         });
      //       }
      //       for (var i = index + 1; i < this.plan.L_LIST_DETAIL.length; i++) {
      //         var element1 = this.plan.L_LIST_DETAIL[i];
      //         if(element1.L_DAY_DETAIL != null) {
      //           if(element1.L_DAY_DETAIL.length > 0) {
      //             element1.L_DAY_DETAIL.forEach(element2 => {
      //               element2.DAY = element1.DAY - 1;
      //             });
      //           }
      //         }
      //         element1.DAY = element1.DAY - 1;
      //       }
      //       this.plan.L_LIST_DETAIL.splice(index, 1);
      //     }
      //   });
      // }
      // this.plan.NUM_OF_DAY = this.plan.NUM_OF_DAY - 1;
      // this.fillUpDate();
    }
    return false;
    // console.log(this.plan.L_LIST_DETAIL);
    // console.log(this.originDayPlan);
  }

  convertToRequest(list: PlanDetail[]): any[] {
    var LIST_DETAIL_BLOCK = [];
    if(list != null)
    list.forEach(element1 => {
      if(element1.LIST_DAY_DETAILS != null) {
        element1.LIST_DAY_DETAILS.forEach((element, index) => {
          var LIST_DETAIL;
          element.LOCATION_START_TIME = element.LOCATION_START_TIME.split('T')[1].split(':')[0] + ":" + element.LOCATION_START_TIME.split('T')[1].split(':')[1];
          if(element.TOUR_ID == 0) {
            LIST_DETAIL = {
              "SORT_DAY": (index + 1),
              "DAY": element.LOCATION_DAY,
              "PLACE_ID": element.LOCATION_ID,
              "PLACE_CODE": element.LOCATION_TYPE,
              "STATUS": element.STATUS,
              "START_TIME": element.LOCATION_START_TIME,
              "NATION_ID": element.NATION_ID,
              "CITY_ID": element.CITY_ID,
              "PROVINCE_ID": element.PROVINCE_ID
            };
          } else {
            LIST_DETAIL = {
              "TOUR_ID": element.TOUR_ID,
              "SORT_DAY": (index + 1),
              "DAY": element.LOCATION_DAY,
              "PLACE_ID": element.LOCATION_ID,
              "PLACE_CODE": element.LOCATION_TYPE,
              "STATUS": element.STATUS,
              "START_TIME": element.LOCATION_START_TIME,
              "NATION_ID": element.NATION_ID,
              "CITY_ID": element.CITY_ID,
              "PROVINCE_ID": element.PROVINCE_ID
            };
          }
          LIST_DETAIL_BLOCK.push(LIST_DETAIL);
        });
      }
      
    });

    // console.log(LIST_DETAIL_BLOCK);

    return LIST_DETAIL_BLOCK;
  }
  
  update(willBack = true) {
    if(this.listDelete != null) {
      if(this.listDelete.length > 0) {
        this.listDelete.forEach(element => {
          if(element.ID != 0) {
            this.removeLocation(element);
          }
        });
      }
    }
    var list = this.convertToRequest(this.plan.LIST_PLACE_OF_TOUR_IN_DAY);
    this.updateDayTour(list, willBack);
    // this.listOriginalID = [];

    // if(this.plan != null) {
    //   if(this.plan.L_LIST_DETAIL != null) {
    //     this.plan.L_LIST_DETAIL.forEach(element => {
    //       if(element.L_DAY_DETAIL != null) {
    //         element.L_DAY_DETAIL.forEach(element1 => {
    //           this.listOriginalID.push(element1.OBJECT_ID);
    //         });
    //       }
    //     });
    //   }
    // }
  }

  removeLocation(item) {
    // console.log(item);
    // this.PlanService.DeleteDayDetail(this.plan.TOUR_ID, item.ID).subscribe(
    //   data => {
    //       if (data.Code === 200) {
    //           // this.getDayTour(this.TOUR_ID,this.daytitle);
              
    //       } else {
    //           this.showError(data.Message, false)
    //       }
    //   },
    //   error => {
    //       this.showError(this.translateService.translate("network.error"), false);
    //   });
  }

  shareTour() {
    this.showLoading();
    // console.log(this.plan.TOUR_ID);
    if(this.plan.IS_SHARE == 0) {
      this.PlanService.ShareTour(this.plan.TOUR_ID, 1).subscribe(data => {
        if(data.Code === 200) {
          this.plan.IS_SHARE = 1;
          setTimeout(() => {
            this.loading.dismiss();
          });
        } else {
          this.showError(data.Message);
        }
      }, error => {
        this.showError(this.translateService.translate("network.error"));
      });
    } else {
      this.PlanService.ShareTour(this.plan.TOUR_ID, 0).subscribe(data => {
        if(data.Code === 200) {
          setTimeout(() => {
            this.plan.IS_SHARE = 0;
            this.loading.dismiss();
          });
        } else {
          this.showError(data.Message);
        }
      }, error => {
        this.showError(this.translateService.translate("network.error"));
      });;
    }
  }

  ionViewWillUnload() {
    var didChange = false;

    var newidlist = [];
    //console.log(this.plan.LIST_PLACE_OF_TOUR_IN_DAY);
    if(this.plan.LIST_PLACE_OF_TOUR_IN_DAY != null) {
      this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
        if(element.LIST_DAY_DETAILS != null) {
          element.LIST_DAY_DETAILS.forEach(element1 => {
            newidlist.push({
              ID: element1.LOCATION_ID,
              TYPE: element1.LOCATION_TYPE,
              TIME: element1.LOCATION_START_TIME
            });
          });
        }
      });
    }
    //console.log(newidlist);
    if(this.listOriginalID.length != newidlist.length) {
      didChange = true;
    } else {
      for (var index = 0; index < this.listOriginalID.length; index++) {
        var element = this.listOriginalID[index];
        var elementNew = newidlist[index];
        if(element.ID != elementNew.ID && element.TYPE != elementNew.TYPE && element.TIME != elementNew.TIME) {
          didChange = true;
        }
      }
    }

    if(!this.isNew) {
      if(didChange == true && this.didModify == false) {
      
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("warning.title"),
            subTitle: this.translateService.translate("warning.savechange"),
            buttons: [
              {
                  text: 'OK',
                  handler: data => {
                      // this.change(this.convertToRequest(this.list));
                    this.update(false);
                  }
              },
              {
                  text: 'Cancel',
                  role: 'Cancel'
              }
            ],

        });
        alert.present();
      } 
    } else {
        
      if(!this.didSaved && !this.switchPage) {
        this.checkToken().then(data => {
          if(!data) {
                let toast = this.toastCtrl.create({
                  message: this.translateService.translate("warning.suggestlogin"),
                  duration: 2000,
                  position: 'middle'
                });

                // toast.onDidDismiss(() => {
                //   console.log('Dismissed toast');
                // });

                toast.present();
          } else {
              let alert = this.alertCtrl.create({
                  title: this.translateService.translate("warning.title"),
                  subTitle: this.translateService.translate('info.successfulcreatesuggest'),
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
          }
        });
      }
    }
  } 

  changeToEditTour() {

  }

  changeToListTour() {
    this.switchPage = true;
    this.navCtrl.pop();
    this.navCtrl.push(ListPlanPage, {listPlan: this.listPlan, datefrom: this.datefrom, dateto: this.dateto, isSuggest: true, plan: this.plan});
  }

  changeName() {
    let prompt = this.alertCtrl.create({
      title: this.translateService.translate("warning.changeplanname"),
      message: this.translateService.translate('warning.inputname'),
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.plan.TOUR_NAME = data.title;
          }
        }
      ]
    });
    prompt.present();
  }
}
