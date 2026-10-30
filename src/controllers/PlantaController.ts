import { request, response } from "express";
import * as PlantaRepository from "@repositories/PlantaRepository"
import { Luminosidade } from "@prisma/client";


export const createPlanta = async (req = request, res = response) => {
    try {

        const {nome, especie, preco, estoque, petFriendly, regaACadaDias, luminosidade} = req.body

        if (typeof nome === 'string' && nome.trim() !== "" && typeof especie === 'string' && especie.trim() !== "" && Number.isInteger(preco) && Number.isInteger(estoque) && Number.isInteger(regaACadaDias) && typeof petFriendly === 'boolean' && estoque >= 0 && preco > 0 && regaACadaDias >= 1 && Object.values(Luminosidade).includes(luminosidade)) {
            const planta = await PlantaRepository.createPlanta({
                nome: nome,
                especie: especie,
                preco: preco,
                estoque: estoque,
                petFriendly: petFriendly,
                regaACadaDias: regaACadaDias,
                luminosidade: luminosidade,
            })
            return res.status(201).json(planta)
        }
        else {
            return res.status(400).json({message: "Preencha todos os campos corretamente"})
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: "Erro ao criar planta"})
    }
}

export const findAllPlantas = async (req = request, res = response) => {
    try {
        const { luminosidade, petFriendly } = req.query;

        if (luminosidade === undefined && petFriendly === undefined) {
            const plantas = await PlantaRepository.findAllPlantas();
            return res.status(200).json(plantas);
        }

        let filtroLuminosidade: Luminosidade | undefined = undefined;
        let filtroPetFriendly: boolean | undefined = undefined;

        if (luminosidade !== undefined) {
            if (
                typeof luminosidade !== "string" ||
                !Object.values(Luminosidade).includes(luminosidade as Luminosidade)
            ) {
                return res.status(400).json({ message: "Filtro de luminosidade inválido" });
            }
            filtroLuminosidade = luminosidade as Luminosidade;
        }

        if (petFriendly !== undefined) {
            if (petFriendly !== 'true' && petFriendly !== 'false') {
                return res.status(400).json({ message: "Filtro petFriendly inválido" });
            }
            filtroPetFriendly = petFriendly === 'true';
        }

        const plantas = await PlantaRepository.findAllPlantas(
            filtroLuminosidade,
            filtroPetFriendly
        );

        return res.status(200).json(plantas);
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Erro ao buscar plantas"})
    }
}

export const findPlantaById = async (req = request, res = response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({message: "Id inválido"})
        }

        const planta = await PlantaRepository.findPlantaById(id);
        
        if (!planta) {
            return res.status(404).json({message: "Planta não encontrada"})
        }

        return res.status(200).json(planta);
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Erro ao buscar planta"})
    }
}

export const updatePlanta = async (req = request, res = response) => {
    try {
        const id = Number(req.params.id);
        
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({message: "Nenhum dado enviado para atualização"})
        }
        const {nome, especie, preco, estoque, petFriendly, regaACadaDias, luminosidade} = req.body

        if ((typeof nome !== 'string' || nome.trim() === "") && nome !== undefined || (typeof especie !== 'string' || especie.trim() === "") && especie !== undefined || (typeof preco !== 'number' || !Number.isInteger(preco) || preco <= 0) && preco !== undefined || (typeof estoque !== 'number' || !Number.isInteger(estoque) || estoque < 0) && estoque !== undefined || (typeof regaACadaDias !== 'number' || !Number.isInteger(regaACadaDias) || regaACadaDias <= 0) && regaACadaDias !== undefined || typeof petFriendly !== 'boolean' && petFriendly !== undefined || (typeof luminosidade !== 'string' || !Object.values(Luminosidade).includes(luminosidade as Luminosidade)) && luminosidade !== undefined) {
            return res.status(400).json({message: "Dado(s) inválidos"})
        }

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({message: "Id inválido"})
        }
        const planta = await PlantaRepository.findPlantaById(id);
        if (!planta) {
            return res.status(404).json({message: "Planta não encontrada"})
        }

        const updatePlanta = await PlantaRepository.updatePlanta(id, {
            nome: nome,
            especie: especie,
            preco: preco,
            estoque: estoque,
            petFriendly: petFriendly,
            regaACadaDias: regaACadaDias,
            luminosidade: luminosidade,
        });

        return res.status(200).json(updatePlanta);
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Erro ao atualizar planta"})
    }
}

export const deletePlanta = async (req = request, res = response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({message: "Id inválido"})
        }

        const planta = await PlantaRepository.findPlantaById(id);
        if (!planta) {
            return res.status(404).json({message: "Planta não encontrada"})
        }
        await PlantaRepository.deletePlanta(id);
        return res.status(204).send();
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Erro ao deletar planta"})
    }
}

export const vendePlanta = async (req = request, res = response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({message: "Id inválido"})
        }

        const planta = await PlantaRepository.findPlantaById(id);
        if (!planta) {
            return res.status(404).json({message: "Planta não encontrada"})
        }

        const {quantidade} = req.body
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return res.status(400).json({message: "Quantidade inválida"})
        }

        if (planta.estoque < quantidade) {
            return res.status(400).json({message: "Estoque insuficiente para a venda"})
        }

        const venda = await PlantaRepository.venderPlanta(id, quantidade);
        if (venda.count === 0) {
            return res.status(400).json({message: "Estoque insuficiente para a venda"})
        }

        const plantaAtualizada = await PlantaRepository.findPlantaById(id);
        return res.status(200).json(plantaAtualizada);
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Erro ao vender planta"})
    }
}

export const valorTotalEstoque = async (req = request, res = response) => {
    try {
        const total = await PlantaRepository.totalVendas();
        return res.status(200).json(total);
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "Erro ao calcular total do estoque"})
    }
}