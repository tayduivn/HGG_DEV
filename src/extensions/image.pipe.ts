// app/translate/translate.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { UltilitiesService } from "../providers/ultilities-service";

@Pipe({
    name: 'imageUrl',
    pure: false // impure pipe, update value when we change language
})

export class ImgageUrlPipe implements PipeTransform {

    constructor(public ultilitiesService: UltilitiesService) { }

    transform(value: string, args: string = ""): any {
        //var index = value.indexOf("http");
        // var r = new RegExp('/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g');
        // if (!r.test(value)) {
        //     
        // }
        var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (!regExp.test(value)) {
            value = encodeURI(value);
            if (args == "") {
                value = localStorage.getItem('ImageServer') + value;
            } else {
                value = args + value;
            }
        } else {
        }
        return value;
    }
}
