import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';
import { MapRoutePage } from "../map-route/map-route";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { InAppBrowser } from '@ionic-native/in-app-browser';

/*
  Generated class for the EventDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-info-detail',
    templateUrl: 'page-info-detail.html'
})
export class InfoDetailPage extends PageBase {

    public item: any;
    url: string;
    type: any;
    urlSantiz: any;

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
        public UltilitiesService: UltilitiesService,
        private screenOrientation: ScreenOrientation,
        private sanitizer: DomSanitizer,
        private iab: InAppBrowser
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
        
        this.item = navParams.get("item");
        this.type = navParams.get("type");
        //console.log(this.item);
        if(this.type == 3 || this.type =="N_VIDEOS") {
            this.url = "https://www.youtube.com/embed/" + this.item.TAG;
            this.urlSantiz = sanitizer.bypassSecurityTrustResourceUrl(this.url);
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
            this.screenOrientation.unlock();
        }
        if(this.type == 1 || this.type == "N_ADVICE" || this.type == 4 || this.type == "N_HERITAGE") {
            // while(this.item.CONTENT.indexOf("&lt;") >= 0) {
            //     this.item.CONTENT = this.item.CONTENT.replace("&lt;","<");
            // }
            // while(this.item.CONTENT.indexOf("&gt;") >= 0) {
            //     this.item.CONTENT = this.item.CONTENT.replace("&gt;",">");
            // }
            // while(this.item.CONTENT.indexOf("&lt;/a&gt;") >= 0) {
            //     this.item.CONTENT = this.item.CONTENT.replace("&lt;/a&gt;","</a>");
            // }
            // while(this.item.CONTENT.indexOf("&quot;") >= 0) {
            //     this.item.CONTENT = this.item.CONTENT.replace("&quot;","\"");
            // }
			
            // if(this.item.News_Content.indexOf("<p><a") >= 0) {
            //     var href = this.item.News_Content.split("href =\"");
            //     var list_href = [];
            //     console.log(this.item.News_Content);
            //     href.forEach((element, index) => {
            //         if(index > 0) {
            //             var subhref = element.split("\"");
            //             list_href.push(subhref[0]);
            //         }
            //     });
            //     console.log(list_href);
                
            //     list_href.forEach(element => {
            //         var vt = href.indexOf(element);
            //     });
            // }
        } 
        if(this.type != 'N_VIDEOS') {
            // if(this.item.CONTENT.indexOf("<img ")) {

            //     var str = this.item.CONTENT.split("src=\"");
            //     var new_str = "";
            //     str.forEach((element, index) => {
            //         if(index > 0) {
            //             var substr = element.split("\"");
            //             var src = this.changeURL(substr[0]);
            //             element = src + "\"";
                        
            //             var str_continous = " ";

            //             substr.forEach((element1, index1) => {
            //                 if(index1 != 0) {
            //                     if(index1 < substr.length - 1) {
            //                         str_continous += element1 + "\"";
            //                     } else {
            //                         str_continous += element1;
            //                     }
            //                 } 
            //             });

            //             element += str_continous;
            //             new_str += " src=\"" + element;
            //         } else {
            //             new_str += element;
            //         }
            //     });
            //     this.item.CONTENT = new_str;
            // }
        }
    }

    openLink(event) {
        event.preventDefault();
        if(event.target.localName == "a") {
            var src = event.target.href;
            window.open(src, '_system', 'location=yes');
        }
    }

    init() {
        
    }

    ionViewDidLeave() {
        if(this.type == 'N_VIDEOS') {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.screenOrientation.unlock();
        }
        
    }

}

