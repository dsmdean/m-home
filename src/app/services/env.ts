import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  env: any;

  constructor(private titleService: Title, public http: HttpClient) {
    this.env = { title: '', url: '' };
    this.env.name = 'Menso Home | ';
    // this.env.url = 'https://menso-home.herokuapp.com';
    this.env.url = 'http://localhost:9001';
    this.env.months = new Array();

    this.env.months[0] = "January";
    this.env.months[1] = "February";
    this.env.months[2] = "March";
    this.env.months[3] = "April";
    this.env.months[4] = "May";
    this.env.months[5] = "June";
    this.env.months[6] = "July";
    this.env.months[7] = "August";
    this.env.months[8] = "September";
    this.env.months[9] = "October";
    this.env.months[10] = "November";
    this.env.months[11] = "December";
  }

  getEnv() {
    return this.env;
  }

  setTitle(title) {
    this.titleService.setTitle(this.env.name + title);
  }

  getMonth() {
    return new Date().getMonth();
  }
}
