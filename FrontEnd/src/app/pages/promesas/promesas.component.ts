import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})

export class PromesasComponent implements OnInit{

  ngOnInit(): void {
  //   const promesa = new Promise((resolve,reject)=>{

  //     if(false){
  //       resolve('hola mundo');
  //     }else{
  //       reject('algo salio mal');
  //     }
  //   });

  //   promesa.then((mensaje)=>{ 
  //     console.log(mensaje);
  //   }).catch(err=> console.log('Error en mi promesa', err));

  //   console.log('fin Init');
  this.getUsuarios().then(users => console.log(users));
  }

  getUsuarios(){
    
    return new Promise(resolve=>{
      fetch('https://reqres.in/api/users')
      .then(resp=> resp.json())
      .then(body=> resolve(body.data));
    });

  }
 
}
