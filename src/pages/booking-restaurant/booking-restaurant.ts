import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { PageBase } from '../../providers/page-base';

import { RestaurantService, UltilitiesService } from "../../providers";

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";

/*
  Generated class for the BookingRestaurant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-booking-restaurant',
    templateUrl: 'booking-restaurant.html'
})
export class BookingRestaurantPage extends PageBase {
    id: any;
    model = { bookingdate: null, bookingtime: null, name: "", email: "", telephone: "", customerQuantity: "", note: "" };
    error = [];
    name : any;
    chooserange: any;
    use_app: any;
    today: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public restaurantService: RestaurantService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.id = this.navParams.get("item");
        this.name = this.navParams.get("name");
        this.use_app = this.navParams.get("use_app");
        this.today = new Date().toISOString();
    }

    init() {
        this.model.bookingdate = new Date().toISOString();
        let currentTime = (new Date()).getHours()+1;
        this.chooserange = (currentTime < 10 ? "0"+currentTime : currentTime);
        for(let i = currentTime + 1; i < 24; i++) {
            this.chooserange += "," + i;
        }
        // this.chooserange = (currentTime < 10 ? "0"+currentTime : currentTime) + ",18";
        //console.log(this.chooserange);
        this.model.bookingtime = (currentTime < 10 ? "0"+currentTime : currentTime) + ":00";
    }
    changeCheckoutDate() {
        this.today = new Date().toISOString();
        if (this.model.bookingdate < this.minusDay(this.today, (1/1440)).toISOString()) {
            let alert = this.alertCtrl.create({
                title: this.translateService.translate('error.title'),
                subTitle: this.translateService.translate('error.invaliddatefrom'),
                buttons: [
                    {
                        text: 'OK',
                        role: 'cancel',
                        handler: () => {
                            this.model.bookingdate = this.today;
                        }
                    }
                ]
            });
            alert.present();
        }
        if (this.model.bookingdate >= ((this.addDay(this.today, 1).toISOString().split("T")[0])+"T00:00:00.000Z")) {
            let currentTime = 7;
            this.chooserange = (currentTime < 10 ? "0"+currentTime : currentTime);
            for(let i = currentTime + 1; i < 24; i++) {
                this.chooserange += "," + i;
            }
            //console.log(this.chooserange);
        } else {
            let currentTime = (new Date()).getHours()+1;
            this.chooserange = (currentTime < 10 ? "0"+currentTime : currentTime);
            for(let i = currentTime + 1; i < 24; i++) {
                this.chooserange += "," + i;
            }
            this.model.bookingtime = (currentTime < 10 ? "0"+currentTime : currentTime) + ":00";
        } 
    }
    submit() {
        this.error = [];
        
        if (this.model.bookingdate != null
            && this.model.bookingtime != null
            && this.model.email != ""
            && this.model.name != ""
            && this.model.customerQuantity != ""
            && this.model.telephone != ""
        ) {
            if (!this.validateEmail(this.model.email)) {
                this.error.push(this.translateService.translate("error.invalidmail"));
            }
            if (!this.validatePhone(this.model.telephone)) {
                this.error.push(this.translateService.translate("error.invalidphone"));
            }
            if (!this.validNumber(this.model.customerQuantity)) {
                this.error.push(this.translateService.translate("error.invalidcustno"));
            }
            if(this.error.length == 0) {
                this.showLoading();
                //console.log(this.model);
                this.restaurantService.BookingRestaurant(
                    "booking "+this.name,
                    2,
                    0,
                    this.convertDateString(new Date(this.model.bookingdate), "/"),
                    this.id,
                    parseInt(this.model.customerQuantity),
                    this.model.bookingtime,
                    1,
                    "",
                    0,
                    0,
                    0,
                    this.model.name,
                    this.model.telephone,
                    this.model.email,
                    this.model.note,
                    0,
                    0,
                    this.use_app
                ).subscribe(data => {
                    if(data.Code == 200) {
                        setTimeout(() => {
                            this.loading.dismiss();
                        });
                        let alert = this.alertCtrl.create({
                            title: this.translateService.translate('info.title'),
                            subTitle: this.translateService.translate('info.successbkt'),
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
                    },
                    error => {
                        this.showError(this.translateService.translate("network.error"));
                    }
                );
            }
        } else {
            this.error.push(this.translateService.translate('warning.fillform'));
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
        var regex = /^[1-9]\d*$/;
        return regex.test(no);
    }
}
