import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { AnnotationService } from '../../../providers/annotation.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  isAdd = false;
  isTable = true;
  selectedItemIds: any[];
  groupsList: any = [];
  selection = new SelectionModel<any>(true, []);
  displayedColumns = ['GroupName', 'Select'];
  Groups: any = {
    'GroupName': ''
  };
  isEdit = false
  constructor(private _adminservice: AnnotationService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getGroups();
  }
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  addGroups(f: NgForm) {
    this._adminservice.AddGroups(this.Groups.GroupName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getGroups();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getGroups();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'addGroups()');
      }
    );
  }

  updateGroups(f: NgForm) {
    console.log()
    this._adminservice.getEdit(this.Groups).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getGroups();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getGroups();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'updateGroups()');

      }
    );
  }

  getGroups() {
    this._adminservice.getGroups().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.groupsList = result.data;
          this.dataSource = new MatTableDataSource<any>(this.groupsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.groupsList = [];
        }

      }
    ),
      (error) => {
        console.log("erroe getGropus()");
      }
  }

  deleteGroups(row) {
    this.selectedItemIds = row.Id; 
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Groups?',
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
        
          this._adminservice.Delete(row.Id).subscribe(
            (response) => {
              const result = response;
              console.log('DeleteResult', result);
              if (result.code) {
                Swal.fire(
                  'Deleted!',
                  'Groups have been deleted!',
                  'success'
                );
                this.getGroups();
              } else {
                this.toastr.error(result.message, 'Error');
                this.getGroups();
              }
            },
            (error) => {
              console.log(error, 'deleteGroups()');
            }
          );;
        
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  showUpdateForm(obj) {
    this.Groups = { ...obj };
    this.Groups.Id = obj.Id;
    this.isTable = false
    this.isEdit = true;
  }
}
