import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ARView } from '../pages/ar-view/ar-view';

import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { EmailComposer } from '@ionic-native/email-composer/ngx';
/**
 * Services
 */
import { IonicStorageModule } from '@ionic/storage';
import { ExchangeRateService, AudioRecorder, AuthService, Services, EventService, HobbyService, ServiceGetting, SearchLocationService, RestaurantService, HotelService, SightSeeingService, UltilitiesService, PlanService, ShoppingService, WeatherService } from '../providers';
import { ShowUserInfo } from '../providers/show-user-info';
import { Geolocation } from '@ionic-native/geolocation';
import { MediaPlugin } from '@ionic-native/media';
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { TRANSLATION_PROVIDERS, TranslateService, TranslatePipe } from '../translate';
import { DateFormatPipe, ImgageUrlPipe } from '../extensions';
import {SpeechRecognition} from  '@ionic-native/speech-recognition';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AppAvailability } from '@ionic-native/app-availability';

/**
 * Pages
 */
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MapPage } from '../pages/map/map';
import { EventShowPage } from '../pages/event-show/event-show';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { LookUpPage } from '../pages/look-up/look-up';
import { SettingPage } from '../pages/setting/setting';
import { SettingLanguagePage } from '../pages/setting/setting-language';
import { ContactPage } from '../pages/contact/contact';

import { HotelDetailPage } from '../pages/hotel-detail/hotel-detail';
import { RestaurantDetailPage } from '../pages/restaurant-detail/restaurant-detail';
import { BookingHotelPage } from '../pages/booking-hotel/booking-hotel';
import { BookingRestaurantPage } from '../pages/booking-restaurant/booking-restaurant';

import { PlanPage } from '../pages/plan/plan';
import { PlanV2Page } from '../pages/plan-v2/plan-v2';
import { PlanDetailPage } from '../pages/plan-detail/plan-detail';
import { PlanDirectionPage } from '../pages/plan-direction/plan-direction';
import { PlanDateDetailPage } from '../pages/plan-date-detail/plan-date-detail';
import { PlanAddLocationPage } from '../pages/plan-add-location/plan-add-location';
import { PlanSavedListPage } from '../pages/plan-saved-list/plan-saved-list';
import { LocationMapShowPage } from '../pages/location-map-show/location-map-show';
import { PlanChoicePage } from '../pages/plan-choice/plan-choice';
import { PlanDateChoicePage } from '../pages/plan-date-choice/plan-date-choice';
import { MapRoutePage } from "../pages/map-route/map-route";
import { SightSeeingPage } from "../pages/sight-seeing/sight-seeing";
import { OverViewPage } from "../pages/over-view/over-view";

import { MapChoosenPage } from '../pages/map-choosen/map-choosen';
import { QuickBookingPage } from '../pages/quick-booking/quick-booking';
import { MapQuickBookingPage } from '../pages/map-quick-booking/map-quick-booking';
import { RecorderPage } from '../pages/recorder/recorder';
import { CameraPage } from '../pages/camera/camera';
import { CameraEmotionPage } from '../pages/camera-emotion/camera-emotion';
import { SearchLocationPage } from "../pages/search-location/search-location";
import { UserPage } from "../pages/user/user";
import { UserBookingPage } from "../pages/user-booking/user-booking";
import { UserHobbiesPage } from "../pages/user-hobbies/user-hobbies";
import { UserChangeInfoPage } from "../pages/user-change-info/user-change-info";
import { UserShowInfoPage } from "../pages/user-show-info/user-show-info";
import { UtilityTypeListPage } from "../pages/utility-type-list/utility-type-list";
import { UtilityLocationListPage } from "../pages/utility-location-list/utility-location-list";
import { UtilityLocationDetailPage } from "../pages/utility-location-detail/utility-location-detail";
import { ListPlanPage } from "../pages/plan-list/plan-list";
import { PlanDateEditPage } from "../pages/plan-date-edit/plan-date-edit";
import { PlanNewEmptyPage } from "../pages/plan-new-empty/plan-new-empty";
import { BookingDetailPage } from "../pages/booking-detail/booking-detail";
import { UserImagesPage } from "../pages/user-images/user-images";
import { LocationLookupPage } from "../pages/location-lookup/location-lookup";
import { UserFeedbackDetailPage } from "../pages/user-feedback-detail/user-feedback-detail";
import { UserRateDetailPage } from "../pages/user-rate/user-rate";
import { ShoppingListPage } from "../pages/shopping/shopping";
import { ShopDetailPage } from "../pages/shop-detail/shop-detail";
import { WeatherPage } from "../pages/weather/weather";
import { ExchangeRatePage } from "../pages/exchange-rate/exchange-rate";
import { UserComplaintPage } from "../pages/user-complaint/user-complaint";
import { TranslateLanguagePage } from "../pages/translate-language/translate-language";

//Components
import { IonCustomNavBotComponent } from "../components/ion-custom-nav-bot/ion-custom-nav-bot";

import { UserWishListPage } from "../pages/user-wishlist/user-wishlist";

//login facebook
import { Facebook } from '@ionic-native/facebook';

//login google
import { GooglePlus } from '@ionic-native/google-plus';

