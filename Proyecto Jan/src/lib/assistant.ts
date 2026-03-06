import { PortfolioMetrics, ProfileResult, SmartAlert } from "@/types";

const disclaimer =
  "NoRisk no proporciona asesoramiento financiero. Informacion educativa.";

export function generateAssistantReply(
  text: string,
  metrics: PortfolioMetrics,
  profile: ProfileResult | null,
  alerts: SmartAlert[],
): string {
  const input = text.trim().toLowerCase();

  if (!input) {
    return `Cuentame que te preocupa de tu cartera y te doy una guia clara. ${disclaimer}`;
  }

  if (input.includes("divers") || input.includes("concentr")) {
    return `Tu top1 es ${metrics.top1.toFixed(1)}% y top3 ${metrics.top3.toFixed(1)}%. ${
      metrics.top1 > 35
        ? "Hay concentracion alta en pocas posiciones, conviene repartir pesos."
        : "La concentracion esta razonablemente controlada."
    } ${disclaimer}`;
  }

  if (input.includes("cae") || input.includes("mercado") || input.includes("panico")) {
    return `En el escenario actual, la caida simulada es ${metrics.drawdown.toFixed(1)}%. Prioriza horizonte temporal, liquidez y evitar ventas impulsivas. Revisa la seccion Anti-panico para checklist y plan en 3 pasos. ${disclaimer}`;
  }

  if (input.includes("score") || input.includes("bajo")) {
    const topAlert = alerts[0];
    return `Tu Investor Score es ${metrics.score}/100. ${
      topAlert
        ? `La alerta prioritaria es: ${topAlert.title}.`
        : "No hay alertas criticas activas ahora."
    } Puedes subir score reduciendo concentracion y mejorando diversificacion sectorial/regional. ${disclaimer}`;
  }

  if (input.includes("riesgo") || input.includes("reducir")) {
    return `Tu riesgo medio ponderado es ${metrics.riskAvg.toFixed(2)} sobre 5${
      profile ? ` para perfil ${profile.type}` : ""
    }. Para reducir riesgo: baja activos de riskBase alto, sube ETFs amplios y evita sobrepeso en un solo sector. ${disclaimer}`;
  }

  return `Resumen rapido: score ${metrics.score}/100, riesgo ${metrics.riskAvg.toFixed(2)}/5, drawdown ${metrics.drawdown.toFixed(1)}%. Si quieres, puedo explicarte un plan de rebalanceo paso a paso. ${disclaimer}`;
}
