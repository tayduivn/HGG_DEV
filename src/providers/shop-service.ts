import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Services } from './services'
import 'rxjs/add/operator/map';
/*
  Generated class for the UltilitiesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ShoppingService {

  constructor(public http: Http) {
    //console.log('Hello UltilitiesService Provider');
  }

  public GetShoppingListPage() {
      var data = {
          "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
      };
      return this.http.post(Services.ServerURL('shop/GetListShop'), data, { headers: Services.ContentHeaders })
          .map(m => Services.extractResult(m));
  }

  public GetShopDetail(id) { //nvt lấy thông tin cho trang page lookup
      var data = {
            "ID": id,
            "CODE": "SHOP",
            "LANGUAGE_ID": localStorage.getItem('currentLangauge') // luôn luôn phải có với bất cứ api nào
      };
      return this.http.post(Services.ServerURL('shop/GetshopInfo'), data, { headers: Services.ContentHeaders })
          .map(m => Services.extractResult(m));
          
  }

  public GetShopDetailH(id: number, code: string) {
    var data = {
        "ID": id,
        "CODE": code,
        "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    };
    //console.log(data);
    return this.http.post(Services.ServerURL('PlaceGuest/GetPlaceInfo'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
}

  public GetTypeShoppingListPage() {
    //   var data = {
    //       "language_id": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    //   };
    //   return this.http.post(Services.ServerURL('Service/GetshopType'), data, { headers: Services.ContentHeaders })
    //       .map(m => Services.extractResult(m));
    var data = {
        "CODE": "SHOPTYPE",
        "LANGUAGE_ID": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
    };
    return this.http.post(Services.ServerURL('GeneralApp/GetListGeneral'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
  }
  
  public GetShopProduct(shop_id: any,code:string) {
      var data = {
        "PlaceCode": "code",
        "PlaceId": shop_id,
        "LanguageId": localStorage.getItem('currentLangauge'), // luôn luôn phải có với bất cứ api nào
      };
      return this.http.post(Services.ServerURL('PlaceGuest/GetListByPlace'), data, { headers: Services.ContentHeaders })
          .map(m => Services.extractResult(m));
  }

  public checkBookMark(id, code, type) {
    var data = {
        "ID":id,
        "CODE":code,
        "TYPE": type
    };
    return this.http.post(Services.ServerURL('PlaceGuest/CheckBookmark'), data, { headers: Services.ContentHeaders })
        .map(m => Services.extractResult(m));
}
}
