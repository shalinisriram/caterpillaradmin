import { Component, OnInit, ViewChild } from '@angular/core';
import { AnnotationService } from '../../../providers/annotation.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatOption } from '@angular/material';
import { Validators, FormBuilder, NgForm } from '@angular/forms';
import { ProcedureService } from '../../../providers/procedure.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ExcelService } from '../../../providers/excel.service';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ImageComponent } from '../traceability/image.component';
import { environment } from '../../../environments/environment';

const QualityUrl = environment.QualityUrl;
const adminUrl = environment.adminURL;

@Component({
  selector: 'app-qualityworkinstructions',
  templateUrl: './qualityworkinstructions.component.html',
  styleUrls: ['./qualityworkinstructions.component.css']
})
export class QualityworkinstructionsComponent implements OnInit {
  qualityInstructionList: any = []
  procedurelist
  isTable = true;
  isEdit = false;
  isAdd = false;
  currentUser;
  dataSource: any = []
  sectionsList: any = []
  progressvalue: number;
  progressMessage: string;
  selectedImages;
  selectedCsvs;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedItemIds: any[];
  AreaLists: any = [];
  ModelLists: any = [];
  SectionLists: any = [];
  ComponentLists: any = [];
  versionLists: any = [];
  procedure: any = {
    "SectionName": "",
    "ModelName": "",
    "ComponentName": "",
    "AreaName": [],
    "UserName": ""
  };
  form: any;
  
  isImageUpload = false
  
