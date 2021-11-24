import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";



@Component({
    selector: 'ImageModal',
    template:
        `
        <div mat-dialog-content>
         <div fxLayout="row wrap">
           <div fxFlex.gt-md="50" fxFlex.gt-sm="50" fxFlex.gt-xs="50" fxFlex="50">
           <div *ngFor="let image of imageList;let i = index">
            <p style="color: red;font-size:30px;">{{i+1}} Of {{imageList.length}}</p>
            <img [src]="image"/>
           </div>
           </div>
         </div>
        </div>  
    `
})
export class ImageComponent {
    imageList:any =[];
    constructor(public dialogRef: MatDialogRef<ImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.imageList = data;
    }
}