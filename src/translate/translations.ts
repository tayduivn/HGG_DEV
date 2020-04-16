// app/translate/translation.ts

import { OpaqueToken } from '@angular/core';

// import translations
//import { Language } from './lang';
import { LANG_EN_TRANS } from './lang-en';
import { LANG_VN_TRANS } from './lang-vi';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');

// all traslations
const dictionary = {
	"en": LANG_EN_TRANS,
	"vi": LANG_VN_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
	{ provide: TRANSLATIONS, useValue: dictionary },
];
