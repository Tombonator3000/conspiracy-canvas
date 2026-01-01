import { useState } from "react";
import { Mail, Linkedin, Github, ChevronDown, ChevronUp, Briefcase, GraduationCap, Award, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Portfolio = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("about");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Tom Bjerke
            </h1>
            <p className="text-xl text-gray-300 mt-2">Digital Konsulent & Administrativ Spesialist</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon" asChild className="bg-white/10 border-white/20 hover:bg-white/20">
              <a href="https://www.linkedin.com/in/tombjerke/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="bg-white/10 border-white/20 hover:bg-white/20">
              <a href="mailto:tombjerke@gmail.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="bg-white/10 border-white/20 hover:bg-white/20">
              <a href="/game">
                <Sparkles className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* About Section */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader
            className="cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => toggleSection("about")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-400" />
                <CardTitle>Om meg</CardTitle>
              </div>
              {expandedSection === "about" ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          {expandedSection === "about" && (
            <CardContent className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  Førstekonsulent i Hamar bispedømme, hvor jeg er daglig støttespiller for biskop og stiftsdirektør.
                  Jeg styrer kalendere, behandler saker, forbereder møter og løser praktiske utfordringer med verktøy
                  som Microsoft 365, Public 360 og Xledger.
                </p>
                <p className="text-gray-300">
                  Med over 15 års erfaring fra administrasjon, kundeservice og IT i SpareBank 1 Østlandet,
                  Handel og Kontor samt JYSK, er jeg vant til høyt tempo og komplekse prosesser.
                  Utdanning i nettverksadministrasjon og Microsoft-teknologi (HiST/NTNU og IT Akademiet)
                  kombinert med sertifisering som LOfavør-veileder har gitt meg et solid grunnlag.
                </p>
                <p className="text-gray-300">
                  Parallelt med jobb har jeg i flere år dyrket en sterk lidenskap for digital kreativitet og AI.
                  Jeg har omfattende praktisk erfaring med generative AI – særlig Stable Diffusion (Automatic1111 og ComfyUI),
                  Photoshop med AI-plugins, store språkmodeller og avanserte workflows. Jeg bruker dette både til kreative
                  prosjekter og til å finne nye, smarte måter å effektivisere administrative oppgaver på.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">Microsoft 365</Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">Public 360</Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">Administrasjon</Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">AI/LLM</Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">Stable Diffusion</Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">Photoshop</Badge>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Experience Section */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader
            className="cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => toggleSection("experience")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-400" />
                <CardTitle>Arbeidserfaring</CardTitle>
              </div>
              {expandedSection === "experience" ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          {expandedSection === "experience" && (
            <CardContent className="space-y-6">
              <div className="border-l-2 border-purple-400/30 pl-4 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-300">Førstekonsulent</h3>
                  <p className="text-gray-400">Den Norske Kirke, Hamar Bispedømme • 2022 - Nå</p>
                  <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li>Daglig støttespiller for biskop og stiftsdirektør med ansvar for kalenderstyring og møteplanlegging</li>
                    <li>Saksbehandling og kvalitetssikring av post i Public 360</li>
                    <li>IT- og telefoniløsninger i Microsoft 365</li>
                    <li>Kontering og fakturering i Xledger</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-300">Fagkonsulent</h3>
                  <p className="text-gray-400">SpareBank 1 Østlandet • 2018 - 2021</p>
                  <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li>Produksjons-, kontroll- og oppfølgingsoppgaver innen konto/AML og kundekontroll</li>
                    <li>Rådgivning og support til kolleger og kunder</li>
                    <li>Kvalitetssikring av antihvitvaskprosesser</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-300">Sekretær</h3>
                  <p className="text-gray-400">Handel og Kontor Indre Østland • 2014 - 2017</p>
                  <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li>Førstelinje kundeservice, saksbehandling og medlemspleie</li>
                    <li>Fysisk og digital arkivering, kontering og fakturering</li>
                    <li>Sertifisert LOfavør-veileder</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-300">Områdeansvarlig</h3>
                  <p className="text-gray-400">JYSK • 2003 - 2012</p>
                  <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li>Ledet kasse- og butikkdrift med fokus på kundeservice</li>
                    <li>Opplæring av nye medarbeidere</li>
                    <li>Lager- og kontoroppgaver</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Education Section */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader
            className="cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => toggleSection("education")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                <CardTitle>Utdanning & Kurs</CardTitle>
              </div>
              {expandedSection === "education" ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          {expandedSection === "education" && (
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">IT Akademiet</h3>
                <p className="text-gray-400">Configuring and administering Microsoft server/infrastructure • 2001-2002</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-300">HiST/NTNU</h3>
                <p className="text-gray-400">Drift av Internett tjenester • 2000-2001</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-purple-300 mb-2">Sertifiseringer & Kurs:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Public360 - Saksbehandling</li>
                  <li>Antihvitvasking & Personvern</li>
                  <li>LOfavør-veileder</li>
                  <li>Den digitale endringsagenten (BI Kurs)</li>
                  <li>HK Tillitsvalgtskolering Trinn I & II</li>
                </ul>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Projects Section */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader
            className="cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => toggleSection("projects")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <CardTitle>Hobby-prosjekter</CardTitle>
              </div>
              {expandedSection === "projects" ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription className="text-gray-400">
              Spillprototyper og kreative eksperimenter
            </CardDescription>
          </CardHeader>
          {expandedSection === "projects" && (
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Conspiracy Canvas</h3>
                  <p className="text-gray-300 mb-3">
                    Et satirisk puzzle-spill der spilleren kobler sammen bevismateriale på en korktavle for å
                    avsløre absurde konspirasjonsteorier. Bygget med React, TypeScript og React Flow.
                  </p>
                  <Button asChild variant="outline" size="sm" className="bg-purple-500/20 border-purple-400/30 hover:bg-purple-500/30">
                    <a href="/game">Prøv spillet</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Åpen for nye muligheter</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Jeg er alltid åpen for nye muligheter innen administrasjon, IT-støtte, digitalisering eller roller
                der struktur møter moderne teknologi – fortrinnsvis i Hamar/Innlandet eller med fleksibilitet for hjemmekontor.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <a href="https://www.linkedin.com/in/tombjerke/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Kontakt på LinkedIn
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-purple-400/30 hover:bg-white/10">
                  <a href="mailto:tombjerke@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Send e-post
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>&copy; 2026 Tom Bjerke. Alle rettigheter reservert.</p>
      </footer>
    </div>
  );
};

export default Portfolio;
