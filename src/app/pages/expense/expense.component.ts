import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { CashflowService } from '../../services/cashflow';
import { ReversePipe } from '../../pipes/reverse.pipe';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [ReversePipe, FilterPipe]
})
export class ExpenseComponent implements OnInit {
  error: { show: Boolean, type: String, message: String, data };
  totalExpenses: Number;
  expenses: [{ budget, createdBy, amount, percentage }];
  month: number;
  months: any[];

  constructor(private EnvService: EnvService, private reverse: ReversePipe, public auth: AuthenticationService, private router: Router, public flowService: CashflowService) {
    this.EnvService.setTitle("Expenses");
    this.error = { show: false, type: '', message: '', data: null };
    this.totalExpenses = 0;
    this.month = this.EnvService.getMonth();
    this.months = this.EnvService.getEnv().months;
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.getExpenses();
    }
  }

  getExpenses() {
    this.flowService.getCashFlowExpenses(this.month)
      .subscribe(data => {
        this.expenses = data.cashflows;
        this.expenses = this.reverse.transform(this.expenses);
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

  onMonthchange() {
    this.getExpenses();
  }
}
