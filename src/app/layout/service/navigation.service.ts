import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

/**
 * @description
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private lastRoute: string = '/dashboard';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;

      const excludedRoutes = ['/auth/login', '/auth/error', '/auth/access', '/notfound'];

      if (!excludedRoutes.includes(url)) {
        this.lastRoute = url;
        localStorage.setItem('lastRoute', this.lastRoute);
      }
    });
  }

  getLastRoute(): string {
    return localStorage.getItem('lastRoute') || '/dashboard';
  }

}
