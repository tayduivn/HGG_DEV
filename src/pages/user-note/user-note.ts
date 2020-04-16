import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Events } from 'ionic-angular';
import { PageBase, HotelService, SearchLocationService, ShowUserInfo, UltilitiesService } from "../../providers/index";
import { TranslateService } from "../../translate/index";

/**
 * Generated class for the UserNotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-user-note',
    templateUrl: 'user-note.html',
})
export class UserNotePage extends PageBase {

    name: string;
    id: any;
    type: any;
    content: any;
    location_type: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService,
        public toastCtrl: ToastController,
        private events: Events
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.id = this.navParams.get("objectId");
        this.type = this.navParams.get("typeId");
        this.location_type = this.navParams.get("locationType");
    }

    init() {
        this.loadContent();
    }

    loadContent() {
        this.UltilitiesService.GetUserNote(this.id, this.type, this.location_type).subscribe(data => {
            if (data.Code === 200) {
                if (data.Result != null) {
                    this.content = data.Result.Content;
                } else {
                    this.content = "";
                }
            }
        });
    }

    saveNote() {
        this.UltilitiesService.SaveUserNote(this.id, this.type, this.content, this.location_type).subscribe(data => {
            if (data.Code === 200) {
                let toast = this.toastCtrl.create({
                    message: "Lưu ghi chú thành công",
                    position: "middle",
                    duration: 3000
                });
                toast.present();
                this.navCtrl.pop();
            }
        });
    }

    nullNote() {
        this.UltilitiesService.SaveUserNote(this.id, this.type, null, this.location_type).subscribe(data => {
            if (data.Code === 200) {
                let toast = this.toastCtrl.create({
                    message: "Xóa ghi chú thành công",
                    position: "middle",
                    duration: 3000
                });
                toast.present();
                this.navCtrl.pop().then(() => {
                    /// Trigger custom event and pass data to be send back
                    this.events.publish('back-load-list');
                });;
            }
        });
    }

}
