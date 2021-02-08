import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosClienteComponent } from './dados-cliente.component';

describe('DadosClienteComponent', () => {
  let component: DadosClienteComponent;
  let fixture: ComponentFixture<DadosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
