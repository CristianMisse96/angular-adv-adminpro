import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  linkTheme= document.querySelector('#theme');

  constructor() {

    let actualTheme= localStorage.getItem('theme')||'./assets/css/colors/default-dark.css';

    this.linkTheme?.setAttribute('href',actualTheme);
  }

  changeTheme(tema: string) {
    const url=`./assets/css/colors/${tema}.css`;

    this.linkTheme?.setAttribute('href',url);

    localStorage.setItem('theme',url);

    this.checkCurrentTheme();
    
  }

  checkCurrentTheme(): void{

    const links: NodeListOf<Element>= document.querySelectorAll('.selector'); ;

    links.forEach(element=>{
      element.classList.remove('working');
      const btnTheme= element.getAttribute('data-theme');
      const btnThemeUrl= `./assets/css/colors/${btnTheme}.css`;
      const currentTheme= this.linkTheme?.getAttribute('href');

      if(btnThemeUrl === currentTheme){
        element.classList.add('working');
      }
    })
  }
}
