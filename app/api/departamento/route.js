import { NextResponse } from "next/server";
import {pool} from '@/libs/serverlessmysql'; 

export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM departamento ORDER BY id DESC");
        //await pool.end(); // Cerrar la conexión después de la consulta
        return NextResponse.json(result);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [ERROR] [GET /api/departamento] Error al listar los Departamento: ${error.message}`, {
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

export async function POST(request){
    try {
        const { nombre, usuario, clave } = await request.json();
       
        const fechacreacion = new Date();

        const result = await pool.query("INSERT INTO departamento SET ?", {
            nombre: nombre,
            usuario: usuario,
            clave: clave,
            fechacreacion: fechacreacion
        });
        //console.log(result)
        return NextResponse.json(
            {
                id: result.insertId,
                nombre: nombre,
                usuario: usuario,
                clave: clave,
                fechacreacion: fechacreacion,
                message: 'Creado correctamente',
            },
            {
                status: 200,
            }
        ) 
   } catch (error) {
    console.log(error)
        console.log('Error al crear erl todo', error);
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
