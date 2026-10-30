import { Luminosidade, Prisma } from "@prisma/client";
import prisma from "@database";


export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data: data,
    });
};

export const findAllPlantas = async (luminosidade?: Luminosidade, petFriendly?: boolean) => {
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

export const venderPlanta = async (id: number, quantidade: number) => {
    return await prisma.planta.updateMany({
        where: {
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

export const totalVendas = async () => {
    const total = await prisma.planta.aggregate({
        _sum: {
            estoque: true
        }
    });
    const plantas = await prisma.planta.findMany({
        select: {
            estoque: true,
            preco: true,
        }
    })
    const totalVendas = plantas.reduce((Acumulador, planta) => {
        return Acumulador + (planta.preco * planta.estoque);
    }, 0);
    return {totalDeVasos: total._sum.estoque ?? 0, valorTotalEmCentavos: totalVendas};
}