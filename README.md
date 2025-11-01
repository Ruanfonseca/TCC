# 🎓 Sistema de Salas UERJ (Service Pro)

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

## 🔧 Para rodar o projeto

- Abra o projeto no vscode.
- Abra um terminal para o projeto servicePro e digite `npm install`
- Certifique-se de ter o docker e o docker-compose instalado
- na raiz do projeto digite `docker-compose up -d` para subir os containers.Dentro desse container tera o backend, o banco de dados (mysql 8) , o rabbitmq(mensageria) e o consumidor da fila.
- feito isso , no terminal da pasta servicePro digite `npm run dev` entre com a credencial de admin.

## 📝 Observações

- não altere o yml sem uma comunicação prévia.
- os dados são armazenados em volumes.

  Link para visualização do seu funcionamento - https://youtu.be/L9oeMEU0HSE
