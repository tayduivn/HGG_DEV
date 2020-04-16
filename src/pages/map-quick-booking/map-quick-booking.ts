import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { EventShowPage } from '../event-show/event-show';
import { LookUpPage } from '../look-up/look-up';

import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { HotelDetailPage } from '../hotel-detail/hotel-detail';

import { UnauthorPageBase } from '../../providers';
import { HobbyService, ServiceGetting, SearchLocationService } from '../../providers';
import { Hobby } from '../../model/Hobby';
import { Service } from '../../model/Service';
import { LocationSearch } from '../../model/LocationSearch';
import { PlanPage } from "../plan/plan";
import { PlanSavedListPage } from "../plan-saved-list/plan-saved-list";

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";

import _ from 'lodash';
// import moment from 'moment';

declare var google;
declare var MarkerWithLabel;

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-map-quick-booking',
    templateUrl: 'map-quick-booking.html'
})
export class MapQuickBookingPage extends UnauthorPageBase {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    options: any;
    styles: any;

    listLocation = [];

    filterOption = { see: true, stay: true, eat: true, other: true, range: 1, rating: 0, money: 0 };
    strType: any[];
    search: any;

    listResult = [];
    listResultC: LocationSearch[];
    listMarker = [];

    chosenMarker: any;
    chosenIndex: any;

    listHobies: Hobby[];
    listServices: Service[];


    currentMarker: any;

