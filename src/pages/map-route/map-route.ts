import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { ShowUserInfo } from "../../providers/show-user-info";
import { Subscription } from 'rxjs/Subscription';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var google;

/*
  Generated class for the MapRoute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-map-route',
    templateUrl: 'map-route.html'
})
export class MapRoutePage extends PageBase {
    @ViewChild('map') mapElement: ElementRef;
    options: any;
    styles: any;
    locations: any;
    currentMarker: any;
    startMarker: any;
    map: any;
    types: any;

    duration: any;
    distance: any;

    isLocationEnabled = false;
    latitude: any;
    longitude: any;
    defaultLat: any;
    defaultLng: any;
    transportType: any;
    storeResponse: any;
    directionsDisplay: any;
    flightPathWalk: any;
    flightPathCar: any;

    subscription: Subscription;

    currLatLng: any;

    page_on: boolean = true;
    first_time: any = 0;

    checkfail: boolean = false;
    play_one: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private geolocation: Geolocation,
        private _DIAGNOSTIC: Diagnostic,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public serviceGetting: ServiceGetting,
        public searchLocationService: SearchLocationService,
        public translateService: TranslateService,
        public ShowUserInfo: ShowUserInfo,
        public platform: Platform,
        public UltilitiesService: UltilitiesService,
        private locationAccuracy: LocationAccuracy,
        private androidPermissions: AndroidPermissions
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, translateService, ShowUserInfo, UltilitiesService);
        this.locations = this.navParams.get('locations');
        this.types = this.navParams.get('type');

        this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
        this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
        this.transportType = "car";
        this.storeResponse = {
            car: null,
            walk: null
        };
        this.directionsDisplay = null;
        this.flightPathWalk = null;
        this.flightPathCar = null;

        
    }

    ionViewWillEnter() {
        this.page_on = true;
    }

    ionViewDidLeave() {
        this.page_on = false;
    }

    init() {

        this.options = {
            maximumAge: 10000, enableHighAccuracy: true
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

        // this.isLocationAvailable();

        // if(this.platform.is('cordova')) {
        //     this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode) => {
        //         if (this.page_on && ((this.platform.is("android") && locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF)
        //             || (this.platform.is("ios") && (locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
        //                 || locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE
        //             )))) {
                    
        //             if(this.first_time == 2) {
                        
        //             }
        //             this.first_time++;

        //         }
        //     });
        // }

        this.platform.ready().then(() => {
            if(this.platform.is('cordova')) {
                this.checkGPS().then(() => {
                    setTimeout(async () => {
                        if(this.checkfail == true) {
                            this.caseNoLatLng();
                        } else {
                            if(this.platform.is('ios')) {
                                this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
                                    if(status == this._DIAGNOSTIC.permissionStatus.DENIED) {
                                        this.errorNoGPS();
                                    } else {
                                        this.isLocationAvailable();
                                    }
                                });
                            } else {
                                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                                if(!cp2.hasPermission) {
                                    this.errorNoPermission();
                                } else {
                                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                                        
                                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                                            this.isLocationAvailable();
                                        } else {
                                            var alert = this.warningDeviceOnly();
                                            this.caseNoLatLng();
                                        }
                                    });
                                }
                            }
                        }
                    }, 500);
                });
            } else {
                this.isLocationAvailable();
            }
        });
        
        this.subscription = this.geolocation.watchPosition(this.options).subscribe(data => {

            if(data != null && data.coords != null) {
                
                var lat = data.coords.latitude;
                var lng = data.coords.longitude;
                let latLng = new google.maps.LatLng(lat, lng);
                this.currLatLng = new google.maps.LatLng(lat, lng);
                this.currentMarker = new google.maps.Marker({
                    icon: {
                        url: "assets/images/current-resize.gif"
                    },
                    map: this.map,
                    position: latLng
                });

                // this.showError(lat + ", " + lng);
                
                // if(this.currentMarker != undefined && this.currentMarker != null) {
                    
                //     this.currLatLng = latLng;
                //     this.currentMarker.setPosition(latLng);
                //     // this.map.setCenter(latLng);
                // }
            }
            
        });
    }

    caseNoLatLng() {
        this.latitude  = this.defaultLat;
        this.longitude = this.defaultLng;
        this.initMap(this.latitude, this.longitude, true, this.transportType);
    }

    errorNoGPS() {
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("error.title"),
            subTitle: this.translateService.translate("gps.error1"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    errorNoPermission() {
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("error.title"),
            subTitle: this.translateService.translate("gps.error1"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    warningDeviceOnly() {
        let alert = this.alertCtrl.create({
            title: this.translateService.translate("info.title"),
            subTitle: this.translateService.translate("info.deviceonly"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    infoChangeGPS() {
        var alert = this.alertCtrl.create({
            title: this.translateService.translate('info.title'),
            subTitle: this.translateService.translate("info.gps"),
            buttons: [{
                text: "OK",
                role: 'cancel'
            }]
        });
        alert.present();
        return alert;
    }

    async checkGPS() {
        var ie = await this._DIAGNOSTIC.isLocationEnabled();
        if(this.platform.is('android')) {
            var cp = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            if(!cp.hasPermission) {
                await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            }
        }
        
        if(ie) {
            if(this.platform.is('android')) {
                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                if(!cp2.hasPermission) {
                    this.checkfail = true;
                    this.errorNoPermission();
                } else {
                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                            // this.isLocationAvailable();
                        } else {
                            var cr = await this.locationAccuracy.canRequest();
                            if(cr) {
                                // the accuracy option will be ignored by iOS
                                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                    (data) => {
                                        // this.isLocationAvailable();
                                    },
                                    error => {
                                        this.warningDeviceOnly();
                                        // this.caseNoLatLng();
                                        this.checkfail = true;
                                    }
                                );
                            }
                        }
                    });
                }
            } else if(this.platform.is('ios')) {
                this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
                    switch(status){
                        case this._DIAGNOSTIC.permissionStatus.NOT_REQUESTED:
                            console.log("Permission not requested");
                            break;
                        case this._DIAGNOSTIC.permissionStatus.DENIED:
                            this.checkfail = true;
                            this.errorNoPermission();
                            break;
                        case this._DIAGNOSTIC.permissionStatus.GRANTED:
                            break;
                    }
                });
            }
        } else {
            this.checkfail = true;
            let alert = this.errorNoGPS();
            alert.onDidDismiss((data) => {
                this._DIAGNOSTIC.switchToLocationSettings();
            });
            this._DIAGNOSTIC.registerLocationStateChangeHandler((locationMode) => {
                
                if(this.page_on 
                    && ((this.platform.is("android") && (locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF))
                    || (this.platform.is("ios") && ( locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
                    || locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE)))
                ) {
                    if(this.play_one == 0) {
                        this.play_one = 1;
                        let alert = this.infoChangeGPS();
                        alert.onDidDismiss(async data => {
                            if(this.platform.is('android')) {
                                var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
                                if(!cp2.hasPermission) {
                                    this.errorNoPermission();
                                } else {
                                    this._DIAGNOSTIC.getLocationMode().then(async data => {
                                        if(data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
                                            this.isLocationAvailable();
                                        } else {
                                            var cr = await this.locationAccuracy.canRequest();
                                            if(cr) {
                                                // the accuracy option will be ignored by iOS
                                                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                                    (data) => {
                                                        this.isLocationAvailable();
                                                    },
                                                    error => {
                                                        this.warningDeviceOnly();
                                                        this.caseNoLatLng();
                                                    }
                                                );
                                            }
                                        }
                                    });
                                }
                            } else if(this.platform.is('ios')) {
                                // this.isLocationAvailable();
                                this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
                                    if(status == this._DIAGNOSTIC.permissionStatus.DENIED) {
                                        this.errorNoPermission();
                                        this.caseNoLatLng();
                                    } else {
                                        this.isLocationAvailable();
                                    }
                                });
                            } else {
                                this.isLocationAvailable();
                            }
                        });
                    }
                } else if(this.platform.is("ios") && locationMode === this._DIAGNOSTIC.permissionStatus.NOT_REQUESTED) {
                    this._DIAGNOSTIC.requestLocationAuthorization().then(data => {
                        if(data == this._DIAGNOSTIC.permissionStatus.DENIED) {
                            this.errorNoPermission();
                            this.caseNoLatLng();
                        } else {
                            this.isLocationAvailable();
                        }
                    }, err => {
                        this.errorNoPermission();
                        this.caseNoLatLng();
                    });
                }
            });
        }
        
    }

    setMapCenter() {
        this.map.setCenter(this.currLatLng);
    }

    isLocationAvailable() {

        //For iOS and Android
        this.showLoading();
        this.geolocation.getCurrentPosition(this.options)
        .then((data: any) => {
            this.latitude = data.coords.latitude;
            this.longitude = data.coords.longitude;
            // this.showError("2/ " + this.latitude + ", " + this.longitude);
            this.initMap(this.latitude, this.longitude, false, this.transportType);
        })
        .catch((error: any) => {
            this.latitude = this.defaultLat;
            this.longitude = this.defaultLng;
            this.initMap(this.latitude, this.longitude, false, this.transportType);
            this.showError(this.translateService.translate("gps.error1"));
            this.loading.dismiss();
        });
    }

    initMap(latitude, longitude, loading = true, transportType, loadMap = true) {
        if (loading) {
            this.showLoading();
        }

        let mapOptions = {
            zoom: 16,
            disableDefaultUI: true,
            styles: this.styles['hide']
            //mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        if(loadMap) {
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        }

        let latLng = new google.maps.LatLng(latitude, longitude);
        this.map.setCenter(latLng);
        var startMarker2 = new google.maps.Marker({
            icon: {
                url: "assets/images/try/flags.png"
            },
            map: this.map,
            position: latLng
        });
        // this.currentMarker.setMap(this.map);
        // this.currentMarker.setPosition(latLng);

        var destination = null;

        if (this.locations != "" && this.locations) {
            destination = new google.maps.LatLng(parseFloat(this.locations.split(",")[0].trim()), parseFloat(this.locations.split(",")[1].trim()));
        }

        var directionsService = new google.maps.DirectionsService();

        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            strokeOpacity: 1,
            fillOpacity: 1,
            scale: 3
        };

        var checkPoint = transportType == "car" ? {} : { icon: lineSymbol, offset: '0', repeat: '20px' };

        var renderOptions = {
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#EA015E',
                strokeOpacity: transportType == "car" ? 1 : 0,
                icons: [checkPoint]
            }
        }

        this.directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);

        this.directionsDisplay.setMap(this.map);

        var markerDestination = new google.maps.Marker({
            position: destination,
            map: this.map,
            icon: {
                url: "assets/images/" + this.types + ".png",
                size: new google.maps.Size(40, 40),
                scaledSize: new google.maps.Size(35, 35)
            },
        });

        var request = {
            origin: latLng,
            destination: destination,
            travelMode: transportType == "car" ? google.maps.TravelMode.DRIVING : google.maps.TravelMode.WALKING
        };

        this.duration = "";
        this.distance = "";

        directionsService.route(request, (response, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
                this.directionsDisplay.setOptions({
                    markerOptions: {
                        opacity: .1,
                        icon: "assets/images/current-resize.gif"
                    }
                });

                this.duration = this.directionsDisplay.directions.routes[0].legs[0].duration.text;
                this.distance = this.directionsDisplay.directions.routes[0].legs[0].distance.text;

                if (transportType == "car") {
                    this.storeResponse.car = response;
                } else {
                    this.storeResponse.walk = response;
                }

                setTimeout(() => {
                    this.loading.dismiss().then(() => {
                        this.play_one = 0;
                    });
                });
            }
        });
    }

    segmentChanged(event: any) {
        if (this.storeResponse.car == null) {
            this.initMap(this.latitude, this.longitude, false, event.value);
        }

        if (event.value == "car") {
            if (this.storeResponse.car != null) {
                this.drawDirectionsOffline(event.value, this.storeResponse.car.routes[0]);
            } else {
                this.initMap(this.latitude, this.longitude, false, event.value);
            }
        } else {
            if (this.storeResponse.walk != null) {
                this.drawDirectionsOffline(event.value, this.storeResponse.walk.routes[0])
            } else {
                this.initMap(this.latitude, this.longitude, false, event.value);
            }
        }

    }

    drawDirectionsOffline(transportType, pathCoords) {
        this.directionsDisplay.setMap(null);
        this.duration = pathCoords.legs[0].duration.text;
        this.distance = pathCoords.legs[0].distance.text;
        if (transportType == "car") {
            if (this.flightPathWalk != null || this.flightPathWalk != undefined) {
                this.flightPathWalk.setMap(null);
            }
            this.flightPathCar = new google.maps.Polyline({
                path: pathCoords.overview_path,
                geodesic: true,
                strokeColor: '#EA015E',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            this.flightPathCar.setMap(this.map);
        } else {
            if (this.flightPathCar != null || this.flightPathCar != undefined) {
                this.flightPathCar.setMap(null);
            }
            var lineSymbolOff = {
                path: google.maps.SymbolPath.CIRCLE,
                strokeOpacity: 1,
                fillOpacity: 1,
                scale: 3
            };
            this.flightPathWalk = new google.maps.Polyline({
                path: pathCoords.overview_path,
                geodesic: true,
                strokeColor: '#EA015E',
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbolOff,
                    offset: '0',
                    repeat: '20px'
                }]
            });
            this.flightPathWalk.setMap(this.map);
        }
    }

    getType(types) {
        switch (types) {
            case 1:
                return "stay";
            case 2:
                return "eat";
            case 3:
                return "see";
            case 5:
                return "shop";
            case 7:
                return "event";
        }
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }
}
