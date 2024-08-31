import { NextResponse } from "next/server";
import { pool } from '@/libs/serverlessmysql';

// Manejar la solicitud GET para listar tareas
export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM tareas ORDER BY id DESC");
        return NextResponse.json(result);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [ERROR] [GET /api/tareas] Error al listar las Tareas: ${error.message}`, {
            stack: error.stack,
            additionalInfo: {
                // Puedes agregar más información relevante aquí
            }
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

// Manejar la solicitud POST para agregar una nueva tarea
export async function POST(request) {
    try {
        const { idusuario, idtipodetarea, tarea, descripcion } = await request.json();
        console.log("idusuario")
        console.log(idusuario)
        const completado = 'No'; // Inicialmente, la tarea está incompleta
        const fechacreacion = new Date();
        const fecharealizacion = null; // Inicialmente, no hay fecha de realización

        const result = await pool.query("INSERT INTO tareas SET ?", {
            idusuario: idusuario,
            idtipodetarea: idtipodetarea,
            tarea: tarea,
            descripcion: descripcion,
            completado: completado,
            fechacreacion: fechacreacion,
            fecharealizacion: fecharealizacion
        });

        return NextResponse.json(
            {
                id: result.insertId,
                idusuario: idusuario,
                idtipodetarea: idtipodetarea,
                tarea: tarea,
                descripcion: descripcion,
                completado: completado,
                fechacreacion: fechacreacion,
                fecharealizacion: fecharealizacion,
                message: 'Tarea creada correctamente',
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [ERROR] [POST /api/tareas] Error al crear la Tarea: ${error.message}`, {
            stack: error.stack,
            additionalInfo: {
                // Puedes agregar más información relevante aquí
            }
        });
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}