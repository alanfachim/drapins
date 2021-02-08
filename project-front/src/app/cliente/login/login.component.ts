import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppService } from 'src/app/appservice.service';
import { DadosClienteComponent } from 'src/app/carrinho/dados-cliente/dados-cliente.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  login: boolean = true;
  error: string='';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private appsevice: AppService
  ) {
    // redirect to home if already logged in
    //if (this.accountService.userValue) {
    //    this.router.navigate(['/']);
    // }
  }
  @ViewChild(DadosClienteComponent) ccomp: DadosClienteComponent;
  onregclick() {
    this.login = false;
    this.error='';
  }
  onloginclick() {
    this.login = true;
    this.error='';
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      if (params["action"] !== undefined) {


      }
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  submitFormValid(evt) {
    if (this.ccomp.clienteForm.invalid) {
      return;
    }

    this.loading = true;
    this.appsevice.singin(this.ccomp.getdata(), data => {
      alert('Usuário cadastrado por favor verifique seu email para obter a senha de acesso!' );
      this.router.navigate([this.returnUrl]);
    }, error => {
      this.loading = false;
      this.error=error
    },this.ccomp.getdata().senha);
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit 

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.appsevice.login(this.f.username.value, this.f.password.value, data => {
      this.router.navigate([this.returnUrl]);
    }, error => {
      this.loading = false;
      this.error=error;
    });
  }
}

