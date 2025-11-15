import { api } from "@/utils/api";

export async function getReportData(
  startDate: Date,
  endDate: Date,
  reportType: string
) {
  try {
    const data = await api.post("/analise/report", {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      reportType,
    });

    return data;
  } catch (err) {
    console.error("❌ Erro ao buscar relatórios:", err);
    throw err;
  }
}
