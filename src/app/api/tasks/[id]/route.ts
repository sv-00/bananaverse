// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId, WithId, Document } from 'mongodb';

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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const updates = await request.json();
        const { db } = await connectToDatabase();

        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
        }

        const result = await db.collection('tasks').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = await db.collection<TaskDocument>('tasks').findOne({ _id: new ObjectId(params.id) });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const serializedTask = {
            id: task._id.toString(),
            name: task.name,
            lat: task.lat,
            lng: task.lng,
            quantity: task.quantity,
            completed: task.completed,
            imageUrl: task.imageUrl,
            createdAt: task.createdAt.toISOString()
        };

        return NextResponse.json(serializedTask);
    } catch (error) {
        console.error('Failed to update task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { db } = await connectToDatabase();

        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
        }

        const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}