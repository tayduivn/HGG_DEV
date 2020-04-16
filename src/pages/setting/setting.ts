import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingLanguagePage } from './setting-language';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'setting-page',
    templateUrl: 'setting.html'
})
export class SettingPage {
    pages: Array<{ title: string, component: any, id: string }>;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.pages = [
            { title: 'menu.setting-language', component: SettingLanguagePage, id: "SettingLauguagePage" },
            { title: 'menu.setting-aboutUs', component: SettingLanguagePage, id: "SettingAboutUsPage" },
        ];

    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad RegisterPage');
    }

    openPage(p) {
        this.navCtrl.push(p.component);
    }
}
