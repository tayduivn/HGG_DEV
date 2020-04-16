import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { SearchLocationService, PageBase, ShowUserInfo, WeatherService, UltilitiesService } from "../../providers";
import { TranslateService } from "../../translate";

import _ from 'lodash';
import moment from 'moment';
import { Http, Headers } from '@angular/http';

/*
  Generated class for the LocationMapShow page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'weather-page',
  templateUrl: 'weather.html'
})
export class WeatherPage extends PageBase {

  listForeCast: any;
  currentWeather: any;
  textString: string;
  arrayTest: any = [];

  listResult: any[] = [];

  listDate: any[] = [];
  listWeatherByDate: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public searchLocationService: SearchLocationService,
    public translateService: TranslateService,
    public weatherService: WeatherService,
    public ShowUserInfo: ShowUserInfo,
    public UltilitiesService: UltilitiesService,
    public http: Http,
    public toastCtrl: ToastController
  ) {
    super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
    this.listForeCast = [];
    this.currentWeather = {};
  }

  init() {
    this.loadInfoUtilitiesWeather();

    // for (var i = 0; i <= 47; i++) {
    //   var item = { id: i };
    //   this.arrayTest.push(item);
    // }
  }
  convertDateTimeString(date: Date, split: string, type = 1) {
    var day = date.getDate() > 9 ? date.getDate().toString() : "0"+ date.getDate().toString();
    var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1).toString() : "0"+ (date.getMonth()+1).toString();
    var hour = date.getHours() > 9 ? date.getHours().toString() : "0"+ date.getHours().toString();
    var min = date.getMinutes() > 9 ? date.getMinutes().toString() : "0"+ date.getMinutes().toString();
    if(type == 1) {
        return day + split + month + split + date.getFullYear();
    } else if(type == 2) {
        return date.getFullYear() + split + month + split + day + "T" + hour + ":" + min;
    }
    
  }
  getWeekDay(wd) {
    switch(wd) {
      case "Monday":
        return this.translateService.translate("cal.mon");
      case "Tuesday":
        return this.translateService.translate("cal.tue");
      case "Wednesday":
        return this.translateService.translate("cal.wed");
      case "Thursday":
        return this.translateService.translate("cal.thu");
      case "Friday":
        return this.translateService.translate("cal.fri");
      case "Saturday":
        return this.translateService.translate("cal.sat");
      case "Sunday":
        return this.translateService.translate("cal.sun");
    }
  }
  loadInfoUtilitiesWeather() {
    this.showLoading();
    this.listDate = [];
    var nowTime = new Date().getTime();
    this.weatherService.getCurrentWeather().subscribe(
      data => {
        if(data != null) {

          this.listResult = data.list;

          this.listResult.forEach((element, index) => {
            // var rdate = new Date(element.dt*1000);
            // var dt_txt = this.convertDateTimeString(rdate, "-", 2);
            // var datetxt = dt_txt.split("T")[0];
            var a = moment(element.dt*1000 + 7*3600*1000).utc(false);
            var a_str = a.toISOString();
            var datetxt = a_str.split("T")[0];
            var wd = a.format("dddd");
            if(this.listDate.indexOf(datetxt) < 0) {
              this.listWeatherByDate.push({
                rdate: datetxt,
                dt: element.dt,
                listTime: [],
                wd: this.getWeekDay(wd)
              });
              this.listDate.push(datetxt);
            }
          });

          this.listWeatherByDate.forEach((element, index) => {
            this.listResult.forEach((element2, index2) => {
              // var rdate = new Date(element2.dt*1000);
              // var dt_txt = this.convertDateTimeString(rdate, "-", 2);
              // var datetxt = dt_txt.split("T")[0];
              // console.log(datetxt);
              var a = moment(element2.dt*1000 + 7*3600*1000).utc(false);
              var a_str = a.toISOString();
              var datetxt = a_str.split("T")[0];
              if(datetxt == element.rdate) {
                var item = {
                  id: index2,
                  // date: dt_txt,
                  time: a_str.split("T")[1].split(":")[0] + ":" + a_str.split("T")[1].split(":")[1],
                  // time: element2.dt_txt.split(" ")[1],
                  weather: {
                    id: element2.weather[0].id,
                    name: this.findNameById(element2.weather[0].id),
                    icon: element2.weather[0].icon,
                    humidity: element2.main.humidity,
                    temperature: element2.main.temp_min,
                    wind: element2.wind.speed,
                  }
                };

                element.listTime.push(item);
              }
            });
          });
          // console.log(this.listWeatherByDate);
          // console.log(new Date().getTime());
        }
      }, 
      err => {},
      () => {
        setTimeout(() => {
          this.loading.dismiss();
        });
      }
    );
  }

  findNameById(id) {
    switch(id) {
      case 200:
        return this.translateService.translate('w200');
      case 201:
        return this.translateService.translate('w201');
      case 202:
        return this.translateService.translate('w202');
      case 210:
        return this.translateService.translate('w210');
      case 211:
        return this.translateService.translate('w211');
      case 212:
        return this.translateService.translate('w212');
      case 221:
        return this.translateService.translate('w221');
      case 230:
        return this.translateService.translate('w230');
      case 231:
        return this.translateService.translate('w231');
      case 232:
        return this.translateService.translate('w232');
      case 300:
        return this.translateService.translate('w300');
      case 301:
        return this.translateService.translate('w301');
      case 302:
        return this.translateService.translate('w302');
      case 310:
        return this.translateService.translate('w310');
      case 311:
        return this.translateService.translate('w311');
      case 312:
        return this.translateService.translate('w312');
      case 313:
        return this.translateService.translate('w313');
      case 314:
        return this.translateService.translate('w314');
      case 321:
        return this.translateService.translate('w321');
      case 500:
        return this.translateService.translate('w500');
      case 501:
        return this.translateService.translate('w501');
      case 502:
        return this.translateService.translate('w502');
      case 503:
        return this.translateService.translate('w503');
      case 504:
        return this.translateService.translate('w504');
      case 511:
        return this.translateService.translate('w511');
      case 520:
        return this.translateService.translate('w520');
      case 521:
        return this.translateService.translate('w521');
      case 522:
        return this.translateService.translate('w522');
      case 531:
        return this.translateService.translate('w531');
      case 600:
        return this.translateService.translate('w600');
      case 601:
        return this.translateService.translate('w601');
      case 602:
        return this.translateService.translate('w602');
      case 611:
        return this.translateService.translate('w611');
      case 612:
        return this.translateService.translate('w612');
      case 615:
        return this.translateService.translate('w615');
      case 616:
        return this.translateService.translate('w616');
      case 620:
        return this.translateService.translate('w620');
      case 621:
        return this.translateService.translate('w621');
      case 622:
        return this.translateService.translate('w622');
      case 701:
        return this.translateService.translate('w701');
      case 711:
        return this.translateService.translate('w711');
      case 721:
        return this.translateService.translate('w721');
      case 731:
        return this.translateService.translate('w731');
      case 741:
        return this.translateService.translate('w741');
      case 751:
        return this.translateService.translate('w751');
      case 761:
        return this.translateService.translate('w761');
      case 762:
        return this.translateService.translate('w762');
      case 771:
        return this.translateService.translate('w771');
      case 781:
        return this.translateService.translate('w781');
      case 800:
        return this.translateService.translate('w800');
      case 801:
        return this.translateService.translate('w801');
      case 802:
        return this.translateService.translate('w802');
      case 803:
        return this.translateService.translate('w803');
      case 804:
        return this.translateService.translate('w804');
    }
  }

  displayName(iw) {
    var toast = this.toastCtrl.create({
      duration: 4000,
      dismissOnPageChange: true,
      cssClass: "android-toast",
      message: iw.weather.name,
      position: "bottom",
    }).present();
  }

  // loadInfoUtilitiesWeather() {
  //   this.showLoading();
  //   this.weatherService.getCurrentWeather().subscribe(
  //     data => {
  //       //console.log(data);
  //       this.tranlate(data.query.results.channel.item.condition.text);
  //       this.currentWeather = {
  //         name: data.query.results.channel.location.city
  //         + ', ' + data.query.results.channel.location.region
  //         + ', ' + data.query.results.channel.location.country,
  //         temp: data.query.results.channel.item.condition.temp,
  //         code: data.query.results.channel.item.condition.code,
  //         low: data.query.results.channel.item.forecast[0].low,
  //         high: data.query.results.channel.item.forecast[0].high,
  //         date: moment(data.query.results.channel.item.forecast[0].date).format('DD/MM/YYYY'),
  //         namedate: this.getNameDateVietNamese(data.query.results.channel.item.forecast[0].day),
  //         text: this.textString
  //       }
  //       this.listForeCast = data.query.results.channel.item.forecast.slice(1, 6);
  //       this.listForeCast.forEach((fore, i) => {
  //         fore.date = moment(fore.date).format('DD/MM/YYYY');
  //         fore.condition = fore.day;
  //         fore.day = this.getNameDateVietNamese(fore.day);
  //       });
  //       setTimeout(() => {
  //         this.loading.dismiss();
  //       });
  //     },
  //     error => {
  //       // this.showError(this.translateService.translate("network.error"), false);
  //       setTimeout(() => {
  //         this.loading.dismiss();
  //       });
  //     }
  //   );
  // }

  // tranlate(data: any) {
  //   switch (data) {
  //     case "Thunderstorms":
  //       this.textString = "Mưa giông";
  //       break;
  //     case "Mostly Sunny":
  //       this.textString = "Trời nắng";
  //       break;
	//   case "Showers":
  //       this.textString = "Mưa rào";
  //       break;
  //     default:
  //       var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + data;
  //       this.http.get(url).subscribe((data1) => {
  //         if (data1 != null) {
  //           var rs = JSON.parse(data1['_body']);
  //           this.textString = rs[0][0][0];
  //         }
  //       });
  //       break;
  //   }
  // }

  // getNameDateVietNamese(name) {
  //   switch (name) {
  //     case "Mon":
  //       name = "Thứ hai"
  //       break;
  //     case "Tue":
  //       name = "Thứ ba"
  //       break;
  //     case "Wed":
  //       name = "Thứ tư"
  //       break;
  //     case "Thu":
  //       name = "Thứ năm"
  //       break;
  //     case "Fri":
  //       name = "Thứ sáu"
  //       break;
  //     case "Sat":
  //       name = "Thứ bảy"
  //       break;
  //     case "Sun":
  //       name = "Chủ nhật"
  //       break;
  //     default:
  //       break;
  //   }
  //   return name;
  // }
}
