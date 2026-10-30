import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const events = await ServerDB.getEvents(userId);
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events from DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Event title is required' },
        { status: 400 }
      );
    }

    const savedEvent = await ServerDB.saveEvent(body);
    return NextResponse.json({ success: true, event: savedEvent });
  } catch (error) {
    console.error('Error saving event to DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save event to database' },
      { status: 500 }
    );
  }
}
