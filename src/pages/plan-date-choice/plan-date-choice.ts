import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, PlanService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { PlanDetail } from "../../model/PlanDetail";
import { Plan } from "../../model/Plan";
import { PlanDayDetail } from "../../model/PlanDayDetail";

import moment from 'moment';

/*
  Generated class for the PlanDateChoice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-date-choice',
  templateUrl: 'plan-date-choice.html'
})
export class PlanDateChoicePage extends PageBase {
  plan: any;
  currentUser: any;
  listDay: any[];
  location: any;
  datefrom: any;
  dateto: any;
  itemAdd: any;
  caseTime: any;
  day: any;
  generalList: any;
  planhistory: any;
  TOUR_TYPE_ID: any;

  addDate: any;
  addDateString: any;

  hasError = false;

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
    public toastCtrl: ToastController
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
      this.plan = this.navParams.get("item");
      this.datefrom = this.navParams.get("datefrom");
      this.dateto = this.navParams.get("dateto");
      this.location = this.navParams.get("location");
      //console.log(this.plan);
      
      this.planhistory = this.plan.ID;
      this.TOUR_TYPE_ID = this.plan.TOUR_TYPE_ID;
      this.fillUpDate();
      this.itemAdd = null;
      this.day = null;
      this.generalList = [];
  }

  init() {
    
  }

  getPlanTitle(item) {
    var day = item.DAY;
  }

  fillUpDate() {
    var listDay = [];
    // console.log(this.plan.L_LIST_DETAIL);
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
        
        this.plan.LIST_PLACE_OF_TOUR_IN_DAY = listDay;
      }
    }
    // console.log(listDay);
    // console.log(this.plan.L_LIST_DETAIL);
    
  }

  getIndexDay(item) {
    for (var index = 0; index < this.listDay.length; index++) {
      if(item == this.listDay[index]) {
        return index;
      }
    }
  }

  submit(item) {
    this.addToPlanList(item);
    //.log(item);
    // console.log(this.addDateString);
    //console.log(this.generalList);
    //console.log(this.plan.LIST_PLACE_OF_TOUR_IN_DAY);
    if(this.generalList != null && this.generalList != undefined && this.day != null && this.day != undefined && this.itemAdd != null && this.itemAdd != undefined && !this.hasError) {
        this.update();
    }
  }

  getPlanTotalLocation(item) {
    if(item.LIST_DAY_DETAILS != null) {
      return item.LIST_DAY_DETAILS.length;
    }
    return 0;
  }

  reorderByTime(list, new_item) {
      let reorder = true;
      for(let i = 0; i < list.length - 1; i++) {
          for (var j = 0; j < list.length-i-1; j++) {
              var current_cmp_one = this.addDateString + "T" + (list[j].LOCATION_START_TIME.indexOf("T") >= 0 ? list[j].LOCATION_START_TIME.split("T")[1] : list[j].LOCATION_START_TIME);
              var current_cmp_two = this.addDateString + "T" + (list[j+1].LOCATION_START_TIME.indexOf("T") >= 0 ? list[j+1].LOCATION_START_TIME.split("T")[1] : list[j+1].LOCATION_START_TIME);
              if(!this.compareTime(current_cmp_one, current_cmp_two)) {
                  let temp = list[j];
                  list[j] = list[j+1];
                  list[j+1] = temp;
              }
          }
      }
      list.forEach((element, index) => {
          element.SORT_DAY = index + 1;
      });
      
      return list;
  }

  popupDateOn(item) {
    this.addDate = this.addDay(this.datefrom, item.DAY - 1);
    this.addDateString = this.convertDateString(this.addDate, "-", 2);
    // console.log(item);
    var detail = {
        "LOCATION_ADDRESS": this.location.address,
        "SORT_DAY": 1,
        "DAY": item.DAY,
        "LOCATION_ID": this.location.id,
        "LOCATION_TYPE": this.location.type,
        "STATUS": 1,
        "LOCATION_START_TIME": "08:00",
        "LOCATION_DESCRIPTION": "",
        "LOCATION_AVG_PRICE": this.location.price,
        "LOCATION_GOOGLE": this.location.locations,
        "LOCATION_OPEN_TIME": this.location.open_time,
        "LOCATION_CLOSE_TIME": this.location.close_time,
        "TOUR_DETAIL_ID": -1,
        "TOUR_ID": item.TOUR_ID,
        "LOCATION_AVATAR": this.location.imgURL,
        "LOCATION_NAME": this.location.name,
    };
    this.day = item.DAY;
    this.generalList = item.LIST_DAY_DETAILS;
    //console.log(this.generalList);
    // var isExisted = false;
    // this.plan.L_LIST_DETAIL.forEach(element => {
    //   if(element.TOUR_ID == item.TOUR_ID && element.DAY == item.DAY) {
    //     element.L_DAY_DETAIL.forEach(element1 => {
    //       if(element1.OBJECT_ID == this.location.id) {
    //         isExisted = true;
    //       }
    //     });
    //   }
    // });

    // if(!isExisted) {
    //   this.itemAdd = item;
    //   document.getElementById("alert-popup").style.display = "block";
    //   document.getElementById("popupDateTime").style.display = "block";
    //   var detail = { 
    //     "SORT": 1,
    //     "DAY": item.DAY,
    //     "OBJECT_ID": this.location.id,
    //     "OBJECT_TYPE_ID": this.location.type,
    //     "STATUS": 1,
    //     "VOIDED": 1,
    //     "TIME": 1,
    //     "DESCRIPTION": item.DESCRIPTION
    //   };
    // } else {
    //     this.showError("Địa điểm đã có sẵn trong lịch trình");
    // }
    
    var isExisted = false;
    //console.log(this.plan.LIST_PLACE_OF_TOUR_IN_DAY);
    this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
      if(element.TOUR_ID == item.TOUR_ID && element.DAY == item.DAY) {
        element.LIST_DAY_DETAILS.forEach(element1 => {
          if(element1.LOCATION_ID == this.location.id && element1.LOCATION_TYPE == this.location.type) {
            isExisted = true;
          }
        });
      }
    });

    if(!isExisted) {
        document.getElementById("alert-popup").style.display = "block";
        // document.getElementById("popupDateTime").style.display = "block";
        document.getElementById("popupDateTime").style.display = "block";
        this.itemAdd = detail;
        
        // console.log(this.itemAdd);
        // this.itemAdd.TIME = "08:00";
    } else {
        this.showError(this.translateService.translate("pdc.errorexist"));
    }
  }

  closePopup() {
      document.getElementById("alert-popup").style.display = "none";
      // document.getElementById("popupDateTime").style.display = "none";
      document.getElementById("popupDateTime").style.display = "none";
      this.day = null;
      this.itemAdd = null;
  }
  checkProperTime(list) {
    var addTime = 45;
    //console.log(list);
    list.forEach((element, index) => {
        if(element.TOUR_DETAIL_ID == -1) {
            var prev = null;
            var next = null;
            
            if(index > 0) {
                prev = list[index - 1];
            }
            if(index < list.length) {
                next = list[index + 1];
            }
            //console.log(prev);
            //console.log(next);
            //console.log(element);
            if(prev != null) {
                if(this.getMinusTime(this.changeDateString(element.LOCATION_START_TIME), prev.LOCATION_START_TIME) < addTime) {
                    this.caseTime = 2;
                } else {
                    this.caseTime = 0;
                }
            } else {
                if(next != null) {
                    if(this.getMinusTime(next.LOCATION_START_TIME, this.changeDateString(element.LOCATION_START_TIME)) < addTime) {
                        this.caseTime = 1;
                    } else {
                        this.caseTime = 0;
                    }
                } else {
                    this.caseTime = 0;
                }
            }
            
            if(this.caseTime == 0) {
                if(next != null) {
                    if(this.getMinusTime(next.LOCATION_START_TIME, this.changeDateString(element.LOCATION_START_TIME)) < addTime) {
                        this.caseTime = 1;
                    } else {
                        this.caseTime = 0;
                    }
                } else {
                    if(prev != null) {
                        if(this.getMinusTime(this.changeDateString(element.LOCATION_START_TIME), prev.LOCATION_START_TIME) < addTime) {
                            this.caseTime = 2;
                        } else {
                            this.caseTime = 0;
                        }
                    } else {
                        this.caseTime = 0;
                    }
                }
            }
        }
    });

    return this.caseTime;
  }
  addToPlanList(item) {
      if(item != null) {
          this.showLoading();
          // this.listAdd.push(item);

          let availableTime = true;

          let addTime = 45;

          if(item.LOCATION_CLOSE_TIME == null) {
            item.LOCATION_CLOSE_TIME = "2016-01-01T23:59";
          }
        //   console.log(this.changeDateString((item.LOCATION_OPEN_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_OPEN_TIME.split('T')[1].split(':')[1]))));
        //   console.log(this.changeDateString(item.LOCATION_START_TIME));
        //   console.log(this.changeDateString((item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[1]))));
          if(!this.compareTime(this.changeDateString((item.LOCATION_OPEN_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_OPEN_TIME.split('T')[1].split(':')[1]))), this.changeDateString(item.LOCATION_START_TIME))) {
              setTimeout(() => {
                  if(this.loading != undefined && this.loading._state != 4) {
                      this.loading.dismiss();
                  }
              });
              this.closePopup();
              availableTime = false;
              let toast = this.toastCtrl.create({
                  message: this.translateService.translate("error.invalidoperation"),
                  duration: 3000,
                  position: 'middle'
              });

              toast.present();
          } else {
              
          }
          
          if(!this.compareTime(this.changeDateString(item.LOCATION_START_TIME), this.changeDateString((item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[1]))))) {
              setTimeout(() => {
                  if(this.loading != undefined && this.loading._state != 4) {
                      this.loading.dismiss();
                  }
              });
              this.closePopup();
              availableTime = false;
              
              let toast = this.toastCtrl.create({
                  message: this.translateService.translate("error.invalidclosetime"),
                  duration: 3000,
                  position: 'middle'
              });

              toast.present();
          } else {
              
          }
          if(availableTime) {
              var listReturn = [];
              this.generalList.forEach((element, index) => {
                  listReturn.push({
                    CITY_ID:element.CITY_ID,
                    IS_SHARE:element.IS_SHARE,
                    LIST_HOBBY_ID:element.LIST_HOBBY_ID,
                    LOCATION_ADDRESS:element.LOCATION_ADDRESS,
                    LOCATION_AVATAR:element.LOCATION_AVATAR,
                    LOCATION_AVG_PRICE:element.LOCATION_AVG_PRICE,
                    LOCATION_CLOSE_TIME:element.LOCATION_CLOSE_TIME,
                    LOCATION_DAY:element.LOCATION_DAY,
                    LOCATION_DESCRIPTION:element.LOCATION_DESCRIPTION,
                    LOCATION_GOOGLE:element.LOCATION_GOOGLE,
                    LOCATION_ID:element.LOCATION_ID,
                    LOCATION_NAME:element.LOCATION_NAME,
                    LOCATION_OPEN_TIME:element.LOCATION_OPEN_TIME,
                    LOCATION_START_TIME:element.LOCATION_START_TIME,
                    LOCATION_TYPE:element.LOCATION_TYPE,
                    NATION_ID:element.NATION_ID,
                    PROVINCE_ID:element.PROVINCE_ID,
                    SORT_DAY:element.SORT_DAY,
                    TOUR_DETAIL_ID:element.TOUR_DETAIL_ID,
                    TOUR_ID:element.TOUR_ID,
                  });
              });
              //console.log(listReturn);
              var new_item = {
                  LOCATION_AVG_PRICE: "",
                  LOCATION_DAY: this.day,
                  LOCATION_DESCRIPTION: "",
                  LOCATION_GOOGLE: "",
                  TOUR_DETAIL_ID: -1,
                  LOCATION_AVATAR: this.location.imgURL,
                  LOCATION_ADDRESS: "",
                  LOCATION_NAME: this.location.name,
                  LOCATION_ID: this.location.id,
                  LOCATION_TYPE: this.location.type,
                  SORT_DAY: 1,
                  LOCATION_START_TIME: item.LOCATION_START_TIME.split("Z")[0],
                  TOUR_ID: item.TOUR_ID,
                  LOCATION_OPEN_TIME: this.location.open_time,
                  LOCATION_CLOSE_TIME: this.location.close_time,
                  NATION_ID: this.location.NATION_ID,
                  CITY_ID: this.location.CITY_ID,
                  PROVINCE_ID: this.location.PROVINCE_ID
              };
              this.generalList.push(new_item);
              this.generalList = this.reorderByTime(this.generalList, new_item);
              //console.log(this.generalList);
              var c = this.checkProperTime(this.generalList);
              
              switch (c) {
                  case 0:
                      this.generalList.forEach((element, index) => {
                          if(element.TOUR_DETAIL_ID == -1) {
                              element.TOUR_DETAIL_ID = 0;
                          }
                      });
                      // console.log(this.generalList);
                      this.navCtrl.pop();
                      setTimeout(() => {
                          if(this.loading != undefined && this.loading._state != 4) {
                              this.loading.dismiss();
                          }
                      });
                      this.hasError = false;
                      break;
                  case 1:
                      setTimeout(() => {
                          if(this.loading != undefined && this.loading._state != 4) {
                              this.loading.dismiss();
                          }
                      });
                      
                      var stop = false;
                      
                      this.generalList.forEach((element, index) => {
                          if(element.TOUR_DETAIL_ID == -1) {
                              element.TOUR_DETAIL_ID = 0;
                              for (var i = index + 1; (i < this.generalList.length) && !stop; i++) {
                                  if(this.generalList[i].LOCATION_CLOSE_TIME == null) {
                                    this.generalList[i].LOCATION_CLOSE_TIME = "2016-01-01T23:59";
                                  }
                                  //console.log(this.getMinusTime(this.generalList[i].LOCATION_START_TIME, this.changeDateString(this.generalList[i-1].LOCATION_START_TIME)));
                                  if(this.getMinusTime(this.generalList[i].LOCATION_START_TIME, this.changeDateString(this.generalList[i-1].LOCATION_START_TIME)) < addTime && !stop) {
                                      var hour2digit = moment(this.changeDateString((this.generalList[i - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getHours() < 10 ? "0" + moment(this.changeDateString((this.generalList[i - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getHours() : moment(this.changeDateString((this.generalList[i - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getHours();
                                      var minute2digit = moment(this.changeDateString((this.generalList[i - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getMinutes() < 10 ? "0" + moment(this.changeDateString((this.generalList[i - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getMinutes() : moment(this.changeDateString((this.generalList[i - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getMinutes();
                                      properTime = hour2digit + ":" + minute2digit;
                                      //console.log(this.changeDateString(properTime));
                                      //console.log(this.changeDateString(this.generalList[i].LOCATION_CLOSE_TIME.split("T")[1].split(":")[0]+":"+this.generalList[i].LOCATION_CLOSE_TIME.split("T")[1].split(":")[1]));
                                      if(!this.compareTime(this.changeDateString(properTime), this.changeDateString(this.generalList[i].LOCATION_CLOSE_TIME.split("T")[1].split(":")[0]+":"+this.generalList[i].LOCATION_CLOSE_TIME.split("T")[1].split(":")[1]))) {
                                          stop = true;
                                          //this.generalList[i].TOUR_DETAIL_ID = -1;
                                          var l = this.generalList.length;
                                          while (l > 0) {
                                              this.generalList.pop();
                                              l--;
                                          }
                                          listReturn.forEach(elementR => {
                                            this.generalList.push(elementR);
                                          });
                                      } else {
                                          this.generalList[i].LOCATION_START_TIME = this.changeDateString(properTime);
                                      }
                                  }
                              }
                          }
                      });

                      if(stop) {
                          let toast = this.toastCtrl.create({
                              message: this.translateService.translate("error.invalidtime"),
                              duration: 3000,
                              position: 'middle'
                          });
                          toast.present();
                        //   var alreadyRemove = false;
                        //   this.generalList.forEach((element, index) => {
                        //       if(element.TOUR_DETAIL_ID == -1 && !alreadyRemove) {
                        //           this.generalList.splice(index, 1);
                        //           alreadyRemove = true;
                        //       }
                        //   });
                          this.hasError = true;
                          this.closePopup();
                      } else {
                        let toast1 = this.toastCtrl.create({
                            message: this.translateService.translate("warning.changetime"),
                            duration: 3000,
                            position: 'middle',
                        });

                        toast1.onDidDismiss(() => {
                            //console.log('Dismissed toast');
                        });
                        this.hasError = false;
                        toast1.present();
                        //console.log(this.generalList);
                        this.navCtrl.pop();
                      }
                      
                      break;
                  case 2:
                    
                      var properTime;
                      setTimeout(() => {
                          if(this.loading != undefined && this.loading._state != 4) {
                              this.loading.dismiss();
                          }
                      });
                      this.generalList.forEach((element, index) => {
                          if(element.TOUR_DETAIL_ID == -1) {
                              // properTime = dateTimeAdded.split(':')[0] + ":" + dateTimeAdded.split(':')[1];
                              var hour2digit = moment(this.changeDateString((this.generalList[index - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getHours() < 10 ? "0" + moment(this.changeDateString((this.generalList[index - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getHours() : moment(this.changeDateString((this.generalList[index - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getHours();
                              var minute2digit = moment(this.changeDateString((this.generalList[index - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getMinutes() < 10 ? "0" + moment(this.changeDateString((this.generalList[index - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getMinutes() : moment(this.changeDateString((this.generalList[index - 1]).LOCATION_START_TIME)).add(45, 'm').toDate().getMinutes();
                              properTime = hour2digit + ":" + minute2digit;
                              // console.log(properTime);
                          }
                      });
                      this.closePopup();
                      // console.log(properTime);
                      let toast = this.toastCtrl.create({
                          message: this.translateService.translate("error.suggesttime") + properTime,
                          duration: 3000,
                          position: 'middle'
                      });

                      toast.present();
                      var alreadyRemove = false;
                      this.generalList.forEach((element, index) => {
                          if(element.TOUR_DETAIL_ID == -1 && !alreadyRemove) {
                              this.generalList.splice(index, 1);
                              alreadyRemove = true;
                          }
                      });
                      this.hasError = true;
                      break;
                  default:
                      break;
              }
              
          }
      }
  }
  changeDateString(time) {
      if(time.indexOf("T") >= 0) {
        return time;
      }
      return this.addDateString+"T"+ time + ":00";
  }

  convertToRequest(list: PlanDetail[]): any[] {
    var LIST_DETAIL_BLOCK = [];
    //console.log(list);
    if(list != null)
    list.forEach(element1 => {
      if(element1.LIST_DAY_DETAILS != null) {
        element1.LIST_DAY_DETAILS.forEach((element, index) => {
          var LIST_DETAIL;
          if(element.LOCATION_START_TIME.indexOf("T") >= 0) {
            element.LOCATION_START_TIME = element.LOCATION_START_TIME.split('T')[1].split(':')[0] + ":" + element.LOCATION_START_TIME.split('T')[1].split(':')[1];
          }
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
  update() {
      var hasnotChange = true;
      this.plan.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
          if(element.DAY == this.itemAdd.DAY && hasnotChange) {
            var list = this.convertToRequest(this.plan.LIST_PLACE_OF_TOUR_IN_DAY);
            //console.log(list);
            this.updateDayTour(list);
            hasnotChange = false;
          }
      });
      
      // console.log(this.plan.LIST_PLACE_OF_TOUR_IN_DAY);
    //   this.updateDayTour(list);
  }
  updateDayTour(listdetail: any[]) {
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
      this.PlanService.PlanDetailEdit(this.plan.TOUR_ID, this.plan.TOUR_NAME, this.plan.TOTAL_NUMBER_DAY, this.plan.F_TOTAL, this.plan.T_TOTAL, this.plan.LIST_HOBBY_ID, null, this.plan.IS_SHARE.toString(), this.planhistory, this.convertDateString(new Date(this.datefrom), "/"), this.convertDateString(dateTo, "/"), listdetail, this.TOUR_TYPE_ID, listCheckTour).subscribe(
      data => {
          if (data.Code === 200) {
              // this.getDayTour(this.TOUR_ID,this.daytitle);
              // console.log(data);
              this.navCtrl.pop();
              let alert = this.alertCtrl.create({
                  title: this.translateService.translate("info.title"),
                  subTitle: this.translateService.translate("info.saved"),
                  buttons: [
                  {
                      text: 'OK',
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
}
