import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLogListComponent } from './eventlog-list.component';

describe('EventLogListComponent', () => {
  let component: EventLogListComponent;
  let fixture: ComponentFixture<EventLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
