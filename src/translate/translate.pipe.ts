// app/translate/translate.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../translate/translate.service'; // our translate service

@Pipe({
	name: 'translate',
	pure: false // impure pipe, update value when we change language
})

export class TranslatePipe implements PipeTransform {

	constructor(private _translate: TranslateService) { }

	transform(value: string, args: string | string[]): any {
		if (!value) return;

		var text = this._translate.instant(value, args);

		if (args != null) {
			var typeArgs = typeof args;
			if (typeArgs === 'number' || typeArgs === 'string') {
				text = text.replace('{{0}}', args as string);
			} else if (args instanceof Array) {
				for (let i = 0; i < args.length; i++) {
					text = text.replace('{{' + i + '}}', args[i]);
				}
			}
		}

		return text;
	}
}
