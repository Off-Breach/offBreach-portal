var express = require("express");
var router = express.Router();

var recordesController = require("../controllers/recordesController");

router.post("/novoTempo", function (req, res) {
  recordesController.novoTempo(req, res);
});

router.post("/quizResultado", function (req, res) {
  recordesController.quizResultado(req, res);
});

router.get("/listar", function (req, res) {
  recordesController.listar(req, res);
});

router.get("/melhorTempo/:idUsuario", function (req, res) {
  recordesController.melhorTempo(req, res);
});

router.get("/quizPorcentagem", function (req, res) {
  recordesController.quizPorcentagem(req, res);
});

module.exports = router;
