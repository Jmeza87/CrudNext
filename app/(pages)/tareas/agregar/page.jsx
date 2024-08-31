"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from 'primereact/dropdown';

const AgregarTareaPage = () => {
  const router = useRouter();
  const [tarea, setTarea] = useState({
    idusuario: null,
    idtipodetarea: null, // Cambiado a null para el Dropdown
    tarea: '',
    descripcion: '',
  });
  const [message, setMessage] = useState("");
  const [tipoMessage, setTipoMessage] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [tiposDeTarea, setTiposDeTarea] = useState([]); // Nuevo estado para tipos de tarea

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarea((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTiposDeTarea = async () => {
    try {
      const response = await fetch('/api/tipodetarea'); // Cambia la ruta según tu API
      const data = await response.json();
      setTiposDeTarea(data); // Guarda la lista de tipos de tarea
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsuarios();
    getTiposDeTarea(); // Llama a la función para obtener tipos de tarea
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos que se enviarán a la API:", tarea); 
    try {
      const response = await fetch('/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea),
      });

      if (response.ok) {
        setTipoMessage('success');
        setMessage('Tarea agregada exitosamente');
        setTimeout(() => {
          router.push('/tareas');
        }, 3000);
      } else {
        setMessage('Error al agregar la tarea');
        const errorData = await response.json();
        console.error("Error de la API:", errorData); 
      }
    } catch (error) {
      setMessage('Error al agregar la tarea: ' + error.message);
      setTipoMessage('error');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="w-50 mx-auto mt-5">
        <div className="card" data-bs-theme="dark">
          <div className="card-header">
            <h4 className="text-center p-2">Agregar Tarea</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="idusuario" className="form-label">Usuario</label>
              <Dropdown 
                value={tarea.idusuario} 
                options={usuarios} 
                onChange={(e) => setTarea({ ...tarea, idusuario: e.value })} 
                optionLabel="nombre" 
                optionValue="id"
                required 
                className="w-100"
                id="idusuario"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="idtipodetarea" className="form-label">Tipo de Tarea</label>
              <Dropdown 
                value={tarea.idtipodetarea} 
                options={tiposDeTarea} 
                onChange={(e) => setTarea({ ...tarea, idtipodetarea: e.value })} 
                optionLabel="nombre" // Asegúrate de que el campo 'nombre' existe en la API
                optionValue="id" // Asegúrate de que el campo 'id' existe en la API
                required 
                className="w-100"
                id="idtipodetarea"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tarea</label>
              <input type="text" className="form-control" name="tarea" value={tarea.tarea} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" name="descripcion" value={tarea.descripcion} onChange={handleChange} required></textarea>
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
            <button type="submit" className="btn btn-outline-success me-3">Agregar Tarea</button>
            <button type="button" className="btn btn-outline-info" onClick={() => router.push('/tareas')}>Regresar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgregarTareaPage;