import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProvider } from "@/src/context/AppContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vyroh Central Hub | Plataforma All-in-One para Engenheiros de IA e Agências",
  description: "Monorepo de Alta Performance: Gestão de Projetos, Cofre de Prompts, Marketplace Split Stripe Connect e Governança Multi-Tenant.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#09070B] text-[#F3F1F5] antialiased selection:bg-purple-500 selection:text-white`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
