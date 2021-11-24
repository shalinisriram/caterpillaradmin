import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';


import { WorkstationsService } from '../../../providers/workstations.service';
import { PlantService } from '../../../providers/plant.service';

@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.css']
})
export class WorkstationComponent implements OnInit {
  public form: FormGroup;
  currentUser:any={}
  isTable = true;
  isEdit = false;
  isAdd = false;
  workstationlist;
  displayedColumns: string[] = ['Id', 'WorkStationName','Name', 'IsActive','Action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
   workstation:any={
    "WorkStationName" :"",
    "PlantName" : ""
    
   }

  constructor(private fb: FormBuilder,private _plantService:PlantService ,private _workstationservice:WorkstationsService, private toastr: ToastrService, breakpointObserver :BreakpointObserver ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['Id', 'WorkStationName','Name', 'IsActive','Action'] :
        ['Id', 'WorkStationName','Name', 'IsActive','Action'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      WorkStationName: [null, Validators.compose([Validators.required])],
      PlantName: [null, Validators.compose([Validators.required])]
    });
    this.GetWorkStations();
    this.getPlants();
  }
  GetWorkStations(){
    this._workstationservice.GetWorkStations().subscribe(
     (response)=>{
       const result = response;
      this.workstationlist = result;
      this.dataSource = new MatTableDataSource<Element>(this.workstationlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     },
     (error)=>{
       console.log('GetWorkStations()',error)
     }
    );
  }

  AddWorkStation(){
    this.currentUser['WorkStationName'] = this.form.value.WorkStationName,
    this.currentUser['PlantName'] = this.form.value.PlantName,
    this._workstationservice.AddWorkStation(this.workstation).subscribe(
      (response)=>{
       const result = response;
       this.GetWorkStations();
       this.isTable = true;
       this.isAdd = false;
       this.toastr.success('Plant added', 'Success');
      },
      (error)=>{
        console.log('AddWorkStation()',error)
      }
    );
  }
  editworkstation={
    'WorkStationName':'',
'PlantName' : ''

  }
  UpdateWorkStation() {
  this._workstationservice.UpdateWorkStation(this.editworkstation).subscribe(
    (response)=>{
     this.toastr.success('workstation Updated Successfully','Success');
     this.GetWorkStations();
     this.isEdit = false;
     this.isTable  = true;
    },
    (error)=>{

    }
  );
  }

  deleteWorkStations(element) {
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
        this._workstationservice.deleteWorkStations(element.id).subscribe(
          (response) => {
            this.GetWorkStations();
            Swal.fire(
              'Deleted!',
              'Plant  has been deleted.',
              'success'
            );
          },
          (error) => {
            console.log('deleteWorkStations()', error)
          }
        );
      }
    });
  }

  showUpdateForm(workstation) {
    this.isTable = false;
    this.isEdit = true;
    this.editworkstation.WorkStationName = workstation.workStationName;
    this.editworkstation.PlantName = workstation.Name;
   
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  calplantlist;
  getPlants(){
    this._plantService.getPlants().subscribe(
     (response)=>{
       const result = response;
      this.calplantlist = result
     },
     (error)=>{
       console.log('getPlants()',error)
     }
    );
  }




}
export interface Plant {
  id: string;
  workStationName: string;
  isActive: string
}

