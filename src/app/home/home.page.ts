import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public totalExpenses : number = 0;
  public expenses = [
    {"title": "Food", "value": 200},
    {"title": "Drinks", "value": 200},
    {"title": "Parties", "value": 200},
    {"title": "Transport", "value": 200},
    {"title": "Entertainment", "value": 200},
  ];
  BudgetPlannerForm = new FormGroup(
    {
        title: new FormControl(''),
        value: new FormControl(''),
    }
  );

  constructor() {

  }

  onAdd() {
    
    this.BudgetPlannerForm.reset();
    console.log("Submitted");
  }

  onDelete(item) {
    this.expenses.splice(item, 1);
    console.log("Deleted " + item);
  }

  onClear() {
    this.BudgetPlannerForm.reset();
    console.log("Cleared");
  }
}
