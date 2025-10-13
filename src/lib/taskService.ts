// lib/taskService.ts
export interface Task {
    id: string;
    name: string;
    quantity: number;
    lat: number;
    lng: number;
    createdAt: Date;
}

// Simple in-memory storage for development
let tasks: Task[] = [];
let nextId = 1;

export async function getTasks(): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...tasks]; // Return copy
}

export async function createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const newTask: Task = {
        ...taskData,
        id: `task-${nextId++}`,
        createdAt: new Date(),
    };
    tasks.push(newTask);
    return newTask;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');

    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
}

export async function deleteTask(id: string): Promise<void> {
    tasks = tasks.filter(task => task.id !== id);
}