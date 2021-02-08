import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-meus-pedidos-status',
  templateUrl: './meus-pedidos-status.component.html',
  styleUrls: ['./meus-pedidos-status.component.css']
})
export class MeusPedidosStatusComponent implements OnInit {
  rastreio: string = '-';
  estimativa: string = '-'
  constructor(public appsevice: AppService) { }
 
  ngOnInit(): void {
  }

}
