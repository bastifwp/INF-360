export function formatearFechaDDMMYYYY(fechaStr: string): string {
  const separador = fechaStr.includes("/") ? "/" : "-";
  const [dia, mes, anio] = fechaStr.split(separador).map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}