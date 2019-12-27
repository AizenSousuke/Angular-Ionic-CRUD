import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }
  
  async onSort(event) {
    console.log(event.detail.value + " is selected for sort.");
    if (event) {
      await this.popoverController.dismiss(event.detail.value);
    }
  }
}
