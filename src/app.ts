interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

class TodoApp {
    private todos: Todo[] = [];
    private nextId: number = 1;
    private todoInput: HTMLInputElement;
    private addBtn: HTMLButtonElement;
    private todoList: HTMLUListElement;

    constructor() {
        this.todoInput = document.getElementById('todoInput') as HTMLInputElement;
        this.addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        this.todoList = document.getElementById('todoList') as HTMLUListElement;
        
        this.init();
    }

    private init(): void {
        this.loadFromLocalStorage();
        this.bindEvents();
        this.render();
    }

    private bindEvents(): void {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    private addTodo(): void {
        const text = this.todoInput.value.trim();
        if (text === '') return;

        const newTodo: Todo = {
            id: this.nextId++,
            text: text,
            completed: false
        };

        this.todos.push(newTodo);
        this.todoInput.value = '';
        this.saveToLocalStorage();
        this.render();
    }

    private deleteTodo(id: number): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    private toggleTodo(id: number): void {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    private render(): void {
        this.todoList.innerHTML = '';

        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" data-id="${todo.id}">削除</button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const deleteBtn = li.querySelector('.delete-btn') as HTMLButtonElement;

            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('nextId', this.nextId.toString());
    }

    private loadFromLocalStorage(): void {
        const todosData = localStorage.getItem('todos');
        const nextIdData = localStorage.getItem('nextId');

        if (todosData) {
            this.todos = JSON.parse(todosData);
        }

        if (nextIdData) {
            this.nextId = parseInt(nextIdData, 10);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});