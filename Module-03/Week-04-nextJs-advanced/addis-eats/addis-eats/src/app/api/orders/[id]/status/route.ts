import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrderFor } from "@/lib/queries";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) { const session = await getSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } }); const { id } = await params; if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 }); const order = await getOrderFor(session.userId, id); if (!order) return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "private, no-store" } }); return NextResponse.json({ status: order.status }, { headers: { "Cache-Control": "private, no-store, max-age=0" } }); }
