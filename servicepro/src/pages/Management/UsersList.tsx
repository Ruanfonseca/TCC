import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  Mail,
  EyeOff,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserResponse, User } from "@/types/userType";
import { userService } from "@/services/userService";
import InputMask from "react-input-mask";

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-destructive/10 text-destructive border-destructive";
    case "LOGISTICA":
      return "bg-primary/10 text-primary border-primary";
    case "ADMIN_LAB":
      return "bg-success/10 text-success border-success";
    default:
      return "bg-muted/10 text-muted-foreground border-muted";
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "LOGISTICA":
      return "Logística";
    case "ADMIN_LAB":
      return "Administrador de Lab";
    default:
      return "Desconhecido";
  }
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/;

const userCreateSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["ADMIN", "LOGISTICA", "ADMIN_LAB"]),
  phone: z.string(),
  status: z.enum(["active", "inactive"]),
  registerNumber: z.string().min(3, "Matrícula é obrigatória"),
  department: z.string().optional(),
  password: z
    .string()
    .regex(
      passwordRegex,
      "A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial."
    ),
});

const userEditSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  role: z.enum(["ADMIN", "LOGISTICA", "ADMIN_LAB"]),
  status: z.enum(["active", "inactive"]),
  registerNumber: z.string().min(3, "Matrícula é obrigatória"),
  department: z.string().optional(),
  password: z.string().optional(),
});

