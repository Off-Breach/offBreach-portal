var recordesModel = require("../models/recordesModel");

function listar(req, res) {
  recordesModel
    .listar()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os recordes: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function novoTempo(req, res) {
  var id = req.body.idUserServer;
  var segundos = req.body.segundosServer;
  var tempo = req.body.tempoServer;

  // Validação dos valores
  if (id == undefined) {
    res.status(400).send("Seu id está undefined!");
  } else if (segundos == undefined) {
    res.status(400).send("Seu segundos está undefined!");
  } else if (tempo == undefined) {
    res.status(400).send("Seu tempo está undefined!");
  } else {
    // Passar os valores como parâmetro e vá para recordesModel.js
    recordesModel
      .novoTempo(id, segundos, tempo)
      .then(function (resultado) {
        res.json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function melhorTempo(req, res) {
  var idUsuario = req.params.idUsuario;

  console.log(`Recuperando seu melhor tempo`);

  recordesModel
    .melhorTempo(idUsuario)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar o melhor recorde.", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function quizResultado(req, res) {
  var passou = req.body.passouServer;

  console.log("Enviando o Resultado para o banco");

  // Validando se o resultado existe

  if (passou == undefined) {
    res.status(400).send("Seu resultado está undefined");
  } else {
    // Passando o resultado como parâmetro e indo para recordesModel.js

    recordesModel
      .quizResultado(passou)
      .then(function (resultado) {
        res.json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function quizPorcentagem(req, res) {
  console.log(
    "Estou no recordesController. Recuperando a porcentagem de conclusão"
  );
  recordesModel
    .quizPorcentagem()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os recordes: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  novoTempo,
  listar,
  melhorTempo,
  quizResultado,
  quizPorcentagem,
};
