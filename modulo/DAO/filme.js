0
/******************************************************************************************************************************
 * Objetivo: Arquivo responsavel pelo acesso ao Banco de dados MySQL, aqui faremos o CRUD na tabela de filme
 * Data: 01/02/2024
 * Autor: Júlia
 * Versão: 1.0
 *
 *****************************************************************************************************************/
// Criando variavel global 
// Import da biblioteca do prisma client para manipular scripts SQL
const { PrismaClient } = require('@prisma/client');
const { Sql } = require('@prisma/client/runtime/library');

// Instancia da classe PrismaClient
const prisma = new PrismaClient();



// Criando funções - sempre na model usar as palavras de scipt

// Função para inserir um novo filme no banco de dados 
// async 
const insertFilme = async function (dadosFilme) {

    try {

        let sql;
        
        if(dadosFilme.data_relancamento != ''&& 
        dadosFilme.data_relancamento    != null&&
        dadosFilme.data_relancamento    != undefined){


    // Criar uma variavel
             // Colocar a crase para facilotar a concatenação
    sql = `insert into tbl_filme( 
        nome,
        sinopse,
        duracao,
        data_lancamento,
        data_relancamento,
        foto_capa,
        valor_unitario,
        id_classificacao

    ) values(

        '${dadosFilme.nome}',
        '${dadosFilme.sinopse}',
        '${dadosFilme.duracao}',
        '${dadosFilme.data_lancamento}',
        '${dadosFilme.data_relancamento}',
        '${dadosFilme.foto_capa}',
        ${dadosFilme.valor_unitario},
        '${dadosFilme.id_classificacao}'

    )`;

    // Script a cima ^ - concatenado as variaveis 
} else {
     sql = `insert into tbl_filme( 
        nome,
        sinopse,
        duracao,
        data_lancamento,
        data_relancamento,
        foto_capa,
        valor_unitario,
        id_classificacao

    ) values(

        '${dadosFilme.nome}',
        '${dadosFilme.sinopse}',
        '${dadosFilme.duracao}',
        '${dadosFilme.data_lancamento}',
        null,
        '${dadosFilme.foto_capa}',
        ${dadosFilme.valor_unitario},
        '${dadosFilme.id_classificacao}'

    )`;


}
console.log(sql);

    // $executeRawUnsafe() - serve para executar scripts sem retorno de dados 
    //  (insert, update e delete)
    // $queryRawUnsafe() - serve para executar scripts com o retorno de dados (select)
    let result = await prisma.$executeRawUnsafe(sql);

    if(result)
    return true;
    else
    // Esses dois return false, signfica falha na comunicação com o banco 
    return false;
     
    
        } catch(error){
            console.log(error)
            return false;
        }


}

// Função para atualizar um filme no banco de dados 
const updateFilme =async function (id, dadosFilme) {
    try{
        let sql
        if(dadosFilme.data_relancamento!=''&
        dadosFilme.data_relancamento!=null&&
        dadosFilme.data_relancamento!=undefined){

            sql=`
            update tbl_filme

            set

            nome='${dadosFilme.nome}',
            sinopse='${dadosFilme.sinopse}',
            duracao='${dadosFilme.duracao}',
            data_lancamento='${dadosFilme.data_lancamento}',
            data_relancamento='${dadosFilme.data_relancamento}',
            foto_capa='${dadosFilme.foto_capa}',
            valor_unitario='${dadosFilme.valor_unitario}'

            where id='${id}';
            `
        }
        else{

            sql=`
            update tbl_filme

            set

            nome='${dadosFilme.nome}',
            sinopse='${dadosFilme.sinopse}',
            duracao='${dadosFilme.duracao}',
            data_lancamento='${dadosFilme.data_lancamento}',
            data_relancamento=null,
            foto_capa='${dadosFilme.foto_capa}',
            valor_unitario='${dadosFilme.valor_unitario}'

            where id='${id}';
            `
        }
        let atualizacao= await prisma.$executeRawUnsafe(sql)

        if(atualizacao)
           return true
        else
            return false
    }catch(error) {
        return false

    }


}

// Função para excluir um filme no banco de dados 
// Implementação de trycatch
const deleteFilme = async function (id) {
    // Executar e verificar erro
    try{
        // Variavel para deletar na tabela filmes do BD de acordo com o id
        let sql= `delete from tbl_filme where id=${id}`
        // Variavel para consultar no banco de dados e guardar na variavel rsFilmes
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
        // Caso houver erro retorna false
    } catch (error){
        return false
    }

}

// Função para listar todos os filmes do banco de dados
// all - todos 
const selectAllFilmes = async function () {

    // Criar uma variavel para montar meu script SQL para o banco de dados
    let sql = 'select * from tbl_filme';

    // Query - SELECT (tem retorno de dados)
    // Execute - INSERT, UPDATE E DELETE (não tem retorno de dados)
    // rs - result

    // usamos o RawUnsafe para mandar a variavel
    // Vai executar a funcao e esperar (await) o resultado do Banco
    // Executa o script SQL no BD e recebe o retorno de dados 
    let rsFilmes = await prisma.$queryRawUnsafe(sql)
    // $queryRawUnsafe(sql)
    // $queryRaw('select * from tbl_filme')

    // Validação para retornar os dados 
    if (rsFilmes.length > 0)
        return rsFilmes;
    else
        return false;

}

// Função para buscar um filme no banco de dados filtrando pelo ID
const selectByIdFilme = async function (id) {

    try {
        // Tudo que queremos executar
        // Script SQL para filtrar pelo ID
    let sql = `select * from tbl_filme where id = ${id}`;
    // Executa  SQL no banco de dados
    let rsFilme = await prisma.$queryRawUnsafe(sql);

 // O que o banco retornar volta pra controller
    return rsFilme;
        
    } catch (error) {
        
        
    }

    // Script SQL para filtrar pelo ID
    let sql = `select * from tbl_filme where id = ${id}`;
    // Executa  SQL no banco de dados
    let rsFilme = await prisma.$queryRawUnsafe(sql);

 // O que o banco retornar volta pra controller
    return rsFilme;
}


// Função para buscar um filme filtrando pelo nome
const selectByNomeFilme = async function(nome){
 let nomeDoFilme = nome
 try {
    let sql = `select * from tbl_filme where nome like "%${nomeDoFilme}"`
    let rsFilmes = await prisma.$queryRawUnsafe(sql)
    return rsFilmes
 } catch (error) {
    return false
 }


}

const retornarID = async function(){
    try {
        let sql = `select cast(last_insert_id() AS DECIMAL) as id from tbl_filme limit 1;`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes
    } catch (error) {
        return false
        
    }
}

// Exportar todas as funções para a controller
module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    retornarID,
    selectByNomeFilme
}