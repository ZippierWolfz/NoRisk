"use client";

import { FormEvent, useState } from "react";
import { useAppState } from "@/context/app-state";
import { generateAssistantReply } from "@/lib/assistant";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const quickPrompts = [
  "¿Estoy bien diversificado?",
  "¿Que hago si cae el mercado?",
  "¿Por que mi score es bajo?",
  "¿Como reducir riesgo?",
];

export function AssistantChat() {
  const { metrics, profile, alerts } = useAppState();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Soy tu asistente NoRisk. Puedo explicar score, riesgo, concentracion y acciones concretas.",
    },
  ]);
  const [input, setInput] = useState("");

  const submit = (messageText: string) => {
    const text = messageText.trim();
    if (!text) {
      return;
    }

    const reply = generateAssistantReply(text, metrics, profile, alerts);
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: reply },
    ]);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(input);
  };

  return (
    <Card className="h-full">
      <CardTitle>Asistente (mock)</CardTitle>
      <CardDescription>
        Respuestas por reglas basadas en score, alertas y escenario. No usa IA externa.
      </CardDescription>

      <div className="mt-4 space-y-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submit(prompt)}
            className="mr-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 h-64 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {messages.map((message, idx) => (
          <div
            key={`${message.role}-${idx}`}
            className={
              message.role === "assistant"
                ? "mr-8 rounded-xl bg-white p-3 text-sm text-slate-700"
                : "ml-8 rounded-xl bg-brand-600 p-3 text-sm text-white"
            }
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-brand-200 focus:ring"
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Enviar
        </button>
      </form>
    </Card>
  );
}
