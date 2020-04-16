import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService, EventService } from "../../providers";
import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';
import { InfoDetailPage } from "../page-info-detail/page-info-detail";
/**
 * Generated class for the AdviceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-advice-list',
  templateUrl: 'advice-list.html',
})
export class AdviceListPage extends PageBase {

  listAdvice: any[] = [];
  type : any;
  title : any;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public hotelService: HotelService,
      public searchLocationService: SearchLocationService,
      public translateService: TranslateService,
      public ShowUserInfo: ShowUserInfo,
      public UltilitiesService: UltilitiesService,
      public eventService: EventService
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);

      this.type = this.navParams.get("item");
      //console.log(this.navParams.get("item"));
      this.title = this.getTitle();
  }

  init() {
    this.getAdviceList();
  }

  getTitle() {
    
    switch(this.type) {
      case "N_ADVICE":
        return this.translateService.translate("advice-list.title-1");
      case "N_POEMS":
        return this.translateService.translate("advice-list.title-2");
      case "N_HERITAGE":
        return this.translateService.translate("advice-list.title-3");
      case "N_VIDEOS":
        return this.translateService.translate("advice-list.title-4");
    }
  }

  getAdviceList() {
    this.listAdvice = [];
    this.eventService.GetListSeparatedLC(this.type).subscribe(data => {
      if(data.Code === 200) {
        
        // var stt= [1,2,3,4,5,6,7];
        data.Result.forEach(element => {
          var randstt = this.changeURL(element.IMAGE_URL);
          if(this.type == "N_VIDEOS") {
            // if(element.CONTENT.indexOf("<p>") >= 0) {
            //   element.CONTENT = element.CONTENT.replace("<p>","");
            //   element.CONTENT = element.CONTENT.replace("</p>","");
            // }
          }
          this.listAdvice.push({
            CONTENT: element.CONTENT,
            TITLE: element.TITLE,
            stt: randstt,
            TAG: element.TAG
          });
        });

      }
    });
  }

  gotoAdviceInfo(item) {
    this.navCtrl.push(InfoDetailPage, {item: item, type: this.type});
  }

  changeType(ts) {
    this.type = ts;
    this.title = this.getTitle();
    this.getAdviceList();
  }

}
