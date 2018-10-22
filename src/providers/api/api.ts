import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private API_URL = 'https://api.testing.opensensemap.org'

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }


  getData(){
    return this.http.get(`${this.API_URL}/boxes/5b0d436fd40a290019ef444d`);
  }

}
