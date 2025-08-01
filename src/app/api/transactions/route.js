import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    
    const transactions = await db
      .collection('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    const data = await request.json();

    const transaction = {
      ...data,
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      createdAt: new Date(),
    };

    const result = await db.collection('transactions').insertOne(transaction);
    
    return NextResponse.json({ _id: result.insertedId, ...transaction });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    const data = await request.json();
    const { _id, ...updateData } = data;

    const transaction = {
      ...updateData,
      amount: parseFloat(updateData.amount),
      date: new Date(updateData.date),
      updatedAt: new Date(),
    };

    await db.collection('transactions').updateOne(
      { _id: new ObjectId(_id) },
      { $set: transaction }
    );

    return NextResponse.json({ _id, ...transaction });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db('personal_finance');
    const { id } = await request.json();

    await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}