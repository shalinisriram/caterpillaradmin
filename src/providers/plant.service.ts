import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;
@Injectable()
export class PlantService {
  constructor(private _httpClient: HttpClient) { }

  addPlant(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddPlants', obj);
  }

  getPlants() {
    return this._httpClient.get<itemResponse>(adminURL + '/Plants');
  }

  updatePlant(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdatePlants',obj);
  }

  deletePlants(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/DeletePlants', obj);
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}