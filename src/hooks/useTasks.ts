// hooks/useTasks.ts
import { useState, useCallback } from 'react';
import { Task, getTasks, createTask as createTaskService } from '@/lib/taskService';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async (): Promise<Task[]> => {
        setLoading(true);
        setError(null);
        try {
            const loadedTasks = await getTasks();
            setTasks(loadedTasks);
            return loadedTasks;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        setLoading(true);
        setError(null);
        try {
            const newTask = await createTaskService(taskData);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        loadTasks,
        createTask,
    };
}