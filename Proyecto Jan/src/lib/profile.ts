import { ProfileQuestion, ProfileResult, RiskProfileType } from "@/types";

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: "horizon",
    question: "Si el mercado cae fuerte, ¿en que horizonte piensas tu inversion?",
    options: [
      { label: "Menos de 1 ano", value: 1 },
      { label: "1-3 anos", value: 2 },
      { label: "3-5 anos", value: 3 },
      { label: "Mas de 5 anos", value: 4 },
      { label: "Mas de 10 anos", value: 5 },
    ],
  },
  {
    id: "drop",
    question: "Si tu cartera cae 15%, ¿que haces?",
    options: [
      { label: "Vender para evitar mas perdida", value: 1 },
      { label: "Reducir algo de exposicion", value: 2 },
      { label: "Esperar y revisar", value: 3 },
      { label: "Mantener y estudiar oportunidades", value: 4 },
      { label: "Aprovechar para comprar", value: 5 },
    ],
  },
  {
    id: "experience",
    question: "¿Cuanta experiencia tienes invirtiendo en renta variable?",
    options: [
      { label: "Ninguna", value: 1 },
      { label: "Basica", value: 2 },
      { label: "Intermedia", value: 3 },
      { label: "Avanzada", value: 4 },
      { label: "Muy avanzada", value: 5 },
    ],
  },
  {
    id: "goal",
    question: "¿Cual es tu prioridad principal?",
    options: [
      { label: "Conservar capital", value: 1 },
      { label: "Ingresos estables", value: 2 },
      { label: "Crecimiento equilibrado", value: 3 },
      { label: "Maximizar crecimiento", value: 4 },
      { label: "Alto crecimiento aceptando alta volatilidad", value: 5 },
    ],
  },
  {
    id: "sleep",
    question: "¿Como duermes con volatilidad diaria alta?",
    options: [
      { label: "Muy incomodo", value: 1 },
      { label: "Algo incomodo", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Comodo", value: 4 },
      { label: "Muy comodo", value: 5 },
    ],
  },
];

export function resolveRiskProfile(answers: Record<string, number>): ProfileResult {
  const totalScore = PROFILE_QUESTIONS.reduce(
    (acc, question) => acc + (answers[question.id] ?? 0),
    0,
  );

  let type: RiskProfileType = "Moderado";
  let explanation =
    "Buscas equilibrio entre crecimiento y estabilidad. Aceptas cierta volatilidad con control de riesgo.";

  if (totalScore <= 10) {
    type = "Conservador";
    explanation =
      "Priorizas proteger el capital y reducir oscilaciones fuertes. Suele encajar una cartera diversificada y prudente.";
  } else if (totalScore >= 18) {
    type = "Agresivo";
    explanation =
      "Toleras volatilidad elevada para buscar mayor crecimiento. Necesitas disciplina para mantener la estrategia en caidas.";
  }

  return {
    type,
    explanation,
    totalScore,
    answers,
    completedAt: new Date().toISOString(),
  };
}
