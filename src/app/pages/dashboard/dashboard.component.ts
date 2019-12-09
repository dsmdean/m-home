import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Router } from '@angular/router';
import { EnvService } from '../../services/env';
import { AuthenticationService } from '../../services/authentication';
import { CashflowService } from '../../services/cashflow';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  error: { show: Boolean, type: String, message: String, data };
  expenses: [{ date, amount }];
  income: [{ date, amount }];
  months: any[];
  expenseChartData: any;
  incomeChartData: any;

  constructor(private EnvService: EnvService, public auth: AuthenticationService, private router: Router, public flowService: CashflowService) {
    this.EnvService.setTitle("Dashboard");
    this.error = { show: false, type: '', message: '', data: null };
    this.months = this.EnvService.getEnv().months;
    this.expenseChartData = new Array();
    this.incomeChartData = new Array();
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.getExpenses();
      this.getIncome();
    }

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];
  }

  getExpenses() {
    this.flowService.getAllCashFlowExpenses()
      .subscribe(data => {
        this.expenses = data.cashflows;
        this.orderByMonth(this.expenseChartData, this.expenses);
        this.setExpenseChartData();
      }, this.asyncError);
  }

  getIncome() {
    this.flowService.getAllCashFlowIncome()
      .subscribe(data => {
        this.income = data.cashflows;
        this.orderByMonth(this.incomeChartData, this.income);
        this.setIncomeChartData();
      }, this.asyncError);
  }

  orderByMonth(data, flow) {
    for (let i = 0; i < this.months.length; i++) {
      data[i] = 0
    }

    flow.forEach(element => {
      let amountParsed = parseFloat(element.amount);
      data[new Date(element.date).getMonth()] = parseFloat(data[new Date(element.date).getMonth()].toFixed(2)) + amountParsed;
    });
  }

  setExpenseChartData() {
    var chartSales = document.getElementById('chart-sales');

    const chart = {
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value) {
                  if (!(value % 10)) {
                    return '$' + value
                  }
                }
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function (item, data) {
              var label = data.datasets[item.datasetIndex].label || "";
              var yLabel = item.yLabel;
              var content = "$";
              if (data.datasets.length > 1) {
                content += label;
              }
              content += yLabel;
              return content;
            }
          }
        }
      },
      data: {
        labels: this.months,
        datasets: [{
          label: 'Expenses',
          data: this.expenseChartData
        }]
      }
    }

    this.salesChart = new Chart(chartSales, {
      type: 'line',
      options: chart.options,
      data: chart.data
    });
  }

  setIncomeChartData() {
    var chartOrders = document.getElementById('chart-orders');
    parseOptions(Chart, chartOptions());

    const bar = {
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value) {
                  if (!(value % 10)) {
                    return '$' + value;
                    // return value;
                  }
                }
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function (item, data) {
              var label = data.datasets[item.datasetIndex].label || "";
              var yLabel = item.yLabel;
              var content = "$";
              if (data.datasets.length > 1) {
                content += label;
              }
              content += yLabel;
              return content;
            }
          }
        }
      },
      data: {
        labels: this.months,
        datasets: [
          {
            label: "Income",
            data: this.incomeChartData
          }
        ]
      }
    }

    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: bar.options,
      data: bar.data
    });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  asyncError(error) {
    this.error.show = true;
    this.error.type = "warning";
    this.error.message = error.status + ' ' + error.statusText;
  }

}
