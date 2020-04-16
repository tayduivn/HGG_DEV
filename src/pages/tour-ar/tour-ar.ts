import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PageBase, HotelService, SearchLocationService, ShowUserInfo, UltilitiesService } from "../../providers/index";
import { TranslateService } from "../../translate/index";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

/**
 * Generated class for the TourArPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-tour-ar',
  templateUrl: 'tour-ar.html',
})
export class TourArPage extends PageBase {
  
  url3d: string;
  url: SafeResourceUrl;


  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public hotelService: HotelService,
      public searchLocationService: SearchLocationService,
      public translateService: TranslateService,
      public ShowUserInfo: ShowUserInfo,
      public UltilitiesService: UltilitiesService, 
      private screenOrientation: ScreenOrientation,
      private sanitizer: DomSanitizer,
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);

      this.url3d = this.navParams.get("url3d");
      this.url = sanitizer.bypassSecurityTrustResourceUrl(this.url3d);
      
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

      // allow user rotate
      this.screenOrientation.unlock();

      // detect orientation changes
      // this.screenOrientation.onChange().subscribe(
      //   () => {
      //       console.log("Orientation Changed");
      //   }
      // );

      setTimeout(() => {
        document.getElementById("ar-loading").style.display = "none";
      }, 16000);
  }

  init() {
    this.hidingItem();
  }

  ionViewDidLeave() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.screenOrientation.unlock();
  }

  hidingItem() {

  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
