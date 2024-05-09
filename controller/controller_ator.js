const atorDAO=require('../modulo/DAO/ator.js')
const sexoDAO=require('../modulo/DAO/sexo.js')
const nacionalidadeDAO  =require('../modulo/DAO/nacionalidade.js')
const message=require('../modulo/config.js')

//oi

// Função para inserir um novo ator 
const setInserirNovoAtor=async function(dadosAtor, contentType){
    try {
        if(String(contentType).toLowerCase()=='application/json'){
            
            const validacaoSexo = sexoDAO.selectByIDSexo(dadosAtor.id_sexo)

        
            let novoAtorJSON={}
            let ultimoID
            if(
            dadosAtor.nome==''             ||dadosAtor.nome==undefined             ||dadosAtor.nome==null                  ||dadosAtor.nome.length>100            ||
            dadosAtor.data_nascimento==''  ||dadosAtor.data_nascimento==undefined  ||dadosAtor.data_nascimento==null       ||dadosAtor.data_nascimento.length!=10 ||
            dadosAtor.biografia==''        ||dadosAtor.biografia==undefined        ||dadosAtor.biografia==null             ||dadosAtor.biografia.length>65000     ||
            dadosAtor.foto==''             ||dadosAtor.foto==undefined             ||dadosAtor.foto==null                  ||dadosAtor.foto.length>150            ||
            dadosAtor.id_sexo==''          ||dadosAtor.id_sexo==undefined          ||dadosAtor.id_sexo==null               ||dadosAtor.id_sexo>2                  ||
            !validacaoSexo
            )
                return message.ERROR_REQUIRED_FIELDS
            else{
                let validateStatus=false
                if(dadosAtor.data_falecimento!=null&&dadosAtor.data_falecimento!=''&&dadosAtor.data_falecimento!=undefined){
                    if(dadosAtor.data_falecimento.length!=10){
                        return message.ERROR_REQUIRED_FIELDS
                    }else{
                        validateStatus=true
                    }
                }else{
                    validateStatus=true
                }
    
                if(validateStatus){
                    let novoAtor=await atorDAO.insertAtor(dadosAtor)
                    if(novoAtor){
                        novoAtorJSON.ator=dadosAtor
                        novoAtorJSON.status=message.SUCCESS_CREATED_ITEM.status
                        novoAtorJSON.status_code=message.SUCCESS_CREATED_ITEM.status_code
                        novoAtorJSON.message=message.SUCCESS_CREATED_ITEM.message
                        ultimoID=await atorDAO.selectLastID()
                        dadosAtor.id=ultimoID[0].id               
                        return novoAtorJSON
                    }
                    else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        // Verificacao de erros 
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
        
    }
}

// Função para listar todos os atores 
const getTodosAtores = async function(){
    try {
        let atoresJSON = {}
        let dadosAtor = await atorDAO.selectAllAtores()
        if(dadosAtor){
            if(dadosAtor.length > 0){
                // Referenciar com o filme, sexo e nacionalidade
                for(let ator of dadosAtor){
                    ator.filmes        = await atorDAO.selectFilmes(ator.id)
                    ator.sexo          = await sexoDAO.selectByIDSexo(ator.id_sexo)
                    ator.nacionalidade = await nacionalidadeDAO.selectByIDNacionalidade(ator.id)

                    delete ator.id_sexo
                }
                atoresJSON.atores  = dadosAtor
                atoresJSON.quantidade = dadosAtor.length
                atoresJSON.status_code = 200
               return atoresJSON
            } else
            return message.ERROR_NOT_FOUND
        } else
        return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
        
    }
}

// Função para buscar pelo nome do ator
const getBuscarAtorPeloNome=async function(nome){
    try {
        let nomeAtor=nome
        let atoresJSON={}
        if(nomeAtor==''||nomeAtor==undefined||!isNaN(nomeAtor))
            return message.ERROR_INVALID_ID
        else{
            let dadosAtores=await atorDAO.selectByNomeDoAtor(nomeAtor)
            if(dadosAtores){
                if(dadosAtores.length>0){
                    for (let ator of dadosAtores){
                        ator.filmes=await atorDAO.selectFilmes(ator.id)
                        ator.sexo = await sexoDAO.selectByIDSexo(ator.id_sexo)
                        ator.nacionalidade = await nacionalidadeDAO.selectByIDNacionalidade(ator.id)
                        delete ator.id_sexo
                    }
                    atoresJSON.atores=dadosAtores
                    atoresJSON.status_code=200
                    return atoresJSON
                }else
                    return message.ERROR_NOT_FOUND
            }
            else
                return message.ERROR_INTERNAL_SERVER_DB
    }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

// Função para excluir um ator
const setExcluirAtor = async function(id){
    try {
        let idDoAtor = id
        if(idDoAtor == '' || idDoAtor == undefined || isNaN(idDoAtor))
        return message.ERROR_INVALID_ID

        else{
            let existe = await atorDAO.selectByIdAtor(idDoAtor)
            if(existe){
                let excluir = await atorDAO.deleteAtor(idDoAtor)
                console.log(excluir);
                    return message.SUCCESS_DELETE_ITEM
            }
             else{
                return message.ERROR_NOT_FOUND
             }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarAtorPeloID=async function(id){
    try {
        let idAtor=id
        let atoresJSON={}
        if(idAtor   ==  ''||idAtor  ==  undefined  ||  isNaN(idAtor))
            return message.ERROR_INVALID_ID
        else{
            let dadosAtor=await atorDAO.selectByIdAtor(idAtor)
            if(dadosAtor){
                if(dadosAtor.length>0){
                    for (let ator of dadosAtor){
                        ator.filmes=await atorDAO.selectFilmes(ator.id)
                        ator.sexo = await sexoDAO.selectByIDSexo(ator.id_sexo)
                        ator.nacionalidade = await nacionalidadeDAO.selectByIDNacionalidade(ator.id)
                        delete ator.id_sexo
                    }
                    atoresJSON.ator=dadosAtor
                    atoresJSON.status_code=200
                    return atoresJSON
                }else
                    return message.ERROR_NOT_FOUND
            }else
                return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}


const setAtualizarAtor=async function(id, dadosAtor, contentType){
    try {
        if(String(contentType).toLowerCase()=='application/json'){
            let idAtor=id
            if(idAtor==''||idAtor==undefined||isNaN(idAtor))
                return message.ERROR_INVALID_ID
            else if(dadosAtor.id_nacionalidade==null||dadosAtor.id_nacionalidade==undefined)
                return message.ERROR_REQUIRED_FIELDS
            else{
                let ator=await atorDAO.selectByIdAtor(idAtor)
                console.log(ator);
                if(ator){
                    let atorAtualizadoJSON={}
                    let atorAtualizado=await atorDAO.uptadeAtor(idAtor, dadosAtor)
                    if(atorAtualizado){
                        atorAtualizadoJSON.ator=dadosAtor
                        atorAtualizadoJSON.status=message.SUCCESS_UPDATE_ITEM.status
                        atorAtualizadoJSON.status_code=message.SUCCESS_UPDATE_ITEM.status_code
                        atorAtualizadoJSON.message=message.SUCCESS_UPDATE_ITEM.message
                        return atorAtualizadoJSON
                    }
                    else
                        return message.ERROR_NOT_FOUND
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

module.exports={
    getTodosAtores,
    setInserirNovoAtor,
    getBuscarAtorPeloNome,
    setExcluirAtor,
    getBuscarAtorPeloID,
    setAtualizarAtor
}