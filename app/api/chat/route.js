import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { firm, practiceGroups, partners } from "@/lib/firm-data";

const fallbackReply = `Thank you for your message. For anything specific, please call the firm at ${firm.primaryPhone} or email ${firm.klEmail} and our team will assist you.`;

/** Everything the assistant is allowed to answer from. */
function firmKnowledge() {
  return [
    `Firm: ${firm.name} — ${firm.descriptor}, Malaysia. ${firm.established}.`,
    `Offices:\n${firm.offices
      .map((office) => `- ${office.label}: ${office.address}. Phone ${office.phone}. Email ${office.email}.`)
      .join("\n")}`,
    `Practice areas:\n${practiceGroups
      .map((group) => `- ${group.title}: ${group.summary} Matters handled: ${group.matters.join(", ")}.`)
      .join("\n")}`,
    `Lawyers:\n${partners.map((person) => `- ${person.name} (${person.title}): ${person.qualification}.`).join("\n")}`
  ].join("\n\n");
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const transcript = Array.isArray(body.transcript) ? body.transcript.slice(-10) : [];

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ reply: fallbackReply, provider: "fallback" });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content: [
            `You are the information assistant for ${firm.name}, ${firm.descriptor} in Malaysia.`,
            "Answer visitors' questions about the firm using only the firm information below.",
            "Sound like a calm, capable human legal assistant — warm, concise and professional.",
            "Never give legal advice, opinions on the merits of a matter, case predictions, or fee quotes.",
            "If you do not know something, say so plainly and invite them to call the firm.",
            "You cannot book appointments. If someone wants an appointment, invite them to call the office nearest them and give that number.",
            "Keep replies under 60 words. Do not use markdown formatting.",
            "",
            "FIRM INFORMATION:",
            firmKnowledge()
          ].join("\n")
        },
        ...transcript.map((message) => ({
          role: message.role === "user" ? "user" : "assistant",
          content: String(message.content || "")
        }))
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || fallbackReply;
    return NextResponse.json({ reply, provider: "groq" });
  } catch (error) {
    console.error("[groq-chat-error]", error);
    return NextResponse.json({ reply: fallbackReply, provider: "fallback" });
  }
}
