import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material';
import { AdminecmService } from '../../../providers/adminecm.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ecmdepartment',
  templateUrl: './ecmdepartment.component.html',
  styleUrls: ['./ecmdepartment.component.css']
})
export class EcmdepartmentComponent implements OnInit {
  dataSource = new MatTableDataSource<processData>();
  constructor(private _adminecm:AdminecmService,
              private toasterService: ToastrService,) { }
  displayedColumns = ['DepartmentName','IsActive','Select']
  departments:any={
    "Id": 0,
    "DepartmentName": "",
    "isActive": true,
    "Ids": [
      0
    ]
  }
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  isAdd =false;
  isTable= true;
  isEdit=false;
  departmentList:any=[]

  getDepartment()
  {
    this._adminecm.getDepartment().subscribe(
      (response)=>
      {
        const result = response;
        if(result.code)
        {
          this.departmentList = result.data
          this.dataSource = new MatTableDataSource<any>(this.departmentList);
        }
        else
        {
          this.departmentList = []
        }
      }
    )
  }

  addDepartment(f:NgForm)
  {
    this._adminecm.addDepartment(this.departments).subscribe(
      (response)=>
      {
        const result =response
        if(result.code)
        {
          this.toasterService.success(result.message, 'Success');
          this.getDepartment();
        } else {
          this.toasterService.error(result.message, "Error");
          this.getDepartment();
        }
      },
      (error) => {
        console.log('addDepartment()', error)
      }
    )

    this.getDepartment();
    this.isTable = true;
    this.isAdd=false
  }

  showUpdateForm(departments) {
    this.departments = { ...departments };
    this.isTable = false;
    this.isEdit = true;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

  
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
  deleteDepartment() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
        this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
        title: 'Info',
        text: 'Do you want to delete the selected Department?',
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        showCloseButton: true
    }).then((result) => {
        if (result.value) {
            const obj = {
                'Ids': this.selectedItemIds
            }
            this._adminecm.deleteDepartment(obj).subscribe(
                (response) => {
                    const result = response;
                    if (result.code) {
                        Swal.fire(
                            'Deleted!',
                            'Departments have been deleted!',
                            'success'
                        );
                        this.selection = new SelectionModel<any>(true, []);
                        this.getDepartment();
                    } else {
                        this.toasterService.error(result.message, 'Error')
                        this.getDepartment();
                    }
                },
                (error) => {
                    console.log('deleteDepartment()', error)
                }
            );
        }
    });

}
editDepartment(f:NgForm)
{
  this._adminecm.editDepartment(this.departments).subscribe(
    (response) =>
    {
      const result = response
      if(result.code)
      {
        this.toasterService.success(result.message,"sucess")
      }
      else{
        this.toasterService.error(result.message,'error')
      }
    }
  ),
  (error)=>{
    console.log("editDepartment");
  }
  this.getDepartment();
  this.isEdit = false;
  this.isTable = true;
}
  
  ngOnInit() {
    this.getDepartment();
  }

}
export interface processData {
  DepartmentName: string,
  IsActive:Boolean,
  Ids:[]
}