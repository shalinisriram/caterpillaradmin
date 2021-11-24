import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { PlantService } from '../../../providers/plant.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit { public form: FormGroup;
  isTable: boolean = true;
  isAdd: boolean = false;
  isEdit: boolean = false;
  sectionList: any = [];
  plant = {
    'PlantName': '',
    'FacilitatorCode':''
  }
  displayedColumns = ['PlantName','FacilitatorCode', 'IsActive','Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _plantService: PlantService,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      PlantName: [null, Validators.compose([Validators.required])],
      FacilitatorCode: [null, Validators.compose([Validators.required])]
    });
    this.getPlants();
  }

  getPlants() {
    this.spinnerService.show()
    this._plantService.getPlants().subscribe(
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
        console.log(error, 'getPlants()');
      }
    );
    this.spinnerService.hide()
  }

  addPlant(f:NgForm) {
    this._plantService.addPlant(this.plant).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getPlants();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getPlants();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'addPlant()');
      }
    );
  }

  showUpdateForm(plant) {
    this.plant = { ...plant };
    this.isTable = false
    this.isEdit = true;
  }

  updatePlant(f:NgForm) {
    this._plantService.updatePlant(this.plant).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getPlants();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getPlants();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'updatePlant()');

      }
    );
  }

  deletePlants() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Plants?',
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
        this._plantService.deletePlants(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Plants have been deleted!',
                'success'
            );
             this.getPlants();
            } else {
              this.toastr.error(result.message ,'Error');
              this.getPlants();
            }
          },
          (error) => {
            console.log(error, 'deletePlants()');
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


