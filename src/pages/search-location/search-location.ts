import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { EventShowPage } from '../event-show/event-show';
import { MapPage } from '../map/map';
import { HotelDetailPage } from '../hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { SightSeeingPage } from '../sight-seeing/sight-seeing';
import { PlanPage } from "../plan/plan";
import { PlanSavedListPage } from "../plan-saved-list/plan-saved-list";

import { PageBase } from '../../providers/page-base';

import { SearchLocationService, UltilitiesService, HobbyService, ServiceGetting, ShowUserInfo } from '../../providers';
import { LocationSearch } from '../../model/LocationSearch';

import { OverViewPage } from "../over-view/over-view";
import { LocationLevelThree } from "../../model/LocationLevelThree";

import { Hobby } from "../../model/Hobby";
import { Service } from "../../model/Service";
import { PlanDayDetail } from "../../model/PlanDayDetail";

import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';

/*
  Generated class for the LookUp page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-search-location',
    templateUrl: 'search-location.html'
})
export class SearchLocationPage extends PageBase {

    location: PlanDayDetail;
    listlocation: LocationSearch[];
    search: any;
    
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
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, ultilitiesService);
        this.listlocation = [];
        this.location = this.navParams.get("location");
    }

    init() {
    }

    submit() {
        this.getResultSearch();
    }
    
    getResultSearch() {
        if(((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            this.listlocation = [];
            //console.log(this.search);
            this.showLoading();
            this.searchLocationService.SearchByName(this.search).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listlocation = [];
                        this.listlocation = _.concat(this.listlocation, data.Result);
                        
                        //console.log(this.listlocation);

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
}
