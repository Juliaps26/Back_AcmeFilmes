// Arquivo para fazer a conexao com o banco de dados, fazer o CRUD da tabela classificacao
// Import da biblioteca do prisma client para manipular scripts SQL
const { PrismaClient } =require('@prisma/client');
const e = require('express')

// Instancia da classe PrismaClient
const prisma = new PrismaClient();


// Funcao para selecionar todas classificacoes
const selectAllClassificacoes = async function (){
 try {
    let sql = 'select * from tbl_classificacao;'
    let rsClassificacao = await prisma.$queryRawUnsafe(sql)
    return rsClassificacao
 } catch (error) {
    return false
    
 }
}

// Função para buscar pelo ID
const selectByIdClassificacao = async function (id){
    try {
        // Filtrar pelo ID
        let sql = `select * from tbl_classificacao where id = ${id};`
        let rsClassificacao = await prisma.$queryRawUnsafe(sql)

        return rsClassificacao
    } catch (error) {
        return false
        
    }
 
}

// Função para inserir uma nova classificação
const insertClassificacao = async function(dadosClassificacao){
    try {
        let sql = `insert into tbl_classificacao(
            faixa_etaria,
            classificacao,
            descricao,
            icon
        )values(
            '${dadosClassificacao.faixa_etaria}',
            '${dadosClassificacao.classificacao}',
            '${dadosClassificacao.descricao}',
            '${dadosClassificacao.icon}'
        )`;

        let result = await prisma.$executeRawUnsafe(sql);
        if(result)
        // Falha na comunicacao com o bd
    return true;
    else
    return false
        
    } catch (error) {
        return false;
        
    }
}

// Selecionar o ultimo ID
const selectLastID = async function (){
    try {
        let sql= `select cast(last_insert_id() as decimal) as id from tbl_classificacao limit 1;`
        let rsID = await prisma.$queryRawUnsafe(sql)
        return rsID
    
    } catch (error) {
      return false    
    }
}


// Função para atualizar uma classificaçao
const uptadeClassificacao = async function(id, dadosClassificacao){
    try {
        let sql = `update tbl_classificacao
        set 
        faixa_etaria   = '${dadosClassificacao.faixa_etaria}',
        classificacao  = '${dadosClassificacao.classificacao}',
        descricao      = '${dadosClassificacao.descricao}',
        icon           = '${dadosClassificacao.icon}'

        where id = '${id}';
        `

        let atualizacao = await prisma.$executeRawUnsafe(sql)
        if(atualizacao)
        return true
        else
        return false
    } catch (error) {
        return false
    }
}

// Função para excluir uma classificacao, só exclui quando não há um filme com aquela classificação
const deleteClassificacao = async function(id){
    try {
        let sql= `delete from tbl_classificacao where id=${id}`
        console.log(sql)
        let rsClassificacao = await prisma.$executeRawUnsafe(sql)
        return rsClassificacao
    } catch (error) {
        return false
    }
}



// Exportar as funções
module.exports={
    deleteClassificacao,
    selectAllClassificacoes,
    selectLastID,
    selectByIdClassificacao,
    insertClassificacao,
    uptadeClassificacao
}