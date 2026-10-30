import { Luminosidade, Prisma } from "@prisma/client";
import prisma from "@database";
import { ObjectEnumValue } from "@prisma/client/runtime/library";


export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data: data,
    });
};

export const findAllPlantas = async (luminosidade?: Luminosidade, petFriendly?: boolean) => {
    // filtro para procurar pela luminosidade
    if (petFriendly !== undefined && luminosidade) {
        return await prisma.planta.findMany({
            where: {luminosidade: luminosidade, petFriendly: petFriendly}
        })
    }
    if (luminosidade) {
        return await prisma.planta.findMany({
            where: {luminosidade: luminosidade}
        })
    }
    if (petFriendly !== undefined) {
        return await prisma.planta.findMany({
            where: {petFriendly: petFriendly}
        })
    }

    return await prisma.planta.findMany()
};

export const findPlantaById = async (id: number) => {
    return await prisma.planta.findUnique({
        where: {id: id},
    });
};

export const updatePlanta = async (id: number, data: Prisma.PlantaUpdateInput) => {
    return await prisma.planta.update({
        where: {id: id},
        data: data,
    });
};

export const deletePlanta = async (id: number) => {
    return await prisma.planta.delete({
        where: {id: id},
    });
};
// Função para vender plantas
export const venderPlanta = async (id: number, quantidade: number) => {
    return await prisma.planta.updateMany({
        where: { // Só será feito a venda se o estoque for maior que a quantidade solicitada
            id: id,
            estoque: {
                gte: quantidade
            }
        },
        data: {
            estoque: { decrement: quantidade } 
        }
    });
}