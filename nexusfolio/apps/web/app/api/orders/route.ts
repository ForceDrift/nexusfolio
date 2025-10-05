import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth0 } from '@/lib/auth0';

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { symbol, quantity, orderType, limitPrice, stopPrice, portfolioId } = await request.json();

    if (!symbol || !quantity || !orderType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate order type specific requirements
    if (orderType === 'limit' && !limitPrice) {
      return NextResponse.json({ error: 'Limit price is required for limit orders' }, { status: 400 });
    }
    if (orderType === 'stop' && !stopPrice) {
      return NextResponse.json({ error: 'Stop price is required for stop orders' }, { status: 400 });
    }

    const order = new Order({
      userId: session.user.sub,
      symbol: symbol.toUpperCase(),
      quantity: parseInt(quantity),
      orderType,
      limitPrice: limitPrice ? parseFloat(limitPrice) : undefined,
      stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
      portfolioId: portfolioId || undefined,
      status: 'pending',
    });

    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const portfolioId = searchParams.get('portfolioId');
    const status = searchParams.get('status');

    const query: any = { userId: session.user.sub };
    
    if (symbol) query.symbol = symbol.toUpperCase();
    if (portfolioId) query.portfolioId = portfolioId;
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { orderId, status, filledPrice } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updateData: any = { status };
    
    if (status === 'filled' && filledPrice) {
      updateData.filledAt = new Date();
      updateData.filledPrice = parseFloat(filledPrice);
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId: session.user.sub },
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findOneAndDelete({
      _id: orderId,
      userId: session.user.sub,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
