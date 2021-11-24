import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { WorkinstructionService } from '../../../providers/workinstruction.service';
import { CatmodelService } from '../../../providers/catmodel.service';
import { WorkstationsService } from '../../../providers/workstations.service';
import { AnnotationService } from '../../../providers/annotation.service';

@Component({
  selector: 'app-workinstructions',
  templateUrl: './workinstructions.component.html',
  styleUrls: ['./workinstructions.component.css']
})
export class WorkinstructionsComponent implements OnInit {
  public form: FormGroup;
  currentUser: any = {}
  isTable = true;
  isEdit = false;
  isAdd = false;
  workinstructionlist;
  displayedColumns: string[] = ['Id', 'EstimatedTime', 'IsActive', 'Link', 'CATModelName', 'SequenceNumber', 'ActualTime','workStation', 'Action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  workinstruction: any = {
    "Image": "",
    "Description": "",
    "Link": "",
    "SequenceNumber": "",
    "EstimatedTime": "",
    "ActualTime": "",
    "IsActive": "",
    "CATModelName": "",
    "WorkStationName": "",
    "Id": ""

  }

  constructor(private fb: FormBuilder, private _catmodelservice: CatmodelService, private toastr: ToastrService,
    private _annotationservice: AnnotationService,
    private _workstationservice: WorkstationsService,
    private _workinstructionservice: WorkinstructionService,
    breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['Id', 'EstimatedTime', 'IsActive', 'Link', 'CATModelName', 'SequenceNumber', 'ActualTime','workStation', 'Action'] :
        ['Id', 'EstimatedTime', 'IsActive', 'Link', 'CATModelName', 'SequenceNumber', 'ActualTime','workStation', 'Action'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      Image: [null, Validators.compose([Validators.required])],
      Description: [null, Validators.compose([Validators.required])],
      Link: [null, Validators.compose([Validators.required])],
      SequenceNumber: [null, Validators.compose([Validators.required])],
      EstimatedTime: [null, Validators.compose([Validators.required])],
      ActualTime: [null, Validators.compose([Validators.required])],

      CATModelName: [null, Validators.compose([Validators.required])],
      WorkStationName: [null, Validators.compose([Validators.required])],
      Id: [null, Validators.compose([Validators.required])],
    });
    this.GetWorkInstructions();
    this.getCatModel();
    this.GetWorkStations();
    this.getannotation();
  }
  GetWorkInstructions() {
    this._workinstructionservice.GetWorkInstructions().subscribe(
      (response) => {
        const result = response;
        this.workinstructionlist = result;
        this.dataSource = new MatTableDataSource<Element>(this.workinstructionlist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log('GetWorkInstructions()', error)
      }
    );
  }
  editworkinstruction = {
    'Image': '',
    'Description': '',
    'Link': '',
    'SequenceNumber': '',
    'EstimatedTime': '',
    'ActualTime': '',
    'IsActive': '',
    'CATModelName': '',
    'WorkStationName': ''

  }
  UpdateWorkInstruction() {
    this._workinstructionservice.UpdateWorkInstruction(this.editworkinstruction).subscribe(
      (response) => {
        this.toastr.success('workinstruction Updated Successfully', 'Success');
        this.GetWorkInstructions();
        this.isEdit = false;
        this.isTable = true;
      },
      (error) => {

      }
    );
  }

  deleteWorkInstructions(element) {
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
        this._workinstructionservice.deleteWorkInstructions(element.id).subscribe(
          (response) => {
            this.GetWorkInstructions();
            Swal.fire(
              'Deleted!',
              'workinstruction  has been deleted.',
              'success'
            );
          },
          (error) => {
            console.log('deleteWorkInstructions()', error)
          }
        );
      }
    });
  }

  showUpdateForm(workinstruction) {
    this.isTable = false;
    this.isEdit = true;
    this.editworkinstruction.EstimatedTime = workinstruction.EstimatedTime;
    this.editworkinstruction.CATModelName = workinstruction.CATModelName;
    this.editworkinstruction.SequenceNumber = workinstruction.SequenceNumber;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  calannotationlist;
  getannotation() {
    this._annotationservice.getAnnotation().subscribe(
      (response) => {
        const result = response;
        this.calannotationlist = result
      },
      (error) => {
        console.log('getannotation()', error)
      }
    );
  }

  AddWorkInstruction() {
    this.currentUser['Image'] = this.form.value.Image,
    this.currentUser['Description'] = this.form.value.Description,
    this.currentUser['Link'] = this.form.value.Link,
    this.currentUser['SequenceNumber'] = this.form.value.SequenceNumber,
    this.currentUser['EstimatedTime'] = this.form.value.EstimatedTime,
    this.currentUser['ActualTime'] = this.form.value.ActualTime,
    this.currentUser['CATModelName'] = this.form.value.CATModelName,
    this.currentUser['WorkStationName'] = this.form.value.WorkStationName,
   
    this._workinstructionservice.AddWorkInstruction(this.workinstruction).subscribe(
      (response) => {
        const result = response;
        this.GetWorkInstructions();
        this.isTable = true;
       this.isAdd = false;
        this.toastr.success('workinstruction added', 'Success');
      },
      (error) => {
        console.log('AddWorkInstruction()', error)
      }
    );
  }
  calmodellist;
  getCatModel() {
    this._catmodelservice.getModels().subscribe(
      (response) => {
        const result = response;
        this.calmodellist = result
      },
      (error) => {
        console.log('getCatModel()', error)
      }
    );
  }
  calstationlist;
  GetWorkStations() {
    this._workstationservice.GetWorkStations().subscribe(
      (response) => {
        const result = response;
        this.calstationlist = result
      },
      (error) => {
        console.log('GetWorkStations()', error)
      }
    );
  }

}
export interface Plant {
  id: string;
  description: string;
  isActive: string
}