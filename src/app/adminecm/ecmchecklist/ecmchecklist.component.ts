import { Component, OnInit } from '@angular/core';
import { AdminecmService } from '../../../providers/adminecm.service';
import { MatTableDataSource } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Data } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ecmchecklist',
  templateUrl: './ecmchecklist.component.html',
  styleUrls: ['./ecmchecklist.component.css']
})
export class EcmchecklistComponent implements OnInit {
  constructor(private _adminecm:AdminecmService,
    private toasterService: ToastrService,) { }
    displayedColumns = ['CheckPoints','ProcessName','CreatedTimeStamp','IsActive','Select']
  checkList:any=[]
  dataSource:any = []
  isAdd =false;
  isTable= true;
  isEdit=false;
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  checklist:any={
    "Id": 0,
    "CheckPoints": "",
    "IsActive": true,
    "ProcessId": 0,
    "CreatedTimeStamp": Date,
    }
  ngOnInit() {
    this.getCheckList()
    this.getProcess()
  }
  processList:any=[]
  getProcess()
  {
    this._adminecm.getProcess().subscribe(
      (response)=>
      {
        const result = response;
        if(result.code)
        {
          this.processList = result.data
        }
        else{
          this.processList = []
        }
      }
    )
  }

  getCheckList()
  {
    this._adminecm.getCheckList().subscribe(
      (response)=>
      {
        const result = response;
        if(result.code)
        {
          this.checkList = result.data
          this.dataSource = new MatTableDataSource<any>(this.checkList);
        }
      }
    )
  }

  addCheckList(f:NgForm)
  {
    this._adminecm.addCheckList(this.checklist).subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.toasterService.success(result.message, 'Success');
          this.getCheckList();
        } else {
          this.toasterService.error(result.message, "Error");
          this.getCheckList();
        }
      }),
      (error) => {
        console.log('addCheckList()', error)
      }
      this.getCheckList();
      this.isTable = true
      this.isAdd = false
  }

  
  showUpdateForm(checklist) {
    this.checklist = { ...checklist };
    this.checkList.ProcessId = checklist.Process.Id
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
  const numRows = this.dataSource.length;
  return numSelected === numRows;
}
deleteCheckList() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
        this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
        title: 'Info',
        text: 'Do you want to delete the selected Check list?',
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
            this._adminecm.deleteCheckList(obj).subscribe(
                (response) => {
                    const result = response;
                    if (result.code) {
                        Swal.fire(
                            'Deleted!',
                            'CheckLists have been deleted!',
                            'success'
                        );
                        this.selection = new SelectionModel<any>(true, []);
                        this.getCheckList();
                    } else {
                        this.toasterService.error(result.message, 'Error')
                        this.getCheckList();
                    }
                },
                (error) => {
                    console.log('deleteCheckList()', error)
                }
            );
        }
    });

}
  
editCheckLists(f:NgForm)
{
  this._adminecm.editCheckList(this.checklist).subscribe(
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
    console.log("editCheckLists(f:NgForm)");
  }
  this.getCheckList();
  this.isEdit  = false
  this.isTable = true

}
 
}
export interface ChecklistData {
  ProcessName: string,
  IsActive:Boolean,
  CurrentTimeStamp:Data
}
