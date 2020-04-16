import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { EventDetailPage } from "../event-detail/event-detail";
import { Services, EventService } from "../../providers";
import { Http } from '@angular/http';
import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { Subscription } from 'rxjs/Subscription';
/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-news',
    templateUrl: 'news.html',
})
export class NewsPage extends PageBase {
    search: string;
    pageSize: number;
    pageIndex: number;
    pageCount: number;
    news: any[] = [];
    TypeId: number;
    Types: any[] = [];
    selectType: string;
    init() {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.pageCount = 10;
        this.selectType = 'lctlk.all';
        this.loadNews();
        this.loadTypes();
    }

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public translateService: TranslateService,
        public http: Http,
        public showUserInfo: ShowUserInfo,
        public eventService: EventService,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, showUserInfo, UltilitiesService);
        this.search = "";
    }

    ionViewDidLoad() {
        this.init();
    }
    searchNews() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.news = [];
        this.loadNews();
    }

    clearText() {
        this.search = "";
    }

    loadTypes() {
        var data = {
            "CODE": "N_NEWS",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
            // "SessionCode": localStorage.getItem('SessionCode') // luôn luôn phải có với bất cứ api nào
        };
        this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m)).subscribe(
                data => {
                    if (data.Code == 200) {
                        this.Types = data.Result;
                    }
                },
                error => {

                }
            );

    }

    loadNews() {
        var data = {
            "language_id": localStorage.getItem('currentLangauge'),
            PAGE_SIZE: this.pageSize,
            PAGE_NUMBER: this.pageIndex,
            TYPE_ID: this.TypeId,
            KEYWORDS: this.search
        };
        this.http.post(Services.ServerURL('NewsGuest/GetListPageNews'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m)).subscribe(data => {
                if (data.Code === 200) {
                    this.pageCount = data.Result.length;
                    this.news = this.news.concat(data.Result);
                } else {
                    this.showError(data.Message);
                }
            },
                error => {
                    this.showError(this.translateService.translate("network.error"));
                });
    }

    doInfinite(infiniteScroll) {
        this.pageIndex++;
        this.pageCount = 0;
        console.log(this.pageIndex);
        this.loadNews();
    }
    gotoDetail(detail) {
        this.eventService.GetDetailH(detail.ID, detail.CODE).subscribe(data => {
            if (data.Code === 200) {
                // this.current_event = data.Result[0];
                // console.log(this.current_event);
                // this.navCtrl.push(EventDetailPage, { id: obj.id });
                this.navCtrl.push(EventDetailPage, { item: data.Result, obj: detail });
            }
        }, error => {
            //console.log(error)
        });
    }
    showContentList(event, ts: string) {
        //   console.log(event);
        var target = event.srcElement.nextElementSibling;
        if (event.srcElement.localName == "img") {
            target = event.srcElement.parentNode.nextElementSibling;
        }
        if (target.style.visibility == "hidden") {
            var element = document.getElementsByClassName('content-list');
            var element1 = document.getElementsByClassName('type-top-list');
            var arr = [].slice.call(element);
            var arr1 = [].slice.call(element1);

            for (var index = 0; index < arr.length; index++) {
                var item = element.item(index);
                item.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            }
            for (var index = 0; index < arr1.length; index++) {
                var item = element1.item(index);
                item.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            }

            target.style.visibility = "visible";
            target.style.opacity = "1";
            target.style.zIndex = "2";
            target.style.transform = "translateY(0%)";
            //document.getElementById(ts).style.webkitTransform = "translateY(0%)";
            target.style.transitionDelay = "0s, 0s, 0.3s";
            //document.getElementById(ts).style.webkitTransitionDelay = "0s, 0s, 0.3s";
            target.style.transitionProperty = "all, visibility, z-index";
            //document.getElementById(ts).style.webkitTransitionProperty = "all, visibility, z-index";
            target.style.transitionDuration = "0.3s, 0s, 0s";
            //document.getElementById(ts).style.webkitTransitionDuration = "0.3s, 0s, 0s";
            //document.getElementById(ts).style.webkitTransitionTimingFunction = "ease-in-out, linear, linear";
            target.style.transitionTimingFunction = "ease-in-out, linear, linear";
        } else {
            target.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
            // document.getElementById(ts).setAttribute("style","visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        }
    }

    updateType(typeId) {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.news = [];
        if (!typeId) {
            this.selectType = 'lctlk.all';
            this.TypeId = null;
        } else {
            this.selectType = typeId.NAME;
            this.TypeId = typeId.ID;
        }
        this.loadNews();
        this.closeAllListMenu();
    }

    closeAllListMenu() {
        var element = document.getElementsByClassName('content-list');
        var element1 = document.getElementsByClassName('type-top-list');
        var arr = [].slice.call(element);
        var arr1 = [].slice.call(element1);

        for (var index = 0; index < arr.length; index++) {
            var item = element.item(index);
            item.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        }
        for (var index = 0; index < arr1.length; index++) {
            var item = element1.item(index);
            item.setAttribute("style", "visibility: hidden; opacity: 0; transform: translateY(-2em); z-index: 1; transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;");
        }
    }
}
