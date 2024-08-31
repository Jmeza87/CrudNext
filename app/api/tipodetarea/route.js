import { NextResponse } from "next/server";
import { pool } from '@/libs/serverlessmysql'; 

// Manejar la solicitud GET para listar tipos de tarea
export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM tipodetarea ORDER BY id DESC");
        return NextResponse.json(result);
    } catch (error) {
        console.log('Error al listar los Tipos de Tareas', error);
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

// Manejar la solicitud POST para agregar un nuevo tipo de tarea
export async function POST(request) {
    try {
        const { nombre, descripcion } = await request.json(); // Asegúrate de desestructurar correctamente

        const result = await pool.query("INSERT INTO tipodetarea (nombre, descripcion) VALUES (?, ?)", [nombre, descripcion]);

        return NextResponse.json(
            {
                id: result.insertId,
                nombre: nombre,
                descripcion: descripcion,
                message: 'Tipo de tarea creado correctamente',
            },
            {
                status: 201, // Cambié el estado a 201 para indicar que se ha creado un recurso
            }
        );
    } catch (error) {
        console.log('Error al crear el tipo de tarea', error);
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