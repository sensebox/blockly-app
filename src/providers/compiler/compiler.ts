import { HttpClient,HttpHeaders }  from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CompilerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CompilerProvider {
  
  constructor(public http: HttpClient) {
    console.log('Hello CompilerProvider Provider');
  }
  
async callcompiler(Binary : string): Promise<any> {
  let Headers =  new HttpHeaders({'Content-Type': 'application/json'} );
  
  /*let options = new RequestOptions({ headers: headers });*/
  
    let data ='{"board":"sensebox-mcu", "sketch":"void setup() {\nSerial.begin(9600);\nSerial.println(\"Hello World\");\n}\nvoid loop() {}"}'
    
    return  this.http.post('url', data,{ headers:new HttpHeaders({'Content-Type': 'application/json'} ) })
    .toPromise()
    .then((response) =>
      {
      console.log('API Response : ', response.json());
      return response.json();
      })
   
    };
  };
  /* .catch((error) =>
    {
      console.error('API Error : ', error.status);
      console.error('API Error : ', JSON.stringify(error));
      reject(error.json()); */