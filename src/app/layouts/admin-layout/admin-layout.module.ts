import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { BudgetComponent } from '../../pages/budget/budget.component';
import { BudgetAddComponent } from '../../pages/budget-add/budget-add.component';
import { BudgetDetailsComponent } from '../../pages/budget-details/budget-details.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ExpenseComponent } from '../../pages/expense/expense.component';
import { IncomeComponent } from '../../pages/income/income.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from '../../pipes/filter.pipe';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    BudgetComponent,
    BudgetAddComponent,
    BudgetDetailsComponent,
    ExpenseComponent,
    IncomeComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    FilterPipe
  ]
})

export class AdminLayoutModule {}
