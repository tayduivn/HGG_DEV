import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';

import { TranslateService } from "../translate";

export abstract class Base {
    public loading: Loading;
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public translateService: TranslateService) { }
    abstract init();
    abstract canActivate();
    abstract checkConfig();

    public ionViewDidLoad() {
        //console.log('ionViewWillEnter check before');
        this.canActivate();
        this.checkConfig();
        this.init();
    }


    public showLoading() {
        if(this.loading != null) {
            this.loading.dismiss();
        }
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/images/loading.gif" />'
        });
        this.loading.present();
        setTimeout(() => {
            if(this.loading != undefined && this.loading._state != 4) {
                this.loading.dismiss();
            }
        }, 20000);
    }

    public showError(text, isloading: boolean = true) {
        if (isloading) {
            setTimeout(() => {
                if(this.loading != undefined && this.loading._state != 4) {
                    this.loading.dismiss();
                }
            });
        }

        let alert = this.alertCtrl.create({
            title: this.translateService.translate("error.title"),
            subTitle: text,
            buttons: [{text: 'OK', role: "cancel"}]
        });
        alert.present();
    }

    public addToPlanLocationList(location: any, plan: any, day: any) {
        var checkExist = false;
        day.locations.forEach(element => {
            if(element.id == location.id) {
                checkExist = true;
            }
        });
        if(checkExist == false) {
            day.locations.push(location);
            return true;
        } else {
            return false;
        }
        
    }
}
