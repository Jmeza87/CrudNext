import { NextResponse } from "next/server";
import { pool } from '@/libs/serverlessmysql';

// Manejar la solicitud GET para listar tareas
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                t.id, 
                t.tarea, 
                t.descripcion, 
                t.completado, 
                t.fechacreacion, 
                t.fecharealizacion,
                u.nombre AS usuario,
                td.nombre AS tipo_tarea
            FROM tareas t
            INNER JOIN usuarios u ON t.idusuario = u.id  
            INNER JOIN tipodetarea td ON t.idtipodetarea = td.id
            ORDER BY t.id DESC
        `);
        
        return NextResponse.json(result);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [ERROR] [GET /api/tareas/detalles] Error al listar las Tareas con detalles: ${error.message}`, {
            stack: error.stack,
        });
        return NextResponse.json(
            {
                message: 'Error al acceder a la base de datos',
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}