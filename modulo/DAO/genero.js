// Arquivo para fazer a conexao com o banco de dados, fazer o CRUD da tabela genero
// Import da biblioteca do prisma client para manipular scripts SQL
const { PrismaClient } = require('@prisma/client');
const { Sql } = require('@prisma/client/runtime/library');
const e = require('express')

// Instancia da classe PrismaClient
const prisma = new PrismaClient();

// Função para inserir um genero novo no banco de dados
const insertGenero = async function(dadosGenero){
    try {
        let sql = `insert into tbl_genero(
            nome
        )values(
            '${dadosGenero.nome}'
        )`;

        let result = await prisma.$executeRawUnsafe(sql);
        if(result)
        // Esses dois return vai representar falha na comunicação com o banco
        return true;
        else
        return false

        
    } catch (error) {
      
        return false;
        
    }
}

// Função para selecionar todos os generos 
const selectAllGeneros = async function(){
    let sql = 'select * from tbl_genero';

    let rsGenero = await prisma.$queryRawUnsafe(sql)
    // Validação
    if(rsGenero.length > 0)
    return rsGenero;
    else
    return false;
}

// Função para buscar um filme no bd pelo ID
const selectByIdGenero = async function (id){

try {
    // Script para filtrar pelo ID
    let sql = `select * from tbl_genero where id = ${id}`;
    let rsGenero = await prisma.$queryRawUnsafe(sql);

    return rsGenero;
} catch (error) {
    
}
// Script SQL para filtrar pelo ID
let sql = `select * from tbl_genero where id = ${id}`
// Executar no banco de dados
let rsGenero = await prisma.$queryRawUnsafe(sql)
return rsGenero;
}

// Função para deletar um genero
const deleteGenero = async function(id){
    try {
        // Variavel para deletar na tabela de generos do BD de acordo com o ID
        let sql= `delete from tbl_genero where id=${id}`
        console.log(sql)
        // Variavel para consultar no bd e guardar na variavel rsGenero
        let rsGenero = await prisma.$queryRawUnsafe(sql)
        console.log(rsGenero);
        return rsGenero
        
        // Caso houver erro retorna false    
    } catch (error) {
        return false
    }
}

// Função para atualizar um genero
const updateGenero= async function(id,dadosGenero){
    try {
       let sql= `
       update tbl_genero
       set
       nome='${dadosGenero.nome}'
       where id='${id}';
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

// Selecionar o ultimo ID
const selectLastID=async function(){
    try {
        let sql='select cast(last_insert_id() as decimal) as id from tbl_genero limit 1;'
        let rsID=await prisma.$queryRawUnsafe(sql)
        return rsID
    } catch (error) {
        return false
    }
}

// Selecionar pelo nome do genero
const selectByNomeGenero = async function(nome){
    let nomeDoGenero = nome

    try {
        let sql = `select * from tbl_genero where nome like "%${nomeDoGenero}%"`
        let rsGeneros = await prisma.$queryRawUnsafe(sql)
        return rsGeneros
    
    } catch (error) {
        return false    
    }
}



// Exportar todas as funções para a controller
module.exports = {
    selectAllGeneros,
    insertGenero,
    selectByIdGenero,
    deleteGenero,
    updateGenero,
    selectLastID,
    selectByNomeGenero
}