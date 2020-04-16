import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, PlanService, UltilitiesService, ShoppingService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { SightSeeingPage } from "../sight-seeing/sight-seeing";
import { PlanDirectionPage } from '../plan-direction/plan-direction';
import { PlanAddLocationPage } from '../plan-add-location/plan-add-location';
import { SearchLocationPage } from "../search-location/search-location";

import { MapRoutePage } from "../map-route/map-route";

import { Plan } from "../../model/Plan";
import { PlanDayDetail } from "../../model/PlanDayDetail";
import { PlanDetail } from "../../model/PlanDetail";

import _ from 'lodash';
import moment from 'moment';
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { EntertainmentDetailPage } from '../entertainment-detail/entertainment-detail';
/*
  Generated class for the PlanDateDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-date-detail',
  templateUrl: 'plan-date-detail.html'
})
export class PlanDateDetailPage extends PageBase {
  
  plan: Plan;
  currentUser: any;
  daytitle: any;
  listLocation: PlanDayDetail[];

  list: any[];

  currentClickEvent: any;

  // listAdd: any[];
  listDelete: any[];
  // listUpdate: any[];

  listOriginId: any[];
  canEdit: boolean;

  TOUR_ID: any;
  originallist: any[];

  isNew: any;

  listSwap: any[];
  disabledButton: boolean;

  datefrom: any;
  addDate: any;
  addDateString: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public showUserInfo: ShowUserInfo,
    public eventService: EventService,
    public loadingCtrl: LoadingController,
    private _translate: TranslateService,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public hobbyService: HobbyService,
    public PlanService: PlanService,
    public UltilitiesService: UltilitiesService,
    public shoppingService: ShoppingService
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
      this.currentUser = this.authService.getUserInfo();
      this.listDelete = [];
      var data = this.navParams.get("data");
      this.TOUR_ID = this.navParams.get("TOUR_ID");
      this.canEdit = this.navParams.get("canEdit");
      this.isNew = this.navParams.get("isNew");
      this.plan = this.navParams.get("plan");
      this.datefrom = this.navParams.get("datefrom");
      this.listDelete = this.navParams.get("listDelete");
      this.list = data.locations;
      //console.log(this.list);
      this.originallist = [];
      if(this.list != null && this.list.length > 0) {
        this.list.forEach(element => {
          this.originallist.push(element);
        });
      }
      //console.log(this.originallist);
      this.daytitle = data.dayname;
      this.listLocation = [];
      // this.listAdd = [];
      
      // this.listUpdate = [];
      this.listOriginId = [];
      if(this.list != null && this.list.length > 0) {
        this.list.forEach(element => {
          this.listOriginId.push(element.LOCATION_ID);
        });
      }
      //console.log(this.canEdit);
      // this.listOriginalID = this.getlistId(this.plan);

      this.listSwap = [];
      this.disabledButton = true;

      this.addDate = this.addDay(this.datefrom, this.daytitle - 1);
      this.addDateString = this.convertDateString(this.addDate, "-", 2);
      //console.log(this.addDateString);
  }

  

  init() {
    // this.getDayTour(this.TOUR_ID, this.daytitle);
    //console.log(this.list);
  }

  gotoDetail(obj) {
    //console.log(obj)
    //   if (obj.LOCATION_TYPE == "SHOP") {
    //       this.navCtrl.push(ShopDetailPage, { item: obj.LOCATION_ID, disableAddPlan: true });
    //   } else if (obj.LOCATION_TYPE == "RESTAURANT") {
    //       this.navCtrl.push(RestaurantDetailPage, { item: obj.LOCATION_ID, disableAddPlan: true });
    //   } else if (obj.LOCATION_TYPE == "TPLACE") {
    //       this.navCtrl.push(SightSeeingPage, { item: obj.LOCATION_ID, disableAddPlan: true });
    //   }
    if (obj.LOCATION_TYPE == "RESTAURANT") {
        this.navCtrl.push(RestaurantDetailPage, { item: obj.LOCATION_ID, code:obj.LOCATION_TYPE, obj: obj, disableAddPlan: true });
    } else if (obj.LOCATION_TYPE == "TPLACE") {
        this.navCtrl.push(SightSeeingPage, { item: obj.LOCATION_ID, code: obj.LOCATION_TYPE, obj: obj, disableAddPlan: true });
    } else if (obj.LOCATION_TYPE == "SHOP") {
        this.shoppingService.GetShopDetailH(obj.LOCATION_ID,obj.LOCATION_TYPE).subscribe(data => {
            if(data.Code === 200) {
                let shop = data.Result;
                this.navCtrl.push(ShopDetailPage, {item: shop, disableAddPlan: true});
            }
        });
    } else if (obj.LOCATION_TYPE == "ENTERTAINMENT") {
      this.navCtrl.push(EntertainmentDetailPage, { item: obj.LOCATION_ID, code: obj.LOCATION_TYPE, obj: obj, disableAddPlan: true });
    }
  }

  showPlanDirection() {
    this.navCtrl.push(PlanDirectionPage, {locations: this.list});
  }

  addPlanLocation() {
    this.navCtrl.push(PlanAddLocationPage, {locations: this.listLocation, day: this.daytitle, tourid: this.TOUR_ID, generalList: this.list, datefrom: this.datefrom });
  }

  showWayThere(item) {
    if(item.LOCATION_TYPE == "SHOP") {
      this.navCtrl.push(MapRoutePage, {locations: item.LOCATION_GOOGLE.split(",")[0] + "," + item.LOCATION_GOOGLE.split(",")[1], type: "shop"});
    } else if(item.LOCATION_TYPE == "RESTAURANT") {
      this.navCtrl.push(MapRoutePage, {locations: item.LOCATION_GOOGLE.split(",")[0] + "," + item.LOCATION_GOOGLE.split(",")[1], type: "eat"});
    } else if(item.LOCATION_TYPE == "TPLACE") {
      this.navCtrl.push(MapRoutePage, {locations: item.LOCATION_GOOGLE.split(",")[0] + "," + item.LOCATION_GOOGLE.split(",")[1], type: "see" });
    } else if (item.LOCATION_TYPE == "ENTERTAINMENT") {
      this.navCtrl.push(MapRoutePage, {locations: item.LOCATION_GOOGLE.split(",")[0] + "," + item.LOCATION_GOOGLE.split(",")[1], type: "entertainment" });
    }
    
  }

  typeValue(id) {
    switch(id) {
      case 1: return "stay";
      case 2: return "eat";
      case 3: return "see";
    }
  }

  openSubMenu(event) {
    this.currentClickEvent = event;
    
    event.srcElement.parentNode.parentNode.childNodes[2].nextElementSibling.classList.toggle("hidden");
  }

  removeLocation(item) {
    //console.log(item);
    // this.PlanService.DeleteDayDetail(this.TOUR_ID, item.ID).subscribe(
    //   data => {
    //       if (data.Code === 200) {
    //           // this.getDayTour(this.TOUR_ID,this.daytitle);
              
    //       } else {
    //           this.showError(data.Message, false)
    //       }
    //   },
    //   error => {
    //       this.showError(error, false);
    //   });
  }

  // addLocation(item) {
  //   var listDetail = [];

  //   listDetail.push({
  //     "DAY": this.daytitle,
  //     "DESCRIPTION": "",
  //     "OBJECT_ID": item.Location_Id,
  //     "OBJECT_TYPE_ID": item.Location_Type,
  //     "SORT": 1,
  //     "STATUS": 1,
  //     "TIME":"09:00:00",
  //     "VOIDED":1
  //   });
  //   var existed = false;
  //   if(this.generalList != null) {
  //       this.generalList.forEach(element => {
  //           if(element.OBJECT_ID == item.Location_Id) {
  //               existed = true; 
  //           }
  //       });
  //   }
  //   if(!existed) {
  //       this.PlanService.PlanDetailEdit(this.TOUR_ID, this.daytitle, listDetail).subscribe(
  //           data => {
  //               if (data.Code === 200) {

  //                   // console.log(data);

  //                   var dayadd = data.Result[0].L_LIST_DETAIL;

  //                   if(dayadd != null && dayadd.length > 0)
  //                   dayadd.forEach(element => {
  //                       if(element.DAY == this.daytitle) {
  //                           console.log(element);
  //                           element.L_DAY_DETAIL.forEach(elementDetail => {
  //                               if(elementDetail.OBJECT_ID == item.Location_Id) {
  //                                   console.log(elementDetail);
  //                                   if(this.listLocations == null) {
  //                                       this.listLocations = [];
  //                                   } 
  //                                   if(this.generalList == null) {
  //                                       this.generalList = [];
  //                                   }
                                    
  //                                   this.listLocations.push(elementDetail);
  //                                   this.generalList.push(elementDetail);
  //                                   console.log(this.listLocations);
  //                               }
  //                           });
                            
  //                           // this.listLocations.push({
                                
  //                           // });
                            
  //                       }
  //                   });

  //                   this.navCtrl.pop();
                    
  //                   setTimeout(() => {
  //                       // this.loading.dismiss();
  //                   });
  //               } else {
  //                   this.showError(data.Message, false);
  //               }
  //           },
  //           error => {
  //               this.showError(this.translateService.translate("network.error"), false);
  //           }
  //       );
  //   } else {
  //       this.showError("Địa điểm đã có sẵn trong lịch trình", false);
  //   }
  // }

  removeFromList(item) {
    this.listDelete.push(item);
    //console.log(item);
    this.list.forEach((element, index) => {
      if (element.LOCATION_ID == item.LOCATION_ID && element.LOCATION_TYPE == item.LOCATION_TYPE) {
        this.list.splice(index, 1);
      }
    });
  }

  // updateFromList(item) {
  //   this.listUpdate.push(item);
  // }

  // goBack() {
  //   this.listDelete.forEach(element => {
  //     this.removeLocation(element);
  //   });
  // }

  convertToRequest(list: any[]): any[] {
    var LIST_DETAIL_BLOCK = [];
    if(list != null && list.length > 0)
    list.forEach(element => {
      var LIST_DETAIL;
      
      if(element.ID == 0) {
        LIST_DETAIL = {
          // "TOUR_ID": element.TOUR_ID,
          "SORT_DAY": element.SORT_DAY,
          "DAY": element.DAY,
          "LOCATION_ID": element.LOCATION_ID,
          "LOCATION_TYPE": element.LOCATION_TYPE,
          "STATUS": element.STATUS,
          "LOCATION_START_TIME": element.LOCATION_START_TIME,
          "LOCATION_DESCRIPTION": element.LOCATION_DESCRIPTION
        };
      } else {
        LIST_DETAIL = {
          "TOUR_ID": element.TOUR_ID,
          // "TOUR_ID": element.TOUR_ID,
          "SORT_DAY": element.SORT_DAY,
          "DAY": element.DAY,
          "LOCATION_ID": element.LOCATION_ID,
          "LOCATION_TYPE": element.LOCATION_TYPE,
          "STATUS": element.STATUS,
          "LOCATION_START_TIME": element.LOCATION_START_TIME,
          "LOCATION_DESCRIPTION": element.LOCATION_DESCRIPTION
        };
      }
      
      LIST_DETAIL_BLOCK.push(LIST_DETAIL);
    });

    //console.log(LIST_DETAIL_BLOCK);

    return LIST_DETAIL_BLOCK;
  }

  // convertTimeFull(split) {
  //   var today = new Date();
  //   var day = today.getDate();
  //   var month = today.getMonth() + 1;
  //   var year = today.getFullYear();
  //   return year + split + this.convertNumber(month) + split + this.convertNumber(day) + "T"
  // }

  // convertNumber(number) {
  //   return number > 9 ? number.toString() : "0" + number;
  // }

  // changeLocation(item) {
  //   this.navCtrl.push(SearchLocationPage, { location: item });
  //   this.listLocation.forEach((element, index) => {
  //     if(element.OBJECT_ID == item.OBJECT_ID) {
  //       this.listLocation.splice(index, 1);
  //     }
  //   });
  //   console.log(this.listLocation);
  //   var LIST_DETAIL = this.convertToRequest(this.listLocation);
  //   console.log(LIST_DETAIL);
  //   this.updateDayTour(LIST_DETAIL);
  // }

  getDayTour(tourid, day) {
    this.listLocation = [];
    this.PlanService.GetTourById(tourid).subscribe(
      data => {
            if (data.Code === 200) {
                var result = data.Result[0];
                console.log(result);

                if(result.LIST_PLACE_OF_TOUR_IN_DAY != null) {
                  result.LIST_PLACE_OF_TOUR_IN_DAY.forEach(element => {
                    if(element.DAY == day) {
                      this.listLocation = element.LIST_DAY_DETAILS;
                    }
                  });

                  this.listLocation.forEach(element => {
                    this.listOriginId.push(element.LOCATION_ID);
                  });
                } else {
                  this.listLocation = [];
                }

                //console.log(this.listLocation);
            } else {
                this.showError(data.Message, false)
            }

        },
        error => {
            this.showError(error, false);
        });
  }

  // updateDayTour(listdetail: any[]) {
  //   this.PlanService.PlanDetailEdit(this.TOUR_ID, this.daytitle, listdetail).subscribe(
  //     data => {
  //         if (data.Code === 200) {
  //             // this.getDayTour(this.TOUR_ID,this.daytitle);
  //         } else {
  //             this.showError(data.Message, false);
  //         }
  //     },
  //     error => {
  //         this.showError(error, false);
  //     });
  // }

  // ionViewWillUnload() {
  //   var didChange = false;

  //   var newidlist = [];
  //   if(this.list != null && this.list.length > 0) {
  //     this.list.forEach(element => {
  //       newidlist.push(element.OBJECT_ID);
  //     });
  //   }

  //   if(this.listOriginId.length != newidlist.length) {
  //     didChange = true;
  //   } else {
  //     for (var index = 0; index < this.listOriginId.length; index++) {
  //       var element = this.listOriginId[index];
  //       var elementNew = newidlist[index];
  //       if(element != elementNew) {
  //         didChange = true;
  //       }
  //     }
  //   }

  //   if(!this.isNew) {
  //     if(didChange == true) {
  //       let alert = this.alertCtrl.create({
  //           title: "Cảnh báo",
  //           subTitle: "Đã có sự thay đổi trong lịch trình, bạn có muốn lưu lại sự thay đổi này?",
  //           buttons: [
  //             {
  //                 text: 'OK',
  //                 handler: data => {
  //                     this.change(this.convertToRequest(this.list));
  //                 }
  //             },
  //             {
  //                 text: 'Cancel',
  //                 handler: data => {
  //                   console.log(this.originallist);
  //                   // this.originallist.forEach(element => {
  //                   //   this.list.push(element);
  //                   // });
  //                   if(this.plan.L_LIST_DETAIL != null) {
  //                     this.plan.L_LIST_DETAIL.forEach(element => {
  //                       if(element.DAY == this.daytitle) {
  //                         element.L_DAY_DETAIL = [];
  //                       }
  //                       if(element.L_DAY_DETAIL != null) {
  //                         this.originallist.forEach(elementDAY => {
  //                           element.L_DAY_DETAIL.push(elementDAY);
  //                         });
  //                       }
  //                     });
  //                   }
  //                   console.log(this.plan);
  //                 }
  //             }
  //           ],

  //       });
  //       alert.present();
  //     }
  //   } else {

  //   }
    
  // } 

  // change(list) {
  //   console.log(this.listOriginId);
  //   console.log(this.listDelete);
  //   console.log(list);
  //   this.listDelete.forEach(element => {
  //     if(element.ID != null && element.ID != 0) {
  //       console.log("true");
  //       this.removeLocation(element);
  //     }
  //   });

  //   this.updateDayTour(list);

  // }

  reorderList(list) {
    list.forEach(element => {
      if(element.LOCATION_START_TIME.indexOf('Z') >= 0) {
        element.LOCATION_START_TIME = element.LOCATION_START_TIME.split('Z')[0];
      }
    });
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

  chosenThisBox(item) {
    this.listSwap.push(item);

    if(this.listSwap.length == 2) {
      var swapTime = this.listSwap[0].LOCATION_START_TIME;
      this.listSwap[0].LOCATION_START_TIME = this.listSwap[1].LOCATION_START_TIME;
      this.listSwap[1].LOCATION_START_TIME = swapTime;

      var swapSort = this.listSwap[0].SORT_DAY;
      this.listSwap[0].SORT_DAY = this.listSwap[1].SORT_DAY;
      this.listSwap[1].SORT_DAY = swapSort;

      this.listSwap = [];
      this.disabledButton = true;
    }
  }

  swapTwoPlace() {
    if(this.disabledButton == true) {
      let toast = this.toastController.create({
        message: this.translateService.translate("info.swapping"),
        duration: 3000,
        position: 'middle'
      });

      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });

      toast.present();

      this.disabledButton = false;

    }
  }

  checkInList(item) {
    return this.listSwap.indexOf(item) >= 0;
  }

}
