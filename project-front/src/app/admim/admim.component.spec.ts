import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmimComponent } from './admim.component';

describe('AdmimComponent', () => {
  let component: AdmimComponent;
  let fixture: ComponentFixture<AdmimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
