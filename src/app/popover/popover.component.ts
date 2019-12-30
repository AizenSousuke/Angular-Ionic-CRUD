import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() currentSortBy;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
    console.log("CurrentSortBy: " + this.currentSortBy);
  }
  
  async onSort(event) {
    console.log(event.detail.value + " is selected for sort.");
    if (event) {
      await this.popoverController.dismiss(event.detail.value);
    }
  }

  isCurrentSortBy(name) {
    if (this.currentSortBy == name) {
      return true;
    } else {
      return false;
    }
  }
}
