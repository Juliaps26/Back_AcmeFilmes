//  Arquivo responsavel pela validação de dados

// Import do arquivo de mensagens 
const message = require('../modulo/config.js')
// Import do arquivo DAO que fará comunicação como Banco de Dados 
const generoDAO = require('../modulo/DAO/genero.js');


// Função para inserir um novo genero 
const setInserirNovoGenero = async function(dadosGenero, contentType){
try {
    // Validar o contentType na requisição
    if(String(contentType).toLowerCase() == 'application/json'){
        // Criando objeto JSON para devolver os dados criados na requisição
        let novoGeneroJSON = {}
        let ultimoID
        // Validação dos campos obrigatorios
        if(dadosGenero.nome == '')
            // Caso tenha problema retorna o 400
            return message.ERROR_REQUIRED_FIELDS 
        else{
        
          let novoGenero = await generoDAO.insertGenero(dadosGenero)
                // Verificar se o DAO inseriu os dados no BD
                if(novoGenero){
                    // Se ela inseriu, cria um JSON (201)
                    novoGeneroJSON.genero        = dadosGenero
                    novoGeneroJSON.status        = message.SUCCESS_CREATED_ITEM.status
                    novoGeneroJSON.status_code   = message.SUCCESS_CREATED_ITEM.status_code
                    novoGeneroJSON.message       = message.SUCCESS_CREATED_ITEM.message

                    ultimoID = await generoDAO.selectLastID()
                    dadosGenero.id = ultimoID[0].id
                    return novoGeneroJSON  //201

                } else{
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }

    } else{
        // Retornar mensagem de erro do contentType
        return message.ERROR_CONTENT_TYPE   //415
    }
    
} catch (error) {

    console.log(error)

    // Retornar mensagem de erro na controller
    return message.ERROR_INTERNAL_SERVER; //500
    
}
}

//  Função para retornar todos os generos 
const getListarGeneros = async function(){
    let generosJSON = {};
    let dadosGenero = await generoDAO.selectAllGeneros();
    // Validação para ver se existem dados
    if(dadosGenero){
        // Criando o JSON
        generosJSON.genero = dadosGenero;
        generosJSON.quantidade = dadosGenero.length;
        generosJSON.status_code = 200
        return generosJSON;
    } else{
        // Se caso não tiver conteúdo
        return false;
    }
}

// Função para buscar genero pelo ID
const getBuscarGenero = async function(id){
    // Recebe o ID do genero
    let idGenero = id;
    let generosJSON = {

    }
    //Criando objeto JSON
    if(idGenero == '' || idGenero == undefined || isNaN(idGenero)){
        return message.ERROR_INVALID_ID;
    }else{
        // Encaminha o ID para o DAO buscar no banco de dados 
        let dadosGenero = await generoDAO.selectByIdGenero(idGenero);
        // Verifica se o DAO retornou os dados
        if(dadosGenero){
            // verificar a quanitdade de itens retornados
            if(dadosGenero.length > 0){
                // criando JSON para retorno
                generosJSON.genero      = dadosGenero;
                generosJSON.status_code = 200;

                return generosJSON
            }else{
                // se não for verdadeiro retorna o not found 404
                return message.ERROR_NOT_FOUND
            }

        } else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}
// Função para deletar um genero
const setExcluirGenero = async function(id){
    try {
        // recebe o ID do filme
        let idGenero = id
        // Validação para verificar se o id está vazio ou não
        if(idGenero== '' || idGenero==undefined ||isNaN(idGenero))
        return message.ERROR_INVALID_ID
        
        else{
            // variavel para buscar no DAO
            let deletar = await generoDAO.deleteGenero(idGenero)
            // se excluir retornar mensagem de sucesso
            if(deletar)
            return message.SUCCESS_DELETE_ITEM
            else{
                return message.ERROR_NOT_FOUND
            } 
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}
// Função para atualizar um genero pelo ID
const setAtualizarGenero = async function(id, dadosGenero, contentType){
    try {
        if(String(contentType).toLowerCase()=='application/json'){
            let idGenero = id
            if(idGenero== '' || idGenero ==undefined ||isNaN(idGenero))
            return message.ERROR_INVALID_ID
            else{
                // buscar no DAO o select genero pelo ID
                let genero=await generoDAO.selectByIdGenero(idGenero)
                if(genero){
                    let atualizacaoJSON={}
                    let atualizacao=await generoDAO.updateGenero(idGenero, dadosGenero)
                    console.log(atualizacao)

                    if(atualizacao){
                        atualizacaoJSON.genero      =    dadosGenero                      
                        atualizacaoJSON.status      =    message.SUCCESS_UPDATE_ITEM.status
                        atualizacaoJSON.status_code =    message.SUCCESS_UPDATE_ITEM.status_code
                        atualizacaoJSON.message     =    message.SUCCESS_UPDATE_ITEM.message
                        
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
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

// Função para buscar o genero pelo nome
const getBuscarGeneroPeloNome = async function (nome){
    try {
        let nomeDoGenero = nome
        let generosJSON = {}
        if(nomeDoGenero == '' || nomeDoGenero == undefined || !isNaN(nomeDoGenero))
        return message.ERROR_INVALID_ID
    else {
        let dadosGenero = await generoDAO.selectByNomeGenero(nomeDoGenero)
        if(dadosGenero) {
            if(dadosGenero.length > 0){
            generosJSON.generos = dadosGenero
            generosJSON.status_code = 200
            return generosJSON
            } else
            return message.ERROR_NOT_FOUND
        
        } else
        return message.ERROR_INTERNAL_SERVER_DB
    }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
        
    }
}



// Exportar
module.exports = {
    setInserirNovoGenero,
    getListarGeneros,
    getBuscarGenero,
    setExcluirGenero,
    setAtualizarGenero,
    getBuscarGeneroPeloNome
}
