import { Component, OnInit } from '@angular/core';
import { FiletransferService } from '../../../providers/filetransfer.service';
import {  MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-filetransfer',
  templateUrl: './filetransfer.component.html',
  styleUrls: ['./filetransfer.component.css']
})
export class FiletransferComponent implements OnInit {
  files:[];  
  dataSource= new MatTableDataSource(this.files);
  browseFiles = [];
  selectedFiles :string[]=[];
  constructor(private _fileservice:FiletransferService) {
    this.getFiles();
    console.log(this.dataSource.data)
   }

  ngOnInit() {
  }

  getFiles()
  {
    this._fileservice.getFiles().subscribe(
      (response)=>{
        const result = response;
        if (result.code) {
          this.files = result.data;
        }
        else {
          this.files = [];
        }
      },
      (error) => {
        console.log('getFiles()', error)
      }
    )
  }

  handleSelectionChange(value:boolean,element:string) {
    let  index:number =this.selectedFiles.indexOf(element);
    if(value==true)
    {
      console.log(index)
      if(index<=-1)
        this.selectedFiles.push(element);
    }else
    {
      if(index>-1)
        this.selectedFiles.splice(index,1);
    }
   console.log(this.selectedFiles);
  }

  downloadFiles()
  {
    this.selectedFiles.forEach(element => {
      this._fileservice.downloadSelectedFile(element).subscribe((data) => {
        let blob = new Blob();

         blob = new Blob([data]);
      
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = element;
        link.click();
      
      });
    })
  }
  deleteFiles()
  {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this._fileservice.DeleteFile(this.selectedFiles[i]).subscribe((data) => {
        console.log(data)
      },error=>console.log(error));
    }
    
    this.getFiles();
  }
  onFileChanged(event) {
    this.browseFiles = [];
    this.browseFiles = event.target.files;
    
  }

  uploadFiles()
  {
    console.log(this.browseFiles);
    for (let i = 0; i < this.browseFiles.length; i++) {
      const uploadData = new FormData();
      uploadData.append('File', this.browseFiles[i]);
      this._fileservice.UploadFile(uploadData).subscribe((data) => data);
    }
    this.getFiles();
  }


}
