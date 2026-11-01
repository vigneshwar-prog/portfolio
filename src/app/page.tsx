import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { profile } from "@/content/profile";

const publicFile = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));

export default function Home() {
  // Detected at build time so missing assets never produce broken links/images.
  const hasPortrait = publicFile(profile.portrait);
  const hasResume = publicFile(profile.resume);
  return (
    <>
      <Hero hasPortrait={hasPortrait} hasResume={hasResume} />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Achievements />
      <Contact hasResume={hasResume} />
    </>
  );
}
