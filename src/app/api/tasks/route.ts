// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId, WithId, Document } from 'mongodb';

// Define the task structure that matches our database
interface TaskDocument extends Document {
    name: string;
    lat: number;
    lng: number;
    quantity: number;
    completed: boolean;
    imageUrl: string | null;
    createdAt: Date;
    userId?: string | null;
}

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const tasks = await db.collection<TaskDocument>('tasks').find({}).sort({ createdAt: -1 }).toArray();

        // Type the task parameter properly
        const serializedTasks = tasks.map((task: WithId<TaskDocument>) => ({
            id: task._id.toString(),
            name: task.name,
            lat: task.lat,
            lng: task.lng,
            quantity: task.quantity,
            completed: task.completed,
            imageUrl: task.imageUrl,
            createdAt: task.createdAt.toISOString()
        }));

        return NextResponse.json(serializedTasks);
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const taskData = await request.json();

        if (!taskData.name?.trim()) {
            return NextResponse.json(
                { error: 'Task name is required' },
                { status: 400 }
            );
        }

        if (taskData.lat === undefined || taskData.lng === undefined) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection('tasks').insertOne({
            name: taskData.name.trim(),
            lat: taskData.lat,
            lng: taskData.lng,
            quantity: taskData.quantity || 1,
            completed: taskData.completed || false,
            imageUrl: taskData.imageUrl || null,
            createdAt: new Date()
        });

        const task = {
            id: result.insertedId.toString(),
            name: taskData.name.trim(),
            lat: taskData.lat,
            lng: taskData.lng,
            quantity: taskData.quantity || 1,
            completed: taskData.completed || false,
            imageUrl: taskData.imageUrl || null,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json(task);
    } catch (error) {
        console.error('Failed to create task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}