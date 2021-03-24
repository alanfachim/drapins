import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  public inp: string;
  public isCollapsed = true;
  public token: string;
  qtitens: number;

  @Output()
  onchange = new EventEmitter();
  
  currentWindowWidth: boolean = false;
  constructor(public appsevice: AppService, private _modalService: NgbModal, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }
  onclick() {
    this.appsevice.nextCount(this.inp);
  }
  onCarrinhoClick() {

  }
  meusdados() {
    this.onchange.emit(2);
    console.log('teste');
  }
  meuspedidos() {
    this.onchange.emit(1);
  }
  stoquemg(){
    this.onchange.emit(3);
  }
  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth > 860;
  }

  ngOnInit(): void {
    console.log('teste');
    
    this.currentWindowWidth = window.innerWidth > 860;
    this.appsevice.cartList.subscribe(c => {
      this.qtitens = c.length;
    })
  }

}
