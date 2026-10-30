import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

interface RouteParams {
  params: {
    eventId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const event = await ServerDB.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found in database' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const updated = await ServerDB.saveEvent({ ...body, id: params.eventId });
    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event in database' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const result = await ServerDB.deleteEvent(params.eventId);
    return NextResponse.json({
      success: true,
      message: 'Celebration permanently deleted from database',
      deletedId: result.deletedId,
    });
  } catch (error) {
    console.error('Error deleting event from DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event from database' },
      { status: 500 }
    );
  }
}
