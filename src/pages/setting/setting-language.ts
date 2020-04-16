import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '../../translate';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'setting-language-page',
    templateUrl: 'setting-language.html'
})
export class SettingLanguagePage {
    pages: Array<{ title: string, id: string }>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private _translate: TranslateService) {
        this.pages = [
            { title: 'Tiếng Việt', id: "vi" },
            { title: 'English', id: "en" },
        ];
    }

    ionViewDidLoad() {
    }

    openPage(p) {
        this._translate.setDefaultLang(p.id);
        this._translate.enableFallback(true);
        this.selectLang(p.id);
    }

    subscribeToLangChanged() {
        return this._translate.onLangChanged.subscribe((x: any) => this.refreshText());
    }

    refreshText() {
    }

    selectLang(lang: string) {
        localStorage.setItem('currentLangauge', lang);
        this._translate.use(lang);
        this.refreshText();
    }
}
