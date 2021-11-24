import { Component, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EcrcreationService } from "../../../../providers/ecrcreation.service";
import { DataService } from "../../../../providers/share-data.service";

@Component({
    selector: 'UserTextModal',
    template:
    `<h1 mat-dialog-title class="text-center" style="font-size:2rem;font-weight: bold;margin:0">Comments</h1>
    
    <div mat-dialog-content style="padding:1rem,0,0,1rem;margin:0">
    <mat-form-field appearance="fill" style="padding:0,0,0,1rem;margin:0">
    <mat-label style="padding:0;margin:0">Reject To</mat-label>
    <mat-select [(ngModel)]="reject">
      <mat-option *ngFor="let rejecte of rejected" [value]="rejecte">{{rejecte}}</mat-option>
    </mat-select>
  </mat-form-field>

    <mat-form-field style="padding:0,0,0,1rem;margin:0">
      <input matInput style="font-size:1rem; "placeholder="User Comments" 
      [(ngModel)]="userText" 
       name="userText">
    </mat-form-field>
    </div>
    
    <div mat-dialog-actions style="padding:0,0,0,1rem">
        <button mat-button class = "btn-lg" color="primary" 
        (click)="closeDialog()" cdkFocusInitial>Add</button>
        <button mat-button style="background-color:#DCDCDC;"  class = "btn-lg"
        [mat-dialog-close]="">Cancel</button>
   </div>       
`
})
export class QualityuserComponent {
  selectedItems = [];
  rejected=[]//'originator',
  reject=''
  userText:any = ''
    
    itmeList:any = [];
    constructor(public dialogRef: MatDialogRef<QualityuserComponent>,
      private _ecrService:EcrcreationService,
      private _shared:DataService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this._shared.currentProcess.subscribe(update=>{
        console.log(update)
        this.rejected = update
        if(!this.rejected.includes('originator'))
        {

          this.rejected.push('originator')
        }
      });
      
     // this.getProcesslist();
     // this.rejected = JSON.parse(localStorage.getItem("process"))
    }
    closeDialog() {
      localStorage.setItem("reject",this.reject)
      this.dialogRef.close({ event: 'close', data: this.userText});
    }

    
    process:any=''
    getProcesslist()
    {
      this._ecrService.getProcesslist().subscribe(
        (response)=>
        {
          const result =response;
          if(result.code)
          {
            this.process = localStorage.getItem("processLists")
            console.log(this.process)
            
              this.rejected.push(this.process)
           
          }
        }
      ),
      (error) => {
        console.log('getProcesslist()', error)
      }

    }

    
  
}