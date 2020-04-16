import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from "@ionic-native/diagnostic";
import { PageBase } from '../../providers/page-base';
import { HobbyService, ServiceGetting, SearchLocationService, ShowUserInfo, UltilitiesService } from '../../providers';

import { TranslateService } from "../../translate";
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var google;
declare var MarkerWithLabel;

/*
  Generated class for the PlanDirection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-plan-direction',
	templateUrl: 'plan-direction.html'
})
export class PlanDirectionPage extends PageBase {
	@ViewChild('map') mapElement: ElementRef;
	options: any;
	currentMarker: any;
	map: any;
	type: any;
	styles: any;

	totalTime: any;
	totalDistance: any;
	distance: any;
	duration: any;

	listLocations: any[];

	from: any;
	to: any;

	directionsService: any;
	directionsDisplay: any[];
	directCurrent: any;

	isLocationEnabled = false;
	latitude: any;
	longitude: any;

	defaultLat: any;
	defaultLng: any;

	page_on: boolean = true;
	first_time: boolean = true;

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
		public _translate: TranslateService,
		public ShowUserInfo: ShowUserInfo,
		public UltilitiesService: UltilitiesService,
		public platform: Platform,
		private locationAccuracy: LocationAccuracy,
		private androidPermissions: AndroidPermissions
	) {
		super(navCtrl, loadingCtrl, alertCtrl, _translate, ShowUserInfo, UltilitiesService);
		this.listLocations = [];
		this.listLocations = this.navParams.get('locations');
		this.totalTime = "0 " + this.translateService.translate('data.minutes');
		this.totalDistance = "0 km";
		this.directCurrent = new google.maps.DirectionsRenderer();

		this.defaultLat = parseFloat(localStorage.getItem("CenterLocation").split(",")[0]);
		this.defaultLng = parseFloat(localStorage.getItem("CenterLocation").split(",")[1]);
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
		let mapOptions = {
			zoom: 16,
			disableDefaultUI: true,
			styles: this.styles['hide'],
		}

		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		this.currentMarker = new google.maps.Marker({
			icon: "assets/images/current.png",
		});

		this.directionsService = new google.maps.DirectionsService();
		this.directionsDisplay = [];

		if (this.listLocations.length > 0) {
			this.initMap();
		} else {
			this.platform.ready().then(() => {
				if (this.platform.is('cordova')) {
					this.checkGPS().then(() => {
						setTimeout(async () => {
							if (this.checkfail == true) {
								this.caseNoLatLng();
							} else {
								if (this.platform.is('ios')) {
									this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
										if (status == this._DIAGNOSTIC.permissionStatus.DENIED) {
											this.errorNoGPS();
										} else {
											this.isLocationAvailable();
										}
									});
								} else {
									var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
									if (!cp2.hasPermission) {
										this.errorNoPermission();
									} else {
										this._DIAGNOSTIC.getLocationMode().then(async data => {

											if (data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
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
		}
	}

	ionViewWillEnter() {
		this.page_on = true;
	}

	ionViewDidLeave() {
		this.page_on = false;
	}

	initMap() {

		//console.log(this.listLocations);

		if (this.listLocations.length > 1) {

			var colors = ["red", "green", "blue", "orange", "brown", "violet"];

			var start = new google.maps.LatLng(this.listLocations[0].LOCATION_GOOGLE.split(",")[0], this.listLocations[0].LOCATION_GOOGLE.split(",")[1]);
			var marker = new MarkerWithLabel({
				map: this.map,
				position: start,
				// icon: {url: "assets/images/"+this.typeValue(this.listLocations[0].type)+".png", size: new google.maps.Size(25, 28),scaledSize: new google.maps.Size(25, 28)},
				icon: { url: "assets/images/" + 1 + ".png", size: new google.maps.Size(25, 28), scaledSize: new google.maps.Size(25, 28) },
				labelContent: this.listLocations[0].LOCATION_NAME,
				labelAnchor: new google.maps.Point(18, 12),
				labelClass: "my-custom-class-for-label", // your desired CSS class
				labelInBackground: true,
				zIndex: 1
			});

			var routes = [];

			this.distance = 0;
			this.duration = 0;

			this.listLocations.forEach((element, index) => {

				if (index > 0) {
					var destination = new google.maps.LatLng(element.LOCATION_GOOGLE.split(",")[0], element.LOCATION_GOOGLE.split(",")[1]);

					var marker = new MarkerWithLabel({
						map: this.map,
						position: destination,
						icon: { url: "assets/images/" + (index + 1) + ".png", size: new google.maps.Size(25, 28), scaledSize: new google.maps.Size(25, 28) },
						labelContent: this.listLocations[index].LOCATION_NAME,
						labelAnchor: new google.maps.Point(18, 12),
						labelClass: "my-custom-class-for-label", // your desired CSS class
						labelInBackground: true,
						zIndex: 1
					});

					var displaydirect = new google.maps.DirectionsRenderer();

					displaydirect.setMap(this.map);

					var request = {
						origin: start,
						destination: destination,
						travelMode: google.maps.TravelMode.DRIVING
					};

					this.directionsService.route(request, (response, status) => {
						if (status == google.maps.DirectionsStatus.OK) {
							displaydirect.setDirections(response);
							//console.log(displaydirect.directions.routes[0]);
							routes.push(displaydirect.directions.routes[0]);
							//console.log(routes);
							//directionsDisplay.setOptions( { suppressMarkers: true } );

							displaydirect.setOptions({
								markerOptions: {
									opacity: .1,
									icon: "assets/images/current.png"
								},
								polylineOptions: {
									strokeColor: "brown"
								}
							});

							this.directionsDisplay.push(displaydirect);

							this.distance += parseFloat(displaydirect.directions.routes[0].legs[0].distance.value);
							this.duration += parseFloat(displaydirect.directions.routes[0].legs[0].duration.value);

							this.totalDistance = Math.round(this.distance / 1000) + " km";
							this.totalTime = Math.round(this.duration / 60) + " " + this.translateService.translate('data.minutes');
							//console.log(this.totalDistance);
							//console.log(this.distance);
						}
					});
					start = destination;
				}
			});
		} else {
			this.map.setCenter(new google.maps.LatLng(this.listLocations[0].LOCATION_GOOGLE.split(",")[0], this.listLocations[0].LOCATION_GOOGLE.split(",")[1]));
			var marker = new MarkerWithLabel({
				map: this.map,
				position: new google.maps.LatLng(this.listLocations[0].LOCATION_GOOGLE.split(",")[0], this.listLocations[0].LOCATION_GOOGLE.split(",")[1]),
				// icon: {url: "assets/images/"+this.typeValue(this.listLocations[0].type)+".png", size: new google.maps.Size(25, 28),scaledSize: new google.maps.Size(25, 28)},
				icon: { url: "assets/images/" + 1 + ".png", size: new google.maps.Size(25, 28), scaledSize: new google.maps.Size(25, 28) },
				labelContent: this.listLocations[0].LOCATION_NAME,
				labelAnchor: new google.maps.Point(18, 12),
				labelClass: "my-custom-class-for-label", // your desired CSS class
				labelInBackground: true,
				zIndex: 1
			});
		}
	}

	caseNoLatLng() {
		this.latitude = this.defaultLat;
		this.longitude = this.defaultLng;
		let latLng = new google.maps.LatLng(this.latitude, this.longitude);
		this.map.setCenter(latLng);

		this.currentMarker.setMap(this.map);
		this.currentMarker.setPosition(latLng);
		this.showError(this.translateService.translate("gps.error1"));
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
		if (this.platform.is('android')) {
			var cp = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
			if (!cp.hasPermission) {
				await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
			}
		}

		if (ie) {
			if (this.platform.is('android')) {
				var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
				if (!cp2.hasPermission) {
					this.checkfail = true;
					this.errorNoPermission();
				} else {
					this._DIAGNOSTIC.getLocationMode().then(async data => {
						if (data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
							// this.isLocationAvailable();
						} else {
							var cr = await this.locationAccuracy.canRequest();
							if (cr) {
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
			} else if (this.platform.is('ios')) {
				this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
					switch (status) {
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

				if (this.page_on
					&& ((this.platform.is("android") && (locationMode !== this._DIAGNOSTIC.locationMode.LOCATION_OFF))
						|| (this.platform.is("ios") && (locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED
							|| locationMode === this._DIAGNOSTIC.permissionStatus.GRANTED_WHEN_IN_USE)))
				) {
					if (this.play_one == 0) {
						this.play_one = 1;
						let alert = this.infoChangeGPS();
						alert.onDidDismiss(async data => {
							if (this.platform.is('android')) {
								var cp2 = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
								if (!cp2.hasPermission) {
									this.errorNoPermission();
								} else {
									this._DIAGNOSTIC.getLocationMode().then(async data => {
										if (data != this._DIAGNOSTIC.locationMode.DEVICE_ONLY) {
											this.isLocationAvailable();
										} else {
											var alert = this.warningDeviceOnly();
											alert.onDidDismiss(data => {
												this._DIAGNOSTIC.switchToLocationSettings();
											});
											this.caseNoLatLng();
										}
									});
								}
							} else if (this.platform.is('ios')) {
								// this.isLocationAvailable();
								this._DIAGNOSTIC.getLocationAuthorizationStatus().then(status => {
									if (status == this._DIAGNOSTIC.permissionStatus.DENIED) {
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
				} else if (this.platform.is("ios") && locationMode === this._DIAGNOSTIC.permissionStatus.NOT_REQUESTED) {
					this._DIAGNOSTIC.requestLocationAuthorization().then(data => {
						if (data == this._DIAGNOSTIC.permissionStatus.DENIED) {
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

	isLocationAvailable() {
		var geolocationOptions = {
			enableHighAccuracy: true,
			maximumAge: 3000
		};
		this.geolocation.getCurrentPosition(geolocationOptions).then((loc: any) => {
			//Your logic here
			let latLng = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
			this.map.setCenter(latLng);

			this.currentMarker.setMap(this.map);
			this.currentMarker.setPosition(latLng);
		}).catch((error1: any) => {
			this.latitude = this.defaultLat;
			this.longitude = this.defaultLng;
			let latLng = new google.maps.LatLng(this.latitude, this.longitude);
			this.map.setCenter(latLng);

			this.currentMarker.setMap(this.map);
			this.currentMarker.setPosition(latLng);
			this.showError(this.translateService.translate("gps.error1"));
		});
	}

	typeValue(id) {
		switch (id) {
			case 1: return "stay";
			case 2: return "eat";
			case 3: return "see";
		}
	}

	chooseFromLocation(item) {
		this.from = item;
		document.getElementById("fromBox").style.display = "none";
	}
	chooseToLocation(item) {
		this.to = item;
		document.getElementById("toBox").style.display = "none";
	}

	route() {
		this.totalDistance = 0;
		this.totalTime = 0;

		//console.log(this.directionsDisplay);

		this.directionsDisplay.forEach(element => {
			element.setMap(null);
		});

		this.directCurrent.setMap(this.map);

		if (this.from.LOCATION_GOOGLE.split(",")[0] != this.to.LOCATION_GOOGLE.split(",")[0]
			&& this.from.LOCATION_GOOGLE.split(",")[1] != this.to.LOCATION_GOOGLE.split(",")[1]) {
			var request = {
				origin: new google.maps.LatLng(this.from.LOCATION_GOOGLE.split(",")[0], this.from.LOCATION_GOOGLE.split(",")[1]),
				destination: new google.maps.LatLng(this.to.LOCATION_GOOGLE.split(",")[0], this.to.LOCATION_GOOGLE.split(",")[1]),
				travelMode: google.maps.TravelMode.DRIVING
			};

			this.directionsService.route(request, (response, status) => {
				if (status == google.maps.DirectionsStatus.OK) {
					this.directCurrent.setDirections(response);
					//directionsDisplay.setOptions( { suppressMarkers: true } );
					this.directCurrent.setOptions({
						markerOptions: {
							opacity: .6,
							icon: "assets/images/current.png",
							zIndex: 99
						},
					});
					this.totalDistance = response.routes[0].legs[0].distance.text;
					this.totalTime = response.routes[0].legs[0].duration.text;
				}
			});
		} else {
			let alert = this.alertCtrl.create({
				title: this.translateService.translate("error.title"),
				subTitle: this.translateService.translate('error.invalidsame'),
				buttons: ['OK']
			});
			alert.present();
		}
	}

	openBox(ts: string) {
		if (document.getElementById(ts).style.display == "none") {
			document.getElementById(ts).style.display = "block";
		} else {
			document.getElementById(ts).style.display = "none";
		}
	}

}
