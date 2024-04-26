import { inject, Signal, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ITodo } from '@its-battistar/shared-types';

import { TodosStore } from '../todos.store';

export const todoModalResolverServiceFN: ResolveFn<
  Promise<Signal<ITodo> | undefined>
> = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const todosStore = inject(TodosStore);

  const param = route.params['id'] as string | undefined;

  if (!param) {
    await router.navigate(['/todos']);
  }

  const todo = todosStore.todos().find((todo) => todo.id === param);
  console.log('resolver', todo);

  if (!todo?.id) {
    await router.navigate(['/todos']);
    return;
  }

  todosStore.updateSelectedTodo(todo);
  console.log('Selected todo:', todosStore.selectedTodo());

  return signal(todo) as Signal<ITodo>;
};
