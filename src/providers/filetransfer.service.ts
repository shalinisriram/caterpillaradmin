import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from 'rxjs';
import {switchMap} from 'rxjs/operators';
const fileUrl = environment.filetransferUrl;

@Injectable()
export class FiletransferService {

  constructor(private _httpClient:HttpClient) { }
  getFiles(){
    return  this._httpClient.get<itemResponse>( fileUrl +'/Files');
  }

 downloadSelectedFile(obj){
    return  this._httpClient.get( fileUrl +'/DownloadFile?filename='+obj,{ responseType: 'blob' });
 }
 UploadFile(obj){
   
  return  this._httpClient.post<itemResponse>( fileUrl +'/UploadFile',obj);
}
DeleteFile(filename){
  return  this._httpClient.get<itemResponse>( fileUrl +'/DeleteFile?filename='+filename);
}
getData(url: string): Observable<string> {
  return this._httpClient.get(url, { responseType: 'blob' })
    .pipe(
      switchMap(response => this.readFile(response))
    );
}

private readFile(blob: Blob): Observable<string> {
  return Observable.create(obs => {
    const reader = new FileReader();

    reader.onerror = err => obs.error(err);
    reader.onabort = err => obs.error(err);
    reader.onload = () => obs.next(reader.result);
    reader.onloadend = () => obs.complete();

    return reader.readAsDataURL(blob);
  });
}
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': []
}