import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Slides, ModalController, Platform, } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';

import { AuthService, PageBase, EventService, UltilitiesService, SearchLocationService, WeatherService, ShoppingService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

import { EventShowPage } from "../event-show/event-show";
import { EventDetailPage } from "../event-detail/event-detail";
import { LocationLookupPage } from "../location-lookup/location-lookup";
import { UserPage } from "../user/user";
import { LookUpPage } from "../look-up/look-up";
import { PlanPage } from "../plan/plan";
import { PlanV2Page } from "../plan-v2/plan-v2";
import { MapPage } from "../map/map";
import { HotelDetailPage } from "../hotel-detail/hotel-detail";
import { RestaurantDetailPage } from "../restaurant-detail/restaurant-detail";
import { EntertainmentDetailPage } from "../entertainment-detail/entertainment-detail";
import { SightSeeingPage } from "../sight-seeing/sight-seeing";
import { UtilityTypeListPage } from "../utility-type-list/utility-type-list";
import { ShoppingListPage } from "../shopping/shopping";
import { QuickBookingPage } from "../quick-booking/quick-booking";
import { WeatherPage } from "../weather/weather";
import { UserComplaintPage } from "../user-complaint/user-complaint";
import { ShopDetailPage } from "../shop-detail/shop-detail";
import { ContactPage } from '../contact/contact';

import { News } from '../../model';
import { LocationSearch } from '../../model/LocationSearch';
import { LocationSearch_1 } from '../../model/LocationSearch_1';
import _ from 'lodash';
import moment from 'moment';
import { LoginPage } from "../login/login";
import { ExchangeRatePage } from "../exchange-rate/exchange-rate";
import { TourGuideSearchPage } from '../tour-guide-search/tour-guide-search';
import { DetailPromotionPage } from '../promotion-modal/promotion-modal';
import { LookUpEntertainmentNightlifePage } from '../look-up-entertainment-nightlife/look-up-entertainment-nightlife';

declare var Swiper;

/*
  Generated class for the OverView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-over-view',
  templateUrl: 'over-view.html'
})
export class OverViewPage extends PageBase {

  currentUser: any;
  listTGP_Event: News[];
  locationID: number;
  id: number;

  listPromotion: LocationSearch_1[];
  listTopBooking: LocationSearch_1[];
  loaded: boolean;
  stringWeather: string;

  hotLine: string;

  listLang: any[];
  top: number = 5;
  // swiper0: any; swiper: any; swiper2: any;

  numberPerView: any;

  @ViewChild("slides1") slides1: Slides;
  @ViewChild("slides2") slides2: Slides;
  @ViewChild("slides3") slides3: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public showUserInfo: ShowUserInfo,
    public eventService: EventService,
    public loadingCtrl: LoadingController,
    private _translate: TranslateService,
    public alertCtrl: AlertController,
    public ultilitiesService: UltilitiesService,
    public searchLocationService: SearchLocationService,
    public translateService: TranslateService,
    public weatherService: WeatherService,
    public modalCtrl: ModalController,
    public shoppingService: ShoppingService,
    private platform: Platform,
    public appAvailability: AppAvailability
  ) {
    super(navCtrl, loadingCtrl, alertCtrl, translateService, showUserInfo, ultilitiesService);
    this.getListTopEvent();
    this.getPromotion();
    this.getTopBooking();

    var width = window.innerWidth;

    if (width < 768) {
      this.numberPerView = 2.2;
    } else if (width >= 768 && width < 1024) {
      this.numberPerView = 2.7;
    } else if (width >= 1024 && width < 1366) {
      this.numberPerView = 3.2;
    } else {
      this.numberPerView = 3.7;
    }
    console.log(this.numberPerView);
  }

  ionViewWillEnter() {
    if (this.slides1 != null) {
      // this.slides1.slidesPerView = this.numberPerView;
      this.slides1.resize();
      this.slides1.update();
      this.slides1.slideTo(0);
    }
    if (this.slides2 != null) {
      // this.slides2.slidesPerView = this.numberPerView;
      this.slides2.resize();
      this.slides2.update();
    }
    if (this.slides3 != null) {
      // this.slides3.slidesPerView = this.numberPerView;
      this.slides3.resize();
      this.slides3.update();
    }
  }

  init() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        var width = window.innerWidth;
        console.log(width);
        if (width < 768) {
          this.numberPerView = 2.2;
        } else if (width >= 768 && width < 1024) {
          this.numberPerView = 2.7;
        } else if (width >= 1024 && width < 1366) {
          this.numberPerView = 3.2;
        } else {
          this.numberPerView = 3.7;
        }
        console.log(this.numberPerView);
        var width = window.innerWidth;
        if (this.slides2 != null) {
          this.slides2._slides.forEach(element => {
            var e = element.firstElementChild;
            if (width < 768) {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w22');
            } else if (width >= 768 && width < 1024) {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w27');
            } else if (width >= 1024 && width < 1366) {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w32');
            } else {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w37');
            }

          });
        }
        if (this.slides3 != null) {
          this.slides3._slides.forEach(element => {
            var e = element.firstElementChild;
            if (width < 768) {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w22');
            } else if (width >= 768 && width < 1024) {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w27');
            } else if (width >= 1024 && width < 1366) {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w32');
            } else {
              e.classList.remove('w22');
              e.classList.remove('w27');
              e.classList.remove('w32');
              e.classList.remove('w37');
              e.classList.add('w37');
            }

          });
        }
        if (this.slides1 != null) {
          // this.slides1.slidesPerView = this.numberPerView;
          this.slides1.resize();
          this.slides1.update();
        }
        if (this.slides2 != null) {
          this.slides2.slidesPerView = this.numberPerView;
          this.slides2.resize();
          this.slides2.update();
        }
        if (this.slides3 != null) {
          this.slides3.slidesPerView = this.numberPerView;
          this.slides3.resize();
          this.slides3.update();
        }
      }, 500);
    });


  }

  getCurrentWeather() {
    this.weatherService.getCurrentWeather().subscribe(
      data => {
        if (data.list != null && data.list.length > 0 && data.list[0].weather != null && data.list[0].weather.length > 0 && data.list[0].weather[0].icon != null && data.list[0].main != null) {
          this.stringWeather = '<img width="30" height="30" src="assets/images/weather/' + data.list[0].weather[0].icon + '.png" /> <span>' + data.list[0].main.temp_min.toFixed(0) + '&deg;C</span>';
        } else {
          this.stringWeather = '';
        }
      },
      error => {
        // this.showError(this.translateService.translate("network.error"));
      }
    );
  }

  gotoUtilitiesWeather() {
    this.navCtrl.push(WeatherPage);
  }

  getListTopEvent() {

    this.listTGP_Event = [];
    this.eventService.GetListTopNews(this.top).subscribe(
      data => {
        if (data.Code === 200) {
          this.listTGP_Event = _.concat(this.listTGP_Event, data.Result);
          //let data1 = moment().format('YYYYMMDD');
          // console.log("a");
          // console.log(this.listTGP_Event);

          // var swiper0 = new Swiper('.swiper-container-0', {
          //     // pagination: '.swiper-pagination',
          //     // nextButton: '.swiper-button-next',
          //     // prevButton: '.swiper-button-prev',
          //     paginationClickable: true,
          //     spaceBetween: 0,
          //     centeredSlides: true,
          //     autoplay: 4000,
          //     autoplayDisableOnInteraction: false
          // });

          // this.listTGP_Event.forEach(itemP => {
          //     var html = "";

          //     html += '<div class="swiper-slide swiper-slide-0">';
          //     html += '<div class="info">';
          //     html += '<img src="' + this.changeURL(itemP.IMAGE_URL) + '" data-id="' + itemP.ID + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     html += '<div class="event-info"><h2 class="event-name" data-id="' + itemP.ID + '">' + itemP.TITLE + '</h2></div>';
          //     html += '</div>';
          //     html += '</div>';

          //     try {
          //         swiper0.appendSlide(html);
          //     } catch (ex) {
          //         swiper0[swiper0.length - 1].appendSlide(html);
          //     }
          // });

          setTimeout(() => {
            this.getHotLineNumber();
            this.getCurrentWeather();
          });
        } else if (data.Code != 404) {
          this.showError(data.Message)
        }
      },
      error => {
        // this.showError(this.translateService.translate("network.error"), false);
      }
    );
  }

  onClickTopEvent(event) {
    if (event.srcElement.attributes["data-id"] != undefined) {
      var dataID = event.srcElement.attributes["data-id"].value;

      this.showDetailTGP_Event(dataID);
    }
  }

  getPromotion() {
    this.listPromotion = [];
    this.ultilitiesService.GetPromotionList().subscribe(
      data => {
        if (data.Code === 200) {
          this.listPromotion = _.concat(this.listPromotion, data.Result);

          //let data1 = moment().format('YYYYMMDD');

          // var swiper = new Swiper('.swiper-container-2', {
          //     // pagination: '.swiper-pagination',
          //     slidesPerView: 'auto',
          //     paginationClickable: true,
          //     spaceBetween: 5
          // });

          // // console.log(this.listPromotion);
          // this.listPromotion.forEach((itemP:any) => {
          //     var html = "";

          //     html += '<div class="swiper-slide swiper-slide-2">';
          //     html += '<div class="info">';
          //     if (itemP.IMAGE != null && itemP.IMAGE != "") {
          //         html += '<img src="' + this.changeURL(itemP.IMAGE) + '" data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     } else if (itemP.IMAGE != null && itemP.IMAGE != "") {
          //         html += '<img src="' + this.changeURL(itemP.IMAGE) + '" data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     } else if ((itemP.IMAGE == null || itemP.IMAGE == "") && (itemP.IMAGE == null || itemP.IMAGE == "")) {
          //         html += '<img src="assets/iconImages/noimage.png" data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     }
          //     html += '<img class="detailPromotion" data-promotion-type="'+ itemP.CODE +'" data-promotion-id="'+ itemP.ID +'" src="assets/images/icon-design/discount.png" />';
          //     html += '<h5 data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '">' + itemP.NAME + '</h5>';
          //     html += '</div>';
          //     html += '</div>';

          //     try {
          //         swiper.appendSlide(html);
          //     } catch (ex) {
          //         swiper[swiper.length - 1].appendSlide(html);
          //     }

          // });
        } else if (data.Code != 404) {
          this.showError(data.Message);
        }
      },
      error => {
        // this.showError(this.translateService.translate("network.error"), false);
      }
    );
  }

  // ngAfterViewInit() {
  //     var that = this;
  //     setTimeout(() => {
  //         var eventL = document.querySelectorAll('.detailPromotion');
  //         for (var i = 0; i < eventL.length; i++) {
  //             var value = eventL[i].attributes["data-id"].value;
  //             eventL[i].addEventListener('click', (e:Event) => that.onClickDetail(value));
  //         }
  //     }, 1000);

  // }

  // onClickDetail(i) {
  //     alert(i)
  // }

  getTopBooking() {
    this.listTopBooking = [];
    this.ultilitiesService.GetTopLike().subscribe(
      data => {
        if (data.Code === 200) {
          this.listTopBooking = _.concat(this.listTopBooking, data.Result);
          //let data1 = moment().format('YYYYMMDD');

          // var galleryTop = new Swiper('.gallery-top', {
          //     nextButton: '.swiper-button-next',
          //     prevButton: '.swiper-button-prev',
          //     spaceBetween: 5,
          // });
          // var galleryThumbs = new Swiper('.gallery-thumbs', {
          //     spaceBetween: 5,
          //     centeredSlides: true,
          //     slidesPerView: 'auto',
          //     touchRatio: 0.2,
          //     slideToClickedSlide: true
          // });
          // galleryTop.params.control = galleryThumbs;
          // galleryThumbs.params.control = galleryTop;


          // var swiper2 = new Swiper('.swiper-container-3', {
          //     // pagination: '.swiper-pagination',
          //     slidesPerView: 'auto',
          //     paginationClickable: true,
          //     spaceBetween: 5
          // });

          // // console.log(this.listTopBooking);
          // this.listTopBooking.forEach(itemP => {
          //     var html = "";

          //     html += '<div class="swiper-slide swiper-slide-3">';
          //     html += '<div class="info">';
          //     if (itemP.IMAGE != null && itemP.IMAGE != "") {
          //         html += '<img src="' + this.changeURL(itemP.IMAGE) + '" data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     } else if (itemP.IMAGE != null && itemP.IMAGE != "") {
          //         html += '<img src="' + this.changeURL(itemP.IMAGE) + '" data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     } else if ((itemP.IMAGE == null || itemP.IMAGE == "") && (itemP.IMAGE == null || itemP.IMAGE == "")) {
          //         html += '<img src="assets/iconImages/noimage.png" data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '" onerror="this.src=\'assets/iconImages/noimage.png\'" />';
          //     }
          //     html += '<h5 data-id="' + itemP.ID + '" data-type="' + itemP.CODE + '">' + itemP.NAME + '</h5>';
          //     html += '</div>';
          //     html += '</div>';

          //     try {
          //         swiper2.appendSlide(html);
          //     } catch (ex) {
          //         swiper2[swiper2.length - 1].appendSlide(html);
          //     }

          // });

          setTimeout(() => {
            // console.log();
            var width = window.innerWidth;
            if (this.slides2 != null) {
              this.slides2._slides.forEach(element => {
                var e = element.firstElementChild;
                if (width < 768) {
                  e.classList.add('w22');
                } else if (width >= 768 && width < 1024) {
                  e.classList.add('w27');
                } else if (width >= 1024 && width < 1366) {
                  e.classList.add('w32');
                } else {
                  e.classList.add('w37');
                }

              });
            }

            if (this.slides3 != null) {
              this.slides3._slides.forEach(element => {
                var e = element.firstElementChild;
                if (width < 768) {
                  e.classList.add('w22');
                } else if (width >= 768 && width < 1024) {
                  e.classList.add('w27');
                } else if (width >= 1024 && width < 1366) {
                  e.classList.add('w32');
                } else {
                  e.classList.add('w37');
                }

              });
            }
          }, 1000);

        } else if (data.Code != 404) {
          this.showError(data.Message)
        }
      },
      error => {
        this.showError(this.translateService.translate("network.error"));
      }
    );
  }

  onClickTopBooking(event) {
    if (event.srcElement.attributes["data-id"] != undefined && event.srcElement.attributes["data-type"] != undefined) {
      var dataId = event.srcElement.attributes["data-id"].value;
      var dataType = event.srcElement.attributes["data-type"].value;

      this.gotoDetail(dataId, dataType);
    } else if (event.srcElement.attributes["data-promotion-id"] != undefined && event.srcElement.attributes["data-promotion-type"] != undefined) {
      var data_promotion_id = event.srcElement.attributes["data-promotion-id"].value;
      var data_promotion_type = event.srcElement.attributes["data-promotion-type"].value;

      var promotion = this.listPromotion.find(x => x.ID == data_promotion_id && x.CODE == data_promotion_type);

      let profileModal = this.modalCtrl.create(DetailPromotionPage, { data_promotion: promotion.PROMOTION });
      profileModal.present();
    }
  }

  showDetailTGP_Event(eventID) {
    this.listTGP_Event.forEach(element => {
      if (element.ID == eventID) {
        this.eventService.GetDetailH(element.ID, element.CODE).subscribe(data => {
          if (data.Code === 200) {
            this.navCtrl.push(EventDetailPage, { item: data.Result });
          }
        });
      }
    });
  }

  gotoDetail(Location_Id, Location_Type) {
    if (Location_Type == "HOTEL") {
      this.navCtrl.push(HotelDetailPage, { item: Location_Id, code: Location_Type });
    } else if (Location_Type == "RESTAURANT") {
      this.navCtrl.push(RestaurantDetailPage, { item: Location_Id, code: Location_Type });
    } else if (Location_Type == "TPLACE") {
      this.navCtrl.push(SightSeeingPage, { item: Location_Id, code: Location_Type });
    } else if (Location_Type == "ENTERTAINMENT") {
      this.navCtrl.push(EntertainmentDetailPage, { item: Location_Id, code: Location_Type });
    } else if (Location_Type == "SHOP") {
      this.shoppingService.GetShopDetailH(Location_Id, Location_Type).subscribe(data => {
        if (data.Code === 200) {
          let shop = data.Result;
          this.navCtrl.push(ShopDetailPage, { item: shop });
        }

      });
    }
  }

  findAllLocation(ts: string) {
    this.navCtrl.push(LookUpPage, { data: ts });
  }
  gotoPageEntertainment(ts: string) {
    this.navCtrl.push(LookUpEntertainmentNightlifePage, { data: ts });
  }
  gotoUtilitiesPage() {
    this.navCtrl.push(UtilityTypeListPage);
  }
  gotoComplaint() {
    this.checkToken().then(data => {
      if (data == true) {
        this.navCtrl.push(UserComplaintPage);
      } else {
        let modal = this.modalCtrl.create(LoginPage);
        modal.present();
      }
    });
  }
  gotoListShopPage() {
    this.navCtrl.push(ShoppingListPage);
  }

  clickSearch() {
    this.navCtrl.push(LocationLookupPage, { searchType: null });
  }

  getImgBackground(item) {
    // console.log('url(' + this.changeURL(item) + ')');
    return 'url(' + this.changeURL(item) + ')';
  }

  gotoQuickbooking() {
    this.navCtrl.push(QuickBookingPage);
  }
  gotoContact() {
    this.navCtrl.push(ContactPage);
  }
  getHotLineNumber() {
    this.hotLine = "";
    this.ultilitiesService.GetHotLineNumber().subscribe(data => {
      if (data.Code == 200) {
        this.hotLine = data.Result;
      }
    }, error => {
      this.showError(this.translateService.translate("network.error"));
    });
  }

  viewExchangeRate() {
    this.navCtrl.push(ExchangeRatePage);
  }

  // openFanPage() {
  //     this.UltilitiesService.GetFanPage().subscribe(data => {
  //       console.log('data'+data.Result);
  //         if (data.Code == 200) {

  //             let app = "";
  //             if (this.platform.is('ios')) {
  //                 app = 'fb://profile/' + data.Result;
  //             } else if (this.platform.is('android')) {
  //                 app = 'fb://page/' + data.Result;
  //             }
  //             window.open(app, '_system', 'location=no');
  //         }

  //     });
  // }

  openFanPage() {
  this.appAvailability.check('com.facebook.katana').then(
    (yes: boolean) => {window.open(' fb://page/' + '2180587712232728', '_system', 'location=no');
    console.log('facebook is valid');
  },
    (no: boolean) => {window.open('https://www.facebook.com/checkinhagiangofficial/', '_system', 'location=no');
    console.log('facebook is not valid');}
  );
  console.log("log:",this.appAvailability.check('com.facebook.katana'));
  }
}
