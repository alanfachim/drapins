import { HttpClient } from '@angular/common/http';
/* tslint:disable: member-ordering forin */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteComponent, AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AppService } from 'src/app/appservice.service';
import { UniqueAlterEgoValidator } from 'src/app/shared/alter-ego.directive';
import { forbiddenNameValidator } from 'src/app/shared/forbidden-name.directive';
import { identityRevealedValidator } from 'src/app/shared/identity-revealed.directive';

@Component({
  selector: 'app-hero-form-reactive',
  templateUrl: './dados-cliente.component.html',
  styleUrls: ['./dados-cliente.component.css'],
})
export class DadosClienteComponent implements OnInit {

  @ViewChild(AutocompleteComponent) ccomp: AutocompleteComponent;
  public selecionado: boolean = false;
  public manual: boolean = false;

  getdata() {
    var cliente = {
      email: this.clienteForm.get('email').value,
      telefone: this.clienteForm.get('telefone').value,
      endereco: this.clienteForm.get('endereco').value,
      cidade: this.clienteForm.get('cidade').value,
      estado: this.clienteForm.get('estado').value,
      numero: this.clienteForm.get('numero').value,
      nome: this.clienteForm.get('nome').value,
      complemento: this.clienteForm.get('complemento').value,
      senha: this.clienteForm.get('senha').value,
      cep: this.clienteForm.get('cep').value
    };
    this.appsevice.cliente = cliente;

    return cliente;
  }
  @Output() onstatus = new EventEmitter();

  public clienteForm: FormGroup;

  public invalidUser = false;
  keyword = 'name';
  public data = [
    {
      id: 1,
      name: 'Nenhuma Sugestão',
      names: 'Nenhuma Sugestão',
      info: {}
    }
  ];
  public vvl = ''

  validaUsuario() {
    if (this.clienteForm.get('email').valid) {
      this.appsevice.validaUsuario(this.clienteForm.get('email').value, (value) => {
        this.invalidUser = value;
        if (value) {
          this.data = [];
          this.ccomp.setInitialValue('');
        }
      }, (erro) => { });
    }
  }

  selectEvent(item) {

    if (item.info.streetName == undefined) {
      this.manual = true;
      this.selecionado = true;
      this.clienteForm.get('endereco').setValue(item.name);
      return;
    }
    this.ccomp.initialValue = ' ';
    if (!item.info)
      return;
    this.ccomp.setInitialValue(item.info.streetName);
    this.clienteForm.get('endereco').setValue(item.info.streetName);
    if (item.info.municipality !== undefined) {
      this.clienteForm.get('cidade').setValue(item.info.municipality);
    };
    if (item.info.countrySubdivision !== undefined) {
      this.clienteForm.get('estado').setValue(item.info.countrySubdivision);
    };
    if (item.info.extendedPostalCode !== undefined) {
      this.clienteForm.get('cep').setValue(item.info.extendedPostalCode.split(',')[0]);
    };
    if (item.info.streetNumber !== undefined) {
      this.clienteForm.get('numero').setValue(item.info.streetNumber);
    };


    this.selecionado = true;
  }

