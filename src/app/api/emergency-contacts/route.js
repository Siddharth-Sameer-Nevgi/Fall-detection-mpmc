import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('falldetection');
    const contacts = db.collection('emergency_contacts');

    const userContacts = await contacts.find({ userId: new ObjectId(userId) }).toArray();

    return NextResponse.json({ contacts: userContacts });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, name, phoneNumber } = await request.json();

    if (!userId || !name || !phoneNumber) {
      return NextResponse.json({ 
        error: 'User ID, name, and phone number are required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('falldetection');
    const contacts = db.collection('emergency_contacts');

    const newContact = {
      userId: new ObjectId(userId),
      name,
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await contacts.insertOne(newContact);

    return NextResponse.json({
      message: 'Emergency contact added successfully',
      contact: { ...newContact, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contactId');
    const userId = searchParams.get('userId');

    if (!contactId || !userId) {
      return NextResponse.json({ 
        error: 'Contact ID and User ID are required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('falldetection');
    const contacts = db.collection('emergency_contacts');

    const result = await contacts.deleteOne({ 
      _id: new ObjectId(contactId),
      userId: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}