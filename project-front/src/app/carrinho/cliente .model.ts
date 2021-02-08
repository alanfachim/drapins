import { FormControl } from "@angular/forms";

export class Cliente {
    public pedido: string;
    public quantidade: string;
    public email: FormControl = new FormControl('');
    public telefone: FormControl = new FormControl('');
    public cidade: FormControl = new FormControl('');
    public estado: FormControl = new FormControl('');
    public cep: FormControl = new FormControl('');
    public endereco: FormControl = new FormControl('');

    constructor() {
    }

}