  onChangeSearch(val: string) {
    if (val.length < 8)
      return;
    if (this.invalidUser) {
      this.data = [];
      return;
    }
    this.data = [];
    if (this.data.length == 0) {
      this.data.push({
        id: 1,
        name: '$ld',
        info: {},
        names: 'Nenhuma Sugestão'
      });
    }
    this.http.get(`https://atlas.microsoft.com/search/address/json?subscription-key=p8g8Ec3ibaRD3lAuzYCxWjYF4zJoIeNU6moivv3pFJ8&api-version=1.0&query=${val}&limit=3&countrySet=BR`)
      .subscribe((data) => {
        this.data = [];
        data["results"].forEach((element, i) => {
          try {
            if (element !== undefined && element.address !== undefined && element.address.streetName !== undefined && element.address.municipality !== undefined) {

              if (element.address.streetNumber === undefined) {
                this.data.push({ name: `${element.address.streetName}, ${element.address.municipality}`, id: i, info: element.address, names: `${element.address.streetName}` })
              } else {
                this.data.push({ name: `${element.address.streetName},${element.address.streetNumber} - ${element.address.municipality}`, id: i, info: element.address, names: `${element.address.streetName}` })
              }

            }
          } catch (e) {
            console.log(e);
          }


        });
        if (val.length == 0) {

          this.data.push({
            id: 1,
            name: "Insira seu endereço",
            info: {},
            names: "Insira seu endereço"
          });

        } else {
          var nameRe: RegExp = /[a-záàâãéèêíïóôõöúçñ ]{4,60}/i;
          if (nameRe.test(val)) {
            this.data.push({
              id: 1,
              name: val,
              info: {},
              names: val
            });
          } else {
            this.data.push({
              id: 1,
              name: "Digitar Manualmente",
              info: {},
              names: "Digitar Manualmente"
            });
          }

        }

      });


    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    this.ccomp.searchInput.nativeElement.setAttribute("autocomplete", "new-password")
  }

  ngOnInit(): void {


    this.clienteForm = new FormGroup({
      nome: new FormControl(this.appsevice.cliente.nome, [
        Validators.required,
        Validators.minLength(8),
        forbiddenNameValidator(/[a-záàâãéèêíïóôõöúçñ ]{4,20}/i)
      ]),
      email: new FormControl(this.appsevice.cliente.email, [
        Validators.required,
        Validators.minLength(8),
        forbiddenNameValidator(/[A-Za-z0-9_.]*@[a-zA-Z0-9]{1,15}\.[a-z.]{1,8}/i)
      ]),
      telefone: new FormControl(this.appsevice.cliente.telefone, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        forbiddenNameValidator(/(\([0-9]{2,3}\)[0-9]{8,9}|[0-9]{10,11})$/m)
      ]),
      senha: new FormControl('', [
        Validators.required
      ]),
      confsenha: new FormControl('', [
        Validators.required
      ]),
      endereco: new FormControl(this.appsevice.cliente.endereco, [
        Validators.required,
        Validators.minLength(8),
        forbiddenNameValidator(/[a-záàâãéèêíïóôõöúçñ ]{4,60}/i)
      ]),
      numero: new FormControl(this.appsevice.cliente.numero, [
        Validators.required,
        Validators.maxLength(5),
        forbiddenNameValidator(/[0-9\-]{1,4}/i)
      ]),
      cidade: new FormControl(this.appsevice.cliente.cidade, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/[a-záàâãéèêíïóôõöúçñ ]{4,20}/i)
      ]),
      complemento: new FormControl(this.appsevice.cliente.complemento),
      estado: new FormControl(this.appsevice.cliente.estado, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/[a-záàâãéèêíïóôõöúçñ ]{4,20}/i)
      ]),
      cep: new FormControl(this.appsevice.cliente.cep, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        forbiddenNameValidator(/[0-9\-]{8,10}/i)
      ])
    }, { validators: identityRevealedValidator });
    this.clienteForm.statusChanges.subscribe(
      result => this.onstatus.emit(result)
    );

  }

  get email() { return this.clienteForm.get('email'); }

  get telefone() { return this.clienteForm.get('telefone'); }

  get endereco() { return this.clienteForm.get('endereco'); }
  get senha() { return this.clienteForm.get('senha'); }
  get confsenha() { return this.clienteForm.get('confsenha'); }
  get cidade() { return this.clienteForm.get('cidade'); }
  get estado() { return this.clienteForm.get('estado'); }
  get cep() { return this.clienteForm.get('cep'); }
  get numero() { return this.clienteForm.get('numero'); }
  get nome() { return this.clienteForm.get('nome'); }




  constructor(private alterEgoValidator: UniqueAlterEgoValidator, private http: HttpClient, private appsevice: AppService) { }
}
