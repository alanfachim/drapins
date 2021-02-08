import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-meus-pedidos-pagamentos',
  templateUrl: './meus-pedidos-pagamentos.component.html',
  styleUrls: ['./meus-pedidos-pagamentos.component.css']
})
export class MeusPedidosPagamentosComponent implements OnInit {
  @Input()
  public pagamentos: any[];
  @Input()
  public pagSelecionado: string;
 
  @Input()
  public pedido: any;
  fileToUpload: File = null;
  constructor(private appsevice: AppService) { }
  carteira = '';
  enter(c) {
    this.carteira = c;
  }
  ngOnInit(): void {
    this.pagSelecionado=this.pagamentos[0].carteira;
  }
  seleciona(s){
    this.pagSelecionado=s;
  }
  toreal(n) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity(this.pedido.codigo);
  }
  clear() {
    this.pedido.comprovante = undefined;
  }
  getname(n) {
    var ini = n.split('-')[0] + '-';
    return n.replace(ini, "");
  }
  uploadFileToActivity(pedido) {
    this.appsevice.postFile(this.fileToUpload, pedido, (data) => { this.pedido.comprovante = data["result"]; });
  }
}
