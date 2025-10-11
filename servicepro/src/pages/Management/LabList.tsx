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
  Beaker,
  Users,
  MapPin,
} from "lucide-react";
import { Laboratorio, TipoLab } from "@/types/labType";
import { labService, LaboratorioResponse } from "@/services/labService";
import { getTypeColor, normalizeTipoLab } from "@/utils/util";

const labCreateSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  bloco: z.string().min(1, "Bloco é obrigatório"),
  capacidade: z.string().min(1, "Capacidade é obrigatória"),
  tipoLab: z.nativeEnum(TipoLab),
  andar: z.string().min(1, "Andar é obrigatório"),
  equipamento: z.array(z.string()),
  descricao: z.string().optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
});

const labEditSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  bloco: z.string().min(1, "Bloco é obrigatório"),
  capacidade: z.string().min(1, "Capacidade é obrigatória"),
  tipoLab: z.nativeEnum(TipoLab),
  andar: z.string().min(1, "Andar é obrigatório"),
  equipamento: z.array(z.string()),
  descricao: z.string().optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
});

export default function LabList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<LaboratorioResponse | null>(
    null
  );
  const [labs, setLabs] = useState<LaboratorioResponse[]>([]);

  const createForm = useForm<z.infer<typeof labCreateSchema>>({
    resolver: zodResolver(labCreateSchema),
    defaultValues: {
      nome: "",
      bloco: "",
      capacidade: "",
      equipamento: [],
      status: "active",
      andar: "",
      descricao: "",
      tipoLab: TipoLab.DIDATICO,
    },
  });

  const editForm = useForm<z.infer<typeof labEditSchema>>({
    resolver: zodResolver(labEditSchema),
    defaultValues: {
      nome: "",
      bloco: "",
      capacidade: "",
      equipamento: [],
      status: "active",
      andar: "",
      descricao: "",
      tipoLab: TipoLab.DIDATICO,
    },
  });

  useEffect(() => {
    labService.getLaboratorios().then(setLabs);
  }, []);

  const availableEquipment = [
    "Capela",
    "Chuveiro de Emergência",
    "Bancadas",
    "Microscópios",
    "Centrífuga",
    "Termociclador",
    "Osciloscópio",
    "Gerador de Funções",
    "Multímetros",
    "Computadores",
    "Projetor",
    "Ar Condicionado",
  ];

  const filteredLabs = labs.filter((lab) => {
    const nome = lab.nome || "";
    const bloco = lab.bloco || "";
    const tipoLab = lab.tipoLab?.toString() || "";
    const status = lab.status || "";

    const matchesSearch =
      nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bloco.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBlock = blockFilter === "all" || bloco === blockFilter;
    const matchesType = typeFilter === "all" || tipoLab === typeFilter;
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesBlock && matchesType && matchesStatus;
  });

  const handleCreate = async (values: z.infer<typeof labCreateSchema>) => {
    const labData: Laboratorio = {
      nome: values.nome,
      bloco: values.bloco,
      capacidade: values.capacidade,
      tipoLab: values.tipoLab,
      andar: values.andar,
      equipamento: values.equipamento,
      descricao: values.descricao || "",
      status: values.status,
    };
    const created = await labService.createLab(labData);
    setLabs((prev) => [...prev, created]);
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  const handleUpdate = async (values: z.infer<typeof labEditSchema>) => {
    if (!selectedLab) return;
    const labData: Laboratorio = {
      nome: values.nome,
      bloco: values.bloco,
      capacidade: values.capacidade,
      tipoLab: values.tipoLab,
      andar: values.andar,
      equipamento: values.equipamento,
      descricao: values.descricao || "",
      status: values.status,
    };
    const updated = await labService.updateLab(selectedLab.id, labData);
    setLabs((prev) =>
      prev.map((lab) => (lab.id === updated.id ? updated : lab))
    );
    setIsEditDialogOpen(false);
    setSelectedLab(null);
    editForm.reset();
  };

  const handleDelete = async () => {
    if (!selectedLab) return;
    await labService.deleteLab(selectedLab.id);
    setLabs((prev) => prev.filter((lab) => lab.id !== selectedLab.id));
    setIsDeleteDialogOpen(false);
    setSelectedLab(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Laboratórios</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie os laboratórios disponíveis
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Novo Laboratório
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Laboratório</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo laboratório
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
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Lab. Química Geral"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="bloco"
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
                              <SelectItem value="Bloco A">Bloco A</SelectItem>
                              <SelectItem value="Bloco B">Bloco B</SelectItem>
                              <SelectItem value="Bloco C">Bloco C</SelectItem>
                              <SelectItem value="Bloco D">Bloco D</SelectItem>
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
                      name="capacidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacidade *</FormLabel>
                          <FormControl>
                            <Input placeholder="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="tipoLab"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value) as TipoLab)
                            }
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Didático</SelectItem>
                              <SelectItem value="1">
                                Didático e Pesquisa
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="andar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Andar *</FormLabel>
                          <FormControl>
                            <Input placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="equipamento"
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
                                        (e) => e !== eq
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
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrição do laboratório..."
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
              placeholder="Buscar por nome ou bloco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Select value={blockFilter} onValueChange={setBlockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Bloco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Bloco A">Bloco A</SelectItem>
                  <SelectItem value="Bloco B">Bloco B</SelectItem>
                  <SelectItem value="Bloco C">Bloco C</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="DIDATICO">Didático</SelectItem>
                  <SelectItem value="DIDATICO_PESQUISA">
                    Didático e Pesquisa
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
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
            <div className="text-2xl font-bold">{labs.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success">
          <CardHeader>
            <CardTitle>Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labs.filter((l) => l.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning">
          <CardHeader>
            <CardTitle>Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labs.filter((l) => l.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent">
          <CardHeader>
            <CardTitle>Capacidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labs.reduce((s, l) => s + parseInt(l.capacidade), 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Labs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" /> Lista de Laboratórios (
            {filteredLabs.length})
          </CardTitle>
          <CardDescription>Laboratórios cadastrados</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Laboratório</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Equipamentos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabs.map((lab) => {
                  const tipoNormalizado = normalizeTipoLab(lab.tipoLab);
                  const tipoLabel =
                    tipoNormalizado === "didatico"
                      ? "Didático"
                      : tipoNormalizado === "didatico/pesquisa"
                      ? "Didático/Pesquisa"
                      : "Outro";

                  return (
                    <TableRow key={lab.id}>
                      <TableCell>
                        <div className="font-medium">{lab.nome}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {lab.bloco} - Andar {lab.andar}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {lab.capacidade}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getTypeColor(lab.tipoLab)}
                        >
                          {tipoLabel}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs">
                          {lab.equipamento.slice(0, 2).join(", ")}
                          {lab.equipamento.length > 2 &&
                            ` +${lab.equipamento.length - 2}`}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            lab.status === "active" ? "default" : "secondary"
                          }
                        >
                          {lab.status === "active"
                            ? "Ativo"
                            : lab.status === "maintenance"
                            ? "Manutenção"
                            : "Inativo"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedLab(lab);
                              editForm.reset({
                                nome: lab.nome,
                                bloco: lab.bloco,
                                capacidade: lab.capacidade,
                                tipoLab: lab.tipoLab,
                                andar: lab.andar,
                                equipamento: lab.equipamento,
                                descricao: lab.descricao || "",
                                status: lab.status as
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
                            onClick={() => {
                              setSelectedLab(lab);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredLabs.map((lab) => {
              const tipoNormalizado = normalizeTipoLab(lab.tipoLab);
              const tipoLabel =
                tipoNormalizado === "didatico"
                  ? "Didático"
                  : tipoNormalizado === "didatico/pesquisa"
                  ? "Didático/Pesquisa"
                  : "Outro";

              return (
                <Card key={lab.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{lab.nome}</CardTitle>
                    <CardDescription>
                      {lab.bloco} - Andar {lab.andar}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Capacidade:
                      </span>
                      <span className="text-sm font-medium">
                        {lab.capacidade}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Tipo:
                      </span>
                      <Badge
                        variant="outline"
                        className={getTypeColor(lab.tipoLab)}
                      >
                        {tipoLabel}
                      </Badge>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={
                          lab.status === "active" ? "default" : "secondary"
                        }
                      >
                        {lab.status === "active" ? "Ativo" : "Manutenção"}
                      </Badge>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedLab(lab);
                          editForm.reset({
                            nome: lab.nome,
                            bloco: lab.bloco,
                            capacidade: lab.capacidade,
                            tipoLab: lab.tipoLab,
                            andar: lab.andar,
                            equipamento: lab.equipamento,
                            descricao: lab.descricao || "",
                            status: lab.status as
                              | "active"
                              | "inactive"
                              | "maintenance",
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedLab(lab);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      ;{/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Laboratório</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="nome"
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="bloco"
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
                          <SelectItem value="Bloco A">Bloco A</SelectItem>
                          <SelectItem value="Bloco B">Bloco B</SelectItem>
                          <SelectItem value="Bloco C">Bloco C</SelectItem>
                          <SelectItem value="Bloco D">Bloco D</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="andar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Andar *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="capacidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="tipoLab"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value) as TipoLab)
                        }
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Didático</SelectItem>
                          <SelectItem value="1">Didático e Pesquisa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="equipamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamentos</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
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
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
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
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Salvar Alterações
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Laboratório</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este laboratório? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
