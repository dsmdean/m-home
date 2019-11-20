import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: {_id, name, picture, email};
  error: { show: Boolean, type: String, message: String, data };

  constructor(private EnvService: EnvService, public auth: AuthenticationService, private router: Router, public userService: UserService) {
    this.EnvService.setTitle("Profile");
    this.error = { show: false, type: '', message: '', data: null };
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  updateUser() {
    this.userService.updateUser(this.user)
      .subscribe(data => {
        this.auth.updateUser(data.user);
        this.error.show = true;
        this.error.type = "success";
        this.error.message = data.message;
      }, error => {
        this.error.show = true;
        this.error.type = "warning";
        this.error.message = JSON.parse(error._body).err.message;
        console.log(JSON.parse(error._body));
      });
  }

}
