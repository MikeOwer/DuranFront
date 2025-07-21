import { Routes } from '@angular/router';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';

export default [
    { path: 'usuarios/lista', component: ListaUsuariosComponent },
    { path: 'usuarios/nuevo', component: UsuarioComponent },
    { path: 'usuarios/editar/:id', component: UsuarioComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
