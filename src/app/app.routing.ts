import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from '../shared/auth.guard';
import { TraceabilityComponent } from './views/traceability/traceability.component';
import { ProcedureComponent } from './views/procedure/procedure.component';
import { UserComponent } from './views/user/user.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ComponentComponent } from './views/component/component.component';
import { CatmodelComponent } from './views/catmodel/catmodel.component';
import { AreaComponent } from './views/area/area.component';
import { UnitComponent } from './views/unit/unit.component';
import { ArchiveComponent } from './views/archive/archive.component';
import { BreakComponent } from './views/break/break.component';
import { SectionComponent } from './views/section/section.component';
import { PlantComponent } from './views/plant/plant.component';
import { ChangepasswordComponent } from './views/changepassword/changepassword.component';
import { FiletransferComponent } from './views/filetransfer/filetransfer.component';
import { EcrcreationComponent } from './ecm/ecrcreation/ecrcreation.component';
import { InboxComponent } from './ecm/inbox/inbox.component';

import { RoutingecnsComponent } from './ecm/inbox/routed/routingecns.component';
import { EcmchecklistComponent } from './adminecm/ecmchecklist/ecmchecklist.component';
import { EcmprocessComponent } from './adminecm/ecmprocess/ecmprocess.component';
import { EcmdepartmentComponent } from './adminecm/ecmdepartment/ecmdepartment.component';
import { QualityworkinstructionsComponent } from './views/qualityworkinstructions/qualityworkinstructions.component';
import { DefectsComponent } from './views/defects/defects.component';
import { GroupsComponent } from './views/groups/groups.component';
import { AuditsequenceComponent } from './views/auditsequence/auditsequence.component';
import { SpicalinstructionsComponent } from './views/spicalinstructions/spicalinstructions.component';
import { StationComponent } from './views/station/station.component';

import { CycleComponent } from './views/cycle/cycle.component';
import { SchedulingunitComponent } from './views/schedulingunit/schedulingunit.component';
import { LoginpageComponent } from './views/loginpage/loginpage.component';


export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/loginpage',
        pathMatch: 'full',
      },
      {
        path: 'traceability',
        component: TraceabilityComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'schduleunit',
        component: SchedulingunitComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'ecrcreation',
        component: EcrcreationComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'ecmchecklist',
        component: EcmchecklistComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'ecmprocess',
        component: EcmprocessComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'ecmdepartment',
        component: EcmdepartmentComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'inbox',
        component: InboxComponent,
        canActivate :[AuthGuard],

      },
      {
        path: 'auditsequence',
        component: AuditsequenceComponent,
        canActivate :[AuthGuard]
      },

      {
        path: 'routingecns',
        component: RoutingecnsComponent,
        canActivate :[AuthGuard],
      },
      {
        path: 'procedure',
        component: ProcedureComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'spicalinstructions',
        component: SpicalinstructionsComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'groups',
        component: GroupsComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'qualityworkinstruction',
        component: QualityworkinstructionsComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'defects',
        component: DefectsComponent,
        canActivate :[AuthGuard]
      },
      {
        path: 'break',
        component: BreakComponent,
        canActivate :[AuthGuard]
      },
      {
          path: 'user',
          component: UserComponent
        },
        {
          path: 'cycleTime',
          component: CycleComponent,
          canActivate :[AuthGuard]
        },
        {
          path: 'station',
          component: StationComponent
        },
        {
          path: 'settings',
          component: SettingsComponent,
          canActivate :[AuthGuard]
        },
        {
          path: 'component',
          component: ComponentComponent,
          canActivate :[AuthGuard]
        },
        {
            path: 'model',
            component: CatmodelComponent,
            canActivate :[AuthGuard]
          },
          {
            path: 'area',
            component: AreaComponent,
            canActivate :[AuthGuard]
          },

          {
            path: 'section',
            component: SectionComponent,
            canActivate :[AuthGuard]
          },
          {
            path: 'unit',
            component: UnitComponent,
            canActivate :[AuthGuard]
          },
          {
            path: 'archive',
            component: ArchiveComponent,
            canActivate :[AuthGuard]
          },
          {
            path: 'plant',
            component: PlantComponent,
            canActivate :[AuthGuard]
          },
          {
            path: 'changepassword',
            component: ChangepasswordComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'filetransfer',
            component: FiletransferComponent,
            canActivate: [AuthGuard]
          }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'loginpage',
    component: LoginpageComponent
  },
  {
    path: '**',
    redirectTo: 'loginpage',
    pathMatch: 'full'
  }
];
