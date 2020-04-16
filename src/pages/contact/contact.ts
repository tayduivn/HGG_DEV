import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ShowUserInfo, UltilitiesService, PageBase } from '../../providers';
import { TranslateService } from '../../translate';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage extends PageBase {
  hotLine: string;
  constructor
  (
    public navCtrl: NavController,
    public showUserInfo: ShowUserInfo,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public ultilitiesService: UltilitiesService,
    public translateService: TranslateService,
    //public emailComposer: EmailComposer
  ){
  super(navCtrl, loadingCtrl, alertCtrl, translateService, showUserInfo, ultilitiesService);
  }
  init(){
    this.getHotlineNumber();
   }

  getHotlineNumber(){
    this.hotLine='';
    this.ultilitiesService.GetHotLineNumber().subscribe(data =>{
      if(data.Code == 200){
        this.hotLine = data.Result;
      }
    },error => {
      this.showError(this.translateService.translate("network.error"));
    })
  }
  gotoChatbox(){
    console.log('clicked chatbox');
  }
  gotoEmail(){
    // this.emailComposer.open({
    //   to: 'checkinhagiang.cskh@gmail.com'
    // })
    console.log('go to email')
  }
}
