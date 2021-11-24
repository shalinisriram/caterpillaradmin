import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../providers/user.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort, MatSelect, MatOption } from '@angular/material';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';
import { AreaService } from '../../../providers/area.service';
import { EcrcreationService } from '../../../providers/ecrcreation.service';
import { ProcedureService } from '../../../providers/procedure.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public form: FormGroup;
  isTable = true;
  isEdit = false;
  isAdd = false;
  userList: any = [];
  Process: any;
  // displayedColumns: string[] = ['UserName', 'Password', 'RoleType','Department', 'Section', 'Area','loginGroups','Process','Permission', 'IsActive','Select'];
  displayedColumns: string[] = ['UserName', 'Password', 'RoleType', 'Department', 'Section',
    'Area', 'Process', 'Permission', 'IsActive', 'Select'];
  userStatusList: any = ['Active', 'Inactive']
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  roleList = ['Admin', 'User']
  user: any = {
    'UserName': '',
    'Password': '',
    'DepartmentId':0,
    'Area': [],
    'Process': [],
    'Permission': [],
    'Section': [],
    'RoleType': 'Admin',
    'IsActive': 'true'
  }

  //DepartmentName : string;
  SelectedDepartmentName:any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  contentEditable: boolean;
  selectedItemIds: any[];
  sectionList: any = [];
  areaList: any = [];
  processList: any = [];
  departmentList: any = [];
  permissionlist: any = [];
  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _areaService: AreaService,
    private _ecmService: EcrcreationService,
    breakpointObserver: BreakpointObserver,
    private spinnerService: Ng4LoadingSpinnerService,
    private _procedureService:ProcedureService,
    private toastr: ToastrService
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['UserName', 'RoleType', 'Department', 'Section', 'Area', 'Process', 'Permission', 'IsActive', 'ResetPassword','Select'] :
        ['UserName','RoleType', 'Department', 'Section', 'Area', 'Process', 'Permission', 'IsActive', 'ResetPassword','Select'];
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      UserName: [null, Validators.compose([Validators.required])],
      Password: [null, Validators.compose([Validators.required])],
      RoleType: [null, Validators.compose([Validators.required])]
    });
    this.getUsers();
    this.getGroup();
    this.getSections();
    this.getAreas();
    this.getProcess();
    this.getPermission();
    this.getDepartments();
  }
  getUserFilter:any =
  {
    "Section":[],
    "Areas":[],
    "Department":[],
    "Process":[]
  }
  getPermission() {
    this._areaService.getPermission().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.permissionlist = result.data;
        }
      }

    )
  }

  getDepartments() {
    this._ecmService.getDepartment().subscribe(
      (response) => {
        const result = response;
        console.log('Department List Result', response);
        if (result.code) {
          // const dept: any = result.data;
          // dept.forEach(element => {
          //   this.departmentList.push(element.DepartmentName);
          // });
          this.departmentList = result.data;
         // this.getUserFilter.Department = this.departmentList[0].DepartmentName
          console.log('Department List', this.departmentList);
        }
      }

    )
  }
  getProcess() {
    this._ecmService.getProcesslist().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.Process = result.data;
          this.Process.forEach(element => {
            this.processList.push(element.ProcessName);
          });
         // this.getUserFilter.Process = this.processList[0]
        }

      }

    )
  }
  groupList: any = []
  getGroup() {
    this._userService.getgroups().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.groupList = result.data

        }
      }

    )
  }

  getUsers() {
    this.spinnerService.show()
    this._userService.getUsers(this.getUserFilter).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.userList = result.data;
          console.log('userList', this.userList);
          this.dataSource = new MatTableDataSource<any>(this.userList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide()
        } else {
          this.userList = [];
          this.spinnerService.hide()
        }
      },
      (error) => {
        console.log('getUsers()', error)
        this.spinnerService.hide()
      }
    );
  }

  getSections() {
    this._userService.getSections().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.sectionList = result.data;
        //  this.getUserFilter.Section= this.sectionList[0]
        } else {
          this.sectionList = []
        }
      },
      (error) => {
        console.log(error, 'getSections()');
      }
    );

  }

  getAreas() {
    let obj =
    {
      'areas':this.user.Section,
    }
    this._procedureService.getAreaListSection(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result.data;
         // this.getUserFilter.Areas=this.areaList[0].AreaName
        } else {
          this.areaList = [];
        }
      },
      (error) => {
        console.log(error, 'getAreas()');
      }
    );
  }

  getAreasFiltewr() {
    let obj =
    {
      'areas':this.getUserFilter.Section,
    }
    this._procedureService.getAreaListSection(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result.data;
         // this.getUserFilter.Areas=this.areaList[0].AreaName
        } else {
          this.areaList = [];
        }
      },
      (error) => {
        console.log(error, 'getAreas()');
      }
    );
  }

  addUser(f: NgForm) {
    console.log('Add User', this.user);
    console.log('Add User', this.SelectedDepartmentName);
    this.user.DepartmentId = 0
    this.departmentList.forEach(x=>{
      if(x.DepartmentName == this.SelectedDepartmentName)
      {
        console.log(this.SelectedDepartmentName);
        this.user.DepartmentId = x.Id
      }
    })

    this._userService.addUser(this.user).subscribe(
      (response) => {
        const result = response;
        console.log('Add User Result', this.user);
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getUsers();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getUsers();
          f.resetForm();
        }
      },
      (error) => {
        console.log('addUser()', error);
      }
    );
  }
  groupListEdit: any = []
  department:any=[]
  processEdit: any = []
  permisiionEdit: any = []




  SectionList:any =[]
  @ViewChild('select') select: MatSelect;

  allSelected=false;

  toggleAllSelection(select) {
    if (this.allSelected) {
      select.options.forEach((item: MatOption) => item.select());
    } else {
      select.options.forEach((item: MatOption) => item.deselect());
    }
    this.allSelected = false
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

  AreaList:any=[]

  getArealist()
  {
    this._procedureService.getAreaList().subscribe(
      (response)=>{
        const result = response
        if(result.code)
        {
          this.AreaList=result.data
        }
        else{
          this.AreaList=[]
        }
      }
    )
  }
  showUpdateForm(users) {
    console.log('Update Users', users);
   // console.log(users.Department.DepartmentName);
    this.user = { ...users };
    if(users.Department!=null)
    {
      this.SelectedDepartmentName =  users.Department.DepartmentName
      this.user.DepartmentId = users.Department.Id
    }

    //users.Department.forEach(element => {

    //});

    users.loginDepts.forEach(element => {
      this.processEdit.push(element.ProcessName)
    });
    users.loginPermission.forEach(element => {
      this.permisiionEdit.push(element.PermissionName)
    });
    // user.loginGroups.forEach(element => {
    //   this.groupListEdit.push(element.GroupName)
    // });

    this.user.Process = this.processEdit
    // this.user.Groups = this.groupListEdit

    this.user.Permission = this.permisiionEdit
   // this.user.DepartmentId = users.Department.Id
    this.isTable = false;
    this.isEdit = true;
    this.getSections();
    this.getAreas();
  }

  updateUser(f: NgForm) {
    this.user.Area = this.user.Area == "" ? [] : this.user.Area
    this.departmentList.forEach(x=>{
      if(x.DepartmentName == this.SelectedDepartmentName)
      {
        console.log(this.SelectedDepartmentName);
        this.user.DepartmentId = x.Id
      }
    })
   //this.user.DepartmentId = this.SelectedDepartmentName;
    console.log('ModifiedUser', this.user);
    this._userService.updateUser(this.user).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getUsers();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getUsers();
          f.resetForm();
        }
      },
      (error) => {
        console.log('updateUser()', error);
      }
    );
  }
  ResetPassword(element)
  {
    console.log(element)

    this._userService.ResetPassword(element.Id).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success('Password reset to temp', 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getUsers();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getUsers();
        }
      })
  }

  deleteUsers() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Users?',
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
        this._userService.deleteUsers(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Users have been deleted!',
                'success'
              );
              this.selection = new SelectionModel<any>(true, []);
              this.getUsers();
            } else {
              this.toastr.error(result.message, 'Error')
              this.getUsers();
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

}
