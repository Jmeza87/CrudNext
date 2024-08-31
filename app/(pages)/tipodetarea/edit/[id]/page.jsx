"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditarTipoTarea = () => {
  const router = useRouter();
  const params = useParams();

  const [message, setMessage] = useState("");
  const [tipoMessage, setTipoMessage] = useState("");
  const [tipoTarea, setTipoTarea] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    const fetchTipoTarea = async () => {
      if (params.id) {
        const response = await fetch(`/api/tipodetarea/${params.id}`); // Cambia esta línea si no tienes un API
        const data = await response.json();
        setTipoTarea({
          nombre: data.nombre,
          descripcion: data.descripcion,
        });
      }
    };
    fetchTipoTarea();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoTarea((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/tipodetarea/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipoTarea),
      });

      if (response.ok) {
        setTipoMessage('success');
        setMessage('Tipo de tarea actualizado exitosamente');
        // Esperar 3 segundos antes de redirigir
        setTimeout(() => {
          router.push('/tipodetarea'); // Cambiar la ruta a la lista de tipos de tarea
        }, 1000);
      } else {
        setMessage('Error al actualizar el tipo de tarea');
        setTipoMessage('error');
      }
    } catch (error) {
      setMessage('Error al actualizar el tipo de tarea: ' + error.message);
      setTipoMessage('error');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="w-50 mx-auto mt-5">
        <div className="card" data-bs-theme="dark">
          <div className="card-header">
            <h4 className="text-center p-2">Editar Tipo de Tarea</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" name="nombre" value={tipoTarea.nombre} onChange={handleChange} required />
            </div>
            <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="descripcion"
              value={tipoTarea.descripcion}
              onChange={handleChange}
              required
              rows={4} // Puedes ajustar el número de filas según sea necesario
            />
          </div>
            <div className="mb-3 text-center">
              {message && (
                <div className={`alert ${tipoMessage === 'success' ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
          <div className="card-footer text-center">
            <button type="submit" className="btn btn-outline-success me-3">Actualizar</button>
            <button type="button" className="btn btn-outline-info" onClick={() => router.push('/tipodetarea')}>Regresar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarTipoTarea;