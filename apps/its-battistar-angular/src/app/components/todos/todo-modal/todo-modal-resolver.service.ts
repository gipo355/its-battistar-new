import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';

import { TodosStore } from '../todos.store';

export const todoModalResolverServiceFN: ResolveFn<
  // old return, was providing a signal, we can pass the todo directly from resolver buit would not use store to sync the data
  // Promise<Signal<ITodo> | undefined>
  Promise<void>
> = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const todosStore = inject(TodosStore);

  const param = route.params['id'] as string | undefined;

  // guards
  if (!param) {
    await router.navigate(['/todos']);
  }

  const todo = todosStore.todos().find((todo) => todo.id === param);

  if (!todo?.id) {
    await router.navigate(['/todos']);
    return;
  }

  // update state
  todosStore.updateCurrentSelectedTodo(todo);
  return;

  // old return, was providing a signal
  // return signal(todo) as Signal<ITodo>;
};
