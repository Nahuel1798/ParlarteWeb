import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container text-on-surface pt-20 pb-6 mt-20 border-t border-primary/10">

      <div className="w-full px-4 md:px-6 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-headline-md text-2xl text-primary block mb-4"
          >
            Scuola d'Italiano
          </Link>

          <p className="font-body-md text-base text-on-surface-variant mb-6">
            La Dolce Vita through academic excellence. Experience the
            definitive path to mastering the Italian language.
          </p>

          <div className="flex gap-4">
            <Link
              href="#"
              className="text-primary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">
                language
              </span>
            </Link>

            <Link
              href="mailto:contact@example.com"
              className="text-primary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">
                mail
              </span>
            </Link>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h4 className="font-semibold text-sm text-primary mb-4 uppercase tracking-wider">
            Programs
          </h4>

          <ul className="space-y-3 text-base text-on-surface-variant">
            <li>
              <Link href="#" className="hover:text-secondary">
                Beginner Intensive
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Conversational Fluency
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Business Italian
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Exam Preparation (CILS)
              </Link>
            </li>
          </ul>
        </div>

        {/* School */}
        <div>
          <h4 className="font-semibold text-sm text-primary mb-4 uppercase tracking-wider">
            School
          </h4>

          <ul className="space-y-3 text-base text-on-surface-variant">
            <li>
              <Link href="#about" className="hover:text-secondary">
                About Us
              </Link>
            </li>

            <li>
              <Link href="#methodology" className="hover:text-secondary">
                Our Methodology
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Faculty
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-sm text-primary mb-4 uppercase tracking-wider">
            Legal
          </h4>

          <ul className="space-y-3 text-base text-on-surface-variant">
            <li>
              <Link href="#" className="hover:text-secondary">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Terms of Service
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="w-full px-4 md:px-6 max-w-[1280px] mx-auto border-t border-primary/10 pt-6">
        <p className="text-xs text-on-surface-variant text-center md:text-left">
          © 2026 Scuola d'Italiano. All rights reserved.
          La Dolce Vita through academic excellence.
        </p>
      </div>

    </footer>
  );
}