import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../../../providers/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  isTable = true;
  isEdit = false;
  isAdd = false;
  settinglist:  any;
  selectedOptions: any = {}
  setting:{
    Task:string,
    IsActive:boolean,
    
  }
  months:any = ["1 Month","2 Month","3 Month","4 Month"]
  
  sett:any=
  {
    "Task": "string",
    "IsActive": true,
    "Value": 0
  }

  constructor(private _settingservice:SettingsService) { }

  ngOnInit() {
    this.getsettings()
  }
  timer:any=[]
  demend:any=[]

  getsettings(){
    this._settingservice.getSettings().subscribe(
      (response)=>{
        const result = response;
        if (result.code) {
          
        this.settinglist = result.data;
          this.timer = this.settinglist[0]
          this.demend= this.settinglist[1]
          this.value = this.demend.Value
          console.log(this.timer)
          console.log(this.demend)
        }
        else {
          this.settinglist = [];
        }
      },
      (error) => {
        console.log('getsettings()', error)
      }
    )
  }
  value
  onChange(event:boolean,task:string)
  {
    var on = {
      Task:task,
      IsActive:event,
      Value:this.value
    }
    this._settingservice.updateSettings(on).subscribe(
      (response)=>
      {
        console.log(response);
        const result=response;
        if (result.code) {
         
        } else {

        }

      },
      (error)=>{
        console.log('addsettings()',error)
      }
    )
   

  }

  onChange1(task:string)
  {
    var on = {
      Task:task,
      IsActive:true,
      Value:this.value
    }
    this._settingservice.updateSettings(on).subscribe(
      (response)=>
      {
        console.log(response);
        const result=response;
        if (result.code) {
         
        } else {

        }

      },
      (error)=>{
        console.log('addsettings()',error)
      }
    )
   

  }
  
}
