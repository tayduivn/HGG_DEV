import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AudioRecorder, AudioRecorderState } from '../../providers/audiorecorder';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File, FileEntry } from '@ionic-native/file';
import { Http, Headers } from '@angular/http';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'recorder-page',
    templateUrl: 'recorder.html'
})
export class RecorderPage {
    AudioRecorderState = AudioRecorderState;
    fileTransfer: TransferObject = this.transfer.create();
    filestring: string;
    constructor(public navCtrl: NavController,
        public alertCtrl: AlertController,
        private transfer: Transfer,
        public audioRecorder: AudioRecorder,
        private file: File,
        public http: Http
    ) {
    }

    startRecording() {
        try {
            this.audioRecorder.CreateMediaPlugin();
            this.audioRecorder.startRecording();
        }
        catch (e) {
            this.showAlert('Could not start recording.');
        }
    }

    stopRecording() {
        try {
            this.audioRecorder.stopRecording();
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: 'file_name',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            var path = this.audioRecorder.folder + this.audioRecorder.nameFile;
            this.uploadPhoto(path);
            // this.fileTransfer.upload(path, 'http://192.168.1.12:51773/api/Management/Upload/Upload', options)
            //     .then((data) => {

            //         this.showAlert("success");
            //         this.showAlert(JSON.stringify(data));
            //         // success
            //     }, (err) => {
            //         this.showAlert(JSON.stringify(err));
            //         // error
            //     });
        }
        catch (e) {
            this.showAlert('Could not stop recording.');
        }
    }

    private uploadPhoto(imageFileUri: any): void {

        this.file.resolveLocalFilesystemUrl(imageFileUri)
            .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
            .catch(err => this.showAlert(JSON.stringify(err)));
    }

    private readFile(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], { type: file.type });
            formData.append('file', imgBlob, file.name);
            this.postData(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    private postData(formData: FormData) {
        let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        //   let headers = new Headers({ 'Content-Type': 'multipart/form-data'});
        // headers.append("Authorization","Bearer KVOZAMEWM4N5GX2R27WYSCVHPP4AHHSI");
        this.http.post("http://192.168.1.12:51773/api/Management/Upload/Upload", formData, headers)
            .map(response => response.text())
            .subscribe((data) => {

                this.showAlert("success");
                this.showAlert(JSON.stringify(data));
                // success
            }, (err) => {
                this.showAlert(JSON.stringify(err));
                // error
            });
    }

    startPlayback() {
        try {
            this.audioRecorder.startPlayback();
        }
        catch (e) {
            this.showAlert('Could not play recording.');
        }
    }

    stopPlayback() {
        try {
            this.audioRecorder.stopPlayback();
        }
        catch (e) {
            this.showAlert('Could not stop playing recording.');
        }
    }

    showAlert(message) {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}
