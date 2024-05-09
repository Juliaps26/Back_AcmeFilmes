const {PrismaClient}=require('@prisma/client')
const e = require('express')

const prisma=new PrismaClient()

const selectAllNacionalidades=async function(){
    try {
        let sql='select * from tbl_nacionalidade'
        let rsNacionalidades=await prisma.$queryRawUnsafe(sql)
        return rsNacionalidades
    } catch (error) {
        return false
    }
}

const selectByIDNacionalidade=async function(id){
    try {
        let sql=`select n.nome from tbl_nacionalidade_ator as i
        join tbl_nacionalidade as n on i.id_nacionalidade=n.id
        join tbl_ator as a on i.id_ator=a.id
        where a.id=${id}`
        let rsNacionalidade=await prisma.$queryRawUnsafe(sql)
        return rsNacionalidade
    } catch (error) {
        return false
    }
}

const selectByIDNacionalidadeDiretor=async function(id){
    try {
        let sql=`select n.nome from tbl_nacionalidade_diretor as i
        join tbl_nacionalidade as n on i.id_nacionalidade=n.id
        join tbl_diretor as d on i.id_diretor=d.id
        where d.id=${id}`
        let rsNacionalidade=await prisma.$queryRawUnsafe(sql)
        return rsNacionalidade
    } catch (error) {
        return false
    }
}

const selectByNomeNacionalidade=async function(nome){
    try {
        let sql=`select * from tbl_nacionalidade where nome like "%${nome}%"`
        let rsNacionalidades=await prisma.$queryRawUnsafe(sql)
        return rsNacionalidades
    } catch (error) {
        return false
    }
}

module.exports={
    selectAllNacionalidades,
    selectByIDNacionalidade,
    selectByNomeNacionalidade,
    selectByIDNacionalidadeDiretor
}