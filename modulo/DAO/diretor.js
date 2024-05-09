const {PrismaClient}=require('@prisma/client')
const e = require('express')

const prisma=new PrismaClient()


// Selecionar filmes do diretor
const selectFilmes = async function(id){
    try {
        let sql = `select f.nome from tbl_filme_diretor as i 
        join tbl_filme as f on i.id_filme = f.id
        join tbl_diretor as d on i.id_diretor = d.id
        where d.id=${id}
        `
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }
}

// Selecionar todos diretores
const selectAllDiretores = async function(){
    try {
        let sql = 'select * from tbl_diretor'
        let rsDiretores = await prisma.$queryRawUnsafe(sql)
        return rsDiretores
    } catch (error) {
        return false
        
    }
}

// Selecionar o ultimo id
const selectLastID = async function(){
    try {
        // Script sql
        let sql = 'select cast(last_insert_id() as decimal) as id from tbl_diretor limit 1;'
        let rsID = await prisma.$queryRawUnsafe(sql)
        return rsID

    } catch (error) {
        return false
    }
}

// Buscar pelo ID
const selectByIdDiretor = async function(id){
    try {
        let sql = `select * from tbl_diretor where id=${id}`
        let rsDiretor = await prisma.$queryRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }


}

// Inserir novo diretor
const insertDiretor=async function(dadosDiretor){
    try {

        let sql

        //caso o diretor ja tenha falecido
        if(dadosDiretor.data_falecimento!=''&&
           dadosDiretor.data_falecimento!=null&&
           dadosDiretor.data_falecimento!=undefined){

            sql=`insert into tbl_diretor (
                nome,
                data_nascimento,
                data_falecimento,
                biografia,
                foto,
                id_sexo
            ) values(
                    '${dadosDiretor.nome}',
                    '${dadosDiretor.data_nascimento}',
                    '${dadosDiretor.data_falecimento}',
                    '${dadosDiretor.biografia}',
                    '${dadosDiretor.foto}',
                    '${dadosDiretor.id_sexo}'
            )`
            let result=await prisma.$executeRawUnsafe(sql)
            if(result){
                let idDiretor=await selectLastID()
                for(let nacionalidade of dadosDiretor.id_nacionalidade){
                    sql=`insert into tbl_nacionalidade_diretor(
                            id_nacionalidade,
                            id_diretor
                        ) values(
                            ${nacionalidade},
                            ${idDiretor[0].id}
                        )`
                    let result=await prisma.$executeRawUnsafe(sql)
                    //enquanto os dados estiverem sendo inseridos o loop vai continuar, caso aconteça algum erro, o código para e retorna falso
                    if(result)
                        continue
                    else
                        return false
                }
                //caso chegue até aqui é pq inseriu corretamente os dados da nacionalidade, então só retorna verdadeiro para indicar q deu certo
                return true
            }
            //se o result n deu certo nada deu certo ent retorna falso
            else
                return false 
           }
           //caso o diretor nao tenha falecido
           else{
            sql=`insert into tbl_diretor (
                nome,
                data_nascimento,
                data_falecimento,
                biografia,
                foto,
                id_sexo
            ) values(
                    '${dadosDiretor.nome}',
                    '${dadosDiretor.data_nascimento}',
                    null,
                    '${dadosDiretor.biografia}',
                    '${dadosDiretor.foto}',
                    '${dadosDiretor.id_sexo}'
            )`
            let result=await prisma.$executeRawUnsafe(sql)
            if(result){
                let idDiretor=await selectLastID()
                for(let nacionalidade of dadosDiretor.id_nacionalidade){
                    sql=`insert into tbl_nacionalidade_diretor(
                            id_nacionalidade,
                            id_diretor
                        ) values(
                            ${nacionalidade},
                            ${idDiretor[0].id}
                        )`
                    let result=await prisma.$executeRawUnsafe(sql)
                    if(result)
                        continue
                    else
                        return false
                }
                return true
            }
            else
                return false 
           }  
    } catch (error) {
        console.log(error)
        return false
    }
}


// Excluir 
const deleteDiretor = async function(id){
    try {
        let sql = `delete from tbl_nacionalidade_diretor where id_diretor=${id}`
        
        let rsTabela = await prisma.$executeRawUnsafe(sql)
        if(rsTabela == 0){
            sql = `delete from tbl_diretor where id=${id}`
            let rsDiretor = await prisma.$executeRawUnsafe(sql)
            console.log(rsDiretor);
            return rsDiretor
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

// Atualizar
const updateDiretor = async function(id, dadosDiretor){
    try {
        let sql
        // Se a data de falecimento estiver vazia, null 
        if (dadosDiretor.data_falecimento != '' &&
            dadosDiretor.data_falecimento != null &&
            dadosDiretor.data_falecimento != undefined) {


            sql = `
            update tbl_diretor 
            set 
                nome='${dadosDiretor.nome}',
                data_nascimento='${dadosDiretor.data_nascimento}',
                data_falecimento='${dadosDiretor.data_falecimento}',
                foto='${dadosDiretor.foto}',
                biografia='${dadosDiretor.biografia}',
                id_sexo=${dadosDiretor.id_sexo}

            where id='${id}';
        `
        }
        else {
            // Script sql
            sql = `
            update tbl_diretor
            set 
                nome='${dadosDiretor.nome}',
                data_nascimento='${dadosDiretor.data_nascimento}',
                foto='${dadosDiretor.foto}',
                biografia='${dadosDiretor.biografia}',
                id_sexo=${dadosDiretor.id_sexo}

            where id='${id}';
        `
        }
        let atualizacao = await prisma.$executeRawUnsafe(sql)
        if (atualizacao) {
            for (let nacionalidade of dadosDiretor.id_nacionalidade) {
                sql = `
                
                    update tbl_nacionalidade_diretor
                        
                    set
                        id_nacionalidade=${nacionalidade},
                        id_diretor=${id}
                    
                    where id_diretor=${id}
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


module.exports={
   selectAllDiretores,
   selectFilmes,
   selectLastID,
   selectByIdDiretor,
   insertDiretor,
   updateDiretor,
   deleteDiretor
}

