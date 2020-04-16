import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, ToastController } from 'ionic-angular';

import { AuthService, PageBase, EventService, HobbyService, UltilitiesService, SearchLocationService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';
import { MapRoutePage } from "../map-route/map-route";
import { PlanChoicePage } from "../plan-choice/plan-choice";

import { News } from '../../model';
import { UserRateDetailPage } from "../user-rate/user-rate";
import { LoginPage } from "../login/login";
import { UserImagesPage } from "../user-images/user-images";
import { UserNotePage } from "../user-note/user-note";

/*
  Generated class for the EventDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-event-detail',
    templateUrl: 'event-detail.html'
})
export class EventDetailPage extends PageBase {
    @ViewChild('promoSlider') mapElement: ElementRef;
    current_event: any;
    currentUser: any;
    time: any;
    arrowInUse: any;
    event_location: any;
    bookId: number;
    newsId: number;
    newsCode: string;
    obj: any;

    listImage: any[] =[];

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
        public modalCtrl: ModalController,
        public searchLocationService: SearchLocationService,
        public toastCtrl: ToastController,
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
        this.showLoading();
        this.current_event = this.navParams.get('item');
        this.obj = this.navParams.get('obj');
        //console.log(this.current_event);
        this.time = 0;
        this.arrowInUse = "arrow-dropdown-circle";
        this.loading.dismiss();
        
    }

    ionViewDidLeave() {
        if(this.obj != undefined) {
            this.obj.book_id = this.bookId;
        }
    }

    init() {
        this.checkToken().then(data => {
            if (data) {
                this.checkBookMark(this.current_event.ID, this.current_event.CODE);
            } else {
                this.bookId = 0;
                this.newsId = 0;
                this.newsCode = "";
            }
        });

        if(this.current_event.NEWS_IMAGE != null && this.current_event.NEWS_IMAGE.length > 0) {
            this.current_event.NEWS_IMAGE.forEach(element => {
                this.listImage.push(this.changeURL(element.IMAGE_URL));
            });
        } else {
            this.listImage.push("assets/images/noimage.png");
        }
    }
    goBack(): void {
        this.navCtrl.pop();
    }

    addToPlan() {
        var img = "assets/images/noimage.png";
        if(this.current_event.NEWS_IMAGE.length > 0 || this.current_event != null) {
            img = this.current_event.NEWS_IMAGE[0].IMAGE_URL;
        }

        //console.log(this.current_event);

        var data = {
            id: this.current_event.ID,
            imgURL: img,
            name: this.current_event.TITLE,
            address: this.current_event.ADDRESS,
            phonenumber: "",
            website: "",
            email: "",
            aboutus: this.current_event.CONTENT,
            locations: this.current_event.GEO_LOCATION,
            type: 0,
            nation: this.current_event.NATION_ID,
            province: this.current_event.PROVINCE_ID,
            city: this.current_event.CITY_ID,
        };
        this.navCtrl.push(PlanChoicePage, {location: data});
    }

    showDirection() {
        this.navCtrl.push(MapRoutePage, { locations: this.current_event.GEO_LOCATION, type: "event" });
    }

    gotoRate() {
        this.checkToken().then(data => {
            if(data) {
                this.navCtrl.push(UserRateDetailPage, { objectId: this.current_event.ID, typeId: this.current_event.CODE, type: "NEWS" });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }

    gotoUserImage() {
        this.navCtrl.push(UserImagesPage, { objectId: this.current_event.ID, typeId: 7, name: this.current_event.TITLE });
    }

    gotoLocation() {
        this.navCtrl.push(MapRoutePage, { locations: this.current_event.GEO_LOCATION, type: "event" });
    }
    note() {
        this.checkToken().then(data => {
            if(data) {
                // this.navCtrl.push(UserNotePage, { objectId: this.id, typeId: 2, name: this.restaurant.name });
                this.navCtrl.push(UserNotePage, { objectId: this.current_event.ID, typeId: this.current_event.CODE, name: "", locationType: "NEWS" });
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
    }

    toggleSaveWishList() {
        this.checkToken().then(data => {
            if(data) {
                if(this.bookId == 0) {
                    this.searchLocationService.saveWishListH(this.current_event.ID, this.current_event.CODE, "EVENTS").subscribe(
                        data => { 
                            if (data.Code === 200) {
                                this.bookId = data.Result.ID;
                                this.newsId = data.Result.NEWS_ID;
                                this.newsCode = data.Result.NEWS_CODE;
                                this.current_event.COUNT_LIKE = this.current_event.COUNT_LIKE + 1;
                                this.showToastWithCloseButton("Thêm yêu thích");
                            } else {
                                this.checkBookMark(this.current_event.ID, this.current_event.CODE);
                            }
                        }, 
                        error => {
                            this.showError(this.translateService.translate("network.error"), false);
                        }
                    );
                } else {
                   this.searchLocationService.removeSaveWishListH(this.newsId, this.newsCode, "EVENTS").subscribe(    
                        data => {
                            if (data.Code === 200) {
                                this.bookId = 0;
                                this.current_event.COUNT_LIKE = this.current_event.COUNT_LIKE - 1;
                                this.showToastWithCloseButton("Bỏ yêu thích");
                            } else {
                                this.checkBookMark(this.current_event.ID, this.current_event.CODE);
                            }
                        },
                        error => {
                            this.showError(this.translateService.translate("network.error"), false);
                        }
                    );
                }
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
        
        return false;
    }

    showToastWithCloseButton(message: string) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 1,
            showCloseButton: false,
            position: 'middle'
        });
        toast.present();
    }

    checkBookMark(resId, code) {
        this.eventService.checkBookMark(resId,code,"EVENTS").subscribe(
            data => {
                if (data.Code === 200) {
                    if (data.Result == null) {
                        this.bookId = 0;
                        this.newsId = 0;
                        this.newsCode = "";
                    } else {
                        this.bookId = data.Result[0].ID;
                        this.newsId = data.Result[0].NEWS_ID;
                        this.newsCode = data.Result[0].NEWS_CODE;
                    }
                } else {
                    this.showError(data.Message);
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            }
        );
    }
}
