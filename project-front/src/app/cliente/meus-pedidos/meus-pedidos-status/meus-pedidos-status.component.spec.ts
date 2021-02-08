import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusPedidosStatusComponent } from './meus-pedidos-status.component';

describe('MeusPedidosStatusComponent', () => {
  let component: MeusPedidosStatusComponent;
  let fixture: ComponentFixture<MeusPedidosStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusPedidosStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusPedidosStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
