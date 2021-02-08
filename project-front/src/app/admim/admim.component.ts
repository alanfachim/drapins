import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admim',
  templateUrl: './admim.component.html',
  styleUrls: ['./admim.component.css']
})
export class AdmimComponent implements OnInit {

  constructor(public modal: NgbActiveModal) {
    
   }
   onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
  ngOnInit(): void {
  }

}
