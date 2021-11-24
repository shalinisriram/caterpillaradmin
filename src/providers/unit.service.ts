import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

const unitUrl = environment.unitUrl;
@Injectable()
export class UnitService {
  constructor(private _httpClient: HttpClient) { }

  getUnits(currentUser) {
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/LineLoad?UserName='+currentUser)
  }

  addUnit(obj) {
    return this._httpClient.post<itemResponse>(unitUrl + 'Unit/LineLoadNumbers', obj)
  }
  getAreaWithSection(obj)
  {
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/GetAllAreaWithSection?section='+obj)
  }
  joinUnit(obj) {
    return this._httpClient.post<itemResponse>(unitUrl + 'Unit/Join', obj)
  }
  getLineLoad(obj)
  {
    return this._httpClient.post<itemResponse>(unitUrl + 'Unit/getSerialNumber' , obj)
  }
  getSections(currentUser) {
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/SectionsList?UserName='+currentUser)
  }
  AddSchedulingUnit(obj)
  {
    return this._httpClient.post<itemResponse>(unitUrl + 'Unit/AddSchedulingUnit' , obj)

  }

  EditSchedulingUnit(obj)
  {
    return this._httpClient.post<itemResponse>(unitUrl + 'Unit/EditSchedulingUnit' , obj)

  }
  getStation(obj)
  {
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/StationList?AreaName=' + obj)
  }
  GetSchedulingUnits(NameArea)
  {

    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/getSchedulingUnit?AreaName='+NameArea)

  }


  getModels(section,currentUser) {
    console.log(section)
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/ModelList?section=' + section +'&UserName='+currentUser)
  }

  getComponents(obj) {
    return this._httpClient.post<itemResponse>(unitUrl + 'Unit/ComponentList',obj)
  }

  getLoadNumbers(Component) {
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/GetLineLoadNumber?Component=' + Component)
  }

 

  getAreas(username) {
    return this._httpClient.get<itemResponse>(unitUrl + 'Unit/GetArea?UserName=' + username)
  }

  getOperators(obj){
    return this._httpClient.post<itemResponse>(unitUrl + 'unit/Operators',obj)
  }

  updateUnit(obj){
    return this._httpClient.post<itemResponse>(unitUrl + 'Admin/UpdateUnit',obj);
  }

  deleteUnits(obj){
    return this._httpClient.post<itemResponse>(unitUrl + 'Admin/DeleteMultipleUnit',obj);
  }

  deleteScheduleUnits(obj){
    return this._httpClient.post<itemResponse>(unitUrl + 'Admin/DeleteMultipleScheduleUnit',obj);
  }

  GetAllComponent() {
    return this._httpClient.get<itemResponse>(unitUrl + 'Admin/AllComponent');
  }

  GetAllModel(section,user) {
    return this._httpClient.get<itemResponse>(unitUrl + 'Admin/ModelList?section=' + section +'&username='+user);
  }
  GetAllComponents(section,user) {
    return this._httpClient.get<itemResponse>(unitUrl + 'Admin/ComponentList?ModelName=' + section +'&UserName='+user);
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
