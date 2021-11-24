import { Component, OnInit, ViewChild } from '@angular/core';

import { BreakpointObserver } from '@angular/cdk/layout';

import { ToastrService } from 'ngx-toastr';

import { CatserialService } from '../../../providers/catserial.service';
import { CatmodelService } from '../../../providers/catmodel.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-catserial',
  templateUrl: './catserial.component.html',
  styleUrls: ['./catserial.component.css']
})
export class CatserialComponent implements OnInit {
  public form: FormGroup;
  currentUser:any={}
  isTable = true;
  isEdit = false;
  isAdd = false;
  catseriallist;
  displayedColumns: string[] = ['Id', ' SerialNumber', 'IsActive','CATModelName','CustomerInformation','Action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  catserial: any = {
    "SerialNumber": "",
    // "IsActive": "",
    "CustomerInformation": "",
    "CATModelName": ""

  }

  constructor(private fb: FormBuilder,private _catserialservice: CatserialService,
    breakpointObserver: BreakpointObserver, private toastr: ToastrService,
    private _catmodelservice: CatmodelService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['Id', ' SerialNumber', 'IsActive', 'CATModelName','CustomerInformation','Action'] :
        ['Id', ' SerialNumber', 'IsActive', 'CATModelName','CustomerInformation','Action'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      SerialNumber: [null, Validators.compose([Validators.required])],
      CustomerInformation: [null, Validators.compose([Validators.required])],
      CATModelName: [null, Validators.compose([Validators.required])]
    });
    this.GetCatSerial();
    this.getCatModel()
  }
  GetCatSerial() {
    this._catserialservice.GetCatSerial().subscribe(
      (response) => {
        const result = response;
        this.catseriallist = result;
        this.dataSource = new MatTableDataSource<Element>(this.catseriallist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log('GetCatSerial()', error)
      }
    );
  }

  AddCATSerial() {
    this.currentUser['SerialNumber'] = this.form.value.SerialNumber,
    this.currentUser['CustomerInformation'] = this.form.value.CustomerInformation,
    this.currentUser['CATModelName'] = this.form.value.CATModelName,
    this._catserialservice.AddCATSerial(this.catserial).subscribe(
      (response) => {
        const result = response;
        this.GetCatSerial();
        this.isTable = true;
        this.isAdd = false;
        this.toastr.success('CatSerial  added', 'Success');
      },
      (error) => {
        console.log('AddCATSerial()', error)
      }
    );
  }
  editcatserial={
    'SerialNumber' : '',
    'IsActive' : '',
    'CustomerInformation' : '',
    'CATModelName' : ''
    
    
  }
  updateCATserial() {
    this._catserialservice.updateCatserial(this.editcatserial).subscribe(
      (response)=>{
       this.toastr.success('Plant Updated Successfully','Success');
       this.GetCatSerial();
       this.isEdit = false;
       this.isTable  = true;
      },
      (error)=>{
  
      }
    );
    }
  
    deleteCATserial(element) {
      Swal.fire({
        title: 'Info',
        text: 'Do you want to Delete Plant',
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        showCloseButton: true
      }).then((result) => {
        if (result.value) {
          this._catserialservice.deleteCatserial(element.id).subscribe(
            (response) => {
              this.GetCatSerial();
              Swal.fire(
                'Deleted!',
                'catserial   has been deleted.',
                'success'
              );
            },
            (error) => {
              console.log('deleteCATserial()', error)
            }
          );
        }
      });
    }
  
    showUpdateForm(catserial) {
      this.isTable = false;
      this.isEdit = true;
      this.editcatserial.SerialNumber = catserial.SerialNumber;
      this.editcatserial.CustomerInformation = catserial.CustomerInformation;
      this.editcatserial.CATModelName = catserial.CATModelName;
    }
  
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }
  
  calModelList;

  getCatModel() {
    this._catmodelservice.getModels().subscribe(
      (response) => {
        const result = response;
        this.calModelList = result
      },
      (error) => {
        console.log('getCatModel()', error)
      }
    );
  }




}
export interface Plant {
  id: string;
  serialNumber: string;
  isActive: string
}
