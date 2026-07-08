import { NextResponse } from "next/server";
import { availabilityForOffice, getOffice } from "@/lib/booking";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const officeId = searchParams.get("office") || "kota-damansara";
  const office = getOffice(officeId);
  const slots = await availabilityForOffice(office.id);

  return NextResponse.json({
    office: {
      id: office.id,
      label: office.label,
      city: office.city
    },
    slots
  });
}
