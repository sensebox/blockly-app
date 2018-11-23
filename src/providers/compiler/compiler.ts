import { HttpClient,HttpHeaders }  from '@angular/common/http';
import { Injectable } from '@angular/core';

const URL = "https://compiler.sensebox.de"

@Injectable()
export class CompilerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CompilerProvider Provider');
  }

  async callcompiler(sketch : string): Promise<any> {
    const headers =  new HttpHeaders({'Content-Type': 'application/json'} );
    const data = { board: 'sensebox-mcu', sketch }

    // send compilation request, returning a job ID
    return this.http.post(`${URL}/compile`, data, { headers }).toPromise()
      .catch(err => {
        let msg = ''
        try { msg = JSON.parse(err.error.message).process } catch (err) {}
        throw new Error(msg || err)
      })
      .then((response:any) =>{
        // download the resulting sketch binary
        return this.http.get(`${URL}/download?id=${response.data.id}&board=sensebox-mcu`, {
          responseType: 'text',
        }).toPromise()

      });
  };
}
