import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { AppService, Client } from '../appservice.service';
import { CarrinhoEntregaComponent } from './carrinho-entrega/carrinho-entrega.component';
import { Cliente } from './cliente .model';
import { DadosClienteComponent } from './dados-cliente/dados-cliente.component';
import { QRPay } from './pagamentos/qr.models';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  loading: boolean = false;
  invalid: boolean = true;
  login: boolean = false;
  xs: boolean = false;
  activeId: number = 1;
  data: any;
  pedido: string = "";
  total: number = 0;
  totalSP: number = 0;
  totalMG: number = 0;
  freteSP: number = 0;
  freteMG: number = 0;
  stotal: string;
  stotalSP: string;
  stotalMG: string;
  sfreteSP: string;
  sfreteMG: string;
  msgtemp: boolean = false;
  token: string;
  falhalogin: boolean;
  user: any;
  invalidsingin: boolean = false;
  pedidogerado: boolean = false;

  get usuario() { return this.clienteForm.get('nome').value != ''; }
  get senha() { return this.clienteForm.get('senha').value != ''; }

  public clienteForm: FormGroup;
  @ViewChild(DadosClienteComponent) ccomp: DadosClienteComponent;
  @ViewChild(CarrinhoEntregaComponent) envio: CarrinhoEntregaComponent;

  public qrcode: QRPay[];
  constructor(public modal: NgbActiveModal, private http: HttpClient, public appsevice: AppService) {
    if (appsevice.cliente.nome != '') {
      this.activeId = 2;
      this.invalidsingin = true
    }

  }
  @HostListener('window:resize')
  onResize() {
    this.xs = window.innerWidth < 560;
  }
  ngOnInit(): void {
    this.xs = window.innerWidth < 560;
    this.calcule();
    this.appsevice.cartList.subscribe(c => {
      this.calcule();
    });

    this.clienteForm = new FormGroup({
      nome: new FormControl(''),
      senha: new FormControl('')
    });
  }

  calcule() {
    var freteMetro = 0;
    var l = this.appsevice.cartList.getValue();
    this.freteMG = 0;
    this.freteSP = 0;
    this.totalSP = 0;
    this.totalMG = 0;
    this.total = 0;
    var totalSP = 0;
    var totalMG = 0;
    l.forEach(function (item, i) {
      if (item.cat == 'SP') {
        totalSP += Number(item.valor.replace(/[^0-9,.-]+/g, ""));
      } else {
        totalMG += Number(item.valor.replace(/[^0-9,.-]+/g, ""));
      }
    });
    this.totalSP = totalSP;
    this.totalMG = totalMG;
    this.freteMG = this.totalMG > 0 ? this.appsevice.frete : 0;
    this.freteSP = this.totalSP > 0 ? this.appsevice.frete : 0;

    var fmg = this.totalMG > 120;
    var fsp = this.totalSP > 120;
    switch (this.envio ? this.envio.option : 0) {
      case 3:
        this.freteSP = this.freteSP > 0 ? this.appsevice.freteMetro : 0;
        break;
      case 4:
        this.freteSP = 0;
        break;
      case 12:
        this.freteMG = 0;
        break;
        case 13:
        this.freteMG =  this.freteMG > 0 ? this.appsevice.freteJDF : 0;
        break;

    }
    this.total = (fmg ? 0 : this.freteMG) + (fsp ? 0 : this.freteSP) + this.totalSP + this.totalMG;
    this.stotalSP = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.totalSP);
    this.stotalMG = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.totalMG);
    this.sfreteMG = fmg ? 'Frete Gratis!' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.freteMG);
    this.sfreteSP = fsp ? 'Frete Gratis!' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.freteSP);

    this.stotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.total);
  }
  submitFormValid(evt) {
    this.invalid = evt == 'INVALID';
  }
  submit(nav: NgbNav, login: boolean) {


    if (this.activeId == 1 && !login) {
      this.data = this.ccomp.getdata();
      this.appsevice.validaUsuario(this.data.email, (value) => {
        if (!value) {
          this.submit_next(nav, login);
        }
      }, (erro) => { });
    } else {
      this.submit_next(nav, login);
    }
  }
  submit_next(nav: NgbNav, login: boolean) {
    this.falhalogin = false;
    this.loading = true;
    if (login && this.activeId == 1) {
      this.user = this.clienteForm.get('nome').value;
      var senha = this.clienteForm.get('senha').value;
      this.appsevice.login(this.user, senha, (data) => {
        this.token = data;
        this.loading = false;
        nav.select(2);
        return;
      }, (data) => {
        this.loading = false;
        this.falhalogin = true;
        return;
      }
      );
    } else {
      if (this.activeId == 1) {
        this.data = this.ccomp.getdata();
        nav.select(2);
      } else {
        this.submitForm(this.data ? this.data.senha : '', this.envio ? this.envio.option : 0);
      }
    }
  }

  submitForm(senha, envio) {
    this.appsevice.pggerado = true;
    if (this.appsevice.token === undefined || this.appsevice.token == '') {
      this.http.post(`https://alanapi.azurewebsites.net/api/sendMail?
                      &subj=0&email=${this.appsevice.cliente.email.trim()}
                      &telefone=${this.appsevice.cliente.telefone.trim()}
                      &nome=${this.appsevice.cliente.nome.trim()}
                      &numero=${this.appsevice.cliente.numero.trim()}
                      &endereco=${this.appsevice.cliente.endereco.trim()}
                      &cidade=${this.appsevice.cliente.cidade.trim()}
                      &complemento=${this.appsevice.cliente.complemento.trim()} 
                      &estado=${this.appsevice.cliente.estado.trim()}
                      &secret=${senha}
                      &envio=${envio}
                      &cep=${this.appsevice.cliente.cep}`, JSON.stringify(this.appsevice.cartList.getValue())).subscribe(data => {
        this.qrcode = data["pay"] as QRPay[];
        this.pedido = this.qrcode[0].pedido;
        this.appsevice.cliente = data["cliente"] as Client;
        this.appsevice.token = data["token"];
        localStorage.setItem('currentUser', JSON.stringify({ token: this.appsevice.token, cliente: this.appsevice.cliente }));
        this.msgtemp = true;
        setTimeout(() => {
          this.msgtemp = false;
        }, 7000);
        this.loading = false;
        this.pedidogerado = true;
      });
    } else {
      this.http.post(`https://alanapi.azurewebsites.net/api/sendMail?
                      &subj=0&email=${this.appsevice.cliente.email.trim()} 
                      &envio=${envio}
                      &token=${this.appsevice.token.trim()}`, JSON.stringify(this.appsevice.cartList.getValue())).subscribe(data => {
        try {
          this.qrcode = data as QRPay[];
          this.pedido = this.qrcode[0].pedido;
          this.pedidogerado = true;
          this.loading = false;
        } catch (e) {
          alert('Falha ao gerar pedido');
        }
      });
    }
  }

}
