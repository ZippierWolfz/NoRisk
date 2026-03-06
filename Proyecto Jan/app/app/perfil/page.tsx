"use client";

import { FormEvent, useMemo, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";
import { PROFILE_QUESTIONS, resolveRiskProfile } from "@/lib/profile";

export default function PerfilPage() {
  const { loaded, profile, setProfile } = useAppState();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const isComplete = useMemo(
    () => PROFILE_QUESTIONS.every((question) => typeof answers[question.id] === "number"),
    [answers],
  );

  if (!loaded) {
    return <p className="text-sm text-slate-500">Cargando perfil...</p>;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isComplete) {
      setError("Debes responder las 5 preguntas.");
      return;
    }

    setError(null);
    setProfile(resolveRiskProfile(answers));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Onboarding de perfil de riesgo</CardTitle>
        <CardDescription>
          Conservador, Moderado o Agresivo en base a 5 preguntas tipo test.
        </CardDescription>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {PROFILE_QUESTIONS.map((question, index) => (
            <fieldset key={question.id} className="rounded-xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-semibold text-slate-900">
                {index + 1}. {question.question}
              </legend>
              <div className="mt-3 space-y-2">
                {question.options.map((option) => (
                  <label
                    key={`${question.id}-${option.value}`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: option.value,
                        }))
                      }
                      className="h-4 w-4 text-brand-600"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Calcular perfil
          </button>
        </form>
      </Card>

      {profile ? (
        <Card className="border-brand-100 bg-brand-50">
          <CardTitle>Resultado: {profile.type}</CardTitle>
          <p className="mt-2 text-sm text-slate-700">{profile.explanation}</p>
          <p className="mt-2 text-xs text-slate-600">Puntaje del test: {profile.totalScore}</p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setProfile(null)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Rehacer onboarding
            </button>
          </div>
        </Card>
      ) : (
        <Card className="text-sm text-slate-600">
          Completa el test para activar recomendaciones de riesgo personalizadas.
        </Card>
      )}

      <Card className="border-brand-100 bg-brand-50 text-xs text-brand-800">
        NoRisk no proporciona asesoramiento financiero. Informacion educativa.
      </Card>
    </div>
  );
}
