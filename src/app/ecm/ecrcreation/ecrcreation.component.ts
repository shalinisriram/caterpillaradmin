import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EcrcreationService } from '../../../providers/ecrcreation.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcedureService } from '../../../providers/procedure.service';
import { InboxComponent } from '../inbox/inbox.component';
import { DataService } from '../../../providers/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-ecrcreation',
  templateUrl: './ecrcreation.component.html',
  styleUrls: ['./ecrcreation.component.css']
})
export class EcrcreationComponent implements OnInit {
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  browseFiles = [];

  department:string;
  operation:string;
  departmentSelect:string;
  Departmentlist:any=[]
  ProcessLists=[];
  OpertionList=[]

  isEcrForm=true;
  isEcrRouting=false;
  
  public form: FormGroup;
  
  
  @Input('data')
  ecr: any = {
    "Id":0,
    "ECRNumber": "",
    "Description": "",
    "EffectiveDate": "",
    "SerialNumber":"",
    "PartNumber": "",
    "RevisionNumber": "",
    "RequestedBy": "",
    "Files": "",
    "CatJobNumber": "",
    "ECRType": "",
    "UserName": "",
    "CurrentTimeStamp": Date,
    "ECRRelease": "",
    "isDisable": false
}
ProcessList:any=[]
groupSelectedList:any=[]
routingGroupPr:any=[]

routingGroup:any={
  "Process":'',
  "Groups":[]
}

SectionList:any=[]
ecrrouting:any={
  "EcrNumber":'',
  "Depts":'',
  "Section":'',
  "ProcessNames": this.routingGroupPr
}
Database: any = [
  ];
  sectionList:[]
  types:any = [
    'Engineering change',
    'Process',
    'Deviation',
    'npi'
  ];
  
  toastr: any;
  selectedDepts:any;
  constructor(private fb: FormBuilder,
    private _ecrService:EcrcreationService,
    private toasterService: ToastrService,
    private _router: Router,
    private route:ActivatedRoute,
    private eventEmitterService: DataService, 
    private _procedureService:ProcedureService,
    private spinnerService: Ng4LoadingSpinnerService,
    ) { }

