import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  // OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  // ActivatedRouteSnapshot
} from '@angular/router';

// import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  // eslint-disable-next-line no-magic-numbers
  path = this.route.snapshot.url[0]?.path;

  // TODO: put in config
  loginPath = 'http://localhost:3000/auth/login';
  signupPath = 'http://localhost:3000/auth/signup';

  name = 'Login';
}
