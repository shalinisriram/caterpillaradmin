import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { LoginComponent } from './views/login/login.component';
import { AuthService } from '../providers/auth.service';
import { AuthGuard } from '../shared/auth.guard';
import { PlantService } from '../providers/plant.service';
import { CatmodelComponent } from './views/catmodel/catmodel.component';
import { CatserialComponent } from './views/catserial/catserial.component';
import { CatmodelService } from '../providers/catmodel.service';
import { CatserialService } from '../providers/catserial.service';
import { WorkstationsService } from '../providers/workstations.service';
import { WorkstationComponent } from './views/workstation/workstation.component';
import { WorkinstructionsComponent } from './views/workinstructions/workinstructions.component';
import { WorkinstructionService } from '../providers/workinstruction.service';
import { AnnotationsComponent } from './views/annotations/annotations.component';
import { AnnotationService } from '../providers/annotation.service';
import { BOMsComponent } from './views/boms/boms.component';
import { BOMsService } from '../providers/boms.service';
import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from './views/user/user.component';
import { UserService } from '../providers/user.service';
import { TraceabilityComponent } from './views/traceability/traceability.component';
import { TraceabilityService } from '../providers/traceability.service';
import { ProcedureComponent } from './views/procedure/procedure.component';
import { ProcedureService } from '../providers/procedure.service';
import { BreakService } from '../providers/break.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SettingsComponent } from './views/settings/settings.component';
import { SettingsService } from '../providers/settings.service';
import { ComponentComponent } from './views/component/component.component';
import { ComponentService } from '../providers/component.service';
import { AreaComponent } from './views/area/area.component';
import { AreaService } from '../providers/area.service';
import { UnitService } from '../providers/unit.service';
import { UnitComponent } from './views/unit/unit.component';
import { SectionService } from '../providers/section.service';
import { PlantComponent } from './views/plant/plant.component';
import { ArchiveComponent } from './views/archive/archive.component';
import { ArchiveService } from '../providers/archive.service';
import { ArchiveDetailsComponent } from './views/archive-details/archive-details.component';
import { DataService } from '../providers/share-data.service';
import { BreakComponent } from './views/break/break.component';
import { SectionComponent } from './views/section/section.component';
import { ExcelService } from '../providers/excel.service';
import { ChangepasswordComponent } from './views/changepassword/changepassword.component';
import { ImageComponent } from './views/traceability/image.component';
import { TokenInterceptorService } from '../providers/token-interceptor.service';
import { FiletransferComponent } from './views/filetransfer/filetransfer.component';
import { FiletransferService } from '../providers/filetransfer.service';
import {EcrsidebarComponent} from './layouts/full/ecrsidebar/ecrsidebar.component';
import { EcrcreationComponent} from './ecm/ecrcreation/ecrcreation.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { InboxComponent } from './ecm/inbox/inbox.component';
import { EcrroutingComponent } from './ecm/ecrrouting/ecrrouting.component';
import { EcrcreationService } from '../providers/ecrcreation.service';
import { RoutingecnsComponent} from './ecm/inbox/routed/routingecns.component';
import { EcmprocessComponent } from './adminecm/ecmprocess/ecmprocess.component';
import { EcmdepartmentComponent } from './adminecm/ecmdepartment/ecmdepartment.component';
import { EcmchecklistComponent } from './adminecm/ecmchecklist/ecmchecklist.component';
import { QualityworkinstructionsComponent } from './views/qualityworkinstructions/qualityworkinstructions.component';
import { QualityuserComponent } from './ecm/inbox/routed/user.component';
import { DefectsComponent } from './views/defects/defects.component';
import { GroupsComponent } from './views/groups/groups.component';
import { LoguserComponent } from './ecm/inbox/log.component';
import { AuditsequenceComponent } from './views/auditsequence/auditsequence.component';
import { SpicalinstructionsComponent } from './views/spicalinstructions/spicalinstructions.component';
import { StationComponent } from './views/station/station.component';
import { StationService } from '../providers/station.service';
import { CycleComponent } from './views/cycle/cycle.component';
import { AllService } from '../providers/all.service';
import { SchedulingunitComponent } from './views/schedulingunit/schedulingunit.component';
import { LoginpageComponent } from './views/loginpage/loginpage.component';
import { OAuthService } from '../providers/o-auth.service';




@NgModule({
  entryComponents: [
    ImageComponent,
    QualityuserComponent,
    LoguserComponent
  ],
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    LoginComponent,
    CatmodelComponent,
    CatserialComponent,
    WorkstationComponent,
    WorkinstructionsComponent,
    DefectsComponent,
    QualityworkinstructionsComponent,
    QualityuserComponent,
    LoguserComponent,
    AnnotationsComponent,
    BOMsComponent,
    UserComponent,
    TraceabilityComponent,
    ProcedureComponent,
    SettingsComponent,
    ComponentComponent,
    AreaComponent,
    UnitComponent,
    PlantComponent,
    ArchiveComponent,
    ArchiveDetailsComponent,
    BreakComponent,
    SectionComponent,
    ChangepasswordComponent,
    ImageComponent,
    FiletransferComponent,
    EcrsidebarComponent,
    EcrcreationComponent,
    InboxComponent,
    EcrroutingComponent,
    RoutingecnsComponent,
    EcmprocessComponent,
    EcmdepartmentComponent,
    EcmchecklistComponent,
    DefectsComponent,
    GroupsComponent,
    AuditsequenceComponent,
    SpicalinstructionsComponent,
    SchedulingunitComponent,
    StationComponent,

    CycleComponent,

    SchedulingunitComponent,

    LoginpageComponent

  ],
  exports: [ MatFormFieldModule, MatInputModule ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    ToastrModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    AmazingTimePickerModule,
    NgxChartsModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  providers: [
    AuthService,
    AllService,
    WorkinstructionService,
    CatmodelService,
    CatserialService,
    WorkstationsService,
    AuthGuard,
    PlantService,
    AnnotationService,
    BOMsService,
    UserService,
    TraceabilityService,
    ProcedureService,
    BreakService,
    SettingsService,
    ComponentService,
    AreaService,
    SectionService,
    UnitService,
    OAuthService,
    ArchiveService,
    EcrcreationService,
    DataService,
    FiletransferService,
    ExcelService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    StationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
