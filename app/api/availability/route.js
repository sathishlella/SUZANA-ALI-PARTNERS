import { NextResponse } from "next/server";
import { availabilityFor, getPartner } from "@/lib/booking";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const partnerId = searchParams.get("partner") || "suzana";
  const partner = getPartner(partnerId);
  const slots = await availabilityFor(partner.id);

  return NextResponse.json({
    partner: {
      id: partner.id,
      name: partner.name,
      title: partner.title
    },
    slots
  });
}
