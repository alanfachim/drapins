import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Recipe } from './recipes/recipes.model';
const ALTER_EGOS = ['Eric'];

export class Client {
  complemento: any;
  constructor(public email: string, public telefone: string, public endereco: string, public cidade: string, public estado: string, public cep: string, public numero: string, public nome: string) { }
}

@Injectable({
  providedIn: 'root'
})


export class AppService {
  extramenu: any[] =[];
  freteJDF: number=5;
  sendMessage(value: string, pedido: string, callback, callbackErro,user) {
    var euser=user==undefined?`user=${this.cliente.email.trim()}`:`admin=${this.cliente.email.trim()}&user=${user}`

    this.http.get(`https://alanapi.azurewebsites.net/api/chat?${euser}&token=${this.token}&msg=${value}&pedido=${pedido}`).subscribe(data => {
      if (data != null && data["msg"] !== undefined) {
        callback(data["msg"]);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }
  freteMetro: number;
  telcontsp: any;
  telcontmg: any;
  validaUsuario(value, callback, callbackErro) {
    this.http.get(`https://alanapi.azurewebsites.net/api/validUser?user=${value}`).subscribe(data => {
      if (data != null && data["valid"] !== undefined) {
        callback(data["valid"]);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }
  public cliente: Client = new Client('', '', '', '', '', '', '', '')
  public pggerado: boolean = false;
  public Catalogo: string = Math.random()>0.6?'mg':'sp';
  frete: number;
  token: string;
  subCart(i: number) {
    this.list.splice(i, 1);
    this.cartList.next(this.list);
  }

 
  counter: string;
  list: Recipe[];
  count: BehaviorSubject<string>;
  CatalogoSel: BehaviorSubject<string>;
  cartList: BehaviorSubject<Recipe[]>;
  constructor(private http: HttpClient) {
    this.list = [];
    this.cartList = new BehaviorSubject(this.list);
    this.count = new BehaviorSubject(this.counter);
    this.CatalogoSel = new BehaviorSubject(this.Catalogo);
    var stDataClient = localStorage.getItem('currentUser');
    if (stDataClient !== undefined) {
      var currentUser = null;
      try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
      } catch (error) {

      }

      if (currentUser != null) {
        //valida token
        this.http.get(`https://alanapi.azurewebsites.net/api/validUser?user=${currentUser.cliente.email}&token=${currentUser.token}`).subscribe(data => {
          if (data != null && data["valid"] !== undefined && data["valid"] == true) {
            this.token = currentUser.token; // your token
            this.cliente = currentUser.cliente; // your token
          } else {
          }
        });

      }
    }
  }
  isAlterEgoTaken(alterEgo: string): Observable<boolean> {
    const isTaken = ALTER_EGOS.includes(alterEgo);
    return of(isTaken).pipe(delay(400));
  }
  postFile(fileToUpload: File,pedido,callback)  {
    const endpoint = `https://alanapi.azurewebsites.net/api/upload?user=${this.cliente.email.trim()}&token=${this.token}&pedido=${pedido}`;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name); 
    return this.http.post(endpoint, formData, { headers: {} }).subscribe((data) => {callback(data) });
       
  }
  login(usuario, senha, callback, callbackErro) {
    this.http.get(`https://alanapi.azurewebsites.net/api/login?user=${usuario}&password=${senha}`).subscribe(data => {
      if (data != null && data["cliente"] !== undefined && data["token"] !== undefined) {
        this.cliente = data["cliente"] as Client;
        this.token = data["token"];
        this.extramenu=data["extra"];
        localStorage.setItem('currentUser', JSON.stringify({ token: this.token, cliente: this.cliente }));
        callback(this.token);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }

  singin(cliente, callback, callbackErro, senha) {
    this.http.get(`https://alanapi.azurewebsites.net/api/login?&cadastro=121&email=${cliente.email.trim()}
    &telefone=${cliente.telefone.trim()}
    &nome=${cliente.nome.trim()}
    &numero=${cliente.numero.trim()}
    &endereco=${cliente.endereco.trim()}
    &cidade=${cliente.cidade.trim()}
    &secret=${senha}
    &complemento=${cliente.complemento} 
    &estado=${cliente.estado.trim()}
    &cep=${cliente.cep} `).subscribe(data => {
      if (data != null && data["cliente"] !== undefined && data["token"] !== undefined) {
        this.cliente = data["cliente"] as Client;
        this.token = data["token"];
        localStorage.setItem('currentUser', JSON.stringify({ token: this.token, cliente: this.cliente }));
        callback(this.token);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }

  deletOrder(cliente,pedido, callback, callbackErro) {
    this.http.get(`https://alanapi.azurewebsites.net/api/updateOrder?token=${this.token}&user=${cliente}&pedido=${pedido}&admin=${this.cliente.email}&delete=s&status=Finalizado`).subscribe(data => {
      if (data != null) {
        callback(this.token);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }
  cancelOrder(cliente,pedido, callback, callbackErro) {
    this.http.get(`https://alanapi.azurewebsites.net/api/updateOrder?token=${this.token}&user=${cliente}&pedido=${pedido}&admin=${this.cliente.email}&cancel=s`).subscribe(data => {
      if (data != null) {
        callback(this.token);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }
  updateOrder(cliente,pedido, callback, callbackErro) {
    this.http.get(`https://alanapi.azurewebsites.net/api/updateOrder?token=${this.token}&user=${cliente}&pedido=${pedido}&admin=${this.cliente.email}&cancel=s`).subscribe(data => {
      if (data != null) {
        callback(this.token);
      } else {
        callbackErro(data == null ? 'erro' : data["erro"]);
      }
    });
  }



  logout() {
    this.cliente = new Client('', '', '', '', '', '', '', '');
    this.token = undefined;
    localStorage.removeItem('currentUser');
  }

  handleError(e: any) {
    throw new Error('Method not implemented.');
  }
  nextCount(val) {
    this.count.next(val);
  }
  nextCatalogo(c) {
    this.CatalogoSel.next(c);
    this.Catalogo = c;
  }
  addCart(item) {
    this.list.push(item);
    this.cartList.next(this.list);
  }

}
