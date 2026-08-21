export const metadata = {
  title: "Política de Privacidade | Vyroh",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#050506] text-[#F3EEFB] px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-[#A79BC4]">RASCUNHO — Seção 22 e 24 do documento de produto</p>
          <h1 className="text-2xl font-bold">Política de Privacidade do Vyroh</h1>
          <p className="text-xs text-[#6E6480]">
            Última atualização: preencher na publicação. Este texto é um rascunho gerado como ponto de partida
            e <strong className="text-[#F3EEFB]">precisa de revisão por advogado antes de ser publicado de verdade</strong>,
            especialmente quanto à conformidade com a LGPD (Lei 13.709/2018).
          </p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed text-[#A79BC4]">
          <h2 className="text-base font-semibold text-[#F3EEFB]">1. Que dado coletamos</h2>
          <p>
            Coletamos os dados que você cadastra diretamente (nome, e-mail, dados de projetos, prompts,
            clientes, boilerplates, propostas comerciais) e dados técnicos gerados pelo uso (sessão, endereço IP
            para prevenção de abuso, registro de atividade).
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">2. Dado de terceiro dentro do seu cofre</h2>
          <p>
            Se você cadastra informação de cliente seu (nome, contato, notas) dentro do Vyroh, você — não o Vyroh —
            é o controlador desse dado perante a LGPD. O Vyroh atua como operador, processando esse dado conforme
            suas instruções (armazenar, exibir, permitir exportação/exclusão).
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">3. Como usamos o dado</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Para operar o cofre pessoal e o Marketplace;</li>
            <li>Para processar pagamento (compartilhado com o processador de pagamento, nunca armazenamos número de cartão);</li>
            <li>Para a camada de IA (Cérebro) gerar roadmap e sugestões — o conteúdo enviado à IA pode ser processado por um provedor externo de modelo de linguagem, conforme sua preferência de provedor configurada;</li>
            <li>Para prevenção de fraude e abuso (limite de tentativa de login, por exemplo).</li>
          </ul>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">4. Compartilhamento</h2>
          <p>
            Não vendemos dado pessoal. Compartilhamos o mínimo necessário com: processador de pagamento (Stripe),
            provedor de IA escolhido (Claude, OpenAI, Gemini ou um servidor Ollama que você mesmo configurar), e
            provedor de hospedagem/banco de dados.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">5. Seus direitos (LGPD)</h2>
          <p>
            Você pode solicitar a exportação ou exclusão dos seus dados a qualquer momento pelas configurações da
            conta. Pedidos de exclusão removem seu cofre pessoal; itens já vendidos no Marketplace para outros
            usuários seguem a licença concedida no momento da venda.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">6. Retenção</h2>
          <p>
            Dado é mantido enquanto sua conta estiver ativa. Após exclusão solicitada, aplicamos um período de
            retenção técnica (soft-delete) antes da remoção definitiva, conforme prazo configurável do sistema.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">7. Segurança</h2>
          <p>
            Conexão criptografada (HTTPS), senha nunca armazenada em texto puro, e limite de tentativa de acesso
            para reduzir risco de força bruta.
          </p>

          <h2 className="text-base font-semibold text-[#F3EEFB] pt-4">8. Contato</h2>
          <p>Dúvidas sobre esta política: preencher com o e-mail/canal oficial de contato antes de publicar.</p>
        </section>
      </div>
    </div>
  );
}
