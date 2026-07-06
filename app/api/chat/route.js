import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { firm, matterTypes, partners } from "@/lib/firm-data";

const fallbackReplies = {
  greeting:
    "Good day. I can help you arrange a consultation with the right partner. Could you tell me which type of matter this concerns?",
  matter:
    "Thank you. For this matter, I can help you choose a partner and hold a suitable appointment slot.",
  partner:
    "Understood. I will check available consultation slots and keep the appointment request concise.",
  slot:
    "That time works. May I have your name, email and phone number so the firm can confirm the consultation?",
  details:
    "Thank you. I have enough information to prepare the booking request now.",
  booked:
    "Your consultation request has been received. A confirmation has been prepared for you and the selected partner.",
  default:
    "I understand. I will keep this focused and help you move toward the right consultation."
};

function fallback(stage) {
  return fallbackReplies[stage] || fallbackReplies.default;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const stage = body.stage || "default";
  const transcript = Array.isArray(body.transcript) ? body.transcript.slice(-8) : [];
  const clientContext = body.context || {};

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ reply: fallback(stage), provider: "fallback" });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.55,
      max_tokens: 170,
      messages: [
        {
          role: "system",
          content: [
            `You are the appointment concierge for ${firm.name}, ${firm.descriptor} in Malaysia.`,
            "Sound like a calm, capable human legal assistant, not a bot.",
            "Do not provide legal advice, predictions, fees, or lawyer-client privilege claims.",
            "Ask one focused question at a time and keep replies under 45 words.",
            "If booking details are ready, warmly confirm that the request can be submitted.",
            `Available matter types: ${matterTypes.join(", ")}.`,
            `Partners: ${partners.map((partner) => `${partner.name} (${partner.title})`).join(", ")}.`
          ].join(" ")
        },
        {
          role: "user",
          content: JSON.stringify({
            stage,
            clientContext,
            transcript
          })
        }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || fallback(stage);
    return NextResponse.json({ reply, provider: "groq" });
  } catch (error) {
    console.error("[groq-chat-error]", error);
    return NextResponse.json({ reply: fallback(stage), provider: "fallback" });
  }
}
