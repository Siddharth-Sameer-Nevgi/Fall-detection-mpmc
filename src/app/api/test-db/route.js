import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    const client = await clientPromise;
    const db = client.db('falldetection');
    
    const result = await db.admin().ping();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      result
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}