import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { BudgetService } from '../../services/budget';

@Component({
  selector: 'app-budget-add',
  templateUrl: './budget-add.component.html',
  styleUrls: ['./budget-add.component.scss']
})
export class BudgetAddComponent implements OnInit {
  budget: { name, planned, description, access: [{ user: String, created: Boolean }], userId: String };
  error: { show: Boolean, type: String, message: String, data };
  user: { _id, name, picture };

  constructor(private EnvService: EnvService, public auth: AuthenticationService, public budgetService: BudgetService, private router: Router) {
    this.EnvService.setTitle("Add Budget");
    this.user = this.auth.getUser();
    this.budget = { name: '', planned: 0, description: '', access: [{ user: this.user._id, created: true }], userId: this.user._id };
    this.error = { show: false, type: '', message: '', data: null };
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  createBudget() {
    this.budgetService.postBudget(this.budget)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['/budget']);
      }, error => {
        this.error.show = true;
        this.error.type = "warning";
        this.error.message = JSON.parse(error._body).err.message;
        console.log(JSON.parse(error._body));
      });
  }

}
