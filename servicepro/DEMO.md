# 🎓 Sistema de Salas UERJ - Modo Demonstração

Este documento contém as credenciais e informações para acessar o sistema em modo demonstração.

## 🔐 Credenciais de Acesso

### Administrador
- **Email:** `admin@uerj.br`
- **Senha:** `admin123`
- **Permissões:** Acesso completo ao sistema, gerenciamento de usuários, salas, horários e professores

### Logística
- **Email:** `logistica@uerj.br`
- **Senha:** `logistica123`
- **Permissões:** Aprovar/rejeitar solicitações, gerenciar salas e horários

### Professor
- **Email:** `professor@uerj.br`
- **Senha:** `professor123`
- **Permissões:** Criar solicitações de salas, visualizar suas solicitações

## 🚀 Como Usar

1. Acesse a página de login do sistema
2. Escolha uma das credenciais acima de acordo com o perfil que deseja testar
3. Explore as funcionalidades disponíveis para cada tipo de usuário

## 🔄 Alternar entre Modo Mock e Backend Real

Para alternar entre dados mockados (demonstração) e backend real:

### 1. **AuthService** (`src/services/authService.ts`)
```typescript
const USE_MOCK = true; // true = demo | false = backend real
```

### 2. **TeacherService** (`src/services/teacherService.ts`)
```typescript
const USE_MOCK = true; // true = demo | false = backend real
```

### 3. **UserService** (`src/services/userService.ts`)
```typescript
const USE_MOCK = true; // true = demo | false = backend real
```

### 4. **ScheduleService** (`src/services/scheduleService.ts`)
```typescript
const USE_MOCK = true; // true = demo | false = backend real
```

### 5. **RoomService** (`src/services/roomService.ts`)
```typescript
const USE_MOCK = true; // true = demo | false = backend real
```

## 📊 Dados de Demonstração

O sistema vem pré-carregado com:
- 3 usuários (Admin, Logística, Professor)
- 4 salas (Sala 101, Lab 202, Auditório Central, Sala 305)
- 3 professores cadastrados
- 3 horários configurados
- 4 solicitações de exemplo (pendentes e aprovadas)

## 🔧 Backend Spring Boot

Quando estiver pronto para conectar ao backend real:

1. Configure o backend Spring Boot (veja o guia em `docs/backend-setup.md`)
2. Altere as flags `USE_MOCK` para `false` em todos os services
3. Configure a URL da API em `src/utils/api.ts`:
```typescript
const API_URL = "http://localhost:8080/api"; // ou sua URL de produção
```

## 📝 Observações

- Todos os dados em modo demonstração são armazenados em memória e serão perdidos ao recarregar a página
- O modo mock simula delays de rede para uma experiência mais realista
- Não é necessário backend rodando para testar o sistema em modo demonstração
