import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { BudgetService } from '../../services/budget';
import { CashflowService } from '../../services/cashflow';
import { ReversePipe } from '../../pipes/reverse.pipe';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss'],
  providers: [ReversePipe, FilterPipe]
})
export class BudgetDetailsComponent implements OnInit {
  budget: { id, name, description, planned, percentage };
  error: { show: Boolean, type: String, message: String, data };
  user: { _id };
  queryParams: { budgetId, month };
  closeResult: string;
  newExpense: { budget, createdBy, amount, percentage };
  expenses: [{ budget, createdBy, amount, percentage }];
  expenseLength: number;
  totalExpense: number;
  month: number;
  months: any[];
  searchText: any;

  constructor(private EnvService: EnvService, private reverse: ReversePipe, public auth: AuthenticationService, public budgetService: BudgetService, public flowService: CashflowService, private activeRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    this.EnvService.setTitle("Budget Details");
    this.user = this.auth.getUser();
    this.budget = { id: '', name: '', description: '', planned: 0, percentage: 0 };
    this.error = { show: false, type: '', message: '', data: null };
    // @ts-ignore
    this.queryParams = this.activeRoute.params._value;
    this.newExpense = { budget: this.queryParams.budgetId, createdBy: this.user._id, amount: 0, percentage: 0 };
    this.totalExpense = 0;
    this.month = this.queryParams.month;
    this.months = this.EnvService.getEnv().months;
    this.searchText;
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.getBudgetById();
      this.getFlowByBudgetId();
    }
  }

  open(content, expense?) {
    this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (expense !== undefined) {
      this.newExpense = expense;
    } else {
      this.newExpense = { budget: this.queryParams.budgetId, createdBy: this.user._id, amount: 0, percentage: 0 };
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateBudget() {
    this.budgetService.updateBudget(this.budget)
      .subscribe(data => {
        this.error.show = true;
        this.error.type = "success";
        this.error.message = "Succesfully updated the budget!"
        console.log(data);
      }, this.asyncError);
  }

  handleExpense() {
    // @ts-ignore
    if (this.newExpense.id != undefined) {
      this.editExpense();
    } else {
      this.createExpense();
    }
  }

  createExpense() {
    this.flowService.postFlow(this.newExpense)
      .subscribe(data => {
        this.caluculateExpensePercentage(data, false);
      }, this.asyncError);
  }

  editExpense() {
    this.flowService.updateFlow(this.newExpense)
      .subscribe(data => {
        this.caluculateExpensePercentage(data, true);
      }, this.asyncError);
  }

  caluculateExpensePercentage(data, edit) {
    if (edit) {
      this.budget.percentage -= parseFloat(this.newExpense.percentage.slice(0, this.newExpense.percentage.length - 1));
    } else {
      this.newExpense = data.cashflow;
      this.newExpense.createdBy = this.user;
      this.expenses.unshift(this.newExpense);
      this.expenseLength = this.expenses.length;
    }

    this.newExpense.percentage = ((this.newExpense.amount / this.budget.planned) * 100).toFixed(2);
    this.budget.percentage = parseFloat(this.budget.percentage) + parseFloat(this.newExpense.percentage);
    this.newExpense.percentage += '%';
    this.newExpense = { budget: this.budget.id, createdBy: this.user._id, amount: 0, percentage: 0 };
    // console.log(data.cashflow);
  }

  getBudgetById() {
    this.budgetService.getBudgetById(this.queryParams.budgetId)
      .subscribe(data => {
        this.budget = data.budget;
        // @ts-ignore
        this.EnvService.setTitle(this.budget.name + " Budget");
      }, this.asyncError);
  }

  getFlowByBudgetId() {
    this.flowService.getFlowByBudgetId(this.queryParams.budgetId, this.month)
      .subscribe(data => {
        this.expenses = data.cashflow;
        this.expenses = this.reverse.transform(this.expenses);
        this.caluculateBudgetPercentage();
      }, this.asyncError);
  }

  caluculateBudgetPercentage() {
    this.totalExpense = 0;

    this.expenses.forEach(expense => {
      this.totalExpense += expense.amount;
      // expense.percentage = ((expense.amount / this.budget.planned) * 100).toFixed(2) + '%';
    });

    // this.budget.percentage = ((this.totalExpense / this.budget.planned) * 100).toFixed(2);
    this.expenseLength = this.expenses.length;
  }

  asyncError(error) {
    this.error.show = true;
    this.error.type = "warning";
    // this.error.message = error.status + ' ' + error.statusText;
    this.error.message = JSON.parse(error._body).err.message;
    console.log(JSON.parse(error._body));
  }

  onMonthchange() {
    this.getFlowByBudgetId();
  }
}
