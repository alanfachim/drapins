import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusPedidosPagamentosXsComponent } from './meus-pedidos-pagamentos-xs.component';

describe('MeusPedidosPagamentosXsComponent', () => {
  let component: MeusPedidosPagamentosXsComponent;
  let fixture: ComponentFixture<MeusPedidosPagamentosXsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusPedidosPagamentosXsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusPedidosPagamentosXsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
