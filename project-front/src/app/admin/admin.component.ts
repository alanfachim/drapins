import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../appservice.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  pedidos: any[] = [];
  public screen=1;
  currentWindowWidth: boolean;
  deviceType: string;
  constructor(private http: HttpClient, private route: ActivatedRoute, public appsevice: AppService) { }
  estimativa: NgbDateStruct;
  rastreio:string;
  breakpoints = {
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1200
  }

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth > 860;
    
    this.deviceType =
      window.innerWidth >= this.breakpoints.xl
        ? 'xl'
        : window.innerWidth >= this.breakpoints.lg
          ? 'lg'
          : window.innerWidth >= this.breakpoints.md
            ? 'md'
            : window.innerWidth >= this.breakpoints.sm
              ? 'sm'
              : 'xs';
  }
  saveUsername=false;
  onSubmit(a,b){
    this.appsevice.updateOrder(a, b, (data) => {
      var p = this.pedidos.filter(function (obj) {
        return obj.codigo == b;
      }); 
      p["estimativa"]=this.estimativa;
      p["rastreio"]=this.rastreio;
      alert('formulário salvo');
    }, (erro) => { },"&rastreio="+this.rastreio+"&estimativa="+`${this.estimativa.day}/${this.estimativa.month}/${this.estimativa.year}`)
  }
  chat(p) {
    p.exp_chat = !p.exp_chat;
  }
  envio(p) {
    p.exp_envio = !p.exp_envio;
  }
  next() {

  }
  changeTab(event){
    this.screen=event;
    console.log(event);
    
  }
  lista(p) {
    p.exp_lista = !p.exp_lista;
  }
  info(p) {
    p.exp_info = !p.exp_info;
  }
  getCatalogo(dt) {
    var ret = 0;
    dt.forEach(element => {
      if (element.total > 0 && element.cat == "MG") {
        if (ret > 0) {
          return 0;
        } else
          ret= 2;
      } else if (element.total > 0 && element.cat == "SP") {
        if (ret > 0) {
          return 0;
        } else
          ret= 1;
      }
    });
    return ret;

  }
  seleciona(a,b,i,p){
    this.appsevice.updateOrder(a, b, (data) => {
     
      p.status=i;
    }, (erro) => { },"&status="+i+"&st="+i.substring(1,0))
  }
  
  cancel(a, b) {
    if (confirm('Voce tem certesa que deseja cancelar este pedido?')) {
      this.appsevice.cancelOrder(a, b, (data) => {
        var p = this.pedidos.filter(function (obj) {
          return obj.codigo == b;
        });
        const index = this.pedidos.indexOf(p[0]);
        this.pedidos.splice(index, 1);
      }, (erro) => { })
    }
  }
  date(pedido) {
    return new Date(parseInt(pedido.datacompra)).toLocaleString('pt-BR');
  }

  total(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(v));
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.http.get(`${window['env'].base_api}getOrder?user=${params['user']}&token=${params['token']}&admin=master `)
        .subscribe((data) => {
          if (!data) {
            window.location.href = `./login?user=${params['user']}&action=order`
          }
          (<any[]>data).forEach(element => {
            (element["pedidos"]).forEach(p => {
              p.email = element["id"];
              p.telefone = element["telefone"];
              p.nome = element["nome"];
              p.endereco = element["endereco"];
              p.numero = element["numero"];
              p.cidade = element["cidade"];
              p.bairro = element["bairro"];
              p.complemento = element["complemento"];
              p.estado = element["estado"];
              p.cep = element["cep"];
              p.exp_lista = false;
              p.exp_info = false;
              p.exp_envio = false;
              p.exp_chat = false;
              p.password = element["password"];
              this.pedidos.push(p)
            });

          });

        }, err => console.log(err));

    });
  }

}
