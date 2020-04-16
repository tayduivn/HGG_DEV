import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AudioRecorder, AudioRecorderState } from '../../providers/audiorecorder';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File, FileEntry } from '@ionic-native/file';
import { Http, Headers } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Services, PageBase, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'camera-page',
    templateUrl: 'camera.html'
})
export class CameraPage extends PageBase {

    public base64Image: string;

    public objectId = "1";
    public typeId = "2";

    options: CameraOptions = {
        quality: 60,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: true,
        correctOrientation: true
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private _translate: TranslateService,
        public showUserInfo: ShowUserInfo,
        public camera: Camera,
        public http: Http,
        public file: File,
        public UltilitiesService: UltilitiesService
    ) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
        this.objectId = navParams.get('objectId');
        this.typeId = navParams.get('typeId');
    }

    checkPermissions() {
    }

    init() {
        this.takePicture();
    }

    takePicture() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.base64Image = imageData;
        }, (err) => {
            //console.log(err);
        });
    }

    changeEffect() {
        try {
            this.uploadPhoto(this.base64Image);
        } catch (err) {
            this.showError(JSON.stringify(err));
        }

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
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], { type: file.type });
            formData.append('file', imgBlob, file.name);
            formData.append('objectId', this.objectId);
            formData.append('typeId', this.typeId);
            this.postData(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    private postData(formData: FormData) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        
        this.http.post(Services.ServerURL("Management/Upload/UploadFeedBack"), formData,  { headers: headers })
            .map(response => response.json())
            .subscribe((data) => {
                if(data.Code == 200){
                    setTimeout(() => {
                        this.loading.dismiss();
                        this.navCtrl.pop();
                    });
                }else{
                    this.showError(data.Message);
                }
            }, (err) => {
                this.showError(JSON.stringify(err));
                // error
            });
    }
}
