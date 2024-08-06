import type { Todo } from '../model/todo';

export const fakeTodos: Todo[] = [
    {
        id: '1',
        title: 'Create a Todo app',
        dueDate: '2023-03-01',
        completed: false,
        createdBy: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            picture: 'https://somedomain.com/somepicture.png',
        },
        assignedTo: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            picture: 'https://somedomain.com/somepicture.png',
        },
    },
    {
        id: '2',
        title: 'Create a Todo app',
        dueDate: '2023-03-01',
        completed: false,
        createdBy: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            picture: 'https://somedomain.com/somepicture.png',
        },
        assignedTo: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            picture: 'https://somedomain.com/somepicture.png',
        },
    },
];
