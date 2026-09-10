import CourseCard from "./CourseCard";
import Link from "next/link";

export default function Courses() {
  return (
    <section
      id="courses"
      className="w-full py-20 bg-surface"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-[32px] md:text-[48px] text-primary mb-4">
            Curriculum Excelente
          </h2>

          <p className="font-body-md text-base text-on-surface-variant max-w-2xl mx-auto">
            Desde tu primer «Ciao» hasta debates culturales llenos de matices, nuestros cursos estructurados y alineados con el MCER guían tu camino.
          </p>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <CourseCard
            title="Beginner"
            level="A1 - A2"
            description="Sienta las bases. Domine el vocabulario esencial, la gramática básica y las interacciones cotidianas con confianza."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBrDgna7W48T_Z9BcF8DFLWKO3uKOvTVpld0_iON-Z-FbzqM0ThAdsoVjNnUOpO-VCGMh6orpJZtRTRWDYtg_2_jp_PZWpaiDmpUwox-e96mAFSImTkUcvOdSr7FLxmtVxETSfvjwQEG349QLKdIdx3qO3FXd_SBbpg3REJ_YQ5wQvQeqB6sXtP78q5p6Ih7EOjcpMTc7Hdv8lAtrOLo12BfXPA0GINGjklnZHgjxbXxPoWsV_4nMIh"
          />

          <CourseCard
            title="Intermediate"
            level="B1 - B2"
            description="Navega por narrativas complejas, expresa opiniones con fluidez y sumérgete en la cultura italiana contemporánea."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDXSjMpCVWVpgWtTIDEzwGrr-mVIGQLQg3lAOLv4-ypoxYmGu7gWeZo_R6UuQtqVNRzl2szXsreMVgC1m6QhsGRZbZ91eANKcu0CvKhjmZcIbp2KdwUS081JiQwNfTP_ShIW5DYBhoMFs_SXWqjJpH2n0x_5dwUXHsWY25MxF15vtht1FRJwFjdNx0wpg1LkWHSXIPdpPOv1-hjH2k2lwvtwAk2j0CH5X0XDeR7uCEynOKHtAiZkHMt"
            large
          />

          {/* Advanced */}
          <div className="md:col-span-3 group overflow-hidden rounded-xl bg-surface-container-low border border-primary/15">
            <div className="flex flex-col md:flex-row">

              <div className="p-8 md:p-12 flex flex-col justify-center flex-1">

                <div className="w-max mb-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded text-xs font-semibold">
                  C1 - C2
                </div>

                <h3 className="font-headline-md text-3xl text-primary mb-4">
                  Dominio Avanzado
                </h3>

                <p className="font-body-md text-base text-on-surface-variant mb-8 max-w-2xl">
                  Logra una fluidez casi nativa. Analiza la literatura, debate
                  temas sociales complejos y refina tu italiano académico o

                  professional Italian to perfection.
                </p>

                <Link
                  href="#"
                  className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded w-max hover:bg-primary-container transition-colors"
                >
                  Apply for C-Level
                </Link>

              </div>

              <div className="md:w-2/5 min-h-[250px] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBA56UU1YbgbVqnTOzSsjIEZ2u34IQUfymv7lFR-Q_JiN0NS7poWQt0kcK2nMOYGWdvh-ndoMWO6HNncYwYU1ZMj103yVJ8my5AdQ9UgdI2KwEDL3qfB4mhq1tzMrSNJPY4tlobZWScmsm8Q90IW_BcqiCG09iHbwuKClSZGKA1XpzeoNaLB21mKW_2evkBQ7RbpWKAcFubMQXmdv7IOTOb_hcG6n4Ccx3tuEGCuSEauf6B7NqRRD1b')",
                  }}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}