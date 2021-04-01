import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddskuComponent } from './addsku.component';

describe('AddskuComponent', () => {
  let component: AddskuComponent;
  let fixture: ComponentFixture<AddskuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddskuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddskuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
