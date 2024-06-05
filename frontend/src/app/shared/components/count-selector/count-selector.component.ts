import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {

  count: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
