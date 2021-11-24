import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcedureService } from '../../../providers/procedure.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, PageEvent, MatOption } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExcelService } from '../../../providers/excel.service';
import { ImageComponent } from '../traceability/image.component';
import jsPDF from 'jspdf'

import autoTable from 'jspdf-autotable'
import { element } from '@angular/core/src/render3';
import { THIS_EXPR, IfStmt } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProcedureComponent implements OnInit {
  public form: FormGroup;
  procedurelist
  isTable = true;
  isEdit = false;
  isAdd = false;
  isAddECM = false;
  sectionsList: any = []
  modelList: any = []
  componentList: any = []
  selectedFile: File
  areaList: any = []
  procedure: any = {
    "SectionName": "",
    "ModelName": "",
    "ComponentName": "",
    "AreaName": [],
    "UserName": ""
  };

  Insert: any = {
    "SectionName": "",
    "ModelName": "",
    "ComponentName": "",
    "AreaName": [],
    "UserName": localStorage.getItem('currentUser'),
    "Version":""
  };


  ecr: any = {
    "EcrNumber":'',
    "SectionName": "",
    "ModelName": "",
    "ComponentName": "",
    "AreaName": [],
    "UserName": ""
  };
  progressvalue:number;
  progressMessage:string;
  selectedImages;
  selectedCsvs;
  displayedColumns: string[] = 
  ['SequenceNumber', 'Description', 'Time','Operator','WeldProcedure',	'WeldLength',	'ProcedureDate',		'WeldProcess',	'WireDiameter',	'WeldPosition',	'WeldSize',
  	'WeldType',	'WireFeedSpeed',	'Voltage',	'WeldVolume',	"WeldId",'FigureVisual', 'Version','ECRNumber','uploadTime','Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  expandedElement: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedItemIds: any[];
  AreaList: any = [];
  ModelList: any = [];
  SectionList: any = [];
  ComponentList: any = [];
  versionList: any = [];
  procedureObj: any = {
    "AreaName": [],
    "ComponentName": "",
    "ModelName": "",
    "SectionName": "",
    "Version": ""
  };
  pageLimit:number;
  pageIndex:number;
  currentUser;
  isSpinner = false;
  
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    breakpointObserver: BreakpointObserver,
    private _procedureService: ProcedureService,
  
    private _excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService,public dialog: MatDialog) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
      ['SequenceNumber', 'Description', 'Time','Operator','WeldProcedure',	'WeldLength',	'ProcedureDate',	'WeldProcess',	'WireDiameter',	'WeldPosition',	'WeldSize',
      'WeldType',	'WireFeedSpeed',	'Voltage',	'WeldVolume','WeldId',	'FigureVisual', 'Version','ECRNumber', 'uploadTime','Select']:
      ['SequenceNumber', 'Description', 'Time', 'Operator','WeldProcedure',	'WeldLength',	'ProcedureDate',	'WeldProcess',	'WireDiameter',	'WeldPosition',	'WeldSize',
      'WeldType',	'WireFeedSpeed',	'Voltage',	'WeldVolume','WeldId',	'FigureVisual', 'Version','ECRNumber','uploadTime','Select'];;
    });
    this.procedure['UserName'] = localStorage.getItem('currentUser');

    this.ecr['UserName'] = localStorage.getItem('currentUser');
    
    this.currentUser = localStorage.getItem('currentUser')
  }

  ngOnInit() {
    this.form = this.fb.group({
      SectionName: [null, Validators.compose([Validators.required])],
      ModelName: [null, Validators.compose([Validators.required])],
      ComponentName: [null, Validators.compose([Validators.required])],
      AreaName: [null, Validators.compose([Validators.required])],
    });
    // this.getAreaList();
    this.getSectionList()
    this.getAreas();
    if(localStorage.getItem("pageLimit"))
    this.pageLimit=Number(localStorage.getItem("pageLimit"));
  else
    this.pageLimit=20;
    if(localStorage.getItem("pageIndex"))
    this.pageIndex=Number(localStorage.getItem("pageIndex"));
  else
    this.pageIndex=0;
  }

  getAreaList() {

    this._procedureService.getAllAreaWithSection(this.procedureObj.SectionName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.AreaList = result.data;
          this.procedureObj.AreaName.push(this.AreaList[0]);
          // if(localStorage.getItem("area"))
          //   this.procedureObj.AreaName = JSON.parse(localStorage.getItem("area"));
          // else{
          //     this.procedureObj.AreaName=[]
          //     this.procedureObj.AreaName.push(this.AreaList[0]);
          // }
          
          this.getComponentList();
        } else {
          this.AreaList = [];
          this.procedureObj.AreaName=[]
          this.getComponentList();
        
        }
      },
      (error) => {
        console.log(error, 'getAreaList()');

      }
    );
  }

  getModelList() {
    this._procedureService.getModels(this.procedureObj.SectionName,this.currentUser).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelList = result.data;
          this.procedureObj.ModelName = this.ModelList[0];

          // if(localStorage.getItem("model"))
          //   this.procedureObj.ModelName = JSON.parse(localStorage.getItem("model"));
          // else{
          //   this.procedureObj.ModelName = [];
          //   this.procedureObj.ModelName.push(this.ModelList[0]);;
          // }
         
          this.getComponentList()
          this.getVersionList();
        } else {
          this.ModelList = [];
          this.procedureObj.ModelName = "";

         
          this. getComponentList()
          this.getVersionList();
        }
      },
      (error) => {
        console.log(error, ' getModelList()');
      }
    );
  }

  getSectionList() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
          this.procedureObj.SectionName = this.SectionList[0];
          this.getAreaList()
          // if(localStorage.getItem("section"))
          //   this.procedureObj.SectionName = JSON.parse(localStorage.getItem("section"));
          // else{
          //   this.procedureObj.SectionName = []
          //   this.procedureObj.SectionName.push(this.SectionList[0]);
          // }
          this.getVersionList();
          this.getModelList()
        } else {
          this.SectionList = [];
          this.procedureObj.SectionName = ""
          this.getVersionList();
        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }

  getComponentList() {
    let obj = {
      'Model': this.procedureObj.ModelName,
      'Area': this.procedureObj.AreaName,
      'UserName': this.currentUser
    }
    this._procedureService.getComponents(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentList = result.data;
          this.procedureObj.ComponentName =this.ComponentList[0] ;
          // if(localStorage.getItem("component"))
          //   this.procedureObj.ComponentName = JSON.parse(localStorage.getItem("component"));
          // else
          // {
          //   this.procedureObj.ComponentName=[]
          //     this.procedureObj.ComponentName.push(this.ComponentList[0]);
          // }
         this.getVersionList()
        } else {
          this.ComponentList = [];
          this.procedureObj.ComponentName= ""
          this.getVersionList()
        }
      },
      (error) => {
        console.log(error, 'getComponentList()');
      }
    );
  }

  getVersionList() {
    

     var obj = {
        "AreaName": this.procedureObj.AreaName,
        "ComponentName": [this.procedureObj.ComponentName],
        "ModelName": [this.procedureObj.ModelName],
        "SectionName": [this.procedureObj.SectionName]
      }
    
    this._procedureService.getVersionList(obj).subscribe(
      (response) => {
        localStorage.setItem("model",JSON.stringify(obj.ModelName))
       localStorage.setItem("area",JSON.stringify(obj.AreaName))
        localStorage.setItem("section",JSON.stringify(obj.SectionName))
        localStorage.setItem("component",JSON.stringify(obj.ComponentName))
        const result = response;
        if (result.code) {
          console.log(result.data)
          this.versionList = result.data;
          this.procedureObj.Version = this.versionList[this.versionList.length-1];
          console.log(this.procedureObj.Version)
        } else {
          this.versionList = [];
          this.procedureObj.Version = ""
        }
      },
      (error) => {
        console.log(error, 'getVersionList()');
      }
    );
  }

  setDefault()
  {
    localStorage.removeItem("area")
    localStorage.removeItem("component")
    localStorage.removeItem("model")
    localStorage.removeItem("section")
    localStorage.removeItem("pageLimit")
    localStorage.removeItem("pageIndex")
    this.ngOnInit();
    
  }
  proced :any
  
  getProcedures() {
   let  prObj = {
      "AreaName": this.procedureObj.AreaName,
      "ComponentName":[this.procedureObj.ComponentName],
      "ModelName": [this.procedureObj.ModelName],
      "SectionName": [this.procedureObj.SectionName],
      "Version": [this.procedureObj.Version]
    };
    this.spinnerService.show()
    this._procedureService.getProcedures(prObj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.procedurelist = result.data;
          this.proced = result.data;
          this.dataSource = new MatTableDataSource<Element>(this.procedurelist);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide()
         
        } else {
          this.procedurelist = [];
          this.spinnerService.hide()
          
        }

      },
      (error) => {
        console.log('getProcedures()', error)
        this.spinnerService.hide()
      }
    );
   
    this.pageLimit = Number(localStorage.getItem("pageLimit"))
    this.pageIndex = Number(localStorage.getItem("pageIndex"))
  }

  addEcr(f:NgForm)
  {
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.uploadImageEcr(f)
        }

      },
      (error) => {
        console.log('clearTemp', error);

      }
    );
  }

  addProcedure(f: NgForm) {
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.uploadImage(f)
        }

      },
      (error) => {
        console.log('clearTemp', error);

      }
    );
  }
  editArea:any = []
  showUpdateForm(element) {
   
    console.log(element)
    element.AreaName.forEach(ele => {
     
      this.editArea.push(ele[0]);
    });
    this.procedure = { ...element };
    this.procedure.AreaName = this.editArea
    this.getModels();
    this.getAreas();
    this.getComponents();
    this.isTable = false;
    this.isEdit = true;
  }
  isImageUploaded:boolean=false;
  updateProcedure(f: NgForm) {
   
    if (this.imageFile) {
    
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          let X =  this.procedure.FigureVisual.split(';')
          for(var i =0;i<this.imageFile.length;i++){
            if (X.some(v => this.imageFile[i].name.split('.')[0] === v)) 
            {
              const uploadData = new FormData();
              uploadData.append('File', this.imageFile[i]);
              this._procedureService.SingleimageUpload(uploadData).subscribe((response) => {
                const result = response;
                if (result.code) {
                  this.toastr.success('Success', 'images uploaded successfully');
                  this.isImageUploaded = true;
                  this._procedureService.updateProcedure(this.procedure).subscribe(
                    (response) => {
                      const result = response;
                      if (result.code) {
                        this.toastr.success(result.message, 'Success');
                        this.isEdit = false;
                        this.isTable = true;
                        this.isImageUploaded= false
                        this.getProcedures();
                        this.imageFile = null
                        f.resetForm();
                      } else {
                        this.toastr.error(result.message, 'Error');
                        this.isEdit = false;
                        this.isTable = true;
                        this.isImageUploaded= false
                        this.getProcedures();
                        this.imageFile = null
                        f.resetForm();
                      }
                    })
                }
                else{
                  this.toastr.error('Error', 'images could not be uploaded');
                }
              }) 
              
            }
            else{
              this.toastr.error('Error', 'Figure visual and upload image name must be same');        
            }
          }
          if(this.isImageUploaded == true)
          {
            console.log("hello")
           
            
          }
          console.log("logo")
        }
        else
        {
          this.toastr.error('Error', result.message)
        }      }    )
    }
    else {
     
      this._procedureService.clearTemp().subscribe(
        (response) => {
        const result = response;
        if (result.code) {
          console.log("nothing")
          this._procedureService.updateProcedure(this.procedure).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this.toastr.success(result.message, 'Success');
                this.isEdit = false;
                this.isTable = true;
                this.getProcedures();
                f.resetForm();
              } else {
                this.toastr.error(result.message, 'Error');
                this.isEdit = false;
                this.isTable = true;
                this.getProcedures();
                f.resetForm();
              }
            },
            (error) => {
              console.log('updateProcedure()', error)
            }
          )
        }else{
          this.toastr.error('Error',result.message)
        }
        },
        (error) => {
          console.log('updateProcedure()', error)
        })
    }
  }


  deleteProcedures() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Procedures?',
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showCloseButton: true
    }).then((res) => {
      if (res.value) {
        const obj = {
          'Ids': this.selectedItemIds
        }
        this._procedureService.deleteProcedures(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Procedures have been deleted!',
                'success'
              );
              this.selection = new SelectionModel<any>(true, []);
              this.getProcedures();
            }
            else {
              this.toastr.error(result.message, 'Error')
              this.getProcedures();
            }
          },
          (error) => {
            console.log('deleteProcedures()', error)
          }
        );
      }
    });
  }
  sectionName:any;
  getModels() {
    if(this.isAddECM)
    {
      this.sectionName= this.ecr.SectionName
    }
    else{
      this.sectionName = this.procedure.SectionName
    }

    if(this.isInsert)
    {
      this.sectionName= this.Insert.SectionName
    }
    this._procedureService.getModels(this.sectionName, this.currentUser).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.modelList = result['data']
        } else {
          this.modelList = []
        }
      },
      (error) => {
        console.log(error, 'getModels()');
      }
    );
  }

  getAreas() {
    this._procedureService.getAreas(this.currentUser).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result['data']
        } else {
          this.areaList = []
        }
      },
      (error) => {
        console.log(error, 'getAreas()');
      }
    );
  }
   obj:any= {
    'Model': this.procedure.ModelName,
    'Area': this.procedure.AreaName,
    'UserName': localStorage.getItem('currentUser')
  }

  getComponents() {
    if(this.isAddECM)
    {
      this.obj = {
        'Model': this.ecr.ModelName,
        'Area': this.ecr.AreaName,
        'UserName': this.currentUser
      }
    }
    else{
      this.obj = {
        'Model': this.procedure.ModelName,
        'Area': this.procedure.AreaName,
        'UserName': this.currentUser
      }
      
    }
    
    this._procedureService.getComponents(this.obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.componentList = result['data']
        } else {
          this.componentList = []
        }
      },
      (error) => {
        console.log(error, 'getComponents()');
      }
    );
  }
 isInsert:boolean= false;

 insertRowProcedure()
 {
    this.isTable = false
    this.isInsert = true;
 }
  insertRowSEquence(f: NgForm)
  {
    
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.uploadImageInsert(f)

          this.isInsert = !this.Insert;
          this.isTable = true
        }

      },
      (error) => {
        console.log('clearTemp', error);

      }
    );
    

  }

  isSpinnerImage:boolean = false
  onFileChanged(event) {
    this.selectedImages = [];
    this.isSpinnerImage = true
    this.selectedImages = event.target.files;
    this.isSpinnerImage = false
    

  }

  onFileChangedCsv(event) {
    this.selectedCsvs = event.target.files;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  showTable() {
    this.isEdit = false;
    this.isTable = true;
    this.procedure = {
      "SectionName": "",
      "ModelName": "",
      "ComponentName": "",
      "AreaName": "",
      "UserName": ""
    };
    this.getProcedures();
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


  exportAsXLSX(excelList): void {
    this._excelService.exportAsExcelFile(excelList, 'Excel');
  }

  async uploadImageEcr(f) {
    this.progressvalue=0
    this.progressMessage = "Uploading " + this.selectedImages.length +" Images.... 0%";
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
      this.progressMessage = "Uploading " + this.selectedImages.length +" Images...."+ this.progressvalue +"%";
      const uploadData = new FormData();
      uploadData.append('File', this.selectedImages[i]);
      this.isSpinner = true;
      const res = await this._procedureService.imageUpload(uploadData)
      if (res.code) {
        if (i == this.selectedImages.length - 1) {
          const uploadData = new FormData();
          uploadData.append('File', this.selectedCsvs[0]);
          this.progressMessage = "Uploading Procedures....";
          this._procedureService.imageUpload2(uploadData).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this.progressMessage = "Validating Procedures....";
                this._procedureService.validateProcedure(this.ecr).subscribe(
                  (response) => {
                    const result = response;
                    if (result.code) {
                      this._procedureService.addEcr(this.ecr).subscribe(
                        (response) => {
                          const result = response;
                          if (result.code) {
                            Swal.fire({
                              title: 'Info',
                              text: "Sucess",
                              confirmButtonText: 'Ok',
                              cancelButtonText: 'NO',
                              width: 900,
                              padding: '9em',
                              showCancelButton: false,
                              showCloseButton: true
                            })
                            //this.toastr.success(result.message, 'Success');
                            this.isSpinner = false;
                            this.isAdd = false;
                            this.isTable = true;
                            this.getProcedures();
                            f.resetForm();
                          }
                          else {
                            this.toastr.error(result.message, 'Error');
                            this.isSpinner = false;
                            this.isAdd = false;
                            this.isTable = true;
                            this.getProcedures();
                            f.resetForm();
                          }

                        },
                        (error) => {
                          this.isSpinner = false;
                          console.log('addProcedure()', error)
                        }
                      );
                    } else {
                      this.isSpinner = false;
                      Swal.fire({
                        title: 'Info',
                        text: result.message,
                        type: 'warning',
                        confirmButtonText: 'Download error log',
                        showCancelButton: true,
                        showCloseButton: true
                      }).then((res) => {
                        if (res) {
                          this.exportAsXLSX(result.data)
                        } else {
                          this.toastr.error(result.message, 'Error')
                        }
                      })
                    }
                  },
                  (error) => {
                    this.isSpinner = false;
                    console.log(error, 'validateProcedure()');
                  }
                );

              } else {
                this.isSpinner = false;
                this.toastr.error('Error', result.message)
              }
            },
            (error) => {
              this.isSpinner = false;
              console.log('csv upload failed', error)
            }
          );
        }
      } else {
        this.isSpinner = false;
        this.toastr.error('Error', res.message)
      }
    }
    this.progressMessage = "";
    this.progressvalue = 0;
  }
  allSelected=false
  toggleAllSelection(select) {
    if (this.allSelected) {
      select.options.forEach((item: MatOption) => item.select());
    } else {
      select.options.forEach((item: MatOption) => item.deselect());
    }
    this.allSelected = false
  }

  async uploadImage(f) {
    this.progressvalue=0
    this.progressMessage = "Uploading " + this.selectedImages.length +" Images.... 0%";
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
      this.progressMessage = "Uploading " + this.selectedImages.length +" Images...."+ this.progressvalue +"%";
      const uploadData = new FormData();
      uploadData.append('File', this.selectedImages[i]);
      this.isSpinner = true;
      const res = await this._procedureService.imageUpload(uploadData)
      if (res.code) {
      
        if (i == this.selectedImages.length - 1) {
          this.toastr.success(res.message, 'Success');

          const uploadData = new FormData();
          uploadData.append('File', this.selectedCsvs[0]);
          this.progressMessage = "Uploading Procedures....";
          this._procedureService.imageUpload2(uploadData).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this.toastr.success(result.message, 'Success');
                this.progressMessage = "Validating Procedures....";
                this.procedure = {
                  "SectionName": "",
                  "ModelName": "",
                  "ComponentName": "",
                  "AreaName": "",
                  "UserName": this.currentUser
                };
                
                this._procedureService.validateProcedure(this.procedure).subscribe(
                  (response) => {
                    const result = response;
                    if (result.code) {
                      this._procedureService.addProcedure().subscribe(
                        (response) => {
                          const result = response;
                          if (result.code) {
                            Swal.fire({
                              title: 'Info',
                              text: "Sucess",
                              confirmButtonText: 'Ok',
                              cancelButtonText: 'NO',
                              width: 900,
                              padding: '9em',
                              showCancelButton: false,
                              showCloseButton: true
                            })
                            this.toastr.success(result.message, 'Success');
                            this.isSpinner = false;
                            this.isAdd = false;
                            
                            this.getVersionList();
                            this.procedureObj.Version=this.versionList[this.versionList.length-1];
                            this.getProcedures();
                            this.isTable = true;
                            Swal.fire({
                              title: 'Info',
                              text: "Please Add Quality Instruction, Special Instruction and Audit Sequence.",
                              confirmButtonText: 'Ok',
                              cancelButtonText: 'NO',
                              width: 900,
                              padding: '9em',
                              showCancelButton: false,
                              showCloseButton: true
                            })
                            f.resetForm();
                          }
                          else {
                            this.toastr.error(result.message, 'Error');
                            this.isSpinner = false;
                            this.isAdd = false;
                            this.isTable = true;
                            this.getProcedures();
                            f.resetForm();
                          }

                        },
                        (error) => {
                          this.isSpinner = false;
                          console.log('addProcedure()', error)
                        }
                      );
                    } else {
                      this.isSpinner = false;
                      Swal.fire({
                        title: 'Info',
                        text: result.message,
                        type: 'warning',
                        confirmButtonText: 'Download error log',
                        showCancelButton: true,
                        showCloseButton: true
                      }).then((res) => {
                        if (res) {
                          this.exportAsXLSX(result.data)
                        } else {
                          this.toastr.error(result.message, 'Error')
                        }
                      })
                    }
                  },
                  (error) => {
                    this.isSpinner = false;
                    console.log(error, 'validateProcedure()');
                  }
                );

              } else {
                this.isSpinner = false;
                this.toastr.error('Error', result.message)
              }
            },
            (error) => {
              this.isSpinner = false;
              console.log('csv upload failed', error)
            }
          );
        }
      } else {
        this.isSpinner = false;
        this.toastr.error('Error', res.message)
      }
    }
    this.progressMessage = "";
    this.progressvalue = 0;
  }

  async uploadImageInsert(f) {
    this.progressvalue=0
    this.progressMessage = "Uploading " + this.selectedImages.length +" Images.... 0%";
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
      this.progressMessage = "Uploading " + this.selectedImages.length +" Images...."+ this.progressvalue +"%";
      const uploadData = new FormData();
      uploadData.append('File', this.selectedImages[i]);
      this.isSpinner = true;
      const res = await this._procedureService.imageUpload(uploadData)
      if (res.code) {
        if (i == this.selectedImages.length - 1) {
          const uploadData = new FormData();
          uploadData.append('File', this.selectedCsvs[0]);
          this.progressMessage = "Uploading Procedures....";
          this._procedureService.imageUpload2(uploadData).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this.progressMessage = "Validating Procedures....";
                this._procedureService.validateProcedure(this.Insert).subscribe(
                  (response) => {
                    const result = response;
                    if (result.code) {
                      this._procedureService.InserProcedure(this.Insert).subscribe(
                        (response) => {
                          const result = response;
                          if (result.code) {
                            Swal.fire({
                              title: 'Info',
                              text: "Sucess",
                              confirmButtonText: 'Ok',
                              cancelButtonText: 'NO',
                              width: 900,
                              padding: '9em',
                              showCancelButton: false,
                              showCloseButton: true
                            })
                            this.toastr.success(result.message, 'Success');
                            this.isSpinner = false;
                            this.isAdd = false;
                            
                            this.getVersionList();
                            this.procedureObj.Version.pop();
                            this.procedureObj.Version=this.versionList[this.versionList.length-1];
                            this.getProcedures();
                            this.isTable = true;
                            Swal.fire({
                              title: 'Info',
                              text: "Please Add Quality Instruction, Special Instruction and Audit Sequence.",
                              confirmButtonText: 'Ok',
                              cancelButtonText: 'NO',
                              width: 900,
                              padding: '9em',
                              showCancelButton: false,
                              showCloseButton: true
                            })
                            f.resetForm();
                          }
                          else {
                            this.toastr.error(result.message, 'Error');
                            this.isSpinner = false;
                            this.isAdd = false;
                            this.isTable = true;
                            this.getProcedures();
                            f.resetForm();
                          }

                        },
                        (error) => {
                          this.isSpinner = false;
                          console.log('addProcedure()', error)
                        }
                      );
                    } else {
                      this.isSpinner = false;
                      Swal.fire({
                        title: 'Info',
                        text: result.message,
                        type: 'warning',
                        confirmButtonText: 'Download error log',
                        showCancelButton: true,
                        showCloseButton: true
                      }).then((res) => {
                        if (res) {
                          this.exportAsXLSX(result.data)
                        } else {
                          this.toastr.error(result.message, 'Error')
                        }
                      })
                    }
                  },
                  (error) => {
                    this.isSpinner = false;
                    console.log(error, 'validateProcedure()');
                  }
                );

              } else {
                this.isSpinner = false;
                this.toastr.error('Error', result.message)
              }
            },
            (error) => {
              this.isSpinner = false;
              console.log('csv upload failed', error)
            }
          );
        }
      } else {
        this.isSpinner = false;
        this.toastr.error('Error', res.message)
      }
    }
    this.progressMessage = "";
    this.progressvalue = 0;
  }

  imageFile: any
  onImageChange(event) {
    this.imageFile = event.target.files
  }

  openImageModal(element){
    const dialogRef = this.dialog.open(ImageComponent, {
      data: element.ImageList
    });
  }

  blob:any;
  exportProcedureWord():void{
   let obj =  {
      "AreaName": "FLT010",
      "ComponentName": "2792000",
      "ModelName": "793F - Basic",
      "SectionName": "08120",
      "Version": 1
  }
    this._procedureService.exportToword(obj).subscribe(res => {
      
      let blob = new Blob();

      blob = new Blob([res]);
   
     var downloadURL = window.URL.createObjectURL(res);
     var link = document.createElement('a');
     link.href = downloadURL;
     
     link.click();
      });

      //  if(window.navigator.msSaveOrOpenBlob) {
      //    window.navigator.msSaveOrOpenBlob(this.blob, fileName);
        
      //  }else{
      //    var link = document.createElement('a');
      //    link.setAttribute("type", "hidden");
      //    link.download = fileName;
      //    link.href = window.URL.createObjectURL(this.blob);
      //    document.body.appendChild(link);
      //    link.click();
      //  }
   
  }

  async exportProcedureXLSX(name): Promise<void> {
    let excelList =[];
    this.spinnerService.show();
    
    this.proced.forEach(element => {
      let obj ={
        'SequenceNumber': element.SequenceNumber,
        'Description': element.Description,
        'Time': element.Time,
        'Operator': element.Operator,
        'WeldProcedure':element.WeldProcedure, 
        'WeldLength':element.WeldLength, 
        'ProcedureDate':element.ProcedureDate,
        'Figure':element.Figure, 
        'PvaFolder':element.PvaFolder,
        'WeldProcess':element.WeldProcess,
        'WireDiameter':element.WireDiameter,
        'WeldPosition':element.WeldPosition, 
        'WeldSize':element.WeldSize, 
        'WeldType':element.WeldType,
        'WireFeedSpeed':element.WireFeedSpeed,
        'Voltage': element.Voltage, 
        'WeldVolume':element.WeldVolume,
        'FigureVisual':element.FigureVisual,
      }
      excelList.push(obj)
    })
    
    if(name == 'excel')
      this._excelService.exportAsExcelFile(excelList, 'Procedures');
    else
      this.downloadPDF(excelList);
  }


  
  GetImages(img){
    let response = this._procedureService.getImage(img).toPromise();
    return response;
  }


  public downloadPDF(json: any[]) {
    //this.spinnerService.show();
    var pdfsize = 'a4';
    const doc = new jsPDF('l', 'px', pdfsize);
    var page = 1;
    // var col:string[]=[]
    var columns = [{
      title: "SEQ",
      dataKey: "SequenceNumber"
      },
      {
      title: "DESCRIPTION",
      dataKey: "Description"
      },
      {
      title: "TIME",
      dataKey: "Time"
      },
      {
      title: "OPERATOR",
      dataKey: "Operator"
      },
      {
      title: "PROCEDURE",
      dataKey: "WeldProcedure"
      },
      {
      title: "LENGTH",
      dataKey: "WeldLength"
      },

      {
      title: "DATE",
      dataKey: "ProcedureDate"
      },

      {
      title: "FIG",
      dataKey: "Figure"
      },
      {
      title: "FOLDER",
      dataKey: "PvaFolder"
      },
      {
      title: "PROCESS",
      dataKey: "WeldProcess"
      },
      {
      title: "DIA",
      dataKey: "WireDiameter"
      },
      {
      title: "POS",
      dataKey: "WeldPosition"
      },
      {
      title: "SIZE",
      dataKey: "WeldSize"
      },
      {
      title: "TYP",
      dataKey: "WeldType"
      },
      {
      title: "WFS",
      dataKey: "WireFeedSpeed"
      },
      {
      title: "VOLT",
      dataKey: "Voltage"
      },{
      title: "VOL",
      dataKey: "WeldVolume"
      },{
      title: "VISUAL",
      dataKey: "FigureVisual"
      },
    ];
   
    var headers = [];
    let ind:number = 0;
    var rows=[]
   var headerdata = [
    {
      title: "Part No.",
      dataKey: "ComponentName"
      },
      {
        title: "Name",
      dataKey: "ModelName"
      },
      {
        title: "Area",
      dataKey: "AreaName"
      },
      {
        title:"Sec",
        dataKey:"SectionName"
      }
   ]
   this.proced.forEach( element => {
         target:EventTarget;
         var j:number=0;
         var imgData:Blob;
         //console.log(element)
       
         element.ImageList.forEach(e => {
          var image = new Image();
          image.src = 'data:image/jpeg;base64,'+element.ByteImages[j];
          if(j==0&& ind==0){}
          else
          {
            doc.addPage();
          }
          header(element);
          doc.addImage(image, "JPEG",100,55,400,300);
          footer()
          j=j+1;
         });
         doc.addPage();
        header(element)
         rows= []
         rows.push(json[ind])
         autoTable(doc,{columns:columns,
          body: 
          rows,
          styles: {
            fontSize: 8,
            cellWidth: 'wrap',
          },
          theme: 'grid',
          columnStyles:{
            1: {
            cellWidth: 100
            }
          }
          });
          footer()
          ind = ind+1
          j=0;
       
      })
      doc.save('test.pdf')
     function footer(){ 
      doc.setFontSize(8);
     // doc.setTextColor(0,255,0);
      doc.text( 'Caterpillar - Confidential Green ',50,400); //print number bottom right
      doc.text('Generated by - '+ localStorage.getItem("currentUser") +'-'+new Date(),350,400)
      page ++;
    };
    function header(element)
    {
      let headrow ={
        'ComponentName': element.ComponentName,
        'ModelName': element.ModelName,
        'AreaName': element.AreaName,
        'SectionName': element.SectionName
      }
      doc.setFontSize(8);
      doc.text("WELD PROCEDURE",300,10)
      var nrow=[]
      nrow.push(headrow)
      autoTable(doc,{columns:headerdata,
        body: 
        nrow,
        styles: {
          fontSize: 5,
          cellWidth: 'wrap',
        },
        theme: 'grid',
        columnStyles:{
          1: {
          cellWidth: 100
          }
        }
        });
    }
  }

  refreshPage(event:PageEvent)
  {
    localStorage.setItem("pageLimit" ,String(event.pageSize));  
    localStorage.setItem("pageIndex" ,String(event.pageIndex));  
  }
}
