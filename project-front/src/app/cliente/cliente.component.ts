import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../appservice.service';



@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  public invalid: boolean = true;
  public activeId: number = 1;
  public pedidos: any;
  public pedido: string = "";
  name: any;
  cliente: any;

  submit(nav: NgbNav) {
  }

  constructor(private http: HttpClient,private route: ActivatedRoute, public appsevice: AppService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name =  ''; 
      this.http.get(`https://alanapi.azurewebsites.net/api/getOrder?user=${params['user']}&token=${params['token']} `)
      .subscribe((data) => { 
        if(!data){
          window.location.href =`./login?user=${params['user']}&action=order`
        }
        this.pedidos=data["pedido"];
        this.cliente=data["cliente"];
        
      },err => console.log(err));

    });
  }

}
