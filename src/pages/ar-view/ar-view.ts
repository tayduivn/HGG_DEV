import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ShowUserInfo } from "../../providers";

/*
  Generated class for the ARView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-cam-view',
    templateUrl: 'ar-view.html'
})
export class ARView {

    title: string = "Radar";
    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public showUserInfo: ShowUserInfo

    ) { 
        
    }

    ionViewDidLoad() {
    }

    ionViewDidEnter() {
       

    }

}
