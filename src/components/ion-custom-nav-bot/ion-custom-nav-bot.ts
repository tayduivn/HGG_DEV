import { Component, Input } from '@angular/core';

import { UserPage } from "../../pages/user/user";
import { MapPage } from "../../pages/map/map";
import { PlanV2Page } from "../../pages/plan-v2/plan-v2";
import { NavController, ModalController } from "ionic-angular";
import { OverViewPage } from "../../pages/over-view/over-view";
import { UserWishListPage } from "../../pages/user-wishlist/user-wishlist";
import { Services } from "../../providers/index";
import { LoginPage } from "../../pages/login/login";

/**
 * Generated class for the DetailBoxComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'ion-custom-nav-bot',
  templateUrl: 'ion-custom-nav-bot.html'
})
export class IonCustomNavBotComponent {

   @Input("navCtrl") navbarCtrl;
   @Input("modalCtrl") mdCtrl;
   @Input("currentPage") currentPage;
//   @Input("longitude") longitudeParameter;

//   latitude: any;
//   longitude: any;

    current: any;
    user: any;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
        // console.log('Hello DetailBoxComponent Component');
    }

    checkToken() {
        return new Promise(resolve => {
            var hasToken = Services.tokenNotExpired();
            resolve(hasToken);
        });
        // return Services.tokenNotExpired();
    }

    ngAfterViewInit() {
        // this.longitude = this.longitudeParameter;
        // this.latitude = this.latitudeParameter;
        this.navCtrl = this.navbarCtrl;
        this.modalCtrl = this.mdCtrl;
        this.current = this.currentPage;
    }
    changeToOverViewPage() {
        if(this.current != 'overview') {
            this.navCtrl.setRoot(OverViewPage);
        }
    }
    changeToWishListPage() {
        if(this.current != 'wishlist') {
            this.navCtrl.setRoot(UserWishListPage);
        } 
        // this.checkToken().then(data => {
        //     if(data) {
        //         if(this.current != 'wishlist') {
        //             this.navCtrl.setRoot(UserWishListPage);
        //         } 
        //     } else {
        //         let modal = this.modalCtrl.create(LoginPage);
        //         modal.present();
        //     }
        // });
    }
    changeToMapPage() {
        if(this.current != 'map') {
            this.navCtrl.setRoot(MapPage);
        }
    }
    changeToUserpPage() {
        this.checkToken().then(data => {
            if(data) {
                if(this.current != 'user') {
                    this.navCtrl.setRoot(UserPage);
                }
            } else {
                let modal = this.modalCtrl.create(LoginPage);
                modal.present();
            }
        });
        
    }
    changeToPlanPage() {
        if(this.current != 'plan') {
            this.navCtrl.setRoot(PlanV2Page);
        }
    }
}