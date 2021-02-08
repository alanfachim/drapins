import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Type } from '@angular/core';
import { Recipe } from '../recipes.model';
import { HttpClient } from '@angular/common/http';
import { AppService } from "../../appservice.service";
import { faCoffee, faShoppingCart, faSort } from '@fortawesome/free-solid-svg-icons';
import { AdmimComponent } from 'src/app/admim/admim.component'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
const MODALS: {[name: string]: Type<any>} = {
  admin: AdmimComponent 
};

@Component({
  selector: 'app-recipes-list',

  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})


export class RecipesListComponent implements OnInit  {
  
  recipes: Recipe[] = [];
  classes = [];
  recipes_orig: Recipe[] = [];
  message: string;
  faSort = faSort;
  faShoppingCart = faShoppingCart;
  dados: any; 
  token: string;
  @Output()
  onload = new EventEmitter();
  constructor(private http: HttpClient, public appsevice: AppService,private _modalService: NgbModal,private route: ActivatedRoute, private cdref: ChangeDetectorRef) {
   
   }

  ngOnInit(): void {
    this.appsevice.count.subscribe(c => {
      this.recipes = this.recipes_orig.filter(function (obj) {
        return obj.url.toLocaleLowerCase().includes(c.toLocaleLowerCase());
      });
      this.classes = [];
      this.classes.push(this.recipes);
    })
    this.appsevice.CatalogoSel.subscribe(c => {
      this.http.get(`https://alanfachim.blob.core.windows.net/d${c ? c : 'sp'}/data.js?${Date.now()}`)
        .subscribe((data) => {
          this.dados =data["parametros"];
          this.recipes = data["produtos"] as Recipe[];
          this.recipes_orig = this.recipes;
          this.classes = [];
          this.classes.push(this.recipes); 
          this.appsevice.frete=data["parametros"].frete
          this.appsevice.freteMetro=data["parametros"].fretemetro
          this.appsevice.telcontsp=data["parametros"].telcontsp
          this.appsevice.telcontmg=data["parametros"].telcontmg
          this.onload.emit();
        });

    })
  } 
  getclass(clArray: any[],ix:number): string {
    
    var i=<Recipe[]>clArray[ix>=(clArray.length-1)?clArray.length-1:ix] ;
    if (i.length > 0   && i.length <this.recipes_orig.length) {
      var c=i[0].SKU.match(/[A-Z]{1,3}/g)[0];
      try {
        var par = <any[]> this.dados["classificacao"];        
        var res= par.find(x=>x[c]!==undefined)[c]; 
        return decodeURI(res);
      } catch (error) {
        return c;
      } 
    }
    return '';
  }
  onSortSelect(val) {
    var array = [];
    switch (val) {
      case 1://mais barato para o mais caro
        array = this.recipes.sort(function (a, b) {
          return Number(a.valor.replace(/[^0-9,.-]+/g, ""))- Number(b.valor.replace(/[^0-9,.-]+/g, ""));
        });
        this.classes = [];
        this.classes.push(array);
        break;
      case 2://maior estoque
        array = this.recipes.sort(function (a, b) {
          return Number(b.qt) - Number(a.qt);
        });
        this.classes = [];
        this.classes.push(array);
        break;
      case 3://SKU 
        array = this.recipes.sort(function (a, b) {
          return a.SKU.localeCompare(b.SKU);
        });
        this.classes = [];
        this.classes = this.classificar(array);
        break;
      case 4://Popularidade
        array = this.recipes.sort(function (a, b) {
          return Number(b.pop) - Number(a.pop);
        });
        this.classes = [];
        this.classes.push(array);
        break;
    }

  }
  classificar(array: any[]): any[] {
    var r: Recipe[] = [];
    var c: any[] = []
    var old: string = '';
    array.forEach(function (i, x) {
      if (i.SKU.match(/[A-Z]{1,3}/g)[0] == old) {
        r.push(i);
      } else {
        c.push(r);
        old = i.SKU.match(/[A-Z]{1,3}/g)[0] ;
        r = [];
        r.push(i);
      }
    });
    return c;
  }
  geturl(url) {
    return url;
  }
}
