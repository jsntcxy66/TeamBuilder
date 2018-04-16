import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { RoomlistComponent } from '../roomlist/roomlist.component';
import { ChatroomComponent } from '../chatroom/chatroom.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

export const routes: Routes = [
  { path: 'login',  component: LoginComponent },
  { path: 'register',  component: RegisterComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'roomlist/:uid', component: RoomlistComponent},
  { path: 'room/:rid', component: ChatroomComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];