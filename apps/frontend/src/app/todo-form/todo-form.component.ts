/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    type OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { AppService } from '../app.service';
import { inputIsMongoDbID } from '../shared/inputIsMongodb';

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
            title: [
                '',
                [
                    Validators.required.bind(Validators).bind(this),
                    Validators.minLength(3).bind(this),
                ],
            ],
            assignedTo: [
                '',
                [Validators.required.bind(this), inputIsMongoDbID().bind(this)],
            ],
            dueDate: [
                '',
                [
                    Validators.required.bind(this),
                    // 2024-08-16
                    Validators.pattern(
                        '^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$'
                    ).bind(this),
                ],
            ],
        });
    }

    onSubmit(): void {
        console.log(this.todoForm.value);
    }
}
