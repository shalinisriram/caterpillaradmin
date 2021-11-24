import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import Swal from 'sweetalert2';
import { AreaService } from '../../../providers/area.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  public form: FormGroup;
  isTable: boolean = true;
  isAdd: boolean = false;
  isEdit: boolean = false;
  areaList: any = [];
  plantList: any = [];
  sectionList: any = [];
  selection = new SelectionModel<any>(true, []);
  area = {
    'AreaName': '',
    'PlantName': '',
    'SectionName': '',
    'Remarks': ''
  }
  displayedColumns = ['AreaName', 'PlantName', 'SectionName', 'IsActive', 'remarks', 'Select'];
  dataSource = new MatTableDataSource<any>();
  selectedItemIds: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _areaService: AreaService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      AreaName: [null, Validators.compose([Validators.required])],
      PlantName: [null, Validators.compose([Validators.required])],
      SectionName: [null, Validators.compose([Validators.required])]
    });
    this.getAreas();
    this.getPlants();
    this.getSections();
  }

  getAreas() {
    this._areaService.getAreas().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result.data;
          this.dataSource = new MatTableDataSource<any>(this.areaList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.areaList = [];
        }
      },
      (error) => {
        console.log(error, 'getAreas()');
      }
    );
  }

  getPlants() {
    this._areaService.getPlants().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.plantList = result.data;
          this.area.PlantName = this.plantList[0];
        } else {
          this.plantList = [];
        }
      },
      (error) => {
        console.log(error, 'getPlants()');
      }
    );
  }

  getSections() {
    this._areaService.getSections().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.sectionList = result.data;
        } else {
          this.sectionList = [];
        }
      },
      (error) => {
        console.log(error, 'getSections()');
      }
    );
  }

  addArea(f: NgForm) {
    this._areaService.addArea(this.area).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getAreas();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getAreas();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'addArea()');
      }
    );
  }

  showUpdateForm(area) {
    console.log(area)
    this.getPlants();
    this.getSections();
    this.area = { ...area };
    this.area.SectionName = area.Section
    this.isTable = false;
    this.isEdit = true;

  }

  updateArea(f: NgForm) {
    this._areaService.updateArea(this.area).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getAreas();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getAreas();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'updateArea()');

      }
    );
  }

  deleteAreas() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Areas?',
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
        this._areaService.deleteAreas(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Areas have been deleted!',
                'success'
              );
              this.selection = new SelectionModel<any>(true, []);
              this.getAreas();
            } else {
              this.toastr.error(result.message, 'Error')
            }

          },
          (error) => {
            console.log('deleteAreas()', error)
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
