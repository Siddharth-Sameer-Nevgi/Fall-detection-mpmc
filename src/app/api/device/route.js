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
    const devices = db.collection('devices');

    const device = await devices.findOne({ userId: new ObjectId(userId) });

    if (!device) {
      // Return default device data if none exists
      return NextResponse.json({
        deviceId: 'Not Set',
        deviceStatus: 'Offline',
        simNumber: 'Not Set',
        lastKnownLocation: 'Unknown',
        altitude: 'Unknown',
        networkStrength: 'Unknown'
      });
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error('Get device data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, deviceId, deviceStatus, simNumber, lastKnownLocation, altitude, networkStrength } = data;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('falldetection');
    const devices = db.collection('devices');

    const updateData = {
      userId: new ObjectId(userId),
      deviceId: deviceId || 'Not Set',
      deviceStatus: deviceStatus || 'Offline',
      simNumber: simNumber || 'Not Set',
      lastKnownLocation: lastKnownLocation || 'Unknown',
      altitude: altitude || 'Unknown',
      networkStrength: networkStrength || 'Unknown',
      updatedAt: new Date()
    };

    const result = await devices.updateOne(
      { userId: new ObjectId(userId) },
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Device data updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Update device data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}