import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
        title: new FormControl('Food', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        value: new FormControl(100, [Validators.required, Validators.min(1), Validators.max(9999)]),
    }
  );

  constructor(private _router: Router,
              private _menu: MenuController) {
    this.calculateTotalExpenses();
  }

  openMenu() {
    this._menu.enable(true, 'menuId');
    this._menu.open('menuId');
    console.log(this._menu);
  }

  onAdd() {
    if (this.BudgetPlannerForm.valid) {
      console.log(this.BudgetPlannerForm.value);
      this.expenses.push({title: this.BudgetPlannerForm.value.title, value: this.BudgetPlannerForm.value.value})
      this.calculateTotalExpenses();
      this.BudgetPlannerForm.reset();
      console.log("Submitted");
    } else {
      console.log("Form is invalid");
    }
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

  loadRecipeList() {
    this._router.navigate(['/recipe-list']);
  }
}
