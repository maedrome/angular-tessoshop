import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FrontNavbarComponent } from "../../components/front-navbar/front-navbar.component";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterModule, FrontNavbarComponent],
  templateUrl: './store-front-layout.component.html',
})
export default class StoreFrontLayoutComponent { }
