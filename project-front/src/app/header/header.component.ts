import { Component, EventEmitter, HostListener, Input, OnInit, Output, Type, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faShoppingBasket, faWrench } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdmimComponent } from '../admim/admim.component';
import { AppService } from '../appservice.service';
import { CarrinhoComponent } from '../carrinho/carrinho.component';


const MODALS: { [name: string]: Type<any> } = {
  carrinho: CarrinhoComponent,
  admin: AdmimComponent
};
@Component({
  selector: 'app-header', 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public inp: string;
  public isCollapsed;
  public token: string;
  qtitens: number;
  faShoppingBasket = faShoppingBasket;
  faWrench = faWrench;
  currentWindowWidth: boolean = false;
  searchForm: any;
  cat: string;
  constructor(private formBuilder: FormBuilder,public appsevice: AppService, private _modalService: NgbModal, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }
  onclick() {
    this.appsevice.nextCount(this.inp);
  }
  onCarrinhoClick() {
    if (this.qtitens > 0) {
      this._modalService.open(MODALS['carrinho'], { size: 'lg' });
    }
  }
  @Output()
  click = new EventEmitter();

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth > 860;
  }
onclickCatalogo(e){
  this.appsevice.nextCatalogo(e);
  this.click.emit();
}
  getstate(){
    if(this.cat=='sp')
    return ['sp','mg'];
    else
    return ['mg','sp'];
  }
  admin(id) {
    this._modalService.open(MODALS['admin']);
  }
  ngOnInit(): void {
    this.cat=this.appsevice.Catalogo;
    this.isCollapsed = false;
    this.searchForm = this.formBuilder.group({
      search: [''] 
    });
    this.currentWindowWidth = window.innerWidth > 860;
    this.appsevice.cartList.subscribe(c => {
      this.qtitens = c.length;
    })
  }

}
