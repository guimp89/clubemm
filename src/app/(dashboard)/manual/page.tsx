import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AlertTriangle, BookOpen, ShieldCheck } from "lucide-react";

// Static Portuguese content — this is operational documentation specific
// to this account's team and workflow, not a translatable product
// surface, so it's written directly rather than routed through next-intl.
export default function ManualPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manual e Regras do WhatsApp
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Como o WhatsApp Business funciona e como usar o CRM no dia a dia.
          </p>
        </div>
      </div>

      {/* Regras do WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Regras do WhatsApp Business
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Regras da própria Meta — não são limitações do CRM, valem pra
            qualquer sistema que use a API do WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                1. A janela de 24 horas
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  Quando um cliente manda mensagem pra gente, abre uma janela
                  de <strong className="text-foreground">24 horas</strong> em
                  que podemos responder com{" "}
                  <strong className="text-foreground">qualquer texto livre</strong>,
                  sem restrição — igual um WhatsApp normal.
                </p>
                <p>
                  Passadas as 24h sem novo contato do cliente, a janela
                  fecha. Pra falar com ele de novo, só com um{" "}
                  <strong className="text-foreground">modelo aprovado</strong>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                2. Quando é obrigatório usar modelo
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Iniciar contato com alguém que nunca escreveu pra gente</li>
                  <li>Reabrir conversa depois de 24h de silêncio do cliente</li>
                  <li>Qualquer disparo em massa (campanha/marketing)</li>
                </ul>
                <p>
                  Fora esses casos — ou seja, respondendo quem chamou
                  primeiro dentro das 24h — não precisa de modelo.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                3. Categorias de modelo
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong className="text-foreground">Utilidade</strong> —
                    confirmação de pedido, atualização de status, avisos
                    sobre uma transação já existente
                  </li>
                  <li>
                    <strong className="text-foreground">Marketing</strong> —
                    promoções, novidades, convites — exige consentimento do
                    contato
                  </li>
                  <li>
                    <strong className="text-foreground">Autenticação</strong> —
                    códigos de verificação/OTP
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                4. Qualidade da conta e risco de bloqueio
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  A Meta monitora a{" "}
                  <strong className="text-foreground">classificação de
                  qualidade</strong> do número (visível em WhatsApp Manager →
                  Números de telefone). Muitos bloqueios ou denúncias de
                  clientes derrubam essa qualidade e podem levar a:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Redução do limite de mensagens por dia</li>
                  <li>Suspensão temporária do número</li>
                  <li>Banimento definitivo em casos graves</li>
                </ul>
                <p>
                  Por isso: nunca mandar mensagem em massa pra quem não deu
                  consentimento, e nunca comprar lista pronta de contatos.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                5. O que evitar
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                <ul className="list-disc list-inside space-y-1">
                  <li>Mandar modelo de marketing pra quem não deu opt-in</li>
                  <li>Mandar muitas mensagens seguidas pro mesmo contato em pouco tempo</li>
                  <li>Usar linguagem de spam/urgência exagerada nos modelos (a Meta rejeita)</li>
                  <li>Ignorar pedidos de descadastro/"pare de me mandar mensagem"</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Manual de uso do CRM */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Manual de Funcionamento do CRM
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Como usar as principais telas no dia a dia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Caixa de entrada — responder clientes
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  Todas as conversas do WhatsApp chegam aqui. Clique numa
                  conversa pra ver o histórico e responder. Se o cliente
                  escreveu nas últimas 24h, é só digitar e enviar — texto
                  livre. Se passou de 24h (ou é o primeiro contato), use o
                  botão de enviar modelo.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Contatos — buscar, filtrar e organizar
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-foreground">Buscar:</strong> por nome, telefone ou e-mail</li>
                  <li><strong className="text-foreground">Filtrar por etiqueta:</strong> clique em "Filtrar por etiquetas" e marque as que quer ver</li>
                  <li><strong className="text-foreground">Importar:</strong> botão "Importar" — CSV com colunas <code className="rounded bg-muted px-1 text-xs">phone,name,email,tags</code> (só telefone é obrigatório)</li>
                  <li><strong className="text-foreground">Selecionar e apagar em massa:</strong> marca as caixinhas → se marcar todos da página, aparece a opção de selecionar todos os resultados do filtro atual, não só a página</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Modelos de mensagem
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  Modelos são criados e aprovados direto no Meta WhatsApp
                  Manager (fora do CRM). Depois de aprovados, sincronize em{" "}
                  <strong className="text-foreground">Configurações → Modelos</strong>{" "}
                  pra eles aparecerem disponíveis aqui na hora de enviar.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Funis — acompanhar negociações
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                Quadro estilo Kanban pra acompanhar vendas em andamento,
                ligadas às conversas do WhatsApp. Arraste o card entre as
                colunas conforme a negociação avança.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Disparos — campanhas em massa
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                Envia um modelo aprovado pra uma lista de contatos de uma
                vez. Só funciona com contatos que deram consentimento —
                lembrete: mandar campanha pra quem não autorizou é o
                principal motivo de bloqueio de número.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Automações e Fluxos
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  <strong className="text-foreground">Automações:</strong>{" "}
                  regras simples ("quando X acontece, faça Y") — ex: marcar
                  automaticamente com uma etiqueta todo contato novo.
                </p>
                <p>
                  <strong className="text-foreground">Fluxos:</strong>{" "}
                  chatbot com etapas (editor visual) pra atendimento
                  automático mais elaborado, com múltiplas perguntas/opções.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Papéis e permissões da equipe
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-foreground">Proprietário:</strong> controle total, único que pode transferir a propriedade da conta</li>
                  <li><strong className="text-foreground">Administrador:</strong> gerencia configurações, cria etiquetas/campos, convida gente</li>
                  <li><strong className="text-foreground">Atendente:</strong> responde mensagens, cria/edita contatos, sem acesso a configurações</li>
                  <li><strong className="text-foreground">Visualizador:</strong> só consulta, não pode agir</li>
                </ul>
                <p>Gerencie em Configurações → Membros da equipe.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border-border">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Conexão com o WhatsApp
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                Fica em Configurações → Conexão com WhatsApp: credenciais da
                API, token de acesso, webhook e status de registro do
                número. Use o botão "Verificar com a Meta" se as mensagens
                pararem de chegar — ele confirma se o webhook ainda está
                ativo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
        <AlertTriangle className="size-4 shrink-0 mt-0.5" />
        <p>
          Em caso de dúvida antes de mandar mensagem em massa pra uma base
          grande: confirme se todos os contatos deram consentimento
          explícito. Isso vale tanto pra WhatsApp quanto pra e-mail — já
          tivemos suspensão de conta de e-mail por esse motivo.
        </p>
      </div>
    </div>
  );
}
