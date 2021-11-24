import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
const uploadUrl = environment.uploadUrl;

@Injectable()
export class SectionService {

    constructor(private _httpClient: HttpClient) { }
    getSections() {
        return this._httpClient.get<itemResponse>(uploadUrl + 'Sections');
    }

    addSection(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'AddSection', obj)
    }

    updateSection(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'EditSection', obj)
    }

    deleteSections(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'DeleteSection', obj);
    }
}

export interface itemResponse {
    'status': '',
    'code': '',
    'message': '',
    'data': ''
}
