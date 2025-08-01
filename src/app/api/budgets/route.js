import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    
    const budgets = await db
      .collection('budgets')
      .find({})
      .sort({ category: 1 })
      .toArray();

    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    const data = await request.json();

    const budget = {
      ...data,
      amount: parseFloat(data.amount),
      createdAt: new Date(),
    };

    const result = await db.collection('budgets').insertOne(budget);
    
    return NextResponse.json({ _id: result.insertedId, ...budget });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    const data = await request.json();
    const { _id, ...updateData } = data;

    const budget = {
      ...updateData,
      amount: parseFloat(updateData.amount),
      updatedAt: new Date(),
    };

    await db.collection('budgets').updateOne(
      { _id: new ObjectId(_id) },
      { $set: budget }
    );

    return NextResponse.json({ _id, ...budget });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    const { id } = await request.json();

    await db.collection('budgets').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}