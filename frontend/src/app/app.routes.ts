// Define the application's route configuration
import { Routes } from '@angular/router';
import { BillsComponent } from './components/bills/bills.component';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
  // Redirect the empty path ('') to the 'bills' path as the default route
  { path: '', redirectTo: 'bills', pathMatch: 'full' },
  { path: 'bills', component: BillsComponent },
  { path: 'charts', component: ChartsComponent }
];
