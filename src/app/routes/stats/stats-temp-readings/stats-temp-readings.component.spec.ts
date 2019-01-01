import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsTempReadingsComponent } from './stats-temp-readings.component';

describe('StatsTempReadingsComponent', () => {
  let component: StatsTempReadingsComponent;
  let fixture: ComponentFixture<StatsTempReadingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsTempReadingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsTempReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
