/******************************************************************************************************************************
 * Objetivo: Arquivo responsavel pela validação, consistencia de dados das requisições da API de filme
 * Data: 01/02/2024
 * Autor: Júlia
 * Versão: 1.0
 *
 *****************************************************************************************************************/

// Import
const message = require('../modulo/config.js')
const classificacao = require('./controller_classificacao.js')

// Import do arquivo DAO que fará comunicação como Banco de Dados 
const filmeDAO = require('../modulo/DAO/filme.js');


// Função para validar e inserir um novo filme - async  tempo de processamento
// Quando houver solicitação de dados set

const setInserirNovoFilme = async function (dadosFilme, contentType) {

try{
    // Estrutura condicional
// Validação do content-type na requisição
    if(String(contentType).toLowerCase() == 'application/json'){


        // Validacao para classificao 
        const validacaoClassificacao = classificacao.getBuscarClassificacaoPeloID(dadosFilme.id_classificacao)

    // Cria um objeto JSON para devolver os dados criados na requisição
    let novoFilmeJSON = {};

    //Validação de campos obrigatórios ou com a digitação inválida
    if(dadosFilme.nome == ''         || dadosFilme.nome == undefined             || dadosFilme.nome == null          || dadosFilme.nome.length > 80            ||
    dadosFilme.sinopse == ''         ||  dadosFilme.sinopse == undefined         ||  dadosFilme.sinopse == null         || dadosFilme.sinopse.length > 65000      ||
    dadosFilme.duracao == ''         || dadosFilme.duracao == undefined          || dadosFilme.duracao == null          || dadosFilme.duracao.length > 8          ||
    dadosFilme.data_lancamento == '' || dadosFilme.data_lancamento == undefined  || dadosFilme.data_lancamento == null  || dadosFilme.data_lancamento.length !=10 ||
    dadosFilme.foto_capa == ''       || dadosFilme.foto_capa == undefined        || dadosFilme.foto_capa == null        || dadosFilme.foto_capa.length>200        ||
    dadosFilme.valor_unitario.length>6 ||
    validacaoClassificacao.status == false
    

    ){   
        // Caso tenha algum problema retorna o 400
        return message.ERROR_REQUIRED_FIELDS;  //400
    }else{

        // Variavel
        let validateStatus = false;



// IF - Validação da data de relancamento, já que ela não é obrigatória no BD

                                   // Se ela for diferente de nulo               // Diferente de vazio
        if(dadosFilme.data_relancamento != null &&
            dadosFilme.data_relancamento !=''   &&
            dadosFilme.data_relancamento != undefined){ 

                // Validação para verificar se a data esta com a quantidade de digitos corretos (10)
        if(dadosFilme.data_relancamento.length != 10){
                     return message.ERROR_REQUIRED_FIELDS; //400

        }else{
            validateStatus = true;
        }
} else{
 validateStatus = true
}


// IF - Validação para verificar se podemos encaminhar os dados para o DAO
if(validateStatus){

    
        // Encaminha os dados do filme para o DAO inserir no BD
        let novoFilme = await filmeDAO.insertFilme(dadosFilme);

        // Validação para verificar se o DAO inseriu os dados do BD
        if(novoFilme){


            // Criando uma variavel para mostra o id e retornar a função que criamos no DAO (filme.js)
                                            // Puxando a função ()
            let selecionarID = await filmeDAO.retornarID()
            // Dados do filme e chamei o id, colocando para aparecer junto com todos os dados dos filmes
            // 0 - para nã ficar em formato de JSON 
            dadosFilme.id = selecionarID[0].id


            // Se ele inseriu, cria um JSON de retorno de dados (201)
            // Devolver no JSON as mesmas coisas que estam no config
            novoFilmeJSON.filme       = dadosFilme;
            novoFilmeJSON.status      = message.SUCCESS_CREATED_ITEM.status;
            novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code;
            novoFilmeJSON.message     = message.SUCCESS_CREATED_ITEM.message;

            return novoFilmeJSON;  //201
        } else{
        
            return message.ERROR_INTERNAL_SERVER_DB;  
        }

}

    }

}else{
    // Retornando a mensagem de erro do content-type
    return message.ERROR_CONTENT_TYPE;   //415
}

}catch(error){
   
    return message.ERROR_INTERNAL_SERVER; //500 erro na controller

}

}