    isLocationEnabled = false;
    latitude: any;
    longitude: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
        private _DIAGNOSTIC: Diagnostic,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public viewCtrl: ViewController,
        public translateService: TranslateService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService);
        this.listHobies = [];
        this.listServices = [];
        this.strType = [1, 2, 3];
        this.listResultC = [];

        var item = viewCtrl.data;
        //console.log(item);
        this.isLocationAvailable();


    }
    isLocationAvailable() {
        this._DIAGNOSTIC.isLocationAvailable()
            .then((isAvailable) => {

                this.geolocation.getCurrentPosition()
                    .then((data: any) => {
                        this.isLocationEnabled = true;
                        this.latitude = data.coords.latitude;
                        this.longitude = data.coords.longitude;
                    })
                    .catch((error: any) => {
                        //console.log('Error getting location', error);
                    });
            })
            .catch((error: any) => {
                //console.dir('Location is:' + error);
            });
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
    init() {

        //this.showLoading();
        this.search = "";
        this.options = {
            frequency: 3000,
            enableHighAccuracy: true
        };

        this.styles = {
            hide: [
                {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'transit',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        };
        this.initMap();
        var data = this.viewCtrl.data;
        for (let i = 0; i < data.item.length; i++) {
            this.listLocation.push({
                id: data.item[i].ID,
                // hotelId: data.item[i].Hotel_Id,
                name: data.item[i].NAME,
                imgURL: data.item[i].IMAGE ? data.item[i].IMAGE : "assets/iconImages/noimage.png",
                type: data.item[i].CODE,
                latitude: parseFloat(data.item[i].GEO_LOCATION.split(",")[0].trim()),
                longitude: parseFloat(data.item[i].GEO_LOCATION.split(",")[1].trim()),
                locationType: { slug: this.getSlugType(data.item[i].CODE) }
            });
        }
        this.loadMarker();

        //this.loadHobbies();
        //this.loadServices();
    }

    initMap() {
        let mapOptions = {
            zoom: 16,
            disableDefaultUI: true,
            styles: this.styles['hide']
            //mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.currentMarker = new google.maps.Marker({
            icon: "assets/images/current.png",
        });
        this.geolocation.getCurrentPosition(this.options).then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setCenter(latLng);

            this.currentMarker.setMap(this.map);
            this.currentMarker.setPosition(latLng);

        }, (err) => {
            //console.log(err);
        });
        //google.maps.event.addListener(this.map, 'dragend', () => { this.updateListLication(this.map.getCenter().lat(), this.map.getCenter().lng()) });
    }

    updateListLication(lat, lng) {
        //send filter option to server
        //get and transfer to list location

        //show
        this.loadListLocation();
    }

    moveToLocation(lat, lng) {
        this.geolocation.getCurrentPosition(this.options).then((position) => {
            var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.panTo(center);

            this.currentMarker.setPosition(center);
        }, (err) => {
            //console.log(err);
        });

    }

    changeFilterRatingToString() {
        switch (this.filterOption.rating) {
            case 1:
                return "0-5";
            case 2:
                return "5-7";
            case 3:
                return "7-9";
            case 4:
                return "9-10";
            default:
                return null;
        }
    }

    changeFilterMoneyToString() {
        switch (this.filterOption.rating) {
            case 1:
                return "0-500000";
            case 2:
                return "500000-1000000";
            case 3:
                return "1000000-3000000";
            case 4:
                return "3000000-5000000";
            case 5:
                return "5000000-10000000";
            case 6:
                return "10000000-100000000";
            default:
                return null;
        }
    }

    // set to display on map
    loadListLocation() {
        this.listLocation = [];
        var mapCenter = this.map.getCenter();
        // this.searchLocationService.SearchByCondition(this.filterOption.range * 1000, mapCenter.lat(), mapCenter.lng(), this.listHobiesChoiceId, this.listServicesChoiceId, this.changeFilterRatingToString(), this.changeFilterMoneyToString(), this.strType).subscribe(
        //     data => {
        //         if (data.Code === 200) {
        //             this.listResultC = [];
        //             this.listResultC = _.concat(this.listResultC, data.Result);
        //             console.log(this.listResultC);
        //             //let data1 = moment().format('YYYYMMDD');
        //             //console.log(data1);
        //             if (this.listResultC.length > 0) {
        //                 this.listResultC.forEach(element => {
        //                     if (element.Google_Location != null) {
        //                         this.listLocation.push({
        //                             id: element.Location_Id,
        //                             name: element.Location_Name,
        //                             imgURL: element.Image_Url ? element.Image_Url : "assets/iconImages/noimage.png",
        //                             type: element.Location_Type,
        //                             latitude: parseFloat(element.Google_Location.split(",")[0].trim()),
        //                             longitude: parseFloat(element.Google_Location.split(",")[1].trim()),
        //                             locationType: { slug: this.getSlugType(element.Location_Type) }
        //                         });
        //                     }
        //                 });
        //             }

        //             console.log(this.listLocation);
        //             this.loadMarker();

        //             setTimeout(() => {
        //                 this.loading.dismiss();
        //             });
        //         } else {
        //             this.showError(data.Message)
        //         }

        //     },
        //     error => {
        //         this.showError(error);
        //     }
        // );
    }

    getImageForType(type): string {
        return "assets/iconImages/" + type + ".png";
    }

    getAllLocation() {
        this.loadListLocation();
    }

    changeToHomePage() {
        this.navCtrl.setRoot(EventShowPage);
    }
    changeToLookUpPage() {
        this.navCtrl.setRoot(LookUpPage);
    }
    changeToPlanPage() {
        this.navCtrl.setRoot(PlanPage);
    }
    changeToSavedPlanPage() {
        this.navCtrl.setRoot(PlanSavedListPage);
    }
    closePopUpSearch() {
        document.getElementById("searchPopUp").style.display = "none";
    }
    openPopUpSearch() {
        document.getElementById("searchPopUp").style.display = "block";
    }

    chooseFilter(ts: string) {
        this.chooseFilterOnPopUp(ts);
        this.loadListLocation();
    }

    chooseFilterOnPopUp(ts: string) {
        switch (ts) {
            case "see":
                if (this.filterOption.see == true) {
                    this.filterOption.see = false;
                } else {
                    this.filterOption.see = true;
                }
                break;
            case "eat":
                if (this.filterOption.eat == true) {
                    this.filterOption.eat = false;
                } else {
                    this.filterOption.eat = true;
                }
                break;
            case "stay":
                if (this.filterOption.stay == true) {
                    this.filterOption.stay = false;
                } else {
                    this.filterOption.stay = true;
                }
                break;
            case "all":
                if (this.filterOption.see == true && this.filterOption.stay == true && this.filterOption.eat == true && this.filterOption.other == true) {
                    this.filterOption.see = false;
                    this.filterOption.stay = false;
                    this.filterOption.eat = false;
                    this.filterOption.other = false;
                } else {
                    this.filterOption.see = true;
                    this.filterOption.stay = true;
                    this.filterOption.eat = true;
                    this.filterOption.other = true;
                }
                break;
            case "other":
                if (this.filterOption.other == true) {
                    this.filterOption.other = false;
                } else {
                    this.filterOption.other = true;
                }
                break;
        }
        this.strType = [];
        if (this.filterOption.stay == true) {
            this.strType.push("1");
        }
        if (this.filterOption.eat == true) {
            this.strType.push("2");
        }
        if (this.filterOption.see == true) {
            this.strType.push("3");
        }
    }

    //load marker
    loadMarker() {
        this.listMarker.forEach(element => {
            element.setMap(null);
        });
        this.listMarker = [];

        this.listLocation.forEach(element => {
            var icon = "assets/images/stay.png";

            var marker = new MarkerWithLabel({
                map: this.map,
                position: new google.maps.LatLng(element.latitude, element.longitude),
                icon: { url: icon, size: new google.maps.Size(25, 28), scaledSize: new google.maps.Size(25, 28) },
                labelContent: element.name,
                labelAnchor: new google.maps.Point(18, 12),
                labelClass: "my-custom-class-for-label", // your desired CSS class
                labelInBackground: true,
            });
            google.maps.event.addListener(marker, 'click', () => { this.updateChosenMarker(marker); });
            this.listMarker.push(marker);
        });
    }

    openPopUpChoosingMethod() {
        document.getElementById("choosingMethod").style.display = "block";
    }
    closePopUpChoosingMethod() {
        document.getElementById("choosingMethod").style.display = "none";
    }

    updateChosenMarker(marker) {
        this.chosenMarker = marker;
        //console.log(this.chosenMarker);
        this.listMarker.forEach((element, index) => {
            if (element == this.chosenMarker) {
                this.chosenIndex = index;
            }
        });
        this.gotoDetail();
        // this.openPopUpChoosingMethod();
    }

    gotoDetail() {
        this.listMarker.forEach((element, index) => {
            if (element == this.chosenMarker) {
                this.navCtrl.push(HotelDetailPage, { item: this.listLocation[index].id, code: this.listLocation[index].type });
            }
        });
        this.chosenIndex = null;
        this.closePopUpChoosingMethod();
    }

    //get from server after search
    searchAction() {
        this.getResultSearch();
    }
    getResultSearch() {
        if (((this.search != "") || (typeof this.search !== undefined)) && this.search) {
            this.listResult = [];
            //console.log(this.search);
            this.showLoading();
            this.searchLocationService.SearchByName(this.search).subscribe(
                data => {
                    if (data.Code === 200) {
                        this.listResultC = [];
                        this.listResultC = _.concat(this.listResultC, data.Result);

                        //console.log(this.listResultC);

                        if (this.listResultC.length > 0) {
                            this.listResultC.forEach(element => {
                                if (element.Google_Location != null) {
                                    this.listResult.push({
                                        id: element.Location_Id,
                                        name: element.Location_Name,
                                        imgURL: element.Image_Url ? element.Image_Url : "assets/iconImages/noimage.png",
                                        type: element.Location_Type,
                                        latitude: parseFloat(element.Google_Location.split(",")[0].trim()),
                                        longitude: parseFloat(element.Google_Location.split(",")[1].trim()),
                                        locationType: { slug: this.getSlugType(element.Location_Type) }
                                    });
                                }
                            });
                        }

                        setTimeout(() => {
                            this.loading.dismiss();
                        });
                    } else {
                        this.showError(data.Message)
                    }

                },
                error => {
                    this.showError(error);
                }
            );
        }

    }
    getSlugType(id) {
        switch (id) {
            case "HOTEL":
                return "stay";
            case "RESTAURANT":
                return "eat";
            case "N_EVENTS":
                return "see";
            default:
                return "other";
        }
    }
    showAll() {
        if (this.listResult.length > 0) {
            this.listLocation = this.listResult;
            this.map.setCenter(new google.maps.LatLng(this.listResult[0].latitude, this.listResult[0].longitude));
            this.loadMarker();
            this.closePopUpSearch();
        }
    }
    showNearby() {
        if (this.chosenIndex != null) {
            var lat = this.listLocation[this.chosenIndex].latitude;
            var lng = this.listLocation[this.chosenIndex].longitude;
            this.updateListLication(this.listLocation[this.chosenIndex].latitude, this.listLocation[this.chosenIndex].longitude);
            this.map.setCenter(new google.maps.LatLng(lat, lng));
        } else {
            this.updateListLication(this.map.getCenter().lat(), this.map.getCenter().lng());
        }

        this.closePopUpChoosingMethod();
    }
    gotoLocation(location) {
        this.map.setCenter(new google.maps.LatLng(location.latitude, location.longitude));
        this.updateListLication(location.latitude, location.longitude);
        this.closePopUpSearch();
    }

    choosingFilterPopUpOpen() {
        this.chosenIndex = null;
        document.getElementById("choosingFilter").style.display = "block";
    }
    closePopUpChoosingFilter() {
        document.getElementById("choosingFilter").style.display = "none";
    }



    changeValue(item) {
        if (item.checked == false) {
            item.checked = true;
        } else {
            item.checked = false;
        }
    }
}
