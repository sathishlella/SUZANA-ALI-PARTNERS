import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { firm, matterTypes } from "@/lib/firm-data";

const fallbackReplies = {
  greeting:
    "Good day. I can help you arrange a consultation at the office that suits you best. Could you tell me which type of matter this concerns?",
  matter:
    "Thank you. I can help you choose the most convenient office and hold a suitable appointment slot.",
  office:
    "Understood. I will check available consultation slots at that office and keep the request concise.",
  slot:
    "That time works. May I have your name, email and phone number so the firm can confirm the consultation?",
  details:
    "Thank you. I have enough information to prepare the booking request now.",
  booked:
    "Your consultation request has been received. A confirmation has been prepared for you and the selected office.",
  freeform: `Thank you for your message. I can help you arrange a consultation — please choose an option above, or call the firm at ${firm.primaryPhone} and our team will assist you directly.`,
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
            `You are the concierge for ${firm.name}, ${firm.descriptor} in Malaysia.`,
            "Sound like a calm, capable human legal assistant, not a bot.",
            "Answer the visitor's questions about the firm's practice areas, offices, and how to book, warmly and concisely.",
            "Do not provide legal advice, case predictions, fee quotes, or lawyer-client privilege claims.",
            "When helpful, guide the visitor toward booking a consultation using the options in the panel, or calling the firm.",
            "Keep every reply under 45 words and ask at most one focused question.",
            `Available matter types: ${matterTypes.join(", ")}.`,
            `Offices: ${firm.offices.map((office) => office.label).join(", ")}.`,
            `Firm phone: ${firm.primaryPhone}.`
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
