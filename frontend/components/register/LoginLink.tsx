import Link from "next/link";

export default function LoginLink() {
  return (
    <div className="mt-8 text-center">

      <p className="text-xs text-[#42493e]">

        ¿Ya posees una matrícula activa?{" "}

        <Link
          href="/login"
          className="text-[#9d422b] font-semibold text-xs underline ml-1 hover:text-[#74250f]"
        >
          Acceder al portal de alumnos
        </Link>

      </p>

    </div>
  );
}

