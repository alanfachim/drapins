import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.css']
})
export class PagamentosComponent implements OnInit {
  public myAngularxQrCode: string = null;
  constructor() { }

  ngOnInit(): void {
    this.myAngularxQrCode = 'Your QR code data string';
  }

}
