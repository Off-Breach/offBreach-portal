var express = require("express");
var router = express.Router();

var medidasController = require("../controllers/medidasController");

router.post("/novoTempo", function (req, res) {
  medidasController.novoTempo(req, res);
});

router.post("/quizResultado", function (req, res) {
  medidasController.quizResultado(req, res);
});

router.get("/listar", function (req, res) {
  medidasController.listar(req, res);
});

router.get("/ultimas/:idServidor", function (req, res) {
  medidasController.obterUltimasMedidas(req, res);
});

router.get("/melhorTempo/:idUsuario", function (req, res) {
  medidasController.melhorTempo(req, res);
});

router.get("/quizPorcentagem", function (req, res) {
  medidasController.quizPorcentagem(req, res);
});

module.exports = router;
