import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await OrderModel.find().sort({ createdAt: -1 });

    const formatted = orders.map((o) => ({
      id: o.orderId || o._id.toString(),
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      deliveryAddress: o.deliveryAddress,
      items: o.items,
      totalAmount: o.totalAmount,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET /api/orders Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = await OrderModel.create({
      orderId,
      customerName: body.customerName || "WhatsApp Customer",
      customerPhone: body.customerPhone || "N/A",
      deliveryAddress: body.deliveryAddress || "",
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod: body.paymentMethod || "WhatsApp",
    });

    return NextResponse.json({
      id: newOrder.orderId,
      status: newOrder.status,
      totalAmount: newOrder.totalAmount,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
