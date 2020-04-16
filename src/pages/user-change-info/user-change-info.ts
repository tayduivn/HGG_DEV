import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";

import { UserInfo } from "../../model/UserInfo";

/*
  Generated class for the MapRoute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-user-change-info',
    templateUrl: 'user-change-info.html'
})
export class UserChangeInfoPage extends PageBase {

    todo: any;
    model = { UserName: "", FirstName: "", LastName: "", LanguageId: "", Address: "", Phone: "" };
    changepassModel = { OldPassword: "", NewPassword: "", ConfirmPassword: "" };
    changepass: any;
    option: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public showUserInfo: ShowUserInfo,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, showUserInfo, UltilitiesService);
        this.model.FirstName = localStorage.getItem("FirstName");
        this.model.LastName = localStorage.getItem("LastName");
        this.model.LanguageId = localStorage.getItem("LanguageId");
        this.model.Address = localStorage.getItem("Address") == "undefined" || localStorage.getItem("Address") == "null" ? "" : localStorage.getItem("Address");
        this.model.Phone = localStorage.getItem("Phone") == "undefined" || localStorage.getItem("Phone") == "null" ? "": localStorage.getItem("Phone");
        this.model.UserName = localStorage.getItem("UserName");
        // this.option = this.navParams.get("option");
        this.option = 'changeinfo';
    }

    init() { }

    ionViewDidLoad() { }

    changeTab(ts) {
        this.option = ts;
    }

    changeUserInfo() {
        if (this.model.FirstName != "" && this.model.LastName != "") {
            this.showLoading();
            this.showUserInfo.updateUserInfo(this.model).subscribe((data: any) => {
                if (data.Code === 200) {
                    localStorage.setItem("FirstName", this.model.FirstName);
                    localStorage.setItem("LastName", this.model.LastName);
                    localStorage.setItem("LanguageId", this.model.LanguageId);
                    localStorage.setItem("Address", this.model.Address);
                    localStorage.setItem("Phone", this.model.Phone);
                    this.loading.dismiss();
                    var alert = this.alertCtrl.create({
                        buttons: ['OK'],
                        title: "Thông tin",
                        message: this.translateService.translate(data.Message)
                    });
                    alert.present();
                } else if (data.Code == 405) {
                    this.showError(this.translateService.translate("uci.duppicationphone"));
                    this.model.Phone = localStorage.getItem("Phone");
                } else {
                    this.showError(data.Message);
                }
            });
        } else {
            this.showMessage(this.translateService.translate("uci.errorfieldrequired"));
        }
    }

    showMessage(message: string) {
        let alert = this.alertCtrl.create({
            title: "Thông báo",
            subTitle: message,
            buttons: [
                {
                    text: 'OK',
                }],
        });
        alert.present();
    }

    resetModelChangePassword() {
        this.changepassModel = { OldPassword: "", NewPassword: "", ConfirmPassword: "" };
    }

    changePassword() {
        if (this.changepassModel.OldPassword != "" && this.changepassModel.NewPassword != "" && this.changepassModel.ConfirmPassword != "") {
            this.showLoading();
            this.showUserInfo.changePassword(this.changepassModel.OldPassword, this.changepassModel.NewPassword, this.changepassModel.ConfirmPassword).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: "Thông báo",
                            subTitle: "Đổi mật khẩu thành công",
                            buttons: [
                                {
                                    text: 'OK',
                                }],
                        });
                        alert.present();
                        this.resetModelChangePassword();
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
}
