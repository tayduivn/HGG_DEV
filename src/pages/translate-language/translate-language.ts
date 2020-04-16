import { Component } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { SearchLocationService, PageBase, HotelService, ShowUserInfo, UnauthorPageBase } from "../../providers";
import { TranslateService } from "../../translate";

import { Http, Headers } from '@angular/http';
import { SpeechRecognition, SpeechRecognitionListeningOptionsAndroid, SpeechRecognitionListeningOptionsIOS } from '@ionic-native/speech-recognition'

/**
 * Generated class for the TranslateLanguagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-translate-language',
    templateUrl: 'translate-language.html',
})
export class TranslateLanguagePage extends UnauthorPageBase {
    lang_Click: any;
    current_Click: any;
    chooseItemLang: any; //ngon ngu dang bam active
    languages: Array<{ ID: string, Code: string, CodeIOS: string, Name: string }> = [];
    lang_From: any;
    lang_To: any;
    public formData: FormGroup;
    androidOption: SpeechRecognitionListeningOptionsAndroid;
    iosOption: SpeechRecognitionListeningOptionsIOS;
    clicking: any;
    input: string;
    ouput: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hotelService: HotelService,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        private speech: SpeechRecognition,
        public http: Http,
        public formBuilder: FormBuilder,
        public plt: Platform

    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService);
        this.languages = [
            { ID: "vi", Code: "vi-VN", CodeIOS: "vi-VN", Name: "Tiếng Việt" },// Name: "lang.viet" },
            { ID: "en", Code: "en-US", CodeIOS: "en-US", Name: "Tiếng Anh" },//Name: "lang.anh" },
            { ID: "zh-CN", Code: "cmn-Hans-CN", CodeIOS: "zh-CN", Name: "Tiếng Trung" },//Name: "lang.trung" },
            { ID: "fr", Code: "fr-FR", CodeIOS: "fr-FR", Name: "Tiếng Pháp" },//Name: "lang.phap" },
            { ID: "ja", Code: "ja-JP", CodeIOS: "ja-JP", Name: "Tiếng Nhật" },// Name: "lang.nhat" },
            { ID: "ru", Code: "ru-RU", CodeIOS: "ru-RU", Name: "Tiếng Nga" },//Name: "lang.nga" },
            { ID: "ko", Code: "ko-KR", CodeIOS: "ko-KR", Name: "Tiếng Hàn" },// Name: "lang.han" },
        ];

        this.lang_From = this.languages[0];
        this.lang_To = this.languages[1];

        this.formData = this.formBuilder.group({
            Input: ["", Validators.required],
            Output: [""],
        });

        this.resetPopup();
    }

    resetPopup() {
        this.lang_Click = null;
        this.current_Click = null;
        this.chooseItemLang = null;
        switch (this.current_Click) {
            case "from":
                this.lang_From = this.languages[0];
                break;
            case "to":
                this.lang_To = this.languages[1];
                break;
        }
        this.clicking = null;
    }

    init() {

    }

    preClose() {
        document.getElementById("popup-background").style.display = "none";
        document.getElementById("popup").style.display = "none";
    }

    closePopup() {
        this.preClose();
        this.resetPopup();
    }
    openPopup() {
        document.getElementById("popup-background").style.display = "block";
        document.getElementById("popup").style.display = "block";
    }

    chooseItem(ts) {
        this.clicking = ts;
        switch (this.current_Click) {
            case "from":
                this.lang_From = ts;
                break;
            case "to":
                this.lang_To = ts;
                break;
        }
        this.closePopup();
    }

    revert() {
        var temp = this.lang_From;
        this.lang_From = this.lang_To;
        this.lang_To = temp;
    }

    chooseLanguage() {
        this.preClose();
    }

    //find that choosing lang from or lang to
    click_Lang(ts) {
        this.current_Click = ts;
        this.openPopup();
    }

    tranlate(data: any) {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + this.lang_From.ID + '&tl=' + this.lang_To.ID + '&dt=t&q=' + data;
        this.http.get(url).subscribe((data1) => {
            if (data1 != null) {
                var rs = JSON.parse(data1['_body']);
                //console.log(rs[0][0][0]);
                //this.translate = rs[0][0][0];
                this.ouput = rs[0][0][0];
                this.formData.controls["Output"].setValue(rs[0][0][0]);

            }
        });
    }

    record() {
        this.formData = this.formBuilder.group({
            Input: ["", Validators.required],
            Output: [""],
        });
        this.speech.requestPermission();
        var option: any;
        if (this.plt.is('ios')) {
            this.iosOption = {
                language: this.lang_From.CodeIOS,
                showPartial: false
            }
            option = this.iosOption;
        } else {
            this.androidOption = {
                language: this.lang_From.Code
            }
            option = this.androidOption;
        }
        this.speech.isRecognitionAvailable()
            .then((available: boolean) => {
                if (!available) {
                    this.speech.stopListening();
                }
            });
        this.speech.startListening(option).subscribe(data =>
        // lay nhan dien am thanh va xu ly ke qua
        {
            if (data.length > 0) {
                //this.input = data[0];
                this.formData.controls["Input"].setValue(data[0]);
                this.tranlate(data[0]);
            }
        }

        )



        if (this.plt.is('ios')) {
            // this.speech.stopListening().catch(data=>{
            //     console.log(JSON.stringify(data));
            // })

            //this.speech.startListening();
            let _alert = this.alertCtrl.create(
                {
                    title: '',
                    message: this.translateService.translate('recognitioning'),// 
                    buttons: [{
                        text: this.translateService.translate('recognitioning.stop'),
                        handler: () => {
                            this.speech.stopListening();
                        }
                    }]
                }
            );
            _alert.present();
        }
    }
    translateLanguage() {
        if (this.formData.valid)
            this.tranlate(this.formData.value.Input);
    }
}
