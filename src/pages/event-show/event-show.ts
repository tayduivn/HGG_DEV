/**
 * Component defines
 */
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

/**
 * Service defines
 */
import { AuthService, PageBase, EventService, UltilitiesService } from '../../providers';
import { ShowUserInfo } from '../../providers/show-user-info';
import { TranslateService } from '../../translate';

/**
 * Pages defines
 */
import { EventDetailPage } from '../event-detail/event-detail';
import { MapPage } from '../map/map';
import { LookUpPage } from '../look-up/look-up';
import { PlanPage } from "../plan/plan";
import { PlanV2Page } from "../plan-v2/plan-v2";
import { PlanSavedListPage } from "../plan-saved-list/plan-saved-list";
import { OverViewPage } from "../over-view/over-view";
import { UserPage } from "../user/user";

/**
 * Model defines
 */
import { News } from '../../model';
import { User } from '../../model/User';

import _ from 'lodash';
import moment from 'moment';

@Component({
    selector: 'page-event-show',
    templateUrl: 'event-show.html',
})
export class EventShowPage extends PageBase {
    public pageSize: number = 10;
    public pageNumber: number = 1;
    public hasNextPage: boolean = true;

    init() {
        // this.showUserInfo.showUserBar(this.currentUser);

        this.getListTGP_Event();
    }

    listTGP_Event: News[];
    currentUser: User;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public authService: AuthService,
        public showUserInfo: ShowUserInfo,
        public eventService: EventService,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public alertCtrl: AlertController,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, showUserInfo, UltilitiesService);
        this.currentUser = this.authService.getUserInfo();
        this.listTGP_Event = [];
        this.pageSize = 10;
        this.pageNumber = 1;
        //console.log(this.currentUser);
    }

    getListTGP_Event() {
        this.showLoading();
        this.eventService.GetList(this.pageSize, this.pageNumber).subscribe(
            data => {
                if (data.Code === 200) {
                    this.listTGP_Event = _.concat(this.listTGP_Event, data.Result);
                    //let data1 = moment().format('YYYYMMDD');
                    //console.log(this.listTGP_Event);
                    if (data.Result.length === 0) {
                        this.hasNextPage = false;
                    }

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

    loadMoreTenTGP_Event() {
        this.pageNumber++;
        this.getListTGP_Event();
    }

    addTGP_Event(event: News) {
        this.listTGP_Event.push(event);
    }

    showDetailTGP_Event(event) {
        //console.log(event);
        this.navCtrl.push(EventDetailPage, { item: event });
    }

    // changeToMapPage() {
    //     this.navCtrl.setRoot(MapPage);
    // }
    // changeToUserPage() {
    //     this.navCtrl.setRoot(UserPage);
    // }
    // changeToPlanPage() {
    //     this.navCtrl.setRoot(PlanV2Page);
    // }
    // // changeToSavedPlanPage() {
    // //     this.navCtrl.setRoot(PlanSavedListPage);
    // // }
    // changeToOverViewPage() {
    //     this.navCtrl.setRoot(OverViewPage);
    // }

    public getStatus(item: News): string {
        var startDate = moment(item.START_DATE);
        var result = "Đang diễn ra";
        var now = moment();
        if (startDate.isAfter()) {
            var diffDuration = moment.duration(startDate.diff(now));
            var days = startDate.diff(now, 'days');

            result = "";
            if (days != 0) {
                if (days > 1) {
                    result += days + " " + this.translateService.translate('data.days');
                } else {
                    result += days + " " + this.translateService.translate('data.day');
                }
            }

            if (diffDuration.hours() > 1) {
                result += " " + diffDuration.hours() + " " + this.translateService.translate('data.hours');
            } else {
                result += diffDuration.hours() + " " + this.translateService.translate('data.hour');
            }

            if (diffDuration.minutes() > 1) {
                result += " " + diffDuration.minutes() + " " + this.translateService.translate('data.minutes');
            } else {
                result += " " + diffDuration.minutes() + " " + this.translateService.translate('data.minute');
            }

        } else {
            //console.log("Đang diễn ra");
        }


        return result.trim();
    }

}