// Função para validar e atualizar um filme - PUT
// recebe o id pela url
const setAtualizarFilme = async function (id, dadosFilme, contentType) {
    try{

        if(String(contentType).toLowerCase()=='application/json'){
            let idFilme = id
            // Validação
            if(idFilme== ''|| idFilme ==undefined||isNaN(idFilme))
            return message.ERROR_INVALID_ID
            else{
                // Variavel para buscar no DAO o select filme pelo ID
                let filme=await filmeDAO.selectByIdFilme(idFilme)
                if(filme){
                    let atualizacaoJSON={}
                    let atualizacao=await filmeDAO.updateFilme(idFilme, dadosFilme)

                    console.log(atualizacao);

                    if(atualizacao){
                        atualizacaoJSON.filme=dadosFilme
                        atualizacaoJSON.status=message.SUCCESS_UPDATE_ITEM.status 
                        atualizacaoJSON.status_code=message.SUCCESS_UPDATE_ITEM.status_code //200
                        atualizacaoJSON.message=message.SUCCESS_UPDATE_ITEM.message 
                        
                        return atualizacaoJSON

                    }
                    else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
                else
                return message.ERROR_NOT_FOUND
            }

        }else{
            return message.ERROR_CONTENT_TYPE 
        }
    } catch(error){
        return message.ERROR_INTERNAL_SERVER
    }
    
}

// Função para excluir um filme - DELETE 
const setExcluirFilme = async function (id) {

    try{
        // Receber o id do filme 
        let idFilme = id
        // Validação para verificar se o id está vazio ou não existe 
        if(idFilme== '' || idFilme==undefined ||isNaN(idFilme))
        return message.ERROR_INVALID_ID //400

        else{
            // Criando variavel para buscar no DAO 
            let excluir =  await filmeDAO.deleteFilme(idFilme)
            // Validação se excluir o filme retornar uma messagem de sucesso 
            if(excluir)
            return message.SUCCESS_DELETE_ITEM //200
            else{
                return message.ERROR_NOT_FOUND  //404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER  //500
    }
}


// Função para retornar todos os filmes
const getListarFilmes = async function () {
// Criando objeto JSON  
    let filmesJSON = {};
    // Chama a função do DAO para retornar os dados da tabela de Filme
    let dadosFilmes = await filmeDAO.selectAllFilmes();

    // Validação para verificar se existem dados
    if (dadosFilmes) {
        // Criando o JSON para devolver o APP 
        filmesJSON.filmes = dadosFilmes;
        filmesJSON.quantidade = dadosFilmes.length;
        filmesJSON.status_code = 200;
        return filmesJSON;
    } else {
        // Se caso não vier o conteúdo
        return false;
    }


}
// Função para buscar um filme pelo ID
const getBuscarFilme = async function (id) {

// Recebe o ID do filme
    let idFilme = id;
    let filmesJSON = {

    }

// Cria o objeto JSON
    if(idFilme == '' || idFilme == undefined || isNaN(idFilme)){
        return message.ERROR_INVALID_ID;
    }else{
        // Encaminha o ID para o DAO buscar no banco de dados 
        let dadosFilme = await filmeDAO.selectByIdFilme(idFilme);
        // Verifica se o DAO retornou dados
        if(dadosFilme){

            // Validação para verificar a quantidade de itens retornados
            if(dadosFilme.length > 0){
                 // Cria o JSON para retorno
            filmesJSON.filme = dadosFilme;
            filmesJSON.status_code = 200;

            return filmesJSON;
            }else{
                // Se não for verdadeiro retorna o not found 404
                return message.ERROR_NOT_FOUND;
            }
           
        }else{
            return message.ERROR_INTERNAL_SERVER_DB  //500
        }
    }

}


//Exportar
module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme
}