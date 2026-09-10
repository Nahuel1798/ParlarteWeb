import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden">
      <Navbar />
      <Hero />
      <Courses />
      <Footer />
    </main>
  );
}