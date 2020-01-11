import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env';
import { AuthenticationService } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class CashflowService {
  env: { url };

  constructor(public http: Http, private EnvService: EnvService, public auth: AuthenticationService) {
    this.env = EnvService.getEnv();
  }

  postFlow(flowData) {
    return this.http.post(this.env.url + '/cashflows', flowData, this.auth.getHeaders())
      .map(res => res.json());
  }

  updateFlow(flowData) {
    return this.http.put(this.env.url + '/cashflows/' + flowData.id, flowData, this.auth.getHeaders())
      .map(res => res.json());
  }

  getFlowById(flowId) {
    return this.http.get(this.env.url + '/cashflows/' + flowId, this.auth.getHeaders())
      .map(res => res.json());
  }

  deleteFlow(flowId) {
    return this.http.delete(this.env.url + '/cashflows/' + flowId, this.auth.getHeaders())
      .map(res => res.json());
  }

  getAllCashFlow() {
    return this.http.get(this.env.url + '/cashflows', this.auth.getHeaders())
      .map(res => res.json());
  }

  getFlowByBudgetId(budgetId, month, year) {
    return this.http.get(this.env.url + '/cashflows/budget/' + budgetId + '/' + month + '/' + year, this.auth.getHeaders())
      .map(res => res.json());
  }

  getAllCashFlowExpenses() {
    return this.http.get(this.env.url + '/cashflows/expenses', this.auth.getHeaders())
      .map(res => res.json());
  }

  getAllCashFlowIncome() {
    return this.http.get(this.env.url + '/cashflows/income', this.auth.getHeaders())
      .map(res => res.json());
  }

  getCashFlowExpenses(month, year) {
    return this.http.get(this.env.url + '/cashflows/expenses/' + month + '/' + year, this.auth.getHeaders())
      .map(res => res.json());
  }

  getCashFlowIncome(month, year) {
    return this.http.get(this.env.url + '/cashflows/income/' + month + '/' + year, this.auth.getHeaders())
      .map(res => res.json());
  }
}
