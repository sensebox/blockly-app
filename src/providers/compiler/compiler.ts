import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators'

// const URL = "https://compiler.sensebox.de"
const URL = "http://compiler.snsbx.nroo.de"

@Injectable()
export class CompilerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CompilerProvider Provider');
  }

  async callcompiler(sketch : string): Promise<ArrayBuffer> {
    const headers =  new HttpHeaders({'Content-Type': 'application/json'} );
    const data = { board: 'sensebox-mcu', sketch }

    // send compilation request, returning a job ID
    return this.http.post(`${URL}/compile`, data, { headers })
      .pipe(timeout(4000))
      .toPromise()
      .catch(err => {
        let msg = 'unable to contact web compiler. are you online?'
        try {
          // attempt to extract the compilation error message and clean it up
          msg = JSON.parse(err.error.message).process
          msg = `compilation error: ${msg.substr(msg.indexOf(' ') + 14)}`
          msg = msg.substr(0, msg.indexOf('^'))
        } catch (err) {}
        throw Error(msg)
      })
      // download the resulting sketch binary
      .then((response: any) => {
        const url = `${URL}/download?id=${response.data.id}&board=sensebox-mcu`
        return this.http.get(url, { responseType: 'arraybuffer' }).toPromise()
      });
  };
}
