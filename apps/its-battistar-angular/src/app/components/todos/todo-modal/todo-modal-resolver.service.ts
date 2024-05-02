import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Router } from '@angular/router';

import { TodosStore } from '../todos.store';

export const todoModalResolverServiceFN: ResolveFn<
  // old return, was providing a signal, we can pass the todo directly from resolver buit would not use store to sync the data
  // Promise<Signal<ITodo> | undefined>
  Promise<void>
> = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const todosStore = inject(TodosStore);

  const param = route.params['id'] as string | undefined;

  console.log('resolver', param);

  // guards
  if (!param) {
    await router.navigate(['/todos']);
    return;
  }

  const todo = todosStore.todos().get(param);

  // TODO: possibly error message
  if (!todo?.id) {
    await router.navigate(['/todos']);
    return;
  }

  // update state
  todosStore.setOrRemoveCurrentSelectedTodo(todo);
  return;

  // old return, was providing a signal
  // return signal(todo) as Signal<ITodo>;
};
