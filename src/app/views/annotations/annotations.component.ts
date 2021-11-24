import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AnnotationService } from '../../../providers/annotation.service';
import { WorkinstructionService } from '../../../providers/workinstruction.service';
@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css']
})
export class AnnotationsComponent implements OnInit {
  public form: FormGroup;
  currentUser: any = {}
  isTable = true;
  isEdit = false;
  isAdd = false;
  annotationlist;
  displayedColumns: string[] = ['id', 'backgroundColor', 'color', 'height', 'isDeleted', 'recordInfoId', 'text', 'width', 'workInstructionId', 'isActive', 'positionX', 'positionY', 'Action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  annotation: any = {
    "Id": "",
    "PositionX": "",
    "PositionY": "",
    "Width": "",
    "Height": "",
    "text": "",
    "Color": "",
    "BackgroundColor": "",
    "WorkInstructionId": ""

  }

  constructor(private fb: FormBuilder, private _workinstructionservice: WorkinstructionService, private toastr: ToastrService,
    private _annotationservice: AnnotationService, breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['id', 'backgroundColor', 'color', 'height', 'isDeleted', 'recordInfoId', 'text', 'width', 'workInstructionId', 'isActive', 'positionX', 'positionY', 'Action'] :
        ['id', 'backgroundColor', 'color', 'height', 'isDeleted', 'recordInfoId', 'text', 'width', 'workInstructionId', 'isActive', 'positionX', 'positionY', 'Action'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      PositionX: [null, Validators.compose([Validators.required])],
      PositionY: [null, Validators.compose([Validators.required])],
      Width: [null, Validators.compose([Validators.required])],
      Height: [null, Validators.compose([Validators.required])],
      text: [null, Validators.compose([Validators.required])],
      Color: [null, Validators.compose([Validators.required])],
      BackgroundColor: [null, Validators.compose([Validators.required])],
      WorkInstructionId: [null, Validators.compose([Validators.required])]

    });
    this.getAnnotation();
    this.GetWorkInstructions();
  }
  getAnnotation() {
    this._annotationservice.getAnnotation().subscribe(
      (response) => {
        const result = response;
        this.annotationlist = result;
        this.dataSource = new MatTableDataSource<Element>(this.annotationlist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log('getAnnotation()', error)
      }
    );
  }
  calworkinst;
  GetWorkInstructions() {
    this._workinstructionservice.GetWorkInstructions().subscribe(
      (response) => {
        const result = response;
        this.calworkinst = result
      },
      (error) => {
        console.log('GetWorkInstructions()', error)
      }
    );
  }

  addannotations() {
    this.currentUser['PositionX'] = this.form.value.PositionX,
      this.currentUser['PositionY'] = this.form.value.PositionY,
      this.currentUser['Width'] = this.form.value.Width,
      this.currentUser['Height'] = this.form.value.Height,
      this.currentUser['text'] = this.form.value.text,
      this.currentUser['Color'] = this.form.value.Color,
      this.currentUser['BackgroundColor'] = this.form.value.BackgroundColor,
      this.currentUser['WorkInstructionId'] = this.form.value.WorkInstructionId,
      this._annotationservice.addAnnotation(this.annotation).subscribe(
        (response) => {
          const result = response;
          this.getAnnotation();
          this.isTable = true;
          this.isAdd = false;
          this.toastr.success('Annotation added', 'Success');
        },
        (error) => {
          console.log('addannotations()', error)
        }
      );
  }
  editAnnotation = {
    "Id": '',
    "PositionX": '',
    "PositionY": '',
    "Width": '',
    "Height": '',
    "Color": '',
    "BackgroundColor": '',
    "WorkInstructionId": ''


  }
  updateAnnotations() {
    this._annotationservice.UpdateAnnotation(this.editAnnotation).subscribe(
      (response) => {
        this.toastr.success('Annotation Updated Successfully', 'Success');
        this.getAnnotation();
        this.isEdit = false;
        this.isTable = true;
      },
      (error) => {

      }
    );
  }

  deleteAnnotation(element) {
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
        this._annotationservice.deleteAnnotations(element.id).subscribe(
          (response) => {
            this.getAnnotation();
            Swal.fire(
              'Deleted!',
              'Annotation  has been deleted.',
              'success'
            );
          },
          (error) => {
            console.log('deleteAnnotation()', error)
          }
        );
      }
    });
  }

  showUpdateForm(annotation) {
    this.isTable = false;
    this.isEdit = true;
    this.editAnnotation.Id = annotation.id;
    this.editAnnotation.PositionX = annotation.positionX;
    this.editAnnotation.PositionY = annotation.positionY;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
export interface Plant {
  id: string;
  workInstructionId: string;
  isActive: string
}
