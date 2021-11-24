import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { BreakService } from '../../../providers/break.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import {SelectionModel} from '@angular/cdk/collections';
import { ProcedureService } from '../../../providers/procedure.service';

@Component({
  selector: 'app-break',
  templateUrl: './break.component.html',
  styleUrls: ['./break.component.css']
})
export class BreakComponent implements OnInit {
  isTable = true;
  isEdit = false;
  isAdd = false;
  displayedColumns: string[] = ['Description','BreakTimeFrom', 'BreakTimeTo','Remarks','Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true,[]);
  selectedItemIds:any=[]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  break: any = {
    "Description":"",
    "SectionName":"",
    "AreaName":"",
    "BreakTimeFrom": "",
    "BreakTimeTo": "",
    "Remarks": "",
    "UserName": ""
  }
  editBreak: any = {}
  currentUser: any;
  breaklist;

   
    constructor(private fb: FormBuilder, breakpointObserver: BreakpointObserver, private toastr: ToastrService,  private _procedureService :ProcedureService, private _breakService: BreakService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.getSectionList();
      this.getAreas();
      this.displayedColumns = result.matches ?
     ['Description','Section','Area','BreakTimeFrom', 'BreakTimeTo','Remarks','Select'] :
     ['Description','Section','Area','BreakTimeFrom', 'BreakTimeTo','Remarks','Select'];
    });
    this.currentUser = localStorage.getItem('currentUser');
  }
  SectionList:any=[]

  getSectionList() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
          
        } else {
          this.SectionList = [];
        
        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }

  areaList:any =[];
  getAreas() {
   this._procedureService.getAreaList().subscribe(
     (response) => {
       const result = response;
       if (result.code) {
        
          this.areaList = result.data;
        
       } else {
         this.areaList = [];
       }
     },
     (error) => {
       console.log(error, 'getAreas()');
     }
   );
 }

  ngOnInit() {
    this.form = this.fb.group({
      BreakTimeFrom: [null, Validators.compose([Validators.required])],
      BreakTimeTo: [null, Validators.compose([Validators.required])],
      Remarks: [null, Validators.compose([Validators.required])],
    });
    this.getBreaks();
  }

  getBreaks() {
    this._breakService.getBreaks().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.breaklist = result.data;
          this.dataSource = new MatTableDataSource<any>(this.breaklist);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.breaklist = [];
        }
      },
      (error) => {
        console.log('getBreaks()', error);
      }
    );
  }

  addBreak(f:NgForm) {
    this.break['UserName'] = this.currentUser;
    this._breakService.addBreak(this.break).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getBreaks();
          f.resetForm();
        }
        else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getBreaks();
          f.resetForm();
        }

      },
      (error) => {
        console.log('addBreak()', error)
      }
    );
  }

  showUpdateForm(element) {
    let str1 = element.BreakTimeFrom.substring(11, 16);
    let str2 = element.BreakTimeTo.substring(11, 16);
    this.break.BreakTimeFrom = str1;
    this.break.BreakTimeTo = str2;
    this.break.SectionName = element.SectionName;
    this.break.AreaName = element.AreaName;
    this.break.Remarks = element.Remarks;
    this.break.Description = element.Description;
    this.break['Id'] = element.Id;
    this.isTable = false;
    this.isEdit = true;
  }

  updateBreak(f:NgForm) {
    this.break['UserName'] = this.currentUser;
    this._breakService.updateBreak(this.break).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getBreaks();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getBreaks();
          f.resetForm();
        }

      },
      (error) => {
        console.log('updateBreak()', error);
      }
    );
  }

  deleteBreaks(){
    this.selectedItemIds =[]
    this.selection.selected.forEach(ele=>{
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected break timings?',
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
        const obj={
          'Ids':this.selectedItemIds
        }
        this._breakService.deleteBreaks(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Breaks have been deleted!',
                'success'
              );
              this.selection = new SelectionModel<any>(true,[]);
              this.getBreaks();
            } else {
              this.toastr.error(result.message, 'Error');
            }
          },
          (error) => {
            console.log('deleteBreaks()', error)
          }
        );
      }
    });
  }


  showTable() {
    this.break = {
      "BreakTimeFrom": "",
      "BreakTimeTo": "",
      "Remarks": "",
      "UserName": ""
    }
    this.isEdit = false;
    this.isTable = true;
    this.getBreaks();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
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
}


