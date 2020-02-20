import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators'
const URL_login = 'https://api.opensensemap.org/users/sign-in';
const URL_user = 'https://api.opensensemap.org/users/me/boxes';

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
        let msg = err.message
        if (err.name === 'TimeoutError')
          msg = 'unable to contact api. are you online?'

        try {
          // attempt to extract the compilation error message and clean it up
          console.error(err)
          msg = JSON.parse(err.error.message)
          if (msg.process) {
            msg = `compilation error: ${msg.process.substr(msg.process.indexOf(' '))}`
            msg = msg.substr(0, msg.indexOf('^'))
          }
        } catch (err2) {
          console.error(err2)
        }
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
}
