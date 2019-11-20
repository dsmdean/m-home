import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { BudgetService } from '../../services/budget';
import { CashflowService } from '../../services/cashflow';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [FilterPipe]
})
export class BudgetComponent implements OnInit {
  budgets: [{ id, name: String, planned, access: [{ user: String, created: Boolean }], actual, percentage }];
  error: { show: Boolean, type: String, message: String, data };
  totalExpenses: Number;
  hoveredDate: NgbDate;
  month: number;
  months: any[];
  searchText: any;

  constructor(private EnvService: EnvService, calendar: NgbCalendar, public auth: AuthenticationService, public budgetService: BudgetService, private router: Router, public flowService: CashflowService) {
    this.EnvService.setTitle("Budget");
    this.budgets = [{ id: 0, name: '', planned: 0, access: [{ user: '', created: false }], actual: 0, percentage: 0 }];
    this.error = { show: false, type: '', message: '', data: null };
    this.totalExpenses = 0;
    this.month = this.EnvService.getMonth();
    this.months = this.EnvService.getEnv().months;
    this.searchText;
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.getAllBudgets();
    }
  }

  getAllBudgets() {
    this.budgetService.getAllBudgets()
      .subscribe(data => {
        this.budgets = data.budgets;
        this.getCashFlow();
      }, this.asyncError);
  }

  getCashFlow() {
    this.setBudgetActuals(0);
    this.flowService.getCashFlowExpenses(this.month)
      .subscribe(data => {
        var expenses = data.cashflows;
        this.calculatePercentages(expenses);
      }, this.asyncError);
  }

  setBudgetActuals(value) {
    this.budgets.forEach(budget => {
      budget.actual = value;
    });
  }

  calculatePercentages(expenses) {
    this.totalExpenses = 0;

    expenses.forEach(expense => {
      this.totalExpenses += expense.amount;

      this.budgets.forEach(budget => {
        if (expense.budget.id == budget.id) {
          budget.actual += expense.amount;
        }
      });
    });
  }

  asyncError(error) {
    this.error.show = true;
    this.error.type = "warning";
    this.error.message = error.status + ' ' + error.statusText;
  }

  onMonthchange() {
    this.getCashFlow();
  }
}
