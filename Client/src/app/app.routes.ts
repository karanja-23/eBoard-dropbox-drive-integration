import { Routes } from '@angular/router';
import { DocumentsComponent } from './Components/documents/documents.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { SettingsComponent } from './Components/settings/settings.component';
export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'documents',
        component: DocumentsComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    }

];
