import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import uerjLogo from "@/assets/uerj-logo.png";
import { RootState } from "@/store/app/store";
import { loginRequest } from "@/store/features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado local do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado global do Redux
  const { isAuthenticated, user, error, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  // Redireciona se logado com sucesso
  useEffect(() => {
    if (isAuthenticated && user) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.name}`,
      });
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginRequest({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uerj-blue-light/20 via-background to-uerj-orange-light/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={uerjLogo} alt="UERJ" className="h-16 w-16" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              Sistema de Salas UERJ
            </CardTitle>
            <CardDescription className="text-base">
              Faça login para acessar o sistema de reservas
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@uerj.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center text-sm text-muted-foreground">
        © 2024 Universidade do Estado do Rio de Janeiro - Todos os direitos
        reservados
      </div>
    </div>
  );
}
