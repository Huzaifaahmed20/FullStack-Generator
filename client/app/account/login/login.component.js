// @flow
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

type User = {
    firstName: String;
    lastName: String;
    email: string;
    password: string;
};

@Component({
    selector: 'login',
    template: require('./login.html'),
})
export class LoginComponent {
    user: User = {
        firstName: "",
        lastName: "",
        email: '',
        password: '',
    };
    errors = {login: undefined};
    submitted = false;
    AuthService;
    Router;


    static parameters = [AuthService, Router];
    constructor(_AuthService_: AuthService, router: Router) {
        this.AuthService = _AuthService_;
        this.Router = router;
    }

    login(form) {
        if(form.invalid) return;

        return this.AuthService.login({
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Logged in, redirect to home
                this.Router.navigateByUrl('/home');
            })
            .catch(err => {
                this.errors.login = err.json().message;
            });
    }
}