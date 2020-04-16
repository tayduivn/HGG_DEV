import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';

import { UnauthorPageBase, Services } from '../../providers';

import { TranslateService } from "../../translate";

import { CameraPage } from "../camera/camera";
import { LoginPage } from "../login/login";

@Component({
    selector: 'page-user-images',
    templateUrl: 'user-images.html',
})
export class UserImagesPage extends UnauthorPageBase {
    objectId: string;
    typeId: string;
    type: any;
    ip:string;
    list = [];
    name:string = "";
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public translateService: TranslateService,
        public http: Http,
        public modalCtrl: ModalController
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService);
        this.objectId = navParams.get('objectId');
        this.typeId = navParams.get('typeId');
        this.name = navParams.get('name');
        this.ip = Services.Ip;
    }

    init() {
        this.showLoading();
        var data = {
            "type_id": this.typeId,
            "object_id": this.objectId
        };
        this.http.post(Services.ServerURL('Management/Upload/GetList'), data, { headers: Services.ContentHeaders })
            .map(m => Services.extractResult(m)).subscribe(
            data => {
                if (data.Code === 200) {
                    setTimeout(() => {
                        this.loading.dismiss();
                        this.list = data.Result;
                  });
                } else {
                    this.showError(data.Message)
                }
            },
            error => {
                this.showError(this.translateService.translate("network.error"));
            });
    }


    takePicture() {
        if(Services.tokenNotExpired()) {
            this.navCtrl.push(CameraPage, { objectId: this.objectId, typeId: this.typeId });
        } else {
            let modal = this.modalCtrl.create(LoginPage);
            modal.present();
        }
    }
}
