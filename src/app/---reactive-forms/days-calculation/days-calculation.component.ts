import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-days-calculation',
  imports: [ReactiveFormsModule],
  templateUrl: './days-calculation.component.html',
  styleUrl: './days-calculation.component.scss',
})
export class DaysCalculationComponent {
  private _fb = inject(FormBuilder);
  form: FormGroup;
  /*------ Store Planned Date of Set ------*/
  planeDatesStore: string[] = [];

  startDate!: Date;
  endDate!: Date;

  constructor() {
    this.form = this._fb.group({
      scheduledFrom: [null], // Start date picker
      scheduledTo: [null], // No. of visits input
      noOfVisit: [null], // Start date picker
      firstSelectionDate: [null], // Date range picker
    });

    // this.form = this._assetMaintenanceService.getassetMaintenanceForm();
    this.form.get('firstSelectionDate')?.disable();

    // Trigger calculation on form changes
    this.form.get('noOfVisit')?.valueChanges.subscribe(() => {
      this.calculateDaysVisits();
    });
    this.form.get('firstSelectionDate')?.valueChanges.subscribe(() => {
      this.calculateDaysVisits();
    });
  }

  ngOnInit(): void {
    // Set initial values for the form
    this.form.get('scheduledFrom')?.setValue(this.startDate);
    this.form.get('scheduledTo')?.setValue(this.endDate);
  }

  calculateDaysVisits() {
    const range = this.form.get('scheduledTo')?.value;
    const visits = this.form.get('noOfVisit')?.value;
    const startDate = this.form.get('firstSelectionDate')?.value;
    if (!visits || visits < 1 || !startDate) {
      this.planeDatesStore = [];
      return;
    }
    const start = moment(startDate);
    const end = moment(range); // End date from date range
    const diffDays = end.diff(start, 'days');
    // Check Different Days
    if (diffDays < 0) {
      this.planeDatesStore = [];
      return;
    }
    // Store Only First date
    this.planeDatesStore = [start.format('DD-MMM-YYYY')];
    // Store Divided Multiple Date based on Select No. of Visit
    if (visits > 1) {
      const interval = Math.floor(diffDays / (visits - 1));
      for (let i = 1; i < visits; i++) {
        const nextDate = start.clone().add(interval * i, 'days');
        this.planeDatesStore.push(nextDate.format('DD-MMM-YYYY'));
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      console.log('Visit Dates:', this.planeDatesStore);
    }
  }
}
