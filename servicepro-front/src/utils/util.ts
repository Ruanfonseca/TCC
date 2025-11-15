import { TipoLab } from "@/types/labType";

// utils/dateLimits.ts
export function getDateLimits() {
  const today = new Date();

  // mínimo = daqui 7 dias
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 10);
  const minDateStr = minDate.toISOString().split("T")[0];

  // se quiser sem limite, não define maxDate
  return { minDate: minDateStr };
}

// utils/dateLimits.ts
export function getMinDatePlus7Days() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 7); // 7 dias à frente
  return minDate;
}

// 🔹 Função separada para normalizar o tipo de laboratório
export const normalizeTipoLab = (tipo: TipoLab | string): string => {
  const value = String(tipo).toLowerCase().trim();

  switch (value) {
    case "didatico":
    case "dídático":
    case "didático":
      return "didatico";

    case "didatico_pesquisa":
    case "didatico/pesquisa":
    case "didático_pesquisa":
    case "didático/pesquisa":
      return "didatico/pesquisa";

    default:
      return "outro";
  }
};

// 🔹 Usa a função de normalização dentro da função de cor
export const getTypeColor = (tipoLab: TipoLab | string) => {
  const value = normalizeTipoLab(tipoLab);

  switch (value) {
    case "didatico":
      return "bg-primary/10 text-primary border-primary";
    case "didatico/pesquisa":
      return "bg-accent/10 text-accent border-accent";
    default:
      return "bg-muted/10 text-muted-foreground border-muted";
  }
};
