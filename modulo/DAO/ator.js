const { PrismaClient } = require('@prisma/client')
const e = require('express')

const prisma = new PrismaClient()


// Função para buscar o ultimo id
const selectLastID = async function () {
    try {
        // Comando banco de dados
        let sql = 'select cast(last_insert_id() as decimal) as id from tbl_ator limit 1;'
        let rsID = await prisma.$queryRawUnsafe(sql)
        return rsID
    } catch (error) {
        return false
    }
}

// Inserir um novo ator
const insertAtor = async function (dadosAtor) {
    try {

        let sql

        // Validação caso o ator ja tenha falecido
        if (
            dadosAtor.data_falecimento != '' &&
            dadosAtor.data_falecimento != null &&
            dadosAtor.data_falecimento != undefined
        ) {

            sql = `insert into tbl_ator (
                nome,
                data_nascimento,
                data_falecimento,
                biografia,
                foto,
                id_sexo
            ) values(
                    '${dadosAtor.nome}',
                    '${dadosAtor.data_nascimento}',
                    ${dadosAtor.data_falecimento},
                    '${dadosAtor.biografia}',
                    '${dadosAtor.foto}',
                    ${dadosAtor.id_sexo}
            )`
        } else {
            sql = `insert into tbl_ator (
                nome,
                data_nascimento,
                data_falecimento,
                biografia,
                foto,
                id_sexo
            ) values(
                    '${dadosAtor.nome}',
                    '${dadosAtor.data_nascimento}',
                    null,
                    '${dadosAtor.biografia}',
                    '${dadosAtor.foto}',
                    ${dadosAtor.id_sexo}
            )`
            
        }
        console.log(sql);
        let result = await prisma.$executeRawUnsafe(sql);

    if(result)
    return true;
    else
    // Esses dois return false, signfica falha na comunicação com o banco 
    return false;
       
    } catch (error) {
        console.log(error)
        return false
    }
}

// Selecionar todos os atores
const selectAllAtores = async function () {
    try {
        let sql = 'select * from tbl_ator'
        let rsAtores = await prisma.$queryRawUnsafe(sql)
        return rsAtores
    } catch (error) {
        return false
    }
}
// Funcao para selecionar o filme e referenciar com o ator 
const selectFilmes = async function (id) {
    try {
        // Buscar no banco - inner join
        let sql = `select f.nome from tbl_filme_ator as i
        join tbl_filme as f on i.id_filme = f.id
        join tbl_ator as a on i.id_ator = a.id
        where a.id=${id};
        `
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false

    }
}

// Função para buscar o ator pelo nome
const selectByNomeDoAtor = async function (nome) {
    try {
        // Script do bd
        let sql = `select * from tbl_ator where nome like "%${nome}"`
        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores
    } catch (error) {
        return false

    }
}

// Função para excluir um ator 
const deleteAtor = async function (id) {
    try {
        // Comando no BD
        let sql = `delete from tbl_nacionalidade_ator where id_ator=${id}`
        let rsTabela = await prisma.$executeRawUnsafe(sql)
        if (rsTabela) {
            sql = `delete from tbl_ator where id=${id}`
            let rsAtor = await prisma.$executeRawUnsafe(sql)
            return rsAtor
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Atualizar o ator 
const uptadeAtor = async function (id, dadosAtor) {
    try {
        let sql
        // Se a data de falecimento estiver vazia, null 
        if (dadosAtor.data_falecimento != '' &&
            dadosAtor.data_falecimento != null &&
            dadosAtor.data_falecimento != undefined) {


            sql = `
            update tbl_ator 
            set 
                nome='${dadosAtor.nome}',
                data_nascimento='${dadosAtor.data_nascimento}',
                data_falecimento='${dadosAtor.data_falecimento}',
                foto='${dadosAtor.foto}',
                biografia='${dadosAtor.biografia}',
                id_sexo=${dadosAtor.id_sexo}

            where id='${id}';
        `
        }
        else {
            // Script sql
            sql = `
            update tbl_ator 
            set 
                nome='${dadosAtor.nome}',
                data_nascimento='${dadosAtor.data_nascimento}',
                foto='${dadosAtor.foto}',
                biografia='${dadosAtor.biografia}',
                id_sexo=${dadosAtor.id_sexo}

            where id='${id}';
        `
        }
        let atualizacao = await prisma.$executeRawUnsafe(sql)
        if (atualizacao) {
            for (let nacionalidade of dadosAtor.id_nacionalidade) {
                sql = `
                
                    update tbl_nacionalidade_ator
                        
                    set
                        id_nacionalidade=${nacionalidade},
                        id_ator=${id}
                    
                    where id_ator=${id}
                `
                let atualizacao = await prisma.$executeRawUnsafe(sql)
                if (atualizacao)
                    continue
                else
                    return false
            }
            return true
        }
        else
            return false
    } catch (error) {

        return false
    }
}
// Buscar pelo id
const selectByIdAtor = async function (id) {
    try {
        let sql = `select * from tbl_ator where id=${id}`
        let rsAtor = await prisma.$queryRawUnsafe(sql)
        return rsAtor
    } catch (error) {
        return false
    }
}

// Exportar
module.exports = {
    selectAllAtores,
    insertAtor,
    selectFilmes,
    selectLastID,
    selectByNomeDoAtor,
    deleteAtor,
    selectByIdAtor,
    uptadeAtor
}