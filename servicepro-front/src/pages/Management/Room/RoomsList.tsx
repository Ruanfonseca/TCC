import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building,
  Users,
  MapPin,
} from "lucide-react";
import { Room, RoomResponse } from "@/types/roomType";
import { roomsService } from "@/services/roomService";

const roomCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  block: z.string().min(1, "Bloco é obrigatório"),
  capacity: z.coerce.number().min(1, "Capacidade deve ser maior que 0"),
  type: z.string().min(1, "Tipo é obrigatório"),
  floor: z.coerce.number().min(0, "Andar deve ser 0 ou maior"),
  equipment: z.array(z.string()),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
});

const roomEditSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  block: z.string().min(1, "Bloco é obrigatório"),
  capacity: z.coerce.number().min(1, "Capacidade deve ser maior que 0"),
  type: z.string().min(1, "Tipo é obrigatório"),
  floor: z.coerce.number().min(0, "Andar deve ser 0 ou maior"),
  equipment: z.array(z.string()),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
});

const getTypeColor = (type: string) => {
  switch (type) {
    case "Sala de Aula":
      return "bg-primary/10 text-primary border-primary";
    case "Laboratório":
      return "bg-accent/10 text-accent border-accent";
    case "Auditório":
      return "bg-warning/10 text-warning border-warning";
    case "Sala de Reunião":
      return "bg-success/10 text-success border-success";
    default:
      return "bg-muted/10 text-muted-foreground border-muted";
  }
};

