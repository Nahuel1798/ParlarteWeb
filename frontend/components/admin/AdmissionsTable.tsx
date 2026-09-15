const admissions = [
  {
    student: "Giulia Rossi",
    course: "Italiano B2 Intensivo",
    fecha: "12 Ago 2024",
    estado: "Aprobada",
  },
  {
    student: "Marco Bellini",
    course: "Italiano C1 Avanzato",
    fecha: "10 Ago 2024",
    estado: "Pendiente",
  },
  {
    student: "Sofia Conti",
    course: "Italiano A2 Base",
    fecha: "08 Ago 2024",
    estado: "Aprobada",
  },
  {
    student: "Luca Bianchi",
    course: "Conversazione B1",
    fecha: "07 Ago 2024",
    estado: "Rechazada",
  },
];

export default function AdmissionsTable() {
  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebe8e1]">
        <div>
          <h2 className="font-playfair text-lg font-semibold">
            Ammissioni Recenti
          </h2>
          <p className="text-xs text-[#42493e] mt-0.5">
            Estado de las solicitudes de ingreso
          </p>
        </div>

        <button className="text-xs font-semibold text-[#154212] hover:text-[#2d5a27]">
          Ver tutte →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#42493e]">
              <th className="px-6 py-3 font-semibold">Estudiante</th>
              <th className="px-6 py-3 font-semibold">Curso</th>
              <th className="px-6 py-3 font-semibold">Fecha</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f0eee7]">
            {admissions.map((row) => {
              const done =
                row.estado === "Aprobada"
                  ? "bg-[#e7f0e6] text-[#2d5a27]"
                  : row.estado === "Pendiente"
                    ? "bg-[#f6f0d8] text-[#735c00]"
                    : "bg-[#f7e5e1] text-[#9d422b]";

              return (
                <tr key={row.student} className="text-sm">
                  <td className="px-6 py-3 font-semibold">{row.student}</td>
                  <td className="px-6 py-3 text-[#42493e]">{row.course}</td>
                  <td className="px-6 py-3 text-[#42493e]">{row.fecha}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded ${done}`}
                    >
                      {row.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}