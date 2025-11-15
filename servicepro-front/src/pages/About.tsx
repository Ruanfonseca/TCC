import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Users, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sobre o ServicePro
        </h1>
        <p className="text-muted-foreground mt-2">
          Sistema de Gerenciamento de Requerimentos da UERJ
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Origem e Motivação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            O <strong>ServicePro</strong> foi desenvolvido para atender a uma
            necessidade crítica da Universidade do Estado do Rio de Janeiro
            (UERJ): a organização e gestão eficiente de requerimentos de salas e
            laboratórios.
          </p>

          <p className="text-muted-foreground">
            Antes do ServicePro, o processo de solicitação e aprovação de
            espaços era manual, sujeito a erros, conflitos de agendamento e
            dificuldades na comunicação entre professores e a equipe de
            logística. Isso resultava em:
          </p>

          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Duplicação de reservas para o mesmo espaço e horário</li>
            <li>Perda de solicitações em processos burocráticos</li>
            <li>Dificuldade em rastrear o status de requerimentos</li>
            <li>Falta de dados consolidados para relatórios e análises</li>
          </ul>

          <p className="text-muted-foreground">
            Com a digitalização e automação desses processos, o ServicePro traz
            agilidade, transparência e controle, permitindo que professores,
            administradores e equipe de logística trabalhem de forma mais
            integrada e eficiente.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Missão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Facilitar o gerenciamento de requerimentos acadêmicos, promovendo
              eficiência, transparência e colaboração entre todos os envolvidos
              no processo educacional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Público-Alvo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Professores</Badge>
              <Badge>Logística</Badge>
              <Badge>Administradores</Badge>
              <Badge>Coordenadores</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Sistema desenvolvido para atender todas as necessidades da
              comunidade acadêmica da UERJ.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Funcionalidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Solicitação de salas e laboratórios</li>
              <li>• Gestão de aprovações</li>
              <li>• Agenda centralizada</li>
              <li>• Relatórios e análises</li>
              <li>• Controle de recursos</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tecnologias Utilizadas</CardTitle>
          <CardDescription>Stack moderna e robusta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">Spring Boot</Badge>
            <Badge variant="outline">PostgreSQL</Badge>
            <Badge variant="outline">JWT Authentication</Badge>
            <Badge variant="outline">Axios</Badge>
            <Badge variant="outline">Shadcn UI</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
