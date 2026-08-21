import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
      <body className={`${jakarta.variable} font-sans bg-[#09070B] text-[#F3F1F5] antialiased selection:bg-purple-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
