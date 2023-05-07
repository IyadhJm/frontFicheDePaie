import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AppService } from '../demo/service/loginService';

import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
 
})

export class LoginComponent implements OnInit {
  submitted = false;
    login = {
      username: '',
      password: ''
    };
    errorMessage = '';
  
    constructor(private service: AppService, private router: Router) {}
  ngOnInit(): void {
    
  }
  
    onSubmit(): void {
      this.service.login(this.login.username, this.login.password)
        .subscribe(() => {
          this.router.navigate(['/home']);
        }, (error) => {
          this.errorMessage = 'Invalid username or password';
          console.error(error);
        });
    }
  
  }
  







  





