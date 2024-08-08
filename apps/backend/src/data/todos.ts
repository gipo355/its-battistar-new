/* eslint-disable no-magic-numbers */
import { faker } from '@faker-js/faker';

import type { ITodo } from '../api/todos/todo.entity';

export const fakeTodos: ITodo[] = [
    // {
    //     id: '1',
    //     title: 'Create a Todo app',
    //     dueDate: '2025-03-01',
    //     completed: true,
    //     createdBy: {
    //         id: '1',
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         fullName: 'John Doe',
    //         picture: 'https://somedomain.com/somepicture.png',
    //     },
    //     assignedTo: {
    //         id: '1',
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         fullName: 'John Doe',
    //         picture: 'https://somedomain.com/somepicture.png',
    //     },
    // },
    // {
    //     id: '2',
    //     title: 'Create a Todo app',
    //     dueDate: '2023-03-01',
    //     completed: false,
    //     createdBy: {
    //         id: '1',
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         fullName: 'John Doe',
    //         picture: 'https://somedomain.com/somepicture.png',
    //     },
    //     assignedTo: {
    //         id: '1',
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         fullName: 'John Doe',
    //         picture: 'https://somedomain.com/somepicture.png',
    //     },
    // },
];

for (let i = 0; i < 20; i++) {
    // const firstName = faker.person.firstName();
    // const lastName = faker.person.lastName();
    // const fullName = `${firstName} ${lastName}`;

    const dates = faker.date.betweens({
        from: new Date(2023, 0, 1),
        to: new Date(2025, 0, 1),
        count: 1,
    });

    const expired = new Date(dates[0].toLocaleString()).getTime() < Date.now();

    fakeTodos.push({
        id: faker.database.mongodbObjectId(),
        title: faker.lorem.sentence(),
        dueDate: dates[0].toLocaleString(),
        completed: faker.datatype.boolean(),
        createdBy: faker.database.mongodbObjectId(),
        expired,
        assignedTo: faker.database.mongodbObjectId(),
    });
}

// for (const todo of fakeTodos) {
//     if (!todo.dueDate) {
//         continue;
//     }
//     todo.expired = new Date(todo.dueDate).getTime() < Date.now();
// }
