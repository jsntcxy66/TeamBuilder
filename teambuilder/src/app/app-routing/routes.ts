import { Routes } from '@angular/router';

import { RoomlistComponent } from '../roomlist/roomlist.component';
import { ChatroomComponent } from '../chatroom/chatroom.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

export const routes: Routes = [
  { path: 'login',  component: LoginComponent },
  { path: 'register',  component: RegisterComponent },
  { path: 'roomlist', component: RoomlistComponent},
  { path: 'room', component: ChatroomComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];