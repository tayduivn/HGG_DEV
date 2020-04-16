import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { PageBase } from '../../providers/page-base';

import { HotelService, UltilitiesService } from "../../providers";

import { RoomFormat } from "../../model/RoomFormat";
import { RoomType } from "../../model/RoomType";

import { TranslateService } from '../../translate';
import { ShowUserInfo } from "../../providers/show-user-info";
import { RoomAV } from "../../model/RoomAV";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the BookingHotel page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-booking-hotel',
    templateUrl: 'booking-hotel.html'
})
export class BookingHotelPage extends PageBase {

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listResult = [];
    }

    model = { checkin: null, checkout: null, name: "", email: "", telephone: "", roomType: "", category: "", roomQuantity: "", note: "" };
    id: any;
    categories: any[]; listRoomFormat: any[];
    roomTypes: any[]; listRoomType: any[];
    listResult: RoomAV[];
    checkInfo = { price: "0", allotment: 0, checked: false };
    error = [];
    name: any;
    today: any;
    use_app: any;

    init() {
        //console.log('ionViewDidLoad BookingRestaurantPage');
        this.id = this.navParams.get("item");
        this.name = this.navParams.get("name");
        this.use_app = this.navParams.get("use_app");
        this.loadHotelInformation();
        this.categories = [];
        this.roomTypes = [];
        this.model.checkin = new Date().toISOString();
        this.today = new Date().toISOString();
        var checkinDate = new Date(this.model.checkin);
        var dt = this.addDay(checkinDate, 1);
        // dt.setTime(this.model.checkin.getTime() + (24 * 60 * 60 * 1000));
        this.model.checkout = dt.toISOString();
    }

    changeCheckoutDate() {
        if (this.model.checkin >= this.model.checkout) {
            this.model.checkout = this.addDay(new Date(this.model.checkin), 1).toISOString();
        }
        if (this.model.checkin < this.today) {
            let alert = this.alertCtrl.create({
                title: this.translateService.translate('error.title'),
                subTitle: this.translateService.translate('error.invaliddatefrom'),
                buttons: [
                    {
                        text: 'OK',
                        role: 'cancel',
                        handler: () => {
                            this.model.checkin = this.today;
                        }
                    }
                ]
            });
            alert.present();
        }
    }
    changeCheckinDate() {
        if (this.model.checkout <= this.model.checkin) {
            if(this.today <= this.minusDay(this.model.checkout, 1).toISOString()) {
                this.model.checkin = this.minusDay(this.model.checkout, 1).toISOString();
                this.model.checkout = this.addDay(new Date(this.model.checkin), 1).toISOString();
            } 
            // else {
            //     this.model.checkin = this.model.checkout;
            //     this.model.checkout = this.addDay(new Date(this.today), 1).toISOString();
            // }
        }
        if (this.model.checkout < this.addDay(new Date(this.today), 1).toISOString()) {
            let alert = this.alertCtrl.create({
                title: this.translateService.translate('error.title'),
                subTitle: this.translateService.translate('error.invalidfromto'),
                buttons: [
                    {
                        text: 'OK',
                        role: 'cancel',
                        handler: () => {
                            this.model.checkin = this.today;
                            this.model.checkout = this.addDay(new Date(this.today), 1).toISOString();
                        }
                    }
                ]
            });
            alert.present();
        }
    }

    updateChecked() {
        this.checkInfo.checked = false;
        //console.log(this.checkInfo);
    }

    loadHotelInformation() {
        this.showLoading();
        this.hotelService.GetRoomFormat().subscribe(data => {
            if (data.Code === 200) {
                this.listRoomType = [];
                this.listRoomType = _.concat(this.listRoomType, data.Result);

                this.listRoomType.forEach(element => {
                    this.roomTypes.push({
                        id: element.ID,
                        name: element.NAME
                    });
                });
                setTimeout(() => {
                    this.loading.dismiss();
                });
            } else {
                this.showError(data.Message)
            }
        },
        error => {
            this.showError(this.translateService.translate("network.error"));
        });
        this.hotelService.GetRoomType().subscribe(data => {
            if (data.Code === 200) {
                this.listRoomFormat = [];
                this.listRoomFormat = _.concat(this.listRoomFormat, data.Result);

                this.listRoomFormat.forEach(element => {
                    this.categories.push({
                        id: element.ID,
                        name: element.NAME
                    });
                });
                setTimeout(() => {
                    this.loading.dismiss();
                });
            } else {
                this.showError(data.Message)
            }
        },
        error => {
            this.showError(this.translateService.translate("network.error"));
        });

        // this.hotelService.GetRoomType().subscribe(data => {
        //     if (data.Code === 200) {
        //         this.listRoomType = [];
        //         this.listRoomType = _.concat(this.listRoomType, data.Result);

        //         console.log(this.listRoomType);

        //         this.listRoomType.forEach(element => {
        //             this.roomTypes.push({
        //                 id: element.Room_Type_Id,
        //                 name: element.Room_Type_Name
        //             });
        //         });

        //         setTimeout(() => {
        //             this.loading.dismiss();
        //         });
        //     } else {
        //         this.showError(data.Message)
        //     }
        // },
        // error => {
        //     this.showError(this.translateService.translate("network.error"));
        // });

        // switch(id) {
        //   case 179:
        //     return {
        //       roomTypes: [
        //         {id: 1, name: "Single"},
        //         {id: 2, name: "Double"},
        //         {id: 3, name: "Triple"},
        //       ],
        //       categories: [
        //         {id: 1, name: "Deluxe"},
        //         {id: 2, name: "Twin"},
        //       ]
        //     };
        //   case 180:
        //     return {
        //       roomTypes: [
        //         {id: 1, name: "Single"},
        //         {id: 2, name: "Double"},
        //         {id: 3, name: "Twin"},
        //       ],
        //       categories: [
        //         {id: 1, name: "Deluxe"},
        //         {id: 2, name: "Twin"},
        //       ]
        //     }
        // }

    }

    checkAllotment() {
        
        var eInfo = document.getElementById("roomInForAfterCheck");
        // if(this.model.roomType != "" && this.model.category != "") {
        //   eInfo.style.display = "block";
        //   if(parseInt(this.model.roomType) == 1 && parseInt(this.model.category) == 1 || parseInt(this.model.roomType) == 2 && parseInt(this.model.category) == 2) {
        //     this.checkInfo = {
        //       price: "700,000",
        //       allotment: 4
        //     };
        //   } else {
        //     this.checkInfo = {
        //       price: "1200,000",
        //       allotment: 2
        //     };
        //   }
        // } 
        if(this.dateDiffNight(this.model.checkin, this.model.checkout) < 4) {
            if (this.model.roomType != "" && this.model.category != "") {
                this.showLoading();
                
                this.hotelService.GetRoomAV(this.convertDateString(new Date(this.model.checkin), "/"), this.convertDateString(new Date(this.model.checkout), "/"), this.id, this.model.category, this.model.roomType).subscribe(
                    data => {
                        if (data.Code === 200) {
                            this.listResult = [];
                            this.listResult = _.concat(this.listResult, data.Result);

                            //console.log(this.listResult)

                            if(this.listResult.length > 0) {
                                var result = this.listResult[0];
                                if(result.MIN_PRICE == result.MAX_PRICE) {
                                    this.checkInfo = {
                                        price: result.MAX_PRICE + " VND",
                                        allotment: result.AV,
                                        checked: true
                                    };
                                } else {
                                    this.checkInfo = {
                                        price: this.translateService.translate('from') + " " + result.MIN_PRICE + " VND " + this.translateService.translate('to') + " " + result.MAX_PRICE + " VND",
                                        allotment: result.AV,
                                        checked: true
                                    };
                                }
                            } else {
                                this.checkInfo = {
                                    price: "0 VND",
                                    allotment: 0,
                                    checked: true
                                };
                            }
                            setTimeout(() => {this.loading.dismiss();});
                            eInfo.style.display = "block";
                        } else {
                            this.showError(data.Message);
                        }
                    },
                    error => {
                        this.showError(this.translateService.translate("network.error"));
                    });
            }
        } else {
            this.showError(this.translateService.translate('error.differfromto'), false);
        }
        
    }

    submit() {
        this.error = [];
        
        if(this.dateDiffNight(this.model.checkin, this.model.checkout) < 4) {
            if (this.model.checkin != null
            && this.model.checkout != null
            && this.model.category != ""
            && this.model.email != ""
            && this.model.name != ""
            && this.model.roomQuantity != ""
            && this.model.roomType != ""
            && this.model.telephone != "") {
                
                //console.log(this.model);
                this.error = [];
                
                if (!this.validNumber(this.model.roomQuantity)) {
                    // this.error.push(this.translateService.translate('error.invalidnumber'));
                    this.showError(this.translateService.translate('error.invalidnumber'));
                }
                if(this.error.length == 0) {
                    if(this.checkInfo.checked == false) {
                        this.showError(this.translateService.translate('warning.checkAV'));
                    } else {
                        if(this.checkInfo.allotment < parseInt(this.model.roomQuantity)) {
                            this.showError(this.translateService.translate('error.requestmorethanav'));
                        } else if(this.checkInfo.allotment <= 0) {
                            this.showError(this.translateService.translate('error.quantityzero'));
                        } else if(this.checkInfo.allotment > 0) {
                            if (!this.validateEmail(this.model.email)) {
                                // this.error.push(this.translateService.translate('error.invalidmail'));
                                this.showError(this.translateService.translate('error.invalidmail'));
                            }
                            if (!this.validatePhone(this.model.telephone)) {
                                // this.error.push(this.translateService.translate('error.invalidphone'));
                                this.showError(this.translateService.translate('error.invalidphone'));
                            }

                            if(this.error.length == 0) {
                                this.showLoading();
                                this.hotelService.BookingHotel(
                                    "booking " + this.name,
                                    0,
                                    0,
                                    0,
                                    1,
                                    this.model.name,
                                    this.model.telephone,
                                    this.model.email,
                                    0,
                                    0,
                                    this.model.note,
                                    ((new Date(this.model.checkin)).getDate() >= 10 ? (new Date(this.model.checkin)).getDate() : "0" + (new Date(this.model.checkin)).getDate()) + "/" + (((new Date(this.model.checkin)).getMonth() + 1) >= 10 ? ((new Date(this.model.checkin)).getMonth() + 1) : "0" + ((new Date(this.model.checkin)).getMonth() + 1)) + "/" + (new Date(this.model.checkin)).getFullYear(),
                                    parseInt(this.model.roomType),
                                    0,
                                    ((new Date(this.model.checkout)).getDate() >= 10 ? (new Date(this.model.checkout)).getDate() : "0" + (new Date(this.model.checkout)).getDate()) + "/" + (((new Date(this.model.checkout)).getMonth() + 1) >= 10 ? ((new Date(this.model.checkout)).getMonth() + 1) : "0" + ((new Date(this.model.checkout)).getMonth() + 1)) + "/" + (new Date(this.model.checkout)).getFullYear(),
                                    parseInt(this.model.roomQuantity),
                                    this.id,
                                    1,
                                    parseInt(this.model.category),
                                    this.use_app
                                ).subscribe(data => {
                                    if (data.Code == 200) {
                                        setTimeout(() => {
                                            this.loading.dismiss();
                                        });
                                        let alert = this.alertCtrl.create({
                                            title: this.translateService.translate('info.title'),
                                            subTitle: this.translateService.translate('info.successbkr'),
                                            buttons: [
                                                {
                                                    text: 'OK',
                                                    handler: data => {
                                                        this.navCtrl.pop();
                                                    }
                                                }],
                                        });
                                        alert.present();
                                    } else {
                                        this.showError(data.Message);
                                    }
                                }, error => { this.showError(this.translateService.translate("network.error")); });
                            }
                            
                        } else {
                            this.showError(this.translateService.translate('warning.outoforder'), false);
                        }
                    }
                }
                
                
            } else {
                this.showError(this.translateService.translate('warning.fillform'));
                // this.error.push(this.translateService.translate('warning.fillform'));
            }
        } else {
            this.showError(this.translateService.translate('error.differfromto'), false);
        }
        
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    validatePhone(phone) {
        var re = /^\+?\d{2}|\0(?:\-?|\ ?)(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
        return re.test(phone);
    }
    validNumber(no) {
        var regex = /^[0-9]\d*$/;
        return regex.test(no);
    }
} 
