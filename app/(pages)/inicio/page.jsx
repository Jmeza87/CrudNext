"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
const Iniciopage = () => {
  const [datos, setDatos] = useState([]);
  const [visibleDetalle, setVisibleDetalle] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [filtroUsuario, setFiltroUsuario] = useState(null);
  const [filtroTipoTarea, setFiltroTipoTarea] = useState(null);
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [tiposTareaOptions, setTiposTareaOptions] = useState([]);
  

  // Función para cargar los datos desde el API
  const fetchDatos = async () => {
    try {
      const response = await fetch('/api/tareas/detalle');
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      const data = await response.json();
      setDatos(data);


      // Obtener opciones únicas de usuarios y tipos de tarea
      const usuarios = [...new Set(data.map(item => item.usuario))];
      const tiposTarea = [...new Set(data.map(item => item.tipo_tarea))];
      setUsuariosOptions(usuarios.map(usuario => ({ label: usuario, value: usuario })));
      setTiposTareaOptions(tiposTarea.map(tipo => ({ label: tipo, value: tipo })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDatos(); // Cargar datos al montar el componente
  }, []);

  const footer = (
    <Button label="Cerrar" icon="pi pi-times" onClick={() => setVisibleDetalle(false)} />
  );

  const verDetalles = (tarea) => {
    setTareaSeleccionada(tarea);
    setVisibleDetalle(true);
  };

  // Función para filtrar los datos
  const filtrarDatos = () => {
    return datos.filter(item => {
      const coincideUsuario = filtroUsuario ? item.usuario === filtroUsuario : true;
      const coincideTipoTarea = filtroTipoTarea ? item.tipo_tarea === filtroTipoTarea : true;
      return coincideUsuario && coincideTipoTarea;
    });
  };

  // Función para limpiar los filtros
  const limpiarFiltros = () => {
    setFiltroUsuario(null);
    setFiltroTipoTarea(null);
  };
  const totalTareas = filtrarDatos().length;
  return (
    <div className='container'>
      <h4 className="text-center py-4">Inicio</h4>
      <div className="d-flex justify-content-between">
        <div>
          <Badge value={totalTareas} severity="success" />
          <span className="ml-2"> Total de Tareas</span>
        </div>
        <div className="text-center mb-4">
        <Button label="Limpiar Filtros" icon="pi pi-times" onClick={limpiarFiltros} className="btn btn-outline-secondary btn-sm" />
      </div>
      </div>
            {/* Botón para limpiar filtros */}
            
      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Dropdown
            value={filtroUsuario}
            options={usuariosOptions}
            onChange={(e) => setFiltroUsuario(e.value)}
            placeholder="Filtrar por usuario"
            className="w-100"
          />
        </div>
        <div className="col-md-6">
          <Dropdown
            value={filtroTipoTarea}
            options={tiposTareaOptions}
            onChange={(e) => setFiltroTipoTarea(e.value)}
            placeholder="Filtrar por tipo de tarea"
            className="w-100"
          />
        </div>
      </div>



      <div className="row">
        {filtrarDatos().map((item) => (
          <div className="col-md-3 mb-3" key={item.id}>
            <Card footer={
              <div className='text-center'>
                <Button label="Detalle" icon="pi pi-info-circle" onClick={() => verDetalles(item)} className='btn btn-outline-success' />
              </div>
            } className='h-100'>
              <div className='d-flex flex-column align-items-between justify-content-between'>
                <div className='text-center pb-3'>
                  <h4 className='lead'>{item.tipo_tarea}</h4>
                  <p>{item.tarea}</p>
                  <Divider />
                </div>
                <div className='text-center py-4'>
                  <p className="card-text">Usuario: {item.usuario}</p>
                  <Chip
                    label={item.completado}
                    icon={item.completado === 'Sí' ? 'pi pi-check' : 'pi pi-times'}
                    className={`${item.completado === 'Sí' ? 'bg-success' : 'bg-danger'} text-white`}
                  />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal para mostrar los detalles de la tarea */}
      <Dialog
        header="Detalles de la Tarea"
        visible={visibleDetalle}
        onHide={() => setVisibleDetalle(false)}
        footer={footer}
      >
        {tareaSeleccionada && (
          <div>
            <p><strong>ID:</strong> {tareaSeleccionada.id}</p>
            <p><strong>Usuario:</strong> {tareaSeleccionada.usuario}</p>
            <p><strong>Tipo de Tarea:</strong> {tareaSeleccionada.tipo_tarea}</p>
            <p><strong>Tarea:</strong> {tareaSeleccionada.tarea}</p>
            <p><strong>Detalle:</strong> {tareaSeleccionada.descripcion}</p>
            <p><strong>Completado:</strong> {tareaSeleccionada.completado}</p>
            <p><strong>Fecha de Creación:</strong> {new Date(tareaSeleccionada.fechacreacion).toLocaleString()}</p>
            <p><strong>Fecha de Realización:</strong> {tareaSeleccionada.fecharealizacion ? new Date(tareaSeleccionada.fecharealizacion).toLocaleString() : 'N/A'}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default Iniciopage;