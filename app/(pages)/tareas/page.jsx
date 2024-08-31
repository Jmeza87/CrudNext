"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const TareasPage = () => {
  const router = useRouter();
  const [datos, setDatos] = useState([]);
  const [visibleDetalle, setVisibleDetalle] = useState(false);
  const [visibleCambioEstadoSi, setVisibleCambioEstadoSi] = useState(false); // Nuevo estado para el diálogo "Sí"
  const [visibleCambioEstadoNo, setVisibleCambioEstadoNo] = useState(false); // Nuevo estado para el diálogo "No"
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [fechaRealizacion, setFechaRealizacion] = useState('');
  const [globalFilter, setGlobalFilter] = useState(''); // Estado para el filtro global

  const getDatos = async () => {
    try {
      const response = await fetch('/api/tareas/detalle');
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDatos();
  }, []);

  const verDetalles = (tarea) => {
    setTareaSeleccionada(tarea);
    setVisibleDetalle(true);
  };

  const cerrarModalDetalle = () => {
    setVisibleDetalle(false);
    setTareaSeleccionada(null);
  };

  const cerrarModalCambioEstadoSi = () => {
    setVisibleCambioEstadoSi(false);
    setTareaSeleccionada(null);
    setFechaRealizacion('');
  };

  const cerrarModalCambioEstadoNo = () => {
    setVisibleCambioEstadoNo(false);
    setTareaSeleccionada(null);
  };

  const eliminarTarea = (id) => {
    confirmDialog({
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await fetch(`/api/tareas/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            getDatos();
          } else {
            console.error('Error al eliminar la tarea');
          }
        } catch (error) {
          console.error('Error al eliminar la tarea:', error);
        }
      },
    });
  };

  const cambiarEstadoSi = (tarea) => {
    setTareaSeleccionada(tarea);
    setVisibleCambioEstadoSi(true);
  };

  const cambiarEstadoNo = (tarea) => {
    setTareaSeleccionada(tarea);
    setVisibleCambioEstadoNo(true);
  };

  const actualizarEstadoSi = async () => {
    if (!fechaRealizacion) {
      alert("Por favor, ingrese una fecha de realización.");
      return;
    }

    try {
      const response = await fetch(`/api/tareas/${tareaSeleccionada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completado: 'Sí',
          fecharealizacion: fechaRealizacion,
        }),
      });

      if (response.ok) {
        getDatos();
        cerrarModalCambioEstadoSi();
      } else {
        console.error('Error al actualizar el estado de la tarea');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const actualizarEstadoNo = async () => {
    try {
      const response = await fetch(`/api/tareas/${tareaSeleccionada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completado: 'No',
        }),
      });

      if (response.ok) {
        getDatos();
        cerrarModalCambioEstadoNo();
      } else {
        console.error('Error al actualizar el estado de la tarea');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  return (
    <div className="container">
      <h4 className='text-center py-3'>Lista de Tareas</h4>
      <div className="d-flex justify-content-between">


      <div className='text-end py-3'>
        <button type="button" className="btn btn-outline-primary ms-3" onClick={() => router.push('/tareas/agregar')}>Agregar Una Tarea</button>
      </div>
      <div className="w-25 ms-auto">
        <InputText 
          value={globalFilter} 
          onChange={(e) => setGlobalFilter(e.target.value)} 
          placeholder="Buscar..." 
          className="w-100"
        />
      </div>
      </div>
      <div className="pt-4">
        <DataTable 
          stripedRows 
          showGridlines 
          value={datos}  
          paginator   
          rows={10} 
          rowsPerPageOptions={[5, 10, 25, 50]}
          globalFilter={globalFilter} // Añadir el filtro global
        >
          <Column field="id" header="Id" />
          <Column field="usuario" sortable header="Usuarios" />
          <Column field="tipo_tarea" sortable header="Tipo de Tarea" />
          <Column field="tarea" sortable header="Tarea" />
          <Column field="completado" sortable header="Completado" />
          
          <Column 
            header="Acciones" 
            body={(rowData) => (
              <div>
                <Button 
                  icon="pi pi-info-circle" 
                  onClick={() => verDetalles(rowData)} 
                  className="btn btn-sm btn-outline-info me-2"
                  title="Detalle"
                />
                <Button 
                  icon="pi pi-pencil" 
                  onClick={() => router.push(`/tareas/edit/${rowData.id}`)} 
                  className="btn btn-sm btn-outline-warning me-2"
                  title="Editar"
                />
                <Button 
                  icon="pi pi-trash" 
                  onClick={() => eliminarTarea(rowData.id)} 
                  className="btn btn-sm btn-outline-danger me-2"
                  title="Eliminar"
                />
                {rowData.completado === 'No' ? (
                  <Button 
                    icon="pi pi-check" 
                    onClick={() => cambiarEstadoSi(rowData)} 
                    className="btn btn-sm btn-outline-success"
                    title="Completar"
                  />
                ) : (
                  <Button 
                    icon="pi pi-times" 
                    onClick={() => cambiarEstadoNo(rowData)} 
                    className="btn btn-sm btn-outline-warning"
                    title="Marcar como No Completado"
                  />
                )}
              </div>
            )} 
          />
        </DataTable>

        {/* Modal para mostrar los detalles de la tarea */}
        <Dialog 
          header="Detalles de la Tarea" 
          visible={visibleDetalle} 
          onHide={cerrarModalDetalle}
          footer={<Button label="Cerrar" icon="pi pi-times" onClick={cerrarModalDetalle} />}
        >
          {tareaSeleccionada && (
            <div>
              <p><strong>ID:</strong> {tareaSeleccionada.id}</p>
              <p><strong>Usuario:</strong> {tareaSeleccionada.usuario}</p>
              <p><strong>Tipo de Tarea:</strong> {tareaSeleccionada.tipo_tarea}</p>
              <p><strong>Tarea:</strong> {tareaSeleccionada.tarea}</p>
              <p><strong>Detalle:</strong> {tareaSeleccionada.descripcion}</p>
              <p><strong>Completado:</strong> {tareaSeleccionada.completado }</p>
              <p><strong>Fecha de Creación:</strong> {new Date(tareaSeleccionada.fechacreacion).toLocaleString()}</p>
              <p><strong>Fecha de Realización:</strong> {tareaSeleccionada.fecharealizacion ? new Date(tareaSeleccionada.fecharealizacion).toLocaleString() : 'N/A'}</p>
            </div>
          )}
        </Dialog>

        {/* Modal para cambiar a "Sí" */}
        <Dialog 
          header="Marcar como Completada" 
          visible={visibleCambioEstadoSi} 
          onHide={cerrarModalCambioEstadoSi}
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={cerrarModalCambioEstadoSi} className="p-button-text" />
              <Button label="Confirmar" icon="pi pi-check" onClick={actualizarEstadoSi} />
            </div>
          }
        >
          <div className="mb-3">
            <label htmlFor="fechaRealizacion" className="form-label">Fecha de Realización </label>
            <InputText 
              id="fechaRealizacion" 
              type="date" 
              value={fechaRealizacion} 
              onChange={(e) => setFechaRealizacion(e.target.value)} 
              className="form-control"
              required 
            />
          </div>
        </Dialog>

        {/* Modal para cambiar a "No" */}
        <Dialog 
          header="Marcar como No Completada" 
          visible={visibleCambioEstadoNo} 
          onHide={cerrarModalCambioEstadoNo}
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={cerrarModalCambioEstadoNo} className="p-button-text" />
              <Button label="Confirmar" icon="pi pi-check" onClick={actualizarEstadoNo} />
            </div>
          }
        >
          <p>¿Estás seguro de que deseas marcar esta tarea como no completada?</p>
        </Dialog>

        <ConfirmDialog />
      </div>
    </div>
  );
};

export default TareasPage;