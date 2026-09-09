import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>{{ mode() === 'login' ? 'Sign in' : 'Create account' }}</h2>

    <form (ngSubmit)="submit()">
      @if (mode() === 'register') {
        <p><input name="name" placeholder="Name" [(ngModel)]="name" required /></p>
      }
      <p><input name="email" type="email" placeholder="Email" [(ngModel)]="email" required /></p>
      <p>
        <input
          name="password"
          type="password"
          placeholder="Password (min 8)"
          [(ngModel)]="password"
          required
        />
      </p>

      <button type="submit" [disabled]="busy()">
        {{ mode() === 'login' ? 'Sign in' : 'Register' }}
      </button>
    </form>

    @if (error()) {
      <p role="alert">{{ error() }}</p>
    }

    <p>
      <button type="button" (click)="toggle()">
        {{ mode() === 'login' ? 'Need an account?' : 'Already registered?' }}
      </button>
    </p>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'login' | 'register'>('login');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  name = '';
  email = '';
  password = '';

  toggle(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.error.set(null);
  }

  submit(): void {
    this.busy.set(true);
    this.error.set(null);

    const request$ =
      this.mode() === 'login'
        ? this.auth.login(this.email, this.password)
        : this.auth.register(this.name, this.email, this.password);

    request$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Something went wrong.');
        this.busy.set(false);
      },
    });
  }
}
