import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

interface RouteParams {
  params: {
    eventId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const tasks = await ServerDB.getTasks(params.eventId);
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Task title is required' },
        { status: 400 }
      );
    }

    const { task, updatedProgress } = await ServerDB.addTask(params.eventId, body);
    return NextResponse.json({
      success: true,
      task,
      updatedProgress,
      message: 'Task added and celebration progress updated in DB',
    });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { taskId, ...updates } = body;
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const { task, updatedProgress } = await ServerDB.updateTask(params.eventId, taskId, updates);
    return NextResponse.json({
      success: true,
      task,
      updatedProgress,
      message: 'Task updated and celebration progress updated in DB',
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const { deletedId, updatedProgress } = await ServerDB.deleteTask(params.eventId, taskId);
    return NextResponse.json({
      success: true,
      deletedId,
      updatedProgress,
      message: 'Task deleted and celebration progress updated in DB',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
