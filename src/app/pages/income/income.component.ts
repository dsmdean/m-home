import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { CashflowService } from '../../services/cashflow';
import { ReversePipe } from '../../pipes/reverse.pipe';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  providers: [ReversePipe, FilterPipe]
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
  searchText: any;

  constructor(private EnvService: EnvService, private reverse: ReversePipe, public auth: AuthenticationService, private router: Router, public flowService: CashflowService, private modalService: NgbModal) {
    this.EnvService.setTitle("Income");
    this.user = this.auth.getUser();
    this.error = { show: false, type: '', message: '', data: null };
    this.totalIncome = 0;
    this.newIncome = { createdBy: this.user._id, amount: 0, status: true, percentage: 0 };
    this.lastAmount = 0;
    this.month = this.EnvService.getMonth();
    this.months = this.EnvService.getEnv().months;
    this.searchText;
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
      this.createIncome();
    }
  }

  createIncome() {
    this.flowService.postFlow(this.newIncome)
      .subscribe(data => {
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
    this.flowService.getCashFlowIncome(this.month)
      .subscribe(data => {
        this.income = data.cashflows;
        this.income = this.reverse.transform(this.income);
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

  onMonthchange() {
    this.getIncome();
  }
}
