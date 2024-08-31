import { NextResponse } from "next/server";
import {pool} from '@/libs/serverlessmysql'; 

export async function GET() {
    try {
        const result = await pool.query("SELECT t1.id,t1.nombre,t2.nombre as departamento,t1.usuario,t1.clave,t1.fechacreacion FROM usuarios  t1 inner join departamento t2 on t1.idDepartamento=t2.id order by t1.id desc");
        //await pool.end(); // Cerrar la conexión después de la consulta
        return NextResponse.json(result);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [ERROR] [GET /api/usuarios] Error al listar los Usuarios: ${error.message}`, {
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
        const { nombre, usuario,idDepartamento,idRol, clave } = await request.json();
       
        const fechacreacion = new Date();

        const result = await pool.query("INSERT INTO usuarios SET ?", {
            nombre: nombre,
            usuario: usuario,
            idDepartamento:idDepartamento,
            idRol:1,
            clave: clave,
            fechacreacion: fechacreacion
        });
        //console.log(result)
        return NextResponse.json(
            {
                id: result.insertId,
                nombre: nombre,
                usuario: usuario,
                idDepartamento:idDepartamento,
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
