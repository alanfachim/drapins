import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-header-client',
  templateUrl: './header-client.component.html',
  styleUrls: ['./header-client.component.css']
})
export class HeaderClientComponent implements OnInit {

  public inp: string;
  public isCollapsed = true;
  public token: string;
  qtitens: number;
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

  }
  meuspedidos() {

  }
  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth > 860;
  }

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth > 860;
    this.appsevice.cartList.subscribe(c => {
      this.qtitens = c.length;
    })
  }

}
