import { NextResponse } from "next/server";
import { Registry, collectDefaultMetrics } from "prom-client";

const register = new Registry();

collectDefaultMetrics({
  register,
  prefix: "linxos_",
});

export async function GET() {
  try {
    const metrics = await register.metrics();

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        "Content-Type": register.contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to collect metrics" },
      { status: 500 }
    );
  }
}