import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImgurService {

  constructor(private _httpClient: HttpClient) { }

  registerApplication(file: File) {
    //Get client_id
    console.log("Getting client id");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization','Client-ID bb9a76769ed64d0');
    headers = headers.set('Content-Type','image/jpeg');
    let body = new HttpParams();
    body.set('binary', file.toString());
    return this._httpClient.post(
      'https://api.imgur.com/3/upload',
      file,
      {
        headers: headers
      }).subscribe((data) => {
        console.log("DATA: " + data);
      }
    );
  }
}
