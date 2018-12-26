import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorFormComponent } from './sensor-form.component';

describe('SensorFormComponent', () => {
  let component: SensorFormComponent;
  let fixture: ComponentFixture<SensorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
