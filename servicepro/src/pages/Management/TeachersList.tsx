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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Users, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { teacherService } from "@/services/teacherService";
import { Teacher, TeacherResponse } from "@/types/teacherType";

const teacherSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(8, "Telefone obrigatório")
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido"),
  department: z.string().min(3, "Departamento obrigatório"),
  status: z.enum(["active", "inactive"]),
  registration: z.string().min(1, "Matrícula obrigatória"),
  specialization: z.string().optional(),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "A senha deve conter letras maiúsculas, minúsculas, números e um caractere especial"
    ),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function TeachersList() {
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherResponse | null>(null);

  // Carregar professores ao montar
  useEffect(() => {
    teacherService.getTeachers().then((data: any[]) => {
      const formatted = data.map((t) => ({
        id: String(t.id),
        name: t.nome,
        email: t.email,
        phone: t.phone,
        department: t.departamento,
        status: t.status,
        registerNumber: t.matricula,
        specialization: t.especialidade,
        totalRequests: t.totalRequests,
        approvedRequests: t.approvedRequests,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }));
      setTeachers(formatted);
    });
  }, []);

  // Filtrar
  const filteredTeachers = (teachers ?? []).filter((teacher) => {
    const name = (teacher?.name || "").toLowerCase();
    const email = (teacher?.email || "").toLowerCase();
    const department = (teacher?.department || "").toLowerCase();
    const status = (teacher?.status || "").toLowerCase();
    const term = (searchTerm || "").toLowerCase();

    return (
      name.includes(term) ||
      email.includes(term) ||
      department.includes(term) ||
      status.includes(term)
    );
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      status: "active",
      registration: "",
      specialization: "",
      password: "",
    },
  });
  const onSubmit = async (data: TeacherFormData) => {
    const payload: Teacher = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      status: data.status,
      specialization: data.specialization,
      registerNumber: data.registration,
      password: data.password,
    };

    await teacherService.createTeacher(payload);

    // Como o POST não retorna o objeto, precisamos buscar de novo:
    const updatedList = await teacherService.getTeachers();
    setTeachers(updatedList);

    setOpenModal(false);
    reset();
  };

  const handleDelete = async (id: string) => {
    await teacherService.deleteTeacher(id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // coloque essa função dentro do mesmo componente, acima do return()
  async function handleEditTeacher(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedTeacher) {
      console.warn("⚠️ Nenhum professor selecionado para edição.");
      return;
    }

    const payload: Teacher = {
      name: selectedTeacher.name,
      email: selectedTeacher.email,
      phone: selectedTeacher.phone,
      department: selectedTeacher.department,
      status: selectedTeacher.status,
      registerNumber: selectedTeacher.registerNumber,
      specialization: selectedTeacher.specialization,
    };

    if (selectedTeacher.password && selectedTeacher.password.trim() !== "") {
      payload.password = selectedTeacher.password; // só envia se foi digitada
    }

    try {
      const response = await teacherService.updateTeacher(
        selectedTeacher.id,
        payload
      );

      setTeachers((prev) => {
        const updated = prev.map((t) =>
          t.id === selectedTeacher.id ? selectedTeacher : t
        );

        return updated;
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
    }
  }

  console.log("Professores - ", teachers);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Professores
          </h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de professores do sistema
          </p>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl w-[95%] md:max-w-3xl rounded-xl shadow-lg">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-xl md:text-2xl font-semibold text-primary">
                Cadastrar Professor
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Preencha as informações abaixo para adicionar um novo professor
                ao sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
              {/* GRID 2 colunas em desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Digite o nome"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="email@uerj.br"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="registration">Matrícula</Label>
                  <Input
                    id="registration"
                    {...register("registration")}
                    placeholder="PROF-001"
                  />
                  {errors.registration && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.registration.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    {...register("department")}
                    placeholder="Departamento de ..."
                  />
                  {errors.department && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="specialization">Especialização</Label>
                  <Input
                    id="specialization"
                    {...register("specialization")}
                    placeholder="Área de especialização"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="(21) 99999-9999"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Digite uma senha"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    defaultValue="active"
                    onValueChange={(value) =>
                      setValue("status", value as "active" | "inactive")
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
                </div>
              </div>

              <DialogFooter className="pt-4 border-t mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenModal(false)}
                  className="w-full md:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary w-full md:w-auto hover:bg-primary/90"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Search className="h-5 w-5" />
            Buscar Professores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total de Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {teachers.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Professores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-success">
              {teachers.filter((t) => t.status === "active").length}
            </div>
            <p className="text-sm text-muted-foreground">
              Com acesso ao sistema
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-accent">
              {new Set(teachers.map((t) => t.department)).size}
            </div>
            <p className="text-sm text-muted-foreground">
              Diferentes departamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-5 w-5" />
            Lista de Professores ({filteredTeachers.length})
          </CardTitle>
          <CardDescription>
            Professores cadastrados no sistema de reservas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Especialização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {teacher.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {teacher.specialization || "Não informado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          teacher.status === "active"
                            ? "bg-success/10 text-success border-success"
                            : "bg-muted/10 text-muted-foreground border-muted"
                        }
                      >
                        {teacher.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsDeleteDialogOpen(true);
                          }}
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
        </CardContent>
      </Card>

      {/**Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Professor</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o professor{" "}
              <span className="font-semibold">{selectedTeacher?.name}</span>?
              Essa ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (selectedTeacher) {
                  handleDelete(selectedTeacher.id);
                  setIsDeleteDialogOpen(false);
                }
              }}
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

      {/* Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Professor</DialogTitle>
            <DialogDescription>
              Atualize as informações do professor
            </DialogDescription>
          </DialogHeader>

          {selectedTeacher && (
            <form onSubmit={handleEditTeacher} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={selectedTeacher.name}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedTeacher.email}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="registration">Matrícula *</Label>
                <Input
                  id="registration"
                  value={selectedTeacher.registerNumber}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      registerNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialization">Especialização</Label>
                <Input
                  id="specialization"
                  value={selectedTeacher.specialization || ""}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      specialization: e.target.value,
                    })
                  }
                  placeholder="Área de especialização"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite nova senha (deixe em branco para não alterar)"
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={selectedTeacher.phone}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="department">Departamento *</Label>
                <Input
                  id="department"
                  value={selectedTeacher.department}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedTeacher.status}
                  onValueChange={(value) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      status: value as "active" | "inactive",
                    })
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
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" className="bg-primary">
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
