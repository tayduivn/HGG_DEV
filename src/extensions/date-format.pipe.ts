// app/translate/translate.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
	name: 'dateFormat',
	pure: false // impure pipe, update value when we change language
})

export class DateFormatPipe implements PipeTransform {

	constructor() { }

	transform(value: string, args: string = "DD/MM/YYYY HH:mm"): any {
		if (!value) return;
		var day = moment(value);
		return day.format(args);
	}
}
