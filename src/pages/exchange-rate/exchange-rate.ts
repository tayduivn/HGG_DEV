import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { SearchLocationService, PageBase, ShowUserInfo, ExchangeRateService, UltilitiesService } from "../../providers";
import { TranslateService } from "../../translate";

/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'exchange-rate-page',
  templateUrl: 'exchange-rate.html'
})

export class ExchangeRatePage extends PageBase {

  listRates: any[];
  listRatesFilters: any[];
  exchangeCode: any;
  exchangeFrom: number;
  istoVN: boolean;
  result: string;
  valueExchange: number = 0;
  isShowPannel: boolean;
  currentRate: any;
  vietNamDong: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public searchLocationService: SearchLocationService,
    public translateService: TranslateService,
    public ShowUserInfo: ShowUserInfo,
    public peopleService: ExchangeRateService,
    public UltilitiesService: UltilitiesService,
    public platform: Platform
  ) {
    super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
    this.exchangeCode = "AUD";
    this.exchangeFrom = null;
    this.istoVN = true;
    this.result = "";
    this.isShowPannel = true;
    this.currentRate = {};
    this.vietNamDong = {
      CurrencyCode: "VND",
      Flag: "http://www.geonames.org/flags/m/vn.png"
    }
  }

  init() {
    this.getListRates();
  }

  revertExchange() {
    this.istoVN = !this.istoVN;
    this.changeInfo(this.istoVN);
    this.changeMoney(this.valueExchange, this.currentRate.CurrencyCode, this.istoVN);
  }

  changeInfo(toVn) {
    var plagVN: any = document.getElementById("vn_flag");
    var plagCurrent: any = document.getElementById("current_flag");
    var codeVN: any = document.getElementById("vn_code");
    var codeCurrent: any = document.getElementById("current_code");
    if (this.istoVN) { // convert to vnd
      plagVN.src = this.vietNamDong.Flag;
      plagCurrent.src = this.currentRate.Flag;
      codeVN.textContent = this.vietNamDong.CurrencyCode;
      codeCurrent.textContent = this.currentRate.CurrencyCode;
      if (parseFloat(this.valueExchange + '') >= 100000000) {
        this.valueExchange = 0;
      }
    } else {
      plagVN.src = this.currentRate.Flag;
      plagCurrent.src = this.vietNamDong.Flag;
      codeVN.textContent = this.currentRate.CurrencyCode;
      codeCurrent.textContent = this.vietNamDong.CurrencyCode
    }
  }

  changeMoney(number, currency, istovn) {
    this.UltilitiesService.CalcExchangeRates(number, currency, istovn).subscribe(data => {
      if (data.Code === 200) {
        this.result = data.Result + '';
      }
    });
  }

  getListRates() {
    this.listRates = [];
    this.UltilitiesService.GetListExchangeRates().subscribe(data => {
      if (data.Code === 200) {
        this.listRates = data.Result;
        this.listRatesFilters = data.Result;
        let lengthArr = this.listRates.length;
        if (lengthArr > 0) {
          for (var i = 0; i < lengthArr; i++) {
            this.listRates[i].Flag = "http://www.geonames.org/flags/m/" + this.listRates[i].CurrencyCode.substring(0, 2).toLowerCase() + ".png";
          }
        }
      }
    },
      error => {
        this.showError(this.translateService.translate("network.error"));
      });
  }

  searchListRates(ev: any) {
    let val = ev.target.value;
    this.listRatesFilters = this.listRates;
    if (val && val != '') {
      this.listRatesFilters = this.listRates.filter((item) => {
        return (item.CurrencyCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  public numberClick(key: any) {
    //let lastNumber = this.valueExchange.toString().split('').pop();
    if (this.valueExchange == 0 && key.toElement.innerText == 0
      && this.valueExchange.toString().indexOf(".") < 1) {
      this.valueExchange = 0;
    } else if (this.valueExchange.toString().indexOf(".") >= 1
      && this.valueExchange.toString().split(".")[1].length >= 2
      && key.toElement.innerText == 0 && parseFloat(this.valueExchange.toString().split(".")[1]) == 0) {
      this.valueExchange = parseFloat(this.valueExchange.toString().split(".")[0]);
    } else if (this.valueExchange == 0 && key.toElement.innerText > 0 && this.valueExchange.toString().indexOf(".") < 1) {
      this.valueExchange = key.toElement.innerText;
    } else if (key.toElement.innerText == "." && this.valueExchange.toString().indexOf(".") >= 1
      || this.valueExchange.toString().indexOf(".") >= 1 && this.valueExchange.toString().split(".")[1].length >= 3) {
      return false;
    } else if (parseFloat(this.valueExchange + '') >= 100000 && this.istoVN) {
      return false;
    } else if (parseFloat(this.valueExchange + '') >= 100000000 && !this.istoVN) {
      return false;
    } else {
      this.valueExchange += key.toElement.innerText;
    }
    this.calculatorExchangeRate(this.valueExchange, this.currentRate.CurrencyCode, this.istoVN);
  }

  public showKeyBoard(rate: any) {
    this.currentRate = rate;
    var plagVN: any = document.getElementById("vn_flag");
    var plagCurrent: any = document.getElementById("current_flag");
    var codeVN: any = document.getElementById("vn_code");
    var codeCurrent: any = document.getElementById("current_code");

    plagVN.src = this.vietNamDong.Flag;
    plagCurrent = this.currentRate.Flag;
    codeVN.textContent = this.vietNamDong.CurrencyCode;
    codeCurrent.textContent = this.currentRate.CurrencyCode;

    this.istoVN = true;
    this.listRates.forEach(item => {
      item.selected = false;
    });
    if (this.isShowPannel) {
      this.isShowPannel = false;
      rate.selected = true;
    } else {
      this.isShowPannel = true;
      this.valueExchange = 0;
      this.result = "";
      rate.selected = false;
    }
  }

  clearNumberClick() {
    this.valueExchange = parseFloat(this.valueExchange.toString().slice(0, -1));
    this.valueExchange = (isNaN(this.valueExchange)) ? 0 : this.valueExchange;
    this.calculatorExchangeRate(this.valueExchange, this.currentRate.CurrencyCode, this.istoVN);
  }

  calculatorExchangeRate(value, currencyCode, isToVN) {
    if (isToVN) {
      this.result = this.currentRate.Transfer * value + '';
    } else {
      this.result = (value / this.currentRate.Transfer).toFixed(3) + '';
    }
  }

}
