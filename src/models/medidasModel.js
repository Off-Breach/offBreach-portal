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

  let respostas = [];

  try {
    const respostaCpu = obterUltimasMedidasCpu(idServidor);
    if (respostaCpu.length > 0) {
      respostas.push(respostaCpu[0]);
      try {
        const respostaRam = obterUltimasMedidasRam(idServidor);
        if (respostaRam.length > 0) {
          respostas.push(respostaRam[0]);
          try {
            const respostaDisco = obterUltimasMedidasDisco(idServidor);
            if (respostaDisco.length > 0) {
              respostas.push(respostaDisco[0]);
            }
          } catch (errorDisco) {}
        }
      } catch (errorRam) {
        console.error(
          "Erro ao conseguir dados da Ram na funcao obterUltimasMedidasRam. ",
          errorRam
        );
      }
    }
  } catch (errorCpu) {
    console.error(
      "Erro ao conseguir dados da Cpu na funcao obterUltimasMedidasCpu. ",
      errorCpu
    );
  }

  return respostas;
}

function obterUltimasMedidasCpu(idServidor) {
  console.log(
    "ACESSEI O MEDIDAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function obterUltimasMedidasCpu():",
    idServidor
  );

  var instrucaoCpu = `
    SELECT TOP 10 
      uso as uso,
      dtDado,
      'cpu' as tipo
    FROM 
      dadosCpu as dc 
    JOIN 
      cpu as c 
    ON 
      dc.fkCpu = c.idCpu 
    JOIN
     servidor as s 
    ON
     c.fkServidor = s.idServidor
    WHERE
     s.idServidor = ${idServidor} 
    ORDER BY dtDado DESC
    `;

  console.log("Executando a instrucao SQL: ", instrucaoCpu);
  return database.executar(instrucaoCpu);
}

function obterUltimasMedidasRam(idServidor) {
  var instrucaoRam = `
  SELECT TOP 10 
    uso / 8000000000 * 100 as uso,
    dtDado,
    'ram' as tipo
  FROM 
    dadosRam as dr 
  JOIN 
    ram as r
  ON 
    dr.fkRam = r.idRam
  JOIN
   servidor as s 
  ON
   r.fkServidor = s.idServidor
  WHERE
   s.idServidor = ${idServidor}
  ORDER BY dtDado DESC
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoRam);
  return database.executar(instrucaoRam);
}

function obterUltimasMedidasDisco(idServidor) {
  console.log(
    "ACESSEI O MEDIDAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function obterUltimasMedidasDisco():",
    idServidor
  );

  var instrucaoDisco = `
    SELECT TOP 10 
      tempoAtividade as uso,
      dtDado,
      'disco' as tipo
    FROM 
      dadosDisco as dd
    JOIN 
      disco as d
    ON 
      dd.fkDisco = d.idDisco
    JOIN
     servidor as s 
    ON
     d.fkServidor = s.idServidor
    WHERE
     s.idServidor = ${idServidor} 
    ORDER BY dtDado DESC
    `;

  console.log("Executando a instrução SQL: ", instrucaoDisco);
  return database.executar(instrucaoDisco);
}

function buscarMedidasEmTempoReal(idServidor) {
  console.log(
    "ACESSEI O MEDIDAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarMedidasEmTempoReal():",
    idServidor
  );
  var instrucao = `
  SELECT TOP 1
  	dc.uso AS usoCpu,
	  CAST(dr.uso AS FLOAT) / r.qtdRAMTotal * 100 AS usoRam,
	  dd.tempoAtividade AS usoDisco,
	  dr.dtDado
  FROM
	  servidor AS s
  JOIN
   ram AS r
  ON
   r.fkServidor = s.idServidor
  JOIN
   cpu AS c 
  ON 
    c.fkServidor = s.idServidor
  JOIN
   disco AS d 
  ON
   d.fkServidor = s.idServidor
  JOIN
   dadosRam AS dr
  ON
   dr.fkRam = r.idRam
  JOIN
   dadosCpu AS dc
  ON
   dc.fkCpu = c.idCpu
  JOIN
   dadosDisco AS dd 
  ON
   dd.fkDisco = d.idDisco
  WHERE
   s.idServidor = ${idServidor}
   AND dr.dtDado = (SELECT MAX(dtDado) FROM dadosRam JOIN RAM on fkRam = idRam JOIN servidor ON fkServidor = idServidor WHERE idServidor = ${idServidor})
   AND dd.dtDado = (SELECT MAX(dtDado) FROM dadosDisco JOIN disco on fkDisco = idDisco JOIN servidor ON fkServidor = idServidor WHERE idServidor = ${idServidor})
   AND dc.dtDado = (SELECT MAX(dtDado) FROM dadosCpu JOIN cpu on fkCpu = idCpu JOIN servidor ON fkServidor = idServidor WHERE idServidor = ${idServidor})
  `;
  console.log("Executando instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function obterTodosServidoresClinica(idClinica) {
  var instrucao = `
    SELECT
    	s.idServidor as idServidor,
    	s.popularName as hostName,
    	sistemaOperacional as sistemaOperacional
    FROM
    	servidor AS s
    JOIN
    	clinica AS c
    ON
    	s.fkClinica = c.idClinica
    WHERE
    	c.idClinica = 1
  `;
  console.log("Executando instrução SQL: \n" + instrucao);
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
  buscarMedidasEmTempoReal,
  obterUltimasMedidasCpu,
  obterUltimasMedidasRam,
  obterUltimasMedidasDisco,
  obterTodosServidoresClinica,
};
