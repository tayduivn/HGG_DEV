import { NewsImage } from './NewsImage';

export class News {
    NEWS_IMAGE: NewsImage[];
    ID: number;
    CODE: string;
    START_DATE: any;
    END_DATE: any;
    GEO_LOCATION: string;
    ADDRESS: string;
    START_TIME: any;
    END_TIME: any;
    TITLE: string;
    CONTENT: string;
    LANGUAGE_ID: string;
    IMAGE_URL: string;
    COUNT_LIKE: number;
    NATION_ID: any;
    PROVINCE_ID: any;
    CITY_ID: any;
    
    public Status() : string {
        return this.START_DATE;
    }
}