type UserCreateFormData = z.infer<typeof userCreateSchema>;
type UserEditFormData = z.infer<typeof userEditSchema>;

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);

  // Form para criação
  const createForm = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "ADMIN",
      status: "active",
      registerNumber: "",
      department: "",
      password: "",
    },
  });

  // Form para edição
  const editForm = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "ADMIN",
      status: "active",
      registerNumber: "",
      phone: "",
      department: "",
      password: "",
    },
  });

  // Carrega usuários ao montar
  useEffect(() => {
    const load = async () => {
      const data = await userService.getUsers();
      setUsers(data);
    };
    load();
  }, []);

  console.log("Usuários - ", users);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const name = String(user.name ?? "").toLowerCase();
        const email = String(user.email ?? "").toLowerCase();
        const id = String(user.id ?? "").toLowerCase();

        const search = searchTerm.toLowerCase();

        const matchesSearch =
          name.includes(search) ||
          email.includes(search) ||
          id.includes(search);

        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      })
    : [];

  // Create
  const onCreateSubmit = async (data: UserCreateFormData) => {
    const payload: User = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      phone: data.phone,
      registerNumber: data.registerNumber,
      department: data.role === "ADMIN_LAB" ? data.department : undefined,
      password: data.password,
    };

    const created = await userService.createUser(payload);
    setUsers((prev) => [...prev, created]);
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  // Open edit dialog and populate form
  const openEdit = (user: UserResponse) => {
    setSelectedUser(user);
    editForm.setValue("name", user.name);
    editForm.setValue("email", user.email);
    editForm.setValue("role", user.role);
    editForm.setValue("status", user.status);
    editForm.setValue("phone", user.phone);
    editForm.setValue("registerNumber", user.registerNumber);
    editForm.setValue("department", user.department || "");
    editForm.setValue("password", user.password);
    setIsEditDialogOpen(true);
  };

  // Update
  const onEditSubmit = async (data: UserEditFormData) => {
    if (!selectedUser) return;
    const updated = await userService.updateUser(selectedUser.id, {
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      status: data.status,
      registerNumber: data.registerNumber,
      password: data.password,
      department: data.role === "ADMIN_LAB" ? data.department : undefined,
    });
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    editForm.reset();
  };

  // Open delete dialog
  const openDelete = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Delete
  const handleDelete = async () => {
    if (!selectedUser) return;
    await userService.deleteUser(selectedUser.id);
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Usuários
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie usuários e permissões do sistema
          </p>
        </div>

        <div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Usuário</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={createForm.handleSubmit(onCreateSubmit)}
                className="space-y-4 py-2"
              >
                {/* Grid 2 colunas em desktop, 1 em mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      {...createForm.register("name")}
                      placeholder="Digite o nome"
                    />
                    {createForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="registerNumber">Matrícula</Label>
                    <Input
                      id="registerNumber"
                      {...createForm.register("registerNumber")}
                      placeholder="Digite a matrícula"
                    />
                    {createForm.formState.errors.registerNumber && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.registerNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      {...createForm.register("email")}
                      placeholder="email@uerj.br"
                    />
                    {createForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <InputMask
                      mask="(99) 99999-9999"
                      {...createForm.register("phone")}
                    >
                      {(inputProps) => (
                        <Input
                          {...inputProps}
                          id="phone"
                          placeholder="(00) 00000-0000"
                        />
                      )}
                    </InputMask>
                    {createForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Select
                      defaultValue="ADMIN"
                      onValueChange={(val) =>
                        createForm.setValue("role", val as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="LOGISTICA">Logística</SelectItem>
                        <SelectItem value="ADMIN_LAB">
                          Administrador de Laboratório
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {createForm.formState.errors.role && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      defaultValue="active"
                      onValueChange={(val) =>
                        createForm.setValue("status", val as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    {createForm.formState.errors.status && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.status.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Campo departamento (condicional) */}
                {createForm.watch("role") === "ADMIN_LAB" && (
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      {...createForm.register("department")}
                      placeholder="Digite o departamento"
                    />
                    {createForm.formState.errors.department && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.department.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="relative">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...createForm.register("password")}
                    placeholder="Digite a senha"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-[30px] text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {createForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Botões responsivos */}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      createForm.reset();
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary w-full sm:w-auto">
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Roles</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="LOGISTICA">Logística</SelectItem>
                <SelectItem value="ADMIN_LAB">
                  Administrador de Laboratório
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {users.length}
            </div>
            <p className="text-sm text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Administrador de Laboratórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {users.filter((u) => u.role === "ADMIN_LAB").length}
            </div>
            <p className="text-sm text-muted-foreground">
              Role Adm laboratorio
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Logística</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {users.filter((u) => u.role === "LOGISTICA").length}
            </div>
            <p className="text-sm text-muted-foreground">Role Logística</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {users.filter((u) => u.status === "active").length}
            </div>
            <p className="text-sm text-muted-foreground">Online recentemente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Usuários cadastrados no sistema com suas respectivas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getRoleColor(user.role)}
                          >
                            <Shield className="mr-1 h-3 w-3" />
                            {getRoleText(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {user.lastLogin ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.status === "active"
                                ? "bg-success/10 text-success border-success"
                                : "bg-muted/10 text-muted-foreground border-muted"
                            }
                          >
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => openDelete(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Cards no mobile */}
              <div className="grid gap-4 md:hidden">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "bg-success/10 text-success border-success"
                            : "bg-muted/10 text-muted-foreground border-muted"
                        }
                      >
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {user.email}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      ID: {user.id}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Último acesso: {user.lastLogin ?? "-"}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-2 ${getRoleColor(user.role)}`}
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {getRoleText(user.role)}
                    </Badge>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => openDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/** Exclusão */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Excluir Usuário</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o usuário{" "}
                  <span className="font-semibold">{selectedUser?.name}</span>?
                  Essa ação não poderá ser desfeita.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/** Edição */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-lg w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogDescription>
                  Atualize as informações do usuário
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <form
                  onSubmit={editForm.handleSubmit(onEditSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nome *</Label>
                      <Input
                        id="edit-name"
                        {...editForm.register("name")}
                        required
                      />
                      {editForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {editForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Telefone *</Label>
                      <Input
                        id="edit-phone"
                        {...editForm.register("phone")}
                        required
                      />
                      {editForm.formState.errors.phone && (
                        <p className="text-sm text-red-500">
                          {editForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Email *</Label>
                      <Input
                        id="edit-email"
                        {...editForm.register("email")}
                        required
                      />
                      {editForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {editForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Matrícula *</Label>
                      <Input
                        id="edit-matricula"
                        {...editForm.register("registerNumber")}
                        required
                      />
                      {editForm.formState.errors.registerNumber && (
                        <p className="text-sm text-red-500">
                          {editForm.formState.errors.registerNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Role *</Label>
                      <Select
                        value={editForm.watch("role")}
                        onValueChange={(val) =>
                          editForm.setValue("role", val as any)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedUser.role} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                          <SelectItem value="LOGISTICA">Logística</SelectItem>
                          <SelectItem value="ADMIN_LAB">Admin Lab</SelectItem>
                        </SelectContent>
                      </Select>
                      {editForm.formState.errors.role && (
                        <p className="text-sm text-red-500">
                          {editForm.formState.errors.role.message}
                        </p>
                      )}
                    </div>
                    {/* Campo Departamento só se role = ADMIN_LAB */}
                    {editForm.watch("role") === "ADMIN_LAB" && (
                      <div>
                        <Label>Departamento</Label>
                        <Input
                          id="edit-department"
                          {...editForm.register("department")}
                        />
                        {editForm.formState.errors.department && (
                          <p className="text-sm text-red-500">
                            {editForm.formState.errors.department.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <Label>Status *</Label>
                      <Select
                        value={editForm.watch("status")}
                        onValueChange={(val) =>
                          editForm.setValue("status", val as any)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedUser.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      {editForm.formState.errors.status && (
                        <p className="text-sm text-red-500">
                          {editForm.formState.errors.status.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Último Acesso</Label>
                      <Input value={selectedUser.lastLogin ?? ""} readOnly />
                    </div>
                  </div>

                  <div className="relative">
                    <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                    <Input
                      id="edit-password"
                      type={showPassword ? "text" : "password"}
                      {...editForm.register("password")}
                      placeholder="Digite nova senha se deseja alterar"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-[30px] text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {editForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {editForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="flex-1">
                      Salvar Alterações
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setSelectedUser(null);
                        editForm.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
