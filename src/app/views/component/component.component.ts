import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';
import { ComponentService } from '../../../providers/component.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AreaService } from '../../../providers/area.service';
import { CatmodelService } from '../../../providers/catmodel.service';


@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit {
  public form: FormGroup;
  isTable = true;
  isEdit = false;
  isAdd = false;
  displayedColumns: string[] = ['ComponentName', 'Areas', 'CATModels', 'EngineeringChange', 'EffectiveDate', 'Remarks','Select'];
  date = new Date();
  component: any = {
    "ComponentName": "",
    'Areas': [],
    'CATModels': [],
    "EngineeringChange": "",
    "Remarks": "",
    "EffectiveDate":""
  }
  modelDropDownList;
  areaDropDownList;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  componentList: any;
  currentUser: any = {};
  selectedItemIds: any[];
  modelList:any =[];
  areaList:any =[];
  constructor(private fb: FormBuilder, 
    private _componentService: ComponentService,
    private _areaService: AreaService,
    private _modelService: CatmodelService,
     breakpointObserver: BreakpointObserver,
    private toastr: ToastrService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
         ['ComponentName', 'Areas', 'CATModels', 'EngineeringChange', 'EffectiveDate', 'Remarks','Select'] :
         ['ComponentName', 'Areas', 'CATModels', 'EngineeringChange', 'EffectiveDate', 'Remarks','Select'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      ComponentName: [null, Validators.compose([Validators.required])],
      EngineeringChange: [null, Validators.compose([Validators.required])],
      Remarks: [null, Validators.compose([Validators.required])],
      Areas: [null, Validators.compose([Validators.required])],
      CATModels: [null, Validators.compose([Validators.required])]
    });
    this.getcomponents();
    this.getModels();
    this.getAreas();
  }

  getcomponents() {
    this._componentService.getcomponent().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.componentList = result.data;
          this.dataSource = new MatTableDataSource<any>(this.componentList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.componentList = [];
        }
      },
      (error) => {
        console.log('getcomponent()', error)
      }
    );
  }

  addComponent(f:NgForm) {
    this.component.EffectiveDate = new Date(this.component.EffectiveDate);
    this._componentService.addComponent(this.component).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getcomponents();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getcomponents();
          f.resetForm();
        }
      },
      (error) => {
        console.log('addComponent()', error);
      }
    );
  }
 
  getModels() {
    this._modelService.getModels().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.modelList = result.data; 
        } else {
          this.modelList =[];
        }
      },
      (error) => {
        console.log('getModels()', error);
      }
    );

  }
 
  getAreas() {
    this._areaService.getAreas().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result.data; 
        } else {
          this.areaList = []; 
        }
      },
      (error)=>{
        console.log('getAreas()', error);
      }
    );
  }

  showUpdateForm(component) {
    this.component = { ...component }
    this.isTable = false;
    this.isEdit = true;
    this.getModels();
    this.getAreas();
  }

  updateComponent(f:NgForm) {
    this.component.EffectiveDate = new Date(this.component.EffectiveDate)
    this._componentService.updateComponent(this.component).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getcomponents();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getcomponents();
          f.resetForm();
        }
      },
      (error) => {
        console.log('updateComponent()', error);
      }
    );
  }

  deleteComponents() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Components?',
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
        this._componentService.deleteComponents(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Components have been deleted!',
                'success'
              );
              this.selection = new SelectionModel<any>(true, []);
              this.getcomponents();
            } else {
              this.toastr.error(result.message, 'Error');
            }
          },
          (error) => {
            console.log('deleteComponents()', error)
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
