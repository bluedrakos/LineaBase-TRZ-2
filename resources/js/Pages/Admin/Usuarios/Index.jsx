import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Plus, UserCheck, UserLock, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import LayoutDashboard from '@/Layouts/AdminLayout';
import { TablaDatosGenerica } from '@/Components/General/Tabla/TablaDatosGenerica';
import { router } from '@inertiajs/react';
import DialogCrearUsuario from './components/DialogCrearUsuario';
import { toast } from 'sonner';
import DialogToggleActivo from './components/DialogToggleActivo';
import DialogToggleEstado from './components/DialogToggleEstado';
import { UsuarioTablaConfig } from './components/UsuarioTablaConfig';
import { usePermisos } from "@/hooks/usePermisos";

export default function UsuariosIndex() {
    const { usuarios, roles, permisos, instituciones } = usePage().props;
    const [abrirCrearUsuario, setAbrirCrearUsuario] = useState(false);
    const [abrirEditarUsuario, setAbrirEditarUsuario] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [abrirEstadoUsuario, setabrirEstadoUsuario] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToHabilitar, setUserToHabilitar] = useState(null);
    

    const { puede } = usePermisos("gestion-usuarios");
    const columnas = UsuarioTablaConfig({
        setAbrirEditarUsuario,
        setAbrirCrearUsuario,
        setUserToDelete,
        setShowConfirmDeleteModal,
        setUserToHabilitar,
        setabrirEstadoUsuario,
    });

    return (
        <LayoutDashboard>
            <Head title="Usuarios" />
            <div className="max-w-[1240px] mx-auto w-full space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Usuarios
                        </h2>
                        <p className="text-muted-foreground">
                            Lista y estado actual de los usuarios del sistema.
                        </p>
                    </div>
                    {puede("crear") && (
                        <Button
                            onClick={() => {
                                setAbrirEditarUsuario(null);
                                setAbrirCrearUsuario(true);
                            }}
                        >
                            <Plus className="h-4 w-4 dark:text-white" />
                            <span className="ml-2 hidden md:inline dark:text-white">
                                Crear Usuario
                            </span>
                        </Button>
                    )}
                </div>

                <TablaDatosGenerica
                    columns={columnas}
                    data={usuarios}
                    filterKey="usu_nombre"
                />
            </div>

            <DialogToggleActivo
                open={showConfirmDeleteModal}
                onOpenChange={setShowConfirmDeleteModal}
                usuario={userToDelete}
                onSuccess={() => setUserToDelete(null)}
            />

            <DialogToggleEstado
                open={abrirEstadoUsuario}
                onOpenChange={setabrirEstadoUsuario}
                usuario={userToHabilitar}
                onSuccess={() => setUserToHabilitar(null)}
            />

            <DialogCrearUsuario
                open={abrirCrearUsuario}
                onOpenChange={setAbrirCrearUsuario}
                roles={roles}
                instituciones={instituciones}
                usuarioEdit={abrirEditarUsuario}
            />
        </LayoutDashboard>
    );
}
