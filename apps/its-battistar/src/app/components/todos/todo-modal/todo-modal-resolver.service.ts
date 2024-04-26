import { inject, Signal, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ITodo } from '@its-battistar/shared-types';

import { TodosStore } from '../todos.store';

export const todoModalResolverServiceFN: ResolveFn<
  Promise<Signal<ITodo> | undefined>
> = async (route: ActivatedRouteSnapshot) => {
  // const selectedTodo = inject(TodosStore).selectedTodo;

  const router = inject(Router);
  const todosStore = inject(TodosStore);

  const param = route.params['id'] as string | undefined;

  if (!param) {
    await router.navigate(['/todos']);
  }

  // look for todo, allowing navigating to it directly and preserve the page with history?
  const todo = todosStore.todos().find((todo) => todo.id === param);

  console.log('resolver', todo);

  // OLD, allowing only direct click on todo item to open modal
  // if (!selectedTodo()) {
  //   await router.navigate(['/todos']);
  //   return;
  // }
  //
  // return selectedTodo as Signal<ITodo>;

  if (!todo?.id) {
    await router.navigate(['/todos']);
  }

  return signal(todo) as Signal<ITodo>;
};
