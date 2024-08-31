
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const TareasPage = () => {
  const router = useRouter();
  const [datos, setDatos] = useState([]);
  const [visibleDetalle, setVisibleDetalle] = useState(false);
  const [visibleCambioEstado, setVisibleCambioEstado] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [fechaRealizacion, setFechaRealizacion] = useState('');

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

  const cerrarModalCambioEstado = () => {
    setVisibleCambioEstado(false);
    setTareaSeleccionada(null);
    setFechaRealizacion('');
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

  const cambiarEstado = (tarea) => {
    setTareaSeleccionada(tarea);
    setVisibleCambioEstado(true);
  };

  const actualizarEstado = async () => {
    if (!fechaRealizacion) {
      alert("Por favor, ingrese una fecha de realización.");
      return;
    }
    
    try {
      const response = await fetch(`/api/tareas/${tareaSeleccionada.id}`, {
        method: 'PATCH',
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
        cerrarModalCambioEstado();
      } else {
        console.error('Error al actualizar el estado de la tarea');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const handleDropdownChange = (e, rowData) => {
    switch (e.value) {
      case 'detalle':
        verDetalles(rowData);
        break;
      case 'editar':
        router.push(`/tareas/editar/${rowData.id}`);
        break;
      case 'eliminar':
        eliminarTarea(rowData.id);
        break;
      case 'completar':
        cambiarEstado(rowData);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container">
      <h4 className='text-center py-3'>Lista de Tareas</h4>
      <div className="pt-4">
        <DataTable 
          stripedRows 
          showGridlines 
          value={datos}  
          paginator   
          rows={5} 
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="id" header="Id" />
          <Column field="usuario" sortable header="Usuarios" />
          <Column field="tipo_tarea" sortable header="Tipo de Tarea" />
          <Column field="tarea" sortable header="Tarea" />
          <Column field="completado" sortable header="Completado" />
          
          <Column 
            header="Acciones" 
            body={(rowData) => (
              <Dropdown 
                options={[
                  { label: 'Detalle', value: 'detalle' },
                  { label: 'Editar', value: 'editar' },
                  { label: 'Eliminar', value: 'eliminar' },
                  { label: 'Completar', value: 'completar' },
                ]}
                onChange={(e) => handleDropdownChange(e, rowData)}
                placeholder="Seleccione una acción"
                className="w-100"
              />
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

        {/* Modal para ingresar la fecha de realización */}
        <Dialog 
          header="Marcar como Completada" 
          visible={visibleCambioEstado} 
          onHide={cerrarModalCambioEstado}
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={cerrarModalCambioEstado} className="p-button-text" />
              <Button label="Confirmar" icon="pi pi-check" onClick={actualizarEstado} />
            </div>
          }
        >
          <div className="mb-3">
            <label htmlFor="fechaRealizacion" className="form-label">Fecha de Realización</label>
            <InputText 
              id="fechaRealizacion" 
              type="date" 
              value={fechaRealizacion} 
              onChange={(e) => setFechaRealizacion(e.target.value)} 
              required 
            />
          </div>
        </Dialog>

        <ConfirmDialog />
      </div>
    </div>
  );
};

export default TareasPage;
