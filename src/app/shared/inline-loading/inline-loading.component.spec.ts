import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineLoadingComponent } from './inline-loading.component';

describe('InlineLoadingComponent', () => {
  let component: InlineLoadingComponent;
  let fixture: ComponentFixture<InlineLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
