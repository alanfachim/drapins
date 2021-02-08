import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-meus-pedidos-pagamentos-xs',
  templateUrl: './meus-pedidos-pagamentos-xs.component.html',
  styleUrls: ['./meus-pedidos-pagamentos-xs.component.css']
})
export class MeusPedidosPagamentosXsComponent implements OnInit {
 
    @Input()
    public pagamentos: any[];
    @Input()
    public pagSelecionado: string;
    @Input()
    public pedido: any;
    fileToUpload: File = null;
    constructor(private appsevice: AppService) { }
  
    ngOnInit(): void {
      this.pagSelecionado=this.pagamentos[0].carteira;
    }
    handleFileInput(files: FileList ) {
      this.fileToUpload = files.item(0);
      this.uploadFileToActivity(this.pedido.codigo);
  }
  clear(){
    this.pedido.comprovante=undefined;
  }
  seleciona(s){
    this.pagSelecionado=s;
  }
  getname(n){
    var ini=n.split('-')[0]+'-';
    return n.replace(ini,"");
  }
  uploadFileToActivity(pedido) {
    this.appsevice.postFile(this.fileToUpload,pedido,(data)=>{this.pedido.comprovante=data["result"];});
  }
  toreal(n) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }
  redirect(l,c){
    if(l!==undefined)
    window.location.href=l;
    else{
      navigator.clipboard.writeText(c).then(function() {
        alert('Chave copiada!')
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }

  }

}
