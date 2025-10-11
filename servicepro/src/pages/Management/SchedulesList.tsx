import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Search, Plus, Edit, Trash2, Clock, CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Schedule, ScheduleResponse } from "@/types/schedule";
import { scheduleService } from "@/services/scheduleService";

const scheduleCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().min(1, "Horário de fim é obrigatório"),
  days: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  semester: z.string().min(1, "Semestre é obrigatório"),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
});

const scheduleEditSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().min(1, "Horário de fim é obrigatório"),
  days: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  semester: z.string().min(1, "Semestre é obrigatório"),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
});

export default function SchedulesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleResponse | null>(null);

  const createForm = useForm<z.infer<typeof scheduleCreateSchema>>({
    resolver: zodResolver(scheduleCreateSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      days: [],
      semester: "",
      status: "inactive",
      description: "",
    },
  });

  const editForm = useForm<z.infer<typeof scheduleEditSchema>>({
    resolver: zodResolver(scheduleEditSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      days: [],
      semester: "",
      status: "inactive",
      description: "",
    },
  });

  const filteredSchedules = schedules.filter((schedule) => {
    const name = schedule?.name ?? "";
    const id = schedule?.id ?? "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || schedule?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Criar
  const handleCreate = async (values: z.infer<typeof scheduleCreateSchema>) => {
    const scheduleData: Schedule = {
      ...values,
    };

    const created = await scheduleService.createSchedule(scheduleData);
    setSchedules((prev) => [...prev, created]);
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  // Atualizar
  const handleUpdate = async (values: z.infer<typeof scheduleEditSchema>) => {
    if (!selectedSchedule) return;

    const updated = await scheduleService.updateSchedule(selectedSchedule.id, {
      ...values,
      createdAt: selectedSchedule.createdAt,
      updatedAt: new Date().toISOString(),
    });

    if (updated) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    }

    setIsEditDialogOpen(false);
    setSelectedSchedule(null);
    editForm.reset();
  };

  // Excluir
  const handleDelete = async () => {
    if (!selectedSchedule) return;

    await scheduleService.deleteSchedule(selectedSchedule.id);
    setSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));

    setIsDeleteDialogOpen(false);
    setSelectedSchedule(null);
  };

  useEffect(() => {
    scheduleService.getSchedule().then(setSchedules);
  }, []);

  console.log("Horarios - ", schedules);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Horários
          </h1>
          <p className="text-muted-foreground">
            Gerencie os horários cadastrados para as turmas
          </p>
        </div>

        {/* Criar */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Horário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Horário</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleCreate)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do horário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={createForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Início *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fim *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createForm.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias da Semana *</FormLabel>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map(
                          (day) => (
                            <div key={day} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(day)}
                                onChange={(e) => {
                                  const newDays = e.target.checked
                                    ? [...(field.value || []), day]
                                    : (field.value || []).filter(
                                        (d) => d !== day
                                      );
                                  field.onChange(newDays);
                                }}
                              />
                              <span className="text-sm">{day}</span>
                            </div>
                          )
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semestre *</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 2025.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Salvar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Horários ({filteredSchedules.length})</CardTitle>
          <CardDescription>Horários cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabela Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Dias</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.id}</TableCell>
                    <TableCell>{schedule.name}</TableCell>
                    <TableCell>
                      {schedule.startTime} - {schedule.endTime}
                    </TableCell>
                    <TableCell>{(schedule.days || []).join(", ")}</TableCell>
                    <TableCell>{schedule.semester}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          schedule.status === "active"
                            ? "bg-green-100 text-green-700 border-green-500"
                            : "bg-gray-100 text-gray-600 border-gray-400"
                        }
                      >
                        {schedule.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            editForm.reset({
                              name: schedule.name,
                              startTime: schedule.startTime,
                              endTime: schedule.endTime,
                              days: schedule.days,
                              semester: schedule.semester,
                              status: schedule.status,
                              description: schedule.description || "",
                            });
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
                            setSelectedSchedule(schedule);
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

          {/* Cards Mobile */}
          <div className="block md:hidden space-y-3">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border rounded-xl p-3 bg-card shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-primary">
                    {schedule.name}
                  </h3>
                  <Badge
                    className={
                      schedule.status === "active"
                        ? "bg-green-100 text-green-700 border-green-500"
                        : "bg-gray-100 text-gray-600 border-gray-400"
                    }
                  >
                    {schedule.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm mt-1">
                  <strong>Horário:</strong> {schedule.startTime} -{" "}
                  {schedule.endTime}
                </p>
                <p className="text-sm">
                  <strong>Dias:</strong> {(schedule.days || []).join(", ")}
                </p>
                <p className="text-sm">
                  <strong>Semestre:</strong> {schedule.semester}
                </p>

                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      editForm.reset(schedule);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Horário</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={editForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dias da Semana *</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map(
                        (day) => (
                          <div key={day} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.value?.includes(day)}
                              onChange={(e) => {
                                const newDays = e.target.checked
                                  ? [...(field.value || []), day]
                                  : (field.value || []).filter(
                                      (d) => d !== day
                                    );
                                field.onChange(newDays);
                              }}
                            />
                            <span className="text-sm">{day}</span>
                          </div>
                        )
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semestre *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Excluir */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Horário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold">{selectedSchedule?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
