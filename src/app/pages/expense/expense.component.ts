import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { CashflowService } from '../../services/cashflow';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [FilterPipe]
})
export class ExpenseComponent implements OnInit {
  error: { show: Boolean, type: String, message: String, data };
  totalExpenses: Number;
  expenses: [{ budget, createdBy, amount, percentage }];
  month: number;
  months: any[];
  year: number;
  years: any[];
  startingYear: number;
  searchText: any;

  constructor(private EnvService: EnvService, public auth: AuthenticationService, private router: Router, public flowService: CashflowService) {
    this.EnvService.setTitle("Expenses");
    this.error = { show: false, type: '', message: '', data: null };
    this.totalExpenses = 0;
    this.month = this.EnvService.getMonth();
    this.months = this.EnvService.getEnv().months;
    this.year = new Date().getFullYear();
    this.years = [];
    this.startingYear = this.EnvService.getEnv().startingYear;
    this.searchText;

    while (this.startingYear <= this.year) {
      this.years.push(this.startingYear++);
    }
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.getExpenses();
    }
  }

  getExpenses() {
    this.flowService.getCashFlowExpenses(this.month, this.year)
      .subscribe(data => {
        this.expenses = data.cashflows;
        this.calculatePercentages(this.expenses);
      }, this.asyncError);
  }

  calculatePercentages(expenses) {
    this.totalExpenses = 0;

    expenses.forEach(expense => {
      this.totalExpenses += expense.amount;
    });
  }

  asyncError(error) {
    this.error.show = true;
    this.error.type = "warning";
    this.error.message = error.status + ' ' + error.statusText;
  }

  onDateChange() {
    this.getExpenses();
  }
}
