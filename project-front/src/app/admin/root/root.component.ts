import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  pedidos:any[];
  constructor(public appsevice: AppService) { }

  ngOnInit(): void {
  }

}
