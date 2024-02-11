import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn: ElementRef;
  formSubmited:boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    password: ['', [Validators.required]],
    remember: [false]
    
  });
  
  constructor(private router: Router,
              private fb: FormBuilder,
              private ngZone: NgZone,
              private usuarioService: UsuarioService) {
    
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: '846644197421-2bioepkk83uvpavfuc575ebd7ndmu0d1.apps.googleusercontent.com',
      callback: (response)=> this.handleCredentialResponse(response)
    });
    
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );

    
  }

  handleCredentialResponse(response:any){
    
    this.usuarioService.loginGoogle(response.credential)
          .subscribe({
            next: ()=>this.ngZone.run(()=>{this.router.navigateByUrl('/')}) //(resp)=> console.log({login: resp}),
          })
  }

  login() {

   this.usuarioService.login(this.loginForm.value)
    .subscribe({
      next: (resp)=> {
        if(this.loginForm.get('remember').value){
          localStorage.setItem('email', this.loginForm.get('email').value);
        }else{
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');
      },
      error: (err)=> Swal.fire('Error',err.error.msg, 'error'),
    })
   
  }

}
