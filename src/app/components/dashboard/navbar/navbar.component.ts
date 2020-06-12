import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.authService.userIsAuthenticated.subscribe(
      (isAuth) => {
        if (!isAuth) {
          this.router.navigateByUrl('sign-in');
        }
      }
    );
  }

  onLogout() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
