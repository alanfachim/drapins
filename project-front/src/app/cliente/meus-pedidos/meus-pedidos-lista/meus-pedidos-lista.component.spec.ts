import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusPedidosListaComponent } from './meus-pedidos-lista.component';

describe('MeusPedidosListaComponent', () => {
  let component: MeusPedidosListaComponent;
  let fixture: ComponentFixture<MeusPedidosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusPedidosListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusPedidosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
