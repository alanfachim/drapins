import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusPedidosPagamentosComponent } from './meus-pedidos-pagamentos.component';

describe('MeusPedidosPagamentosComponent', () => {
  let component: MeusPedidosPagamentosComponent;
  let fixture: ComponentFixture<MeusPedidosPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusPedidosPagamentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusPedidosPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
