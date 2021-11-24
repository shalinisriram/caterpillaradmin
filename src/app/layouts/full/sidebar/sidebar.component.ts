import {
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class AppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  Permissions:any=[];
  isOperation:boolean=false;
  isEcm:boolean=false;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _router:Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.Permissions = localStorage.getItem('Permissions');

      if(this.Permissions.includes("Operations")|| this.Permissions.includes("AdminOperations"))
      {
        this.isOperation = true;
      }
      if(this.Permissions.includes("Ecm") ||this.Permissions.includes("AdminEcm"))
      {
        this.isEcm = true;
      }
     
  
  }
  workStations:any =[];
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  ngOnInit()
  {
  }
  workStationdetails(stationName){ 
    this._router.navigateByUrl('/workstation-details/'+stationName);
  }
}
