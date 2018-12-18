import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inline-loading',
  templateUrl: './inline-loading.component.html',
  styleUrls: ['./inline-loading.component.scss']
})
export class InlineLoadingComponent implements OnInit {

  @Input()
  cssClass: string;

  constructor() { }

  ngOnInit() {
  }

}