  constructor(private _adminService: AnnotationService,
    private fb: FormBuilder,
    private _procedureService: ProcedureService,
    private _excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {
    this.procedure['UserName'] = localStorage.getItem('currentUser');

    //      this.ecr['UserName'] = localStorage.getItem('currentUser');

    this.currentUser = localStorage.getItem('currentUser')
  }
  displayedColumns = ['Id', 'Figure', 'CheckPoints','Section','Area','Model','Component', 'Version']

  pageLimit: number;
  ngOnInit() {
    this.form = this.fb.group({
      SectionName: [null, Validators.compose([Validators.required])],
      ModelName: [null, Validators.compose([Validators.required])],
      ComponentName: [null, Validators.compose([Validators.required])],
      AreaName: [null, Validators.compose([Validators.required])],
    });
    this.getAreaList();
    this.getAreas();
    this.getSectionList()
    this.getSectionWithId();
    this.getAreaWithId()
    this.getModelWithId()
    this.getComponentWithId()
    this.LinkS = "https://newwebapi.azurewebsites.net/api/Admin/QualityTemplate"
    if (localStorage.getItem("pageLimit"))
      this.pageLimit = Number(localStorage.getItem("pageLimit"));
    else
      this.pageLimit = 20;
  }
  areaList: any = []

  LinkS:any
  sectionWithId: any = []
  modelWithId: any = []
  areaWithId: any = []
  componentWithId: any = []
  allSelected=false
  toggleAllSelection(select) {
    if (this.allSelected) {
      select.options.forEach((item: MatOption) => item.select());
    } else {
      select.options.forEach((item: MatOption) => item.deselect());
    }
    this.allSelected = false
  }


  getSectionWithId() {
    this._adminService.getSectionWithId().subscribe(
      (response) => {
        const result = response
        this.sectionWithId = response


      }
    )
  }

  getModelWithId() {
    this._adminService.getModelWithId().subscribe(
      (response) => {
        const result = response
        this.modelWithId = response

      }
    )
  }

  getAreaWithId() {
    this._adminService.getAreaWithId().subscribe(
      (response) => {
        const result = response
        this.areaWithId = response

      }
    )
  }

  getComponentWithId() {
    this._adminService.getComponentWithId().subscribe(
      (response) => {
        const result = response
        this.componentWithId = response

      }
    )
  }

  getAreas() {
    this._procedureService.Areas().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result['data']
          console.log( this.areaList)
        } else {
          this.areaList = []
        }
      },
      (error) => {
        console.log(error, 'getAreas()');
      }
    );
  }
  
  qualityObj: any = {
    "AreaName": [],
    "ComponentName": "",
    "ModelName": "",
    "SectionName": "",
    "Version":""
  };
  getAreaList() {
    this._procedureService.getAllAreaWithSection(this.qualityObj.SectionName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.AreaLists = result.data;
          if (localStorage.getItem("area"))
            this.qualityObj.AreaName = JSON.parse(localStorage.getItem("area"));
          else {
            this.qualityObj.AreaName = []
            this.qualityObj.AreaName.push(this.AreaLists[0]);
          }
          this.getComponentList();
          this.getVersionList()
        } else {
          this.AreaLists = [];
          this.getComponentList();
          this.getVersionList()
        }
      },
      (error) => {
        console.log(error, 'getAreaList()');

      }
    );
  }
  onFileChanged(event) {
    this.selectedImages = [];
    this.selectedImages = event.target.files;
    console.log(this.selectedImages);

  }

  onFileChangedCsv(event) {
    this.selectedCsvs = event.target.files;
  }

  getModelList() {
    this._procedureService.getModels(this.qualityObj.SectionName,this.currentUser).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelLists = result.data;
          this.qualityObj.ModelName=this.ModelLists[0];
          // if (localStorage.getItem("model"))
          //   this.qualityObj.ModelName = JSON.parse(localStorage.getItem("model"));
          // else {
          //   this.qualityObj.ModelName = [];
          //   this.qualityObj.ModelName.push(this.ModelLists[0]);;
          // }
          
          
          this.getComponentList()
          this.getVersionList()
        } else {
          this.ModelLists = [];
          this.getComponentList()
          this.getVersionList()
         
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
          this.SectionLists = result.data;
          this.qualityObj.SectionName= this.SectionLists[0];
        
          // if (localStorage.getItem("section"))
          //   this.qualityObj.SectionName = JSON.parse(localStorage.getItem("section"));
          // else {
          //   this.qualityObj.SectionName = []
          //   this.qualityObj.SectionName.push(this.SectionLists[0]);
          // }
          this.getAreaList()
          this.getModelList()
          this.getVersionList();
         
        } else {
          this.SectionLists = [];
          this.getModelList()
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
      'Model': this.qualityObj.ModelName,
      'Area': this.qualityObj.AreaName,
      'UserName': this.currentUser
    }
    this._procedureService.getComponents(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentLists = result.data;
          this.qualityObj.ComponentName= this.ComponentLists[0];
          // if (localStorage.getItem("component"))
          //   this.qualityObj.ComponentName = JSON.parse(localStorage.getItem("component"));
          // else {
          //   this.qualityObj.ComponentName = []
          //   this.qualityObj.ComponentName.push(this.ComponentLists[0]);
          // }
          this.getVersionList() 
        } else {
          this.ComponentLists = [];
          this.getVersionList()
        }
      },
      (error) => {
        console.log(error, 'getComponentList()');
      }
    );
  }

  getVersionList() {
    let obj = {
      "AreaName": this.qualityObj.AreaName,
      "ComponentName": [this.qualityObj.ComponentName],
      "ModelName": [this.qualityObj.ModelName],
      "SectionName": [this.qualityObj.SectionName],
      "UserName": this.currentUser
    }
    this._procedureService.getQualityVersionList(obj).subscribe(
      (response) => {
        localStorage.setItem("model", JSON.stringify(obj.ModelName))
        localStorage.setItem("area", JSON.stringify(obj.AreaName))
        localStorage.setItem("section", JSON.stringify(obj.SectionName))
        localStorage.setItem("component", JSON.stringify(obj.ComponentName))
        const result = response;
        if (result.code) {
          this.versionLists = result.data;

          this.qualityObj.Version =this.versionLists[this.versionLists.length - 1];
          
        } else {
          this.versionLists = [];
        }
      },
      (error) => {
        console.log(error, 'getVersionList()');
      }
    );
  }

  setDefault() {
    localStorage.removeItem("area")
    localStorage.removeItem("component")
    localStorage.removeItem("model")
    localStorage.removeItem("section")
    localStorage.removeItem("pageLimit")
    this.ngOnInit();

  }
  isSpinner = false;
  async uploadImage(f) {
    this.progressvalue = 0
    
    this.progressMessage = "Uploading " + this.selectedImages.length + " Images....";
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
      this.progressMessage = "Uploading " + this.selectedImages.length  + " Images...." + this.progressvalue+"%";
      const uploadData = new FormData();
      uploadData.append('File', this.selectedImages[i]);
      this.isSpinner = true;
      const res = await this._procedureService.imageUpload(uploadData)
      if (res.code) {
        if (i == this.selectedImages.length - 1) {
          const uploadData = new FormData();
          uploadData.append('File', this.selectedCsvs[0]);
          this.progressMessage = "Uploading Quality....";
          this._procedureService.imageUpload2(uploadData).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this.toastr.success('Images are Upload Successfully', 'Success');
                this.toastr.success(result.message, 'Success');
                this._adminService.addQualityInstruction().subscribe(
                  (response) => {
                    const result = response;
                    if (result.code) {
                      this.isImageUpload = false
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
                      this.getVersionList();
                      
                      this.qualityObj.Version = this.versionLists[this.versionLists.length - 1];
                      this.getQualityInstruction()
                      this.isTable = true;

                      f.resetForm();
                    }
                    else {
                      this.isImageUpload = false
                      this.toastr.error(result.message, 'Error');
                      this.isSpinner = false;
                      this.isAdd = false;
                      this.isTable = true;
                      f.resetForm();
                    }

                  },
                  (error) => {
                    this.isImageUpload = false
                    this.isSpinner = false;
                    console.log('addQuality()', error)
                  }
                );
              }
            },
            (error) => {
              this.isImageUpload = false
              this.isSpinner = false;
              console.log('csv upload failed', error)
            }
          );
        }
      } else {
        this.isImageUpload = false
        this.isSpinner = false;
        this.toastr.error('Error', res.message)
      }
    }
    this.progressMessage = "";
    this.progressvalue = 0;
  }


  exportAsXLSX(excelList): void {
    this._excelService.exportAsExcelFile(excelList, 'Excel');
  }

  addQuality(f: NgForm) {
    this.isImageUpload = true
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
  sectionName: any = "";

  modelList: any = []
  componentList: any = []
  selectedFile: File

  getModels() {
    console.log(this.procedure.SectionName)
    this.sectionName = this.procedure.SectionName
    this._procedureService.getModels(this.procedure.SectionName, this.currentUser).subscribe(
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
  editArea: any
  FigureVisual: any
  areaWithName: any = []

  onImageChange(event) {
    this.imageFile = event.target.files
  }
  showUpdateForm(element) {
    this.procedure = { ...element };
    this.FigureVisual = element.FigureVisual
    this.sectionWithId.forEach(ele => {

      if (ele.id == element.SectionId) {

        this.procedure.SectionName = ele.sectionName
      }
    });
    this.getModels();

    this.modelWithId.forEach(ele => {
      if (ele.id == element.CATModelId) {

        this.procedure.ModelName = ele.modelName
      }
    });

    this.areaWithId.forEach(ele => {
      if (ele.id == element.AreaId) {
        this.areaWithName.push(ele.areaName)
      }
    });
    this.procedure.AreaName = this.areaWithName
    this.componentWithId.forEach(ele => {
      if (ele.id == element.ComponentId) {

        this.procedure.ComponentName = ele.componentName
      }
    });

    this.getModels();
    this.getAreas();
    this.getComponents();
    this.isTable = false;
    this.isEdit = true;
  }

  UpdateQuality(f: NgForm) {
    if (this.imageFile) {
      console.log("hiii")
      this.procedure.FigureVisual = this.FigureVisual
      this._procedureService.clearTemp().subscribe(
        (response) => {
          const result = response;
          if (result.code) {

            let X = this.procedure.FigureVisual.split(';')
            for (var i = 0; i < this.imageFile.length; i++) {
              console.log(X)
              if (X.some(v => this.imageFile[i].name.split('.')[0] === v)) {
                const uploadData = new FormData();
                uploadData.append('File', this.imageFile[i]);
                console.log(uploadData)
                this._procedureService.SingleimageUpload(uploadData).subscribe((response) => {
                  const result = response;
                  if (result.code) {
                    this._adminService.EditQualityInstruction(this.procedure).subscribe(
                      (response) => {
                        const result = response;
                        if (result.code) {
                          this.toastr.success(result.message, 'Success');
                          this.isEdit = false;
                          this.isTable = true;
                          this.imageFile=null
                          this.getQualityInstruction();
                          f.resetForm();
                        } else {
                          this.toastr.error(result.message, 'Error');
                          this.isEdit = false;
                          this.isTable = true;
                          this.imageFile=null
                          this.getQualityInstruction();
                          f.resetForm();
                        }
                      })
        
                  }

                  else {
                    this.toastr.error('Error', 'images could not be uploaded');
                  }
                })
                this.imageFile=null
              }
              else {
                this.toastr.error('Error', 'Figure visual and upload image name must be same');
              }
            }
            
          }
          else {
            this.toastr.error('Error', result.message)
          }
        })
    }
    else {
      console.log("hi")
      this.procedure.FigureVisual = this.FigureVisual
      this._procedureService.clearTemp().subscribe(
        (response) => {
          const result = response;
          if (result.code) {
            this._adminService.EditQualityInstruction(this.procedure).subscribe(
              (response) => {
                const result = response;
                if (result.code) {
                  this.toastr.success(result.message, 'Success');
                  this.isEdit = false;
                  this.isTable = true;
                  this.getQualityInstruction();
                  f.resetForm();
                } else {
                  this.toastr.error(result.message, 'Error');
                  this.isEdit = false;
                  this.isTable = true;
                  this.getQualityInstruction();
                  f.resetForm();
                }
              },
              (error) => {
                console.log('updateQuality()', error)
              }
            )
          } else {
            this.toastr.error('Error', result.message)
          }
        },
        (error) => {
          console.log('updateQuality()', error)
        })
    }
  }

  getComponents() {


    let obj = {
      'Model': this.procedure.ModelName,
      'Area': this.procedure.AreaName,
      'UserName': this.currentUser
    }

    this._procedureService.getComponents(obj).subscribe(
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
  imageFile: any


  image: any = []

  openImageModal(element){ 
    this.image = [QualityUrl+"QualityInstruction/"+element.Id+"?imgNo=0"]
    console.log(this.image)
    const dialogRef = this.dialog.open(ImageComponent, {
      data: this.image
    });
  }
count = 0
  onPercentChange(){
    this.count=this.count+1
  }

  GetQuality=false
  AreaListOFId:any=[]
  getQualityInstruction() {
    this.getAreas();
    this.GetQuality = true
    this.spinnerService.show()
    let  prObj = {
      "AreaName": this.qualityObj.AreaName,
      "ComponentName":[this.qualityObj.ComponentName],
      "ModelName": [this.qualityObj.ModelName],
      "SectionName": [this.qualityObj.SectionName],
      "Version": [this.qualityObj.Version]
    };
    this.spinnerService.show()
    this._adminService.getQualityInstructions(prObj).subscribe(
      (response) => {
        const result = response;
        console.log(result.data)
        if (result.code) {
          this.qualityInstructionList = result.data
          this.qualityInstructionList.forEach(element => {
            this.areaList.forEach(ele=> {
              console.log(ele)
              console.log(element)
              if(parseInt(ele.Id) == element.AreaId)
              {
                this.AreaListOFId.push({
                  'id': element.AreaId,
                  'Name':ele.AreaName
                })
              }
              
            });
              
          });
          console.log( this.AreaListOFId)
          this.dataSource = new MatTableDataSource<any>(this.qualityInstructionList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide();
          this.GetQuality=false 
        }
        else{
          this.GetQuality=false 
          this.spinnerService.hide()
          console.log("getQuality()")
        }
      }
    )
    this.spinnerService.hide()
  }

}
