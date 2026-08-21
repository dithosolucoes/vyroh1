export const metadata = {
  title: "Termos de Uso | Vyroh",
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-[#050506] text-[#F3EEFB] px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-[#A79BC4]">RASCUNHO — Seção 24 do documento de produto</p>
          <h1 className="text-2xl font-bold">Termos de Uso do Vyroh</h1>
          <p className="text-xs text-[#6E6480]">
            Última atualização: preencher na publicação. Este texto é um rascunho gerado como ponto de partida
            e <strong className="text-[#F3EEFB]">precisa de revisão por advogado antes de ser publicado de verdade</strong>.
          </p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed text-[#A79BC4]">
          <h2 className="text-base font-semibold text-[#F3EEFB]">1. O que é o Vyroh</h2>
          <p>
            O Vyroh é uma plataforma que centraliza projetos, prompts, boilerplates, processos (SOPs), clientes e
            demais ativos de trabalho de profissionais autônomos e pequenas equipes, e que também opera um
            marketplace onde usuários podem comprar e vender produtos digitais, assinaturas de conteúdo e serviços
            entre si.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">2. Conta e responsabilidade do usuário</h2>
          <p>
            Você é responsável por manter a confidencialidade da sua senha e por toda atividade realizada na sua
            conta. Você declara que as informações fornecidas no cadastro são verdadeiras e se compromete a
            atualizá-las quando necessário.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">3. Marketplace — o Vyroh indica, não garante</h2>
          <p>
            Qualquer usuário pode publicar produtos digitais (prompts, boilerplates, modelos), assinaturas de
            conteúdo próprio, ou oferecer serviços através do Marketplace. <strong className="text-[#F3EEFB]">O Vyroh atua como
            intermediário tecnológico e de pagamento — não como parte no negócio entre comprador e vendedor.</strong> A
            responsabilidade pela qualidade, funcionamento, legalidade e entrega do que é vendido é exclusivamente
            do vendedor. O Vyroh pode remover listagens que violem estes Termos, mas não garante o resultado de
            nenhuma transação.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">4. Pagamentos</h2>
          <p>
            Os pagamentos são processados por um provedor terceirizado (Stripe). O Vyroh retém uma comissão sobre
            cada transação, cujo percentual é definido no painel de configuração administrável e pode ser
            atualizado sem aviso prévio de alteração de produto (não constitui alteração destes Termos).
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">5. Conteúdo do usuário</h2>
          <p>
            Você mantém a propriedade de tudo que cadastra no seu cofre pessoal (projetos, prompts, boilerplates,
            etc.). Ao publicar algo no Marketplace ou torná-lo público na Comunidade, você concede aos demais
            usuários a licença especificada na própria listagem (uso pessoal, comercial, revenda, conforme o caso).
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">6. Uso aceitável</h2>
          <p>
            É proibido publicar conteúdo malicioso (incluindo código com backdoor ou dependência comprometida),
            violar direitos autorais de terceiros, ou usar a plataforma para atividade ilegal. Listagens podem
            passar por triagem antes da publicação.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">7. Cancelamento e encerramento</h2>
          <p>
            Você pode encerrar sua conta a qualquer momento. O Vyroh pode suspender ou encerrar contas que violem
            estes Termos, mediante notificação quando possível.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">8. Alterações</h2>
          <p>
            Estes Termos podem ser atualizados. Mudanças materiais serão comunicadas com antecedência razoável.
          </p>
        </section>
      </div>
    </div>
  );
}
