import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  providers:[TitleCasePipe],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent { 
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  titleCasePipe = inject(TitleCasePipe);
  hasError = signal(false);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  myForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)], []],
    fullName: ['',[Validators.required, Validators.pattern(this.namePattern), Validators.minLength(6)], []],
    password: [null,[Validators.required, Validators.minLength(6)],[]]
  });

  isValidField = (fieldName:string):(boolean | null) => {
	  return !!this.myForm.get(fieldName)?.errors && !!this.myForm.get(fieldName)?.touched
  }

  getFieldError = (fieldName:string): string | null => {
    if(!this.myForm.get(fieldName)) return null;
    const errors = this.myForm?.get(fieldName)?.errors ?? {};
    for (const key of Object.keys(errors)){
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `${this.titleCasePipe.transform(fieldName)} must be more than 6 characters`;
        case 'pattern': {
          if(errors['pattern'].requiredPattern === this.emailPattern) return 'The email address entered is invalid';
          if(errors['pattern'].requiredPattern == this.namePattern) return 'Full name should contain at least two words.'
          return 'Invalid pattern'
        }
      }
    }
    return null
  }
  onSubmit = () => {
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }
    const { email='', fullName= '', password='' } = this.myForm.value;
    this.myForm.reset();
    this.authService.register(email!, fullName!, password!).subscribe((isAuthenticated)=>{
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000)
    })
  }
}
