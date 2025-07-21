import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../layout/service/auth.service';
import { NavigationService } from '../../layout/service/navigation.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 pt-6 pb-10 px-8 sm:px-20" style="border-radius: 53px">
                        <img src="assets/img/ad.png" class="logo-login" alt="">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">¡Bienvenido !</div>
                            <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                        </div>

                        <form [formGroup]="formLogin" (ngSubmit)="onSubmitLogin()">
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" formControlName="email_usuario" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" formControlName="password"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <!-- <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div> -->
                                <!-- <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span> -->
                            </div>
                            <p-button label="Iniciar sesión" styleClass="w-full" type="submit"></p-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {

    formLogin!: FormGroup;
    checked: boolean = false;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private navigationService: NavigationService
    ) {

    }

    ngOnInit() {
        this.formLogin = this.fb.group({
            email_usuario: new FormControl('', Validators.required),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ]),
        });
        if (this.authService.isAuthenticated()) {
            //const lastRoute = this.navigationService.getLastRoute();
           // this.router.navigate([lastRoute]);
        }
    }

    /* async onSubmitLogin() {
        try {
            await this.authService.login(this.formLogin.value.usuario, this.formLogin.value.password);
            const lastRoute = this.navigationService.getLastRoute();
            this.router.navigate([lastRoute]);
        } catch (err) {
            //this.error = 'Correo o contraseña incorrectos';
        }
    } */

     onSubmitLogin() {
        if (this.formLogin.invalid) return;
        console.log('Form submitted:', this.formLogin.value);
        this.authService.login(
            this.formLogin.value.email_usuario,
            this.formLogin.value.password
        ).subscribe({
            next: () => {
                this.authService.getProfile().subscribe(()=>{
                    console.log('user:',this.authService.getUser);
                    const lastRoute = this.navigationService.getLastRoute();
                    this.router.navigate([lastRoute]);
                }) 
                /* const lastRoute = this.navigationService.getLastRoute();
                this.router.navigate([lastRoute]); */
            },
            error: (err) => {
                this.errorMessage = 'Usuario o contraseña incorrectos';
                console.error('Error en login:', err);
            }
        });
    }

    /* onSubmitLogin(){
        this.authService.login2(this.formLogin.value.usuario, this.formLogin.value.password).subscribe({

            next: (response: any) => {
                console.log('Login response:', response);
    
               
            },
            error: (error) => {
                if (error.status === 401) {
                    this.errorMessage = error.error.status?.message || 'Error de autenticación';
                } else {
                    console.error('Error en login:', error);
                }
            }
        });
    } */

}
