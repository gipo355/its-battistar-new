import { inject, Signal } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ITodo } from '@its-battistar/shared-types';

import { TodosStore } from '../todos.store';

export const todoModalResolverServiceFN: ResolveFn<
  Promise<Signal<ITodo> | undefined>
> = async () =>
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot
  {
    const selectedTodo = inject(TodosStore).selectedTodo;

    const router = inject(Router);

    if (!selectedTodo()) {
      await router.navigate(['/todos']);
      return;
    }

    return selectedTodo as Signal<ITodo>;
  };
