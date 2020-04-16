import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { ActionSheetController } from 'ionic-angular';
import { PageBase, Services, ShowUserInfo, UltilitiesService } from '../../providers';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from "../../translate";

import { CameraChossenPage } from "../camera-chossen/camera-chossen";

@Component({
    selector: 'page-user-rate',
    templateUrl: 'user-rate.html',
})
export class UserRateDetailPage extends PageBase {
    public todo: FormGroup;

    objectId: string;
    typeId: string;
    type: any;
    ip: string;
    list = [];
    name: string = "";
    feedbackType: number = 1;
    listImages = [];

    formData: FormData = new FormData();
    files: Array<{ Name: any, image: any }> = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public showUserInfo: ShowUserInfo,
        private formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController,
        private _translate: TranslateService,
        public alertCtrl: AlertController,
        public http: Http,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
        this.objectId = navParams.get('objectId');
        this.typeId = navParams.get('typeId');
        this.type = navParams.get('type');
        this.ip = Services.Ip;
        this.todo = this.formBuilder.group({
            PLACE_CODE: [this.typeId, [Validators.required]],
            PLACE_ID: [this.objectId, [Validators.required]],
            CONTENT: ['', [Validators.required]],
            RATE: [10, [Validators.required]],
        });
    }

    init() {
        this.showLoading();
        this.todo = this.formBuilder.group({
            PLACE_CODE: [this.typeId, [Validators.required]],
            PLACE_ID: [this.objectId, [Validators.required]],
            CONTENT: ['', [Validators.required]],
            RATE: [10, [Validators.required]],
        });
        this.UltilitiesService.GetReviewByObject(this.objectId, this.typeId, this.type).subscribe(data => {
            if (data.Code === 200) {
                if (data.Result != null) {
                    setTimeout(() => {
                        this.loading.dismiss();
                        this.list = data.Result;
                    });
                }
            } else if (data.Code != 404) {
                this.showError(data.Message);
            }
        });
    }

    submit() {
        this.UltilitiesService.SaveReview(this.todo.value.PLACE_ID, this.todo.value.PLACE_CODE, this.type, this.todo.value.CONTENT, this.todo.value.RATE).subscribe(data => {
            if (data.Code == 200) {
                this.init();
            } else {
                //console.log(data.Message);
            }
        });
    }
}
