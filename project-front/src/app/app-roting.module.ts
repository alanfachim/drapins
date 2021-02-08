import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmimComponent } from './admim/admim.component';
import { AdminComponent } from './admin/admin.component';
import { ClienteComponent } from './cliente/cliente.component';
import { LoginComponent } from './cliente/login/login.component';
import { RecipesComponent } from './recipes/recipes.component';

const appRoutes: Routes = [
    { path: 'index.html/admin', component: AdminComponent },
    { path: 'index.html/cliente', component: ClienteComponent },
    { path: 'index.html/login', component: LoginComponent },
    { path: '', component: RecipesComponent },

];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: false,
            }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }