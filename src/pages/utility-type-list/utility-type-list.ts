import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PageBase } from '../../providers/page-base';
import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { SearchLocationService, UltilitiesService, HobbyService, ServiceGetting } from '../../providers';
import { WeatherPage } from "../../pages/weather/weather";
import { ExchangeRatePage } from "../../pages/exchange-rate/exchange-rate";
import { UtilityLocationListPage } from "../utility-location-list/utility-location-list";
import { TranslateLanguagePage } from "../translate-language/translate-language";
import { Utility } from "../../model/Utility";

import _ from 'lodash';
import moment from 'moment';
import { TourGuideSearchPage } from '../tour-guide-search/tour-guide-search';

/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-utility-type-list',
    templateUrl: 'utility-type-list.html'
})
export class UtilityTypeListPage extends PageBase {

    listResult: Utility[];
    listResultC: Utility[];
    listUtilities: any[];
    isback: any;
    title: string;

    // isInit: boolean = false;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public searchLocationService: SearchLocationService,
        public ultilitiesService: UltilitiesService,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.listResult = []; this.listResultC = [];
        this.listUtilities = [];
        this.isback = false;
        this.title = "Tiện ích du lịch";

        let item = navParams.get('item');

        if(item != undefined || item != null) {
            // this.isInit = true;
            this.gotoDetail(item);
          } else {
              this.getListParentType();
            //   this.isInit = false;
          }
    }

    init() {
        window.addEventListener("resize", () => {
            let elms = document.getElementById('list-ultilities').getElementsByClassName("box-utility");
            for (var i = 0; i < elms.length; i++) {
                let imginside = elms[i].getElementsByTagName("img")[0];
                imginside.height = (window.innerWidth - 40) / (window.innerWidth < 450 ? 4 : (window.innerWidth < 768 ? 5 : (window.innerWidth < 1024 ? 6 : 8))) - 10;
            }
        });
    }

    ionViewWillLeave() {
    }

    getListParentType(next = false) {
        // if(!next) {
        //     this.showLoading();
        // }

        this.listUtilities = [];
        this.ultilitiesService.GetListUtility().subscribe(
            data => {
                if (data.Code === 200) {
                    this.listResult = [];
                    this.listResult = _.concat(this.listResult, data.Result);

                    this.listResult.forEach(element => {
                        var img = element.IMAGE;
                        this.listUtilities.push({
                            id: element.ID,
                            name: element.NAME,
                            imgURL: img,
                            is_parent: element.IS_PARENT
                        });
                    });

                    setTimeout(() => {
                        let elms = document.getElementById('list-ultilities');
                        if (elms != null) {
                            let c_list = elms.getElementsByClassName("box-utility");
                            for (var i = 0; i < c_list.length; i++) {
                                let imginside = c_list[i].getElementsByTagName("img")[0];
                                imginside.height = (window.innerWidth - 40) / (window.innerWidth < 450 ? 4 : (window.innerWidth < 768 ? 5 : (window.innerWidth < 1024 ? 6 : 8))) - 10;
                            }
                        }
                        if (!next) {
                            // this.loading.dismiss();
                        }
                    });
                } else {
                    this.showError(data.Message, !next)
                }

            },
            error => {
                this.showError(this.translateService.translate("network.error"), !next);
            }
        );
    }

    gotoDetail(item) {
        this.isback = true;
        // this.navCtrl.push();
        this.getChildType(item);
    }

    gotoWeather() {
        this.navCtrl.push(WeatherPage);
        // var al = this.alertCtrl.create({
        //     title: this.translateService.translate('info.title'),
        //     message: this.translateService.translate('info.baotri'),
        //     buttons: [{
        //         text: this.translateService.translate('tl.cancel'),
        //         role: 'cancel'
        //     }]
        // });
        // al.present();
    }

    gotoExchangeRate() {
        this.navCtrl.push(ExchangeRatePage);
    }

    goBack(next = false) {
        this.getListParentType(next);
        this.isback = false;
        this.title = "Tiện ích du lịch";
    }

    getChildType(item) {
        //   this.showLoading();
        this.listUtilities = [];
        this.ultilitiesService.GetListChildUtility(item.id).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listResultC = [];
                    this.listResultC = _.concat(this.listResultC, data.Result);
                    this.listResultC.forEach(element => {
                        var img = element.IMAGE;

                        this.listUtilities.push({
                            id: element.ID,
                            name: element.NAME.length > 20 ? element.NAME.substring(0, 20) + "..." : element.NAME,
                            imgURL: img,
                            type: element.Travel_Service_Type,
                            icon: element.IMAGE,

                        });
                    });
                    this.title = item.name;
                    setTimeout(() => {
                        let elms = document.getElementById('list-ultilities');
                        if (elms != null) {
                            let c_list = elms.getElementsByClassName("box-utility");
                            for (var i = 0; i < c_list.length; i++) {
                                let imginside = c_list[i].getElementsByTagName("img")[0];
                                imginside.height = (window.innerWidth - 40) / (window.innerWidth < 450 ? 4 : (window.innerWidth < 768 ? 5 : (window.innerWidth < 1024 ? 6 : 8))) - 10;
                            }
                        }
                        // this.loading.dismiss();
                    });
                    if (this.listResultC.length > 0 && this.listResultC[0].IS_PARENT == 0) {
                        this.navCtrl.push(UtilityLocationListPage, { utilities: item });
                        this.goBack(true);
                    }
                } else {
                    this.showError(data.Message)
                }

            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }

    gotoTranslatePage() {
        this.navCtrl.push(TranslateLanguagePage);
    }

    gotoSearchTourGuide() {
        this.navCtrl.push(TourGuideSearchPage);
    }
}
