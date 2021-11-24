import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { UnitService } from "../../../providers/unit.service";
import Swal from 'sweetalert2';
import { SelectionModel } from "@angular/cdk/collections";
import { ToastrService } from "ngx-toastr";
import { ArchiveService } from "../../../providers/archive.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.css']
})
export class UnitComponent {
    public form: FormGroup;
    unitLists: any = []
    currentUser: any;
    isAdmin: any;
    isAdd = false
    isTable = true;
    isEdit = false;
    displayedColumns = ['LineLoadNumber', 'SerialNumber', 'SectionName', 'ModelName', 'AreaName', 'ComponentName', 'Actions', 'Select'];
    displayedColumns2 = [ 'SerialNumber', 'SectionName', 'ModelName', 'AreaName','StationName', 'ComponentName','CreateTime'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('sortCol2',{ read: MatSort }) sortCol2: MatSort;
    operatorList: any;
    selection = new SelectionModel<any>(true, []);
    selectedItemIds: any[];
    sectionsList: any = [];
    modelList: any = [];
    componentList: any = [];
    areaList: any = [];
    unit: any = {}
    constructor(private _unitService: UnitService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private spinnerService: Ng4LoadingSpinnerService,
        private _archiveService: ArchiveService) {
        this.currentUser = localStorage.getItem('currentUser');
        this.isAdmin = localStorage.getItem('RoleType');
        this.getUnits();
    }
    units: any = {
        "Id":0,
        "SectionName": "",
        "ModeName": "",
        "ComponentName": "",
        "StationName":'',
        "AreaName": [],
        "SerialNumber": "",
        "CreatedTimeStamp" : ""
    }
    sectionsListUnit:any
    Cancel()
    {
        this.units.SectionName=''
        this.units.ModeName=''
        this.units.ComponentName=''
        this.units.StationName=''
        this.units.AreaName=''
        this.units.SerialNumber=''
        this.units.CreatedTimeStamp=''
    }
    getSectionsList() {
        this._unitService.getSections(this.currentUser).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.sectionsListUnit = result.data;
                } else {
                    this.sectionsListUnit = []
                }
            },
            (error) => {
                console.log(error, 'getSections()');
            }
        );
    }
    modelListUnit:any
    getModelsLIst() {
        this._unitService.GetAllModel(this.units.SectionName, this.currentUser).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.modelListUnit = result['data']
                    console.log("ModelList",this.modelListUnit)
                } else {
                    this.modelListUnit = []

                }
            },
            (error) => {
                console.log(error, 'getModels()');
            }
        );
    }
    areaListUnit:any
    getAreasList() {

        this._unitService.getAreaWithSection(this.units.SectionName).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.areaListUnit = result['data']
                    
                    this.getStationsUnit()
                } else {
                    this.areaListUnit = []
                }
            },
            (error) => {
                console.log(error, 'getAreas()');
            }
        );
    }
    StationListUnit:any
    getStationsUnit()
    {
        let obj =
            this.units.AreaName;
            this._unitService.getStation(obj).subscribe(
                (response) => {
                    const result = response;
                    if (result.code) {
                        this.StationListUnit = result['data']
                    } else {
                        this.StationListUnit = []
    
                    }
                },
                (error) => {
                    console.log(error, 'getStations()');
                }
            );
    }

    form1= false;
    form2 = false
    componentListUnit:any
    getComponentsUnit() {
        this.form1 = false
        this.form2 = false
        if(this.units.AreaName.includes("T"))
        {
            console.log(this.form2)
            this.form1 = true
        }
        if(!this.units.AreaName.includes("T"))
        {
            console.log( this.form1)
            this.form2 = true
        }
        let obj ={
            'Model':this.units.ModeName,
            'Area':this.units.AreaName,
            'UserName':this.currentUser
        }
        this._unitService.GetAllComponents(this.units.ModeName,this.currentUser).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.componentListUnit = result['data']
                    if(this.componentListUnit.CATModelIdJson==this.units.ModeName )
                        {

                            this.units.ComponentName = this.componentListUnit.ComponentName;
                            var areas= this.componentListUnit.AreaIdJson.split(',');
                            this.units.AreaName=areas;
                        }
                } else {
                    this.componentListUnit = []

                }
            },
            (error) => {
                console.log(error, 'getComponents()');
            }
        );
    }

    LineLoad :any =[]
    getSerialNumber()
    {
        let obj = {
            "SectionName": this.units.SectionName,
            "AreaName":this.units.AreaName,
            "ModelName":this.units.ModelName,
            "ComponentName":this.units.ComponentName
        }
        this._unitService.getLineLoad(obj).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.LineLoad = result.data;
                } else {
                    this.LineLoad = [];
                }
            },
            (error) => {
                console.log(error, 'getLoadNumbers()');
            }
        );
    }

   change()
   {
    this.getComponentsUnit();
    this.modelListUnit.forEach(element => {
        if(element.ModelName == this.units.ModeName)
        {
            this.units.SerialNumber = element.SerialPrefix;
        }
    });
    console.log(this.componentListUnit);
    

  
   }
   dataSource2:any
   SchedulingUnits:any
   getSchedulingUnits()
   {
       this._unitService.GetSchedulingUnits("").subscribe(
           (response)=>{
               const res = response
               if(res.code)
               {
                   this.SchedulingUnits = res.data;
                   this.dataSource2 = new MatTableDataSource(this.SchedulingUnits);
                   this.dataSource2.sort = this.sortCol2;
                   console.log(this.dataSource2)
                   this.dataSource2.paginator = this.paginator;

               }
               else{
                   this.SchedulingUnits =[]
                   this.dataSource2 = new MatTableDataSource(this.SchedulingUnits);
                   this.dataSource2.sort = this.sortCol2;
                   this.dataSource2.paginator = this.paginator;
               }
           }
       )
   }
   
    addUnit()
    {
       
        this._unitService.AddSchedulingUnit(this.units).subscribe(
            (response)=>
            {
                const res = response;
                if(res.code)
                {
                    this.toastr.success(res.message, 'Success');
                    this.isTable = true;
                    this.isAdd = false;
                    
                }
                else
                {
                    this.toastr.error(res.message, 'Error');

                }
            }
        )
    }

    getUnits() {
        this.spinnerService.show()
        this._unitService.getUnits(this.currentUser).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.unitLists = result.data;
                    this.dataSource = new MatTableDataSource<Element>(this.unitLists);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.spinnerService.hide()
                }
                else {
                    this.unitLists = []
                    this.spinnerService.hide()
                }

            },
            (error) => {
                console.log(error, 'getUnits()');
                this.spinnerService.hide()
            }
        );
        
    }

    showUpdateForm(element) {
        this.unit = { ...element }
     
        this.getSections();
        this.getModels();
        this.getComponents();
        this.getAreas();
        this.getStations();
        this.isTable = false;
        this.isEdit = true;
    }

    getSections() {
        this._unitService.getSections(this.currentUser).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.sectionsList = result.data;
                } else {
                    this.sectionsList = []
                }
            },
            (error) => {
                console.log(error, 'getSections()');
            }
        );
    }
    StationList:any = []
    getStations()
    {
       
        let obj =this.unit.AreaName;
            this._unitService.getStation(obj).subscribe(
                (response) => {
                    const result = response;
                    if (result.code) {
                        this.StationList = result['data']
                    } else {
                        this.StationList = []
    
                    }
                },
                (error) => {
                    console.log(error, 'getStations()');
                }
            );
    }

    getModels() {
        this._unitService.getModels(this.unit.SectionName, this.currentUser).subscribe(
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

    getComponents() {
        let obj = {
            'Model': this.unit.ModelName,
            'Area': this.unit.AreaName,
            'UserName': this.currentUser
        }
        this._unitService.getComponents(obj).subscribe(
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

    getAreas() {
        this._unitService.getAreas(this.currentUser).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.areaList = result['data']
                    this.getStations()
                } else {
                    this.areaList = []

                }
            },
            (error) => {
                console.log(error, 'getAreas()');
            }
        );
    }

    updateUnit() {
        this._unitService.updateUnit(this.unit).subscribe(
            (response) => {
                const result = response;
                if (result.code) {
                    this.toastr.success(result.message, 'Success');
                    this.getUnits();
                    this.isEdit = false;
                    this.isTable = true
                } else {
                    this.toastr.error(result.message, 'Error');
                    this.getUnits();
                    this.isEdit = false;
                    this.isTable = true
                }
            },
            (error) => {
                console.log(error, 'getAreas()');
            }
        );
    }

    archiveUnitData(element) {

        Swal.fire({
            title: 'Info',
            text: 'Do you want Move this Units to Archive ?',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.value) {
                this._archiveService.archiveUnitData(element).subscribe(
                    (response) => {
                        const result = response;
                        if (result.code) {
                            this.toastr.success(result.message, 'Success');
                            this.getUnits();
                        } else {
                            this.toastr.error(result.message, 'Error');
                            this.getUnits();
                        }
                    },
                    (error) => {
                        console.log(error, 'archiveUnitData()');
                    }
                );
            }
        });   
    }

    deleteUnits() {
        this.selectedItemIds = []
        this.selection.selected.forEach(ele => {
            this.selectedItemIds.push(ele.Id)
        });
        Swal.fire({
            title: 'Info',
            text: 'Do you want to delete the selected Units?',
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
                this._unitService.deleteUnits(obj).subscribe(
                    (response) => {
                        const result = response;
                        if (result.code) {
                            Swal.fire(
                                'Deleted!',
                                'Units have been deleted!',
                                'success'
                            );
                            this.selection = new SelectionModel<any>(true, []);
                            this.getUnits();
                        } else {
                            this.toastr.error(result.message, 'Error')
                            this.getUnits();
                        }
                    },
                    (error) => {
                        console.log('deleteUsers()', error)
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
    ngOnInit() {
        this.form = this.fb.group({
            StationName: [null, Validators.compose([Validators.required])],
            SectionName: [null, Validators.compose([Validators.required])],
            ModeName: [null, Validators.compose([Validators.required])],
            ComponentName: [null, Validators.compose([Validators.required])],
            AreaName: [null, Validators.compose([Validators.required])],
            SerialNumber: [null, Validators.compose([Validators.required])],
            CreatedTimeStamp: [null, Validators.compose([Validators.required])]
        });
    }

}