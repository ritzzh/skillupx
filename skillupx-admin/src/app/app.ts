import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('skillupx-admin');


  ngOnInit() {
    console.log("PRODUCTION:", environment.production);
    console.log("API URL:", environment.apiUrl);
  }
}
