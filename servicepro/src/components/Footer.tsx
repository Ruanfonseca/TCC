export default function Footer() {
  return (
    <footer className="w-full border-t bg-background text-foreground mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo/Nome */}
        <div className="hidden md:block text-left text-base font-semibold text-foreground">
          ServicePro
        </div>

        {/* Links */}
        <div className="hidden md:flex flex-row items-center gap-6 text-sm text-muted-foreground">
          <a
            href="/privacidade"
            className="hover:text-foreground transition-colors"
          >
            Política de Privacidade
          </a>
          <a
            href="/support"
            className="hover:text-foreground transition-colors"
          >
            Suporte
          </a>
          <a href="/about" className="hover:text-foreground transition-colors">
            Sobre
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-center text-muted-foreground md:text-sm md:text-right">
          © {new Date().getFullYear()} Desenvolvido por Ruan Fonseca. Todos os
          direitos reservados.
        </div>
      </div>
    </footer>
  );
}
