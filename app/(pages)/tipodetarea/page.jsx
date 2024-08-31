"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const TipoTareaPage = () => {
    const router = useRouter();
    const [tiposTarea, setTiposTarea] = useState([]);
    const [message, setMessage] = useState(null);

    // Función para cargar los tipos de tarea desde el API
    const fetchTiposTarea = async () => {
        const response = await fetch('/api/tipodetarea');
        const data = await response.json();
        setTiposTarea(data);
    };

    useEffect(() => {
        fetchTiposTarea(); // Cargar tipos de tarea al montar el componente
    }, []);

    async function eliminar(id) {
        if (confirm('¿Estás seguro de eliminar este tipo de tarea?')) {
            try {
                const response = await fetch(`/api/tipodetarea/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setMessage('Tipo de tarea eliminado exitosamente');
                    //window.location.reload(); // Recargar la página para ver los cambios
                    fetchTiposTarea();
                    setTimeout(() => {
                        setMessage(null);
                      }, 2000); 
                } else {
                    setMessage('Error al eliminar el tipo de tarea');
                    setTimeout(() => {
                        setMessage(null);
                      }, 2000); 
   
                }
            } catch (error) {
                console.error('Error al eliminar el tipo de tarea:', error);
                setMessage('Error al eliminar el tipo de tarea:', error);
                setTimeout(() => {
                    setMessage(null);
                  }, 2000);
            }
        }
    }

    function editar(id) {
        router.push(`/tipodetarea/edit/${id}`); // Cambiar a la ruta de edición de tipo de tarea
    }

    return (
        <div className="container">
            <h4 className="text-center py-4 lead">Lista de Tipos de Tarea</h4>
            {/* Mostrar mensaje de éxito o error */}
            {message && (
                    <div className="alert alert-info text-center">
                    {message}
                    </div>
                )}

            <div className='text-end py-3'>
                <button type="button" className="btn btn-outline-primary ms-3" onClick={() => router.push('/tipodetarea/agregar')}>Agregar Tipo de Tarea</button>
            </div>
            
            <table className="table table-dark table-striped table-hover table-bordered">
                <thead className="text-center">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>  
                    </tr>
                </thead>
                <tbody className="text-center">
                    {tiposTarea.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nombre}</td>
                            <td>{item.descripcion}</td>
                            
                            <td>
                                <button type="button" className="btn btn-outline-info btn-sm me-1"
                                    onClick={() => (editar(item.id))}>Editar
                                </button>
                                <button type="button" className="btn btn-outline-danger btn-sm"
                                    onClick={() => (eliminar(item.id))}>Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TipoTareaPage;