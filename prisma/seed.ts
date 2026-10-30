import { PrismaClient, Luminosidade } from "@prisma/client";

const prisma = new PrismaClient();

const plantas = [{
    "nome": "Samambaia-americana",
    "especie": "Nephrolepis exaltata",
    "preco": 2500,
    "estoque": 10,
    "luminosidade": Luminosidade.SOL_PLENO,
    "petFriendly": true,
    "regaACadaDias": 3
}, {
    "nome": "Costela-de-Adão",
    "especie": "Monstera Deliciosa",
    "preco": 8500,
    "estoque": 5,
    "luminosidade": Luminosidade.MEIA_SOMBRA,
    "petFriendly": false,
    "regaACadaDias": 2
}, {
    "nome": "Jiboia",
    "especie": "Epipremnum aureum",
    "preco": 3500,
    "estoque": 0,
    "luminosidade": Luminosidade.MEIA_SOMBRA,
    "petFriendly": false,
    "regaACadaDias": 5
}]

const main = async () => {
    const quantidade = await prisma.planta.count()
    if (quantidade === 0) {
        await prisma.planta.createMany({
    data: plantas
        });
    }
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });