import LayoutDashboard from '@/app/layouts/AdminLayout';
import { usePermisos } from '@/core/auth/hooks/usePermisos';
import {
    fetchUsuarios,
    fetchUsuariosMeta,
} from '@/core/usuarios/services/usuarios.service';
import { TablaDatosGenerica } from '@/shared/components/data-table/TablaDatosGenerica';
import { Button } from '@/shared/ui/button';
import { Head } from '@/shared/app-bridge';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/shared/lib/toast';
import DialogCrearUsuario from './components/DialogCrearUsuario';
import DialogToggleActivo from './components/DialogToggleActivo';
import DialogToggleEstado from './components/DialogToggleEstado';
import { UsuarioTablaConfig } from './components/UsuarioTablaConfig';

export default function UsuariosIndex() {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    const [abrirCrearUsuario, setAbrirCrearUsuario] = useState(false);
    const [abrirEditarUsuario, setAbrirEditarUsuario] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [abrirEstadoUsuario, setabrirEstadoUsuario] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToHabilitar, setUserToHabilitar] = useState(null);
    const [loading, setLoading] = useState(true);

    const { puede } = usePermisos('gestion-usuarios');

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const [{ items }, meta] = await Promise.all([
                fetchUsuarios({ per_page: 300 }),
                fetchUsuariosMeta(),
            ]);
            setUsuarios(items);
            setRoles(meta.roles || []);
            setInstituciones(meta.instituciones || []);
        } catch (error) {
            toast.error(
                error.message || 'No se pudo cargar la gestión de usuarios',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

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
            <div className="mx-auto w-full max-w-[1240px] space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Usuarios
                        </h2>
                        <p className="text-muted-foreground">
                            Lista y estado actual de los usuarios del sistema.
                        </p>
                    </div>
                    {puede('crear') && (
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
                    isLoading={loading}
                />
            </div>

            <DialogToggleActivo
                open={showConfirmDeleteModal}
                onOpenChange={setShowConfirmDeleteModal}
                usuario={userToDelete}
                onSuccess={async () => {
                    setUserToDelete(null);
                    await cargarUsuarios();
                }}
            />

            <DialogToggleEstado
                open={abrirEstadoUsuario}
                onOpenChange={setabrirEstadoUsuario}
                usuario={userToHabilitar}
                onSuccess={async () => {
                    setUserToHabilitar(null);
                    await cargarUsuarios();
                }}
            />

            <DialogCrearUsuario
                open={abrirCrearUsuario}
                onOpenChange={setAbrirCrearUsuario}
                roles={roles}
                instituciones={instituciones}
                usuarioEdit={abrirEditarUsuario}
                onSaved={cargarUsuarios}
            />
        </LayoutDashboard>
    );
}
