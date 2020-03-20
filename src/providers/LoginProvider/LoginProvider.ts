import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators'
const URL_login = 'https://api.opensensemap.org/users/sign-in';
const URL_user = 'https://api.opensensemap.org/users/me/boxes';
const URL_sketch = 'https://api.opensensemap.org/boxes/';

// const URL = "http://compiler.snsbx.nroo.de"

@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient) { }

  async login(username:string,password:string): Promise<string> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'} );
    // send compilation request, returning a job ID
    return this.http.post(`${URL_login}?email=`+username+`&password=`+password, { headers })
      .pipe(timeout(30000))
      .toPromise()
      .catch(err => {
        console.log(err);
        let msg = err.status
        if (err.name === 'TimeoutError')
          msg = 'unable to contact api. are you online?'

        throw Error(msg)
      })
      // download the resulting sketch binary
      .then((response: any) => {
        return response.token;  
      });
  };

  async getUserBoxes(token:string):Promise<Object>{
      const headers = new HttpHeaders({'Authorization':"Bearer "+token})
      return this.http.get(URL_user,{headers})
                .pipe(timeout(30000))
                .toPromise()
                .catch(err=>{
                    let msg = err.message;
                    console.log(msg);
                })
                .then((response:any)=>{
                    return response;
                })
  }

  async getUserSketch(token:string,id:string,ssid:string,password:string):Promise<string>{
      let URL_sketch_final = URL_sketch+id+"/script";
      const headers = new HttpHeaders({'Authorization':"Bearer "+token})
      const params = new HttpParams({fromObject:{ssid,password}})
      return this.http.get(URL_sketch_final,{headers,params,responseType:'text'})
                .pipe(timeout(30000))
                .toPromise()
                .catch(err=>{
                    let msg = err.message;
                    console.log(msg);
                })
                .then((response:any)=>{
                    console.log(response);
                    return response
                })
  }
}