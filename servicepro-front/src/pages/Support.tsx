import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Dados de FAQ (pode vir de API ou arquivo separado)
const faqData = [
  {
    question: "Como solicitar uma sala?",
    answer:
      "Para solicitar uma sala, acesse a seção 'Requerimento Sala' no menu lateral, preencha o formulário com as informações da disciplina, data, horário e número de alunos. Após o envio, você receberá um token para acompanhar o status da solicitação.",
  },
  {
    question: "Quanto tempo demora para obter resposta?",
    answer:
      "As solicitações são analisadas pela equipe de logística em até 2 dias úteis. Você pode acompanhar o status usando o token fornecido ou verificando na seção 'Pesquisar Por Token'.",
  },
  {
    question: "O que fazer se minha solicitação foi rejeitada?",
    answer:
      "Se sua solicitação foi rejeitada, você pode verificar o motivo na seção de detalhes da solicitação. É possível fazer uma nova solicitação com informações atualizadas ou entrar em contato com o suporte para esclarecimentos.",
  },
  {
    question: "Posso cancelar uma solicitação aprovada?",
    answer:
      "Sim, solicitações aprovadas podem ser canceladas entrando em contato com a equipe de logística por email ou telefone. Recomendamos avisar com pelo menos 48 horas após a solicitação.",
  },
  {
    question: "Como alterar uma reserva existente?",
    answer:
      "Para alterar uma reserva, entre em contato com a equipe de logística informando o token da solicitação e as alterações desejadas. Dependendo da disponibilidade, a alteração poderá ser feita.",
  },
  {
    question: "O que fazer se esqueci meu token?",
    answer:
      "Se você esqueceu seu token, pode encontrá-lo no email de confirmação enviado quando fez a solicitação.",
  },
];

export default function Support(): JSX.Element {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (key: string, value: string) => {
    setContactForm((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples (pode ser substituída por Zod / react-hook-form)
    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      setSuccessMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    // Simulação de envio (substituir por fetch/axios)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        "Mensagem enviada com sucesso! Em breve entraremos em contato."
      );
      setContactForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Suporte e FAQ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encontre respostas para suas dúvidas ou entre em contato conosco
        </p>
      </header>

      {/* Contatos rápidos: responsivo - mobile: col-1, md: cols-3 */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5" /> <span>Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-medium">suporte.salas@uerj.br</div>
              <div className="text-sm text-muted-foreground">
                Resposta em até 24 horas
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5" /> <span>Telefone</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-medium">(21) 2334-0000</div>
              <div className="text-sm text-muted-foreground">
                Seg-Sex: 8h às 17h
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" /> <span>Horário</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-medium">Segunda a Sexta</div>
              <div className="text-sm text-muted-foreground">8:00 às 17:00</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Corpo principal: FAQ + Formulário (em telas maiores lado a lado) */}
      <section>
        {/* FAQ ocupa 2 colunas em desktop */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" /> Perguntas Frequentes
              </CardTitle>
              <CardDescription>
                Encontre respostas rápidas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <Collapsible
                    key={index}
                    open={openFaq === index}
                    onOpenChange={() => handleFaqToggle(index)}
                  >
                    <div className="border rounded-lg overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button
                          aria-expanded={openFaq === index}
                          className="w-full flex items-center justify-between p-4 text-left bg-transparent"
                        >
                          <span className="font-medium">{faq.question}</span>
                          {openFaq === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 text-sm text-muted-foreground">
                          {faq.answer}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Informações adicionais (full width) */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary mt-1"
                >
                  <Users className="mr-1 h-3 w-3" /> Logística
                </Badge>
                <div>
                  <div className="font-medium">Equipe de Logística</div>
                  <div className="text-sm text-muted-foreground">
                    Responsável pela aprovação e gerenciamento das solicitações
                    de salas
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="bg-warning/10 text-warning border-warning mt-1"
                >
                  <Clock className="mr-1 h-3 w-3" /> Prazo
                </Badge>
                <div>
                  <div className="font-medium">Tempo de Resposta</div>
                  <div className="text-sm text-muted-foreground">
                    Solicitações são processadas em até 2 dias úteis
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="bg-success/10 text-success border-success mt-1"
                >
                  <FileText className="mr-1 h-3 w-3" /> Token
                </Badge>
                <div>
                  <div className="font-medium">Acompanhamento</div>
                  <div className="text-sm text-muted-foreground">
                    Use o token fornecido para acompanhar o status da sua
                    solicitação
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
