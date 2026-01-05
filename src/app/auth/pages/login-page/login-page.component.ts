import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent { 
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  hasError = signal(false);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  myForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)], []],
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
          return 'Password must be more than 6 characters';
        case 'pattern':
          if(errors['pattern'].requiredPattern === this.emailPattern) return 'The email address entered is invalid'
      }
    }
    return null
  }
  onSubmit = () => {
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }
    const { email='', password='' } = this.myForm.value;
    console.log({ email, password});
    this.myForm.reset();
    this.authService.login(email!,password!).subscribe((isAuthenticated)=>{
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
