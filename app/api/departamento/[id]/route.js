import { NextResponse } from "next/server";
import {pool} from '@/libs/serverlessmysql'; 

export async function GET(request,{params} ){
    try {
         const id = params.id;
         const result = await pool.query("SELECT * FROM departamento WHERE id = ?", [id]);
         if(result.length === 0){
             return NextResponse.json(
                 {
                     message: "Departamento no encontrado",
                 },
                 {
                     status: 404,
                 }
             );
              
         };
         return NextResponse.json(result[0]);
     } catch (error) {
         console.log('Error al buscar un Departamento');
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

export async function PUT(request,{params}){

    try {
        const id = params.id;
        const data = await request.json();
        const result = await pool.query("UPDATE departamento SET ? WHERE id = ?", [data, id]);
        if(result.affectedRows  === 0)
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 404,
            } 
        );
        const resultProduct = await pool.query("SELECT * FROM departamento WHERE id = ?", [id]);
        return NextResponse.json(resultProduct[0]);

    } catch (error) {
        console.log('Error al Actualizar los departamento');
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


  
export async function DELETE(request,{params}){
        try {
            const id = params.id;
            const result = await pool.query("DELETE FROM departamento WHERE id = ?", [id]);
            if(result.affectedRows  === 0){
                return NextResponse.json(
                    {
                        message: "Departamento con "+id+" no encontrado", 
                    },
                    {
                        status: 404,
                    }
                );
                 
            };
            return NextResponse.json("Eliminado correctamente el id: "+id);
        } catch (error) {
            console.log('Error al listar los Departamento');
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
    