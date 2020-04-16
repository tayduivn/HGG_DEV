import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { UnauthorPageBase } from '../../providers';

import { HotelService } from "../../providers";
import { MapQuickBookingPage } from "../map-quick-booking/map-quick-booking";
import { MapChoosenPage } from "../map-choosen/map-choosen";

import { RoomFormat } from "../../model/RoomFormat";
import { RoomType } from "../../model/RoomType";

import _ from 'lodash';
import moment from 'moment';

import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '../../translate';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
@Component({
    selector: 'page-quick-booking',
    templateUrl: 'quick-booking.html'
})
export class QuickBookingPage extends UnauthorPageBase {

    unique_device_id: any;
    constructor(public navCtrl: NavController, public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        private geolocation: Geolocation,
        public modalCtrl: ModalController,
        public translateService: TranslateService,
        private uniqueDeviceID: UniqueDeviceID
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService);
        this.uniqueDeviceID.get()
            .then((uuid: any) => this.unique_device_id = uuid)
            .catch((error: any) => console.log(error));
    }

    model = {
        price: "",
        roomFormat: "",
        checkin: null,
        checkout: null,
        name: "",
        email: "",
        telephone: "",
        roomType: "",
        roomQuantity: "1",
        distance: 2000,
        roomFormatName: "",
        roomTypeName: "",
        location: "",
    };
    id: any;
    categories: any[] = [];
    listRoomFormat: RoomFormat[] = [];
    listRoomType: RoomType[] = [];
    checkInfo = { price: "0", allotment: 0 };
    error = [];
    listPrices: any[];
    distances: Array<number> = [];
    init() {
        var now = new Date().toISOString();
        var nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        this.id = this.navParams.get("item");
        this.loadHotelInformation();
        this.listPrices = [
            { value: null, text: this.translateService.translate("map.any") },
            { value: "0-300000", text: "< 300.000 VNĐ" },
            { value: "300000-500000", text: "300.000 - 500.000 VNĐ" },
            { value: "500000-1000000", text: "500.000 - 1.000.000 VNĐ" },
            { value: "1000000-100000000", text: "> 1.000.000 VNĐ" },
        ];

        this.distances = [2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

        var options = {
            frequency: 3000,
            enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition(options).then((position) => {
            //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var name = "";
            var email = "";
            var phone = "";
            if (localStorage.getItem("Email") != null) {
                email = localStorage.getItem("Email") == "null" ? "" : localStorage.getItem("Email");
            }

            if (localStorage.getItem("LastName") != null) {
                name = localStorage.getItem("LastName") == "null" ? "" : localStorage.getItem("LastName");
            }

            if (localStorage.getItem("FirstName") != null) {
                name += " " + (localStorage.getItem("FirstName") == "null" ? "" : localStorage.getItem("FirstName"));
            }

            if (localStorage.getItem("Phone") != null) {
                phone = localStorage.getItem("Phone") == "null" ? "" : localStorage.getItem("Phone");
            }
            this.model = {
                price: "",
                checkin: now,
                checkout: nextDate.toISOString(),
                name: name,
                email: email,
                telephone: phone,
                roomType: "",
                roomFormat: "",
                roomQuantity: "1",
                distance: 2000,
                roomFormatName: "",
                roomTypeName: "",
                location: position.coords.latitude + "," + position.coords.longitude,
            };
            //console.log(this.model);
        }, (err) => {
            //console.log(err);
        });



        this.hotelService.GetRoomFormat().subscribe(
            data => {
                if (data.Code === 200) {
                    this.listRoomFormat = data.Result;

                } else {
                    this.showError(data.Message, false)
                }
            },
            error => {
                this.showError(error, false);
            });
        this.hotelService.GetRoomType().subscribe(
            data => {
                if (data.Code === 200) {
                    this.listRoomType = data.Result;

                } else {
                    this.showError(data.Message, false)
                }
            },
            error => {
                this.showError(error, false);
            });
        // this.categories = [];
        // this.roomTypes = [];
    }

    showMap() {
        let modal = this.modalCtrl.create(MapChoosenPage, { item: this.model.location });
        modal.present();
        modal.onDidDismiss(data => {
            if (data.item != "") {
                this.model.location = data.item;
            }
            //console.log(data);
        });
        //console.log('asd');
    }

    loadHotelInformation() {
    }

    handlePush(data) {
        if (data.Code == 200) {
            if (data.Result.length > 0) {
                setTimeout(() => {
                    this.loading.dismiss();
                    let modal = this.modalCtrl.create(MapQuickBookingPage, { item: data.Result });
                    modal.present();

                });
            } else if (this.model.distance >= 10000) {
                setTimeout(() => {
                    this.showError(this.translateService.translate("quickBooking.noResult"));
                });
            } else {
                setTimeout(() => {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        title: this.translateService.translate("error.title"),
                        subTitle: this.translateService.translate("quickBooking.noResultNext"),
                        buttons: [
                            {
                                text: "Ok",
                                handler: () => {
                                    this.showLoading();

                                    var roomFormat = _.filter(this.listRoomFormat, s => s.ID == this.model.roomFormat);
                                    this.model.distance = this.model.distance + 1000;
                                    this.hotelService.pushHotel(this.model, this.unique_device_id)
                                        .subscribe(
                                        data => {
                                            if(data.Code === 200) {
                                                this.handlePush(data);       
                                            } else if(data.Code === 201) {
                                                this.showError(this.translateService.translate("warning.timenotexpire"));
                                            }
                                        },
                                        error => {
                                            this.showError(this.translateService.translate("network.error"), false);
                                        }
                                        );
                                }
                            },
                            {
                                text: "Cancel",
                                handler: () => {
                                    //console.log("Cancel");
                                }
                            }
                        ]
                    });
                    alert.present();
                });
                //this.showError(this.translateService.translate("quickBooking.noResult"));
            }
        } else {
            this.showError(this.translateService.translate("quickBooking.unknowError"));
            //console.log(data.Message);
        }

    }

    submit() {
        //console.log(this.model);
        this.error = [];
        if (this.model.email != "" && !this.validateEmail(this.model.email)) {
            this.error.push("quickplan.form.error.email");
        }

        if (this.model.name == "") {
            this.error.push("quickplan.form.error.name");
        }

        if (this.model.telephone == "") {
            this.error.push("quickplan.form.error.phone");
        }

        if (this.error.length == 0) {
            this.showLoading();

            var roomFormat = _.filter(this.listRoomFormat, s => s.ID == this.model.roomFormat);

            if (roomFormat.length > 0) {
                this.model.roomFormatName = roomFormat[0].NAME;
            }

            var roomtype = _.filter(this.listRoomType, s => s.ID == this.model.roomType);

            if (roomtype.length > 0) {
                this.model.roomTypeName = roomtype[0].NAME;
            }

            this.hotelService.pushHotel(this.model, this.unique_device_id)
                .subscribe(
                data => {
                    if(data.Code === 200) {
                        this.handlePush(data);       
                    } else if(data.Code === 201) {
                        this.showError(this.translateService.translate("warning.timenotexpire"));
                    }
                },
                error => {
                    this.showError(this.translateService.translate("network.error"), false);
                }
                );


        }
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    getNow() {
        //console.log(moment(new Date()).format("DD/MM/YYYY"));
        return moment(new Date()).format("YYYY-MM-DD");
    }
} 
