
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import moment from 'moment';

export enum AudioRecorderState {
    Ready,
    Recording,
    Recorded,
    Playing
}

@Injectable()
export class AudioRecorder {
    mediaPlugin: MediaObject = null;
    state: AudioRecorderState = AudioRecorderState.Ready;
    public nameFile: string = "";

    /**
     *
     */
    constructor(
        private platform: Platform,
        private file: File
    ) {

    }



    get MediaPlugin(): MediaObject {
        if (this.mediaPlugin == null) {
            // var date = new Date();
            // var text = moment(date).format("DD/MM/YYYYHHmm");
            // var nameFile = `recording${text}.wav`;
            // //var folder = "";

            // // if (this.platform.is("ios")) {
            // //     folder = this.file.documentsDirectory;
            // // } else {
            // //     folder = this.file.dataDirectory;
            // // }

            // //nameFile = folder + nameFile;
            // this.mediaPlugin = new MediaPlugin().create(nameFile);
            this.CreateMediaPlugin();
        }

        return this.mediaPlugin;
    }
    folder: string = "";
    CreateMediaPlugin() {
        var date = new Date();
        var text = moment(date).format("DDMMYYYYHHmmss");
        this.nameFile = text + '.mp3';

        if (this.platform.is("ios")) {
            this.folder = "../Library/NoCloud/";
            this.mediaPlugin = new MediaPlugin().create(this.folder + this.nameFile);
        } else {
            this.folder = this.file.externalRootDirectory;
            this.mediaPlugin = new MediaPlugin().create(this.nameFile);
        }



    }

    startRecording() {
        this.MediaPlugin.startRecord();
        this.state = AudioRecorderState.Recording;
    }

    stopRecording() {
        this.MediaPlugin.stopRecord();
        this.state = AudioRecorderState.Recorded;
    }

    startPlayback() {
        this.MediaPlugin.play();
        this.state = AudioRecorderState.Playing;
    }

    stopPlayback() {
        this.MediaPlugin.stop();
        this.state = AudioRecorderState.Ready;
    }
}