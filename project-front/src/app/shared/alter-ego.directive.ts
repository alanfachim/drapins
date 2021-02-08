import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { catchError, map } from 'rxjs/operators'; 
import { Observable, of } from 'rxjs';
import { AppService } from '../appservice.service';

@Injectable({ providedIn: 'root' })
export class UniqueAlterEgoValidator implements AsyncValidator {
  constructor(private heroesService: AppService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log(ctrl.value);
    return this.heroesService.isAlterEgoTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueAlterEgo: true } : null)),
      catchError(() => of(null))
      
    );
  }
}

@Directive({
  selector: '[appUniqueAlterEgo]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueAlterEgoValidator),
      multi: true
    }
  ]
})
export class UniqueAlterEgoValidatorDirective {
  constructor(private validator: UniqueAlterEgoValidator) {}

  validate(control: AbstractControl) {
    
    this.validator.validate(control);
  }
}

 