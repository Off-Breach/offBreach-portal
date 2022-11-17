var database = require("../database/config");

function novoTempo(id, segundos, tempo) {
  console.log(
    "ACESSEI O RECORDE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function novoTempo():",
    id,
    segundos,
    tempo
  );

  // Insira a query do banco aqui, lembrando a nomenclatura exata dos valores
  var instrucao = `
        INSERT INTO recordes (fkUsuario, segundos, tempo) VALUES ('${id}', '${segundos}', '${tempo}');
    `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function obterUltimasMedidas(idServidor) {
  console.log(
    "ACESSEI O MEDIDAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function obterUltimasMedidas():",
    idServidor
  );

  var instrucao = `
    SELECT TOP 10 uso / 8000000000 * 100 as uso, dtDado FROM dadosRam
  `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function listar() {
  console.log(
    "ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()"
  );
  var instrucao = `
        SELECT
            u.nome, 
            r.segundos, 
            r.tempo
        FROM
            usuario AS u JOIN
            recordes AS r ON
            u.idUsuario = r.fkUsuario
            order by segundos
            limit 10
        ;
`;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function melhorTempo(idUsuario) {
  instrucaoSql = "";

  if (process.env.AMBIENTE_PROCESSO == "producao") {
    instrucaoSql = `select top 1
                        temperatura, 
                        umidade, CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_aquario 
                        from medida where fk_aquario = ${idAquario} 
                    order by id desc`;
  } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    instrucaoSql = `select 
                        tempo,
                        segundos
                        from recordes where fkUsuario = ${idUsuario} 
                        order by segundos 
                        limit 1;
    `;
  } else {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n"
    );
    return;
  }

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function quizResultado(passou) {
  console.log(
    "ACESSEI O RECORDE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function quizResultado():",
    passou
  );

  // Query do banco
  var instrucao = `
      INSERT INTO quiz (resultado) VALUES (${passou});
  `;
  return database.executar(instrucao);
}

function quizPorcentagem() {
  console.log(
    "ACESSEI O RECORDE MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function quizPorcentagem()"
  );
  var instrucao = `
        SELECT 
            ROUND(AVG(resultado),2) AS media, 
            COUNT(idQuiz) AS qtd 
        FROM quiz;
  `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

module.exports = {
  novoTempo,
  listar,
  melhorTempo,
  quizResultado,
  quizPorcentagem,
  obterUltimasMedidas,
};
