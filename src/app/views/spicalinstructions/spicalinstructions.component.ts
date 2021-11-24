import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcedureService } from '../../../providers/procedure.service';
import { AnnotationService } from '../../../providers/annotation.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatOption } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { WorkstationsService } from '../../../providers/workstations.service';
import { ImageComponent } from '../traceability/image.component';
import { environment } from '../../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
const WorkInstructionInputOptionUrl = environment.WorkInstructionInputOptionUrl
@Component({
  selector: 'app-spicalinstructions',
  templateUrl: './spicalinstructions.component.html',
  styleUrls: ['./spicalinstructions.component.css']
})
export class SpicalinstructionsComponent implements OnInit {
  procedureObj: any = {
    "AreaName": [],
    "ComponentName": '',
    "ModelName": '',
    "SectionName": '',
    "Version": ''
  };
  displayedColumns=['Id',"CurrentTimeStamp",'FileName']
  isTable=true
  isAdd = false
  isEdit=false
  isImageUpload= false
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentUser:any=''
  constructor(private _procedureService:ProcedureService,
    private _admin :AnnotationService,
    private _adminService: AnnotationService,
    private tostar :ToastrService,
    private toastr:ToastrService,
    private _image:WorkstationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialog: MatDialog) { 
      this.currentUser = localStorage.getItem('currentUser')
    }

  ngOnInit() {
    
     this.getSectionListS();
     this. getSectionList();
    this.getSectionWithId();
    this.getAreaWithId()
    this.getModelWithId()
    this.getComponentWithId()
  }
  sectionWithId:any=[]
  modelWithId:any=[]
  areaWithId:any=[]
  componentWithId:any=[]

  image:any=[]



  SectionLists:any =[]
  
  getSectionListS() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionLists = result.data;
          this.procedureObj.SectionName= this.SectionLists[0];
        
