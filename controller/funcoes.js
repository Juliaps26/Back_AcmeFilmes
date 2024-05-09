// Função importa filmes 

// Importando o módulo 
const descFilmes = require('../modulo/filmes.js')

// Criando uma função 
const getFilmes = function(){
     // Criando array 
     let arrayFilmes=[]
     // Contador valor zero
     let contador=0
     let status = false

     // Loop while
     while(contador<descFilmes.filmes.length){

        let JSONFilmes={}
        JSONFilmes.nome=descFilmes.filmes[contador].nome
        JSONFilmes.sinopse=descFilmes.filmes[contador].sinopse
        JSONFilmes.duracao=descFilmes.filmes[contador].duracao
        JSONFilmes.data_lancamento=descFilmes.filmes[contador].data_lancamento
        JSONFilmes.data_relancameto=descFilmes.filmes[contador].data_relancameto
        JSONFilmes.foto_capa=descFilmes.filmes[contador].foto_capa
        JSONFilmes.valor_unitario=descFilmes.filmes[contador].valor_unitario

        arrayFilmes.push(JSONFilmes)
        contador++
        status=true
        
     }
     if(status)
     // Retorno da Função
     return arrayFilmes
     else
     return false
     
 }

 
const getFilmesID=function(idUsuario){
   let JSONFilmes={}
   let contador=0
   let filtro=idUsuario
   let status=false
   while(true){
       if(filtro==dadosFilmes.filmes[contador].id){
           JSONFilmes.nome=dadosFilmes.filmes[contador].nome
           JSONFilmes.sinopse=dadosFilmes.filmes[contador].sinopse
           JSONFilmes.duracao=dadosFilmes.filmes[contador].duracao
           JSONFilmes.data_lancamento=dadosFilmes.filmes[contador].data_lancamento
           JSONFilmes.data_relancamento=dadosFilmes.filmes[contador].data_relancamento
           JSONFilmes.foto_capa=dadosFilmes.filmes[contador].foto_capa
           JSONFilmes.valor_unitario=dadosFilmes.filmes[contador].valor_unitario
           status=true
           break
       }
       contador++
   }
   if(status)
       return JSONFilmes
   else
       return false
}

module.exports={getFilmes,getFilmesID}



 
    






