//  Arquivo responsavel pela validação de dados

// Import do arquivo de mensagens 
const message = require('../modulo/config.js')
// Import do arquivo DAO que fará comunicação como Banco de Dados 
const classificacaoDAO = require('../modulo/DAO/classificacao.js')



// Função para inserir uma classificacao
const setInserirNovaClassificacao = async function (dadosClassificacao, contentType) {
  try {
      if (String(contentType).toLowerCase() == 'application/json') {
          let novaClassificacaoJSON = {}
          let ultimoID
          if (dadosClassificacao.faixa_etaria == ''||dadosClassificacao.classificacao==''||dadosClassificacao.caracteristica==''||dadosClassificacao.icone=='')
              return message.ERROR_REQUIRED_FIELDS
          else {
              let novoGenero = await classificacaoDAO.insertClassificacao(dadosClassificacao)
              if (novoGenero) {
                  novaClassificacaoJSON.genero = dadosClassificacao
                  novaClassificacaoJSON.status = message.SUCCESS_CREATED_ITEM.status
                  novaClassificacaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                  novaClassificacaoJSON.message = message.SUCCESS_CREATED_ITEM.message
                  ultimoID = await classificacaoDAO.selectLastID()
                  dadosClassificacao.id = ultimoID[0].id
                  return novaClassificacaoJSON
              }
              else {
                  return message.ERROR_INTERNAL_SERVER_DB
              }
          }
      } else {
          return message.ERROR_CONTENT_TYPE
      }
  } catch (error) {

      return message.ERROR_INTERNAL_SERVER
  }
}


// Imcopleta
const setExcluirClassificacao = async function(id){
  try {
    let idClassificacao = id
    if(idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao))
    return message.ERROR_INVALID_ID

    else{

      let excluir = await classificacaoDAO.deleteClassificacao(idClassificacao)
      if(excluir)
      return message.SUCCESS_DELETE_ITEM
    else{
      return message.ERROR_NOT_FOUND
    }
    }
  } catch (error) {
  
    return message.ERROR_INTERNAL_SERVER
  }
}


// Retornar todas classificacoes
const getTodasClassificacoes = async function (){
  try {
    let classificacaoJSON = {}
    let dadosClassificacao = await classificacaoDAO.selectAllClassificacoes()
    if(dadosClassificacao){
      if(dadosClassificacao.length > 0 ){
        classificacaoJSON.classificacao   = dadosClassificacao
        classificacaoJSON.quantidade      = dadosClassificacao.length
        classificacaoJSON.status_code     = 200
        return classificacaoJSON
      } else
      return message.ERROR_NOT_FOUND
    } else
    return message.ERROR_INTERNAL_SERVER_DB
  } catch (error) {
    return message.ERROR_INTERNAL_SERVER
  }
}


// Buscar pelo id fda classificacao
const getBuscarClassificacaoPeloID = async function(id){
  try {
    let idClassificacao = id
    let classificacaoJSON = {}
    if(idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao))
    return message.ERROR_INVALID_ID
    else{
      let dadosClassificacao = await classificacaoDAO.selectByIdClassificacao(idClassificacao)

      if(dadosClassificacao){
        if(dadosClassificacao.length > 0 ){
          classificacaoJSON.classificacao  = dadosClassificacao
          classificacaoJSON.status_code    = 200
          return classificacaoJSON
        } else
        return message.ERROR_NOT_FOUND
      } else
      return message.ERROR_INTERNAL_SERVER_DB
    }
  } catch (error) {
    return message.ERROR_INTERNAL_SERVER
  }
}

// Atualizar classificacao 
const setAtualizarClassificacao = async function(id, dadosClassificacao, contentType){
  try {
    if(String(contentType).toLowerCase() == 'application/json'){
      let idClassificacao = id
      if(idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao))
      return message.ERROR_INVALID_ID
      else{
        let classificacao  = await classificacaoDAO.selectByIdClassificacao(idClassificacao)
        if(classificacao){
          let atualizacaoClassificacaoJSON = {}
          let atualizacaoClassificacao = await classificacaoDAO.uptadeClassificacao(idClassificacao, dadosClassificacao)
          if(atualizacaoClassificacao) {
            atualizacaoClassificacaoJSON.classificacao   = dadosClassificacao
            atualizacaoClassificacaoJSON.status          = message.SUCCESS_UPDATE_ITEM.status
            atualizacaoClassificacaoJSON.status_code     = message.SUCCESS_UPDATE_ITEM.status_code
            atualizacaoClassificacaoJSON.message         = message.SUCCESS_UPDATE_ITEM.message
            return atualizacaoClassificacaoJSON
          }
          else{
            return message.ERROR_NOT_FOUND
          }
        }
        else 
        return message.ERROR_NOT_FOUND
      }
    } else{
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    return message.ERROR_INTERNAL_SERVER
  }
}

// Exportar
module.exports = {
    setInserirNovaClassificacao,
    setExcluirClassificacao,
    getTodasClassificacoes,
    getBuscarClassificacaoPeloID,
    setAtualizarClassificacao
}
