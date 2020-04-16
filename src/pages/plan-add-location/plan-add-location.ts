import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, SearchLocationService, PlanService, UltilitiesService, ShoppingService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { PlanChoicePage } from '../plan-choice/plan-choice';
import { PlanDateChoicePage } from "../plan-date-choice/plan-date-choice";
import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { SightSeeingPage } from '../sight-seeing/sight-seeing';

import { LocationSearch } from "../../model/LocationSearch";

import _ from 'lodash';
import moment from 'moment';
import { LoginPage } from "../login/login";
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { Parameter } from '../../model/Service';

/*
  Generated class for the PlanAddLocation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-plan-add-location',
  templateUrl: 'plan-add-location.html'
})
export class PlanAddLocationPage extends PageBase {

    currentUser: any;
    search: any;
    listResult: LocationSearch[];
    listLocations: any[];
    TOUR_ID: any;
    day: any;
    generalList: any;
    listUpdate: any;
    type: any;
    itemAdd: any;

    listWishList: any[];
//   listAdd: any[];

    caseTime: any;
    suggestTime: any;

    savedList: any;
    currentTabList: any;

    listMustSee: any[];

    datefrom: any;
    addDate: any;
    addDateString: any;

    // listArea: any[] = [];
    // listLocationId: any[] = [];
    // chosenArea: any;

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
        public searchLocationService: SearchLocationService,
        public PlanService: PlanService,
        public toastCtrl: ToastController,
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController,
        public shoppingService: ShoppingService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
        this.currentUser = this.authService.getUserInfo();
        // console.log(this.currentUser);
        this.listLocations = this.navParams.get("locations");
        this.TOUR_ID = this.navParams.get("tourid");
        this.day = this.navParams.get("day");
        this.generalList = this.navParams.get("generalList");
        this.datefrom = this.navParams.get("datefrom");
        
        this.addDate = this.addDay(this.datefrom, this.day - 1);
        this.addDateString = this.convertDateString(this.addDate, "-", 2);
        // this.chosenArea = -1;
        // console.log(this.addDateString);
        //   this.listAdd = this.navParams.get("listAdd");
        // console.log(this.generalList);

        this.type = "TPLACE";
        this.itemAdd = null;
        this.caseTime = 0;
        this.listWishList = [];
        this.savedList = "tk";
        this.currentTabList = "tk";
    }

    init() {
        this.listResult = [];
        // this.getListArea();
    }

    //submit search location lists
    submit() {
        this.listUpdate = [];
        this.getResultSearch();
    }

    getResultSearch() {
        if(((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            // console.log(this.search);
            this.showLoading();
            this.searchLocationService.SearchForPlan(this.search, this.type/*, this.chosenArea*/, 30, 0).subscribe(
                data => {
                    if (data.Code === 200) {
                        // console.log(data.Result);
                        this.listResult = [];
                        this.listResult = _.concat(this.listResult, data.Result);
                        // console.log(this.listResult);
                        
                        setTimeout(() => {
                            this.loading.dismiss();
                        });
                    } else {
                        this.showError(data.Message)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                }
            );
        }
    }

    // getListArea() {
    //     this.UltilitiesService.GetListArea(Parameter.portalifier).subscribe(
    //         data => {
    //             if (data.Code === 200) {
    //                 //console.log(data.Result);
    //                 this.listLocationId = [];
    //                 this.listLocationId = _.concat(this.listLocationId, data.Result);
                    
    //                 this.listLocationId.forEach(element => {
    //                     this.listArea.push({
    //                         id: element.ID,
    //                         name: element.NAME,
    //                         code: element.CODE
    //                     });
    //                 });

    //                 setTimeout(() => {
    //                 });
    //             } else {
    //                 this.showError(data.Message, false);
    //             }

    //         },
    //         error => {
    //             this.showError(this.translateService.translate("network.error"), false);
    //         }
    //     );
    // }

    addToPlanList(item) {
        if(item != null) {
            //console.log(item);
            this.showLoading();
            // this.listAdd.push(item);

            let availableTime = true;

            let addTime = 45;

            if(item.LOCATION_CLOSE_TIME == null) {
                item.LOCATION_CLOSE_TIME = "2016-01-01T23:59";
            }

            // console.log(this.changeDateString((item.LOCATION_OPEN_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_OPEN_TIME.split('T')[1].split(':')[1]))));
            // console.log(this.changeDateString(item.LOCATION_START_TIME));
            // console.log(this.changeDateString((item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[1]))));
            if(!this.compareTime(this.changeDateString((item.LOCATION_OPEN_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_OPEN_TIME.split('T')[1].split(':')[1]))), item.LOCATION_START_TIME.split('Z')[0])) {
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
            
            if(!this.compareTime(item.LOCATION_START_TIME.split('Z')[0], this.changeDateString((item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[0]+":"+(item.LOCATION_CLOSE_TIME.split('T')[1].split(':')[1]))))) {
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
                var new_item = {
                    LOCATION_AVG_PRICE: item.LOCATION_AVG_PRICE,
                    LOCATION_DAY: this.day,
                    LOCATION_DESCRIPTION: "",
                    LOCATION_GOOGLE: item.GEO_LOCATION,
                    TOUR_DETAIL_ID: -1,
                    LOCATION_AVATAR: item.LOCATION_AVATAR,
                    LOCATION_ADDRESS: item.LOCATION_ADDRESS,
                    LOCATION_NAME: item.LOCATION_NAME,
                    LOCATION_ID: item.LOCATION_ID,
                    LOCATION_TYPE: item.LOCATION_TYPE,
                    SORT_DAY: 1,
                    LOCATION_START_TIME: item.LOCATION_START_TIME.split("Z")[0],
                    TOUR_ID: this.TOUR_ID,
                    LOCATION_OPEN_TIME: item.LOCATION_OPEN_TIME,
                    LOCATION_CLOSE_TIME: item.LOCATION_CLOSE_TIME,
                    NATION_ID: item.NATION_ID,
                    CITY_ID: item.CITY_ID,
                    PROVINCE_ID: item.PROVINCE_ID
                };
                this.generalList.push(new_item);
                this.generalList = this.reorderByTime(this.generalList, new_item);
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
                                for (var i = index + 1; i < this.generalList.length && !stop; i++) {

                                    if(this.generalList[i].LOCATION_CLOSE_TIME == null) {
                                        this.generalList[i].LOCATION_CLOSE_TIME = "2016-01-01T23:59";
                                    }

                                    // console.log(this.getMinusTime(this.generalList[i].LOCATION_START_TIME, this.generalList[i-1].LOCATION_START_TIME));
                                    if(this.getMinusTime(this.generalList[i].LOCATION_START_TIME, this.generalList[i-1].LOCATION_START_TIME) < addTime && !stop) {
                                        var hour2digit = moment((this.generalList[i - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getHours() < 10 ? "0" + moment((this.generalList[i - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getHours() : moment((this.generalList[i - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getHours();
                                        var minute2digit = moment((this.generalList[i - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getMinutes() < 10 ? "0" + moment((this.generalList[i - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getMinutes() : moment((this.generalList[i - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getMinutes();
                                        properTime = hour2digit + ":" + minute2digit;
                                        // console.log(this.changeDateString(properTime));
                                        // console.log(this.generalList[i].LOCATION_CLOSE_TIME);
                                        if(!this.compareTime(this.changeDateString(properTime), this.changeDateString(this.generalList[i].LOCATION_CLOSE_TIME.split("T")[1].split(":")[0]+":"+this.generalList[i].LOCATION_CLOSE_TIME.split("T")[1].split(":")[1]))) {
                                            stop = true;
                                            this.generalList[i].TOUR_DETAIL_ID = -1;
                                            var l = this.generalList.length;
                                            while(l > 0) {
                                                this.generalList.pop();
                                                l--;
                                            }
                                            listReturn.forEach(elementR => {
                                                this.generalList.push(elementR);
                                            });
                                        } else {
                                            this.generalList[i].LOCATION_START_TIME = this.changeDateString(properTime);
                                            // console.log(i);
                                            // console.log(this.generalList);
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
                            var alreadyRemove = false;
                            this.generalList.forEach((element, index) => {
                                if(element.TOUR_DETAIL_ID == -1 && !alreadyRemove) {
                                    this.generalList.splice(index, 1);
                                    alreadyRemove = true;
                                }
                            });
                            this.closePopup();
                        } else {
                            //console.log(this.generalList);
                            let toast1 = this.toastCtrl.create({
                                message: this.translateService.translate("warning.changetime"),
                                duration: 3000,
                                position: 'middle',
                            });

                            toast1.onDidDismiss(() => {
                                //console.log('Dismissed toast');
                            });

                            toast1.present();
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
                                var hour2digit = moment((this.generalList[index - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getHours() < 10 ? "0" + moment((this.generalList[index - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getHours() : moment((this.generalList[index - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getHours();
                                var minute2digit = moment((this.generalList[index - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getMinutes() < 10 ? "0" + moment((this.generalList[index - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getMinutes() : moment((this.generalList[index - 1]).LOCATION_START_TIME).add(45, 'm').toDate().getMinutes();
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
                        break;
                    default:
                        break;
                }
                
            }
        }
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
                // console.log(prev);
                // console.log(next);
                // console.log(element);
                if(prev != null) {
                    if(this.getMinusTime(element.LOCATION_START_TIME, prev.LOCATION_START_TIME) < addTime) {
                        this.caseTime = 2;
                    } else {
                        this.caseTime = 0;
                    }
                } else {
                    if(next != null) {
                        if(this.getMinusTime(next.LOCATION_START_TIME, element.LOCATION_START_TIME) < addTime) {
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
                        if(this.getMinusTime(next.LOCATION_START_TIME, element.LOCATION_START_TIME) < addTime) {
                            this.caseTime = 1;
                        } else {
                            this.caseTime = 0;
                        }
                    } else {
                        if(prev != null) {
                            if(this.getMinusTime(element.LOCATION_START_TIME, prev.LOCATION_START_TIME) < addTime) {
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

    changeDateString(time) {
        return this.addDateString+"T"+ time + ":00";
    }

    popupDateOn(item) {
        var isExisted = false;
        if(this.generalList != null && this.generalList.length > 0) {
            this.generalList.forEach(element => {
                if(item.LOCATION_ID == element.LOCATION_ID && item.LOCATION_TYPE == element.LOCATION_TYPE) {
                    isExisted = true;
                }
            });
        }

        // console.log(item);

        if(!isExisted) {
            document.getElementById("alert-popup").style.display = "block";
            // document.getElementById("popupDateTime").style.display = "block";
            document.getElementById("popupDateTime").style.display = "block";
            this.itemAdd = item;
            // console.log(this.itemAdd);
            this.itemAdd.LOCATION_START_TIME = this.changeDateString("08:00");
        } else {
            this.showError("Địa điểm đã có sẵn trong lịch trình");
        }
    }

    closePopup() {
        document.getElementById("alert-popup").style.display = "none";
        // document.getElementById("popupDateTime").style.display = "none";
        document.getElementById("popupDateTime").style.display = "none";
        this.itemAdd = null;
    }

    viewDetail(item) {
        // console.log(item);
        // if (item.LOCATION_TYPE == "SHOP") {
        //     // this.navCtrl.push(HotelDetailPage, { item: item.LOCATION_ID, disableAddPlan: true });
        //     this.shoppingService.GetShopDetailH(item.LOCATION_ID, item.LOCATION_TYPE).subscribe(data => {
        //         if(data.Code === 200) {
        //             let shop = data.Result;
        //             this.navCtrl.push(ShopDetailPage, {item: shop});
        //         }
        //     });
        // } else if (item.LOCATION_TYPE == "RESTAURANT") {
        //     this.navCtrl.push(RestaurantDetailPage, { item: item.LOCATION_ID, disableAddPlan: true });
        // } else if (item.LOCATION_TYPE == "TPLACE") {
        //     this.navCtrl.push(SightSeeingPage, { item: item.LOCATION_ID, disableAddPlan: true });
        // }
        if (item.LOCATION_TYPE == "RESTAURANT") {
            this.navCtrl.push(RestaurantDetailPage, { item: item.LOCATION_ID, code:item.LOCATION_TYPE, obj: item, disableAddPlan: true });
        } else if (item.LOCATION_TYPE == "TPLACE") {
            this.navCtrl.push(SightSeeingPage, { item: item.LOCATION_ID, code: item.LOCATION_TYPE, obj: item, disableAddPlan: true });
        } else if (item.LOCATION_TYPE == "SHOP") {
            this.shoppingService.GetShopDetailH(item.LOCATION_ID,item.LOCATION_TYPE).subscribe(data => {
                if(data.Code === 200) {
                    let shop = data.Result;
                    this.navCtrl.push(ShopDetailPage, {item: shop, disableAddPlan: true});
                }
            });
        }
    }

    updateListHint() {
        if(((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            // this.showLoading();
            //console.log(this.search);
            this.searchLocationService.SearchForPlan(this.search, this.type/*, this.chosenArea*/, 30, 0).subscribe(
                data => {
                    if (data.Code === 200) {
                        // console.log(data.Result);
                        this.listUpdate = [];
                        this.listUpdate = _.concat(this.listUpdate, data.Result);
                        // this.listUpdate[0].Location_Name
                        // console.log(this.listResult);

                        // this.listResult.forEach(element => {
                        //     this.listlocation.push({
                        //         id: element.Location_Id, 
                        //         name: element.Location_Name, 
                        //         imgURL: element.Image_Url ? element.Image_Url : "assets/iconImages/noimage.png", 
                        //         type: element.Location_Type
                        //     });
                        // });
                        
                        // document.getElementById("filter").style.display = "none";

                        setTimeout(() => {
                            // this.loading.dismiss();
                        });
                    } else {
                        this.showError(data.Message, false)
                    }

                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                }
            );
        } else {
            this.listUpdate = [];
        }
        
    }

    changeMainText(ts: string) {
        this.search = ts;
        this.listUpdate = [];

        this.getResultSearch();
    }

    clearText() {
        this.search = "";
        this.listUpdate = [];
        this.listResult = [];
        // this.scrollToTop();
    }

    changeType(ts: any) {
        this.type = ts;
        this.listUpdate = [];
        this.getResultSearch();
    }

    changeTabGetList(ts) {
        if(ts != this.currentTabList) {
            if(ts == 'yt') {
                this.getAllWishlist();
            }
            if(ts == 'gy') {
                this.getAllMustSee();
            }
            this.savedList = ts;
        } 
        this.savedList = ts;
        this.currentTabList = ts;
        // console.log(this.savedList);
        // console.log(this.currentTabList);
    }

    getAllWishlist() {
        this.checkToken().then(loged => {
            if(loged) {
                this.listWishList = [];
                this.showLoading();
                this.showUserInfo.getAllWishlist().subscribe(
                    data => {
                        if (data.Code === 200) {
                            // this.listWishList = _.concat(this.listWishList, data.Result);
                            // this.listWishList.unshift([{}]);
                            data.Result.forEach(element => {
                                if(element.CODE == "SHOP" ||element.CODE == "RESTAURANT" || element.CODE == "TPLACE")
                                this.listWishList.push({
                                    LOCATION_AVG_PRICE: element.TO_AVG_PRICE,
                                    LOCATION_DAY: this.day,
                                    LOCATION_DESCRIPTION: element.DESCRIPTION,
                                    GEO_LOCATION: element.GEO_LOCATION,
                                    TOUR_DETAIL_ID: -1,
                                    LOCATION_AVATAR: element.IMAGE,
                                    LOCATION_NAME: element.NAME,
                                    LOCATION_ADDRESS: element.ADDRESS,
                                    LOCATION_ID: element.ID,
                                    LOCATION_TYPE: element.CODE,
                                    SORT_DAY: 1,
                                    LOCATION_START_TIME: this.changeDateString("08:00"),
                                    TOUR_ID: this.TOUR_ID,
                                    LOCATION_OPEN_TIME: element.OPEN_TIME,
                                    LOCATION_CLOSE_TIME: element.CLOSE_TIME,
                                    NATION_ID: element.NATION_ID,
                                    CITY_ID: element.CITY_ID,
                                    PROVINCE_ID: element.PROVINCE_ID
                                });
                            });

                            //console.log(this.listWishList);
                            
                            setTimeout(() => {
                                this.loading.dismiss();
                            });
                        } else if (data.Code != 404) {
                            this.showError(data.Message);
                        } else {
                            setTimeout(() => {
                                this.loading.dismiss();
                            });
                        }
                    },
                    error => {
                        this.showError(this.translateService.translate("network.error"));
                    }
                );
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
        
    }

    getAllMustSee() {
        
        this.showLoading();
        this.showUserInfo.getAllMustSee().subscribe(
            data => {
                if (data.Code === 200) {
                    // this.listWishList.unshift([{}]);
                    //console.log(data);
                    this.listMustSee = [];
                    data.Result.forEach(element => {
                        if(element.CODE == "SHOP" ||element.CODE == "RESTAURANT" || element.CODE == "TPLACE") {
                            this.listMustSee.push({
                                LOCATION_AVG_PRICE: element.TO_AVG_PRICE,
                                LOCATION_DAY: this.day,
                                LOCATION_DESCRIPTION: element.DESCRIPTION,
                                GEO_LOCATION: element.GEO_LOCATION,
                                TOUR_DETAIL_ID: -1,
                                LOCATION_AVATAR: element.IMAGE,
                                LOCATION_NAME: element.NAME,
                                LOCATION_ADDRESS: element.ADDRESS,
                                LOCATION_ID: element.ID,
                                LOCATION_TYPE: element.CODE,
                                SORT_DAY: 1,
                                LOCATION_START_TIME: this.changeDateString("08:00"),
                                TOUR_ID: this.TOUR_ID,
                                LOCATION_OPEN_TIME: element.OPEN_TIME,
                                LOCATION_CLOSE_TIME: element.CLOSE_TIME,
                                NATION_ID: element.NATION_ID,
                                CITY_ID: element.CITY_ID,
                                PROVINCE_ID: element.PROVINCE_ID
                            });
                        }
                    });

                    //console.log(data.Result);

                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                } else if (data.Code != 404) {
                    this.showError(data.Message);
                } else {
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }
}