import { UserNotePage } from "../pages/user-note/user-note";
import { TourArPage } from "../pages/tour-ar/tour-ar";
import { ListNotePage } from "../pages/list-note/list-note";
import { AdviceListPage } from '../pages/advice-list/advice-list';
import { InfoDetailPage } from '../pages/page-info-detail/page-info-detail';
import { NoticeListPage } from '../pages/notice-list/notice-list';
import { NoticeDetailPage } from '../pages/notice-detail/notice-detail';
import { TourGuideSearchPage } from '../pages/tour-guide-search/tour-guide-search';
import { TourGuideService } from '../providers/tourguide-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DetailPromotionPage } from '../pages/promotion-modal/promotion-modal';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ChartPage } from '../pages/chart/chart';
import { LookUpEntertainmentNightlifePage } from '../pages/look-up-entertainment-nightlife/look-up-entertainment-nightlife';
import { EntertainmentDetailPage } from '../pages/entertainment-detail/entertainment-detail';
import { NewsPage } from '../pages/news/news';

@NgModule({
    declarations: [
        MyApp,
        //components
        IonCustomNavBotComponent,
        //pipe
        TranslatePipe,
        DateFormatPipe,
        ImgageUrlPipe,
        //pages
        LoginPage,
        ContactPage,
        RegisterPage,
        MapPage,
        EventShowPage,
        EventDetailPage,
        LookUpPage,
        SettingPage,
        SettingLanguagePage,
        HotelDetailPage,
        RestaurantDetailPage,
        BookingHotelPage,
        BookingRestaurantPage,
        PlanPage,
        PlanDetailPage,
        PlanDateDetailPage,
        PlanDirectionPage,
        PlanAddLocationPage,
        PlanSavedListPage,
        LocationMapShowPage,
        PlanChoicePage,
        PlanDateChoicePage,
        MapRoutePage,
        SightSeeingPage,
        OverViewPage,
        QuickBookingPage,
        MapQuickBookingPage,
        RecorderPage,
        SearchLocationPage,
        UserPage,
        UserBookingPage,
        UserChangeInfoPage,
        UserHobbiesPage,
        UtilityTypeListPage,
        UtilityLocationListPage,
        UtilityLocationDetailPage,
        ListPlanPage,
        PlanDateEditPage,
        PlanNewEmptyPage,
        BookingDetailPage,
        MapChoosenPage,
        CameraPage,
        UserImagesPage,
        CameraEmotionPage,
        LocationLookupPage,
        UserRateDetailPage,
        PlanV2Page,
        UserFeedbackDetailPage,
        ShoppingListPage,
        ShopDetailPage,
        UserWishListPage,
        WeatherPage,
        ExchangeRatePage,
        UserComplaintPage,
        TranslateLanguagePage,
        UserShowInfoPage,
        UserNotePage,
        TourArPage,
        ListNotePage,
        ARView,
        AdviceListPage,
        InfoDetailPage,
        NoticeListPage,
        NoticeDetailPage,
        TourGuideSearchPage,
        DetailPromotionPage,
        ChartPage,
        LookUpEntertainmentNightlifePage,
        EntertainmentDetailPage,
        NewsPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        RegisterPage,
        MapPage,
        EventShowPage,
        EventDetailPage,
        LookUpPage,
        SettingPage,
        SettingLanguagePage,
        HotelDetailPage,
        RestaurantDetailPage,
        BookingHotelPage,
        BookingRestaurantPage,
        PlanPage,
        PlanV2Page,
        PlanDetailPage,
        PlanDateDetailPage,
        PlanDirectionPage,
        PlanAddLocationPage,
        PlanSavedListPage,
        LocationMapShowPage,
        PlanChoicePage,
        PlanDateChoicePage,
        MapRoutePage,
        SightSeeingPage,
        OverViewPage,
        QuickBookingPage,
        MapQuickBookingPage,
        RecorderPage,
        SearchLocationPage,
        UserPage,
        UserBookingPage,
        UserChangeInfoPage,
        UserHobbiesPage,
        UtilityTypeListPage,
        UtilityLocationListPage,
        UtilityLocationDetailPage,
        ListPlanPage,
        PlanDateEditPage,
        PlanNewEmptyPage,
        BookingDetailPage,
        MapChoosenPage,
        CameraPage,
        UserImagesPage,
        CameraEmotionPage,
        LocationLookupPage,
        UserRateDetailPage,
        UserFeedbackDetailPage,
        ShoppingListPage,
        ShopDetailPage,
        UserWishListPage,
        WeatherPage,
        ExchangeRatePage,
        UserComplaintPage,
        TranslateLanguagePage,
        UserShowInfoPage,
        UserNotePage,
        TourArPage,
        ListNotePage,
        ARView,
        AdviceListPage,
        InfoDetailPage,
        NoticeListPage,
        NoticeDetailPage,
        TourGuideSearchPage,
        DetailPromotionPage,
        ChartPage,
        LookUpEntertainmentNightlifePage,
        EntertainmentDetailPage,
        ContactPage,
        NewsPage,
    ],
    providers: [
     // EmailComposer,
        StatusBar,
        SplashScreen,
        AuthService,
        ShowUserInfo,
        Services,
        TRANSLATION_PROVIDERS,
        TranslateService,
        Geolocation,
        MediaPlugin,
        Camera,
        File,
        Transfer,
        ScreenOrientation,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        EventService,
        HobbyService,
        ServiceGetting,
        SearchLocationService,
        RestaurantService,
        HotelService,
        SightSeeingService,
        UltilitiesService,
        AudioRecorder,
        PlanService,
        ShoppingService,
        WeatherService,
        Diagnostic,
        ExchangeRateService,
        SpeechRecognition,
        Facebook,
        AppVersion,
        Market,
        InAppBrowser,
        GooglePlus,
        UniqueDeviceID,
        TourGuideService,
        BarcodeScanner,
        LocationAccuracy,
        AndroidPermissions,
        AppAvailability
    ]
})
export class AppModule { }
