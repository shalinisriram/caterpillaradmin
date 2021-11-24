import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-ecrrouting',
  templateUrl: './ecrrouting.component.html',
  styleUrls: ['./ecrrouting.component.css']
})
export class EcrroutingComponent implements OnInit {
  count=0;
  department:string;
  operation:string;
  departmentSelect:string;
  Departmentlist=[]
  OpertionList=[]
 
  constructor() { 
    // this.elements = new Array();
    // this.elem = new Array();
  }
  
  Database: any = [
    'Steak',
    'Pizza',
    'Tacos',
  ];

  getDepartmentList(){
    if(!this.Departmentlist.includes(this.department))
    {
      
      this.Departmentlist.push(this.department)
    }
  }

  getOperationList(){
    if(!this.OpertionList.includes(this.operation))
    {
      this.OpertionList.push(this.operation)
    }
  }


  deleteDepartment() {
    this.Departmentlist.pop() 
  }

  deleteOperation() {
    this.OpertionList.pop() 
  }
  ngOnInit() {
  }

}

