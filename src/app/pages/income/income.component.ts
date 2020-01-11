import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { CashflowService } from '../../services/cashflow';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  providers: [FilterPipe]
})
export class IncomeComponent implements OnInit {
  error: { show: Boolean, type: String, message: String, data };
  user: { _id };
  totalIncome: number;
  income: [{ budget, createdBy, amount, status, percentage }];
  closeResult: string;
  newIncome: { createdBy, amount, status, percentage };
  lastAmount: number;
  month: number;
  months: any[];
  year: number;
  years: any[];
  startingYear: number;
  searchText: any;

  constructor(private EnvService: EnvService, public auth: AuthenticationService, private router: Router, public flowService: CashflowService, private modalService: NgbModal) {
    this.EnvService.setTitle("Income");
    this.user = this.auth.getUser();
    this.error = { show: false, type: '', message: '', data: null };
    this.totalIncome = 0;
    this.newIncome = { createdBy: this.user._id, amount: 0, status: true, percentage: 0 };
    this.lastAmount = 0;
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
      this.getIncome();
    }
  }

  open(content, income?) {
    this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (income !== undefined) {
      this.newIncome = income;
      this.lastAmount = this.newIncome.amount;
    } else {
      this.newIncome = { createdBy: this.user._id, amount: 0, status: true, percentage: 0 };
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

  handleIncome() {
    // @ts-ignore
    if (this.newIncome.id != undefined) {
      this.editIncome();
    } else {
      // @ts-ignore
      this.newIncome.date = new Date(this.newIncome.date);
      this.createIncome();
    }
  }

  createIncome() {
    this.flowService.postFlow(this.newIncome)
      .subscribe(data => {
        console.log(this.newIncome);
        this.caluculateIncomePercentage(data, false);
      }, this.asyncError);
  }

  editIncome() {
    this.flowService.updateFlow(this.newIncome)
      .subscribe(data => {
        this.caluculateIncomePercentage(data, true);
      }, this.asyncError);
  }

  caluculateIncomePercentage(data, edit) {
    this.newIncome = data.cashflows;
    console.log(data);

    if (edit) {
      this.totalIncome -= this.lastAmount;
    } else {
      this.newIncome.createdBy = this.user;
      // @ts-ignore
      this.income.unshift(this.newIncome);
    }

    this.totalIncome += this.newIncome.amount;
    this.newIncome = { createdBy: this.user._id, amount: 0, status: true, percentage: 0 };
  }

  getIncome() {
    this.flowService.getCashFlowIncome(this.month, this.year)
      .subscribe(data => {
        this.income = data.cashflows;
        this.calculatePercentages(this.income);
      }, this.asyncError);
  }

  calculatePercentages(income) {
    this.totalIncome = 0;

    income.forEach(singleIncome => {
      this.totalIncome += singleIncome.amount;
    });
  }

  asyncError(error) {
    this.error.show = true;
    this.error.type = "warning";
    this.error.message = error.status + ' ' + error.statusText;
  }

  onDateChange() {
    this.getIncome();
  }
}
