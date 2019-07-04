import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
        title: new FormControl('Food'),
        value: new FormControl(100),
    }
  );

  constructor() {
    this.calculateTotalExpenses();
  }

  onAdd() {
    console.log(this.BudgetPlannerForm.value);
    this.expenses.push({title: this.BudgetPlannerForm.value.title, value: this.BudgetPlannerForm.value.value})
    this.calculateTotalExpenses();
    this.BudgetPlannerForm.reset();
    console.log("Submitted");
  }

  onDelete(item) {
    this.expenses.splice(item, 1);
    console.log("Deleted " + item);
    this.calculateTotalExpenses();
  }

  onClear() {
    this.BudgetPlannerForm.reset();
    console.log("Cleared");
  }

  calculateTotalExpenses() {
    let expenses = 0;
    for (let index = 0; index < this.expenses.length; index++) {
      expenses += this.expenses[index].value;
      console.log(this.expenses[index].value);
    }
    this.totalExpenses = expenses;
    console.log('Total expenses: ' + this.totalExpenses);
  }
}
