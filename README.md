# 🎓 Sistema de Salas UERJ - Modo Demonstração

Este documento contém as credenciais e informações para acessar o sistema.

## 🔐 Credenciais de Acesso

### Administrador

- **Email:** `root@admin.com`
- **Senha:** `Admin@@2028`
- **Permissões:** Acesso completo ao sistema, gerenciamento de usuários, salas, horários e professores

## 🚀 Como Usar

1. Acesse a página de login do sistema
2. Digite as credenciais
3. Explore as funcionalidades disponíveis para cada tipo de usuário

## 📊 Dados de Demonstração

O sistema vem pré-carregado com:

- 3 usuários (Admin, Logística, Professor)
- 4 salas (Sala 101, Lab 202, Auditório Central, Sala 305)
- 3 professores cadastrados
- 3 horários configurados
- 4 solicitações de exemplo (pendentes e aprovadas)

## 🔧 Para rodar o projeto

- Abra o projeto no vscode.
- Abra um terminal para o projeto servicePro e digite `npm install`
- Certifique-se de ter o docker e o docker-compose instalado
- na raiz do projeto digite `docker-compose up -d` para subir os containers.Dentro desse container tera o backend, o banco de dados (mysql 8) , o rabbitmq(mensageria) e o consumidor da fila.
- feito isso , no terminal da pasta servicePro digite `npm run dev` entre com a credencial de admin.

## 📝 Observações

- não altere o yml sem uma comunicação prévia.
- os dados são armazenados em volumes.
