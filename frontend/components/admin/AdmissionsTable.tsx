import Card from "@/components/ui/Card";
import ToneBadge from "@/components/ui/ToneBadge";

const admissions = [
  {
    student: "Giulia Rossi",
    course: "Italiano B2 Intensivo",
    fecha: "12 Ago 2024",
    estado: "Approvata",
    badge: "success",
  },
  {
    student: "Marco Bellini",
    course: "Italiano C1 Avanzato",
    fecha: "10 Ago 2024",
    estado: "In attesa",
    badge: "warning",
  },
  {
    student: "Sofia Conti",
    course: "Italiano A2 Base",
    fecha: "08 Ago 2024",
    estado: "Approvata",
    badge: "success",
  },
  {
    student: "Luca Bianchi",
    course: "Conversazione B1",
    fecha: "07 Ago 2024",
    estado: "Respinta",
    badge: "error",
  },
] as const;

export default function AdmissionsTable() {
  return (
    <Card
      title="Ammissioni Recenti"
      subtitle="Stato delle richieste di ammissione"
      action={
        <button className="text-xs font-semibold text-primary transition hover:text-secondary">
          Ver tutte →
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              <th className="py-3 pr-6 font-semibold">Studente</th>
              <th className="px-6 py-3 font-semibold">Corso</th>
              <th className="px-6 py-3 font-semibold">Data</th>
              <th className="py-3 pl-6 font-semibold">Stato</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container">
            {admissions.map((row) => (
              <tr key={row.student} className="text-sm">
                <td className="py-3 pr-6 font-semibold">{row.student}</td>
                <td className="px-6 py-3 text-on-surface-variant">
                  {row.course}
                </td>
                <td className="px-6 py-3 text-on-surface-variant">
                  {row.fecha}
                </td>
                <td className="py-3 pl-6">
                  <ToneBadge tone={row.badge}>{row.estado}</ToneBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}