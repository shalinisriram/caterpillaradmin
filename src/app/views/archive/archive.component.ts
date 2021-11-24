import { Component, OnInit, ViewChild } from '@angular/core';
import { UnitService } from '../../../providers/unit.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ArchiveService } from '../../../providers/archive.service';
import { DataService } from '../../../providers/share-data.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  currentUser: any;
  unitLists: any = [];

  displayedColumns = ['LineLoadNumber', 'SerialNumber', 'SectionName', 'ModelName', 'AreaName', 'ComponentName', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _archiveService: ArchiveService,
    private _dataService:DataService) {
    this.currentUser = localStorage.getItem('currentUser');
    this.getArchivedUnits();
  }
  ngOnInit() {
  }

  getArchivedUnits() {
    this._archiveService.getArchivedUnits().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.unitLists = result.data;
          this.dataSource = new MatTableDataSource<Element>(this.unitLists);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.unitLists = []
        }

      },
      (error) => {
        console.log(error, 'getUnits()');
      }
    );
  }

  archivedUnitDetails(element){
   this._dataService.changeMessage(element)
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
