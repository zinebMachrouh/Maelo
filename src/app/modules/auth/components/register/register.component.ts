import {Component, importProvidersFrom, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private readonly router = inject(Router);

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      isAdmin: [false],
      isUser: [false],
    });

  }

  ngOnInit(): void {}

  onRegister(): void {
    const { username, password, password_confirmation, isAdmin, isUser } = this.registerForm.value;
    const roles = [];
    if (isAdmin) roles.push('ADMIN');
    if (isUser) roles.push('USER');

    const payload = { username, password, roles };

    if (password !== password_confirmation) {
      alert('Password and confirm password do not match.');
      return;
    }else if (this.authService.register(payload)){
      this.router.navigate(['/login']);
    }else{
      alert('Registration failed.');
    }
  }
}
