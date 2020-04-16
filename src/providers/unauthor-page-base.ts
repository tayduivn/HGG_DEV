import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { Services } from './services';
import { Base } from './base';
import { TranslateService } from "../translate";

export abstract class UnauthorPageBase extends Base {
    public loading: Loading;
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public translate: TranslateService) {
        super(navCtrl, loadingCtrl, alertCtrl, translate);
    }

    canActivate() {

    }

    checkConfig() {

    }
}