  ngOnInit() {
    
    console.log(this.ecr.isDisable);

    this.form = this.fb.group({
      ECRNumber: [null, Validators.compose([Validators.required])],
      Description: [null, Validators.compose([Validators.required])],
      EffectiveDate: [null],//Validators.compose([Validators.required])
      SerialNumber: [null],//, Validators.compose([Validators.required])
      PartNumber: [null, Validators.compose([Validators.required])],
      RevisionNumber: [null, Validators.compose([Validators.required])],
      RequestedBy: [null, Validators.compose([Validators.required])],
      CatJobNumber: [null, Validators.compose([Validators.required])],
      ECRType: [null, Validators.compose([Validators.required])],
     // disable : this.ecr.isDisable
    });
    this.routingGroupPr=[]
    this.getProcesslist()
    this.populateDepartmentList()
    this.getProcessGroup()
    this.getSectionList()
  }
  populateDepartmentList()
  {
    this._ecrService.getDepartment().subscribe(
      (response)=>
      {
        const result=response;
        if(result.code)
        {

          this.Departmentlist = result.data
        }
      }
    )
  }
  getSectionList() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
        } else {
          this.SectionList = [];
        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }
  onFileChanged(event) {
    this.browseFiles = event.target.files;

  }

  getClearTemp()
  {
    this._ecrService.getClearTemp().subscribe(
      (response)=>{
        const result = response;
        if(result.code)
        {
          this.ecr.Id = 0;
          this.ecr.ECRNumber = "";
          this.ecr.Description ="";
          this.ecr.EffectiveDate = "";
          this.ecr.SerialNumber = "";
          this.ecr.PartNumber = "";
          this.ecr.RevisionNumber = "";
          this.ecr.RequestedBy = "";
          this.ecr.CatJobNumber = "";
          this.ecr.ECRType = "";
          this.ecr.Files = this.browseFiles.length==0? "":this.browseFiles[0].name;
          this.ecr.UserName = localStorage.getItem('currentUser');
          this.ecr.CurrentTimeStamp= new Date();
        }
        else{}
      },
      (error)=>{
        console.log('getClearTemp()', error)
      }
      )
  }

  getEcrFormData()
  {
    this.ecr.Id = 0;
    this.ecr.ECRNumber = this.form.value.ECRNumber;
    this.ecr.Description = this.form.value.Description;
    this.ecr.EffectiveDate = this.form.value.EffectiveDate;
    this.ecr.SerialNumber = this.form.value.SerialNumber;
    this.ecr.PartNumber = this.form.value.PartNumber;
    this.ecr.RevisionNumber = this.form.value.RevisionNumber;
    this.ecr.RequestedBy = this.form.value.RequestedBy;
    this.ecr.CatJobNumber = this.form.value.CatJobNumber;
    this.ecr.ECRType = this.form.value.ECRType;
    this.ecr.Files = this.browseFiles.length==0? this.ecr.Files:this.browseFiles[0].name;
    this.ecr.UserName = localStorage.getItem('currentUser');
    this.ecr.CurrentTimeStamp= new Date();
  }

  getInbox()
  {
    
    this._router.navigate(['inbox'])
    
    this._router.routeReuseStrategy.shouldReuseRoute = function(){return false;};

    let currentUrl = this._router.url + '?';
    
    if(currentUrl == "/inbox?")
    {
      this._router.navigateByUrl(currentUrl)
        .then(() => {
          this._router.navigated = false;
          this._router.navigate([this._router.url]);
        });
    }
    this.eventEmitterService.onFirstComponentButtonClick();
  }

  getSaveEcrForm()
    {
      this.ecr.ECRRelease="save"
      this.getEcrFormData();
      let ecrdata = {
        "Id" : this.ecr.Id,
        "ECRNumber":this.ecr.ECRNumber,
        "Description":this.ecr.Description,
        "EffectiveDate":this.ecr.EffectiveDate,
        "SerialNumber":this.ecr.SerialNumber,
        "PartNumber":this.ecr.PartNumber,
        "RevisionNumber":this.ecr.RevisionNumber,
        "RequestedBy":this.ecr.RequestedBy,
        "CatJobNumber":this.ecr.CatJobNumber,
        "ECRType":this.ecr.ECRType,
        "Files":this.ecr.Files,
        "UserName":this.ecr.UserName,
        "CurrentTimeStamp":this.ecr.CurrentTimeStamp,
        "ECRRelease":this.ecr.ECRRelease

      }
      

      this.uploadFiles();
      console.log(this.ecr)
      this._ecrService.getSaveEcrForm(ecrdata).subscribe(
        (response)=>{
          const result = response;
          if (result.code) {
            this.toasterService.success('Saved', 'Success');
          }
          else {
            this.toasterService.error("Failed to save", "Error");
          }
        },
        (error) => {
          console.log('getSaveEcrForm()', error)
        }
      )
      
      this.getInbox();
      
    }

    getSubmit()
    {
      this.getSectionList()
      this.ecr.ECRRelease="release"
      this.getEcrFormData();
      let ecrdata = {
        "Id" : this.ecr.Id,
        "ECRNumber":this.ecr.ECRNumber,
        "Description":this.ecr.Description,
        "EffectiveDate":this.ecr.EffectiveDate,
        "SerialNumber":this.ecr.SerialNumber,
        "PartNumber":this.ecr.PartNumber,
        "RevisionNumber":this.ecr.RevisionNumber,
        "RequestedBy":this.ecr.RequestedBy,
        "CatJobNumber":this.ecr.CatJobNumber,
        "ECRType":this.ecr.ECRType,
        "Files":this.ecr.Files,
        "UserName":this.ecr.UserName,
        "CurrentTimeStamp":this.ecr.CurrentTimeStamp,
        "ECRRelease":this.ecr.ECRRelease

      }
      
      this.uploadFiles();
      this._ecrService.getSaveEcrForm(ecrdata).subscribe(
        (response)=>{
          const result = response;
          if (result.code) {
            this.toasterService.success('Submit', 'Success');
          }
          else {
            this.toasterService.error("Failed to submit", "Error");
          }
        },
        (error) => {
          console.log('getSubmit()', error)
        }
      )
    }

  uploadFiles()
  {
   // console.log(this.browseFiles);
   if(this.browseFiles.length==0)
      return;
    for (let i = 0; i < this.browseFiles.length; i++) {
      const uploadData = new FormData();
      uploadData.append('File', this.browseFiles[i]);
       this._ecrService.UploadFile(uploadData).subscribe((data) => data);
    }
  }

  process:any=[]
  getProcesslist()
  {
    this._ecrService.getProcesslist().subscribe(
      (response)=>
      {
        const result =response;
        if(result.code)
        {
          
        }
      }
    ),
    (error) => {
      console.log('getProcesslist()', error)
    }
   localStorage.setItem("process",JSON.stringify(this.ProcessLists))
  }
  private Process: ''
  groupList:any=[]
  @ViewChild('myDiv') myDiv: ElementRef<HTMLElement>;

  triggerFalseClick() {
      let el: HTMLElement = this.myDiv.nativeElement;
      el.click();
  }
  
  getProcessGroup()
  {
    this.groupList=[]
    this._ecrService.getGroups().subscribe(
      (response)=>
      {
        const result = response;
        if(result.code)
        {
          this.process = result.data 
          
        }
        else
        {
          this.groupList=[]
        }
      }
    );
    (error)=>
    {
      console.log("getGroups",error);
    }
  }
  processListRout()
  {
    this.ecrrouting.EcrNumber = this.form.value.ECRNumber;
    this.ecrrouting.ProcessNames = this.routingGroupPr;
    console.log(this.ecrrouting)
    this._ecrService.ProcessList(this.ecrrouting).subscribe(
      (response)=>
      {
        const result = response;
        if(result.code)
        {
          this.toasterService.success("Routed Successful", "Success");
          
        }else {
          this.toasterService.error("Routed Failed", "Error");

        }
      },
      (error) => {
        console.log('processListRout()', error)
      }
    )
  }
  
  selected_chart(input: HTMLInputElement,Process:string) {
    let existproc =  this.routingGroupPr.filter(x => x.Process == Process)[0];
    if(existproc!=undefined)
    {
      if(input.checked == false)
      {
        for (let item of this.routingGroupPr) {
            const index = this.routingGroupPr.indexOf(item, 0);
            if (index > -1) {
              this.routingGroupPr.splice(index, 1);
           }
        }
      }
    }
    else
    {
      if(input.checked == true)
      {
        let prGr = {} as ProcessGroup
        prGr.Process = Process
        prGr.Groups =[];
        this.routingGroupPr.push(prGr);
      }
    }
  }
    
  
  
  selected_Group(input: HTMLInputElement,Process:string,i,groupName:string ) {
    let existproc =  this.routingGroupPr.filter(x => x.Process == Process)[0];
    
    if(existproc!=undefined)
    {
      if(input.checked == true)
      {
        for (let item of this.routingGroupPr) {
          if(item.Process == Process)
          {
            item.Groups.push(groupName);
          }
        }
      }
      else
      {
        for (let item of this.routingGroupPr) {
          if(item.Process == Process)
          {
            const index = item.Groups.indexOf(groupName, 0);
            if (index > -1) {
              item.Groups.splice(index, 1);
           }
          }
        }
      }
    }
    else
    {
      if(input.checked === true)
      {
        let prGr = {} as ProcessGroup
        prGr.Process = Process
        prGr.Groups =[];
        prGr.Groups.push(groupName)   
        this.routingGroupPr.push(prGr);
        let ch = document.getElementById(i) as HTMLInputElement
        ch.checked= true;
      }
      else
      {
        let ch = document.getElementById(i) as HTMLInputElement
        ch.checked= false;
      }
    }
    
    console.log(this.routingGroupPr);
  }
}
export interface ProcessGroup{
  "Process":string,
  "Groups":any[]
}

