import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('sidebar')
  sidebar: SidebarComponent;

  hideSidebarIfMobile(event: Event) {
    if (window.innerWidth < 992) {
      this.sidebar.close();
      // FIXME this below doesn't work
      event.preventDefault();
    }
  }
}
