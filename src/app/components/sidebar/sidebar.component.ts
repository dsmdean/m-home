import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/budget', title: 'Budget', icon: 'ni-chart-bar-32 text-green', class: '' },
  { path: '/budget/add', title: 'Add Budget', icon: '', class: '' },
  { path: '/income', title: 'Income', icon: 'ni-chart-pie-35 text-blue', class: '' },
  { path: '/expense', title: 'Expenses', icon: 'ni-money-coins text-red', class: '' },
  { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  // { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
  // { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '' },
  // { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' }
  // { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
  // { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  user: {};

  constructor(private router: Router, public auth: AuthenticationService) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
