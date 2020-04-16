import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Content } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UltilitiesService, TourGuideService } from "../../providers";
import { TranslateService } from "../../translate";
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
/**
 * Generated class for the TourGuideSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tour-guide-search',
  templateUrl: 'tour-guide-search.html',
})
export class TourGuideSearchPage extends PageBase {
  @ViewChild(Content) _content: Content;
  search = {
    name: "",
    cardcode: ""
  };
  pageIndex = 1;
  listTourGuide: any[] = [];
  listTourGuideDisplay: any[] = [];
  // friendAddress: any;
  maxPage: number;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public hotelService: HotelService,
      public searchLocationService: SearchLocationService,
      public translateService: TranslateService,
      public ShowUserInfo: ShowUserInfo,
      public UltilitiesService: UltilitiesService,
      public TourGuideService: TourGuideService, 
      private scanner: BarcodeScanner
      // private qrScanner: QRScanner
  ) {
      super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
      this.maxPage = 1;
  }

  init() {
    this.listTourGuideDisplay = [];
    // .push({
    //   image: this.changeURL("/Images/TourGuide/Import/636571321786830705_thao168160102.png"),
    //   name: "Bùi Xuân Dũng",
    //   cardnumber: "01293012903123",
    //   expired_date: "2019-03-04T00:00:00",
    //   status: "Đang hoạt động"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636570721782410192_248180045.jpg"),
    //   name: "Nguyễn Tiến Đạt",
    //   cardnumber: "01293891283921",
    //   expired_date: "2019-03-03T00:00:00",
    //   status: "Ngừng hoạt động"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636570721862640547_148180210.jpg"),
    //   name: "Hoàng Quốc Minh",
    //   cardnumber: "01293012903222",
    //   expired_date: "2019-03-02T00:00:00",
    //   status: "Đã hết hạn"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636571321786830705_thao168160102.png"),
    //   name: "Bùi Xuân Dũng",
    //   cardnumber: "01293012903123",
    //   expired_date: "2019-03-04T00:00:00",
    //   status: "Đang hoạt động"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636570721782410192_248180045.jpg"),
    //   name: "Nguyễn Tiến Đạt",
    //   cardnumber: "01293891283921",
    //   expired_date: "2019-03-03T00:00:00",
    //   status: "Ngừng hoạt động"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636570721862640547_148180210.jpg"),
    //   name: "Hoàng Quốc Minh",
    //   cardnumber: "01293012903222",
    //   expired_date: "2019-03-02T00:00:00",
    //   status: "Đã hết hạn"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636571321786830705_thao168160102.png"),
    //   name: "Bùi Xuân Dũng",
    //   cardnumber: "01293012903123",
    //   expired_date: "2019-03-04T00:00:00",
    //   status: "Đang hoạt động"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636570721782410192_248180045.jpg"),
    //   name: "Nguyễn Tiến Đạt",
    //   cardnumber: "01293891283921",
    //   expired_date: "2019-03-03T00:00:00",
    //   status: "Ngừng hoạt động"
    // },
    // {
    //   image: this.changeURL("/Images/TourGuide/Import/636570721862640547_148180210.jpg"),
    //   name: "Hoàng Quốc Minh",
    //   cardnumber: "01293012903222",
    //   expired_date: "2019-03-02T00:00:00",
    //   status: "Đã hết hạn"
    // });
  }

  searchListTourGuide() {
    this._content.scrollToTop();
    this.showLoading();
    this.listTourGuideDisplay = [];
    this.pageIndex = 1;
    this.TourGuideService.Search(this.search["name"], this.search["cardcode"], this.pageIndex).subscribe(data => {
      if(data.Code === 200) {
        this.listTourGuide = data.Result;

        this.maxPage = data.Message;

        if(this.listTourGuide.length == 0) {
          this.showError(this.translateService.translate("tgs.errorScan"));
        } else {
          this.listTourGuide.forEach(element => {
            var langs = [];
            langs = element.Langs;
            this.listTourGuideDisplay.push({
              image: this.changeURL(element.IMAGE_URL),
              langs: langs,
              name: element.NAME,
              cardnumber: element.CARD_NUMBER,
              type: element.CARD_TYPE_NAME,
              issuedby: element.ISSUED,
              experience: (Math.floor(element.TIME_EXPRIRED / 365) > 0 ? Math.floor(element.TIME_EXPRIRED / 365) + " " + this.translateService.translate("data.years") + ", " : "") + (Math.floor(element.TIME_EXPRIRED / 30 % 12)) + " " + this.translateService.translate("data.months") + ", " + (element.TIME_EXPRIRED % 30) + " " + this.translateService.translate("data.days"),
              expired_date: element.EXPIRED_DATE,
              status: element.STATUS == 1 ? "Đang hoạt động" : element.STATUS == 2 ?  "Ngừng hoạt động" : "Đã hết hạn"
            });
          });
          setTimeout(() => {
            this.loading.dismiss();
          });
        }
      }
      
    });
  }

  getMoreResult(infiniteScroll) {
    this.pageIndex += 1;
    this.TourGuideService.Search(this.search["name"], this.search["cardcode"], this.pageIndex).subscribe(data => {
      if(data.Code === 200) {
        this.listTourGuide = data.Result;

        this.maxPage = (parseInt(data.Message) / 10) + 1;

        this.listTourGuide.forEach(element => {
          var langs = [];
          langs = element.Langs;
          this.listTourGuideDisplay.push({
            image: this.changeURL(element.IMAGE_URL),
            langs: langs,
            name: element.NAME,
            cardnumber: element.CARD_NUMBER,
            expired_date: element.EXPIRED_DATE,
            status: element.STATUS == 1 ? "Đang hoạt động" : element.STATUS == 2 ?  "Ngừng hoạt động" : "Đã hết hạn"
          });
        });

        setTimeout(() => {
          infiniteScroll.complete();
        });
      } else {
        infiniteScroll.complete();
      }
    });
  }

  codescan() {
    var options = {
      prompt: "Scan you QR Code",
    }

    this.scanner.scan(options).then(barcodeData => {

      var textScan = JSON.stringify(barcodeData);

      if(barcodeData.text.indexOf("|") >= 0) {
        var substr = barcodeData.text.split("|");
        if(substr.length == 2) {

          this.search = {
            name: substr[1].toUpperCase(),
            cardcode: substr[0]
          };

          this.searchListTourGuide();

        } else {
          this.showError(this.translateService.translate("tgs.errorScan"));
        }
      } else {
        this.showError(this.translateService.translate("tgs.errorScan"));
      }
      
      
    }).catch(err => {
        console.log('Error', err);
    });
    
  }
  qrButtonClicked(event) {
    // var context = this;
    // // Optionally request the permission early
    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {

    //     if (status.authorized) {
    //       // camera permission was granted
    //       console.log("scanning");
    //       var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
    //       // start scanning
    //       let scanSub = this.qrScanner.scan().subscribe((scannedAddress: string) => {
    //         console.log('Scanned address', scannedAddress);
    //         this.friendAddress = scannedAddress;
    //         this.qrScanner.hide(); // hide camera preview
    //         scanSub.unsubscribe(); // stop scanning
    //         ionApp.style.display = "block";
    //       });

    //       // show camera preview
    //       ionApp.style.display = "none";
    //       context.qrScanner.show();
    //       setTimeout(() => {
    //         ionApp.style.display = "block";
    //         scanSub.unsubscribe(); // stop scanning
    //         context.qrScanner.hide();
    //       }, 5000);
    //       // wait for user to scan something, then the observable callback will be called

    //     } else if (status.denied) {
    //       console.log("Denied permission to access camera");
    //     } else {
    //       console.log("Something else is happening with the camera");
    //     }
    //   })
    //   .catch((e: any) => console.log('Error is', e));

  }

}
