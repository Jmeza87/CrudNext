"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const Usuariopage = () => {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [message, setMessage] = useState(null);

  // Función para cargar los usuarios desde el API
  const fetchUsuarios = async () => {
    const response = await fetch('/api/usuarios');
    const data = await response.json();
    setUsuarios(data);
    console.log(data);
  };

  useEffect(() => {
    fetchUsuarios(); // Cargar usuarios al montar el componente
  }, []);

  async function eliminar(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('Usuario eliminado exitosamente');
          fetchUsuarios();

          setTimeout(() => {
            setMessage(null);
          }, 2000); 
        } else {
          setMessage('Error al eliminar el Usuario');
          setTimeout(() => {
            setMessage(null);
          }, 2000); 
          
        }
      } catch (error) {
        console.error('Error al eliminar el Usuario:', error);
        setMessage('Error al eliminar el Usuario');
      }
    }
  }

  function editar(id) {
    router.push(`/usuarios/edit/${id}`);
  }

  return (
    <div className="container">
      <h4 className="text-center py-4 lead">Lista de Usuarios</h4>

      {/* Mostrar mensaje de éxito o error */}
      {message && (
        <div className="alert alert-info text-center">
          {message}
        </div>
      )}

      <div className='text-end py-3'>
        <button type="button" className="btn btn-outline-primary ms-3" onClick={() => router.push('/usuarios/agregar')}>Agregar Usuario</button>
      </div>
      
      <table className="table table-dark table-striped table-hover table-bordered">
        <thead className="text-center">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Usuario</th>
            <th>Clave</th>
            <th>Creado</th>
            <th>Acciones</th>  
          </tr>
        </thead>
        <tbody className="text-center">
          {usuarios.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <th>{item.departamento}</th>
              <td>{item.usuario}</td>
              <td>{item.clave}</td>
              <td>{new Date(item.fechacreacion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</td>
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

export default Usuariopage;