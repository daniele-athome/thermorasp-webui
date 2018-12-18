import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  toggle() {
    if (document.body.classList.contains('is-collapsed')) {
      this.renderer.removeClass(document.body, 'is-collapsed');
    }
    else {
      this.renderer.addClass(document.body, 'is-collapsed');
    }
  }

}
