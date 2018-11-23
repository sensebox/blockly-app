import { HttpClient,HttpHeaders }  from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { BindingFlags } from '@angular/core/src/view';

/*
  Generated class for the CompilerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const url = "https://compiler.sensebox.de"

@Injectable()
export class CompilerProvider {
  
  constructor(public http: HttpClient) {
    console.log('Hello CompilerProvider Provider');
  }
  
async callcompiler(sketch : string): Promise<any> {
  let Headers =  new HttpHeaders({'Content-Type': 'application/json'} );
  
  /*let options = new RequestOptions({ headers: headers });*/
  
    let data ={"board":"sensebox-mcu", "sketch":sketch}
    return  this.http.post(`${url}/compile`, data,{ headers:new HttpHeaders({'Content-Type': 'application/json'} ) })
    .toPromise()
    .then((response:any) =>{
      console.log('API Response : ', response.data.id);
      return  this.http.get(`${url}/download?id=${response.data.id}&board=sensebox-mcu`,{
        responseType: 'text',
      })
      .toPromise()
             
    });
  };
}