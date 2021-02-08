import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  name: any;
  loading: boolean=false;
  currentWindowWidth: boolean;

  
  constructor(private route: ActivatedRoute) { 
   }
   onloadfinished(){
    this.loading=false;
   }
   click(){
    this.loading=true;
   }

   @HostListener('window:resize')
   onResize() {
     this.currentWindowWidth = window.innerWidth > 860;
   }
   
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
    });
    this.currentWindowWidth = window.innerWidth > 860;
  }

}
