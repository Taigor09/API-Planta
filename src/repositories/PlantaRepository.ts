import { Luminosidade, Prisma } from "@prisma/client";
import prisma from "@database";


export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data: data,
    });
};

export const findAllPlantas = async (luminosidade?: Luminosidade, petFriendly?: boolean, nome?: string, ordem?: "preco" | "nome") => {
    const where: Prisma.PlantaWhereInput = {};
    if (luminosidade) {
        where.luminosidade = luminosidade;
    }

    if (petFriendly !== undefined) {
        where.petFriendly = petFriendly;
    }

    if (nome) {
        where.nome = {
            contains: nome,
            mode: "insensitive"
        }
    }
    return await prisma.planta.findMany({where, orderBy: ordem ? { [ordem]: "asc" } : undefined});
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

export const findPlantasEsgotadas = async () => {
    return await prisma.planta.findMany({
        where: {
            estoque: 0
        }
    });
}