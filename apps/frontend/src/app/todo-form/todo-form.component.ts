import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    type OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AppService } from '../app.service';

@Component({
    selector: 'app-todo-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent implements OnInit {
    todoForm: FormGroup = new FormGroup({});
    appService = inject(AppService);

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.todoForm = this.fb.group({
            title: [''],
            assignedTo: [''],
            completed: [false],
            createdBy: [''],
            dueDate: [''],
            expired: [false],
            id: [''],
        });
    }

    onSubmit(): void {
        console.log(this.todoForm.value);
    }
}
