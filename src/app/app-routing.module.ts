import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cities', component: CitiesComponent },
  { path: 'countries', component: CountriesComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
