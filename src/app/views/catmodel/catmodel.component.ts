import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { CatmodelService } from '../../../providers/catmodel.service';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-catmodel',
  templateUrl: './catmodel.component.html',
  styleUrls: ['./catmodel.component.css']
})
export class CatmodelComponent implements OnInit {
  public form: FormGroup;
  currentUser: any = {}
  isTable = true;
  isEdit = false;
  isAdd = false;
  catmodelList;
  displayedColumns: string[] = ['ModelName', 'Description', 'SerialPrefix', 'Sections', 'IsActive', 'Remarks', 'Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  model: any = {
    'ModelName': '',
    'Description': '',
    'Sections': [],
    'SerialPrefix': '',
    'Remarks': ''
  }
  selectedItemIds: any[];
  sectionList: any = [];
  constructor(private fb: FormBuilder, private _catmodelservice: CatmodelService, breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['ModelName', 'Description', 'SerialPrefix', 'Sections', 'IsActive', 'Remarks', 'Select'] :
        ['ModelName', 'Description', 'SerialPrefix', 'Sections', 'IsActive', 'Remarks', 'Select'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      ModelName: [null, Validators.compose([Validators.required])],
      Description: [null, Validators.compose([Validators.required])],
      Sections: [null, Validators.compose([Validators.required])],
      SerialPrefix: [null, Validators.compose([Validators.required])]
    });
    this.getModels();
    this.getsections();
  }

  getModels() {
    this._catmodelservice.getModels().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.catmodelList = result.data;
          this.dataSource = new MatTableDataSource<Element>(this.catmodelList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.catmodelList = [];
        }

      },
      (error) => {
        console.log('getModels()', error)
      }
    );
  }

  addModel(f: NgForm) {
    this._catmodelservice.addModel(this.model).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getModels();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getModels();
          f.resetForm();
        }

      },
      (error) => {
        console.log('addModel()', error)
      }
    );
  }

  getsections() {
    this._catmodelservice.getSections().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.sectionList = result.data;
        } else {
          this.sectionList = []
        }
      },
      (error) => {
        console.log('getsections()', error);
      }
    );
  }

  showUpdateForm(model) {
    this.model = { ...model }
    this.isTable = false;
    this.isEdit = true;
    this.getsections();
  }

  updateModel(f: NgForm) {
    this._catmodelservice.updateModel(this.model).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getModels();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getModels();
          f.resetForm();
        }

      },
      (error) => {
        console.log('updateModel()', error);
      }
    );
  }

  deleteModels() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Models?',
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
        this._catmodelservice.deleteModels(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Models have been deleted!',
                'success'
              );
              this.selection = new SelectionModel<any>(true, []);
              this.getModels();
            } else {
              this.toastr.error(result.message, 'Error')
            }

          },
          (error) => {
            console.log('deleteModels()', error)
          }
        );
      }
    });
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

