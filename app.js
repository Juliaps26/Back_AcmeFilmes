/**
 * Para realizar o acesso ao Banco de Dados precisamos instalar algumas bibliotecas:
 * - SEQUELIZE - uma biblioteca mais antiga ela tem bastante documentação porém a uns bugs que foram corrigidos  nos outros
 * - PRISMA ORM - mais atual
 * - FASTFY ORM - mais atual
 * 
 *   -- Para instalar o PRISMA:
 * - npm install prisma --save   (Irá reaalizar a conexão com BD)
 * - npm install @prisma/client --save   (Irá executar os scripts SQL no BDinit)
 * 
 *  -- Após a instalação das bibliotecas, devemos inicializar o prisma no projeto:
 * - npx prisma init
 * 
 * -- DataBase: db_filmes_turma_bb
 * 
 * -- APP fala com a controller e a controller com a model
 * -- Comeca pela model faz a função, depois a controller e depois o app
 *
 */


// Import da biblioteca para criar a API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


// Cria um objeto app tendo como referencia a classe do express
const app = express();
app.use((request,response,next) => {
    response.header('Access-Control-Allow-Origin','*');
    response.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    app.use(cors())
    next();

})

/**Import dos arquivos da controller do projeto **/

const controllerFilmes            =   require('./controller/controller_filme.js');
const controllerGenero            =   require('./controller/controller_genero.js');
const controllerClassificacao     =   require('./controller/controller_classificacao.js');
const controllerAtores            =   require('./controller/controller_ator.js');
const controllerDiretores         =   require('./controller/controller_diretor.js')
const { defineDmmfProperty } = require('@prisma/client/runtime/library.js');




/**************************************************/
// Criando um objeto para controlar a chegada dos dados ada requisição em formato JSON
const bodyParserJSON = bodyParser.json();


// Trata a solicitação, obtedo a lista de filmes 'Get filmes', se a lista exisitir é
// enviada como resposa em formato de JSON com o status 200 (OK) e se não existir é
//  enviado um sttaus 404 (não econtrado)
app.get('/v1/acmefilmes/filme',cors(),async function(request,response,next){
    let controleFilmes=require('./controller/funcoes')
    let listaFilmes=controleFilmes.getFilmes()
    if(listaFilmes){
        response.json(listaFilmes)
        response.status(200)
    }
    else{
        response.status(404)
    }
})

app.get('/v1/acmefilmes/filme/:idUsuario',cors(),async function(request,response,next){
    let idFilme=request.params.idUsuario
    let controleFilmes=require('./controller/funcoes')
    let dadosFilme=controleFilmes.getFilmesID(idFilme)
    if(dadosFilme){
        response.json(dadosFilme)
        response.status(200)
    }
    else{
        response.status(404)
    }
})

// End Point - Versão 1.0 - retorna todos os filmes do arquivo filmes.js
// app.get('/v1/acmefilmes/filmes', cors(), async function(request, response){
// });

// End Points - Versão 2.0 - retorna todos os filmes do Banco de dados


// Retorna todos os filmes
app.get('/v2/acmefilmes/filmes', cors(), async function(request, response){

// Chama a função da controller para retornar os filmes
    let dadosFilmes = await controllerFilmes.getListarFilmes();
    response.status(dadosFilmes.status_code)
    response.json(dadosFilmes)

});

// Retorna o filme filtrando pelo ID
 app.get('/v2/acmeFilmes/filme/:id', cors(), async function(request, response){
    // Recebe o ID da requisição
    let idFilme= request.params.id
    // Encaminha o ID para a controller buscar o filme
    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)
    response.status(dadosFilme.status_code);
    response.json(dadosFilme);
 })

// Retornar os filmes pelo nome e arrumar na padronização
 app.get('/v2/acmefilmes/filmes/filtro', cors(), async function(request,response){
    let nomeFilme=request.query.nome
    let dadosFilmes=await controllerFilmes.getBuscarFilmePeloNome(nomeFilme)
    response.status(dadosFilmes.status_code)
    response.json(dadosFilmes)
 })

// Insere um novo filme - implementação do POST 
 app.post('/v2/acmefilmes/filme', cors(), bodyParserJSON, async function(request, response){

    // Recebe o content-type com o tipo de dados encaminhado na requisição
    let contentType = request.headers['content-type'];

    // Recebe todos os dados encaminhados na requisição pelo body
    let dadosBody = request.body;

    // Encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody,contentType);

    response.status(resultDadosNovoFilme.status_code);
    response.json(resultDadosNovoFilme)
 })

