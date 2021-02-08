import { Component, OnInit } from '@angular/core';
import { Ingridient } from '../shared/ingridients.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingridients : Ingridient[] = [
    new Ingridient('fgdfg',2)
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
