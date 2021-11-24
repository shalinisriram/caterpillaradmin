import { Component, OnInit, ViewChild } from '@angular/core';
import { StationService } from '../../../providers/station.service';
import { AreaService } from '../../../providers/area.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  displayedColumns = ['Id','AreaName', 'StationName','Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _station:StationService,private _area:AreaService,
    private toastr:ToastrService) { }

  stations:any=[]
  station:any=
    {
      "Id": 0,
      "AreaName": "",
      "StationName": ""
    }
  areas:any=[]
  getArea()
  {
    this._area.getAreas().subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.areas = result.data
        }
        else
        {
          this.areas=[]
        }
      }
    );(error)=>{
      console.log("getarea()")
    }
  }

  getStation()
  {
    this._station.getstations().subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.stations=result.data
          this.dataSource = new MatTableDataSource<any>(this.stations);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else
        {
          this.stations=[]
        }
      }
    );(error)=>{
      console.log("getStations()")
    }
  }

  addStation(f:NgForm)
  {
    this._station.addstations(this.station).subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.toastr.success(result.message,"sucess")
          this.getStation()
        } 
        else{
          this.toastr.error(result.message,"error")
        }
      }
    )

    this.isTable=true
    this.isAdd=false
    this.getStation()
  }

  UpdateStation(f:NgForm)
  {
    this._station.updateStation(this.station).subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.toastr.success(result.message,"sucess")
          this.getStation()
        } 
        else{
          this.toastr.error(result.message,"error")
        }
        
      }
    )
    this.isTable=true
    this.isEdit=false
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  id
  DeleteStation()
  {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      console.log(ele)
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected station?',
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
        this.selectedItemIds.forEach(element=>
          {    
            this._station.deletestation(element).subscribe(
              (response) => {
                const result = response;
                if (result.code) {
                  Swal.fire(
                    'Deleted!',
                    'Stations have been deleted!',
                    'success'
                );
                 this.getStation();
                } else {
                  this.toastr.error(result.message ,'Error');
                  this.getStation();
                }
              },
              (error) => {
                console.log(error, 'deletesation()');
              }
            );;
          })
      }
    });
  }
  isTable = true
  isAdd=false
  isEdit = false
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  showUpdateForm(plant) {
    this.station = { ...plant };
    this.isTable = false
    this.isEdit = true;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngOnInit(): void {
  this.getArea();
  this.getStation();
  }

}