export default function RoomsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const availableEquipment = [
    "Projetor",
    "Computador",
    "Sistema de Som",
    "Quadro Interativo",
    "Ar Condicionado",
    "Quadro Branco",
    "TV",
    "Microfones",
    "Bancadas",
    "Capela",
    "Chuveiro de Emergência",
    "Mesa de Reunião",
  ];

  const normalizeRoom = (room: any) => ({
    ...room,
    equipment: Array.isArray(room?.equipment) ? room.equipment : [],
    capacity: Number(room?.capacity ?? 0),
    floor: Number(room?.floor ?? 0),
  });

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      (room.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (room.block?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (room.type?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesBlock = blockFilter === "all" || room.block === blockFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;

    return matchesSearch && matchesBlock && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const createForm = useForm<z.infer<typeof roomCreateSchema>>({
    resolver: zodResolver(roomCreateSchema),
    defaultValues: {
      name: "",
      block: "",
      capacity: 0,
      type: "",
      equipment: [],
      floor: 0,
      description: "",
      status: "active",
    },
  });

  const editForm = useForm<z.infer<typeof roomEditSchema>>({
    resolver: zodResolver(roomEditSchema),
    defaultValues: {
      name: "",
      block: "",
      capacity: 0,
      type: "",
      equipment: [],
      floor: 0,
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    roomsService
      .getRooms()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const safeRooms = list.map((r: any) => ({
          ...r,
          equipment: Array.isArray(r.equipment) ? r.equipment : [],
        }));
        setRooms(safeRooms);
      })
      .catch(() => {
        setRooms([]); // fallback em caso de erro na API
      });
  }, [rooms]);

  const handleCreate = async (values: z.infer<typeof roomCreateSchema>) => {
    const roomData: Room = {
      ...values,
      capacity: Number(values.capacity),
      floor: Number(values.floor),
    };

    const created = await roomsService.createRoom(roomData);

    const safeCreated = normalizeRoom(created);

    setRooms((prev) => [...prev, safeCreated]);

    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  const handleUpdate = async (values: z.infer<typeof roomEditSchema>) => {
    if (!selectedRoom) return;

    const updated = await roomsService.updateRoom(selectedRoom.id, values);

    const safeUpdated = normalizeRoom(updated);

    setRooms((prev) => [...prev, safeUpdated]);

    setIsEditDialogOpen(false);
    setSelectedRoom(null);
    editForm.reset();
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;

    await roomsService.deleteRoom(selectedRoom.id);

    setRooms((prev) => prev.filter((room) => room.id !== selectedRoom.id));

    setIsDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Salas</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie as salas disponíveis
          </p>
        </div>

        {/* Create dialog trigger */}
        <div className="w-full sm:w-auto">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                aria-label="Adicionar nova sala"
              >
                <Plus className="mr-2 h-4 w-4" /> Nova Sala
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Sala</DialogTitle>
                <DialogDescription>
                  Preencha as informações da nova sala
                </DialogDescription>
              </DialogHeader>

              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Sala *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Sala 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="block"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bloco *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o bloco" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Anexo">Anexo</SelectItem>
                              <SelectItem value="Predio1">Prédio I</SelectItem>
                              <SelectItem value="Predio2">Prédio II</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <FormField
                      control={createForm.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacidade *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo de sala" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sala de Aula">
                                Sala de Aula
                              </SelectItem>
                              <SelectItem value="Laboratório">
                                Laboratório
                              </SelectItem>
                              <SelectItem value="Auditório">
                                Auditório
                              </SelectItem>
                              <SelectItem value="Sala de Reunião">
                                Sala de Reunião
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Andar *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipamentos</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                          {availableEquipment.map((eq) => (
                            <div
                              key={eq}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={field.value?.includes(eq)}
                                onCheckedChange={(checked) => {
                                  const newEquipment = checked
                                    ? [...(field.value || []), eq]
                                    : (field.value || []).filter(
                                        (e) => e !== eq,
                                      );
                                  field.onChange(newEquipment);
                                }}
                              />
                              <Label className="text-sm">{eq}</Label>
                            </div>
                          ))}
                        </div>
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
                          <Textarea
                            placeholder="Descrição da sala..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="w-full sm:flex-1">
                      Cadastrar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:flex-1"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Buscar por nome, bloco ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Select value={blockFilter} onValueChange={setBlockFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bloco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Anexo">Anexo</SelectItem>
                  <SelectItem value="Predio1">Prédio 1</SelectItem>
                  <SelectItem value="Predio2">Prédio 2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Sala de Aula">Sala de Aula</SelectItem>
                  <SelectItem value="Laboratório">Laboratório</SelectItem>
                  <SelectItem value="Auditório">Auditório</SelectItem>
                  <SelectItem value="Sala de Reunião">
                    Sala de Reunião
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-primary">
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success">
          <CardHeader>
            <CardTitle>Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rooms.filter((r) => r.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning">
          <CardHeader>
            <CardTitle>Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rooms.filter((r) => r.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent">
          <CardHeader>
            <CardTitle>Capacidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rooms.reduce(
                (sum, room) => sum + Number(room.capacity || 0),
                0,
              )}{" "}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> Lista de Salas (
            {filteredRooms.length})
          </CardTitle>
          <CardDescription>Salas cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Table for md+ */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Sala</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Localização
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Capacidade
                  </TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Equipamentos
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{room.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {room.block}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {room.capacity}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getTypeColor(room.type)}
                      >
                        {room.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {(room.equipment || []).slice(0, 2).map((eq) => (
                        <Badge
                          key={eq}
                          variant="secondary"
                          className="text-xs mr-1"
                        >
                          {eq}
                        </Badge>
                      ))}
                      {(room.equipment || []).map((eq) => (
                        <Badge key={eq} variant="secondary" className="text-xs">
                          {eq}
                        </Badge>
                      ))}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          room.status === "active"
                            ? "bg-success/10 text-success border-success"
                            : room.status === "maintenance"
                              ? "bg-warning/10 text-warning border-warning"
                              : "bg-muted/10 text-muted-foreground border-muted"
                        }
                      >
                        {room.status === "active"
                          ? "Ativa"
                          : room.status === "maintenance"
                            ? "Manutenção"
                            : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedRoom(room);
                            editForm.reset({
                              name: room.name,
                              block: room.block,
                              capacity: room.capacity,
                              type: room.type,
                              floor: room.floor,
                              equipment: room.equipment,
                              description: room.description || "",
                              status: room.status as
                                | "active"
                                | "inactive"
                                | "maintenance",
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
                            setSelectedRoom(room);
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
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>

          {/* Cards for mobile/tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {paginatedRooms.map((room) => (
              <article key={room.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    <div className="text-xs text-muted-foreground">
                      {room.id}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {room.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {room.block} - {room.floor}º
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {room.capacity} pessoas
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant="outline"
                      className={getTypeColor(room.type)}
                    >
                      {room.type}
                    </Badge>
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRoom(room);
                          editForm.reset({
                            name: room.name,
                            block: room.block,
                            capacity: room.capacity,
                            type: room.type,
                            floor: room.floor,
                            equipment: room.equipment,
                            description: room.description || "",
                            status: room.status as
                              | "active"
                              | "inactive"
                              | "maintenance",
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
                          setSelectedRoom(room);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Equipment */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.equipment.map((eq) => (
                    <Badge key={eq} variant="secondary" className="text-xs">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
            {/* Pagination Mobile */}
            <div className="flex flex-col gap-2 mt-4 md:hidden">
              <div className="text-sm text-muted-foreground text-center">
                Página {currentPage} de {totalPages}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/**Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Sala</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a sala{" "}
              <span className="font-semibold">{selectedRoom?.name}</span>? Essa
              ação não poderá ser desfeita.
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

      {/**Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Sala</DialogTitle>
            <DialogDescription>
              Atualize as informações da sala
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Sala *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloco *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Anexo">Anexo</SelectItem>
                          <SelectItem value="Predio1">Prédio 1</SelectItem>
                          <SelectItem value="Predio2">Prédio 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={editForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sala de Aula">
                            Sala de Aula
                          </SelectItem>
                          <SelectItem value="Laboratório">
                            Laboratório
                          </SelectItem>
                          <SelectItem value="Auditório">Auditório</SelectItem>
                          <SelectItem value="Sala de Reunião">
                            Sala de Reunião
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Andar *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamentos</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {availableEquipment.map((eq) => (
                        <div key={eq} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(eq)}
                            onCheckedChange={(checked) => {
                              const newEquipment = checked
                                ? [...(field.value || []), eq]
                                : (field.value || []).filter((e) => e !== eq);
                              field.onChange(newEquipment);
                            }}
                          />
                          <Label className="text-sm">{eq}</Label>
                        </div>
                      ))}
                    </div>
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
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="flex-1">
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
