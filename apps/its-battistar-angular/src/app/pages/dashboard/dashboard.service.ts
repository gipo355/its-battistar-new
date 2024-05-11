import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface IMenuItem {
  icon: string;
  link: string;
  title: string;
}
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // IMP: using a service provided in root requires to inject the module in the
  // root app config
  http = inject(HttpClient);

  // TODO: move to store with signals
}