          // if (localStorage.getItem("section"))
          //   this.qualityObj.SectionName = JSON.parse(localStorage.getItem("section"));
          // else {
          //   this.qualityObj.SectionName = []
          //   this.qualityObj.SectionName.push(this.SectionLists[0]);
          // }
          this.getAreaList()
          this.getModelLists()
          this.getVersionLists();
         
        } else {
          this.SectionLists = [];
          this.getModelLists()
          this.getVersionLists();

        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }
  ModelLists:any=[]

  getModelLists() {
    this._procedureService.getModels(this.procedureObj.SectionName,this.currentUser).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelLists = result.data;
          this.procedureObj.ModelName=this.ModelLists[0];
          // if (localStorage.getItem("model"))
          //   this.qualityObj.ModelName = JSON.parse(localStorage.getItem("model"));
          // else {
          //   this.qualityObj.ModelName = [];
          //   this.qualityObj.ModelName.push(this.ModelLists[0]);;
          // }
          
          
          this.getComponentLists()
          this.getVersionLists()
        } else {
          this.ModelLists = [];
          this.getComponentLists()
          this.getVersionLists()
         
        }
      },
      (error) => {
        console.log(error, ' getModelList()');
      }
    );
  }
  ComponentLists:any=[]
  getComponentLists() {
    let obj = {
      'Model': this.procedureObj.ModelName,
      'Area': this.procedureObj.AreaName,
      'UserName': this.currentUser
    }
    this._procedureService.getComponents(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentLists = result.data;
          this.procedureObj.ComponentName= this.ComponentLists[0];
          // if (localStorage.getItem("component"))
          //   this.qualityObj.ComponentName = JSON.parse(localStorage.getItem("component"));
          // else {
          //   this.qualityObj.ComponentName = []
          //   this.qualityObj.ComponentName.push(this.ComponentLists[0]);
          // }
          this.getVersionLists() 
        } else {
          this.ComponentLists = [];
          this.getVersionLists()
        }
      },
      (error) => {
        console.log(error, 'getComponentList()');
      }
    );
  }

  versionLists:any=[]
  getVersionLists() {
    let obj = {
      "AreaName": this.procedureObj.AreaName,
      "ComponentName":[ this.procedureObj.ComponentName],
      "ModelName": [this.procedureObj.ModelName],
      "SectionName": [this.procedureObj.SectionName],
      
    }
    this._procedureService.getSplInstructionVersionList(obj).subscribe(
      (response) => {
        localStorage.setItem("model", JSON.stringify(obj.ModelName))
        localStorage.setItem("area", JSON.stringify(obj.AreaName))
        localStorage.setItem("section", JSON.stringify(obj.SectionName))
        localStorage.setItem("component", JSON.stringify(obj.ComponentName))
        const result = response;
        if (result.code) {
          this.versionLists = result.data;

          this.procedureObj.Version =this.versionLists[this.versionLists.length - 1];
          
        } else {
          this.versionLists = [];
        }
      },
      (error) => {
        console.log(error, 'getVersionList()');
      }
    );
  }

  openImageModal(element){
    this.image = [WorkInstructionInputOptionUrl+"SplInstruction/"+element.Id+"?imgNo=0"]
    console.log(this.image)
    const dialogRef = this.dialog.open(ImageComponent,{
      data: this.image
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  procedure: any = {
    "SectionName": "",
    "ModelName": "",
    "ComponentName": "",
    "AreaName": [],
    "UserName": localStorage.getItem("currentUser")
  };

  addSpclInstr(f: NgForm) {
    this. isImageUpload= true
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.uploadImage(f)
         
          this.getVersionList();
       
          this.procedureObj.Version.pop();
          if(!this.procedureObj.Version.includes(this.versionList[this.versionList.length-1]))
          {
            this.procedureObj.Version.push(this.versionList[this.versionList.length-1]);
          }
          this.procedureObj.Version = this.procedureObj.Version.filter(Boolean)
        }

      },
      (error) => {
        console.log('clearTemp', error);

      }
    );
  }

  progressvalue:number;
  progressMessage:string;
  selectedImages;

  async uploadImage(f) {
    this.isImageUpload= true
    this.progressvalue=0
    this.progressMessage = "Uploading " + this.selectedImages.length+1 +" Images.... 0%";
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
      this.progressMessage = "Uploading " + this.selectedImages.length+1 +" Images...."+ this.progressvalue +"%";
      const uploadData = new FormData();
      uploadData.append('File', this.selectedImages[i]);
      
      const res = await this._procedureService.imageUpload(uploadData)
      if(res.code)
      {
        
      }
    }
    this._admin.addSpclInstr(this.procedure).subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.isImageUpload = false
          this.isAdd= false
          this.isTable = true
          this.tostar.success(result.message,"sucess")
          this.getVersionList()
          
          this.procedureObj.Version.pop();
          if(!this.procedureObj.Version.includes(this.versionList[this.versionList.length-1]))
          {
            this.procedureObj.Version.push(this.versionList[this.versionList.length-1]);
          }
          this.procedureObj.Version = this.procedureObj.Version.filter(Boolean)   
          this.getSplInstruction();   
        }
        else
        {
          this.isImageUpload = false
          this.tostar.error(result.message)
        }
      }
    )
    this.isImageUpload = false
    this.progressMessage = "";
    this.progressvalue = 0;
    this.getSplInstruction();
  }

  onFileChanged(event) {
    this.selectedImages = [];
    this.selectedImages = event.target.files;
    

  }
  imageFile:any
  onImageChange(event) {
    this.imageFile = event.target.files
  }

  
  areaWithName:any=[]
  FigureVisual:any

  getSectionWithId()
  {
    this._adminService.getSectionWithId().subscribe(
      (response)=>
      {
        const result = response
        this.sectionWithId = response
        
        
      }
    )
  }

  getModelWithId()
  {
    this._adminService.getModelWithId().subscribe(
      (response)=>
      {
        const result = response
        this.modelWithId=response
        
      }
    )
  }

  getAreaWithId()
  {
    this._adminService.getAreaWithId().subscribe(
      (response)=>
      {
        const result = response
        this.areaWithId=response
       
      }
    )
  }

  getComponentWithId()
  {
    this._adminService.getComponentWithId().subscribe(
      (response)=>
      {
        const result = response
        this.componentWithId=response
       
      }
    )
  }


  showUpdateForm(element) {
    
   this.procedure= { ...element };
    this.FigureVisual = element.FileName
    this.sectionWithId.forEach(ele => {
      
      if(ele.id == element.SectionId)
      {
      
        this.procedure.SectionName = ele.sectionName
      }
    });

   
    this.modelWithId.forEach(ele => {
      if(ele.id == element.CATModelId)
      {
        
        this.procedure.ModelName = ele.modelName
      }
    });
   
    this.areaWithId.forEach(ele => {
    
      if(ele.id == element.AreaId)
      {
        this.areaWithName.push(ele.areaName)
      }
    });
   this.procedure.AreaName = this.areaWithName
    this.componentWithId.forEach(ele => {
      if(ele.id == element.ComponentId)
      {
       
        this.procedure.ComponentName = ele.componentName
      }
    });
  

    this.isTable = false;
    this.isEdit = true;
  }

  UpdateSpclInstr(f: NgForm) {
    if (this.imageFile) {
      this.procedure.FileName = this.FigureVisual
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
         

          let X =  this.procedure.FileName.split(';')
          let XY = []
          X.forEach(element => {
            if(element.includes("/"))
            {
              var listItem = element.split('/')
              XY.push(listItem[listItem.length-1])
            }
            
          });
          for(var i =0;i<this.imageFile.length;i++){

            if (XY.some(v => this.imageFile[i].name === v)) 
            {
              const uploadData = new FormData();
              uploadData.append('File', this.imageFile[i]);
              this._procedureService.SingleimageUpload(uploadData).subscribe((response) => {
                const result = response;
                if (result.code) {
                  this._adminService.EditSpclInstr(this.procedure).subscribe(
                    (response) => {
                      const result = response;
                      if (result.code) {
                        this.toastr.success(result.message, 'Success');
                        this.isEdit = false;
                        this.isTable = true;
                        this.getSplInstruction();
                        f.resetForm();
                      } else {
                        this.toastr.error(result.message, 'Error');
                        this.isEdit = false;
                        this.isTable = true;
                        this.getSplInstruction();
                        f.resetForm();
                      }
                    })
                }
                else{
                  this.toastr.error('Error', 'images could not be uploaded');
                }
              }) 
              
            }
                     }
         
        
          
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
          
          this._adminService.EditSpclInstr(this.procedure).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this.toastr.success(result.message, 'Success');
                this.isEdit = false;
                this.isTable = true;
                this.getSplInstruction();
                f.resetForm();
              } else {
                this.toastr.error(result.message, 'Error');
                this.isEdit = false;
                this.isTable = true;
                this.getSplInstruction();
                f.resetForm();
              }
            },
            (error) => {
              console.log('updateQuality()', error)
            }
          )
        }else{
          this.toastr.error('Error',result.message)
        }
        },
        (error) => {
          console.log('updateQuality()', error)
        })
    }
  }


  SectionList:any=[]
  getSectionList() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
         
          this. getAreaList()
          this.getVersionList();
        } else {
          this.SectionList = [];
          this.getVersionList();
        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }
  ModelList:any=[]
  getModelList() {
    this._procedureService.getModels(this.procedure.SectionName,this.currentUser).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelList = result.data;
         
          
          this.getComponentList();
        } else {
          this.ModelList = [];
     
        }
      },
      (error) => {
        console.log(error, ' getModelList()');
      }
    );
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
  
  AreaList:any=[]
  getAreaList() {
    let obj = {
      'SectionName':''
    }
    if(this.isAdd || this.isEdit)
    {
      obj.SectionName = this.procedure.SectionName
    }
    else{
      obj.SectionName =this.procedureObj.SectionName
    }
    
    this._procedureService.getAllAreaWithSection(obj.SectionName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.AreaList = result.data;
          if(localStorage.getItem("area"))
            this.procedureObj.AreaName = JSON.parse(localStorage.getItem("area"));
          else{
              this.procedureObj.AreaName=[]
              this.procedureObj.AreaName.push(this.AreaList[0]);
          }
          this.getComponentList();
        } else {
          this.AreaList = [];
          this.getComponentList();
        }
      },
      (error) => {
        console.log(error, 'getAreaList()');

      }
    );
  }
  ComponentList:any=[]
  getComponentList() {
    let obj = {
      'Model': this.procedure.ModelName,
      'Area': this.procedure.AreaName,
      'UserName': this.currentUser
    }
    this._procedureService.getComponents(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentList = result.data;
        
        } else {
          this.ComponentList = [];
          
        }
      },
      (error) => {
        console.log(error, 'getComponentList()');
      }
    );
  }
  versionList:any=[]
  getVersionList() {
    let obj = {
      "AreaName": this.procedureObj.AreaName,
      "ComponentName": [this.procedureObj.ComponentName],
      "ModelName": [this.procedureObj.ModelName],
      "SectionName": [this.procedureObj.SectionName]
    }
    this._procedureService.getSplInstructionVersionList(obj).subscribe(
      (response) => {
        localStorage.setItem("model",JSON.stringify(obj.ModelName))
        
       localStorage.setItem("area",JSON.stringify(obj.AreaName))
        localStorage.setItem("section",JSON.stringify(obj.SectionName))
        localStorage.setItem("component",JSON.stringify(obj.ComponentName))
        const result = response;
        if (result.code) {
          this.versionList = result.data;
          if(!this.procedureObj.Version.includes(this.versionList[this.versionList.length-1]))
          {
            this.procedureObj.Version.push(this.versionList[this.versionList.length-1]);
          }
          this.procedureObj.Version = this.procedureObj.Version.filter(Boolean)
         
        } else {
          this.versionList = [];
        }
      },
      (error) => {
        console.log(error, 'getVersionList()');
      }
    );
  }
  spclInstList:any=[] 
  dataSource:any=[]
  getSplInstruction()
  {
    this.spinnerService.show()
    let obj = {
      'AreaName' : this.procedureObj.AreaName,
      'ComponentName':[this.procedureObj.ComponentName],
      'ModelName':[this.procedureObj.ModelName],
      'SectionName':[this.procedureObj.SectionName],
      'Version':[this.procedureObj.Version]
    }
    this._admin.getSpclInstr(obj).subscribe(
      (response)=>
      {
        const result = response
        if(result.code)
        {
          this.spclInstList=result.data
          this.dataSource = new MatTableDataSource<Element>(this.spclInstList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide()
        }
        else{
          this.spclInstList = []
          this.spinnerService.hide()
        }
      }
    );
    (error)=>
    {
      console.log("getSpclInst()")
      this.spinnerService.hide()
      
    }
    
  }
  

}
