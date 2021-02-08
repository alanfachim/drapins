import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';
import { Recipe } from 'src/app/recipes/recipes.model';

@Component({
  selector: 'app-carrinho-lista',
  templateUrl: './carrinho-lista.component.html',
  styleUrls: ['./carrinho-lista.component.css']
})
export class CarrinhoListaComponent implements OnInit {
  listaCarrinho: Recipe[] = [];
  public pggerado:boolean=false;
  constructor(public appsevice: AppService) { }
deleta(i){
  this.appsevice.subCart(i)
   
}
  ngOnInit(): void {
    
    this.appsevice.cartList.subscribe(c => {
      this.listaCarrinho = c; 
  });
} 
}
