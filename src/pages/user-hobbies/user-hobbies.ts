import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";

import { Hobby } from "../../model/Hobby";

import _ from 'lodash';
import moment from 'moment';
/*
  Generated class for the MapRoute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-user-hobbies',
    templateUrl: 'user-hobbies.html'
})
export class UserHobbiesPage extends PageBase {

    listHobbies: Hobby[];
    listUserHobbies: Hobby[];

    listHobbiesShow: any[];

    listHobbiesChoice: any[];
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listHobbies = [];
        this.listHobbiesChoice = [];
        this.listHobbiesShow = [];
        this.listUserHobbies = [];
    }

    init() {
        this.getlistUserHobbies();
    }

    getlistUserHobbies() {
        this.listUserHobbies = [];
        this.ShowUserInfo.getUserHobbies().subscribe(
            data => {
                if (data.Code === 200) {
                    this.listUserHobbies = _.concat(this.listUserHobbies, data.Result);
                    this.listUserHobbies.forEach(elementUC => {
                        this.listHobbiesShow.push({
                            name: elementUC.NAME,
                            checked: elementUC.CHECKED,
                            id: elementUC.ID
                        });
                        if (elementUC.CHECKED)
                            this.listHobbiesChoice.push(elementUC.ID);
                    });
                    //console.log(this.listUserHobbies);
                    //this.loadHobbies(this.listUserHobbies);
                    setTimeout(() => {
                    });
                } else {
                    this.showError(data.Message, false);
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"), false);
            });
    }

    loadHobbies(listHobbiesShow) {
        //   this.showLoading();
        //   this.listHobbies = [];
        //   this.hobbyService.GetListFB().subscribe(
        //       data => {
        //           if (data.Code === 200) {
        //               this.listHobbies = _.concat(this.listHobbies, data.Result);
        //               this.listHobbies.forEach(element => {
        //                   if(this.listHobbiesChoice.indexOf(element.Travel_Service_Id) < 0) {
        //                     this.listHobbiesShow.push({
        //                         name: element.Travel_Service_Name,
        //                         checked: false,
        //                         id: element.Travel_Service_Id
        //                     });
        //                   }
        //               });
        //               console.log(this.listHobbies);
        //               setTimeout(() => {
        //               });
        //           } else {
        //               this.showError(data.Message)
        //           }
        //       },
        //       error => {
        //           this.showError(this.translateService.translate("network.error"));
        //       });
        // this.hobbyService.GetListTravel().subscribe(
        //   data => {
        //       if (data.Code === 200) {
        //           this.listHobbies = _.concat(this.listHobbies, data.Result);
        //           this.listHobbies.forEach(element => {
        //               if(this.listHobbiesChoice.indexOf(element.Travel_Service_Id) < 0) {
        //                 this.listHobbiesShow.push({
        //                     name: element.Travel_Service_Name,
        //                     checked: false,
        //                     id: element.Travel_Service_Id
        //                 });
        //               }
        //           });
        //           console.log(this.listHobbies);
        //           setTimeout(() => {
        //               this.loading.dismiss();
        //           });
        //       } else {
        //           this.showError(data.Message)
        //       }
        //   },
        //   error => {
        //       this.showError(this.translateService.translate("network.error"));
        //   });
    }

    changeValue(item) {
        this.showLoading();
        if (item.checked == false) {
            item.checked = true;
            this.showUserInfo.insertHobbies(item.id).subscribe(
                data => {
                    if (data.Code === 200) {
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
        } else {
            item.checked = false;
            this.showUserInfo.deleteHobbies(item.id).subscribe(
                data => {
                    if (data.Code === 200) {
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
        }
    }

}