// Excluir um filme através do id 
 app.delete('/v2/acmeFilmes/deletefilme/:id', cors(), async function(request, response){
    let idFilme= request.params.id
    let filmeExcluido= await controllerFilmes.setExcluirFilme(idFilme)
    response.status(filmeExcluido.status_code)
    response.json(filmeExcluido)

 })

// Atualizar um filme
 app.put('/v2/acmeFilmes/updatefilme/:id', cors(), bodyParserJSON, async function(request,response){

    let idFilme = request.params.id
    let contentType=request.headers['content-type']
    let dadosBody=request.body
    let atualizacaoNovoFilme=await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)
    response.status(atualizacaoNovoFilme.status_code)
    response.json(atualizacaoNovoFilme)

 })

 // #region genero

 
// Listar todos os generos 
app.get('/v2/acmefilmes/todos/generos', cors(), async function(request, response){

    // Chama a função da controller para retornar os filmes
    let dadosGenero = await controllerGenero.getListarGeneros();
    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
    
 });

// Inserir um novo genero
app.post('/v2/acmefilmes/genero', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosNovoGenero = await controllerGenero.setInserirNovoGenero(dadosBody, contentType);

    response.status(200);
    response.json(resultDadosNovoGenero)
})

// Buscar um genero pelo seu ID
app.get('/v2/acmefilmes/genero/:id', cors(), async function(request, response){
    // recebe o ID da requisição
    let idGenero= request.params.id
    let dadosGenero = await controllerGenero.getBuscarGenero(idGenero)
    response.status(dadosGenero.status_code);
    response.json(dadosGenero);
})

// Excluir um genero atraves do ID
app.delete('/v2/acmefilmes/deletegenero/:id', cors(), async function(request, response){
    let idGenero = request.params.id
    let generoExcluido = await controllerGenero.setExcluirGenero(idGenero)
    response.status(generoExcluido.status_code)
    response.json(generoExcluido)
})



// Atualizar o genero
app.put('/v2/acmefilmes/uptadegenero/:id', cors(), bodyParserJSON, async function(request, response){
    let idGenero= request.params.id
    let contentType=request.headers['content-type']
    let dadosBody= request.body

    let resultadoNovoGenero= await controllerGenero.setAtualizarGenero(idGenero, dadosBody, contentType)
    response.status(resultadoNovoGenero.status_code)
    response.json(resultadoNovoGenero)
})

// Buscar genero pelo nome
app.get('/v2/acmefilmes/generos/filtro', cors(), async function(request, response){
    let nomeDoGenero = request.query.nome
    let dadosGenero = await controllerGenero.getBuscarGeneroPeloNome(nomeDoGenero)
    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})

// Listar todas as classificacoes
app.get('/v2/acmefilmes/todas/classificacoes', cors(), async function(request, response){
    // Chamando a função da controller para retornar os filmes
    let dadosClassificacao = await controllerClassificacao.getTodasClassificacoes()
    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})

// Inserir uma classificaçao nova
app.post('/v2/acmefilmes/classificacao/insert',cors(), bodyParserJSON, async function(request, response){
    let contentType=request.headers['content-type']
    let dadosBody=request.body
    let resultDadosNovaClassificacao = await controllerClassificacao.setInserirNovaClassificacao(dadosBody, contentType)
    response.status(resultDadosNovaClassificacao.status_code)
    response.json(resultDadosNovaClassificacao)
})

// Atualizar uma classificacao
app.put('/v2/acmefilmes/classificacao/atualizar/:id', cors(), bodyParserJSON, async function(request, response){
    let idClassificacao = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let atualizacaoClassificacao = await controllerClassificacao.setAtualizarClassificacao(idClassificacao, dadosBody, contentType)
    response.status(atualizacaoClassificacao.status_code)
    response.json(atualizacaoClassificacao)
})

// Excluir uma classificacao, quando não há filme 
app.delete('/v2/acmefilmes/classificacao/delete/:id', cors(), async function(request, response){
    let idClassificacao = request.params.id
    let classificacaoExcluida = await controllerClassificacao.setExcluirClassificacao(idClassificacao)
    response.status(classificacaoExcluida.status_code)
    response.json(classificacaoExcluida)
})

