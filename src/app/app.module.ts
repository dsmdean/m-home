import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Title }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { EnvService } from './services/env';
import { AuthenticationService } from './services/authentication';
import { UserService } from './services/user';
import { BudgetService } from './services/budget';
import { ReversePipe } from './pipes/reverse.pipe';
// import { FilterPipe } from './pipes/filter.pipe';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule.forRoot(),
    RouterModule,
    AppRoutingModule,
    StorageServiceModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ReversePipe
  ],
  providers: [
    EnvService,
    AuthenticationService,
    UserService,
    BudgetService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
