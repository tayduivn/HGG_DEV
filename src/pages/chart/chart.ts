import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { AuthService, PageBase, EventService, HobbyService, UltilitiesService } from '../../providers';
import { TranslateService } from '../../translate';
import { ShowUserInfo } from '../../providers/show-user-info';
import { PlanService } from "../../providers/plan-service"
import { Chart } from 'chart.js';
import _ from 'lodash';
@Component({
    selector: 'page-chart',
    templateUrl: 'chart.html',
})

export class ChartPage extends PageBase {
    @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;

    barChart1: any;
    yearBarChart1: any = 2018;
    yearBarChart2: any;
    yearBarChart3: any = 2018;
    doughnutChart: any;
    lineChart: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public authService: AuthService,
        public showUserInfo: ShowUserInfo,
        public eventService: EventService,
        public loadingCtrl: LoadingController,
        private _translate: TranslateService,
        public alertCtrl: AlertController,
        public hobbyService: HobbyService,
        public planService: PlanService,
        public UltilitiesService: UltilitiesService,
        public modalCtrl: ModalController) {
        super(navCtrl, loadingCtrl, alertCtrl, _translate, showUserInfo, UltilitiesService);
    }
    init() {

    }
    ionViewDidLoad() {
        this.updateCharBar();
        this.updateCharDoughnut();
        this.updateCharCanvas();


    }
    yearChangebar(val) {
        this.yearBarChart1 = val
    }
    updateCharBar() {
        if (this.barChart1 != undefined) {
            this.barChart1.destroy();
        }
        this.barChart1 = new Chart(this.barCanvas.nativeElement, {
            type: 'horizontalBar',
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                datasets: [{
                    label: '# of Votes',
                    data: [80000, 70000, 51000, 52000, 52500, 53700, 54900, 56100, 57300, 68000, 59700, 80900],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        });
    }
    yearChangeDoughnut(val) {
        this.yearBarChart2 = val
    }
    updateCharDoughnut() {
        if (this.doughnutChart != undefined) {
            this.doughnutChart.destroy();
        }
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ["Việt Nam", "Trung Quốc", "Hàn Quốc", "Châu Âu", "Khác"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        // 'rgba(255, 159, 64, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384",
                        "#36A2EB",
                        // "#FFCE56"
                    ]
                }]
            }

        });
    }
    yearChangeCanvas(val) {
        this.yearBarChart3 = val;
    }
    updateCharCanvas() {
        if (this.lineChart != undefined) {
            this.lineChart.destroy();
        }
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "1 sao ",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [45, 53, 57, 59, 56, 60, 62, 65, 59, 66, 67, 56, 58, 62],
                        spanGaps: false,
                    },
                    {
                        label: "2 sao",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255, 99, 132, 0.2);",
                        borderColor: "rgba(255, 99, 132, 0.2);",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [80, 70, 50, 65, 63, 60, 63, 65, 69, 60, 50, 65, 73, 75],
                        spanGaps: false,
                    }
                    ,
                    {
                        label: "3 sao",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255, 99, 132, 0.2);",
                        borderColor: "rgba(255, 99, 132, 0.2);",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [70, 80, 50, 60, 62, 80, 66, 56, 65, 57, 70, 69, 67, 69],
                        spanGaps: false,
                    },
                    {   label: "4 sao",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255, 99, 132, 0.2);",
                        borderColor: "rgba(255, 99, 132, 0.2);",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [50, 70, 75, 65, 59, 50, 55, 65, 73, 65, 58, 65, 68, 75],
                        spanGaps: false,
                    },
                    {
                        label: "5 sao",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255, 99, 132, 0.2);",
                        borderColor: "rgba(255, 99, 132, 0.2);",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderColor: "rgba(255, 99, 132, 0.2);",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [40, 50, 55, 58, 59, 62, 66, 70, 72, 76, 77, 79, 75, 70],
                        spanGaps: false,
                    }
                ]
            }

        });
    }
}
