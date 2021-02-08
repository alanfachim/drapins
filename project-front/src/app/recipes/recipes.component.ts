import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  name: any;
  loading: boolean = false;
  currentWindowWidth: boolean;
  deviceType: string;
  breakpoints = {
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1200
  }

  constructor(private route: ActivatedRoute) {
  }
  onloadfinished() {
    this.loading = false;
  }
  click() {
    this.loading = true;
  }

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth > 860;
    
    this.deviceType =
      window.innerWidth >= this.breakpoints.xl
        ? 'xl'
        : window.innerWidth >= this.breakpoints.lg
          ? 'lg'
          : window.innerWidth >= this.breakpoints.md
            ? 'md'
            : window.innerWidth >= this.breakpoints.sm
              ? 'sm'
              : 'xs';
  }

  ngOnInit(): void {
    this.deviceType =
      window.innerWidth >= this.breakpoints.xl
        ? 'xl'
        : window.innerWidth >= this.breakpoints.lg
          ? 'lg'
          : window.innerWidth >= this.breakpoints.md
            ? 'md'
            : window.innerWidth >= this.breakpoints.sm
              ? 'sm'
              : 'xs';
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
    });
    this.currentWindowWidth = window.innerWidth > 860;
  }

}
