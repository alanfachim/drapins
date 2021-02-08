import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component'; 
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { RecipesItemComponent } from './recipes/recipes-list/recipes-item/recipes-item.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { PagamentosComponent } from './carrinho/pagamentos/pagamentos.component';
import { DadosClienteComponent } from './carrinho/dados-cliente/dados-cliente.component';
import { ExtratoComponent } from './carrinho/extrato/extrato.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CarrinhoListaComponent } from './carrinho/carrinho-lista/carrinho-lista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdmimComponent } from './admim/admim.component'; 
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AppRoutingModule } from './app-roting.module'; 
import { ClienteComponent } from './cliente/cliente.component';
import { MeusPedidosComponent } from './cliente/meus-pedidos/meus-pedidos.component';
import { MeusPedidosListaComponent } from './cliente/meus-pedidos/meus-pedidos-lista/meus-pedidos-lista.component';
import { MeusPedidosPagamentosComponent } from './cliente/meus-pedidos/meus-pedidos-pagamentos/meus-pedidos-pagamentos.component';
import { MeusPedidosStatusComponent } from './cliente/meus-pedidos/meus-pedidos-status/meus-pedidos-status.component';
import { LoginComponent } from './cliente/login/login.component';
import { CommonModule } from '@angular/common';
import { CarrinhoEntregaComponent } from './carrinho/carrinho-entrega/carrinho-entrega.component';
import { ClienteChatComponent } from './cliente/cliente-chat/cliente-chat.component';
import { MeusPedidosPagamentosXsComponent } from './cliente/meus-pedidos/meus-pedidos-pagamentos-xs/meus-pedidos-pagamentos-xs.component';
 
import { HeaderClientComponent } from './cliente/header-client/header-client.component';
import { RootComponent } from './admin/root/root.component';
import { AdminComponent } from './admin/admin.component';

 

@NgModule({
  declarations: [AppComponent, MeusPedidosComponent,MeusPedidosPagamentosComponent, MeusPedidosListaComponent,  HeaderComponent, ClienteComponent,RecipesComponent, ShoppingListComponent, ShoppingEditComponent, RecipesListComponent, RecipesDetailComponent, RecipesItemComponent, CarrinhoComponent, PagamentosComponent, DadosClienteComponent, ExtratoComponent, CarrinhoListaComponent, AdmimComponent, MeusPedidosStatusComponent, LoginComponent, CarrinhoEntregaComponent, ClienteChatComponent, MeusPedidosPagamentosXsComponent,   HeaderClientComponent, RootComponent, AdminComponent],
  imports: [CommonModule , BrowserModule, FormsModule, HttpClientModule,NgbModule,FontAwesomeModule,QRCodeModule,ReactiveFormsModule, AutocompleteLibModule,AppRoutingModule,NgbNavModule],
  providers: [NgbActiveModal], 
  bootstrap: [AppComponent]
})
export class AppModule {}

