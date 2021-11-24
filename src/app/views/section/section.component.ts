import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionService } from '../../../providers/section.service';
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  public form: FormGroup;
  isTable: boolean = true;
  isAdd: boolean = false;
  isEdit: boolean = false;
  sectionList: any = [];
  section = {
    'SectionName': '',
    'Remarks':''
  }
  displayedColumns = ['SectionName', 'Description','IsActive','Remarks','Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _sectionService: SectionService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      SectionName: [null, Validators.compose([Validators.required])]
    });
    this.getSections();
  }

  getSections() {
    this._sectionService.getSections().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.sectionList = result.data;
          this.dataSource = new MatTableDataSource<any>(this.sectionList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.sectionList = [];
        }
      },
      (error) => {
        console.log(error, 'getSections()');
      }
    );
  }

  addSection(f:NgForm) {
    this._sectionService.addSection(this.section).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getSections();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getSections();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'addSection()');
      }
    );
  }

  showUpdateForm(section) {
    this.section = { ...section };
    this.isTable = false
    this.isEdit = true;
  }

  updateSection(f:NgForm) {
    this._sectionService.updateSection(this.section).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getSections();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getSections();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'updateSection()');

      }
    );
  }

  deleteSections() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Sections?',
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
        this._sectionService.deleteSections(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Sections have been deleted!',
                'success'
            );
             this.getSections();
            } else {
              this.toastr.error(result.message ,'Error');
              this.getSections();
            }
          },
          (error) => {
            console.log(error, 'deleteSection()');
          }
        );;
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
