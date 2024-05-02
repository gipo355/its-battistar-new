import { provideHttpClient } from '@angular/common/http';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { todosRoutes } from '../todos.routes';
import { TodoModalComponent } from './todo-modal.component';

describe('TodoModalComponent', () => {
  let component: TodoModalComponent;
  let fixture: ComponentFixture<TodoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoModalComponent],
      providers: [provideRouter(todosRoutes), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
