import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TodoFormComponent } from './todo-form.component';

describe('TodoFormComponent', () => {
    let component: TodoFormComponent;
    let fixture: ComponentFixture<TodoFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
