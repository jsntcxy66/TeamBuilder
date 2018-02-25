import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { RoomlistComponent } from '../roomlist/roomlist.component';
import { ChatroomComponent } from '../chatroom/chatroom.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'roomlist/:uid', component: RoomlistComponent},
  { path: 'room/:rid', component: ChatroomComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];