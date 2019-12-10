import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImgurService {

  constructor(private _httpClient: HttpClient) { }

  registerApplication(image) {
    //Get client_id
    console.log("Getting client id");
    let headers = new HttpHeaders();
    headers.set('Authorization','Client-ID bb9a76769ed64d0');
    //headers.set('Access-Control-Allow-Origin:', '*');
    headers.set('Content-Type','image/jpeg');
    let body = new FormData();
    body.append("image", image); //"https://vignette.wikia.nocookie.net/vsbattles/images/3/37/Doraemon_renderImproved.png/revision/latest?cb=20190730170109"
    return this._httpClient.post(
      'https://api.imgur.com/3/upload',
      body,
      {
        headers: headers
      }).subscribe((data) => {
        console.log("DATA: " + data);
      }
    );
  }
}
