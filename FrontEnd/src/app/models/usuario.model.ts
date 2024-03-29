import { environment } from "src/environments/environment.development";

const base_url= environment.base_url;

export class Usuario{

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string,
        ) {}

    get imagenUrl(){
        if(!this.img){
            return `${base_url}/uploads/usuarios/no-image`;
        }else if(this.google){
            return this.img;
        }else if(this.img){
            return `${base_url}/uploads/usuarios/${this.img}`;
        }else{
            return `${base_url}/uploads/usuarios/no-image`;
        }
    }
}