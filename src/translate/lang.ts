import { GeneralLanguage } from './general.lang';
import { GeneralSupportLanguage } from './general-support.lang';

// import { NationalLanguage } from '../management/national/national.language';
// import { LoginLanguage } from '../login/login.language';
// import { AreaLanguage } from '../restaurant/area/area.language';
// import { RestaurantTypeLanguage } from '../restaurant/restauranttype/restauranttype.language';

export class Language {
    public static get LANG_EN_NAME(): any {
        return 'en';
    }
    public static get LANG_VN_NAME(): any {
        return 'vi';
    }

    public static get LANG_VN_TRANS(): any {
        var lang = {};
        lang = Object.assign(
            GeneralLanguage.Lang_Vn,
            GeneralSupportLanguage.Lang_Vn,
        );
        return lang;
    }

    public static get LANG_EN_TRANS(): any {
        var lang = {};
        lang = Object.assign(
            GeneralLanguage.Lang_En,
            GeneralSupportLanguage.Lang_En,
        );
        return lang;
    }
}
