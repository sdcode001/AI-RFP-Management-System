import { Component} from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [DashboardComponent],
  styleUrl: './app.css'
})
export class App {
  
}
