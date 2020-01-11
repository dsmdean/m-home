import { Routes } from '@angular/router';

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

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'budget/add', component: BudgetAddComponent },
  { path: 'budget/:budgetId/:month/:year', component: BudgetDetailsComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'maps', component: MapsComponent }
];
