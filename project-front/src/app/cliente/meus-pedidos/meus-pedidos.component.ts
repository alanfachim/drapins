import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-meus-pedidos',
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.css']
})
export class MeusPedidosComponent implements OnInit {

  @Input()
  pedidos: any;
  @Input()
  cliente;
  xs: boolean=false;
  constructor(public appsevice: AppService) { }
  decode(i) {
    return decodeURI(i)
  }
  ngOnInit(): void {
    this.xs = window.innerWidth < 560;
  }
  @HostListener('window:resize')
  onResize() {
    this.xs = window.innerWidth < 560;
  }
}
