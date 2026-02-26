import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Activity,
    Briefcase,
    Building,
    Calendar,
    Fingerprint,
    Mail,
    Phone,
    ShieldCheck,
    User2,
    Users,
} from 'lucide-react';
import { format } from 'rut.js';

export default function UserDetailView({ usuario }) {
    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    function formatearRut(rut) {
        if (!rut) return 'N/A';
        return format(rut); // Ej: 197445769 → 19.744.576-9
    }

    function formatearTelefono(numero) {
        if (!numero) return 'N/A';

        const str = String(numero); // 👈 convierte a string si viene como número
        const limpio = str.replace(/\D/g, '');

        if (limpio.length === 9 && limpio.startsWith('9')) {
            return `+56 9 ${limpio.slice(1, 5)} ${limpio.slice(5)}`;
        }

        if (limpio.length >= 11 && limpio.startsWith('56')) {
            return `+${limpio.slice(0, 2)} ${limpio.slice(2, 3)} ${limpio.slice(3, 7)} ${limpio.slice(7)}`;
        }

        return `+${limpio}`;
    }

    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4 flex gap-2">
                <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                >
                    <User2 className="h-4 w-4" /> Información General
                </TabsTrigger>
                <TabsTrigger
                    value="sessions"
                    className="flex items-center gap-2"
                >
                    <Activity className="h-4 w-4" /> Historial de Sesiones
                </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
                
                {/* Información Personal */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Información Personal</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <User2 className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Nombre Completo</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_nombre} {usuario.usu_apellidos}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Fingerprint className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">RUT</Label>
                                <div className="mt-1 text-sm font-medium">{formatearRut(usuario.usu_rut)}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Correo Electrónico</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_correo}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Teléfono</Label>
                                <div className="mt-1 text-sm font-medium">{formatearTelefono(usuario.usu_telefono)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información Laboral */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Información Laboral</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <Briefcase className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Cargo</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_cargo || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Building className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Gerencia</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_gerencia || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Building className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Sección</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_seccion || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Activity className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Análisis</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_analisis || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Building className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Institución</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.institucion?.ins_nombre || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuración de Cuenta */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Configuración de Cuenta</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <Users className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Tipo de Usuario</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.usu_tipo}</div>
                            </div>
                        </div>
                        {usuario.usu_tipo === 'Interno' && (
                            <div className="flex items-start gap-3">
                                <Building className="text-muted-foreground h-5 w-5 mt-1" />
                                <div>
                                    <Label className="text-muted-foreground block text-xs font-semibold">Usuario LDAP</Label>
                                    <div className="mt-1 text-sm font-medium">{usuario.usu_ldap || 'N/A'}</div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Rol</Label>
                                <div className="mt-1 text-sm font-medium">{usuario.rol?.rol_nombre || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Activity className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Estado</Label>
                                <div className="mt-1">
                                    <Badge variant={usuario.usu_activo ? 'default' : 'destructive'}>
                                        {usuario.usu_activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Último Acceso</Label>
                                <div className="mt-1 text-sm font-medium">
                                    {formatDateTime(usuario.usu_acceso ? new Date(usuario.usu_acceso).getTime() / 1000 : null)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="text-muted-foreground h-5 w-5 mt-1" />
                            <div>
                                <Label className="text-muted-foreground block text-xs font-semibold">Fecha de Creación</Label>
                                <div className="mt-1 text-sm font-medium">
                                    {formatDateTime(usuario.created_at ? new Date(usuario.created_at).getTime() / 1000 : null)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="sessions" className="mt-4">
                <h3 className="mb-4 text-lg font-semibold">Últimas Sesiones</h3>
                {usuario.sesiones && usuario.sesiones.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha y Hora</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead>Dispositivo/Agente</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuario.sesiones.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>
                                        {formatDateTime(session.last_activity)}
                                    </TableCell>
                                    <TableCell>{session.ip_address}</TableCell>
                                    <TableCell>
                                        {session.user_agent || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-muted-foreground">
                        No hay historial de sesiones disponible.
                    </p>
                )}
            </TabsContent>
        </Tabs>
    );
}
