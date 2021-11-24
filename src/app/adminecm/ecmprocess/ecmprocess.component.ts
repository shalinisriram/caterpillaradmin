import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Data } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminecmService } from '../../../providers/adminecm.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-ecmprocess',
  templateUrl: './ecmprocess.component.html',
  styleUrls: ['./ecmprocess.component.css']
})
export class EcmprocessComponent implements OnInit {
  dataSource = new MatTableDataSource<processData>();
  constructor(private _adminecm:AdminecmService,
              private toasterService: ToastrService,) { }
  displayedColumns = ['ProcessName','CurrentTimeStamp','IsActive','Select']
  process:any={
  "Id": 0,
  "ProcessName": "",
  "IsActive": true,
  "CurrentTimeStamp": Date,
  }
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  isAdd =false;
  isTable= true;
  isEdit=false;
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
          this.dataSource = new MatTableDataSource<any>(this.processList);
        }
        else{
          this.processList=[]
        }
      }
    )
  }

  addProcess(f:NgForm)
  {
    this._adminecm.addProcess(this.process).subscribe(
      (response)=>
      {
        const result =response
        if(result.code)
        {
          this.toasterService.success(result.message, 'Success');
          this.getProcess();
        
        } else {
          this.toasterService.error(result.message, "Error");
        }
      },
      (error) => {
        console.log('addProcess()', error)
      }
    )

    this.getProcess()
    this.isTable=true
    this.isAdd = false
  }

  showUpdateForm(process) {
    this.process = { ...process };
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
  deleteProcess() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
        this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
        title: 'Info',
        text: 'Do you want to delete the selected Process?',
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
            this._adminecm.deleteUnits(obj).subscribe(
                (response) => {
                    const result = response;
                    if (result.code) {
                        Swal.fire(
                            'Deleted!',
                            'Process have been deleted!',
                            'success'
                        );
                        this.selection = new SelectionModel<any>(true, []);
                        this.getProcess();
                    } else {
                        this.toasterService.error(result.message, 'Error')
                        this.getProcess();
                    }
                },
                (error) => {
                    console.log('deleteprocess()', error)
                }
            );
        }
    });

}
editProcess(f:NgForm)
{
  this._adminecm.editProcess(this.process).subscribe(
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
    console.log("editProcess");
  }
  this.getProcess()
  this.isEdit = false;
  this.isTable = true;
}
  
  ngOnInit() {
    this.getProcess();
  }

}
export interface processData {
  ProcessName: string,
  IsActive:Boolean,
  CurrentTimeStamp:Data
}