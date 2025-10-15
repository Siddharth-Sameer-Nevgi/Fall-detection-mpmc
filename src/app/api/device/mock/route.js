import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Generate mock device data
    const mockData = {
      userId: new ObjectId(userId),
      deviceId: `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      deviceStatus: ['Online', 'Offline', 'Idle'][Math.floor(Math.random() * 3)],
      simNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      lastKnownLocation: [
        '40.7128° N, 74.0060° W (New York)',
        '34.0522° N, 118.2437° W (Los Angeles)',
        '41.8781° N, 87.6298° W (Chicago)',
        '29.7604° N, 95.3698° W (Houston)',
        '25.7617° N, 80.1918° W (Miami)'
      ][Math.floor(Math.random() * 5)],
      altitude: `${Math.floor(Math.random() * 1000) + 10} ft`,
      networkStrength: ['Excellent', 'Good', 'Fair', 'Weak'][Math.floor(Math.random() * 4)],
      updatedAt: new Date()
    };

    const client = await clientPromise;
    const db = client.db('falldetection');
    const devices = db.collection('devices');

    const result = await devices.updateOne(
      { userId: new ObjectId(userId) },
      { $set: mockData },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Mock device data generated successfully',
      data: mockData
    });
  } catch (error) {
    console.error('Generate mock data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}