
import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import Chart from 'chart.js/auto'; 

@Component({
  selector: 'app-cpe-tracker', 
  templateUrl: './cpe-tracker.component.html', 
  styleUrls: ['./cpe-tracker.component.scss'] 
})
export class CpeTrackerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
 
  creditType: string = 'EARNED'; // Default credit type
  tableShowState: string = ''; // State for table display
  activeHeadData: any; // Active table header data
  activeData: any; // Active table data
  isMobile: boolean = false; // Mobile device flag



  // Charts variables
  public courseChart: any;
  public studyChart: any;

  // Method to switch between earned and upcoming credits
  credit(type: string) {
    this.creditType = type;
    if (this.creditType === 'EARNED') {
      this.activeHeadData = this.earnedtableHeadData;
      this.activeData = this.earnedTableData;
      this.tableShowState = '';
    } else {
      this.activeHeadData = this.upcomingtableHeadData;
      this.activeData = this.upcomingTableData;
      this.tableShowState = '';
    }
  }

  // Method to set table show state
  select(type: string) {
    this.tableShowState = type;
  }

 
  createChart() {
    console.log('desktop');
    // Create doughnut chart for courses
    this.courseChart = new Chart('doughnutChartCanvas0', {
      type: 'doughnut',
      data: {
        datasets: [
          { label: 'Accounting', data: [100, 60], backgroundColor: ['rgba(90, 100, 153, 1)', 'rgba(90, 100, 153, 0.2)'], borderWidth: 0, hoverOffset: 4 },
          { label: 'Ethics', data: [33, 33], backgroundColor: ['rgba(240, 107, 109, 1)', 'rgba(240, 107, 109, 0.2)'], borderWidth: 0, hoverOffset: 4 },
          { label: 'Others', data: [30, 70], backgroundColor: ['rgba(252, 192, 70, 1)', 'rgba(252, 192, 70, 0.2)'], borderWidth: 0, hoverOffset: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Create doughnut chart for study methods
    this.studyChart = new Chart('doughnutChartCanvas1', {
      type: 'doughnut',
      data: {
        datasets: [
          { label: 'Webinar', data: [100, 80], backgroundColor: ['rgba(90, 100, 153, 1)', 'rgba(90, 100, 153, 0.2)'], borderWidth: 0, hoverOffset: 4 },
          { label: 'Self Study', data: [33, 33], backgroundColor: ['rgba(252, 192, 70, 1)', 'rgba(252, 192, 70, 0.2)'], borderWidth: 0, hoverOffset: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Method to create mobile charts
  mobileCreateChart() {
    console.log('mobile');
    // Create doughnut chart for courses on mobile
    this.courseChart = new Chart('doughnutChartCanvas3', {
      type: 'doughnut',
      data: {
        datasets: [
          { label: 'Accounting', data: [100, 60], backgroundColor: ['rgba(90, 100, 153, 1)', 'rgba(90, 100, 153, 0.2)'], borderWidth: 0, hoverOffset: 4 },
          { label: 'Ethics', data: [33, 33], backgroundColor: ['rgba(240, 107, 109, 1)', 'rgba(240, 107, 109, 0.2)'], borderWidth: 0, hoverOffset: 4 },
          { label: 'Others', data: [30, 70], backgroundColor: ['rgba(252, 192, 70, 1)', 'rgba(252, 192, 70, 0.2)'], borderWidth: 0, hoverOffset: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Create doughnut chart for study methods on mobile
    this.studyChart = new Chart('doughnutChartCanvas4', {
      type: 'doughnut',
      data: {
        datasets: [
          { label: 'Webinar', data: [100, 80], backgroundColor: ['rgba(90, 100, 153, 1)', 'rgba(90, 100, 153, 0.2)'], borderWidth: 0, hoverOffset: 4 },
          { label: 'Self Study', data: [33, 33], backgroundColor: ['rgba(252, 192, 70, 1)', 'rgba(252, 192, 70, 0.2)'], borderWidth: 0, hoverOffset: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }


  ngAfterViewInit() {
    this.createChart(); // Create charts on view initialization
  }


  ngOnChanges() {
    this.createChart(); // Recreate charts on changes
  }


  ngOnInit() {
    this.createChart(); 
    this.mobileCreateChart(); 
    this.credit('EARNED'); 
  }

  // Lifecycle hook: On component destruction
  ngOnDestroy(): void {
    this.courseChart.destroy(); // Destroy course chart instance
    this.studyChart.destroy(); // Destroy study chart instance
  }

  // Table header data for earned credits
  earnedtableHeadData = ['Course', 'Field of Study', 'Delivery Method', 'Date of Completion', 'CPE Credit', 'Actions'];

  // Table data for earned credits
  earnedTableData = [
    { id: '1', course: 'Forensic Accounting - Part 1', field: 'Accounting', delivery: 'Webinar', date: '12 May 23', credit: '1', actionStatus: 'Register' },
    { id: '2', course: 'Forensic Accounting - Part 1', field: 'Accounting', delivery: 'Self Study', date: '12 May 23', credit: '1', actionStatus: 'Registered' },
    { id: '3', course: 'Forensic Accounting - Part 1', field: 'Accounting', delivery: 'Webinar', date: '12 May 23', credit: '1', actionStatus: 'Registered' },
    { id: '4', course: 'Ethics - Part 1', field: 'Accounting', delivery: 'Webinar', date: '6 Jul 24', credit: '1', actionStatus: 'Join Now' },
    { id: '5', course: 'Ethics - Part 1', field: 'Accounting', delivery: 'Webinar', date: '6 Jul 24', credit: '1', actionStatus: 'Resume' },
    { id: '6', course: 'Others', field: 'Accounting', delivery: 'Self Study', date: '29 Jul 24', credit: '1', actionStatus: 'Take Exam' }
  ];

  // Table header data for upcoming credits
  upcomingtableHeadData = ['Course', 'Field of Study', 'Delivery Method', 'Date of Completion', 'CPE Credit', 'Actions'];

  // Table data for upcoming credits
 
  upcomingTableData = [
    { id: '1', course: 'Forensic Accounting - Part 1', field: 'Accounting', delivery: 'Webinar', date: '12 May 23', credit: '1', actionStatus: 'Register' },
    { id: '2', course: 'Forensic Accounting - Part 1', field: 'Accounting', delivery: 'Self Study', date: '12 May 23', credit: '1', actionStatus: 'Registered' },
    { id: '3', course: 'Forensic Accounting - Part 1', field: 'Accounting', delivery: 'Webinar', date: '12 May 23', credit: '1', actionStatus: 'Registered' },
    { id: '4', course: 'Ethics - Part 1', field: 'Accounting', delivery: 'Webinar', date: '6 Jul 24', credit: '1', actionStatus: 'Join Now' },
    { id: '5', course: 'Ethics - Part 1', field: 'Accounting', delivery: 'Webinar', date: '6 Jul 24', credit: '1', actionStatus: 'Resume' },
    { id: '6', course: 'Others', field: 'Accounting', delivery: 'Self Study', date: '29 Jul 24', credit: '1', actionStatus: 'Take Exam' }
  ];
}
