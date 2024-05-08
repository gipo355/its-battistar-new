import { inject } from '@angular/core';
import type { CanActivateFn, CanMatchFn } from '@angular/router';
import { Router } from '@angular/router';

import { UserStore } from '../user/user.store';
import { AuthService } from './auth.service';

// TODO: check why angular not setting cookies on the client side
// https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests

// TODO: move to canmatch
export const canActivate: CanActivateFn = async function () {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const authService = inject(AuthService);
  try {
    // // route: Route,
    // // segments: UrlSegment[]
    //
    // // steps
    // // user must be authenticated to access the route
    // // if not authenticated, ask for a refresh in case a refresh token is available
    // // if response is not ok, redirect to login
    //
    // console.log('canActivate', userStore.isAuthenticated());
    //
    if (userStore.isAuthenticated()) {
      return true;
    }
    //
    const res = await authService.getRefreshToken();

    console.log('refresh token response', res);
    //
    // from(authService.getRefreshToken()).subscribe((res) => {
    //   console.log('refresh token response', res);
    //   if (res.ok) {
    //     userStore.login();
    //     return router.createUrlTree(['/dashboard']);
    //   }
    //
    //   userStore.logout();
    //   return router.createUrlTree(['/login']);
    //   // return false;
    // });
    // console.log(res);
    if (res.ok) {
      userStore.login();
      return true;
      // return router.createUrlTree(['/login']);
    }

    return router.createUrlTree(['/login']);
    // return
  } catch (error) {
    console.error('error in canActivate', error);
    userStore.logout();
    return router.createUrlTree(['/login']);
  }
};

export const canMatchAuth: CanMatchFn = async function () {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const authService = inject(AuthService);
  try {
    // // route: Route,
    // // segments: UrlSegment[]
    //
    // // steps
    // // user must be authenticated to access the route
    // // if not authenticated, ask for a refresh in case a refresh token is available
    // // if response is not ok, redirect to login
    //
    // console.log('canActivate', userStore.isAuthenticated());
    //
    if (userStore.isAuthenticated()) {
      return true;
    }
    //
    const res = await authService.getRefreshToken();

    console.log('refresh token response', res);
    //
    // from(authService.getRefreshToken()).subscribe((res) => {
    //   console.log('refresh token response', res);
    //   if (res.ok) {
    //     userStore.login();
    //     return router.createUrlTree(['/dashboard']);
    //   }
    //
    //   userStore.logout();
    //   return router.createUrlTree(['/login']);
    //   // return false;
    // });
    // console.log(res);
    if (res.ok) {
      userStore.login();
      return true;
      // return router.createUrlTree(['/login']);
    }

    return router.createUrlTree(['/login']);
    // return
  } catch (error) {
    console.log(error);
    console.error('error in canMatch', error);
    userStore.logout();
    return router.createUrlTree(['/login']);
  }
};
