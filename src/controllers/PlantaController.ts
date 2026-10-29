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