// Buscar classificacao pelo ID
app.get('/v2/acmefilmes/classificacao/:id', cors(), async function(request, response){
    let idClassificacao = request.params.id
    let dadosClassificacao = await controllerClassificacao.getBuscarClassificacaoPeloID(idClassificacao)
    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})

// Listar todos os atores
app.get('/v2/acmefilmes/atores', cors(), async function(request, response){
    let dadosAtor = await controllerAtores.getTodosAtores()
    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

// Inserir ator novo
app.post('/v2/acmefilmes/novo/ator',cors(), bodyParserJSON, async function(request, response){
    let contentType=request.headers['content-type']
    let dadosBody=request.body
    let resultDadosNovoAtor=await controllerAtores.setInserirNovoAtor(dadosBody, contentType)
    response.status(resultDadosNovoAtor.status_code)
    response.json(resultDadosNovoAtor)
})

// Buscar ator pelo nome
app.get('/v2/acmefilmes/atores/nome', cors(), async function(request, response){
    let nomeAtor = request.query.nome
    let dadosAtores = await controllerAtores.getBuscarAtorPeloNome(nomeAtor)
    response.status(dadosAtores.status_code)
    response.json(dadosAtores)
})

// Excluir um ator 
app.delete('/v2/acmefilmes/delete/ator/:id', cors(), bodyParserJSON, async function(request, response){
    let idDoAtor = request.params.id
    let atorDeletado = await controllerAtores.setExcluirAtor(idDoAtor)
    response.status(atorDeletado.status_code)
    response.json(atorDeletado)
    
})

// Buscar ator pelo id
app.get('/v2/acmefilmes/ator/:id', cors(), async function(request, response){
    let idAtor = request.params.id
    let dadosAtor = await controllerAtores.getBuscarAtorPeloID(idAtor)
    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

// Atualizar um ator
app.put('/v2/acmefilmes/ator/atualizar/:id', cors(), bodyParserJSON, async function(request, response){
    let idAtor = request.params.id
    let contentType=request.headers['content-type']
    let dadosBody=request.body
    let atorAtualizado=await controllerAtores.setAtualizarAtor(idAtor, dadosBody, contentType)
    response.status(atorAtualizado.status_code)
    response.json(atorAtualizado)

})


// Retornar todos os diretores
app.get('/v2/acmefilmes/todos/diretores', cors(), async function(request, response){
    let dadosDiretores = await controllerDiretores.getTodosDiretores()
    response.status(dadosDiretores.status_code)
    response.json(dadosDiretores)
})

// Buscar diretor pelo ID
app.get('/v2/acmefilmes/diretores/:id', cors(), async function(request, response){
    let idDiretor = request.params.id
    let dadosDiretores = await controllerDiretores.getBuscarDiretorPeloID(idDiretor)
    response.status(dadosDiretores.status_code)
    response.json(dadosDiretores)
})

// Inserir diretor novo
app.post('/v2/acmefilmes/diretor/insert',cors(), bodyParserJSON, async function(request, response){
    let contentType=request.headers['content-type']
    let dadosBody=request.body
    let resultDadosNovoDiretor=await controllerDiretores.setInserirNovoDiretor(dadosBody, contentType)
    response.status(resultDadosNovoDiretor.status_code)
    response.json(resultDadosNovoDiretor)
})

// Excluir diretor 
app.delete('/v2/acmefilmes/diretores/delete/:id', cors(), async function(request, response){
    let idDoDiretor = request.params.id
    let diretorExcluido = await controllerDiretores.setExcluirDiretor(idDoDiretor)
    response.status(diretorExcluido.status_code)
    response.json(diretorExcluido)
})

// Atualizar diretor 
app.put('/v2/acmefilmes/atualizar/diretor/:id', cors(), bodyParserJSON, async function(request, response){
    let idDiretor = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let diretorAtualizado = await controllerDiretores.setAtualizarDiretor(idDiretor, dadosBody, contentType)
    response.status(diretorAtualizado.status_code)
    response.json(diretorAtualizado)
})



// Executa a API e faz ela ficar aguardando requisições
app.listen('8080',function(){
    console.log('API funcionando!')
})






