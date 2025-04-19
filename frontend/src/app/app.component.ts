// header and navigation bar.
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="title">
      <div class="tcontent">
        <h1>My Bills</h1>
        <nav>
          <a routerLink="/bills" routerLinkActive="active">Bills</a>
          <a routerLink="/charts" routerLinkActive="active">Charts</a>
        </nav>
      </div>
    </div>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .title {
      border-bottom: 1px solid rgb(212, 213, 214);
      color: #4b76a4;
    }

    .tcontent {
      padding: 5px;
      width: 40%;
      margin: 0 auto;
      display: flex;
      font-size: 1rem;
    }

    nav {
      margin-left: auto;
      display: flex;
      align-items: center;
    }

    nav a {
      position: relative;
      text-decoration: none;
      margin-right: 16px;
      font-size: 1.2rem;
      color: black;
    }

    nav a::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background-color: black;
      transition: width 0.3s ease;
    }

    nav a:hover::after,
    nav a.active::after {
      width: 100%;
    }

    .container {
      margin: 24px;
      width: 40%;
      margin: 0 auto;
      margin-top: 20px;
    }

    @media screen and (max-width: 1200px) {
      .container {
        width: 80%;
      }

      .tcontent {
        width: 80%;
      }
    }

  `]
})
export class AppComponent {}
