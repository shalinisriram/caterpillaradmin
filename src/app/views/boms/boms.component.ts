import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BOMsService } from '../../../providers/boms.service';
import { WorkinstructionService } from '../../../providers/workinstruction.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';


@Component({
  selector: 'app-boms',
  templateUrl: './boms.component.html',
  styleUrls: ['./boms.component.css']
})
export class BOMsComponent implements OnInit {
  public form: FormGroup;
  currentUser:any={}
  isTable = true;
  isEdit = false;
  isAdd = false;
  BOMslist;
  displayedColumns: string[] = ['id','itemDescription','itemNumbers','remark', 'workInstructionId', 'isActive','quantity','Action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  BOMs: any = {
    "Quantity": "",
    "ItemNumbers": "",
    "ItemDescription": "",
    "Remark ": "",
    "WorkInstructionId": ""

  }


  constructor(private fb: FormBuilder,private _workinstructionservice:WorkinstructionService, private toastr: ToastrService,
    private _BOMsservice: BOMsService, breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['id','itemDescription','itemNumbers','remark', 'workInstructionId', 'isActive','quantity','Action'] :
        ['id','itemDescription','itemNumbers','remark', 'workInstructionId', 'isActive','quantity','Action'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      Quantity: [null, Validators.compose([Validators.required])],
      ItemNumbers: [null, Validators.compose([Validators.required])],
      ItemDescription: [null, Validators.compose([Validators.required])],
      Remark: [null, Validators.compose([Validators.required])],
      WorkInstructionId: [null, Validators.compose([Validators.required])]
    });
    this.getBOMs();
    this.GetWorkInstructions();
  }
  getBOMs() {
    this._BOMsservice.getBOMs().subscribe(
      (response) => {
        const result = response;
        this.BOMslist = result;
        this.dataSource = new MatTableDataSource<Element>(this.BOMslist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log('getBOMs()', error)
      }
    );
  }
  calworkinst;
  GetWorkInstructions(){
    this._workinstructionservice.GetWorkInstructions().subscribe(
     (response)=>{
       const result = response;
      this.calworkinst = result
     },
     (error)=>{
       console.log('GetWorkInstructions()',error)
     }
    );
  }


  addBOMs() {
    this.currentUser['Quantity'] = this.form.value.Quantity,
    this.currentUser['ItemNumbers'] = this.form.value.ItemNumbers,
    this.currentUser['ItemDescription'] = this.form.value.ItemDescription,
    this.currentUser['Remark'] = this.form.value.Remark,
    this.currentUser['WorkInstructionId'] = this.form.value.WorkInstructionId,
    
    this._BOMsservice.addBOMs(this.BOMs).subscribe(
      (response) => {
        const result = response;
        this.getBOMs();
        this.isTable = true;
        this.isAdd = false;
        this.toastr.success('BOMs added', 'Success');

      },
      (error) => {
        console.log('addBOMs()', error)
      }
    );
  }
  editBOMs={
    'Id':'',
    'Quantity' :'',
    'ItemNumbers' :'',
    'ItemDescription':'', 
    'Remark' :'',
    'WorkInstructionId':''
    
  }
  updateBOMs() {
  this._BOMsservice.UpdateBOM(this.editBOMs).subscribe(
    (response)=>{
     this.toastr.success('BOM Updated Successfully','Success');
     this.getBOMs();
     this.isEdit = false;
     this.isTable  = true;
    },
    (error)=>{

    }
  );
  }

  deleteBOM(element) {
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
        this._BOMsservice.deleteBOMs(element.id).subscribe(
          (response) => {
            this.getBOMs();
            Swal.fire(
              'Deleted!',
              'BOM  has been deleted.',
              'success'
            );
          },
          (error) => {
            console.log('deleteBOM()', error)
          }
        );
      }
    });
  }

  showUpdateForm(BOMs) {
    this.isTable = false;
    this.isEdit = true;
    this.editBOMs.Id = BOMs.id;
    this.editBOMs.Quantity = BOMs.quantity;
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
export interface catmodel {
  id: string;
  workInstructionId: string;
  isActive: string
}
