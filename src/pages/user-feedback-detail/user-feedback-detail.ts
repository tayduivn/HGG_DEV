import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { ActionSheetController } from 'ionic-angular';
import { PageBase, Services, ShowUserInfo, UltilitiesService } from '../../providers';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';

import { TranslateService } from "../../translate";

import { CameraChossenPage } from "../camera-chossen/camera-chossen";
import { ToastController } from 'ionic-angular';
import { Parameter } from '../../model/Service';


@Component({
    selector: 'page-user-feedback-detail',
    templateUrl: 'user-feedback-detail.html',
})
export class UserFeedbackDetailPage extends PageBase {
    public todo: FormGroup;

    objectId: string;
    typeId: string;
    type: any;
    ip: string;
    list = [];
    name: string = "";
    feedbackType: number = 1;
    listImages = [];
    typeName = "";
    typeValue = "";
    options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: true,
        correctOrientation: true
    };
    formData: FormData = new FormData();
    files: Array<{ Name: any, image: any }> = [];
    platformios: boolean = true;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public showUserInfo: ShowUserInfo,
        private formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController,
        private _translate: TranslateService,
        public alertCtrl: AlertController,
        public http: Http,
        public camera: Camera,
        public file: File,
        public toastController: ToastController,
        public UltilitiesService: UltilitiesService,
        public platform: Platform
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
        this.objectId = navParams.get('objectId');
        this.typeId = navParams.get('typeId');
        this.typeName = "Doanh nghiệp";
        this.typeValue = navParams.get('name');
        // switch (this.typeId) {
        //     case '1':
        //         this.typeName = "Khách sạn";
        //         break;
        //     case '2':
        //         this.typeName = "Nhà hàng";
        //         break;
        //     case '3':
        //         this.typeName = "Di";
        //         break;
        //     default:
        //         break;
        // }
        this.name = navParams.get('name');
        this.ip = Services.Ip;
        this.todo = this.formBuilder.group({
            Subject: ['', [Validators.required]],
            Content: ['', [Validators.required]],
        });
        this.platformios = this.platform.is("ios");
    }



    init() {
        // this.showLoading();
        // var data = {
        //     "Object_Type": this.typeId,
        //     "Feedback_Type": this.feedbackType,
        //     "Object_Id": this.objectId
        // };
        // this.http.post(Services.ServerURL('Management/Feedback/GetList'), data, { headers: Services.ContentHeaders })
        //     .map(m => Services.extractResult(m)).subscribe(
        //     data => {
        //         if (data.Code === 200) {
        //             setTimeout(() => {
        //                 this.loading.dismiss();
        //                 this.list = data.Result;
        //             });
        //         } else {
        //             this.showError(data.Message);
        //         }
        //     },
        //     error => {
        //         this.showError(this.translateService.translate("network.error"));
        //     });
    }


    takePicture() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.listImages.push(imageData);
            this.uploadPhoto(imageData);
        }, (err) => {
            //console.log(err);
        });
    }
    chooseCamera() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Chọn hình ảnh',
            buttons: [
                {
                    text: 'Từ máy ảnh',
                    handler: () => {
                        this.options = {
                            quality: 80,
                            destinationType: this.camera.DestinationType.FILE_URI,
                            sourceType: this.camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            encodingType: this.camera.EncodingType.JPEG,
                            saveToPhotoAlbum: true,
                            correctOrientation: true
                        };
                        this.takePicture();
                    }
                }, {
                    text: 'Từ Albums',
                    handler: () => {
                        this.options = {
                            quality: 80,
                            destinationType: this.camera.DestinationType.FILE_URI,
                            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: this.camera.EncodingType.JPEG,
                            saveToPhotoAlbum: true,
                            correctOrientation: true
                        };
                        this.takePicture();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        //console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    submit() {
        this.showLoading();
        let contentHeaders = new Headers();
        contentHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        contentHeaders.append('UnitCode', Parameter.portalcode);
        // contentHeaders.append("Content-Type", "multipart/form-data");

        this.formData = new FormData();
        //let formData: FormData = new FormData();

        //formData.append('Files[]', this.file[0], this.file[0].name);
        //formData.append('Info', JSON.stringify(this.todo.value));
        for (let i = 0; i < this.files.length; i++) {
            this.formData.append('Files[]', this.files[i].image, this.files[i].Name);
        }

        for (let key in this.todo.value) {
            if (this.todo.value.hasOwnProperty(key)) {
                this.formData.append(key, this.todo.value[key]);
            }
        }

        this.http.post(Services.ServerURL('ComplaintGuest/Insert'), this.formData, { headers: contentHeaders })
            .map(m => Services.extractResult(m))
            .subscribe(
            data => {

                if (data.Code == 200) {
                    setTimeout(() => {
                        this.loading.dismiss();
                    });
                    let toast = this.toastController.create({
                        message: 'Báo cáo thành công!',
                        position: 'middle',
                        duration: 3000
                    });
                    toast.present();
                    this.navCtrl.pop();
                } else {
                    this.showError("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
                    //console.log(data.Message);
                }
            },
            error => {
                this.showError("Vui lòng kiểm tra lại kết nối Internet!");
                //console.log(error);
            }
            );
    }
    private uploadPhoto(imageFileUri: any): void {
        this.showLoading();
        this.file.resolveLocalFilesystemUrl(imageFileUri)
            .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
            .catch(err => this.showError(JSON.stringify(err)));
    }

    private readFile(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            //const formData = new FormData();
            const imgBlob = new Blob([reader.result], { type: file.type });
            this.files.push({ Name: file.name, image: imgBlob });
            this.loading.dismiss();
            //this.postData(formData);
        };
        reader.readAsArrayBuffer(file);
    }
}
