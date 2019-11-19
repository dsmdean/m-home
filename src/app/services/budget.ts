import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { EnvService } from './env';
import { AuthenticationService } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  env: { url };

  constructor(public http: Http, private EnvService: EnvService, public auth: AuthenticationService) {
    this.env = EnvService.getEnv();
  }

  postBudget(budgetData) {
    return this.http.post(this.env.url + '/budgets', budgetData, this.auth.getHeaders())
      .map(res => res.json());
  }

  updateBudget(budgetData) {
    return this.http.put(this.env.url + '/budgets/' + budgetData.id, budgetData, this.auth.getHeaders())
      .map(res => res.json());
  }

  getBudgetById(budgetId) {
    return this.http.get(this.env.url + '/budgets/' + budgetId, this.auth.getHeaders())
      .map(res => res.json());
  }

  deleteBudget(budgetId) {
    return this.http.delete(this.env.url + '/budgets/' + budgetId, this.auth.getHeaders())
      .map(res => res.json());
  }

  getAllBudgets() {
    return this.http.get(this.env.url + '/budgets', this.auth.getHeaders())
      .map(res => res.json());
  }
}
