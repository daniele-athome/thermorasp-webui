import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private navStart: Observable<NavigationStart>;

  constructor(private renderer: Renderer2,
              private router: Router) {
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
  }

  ngOnInit() {
    this.navStart.subscribe(
      evt => {
        if (window.innerWidth < 992) {
          this.close();
        }
    });
  }

  toggle() {
    if (document.body.classList.contains('is-collapsed')) {
      this.renderer.removeClass(document.body, 'is-collapsed');
    }
    else {
      this.renderer.addClass(document.body, 'is-collapsed');
    }
  }

  close() {
    this.renderer.removeClass(document.body, 'is-collapsed');
  }

}
