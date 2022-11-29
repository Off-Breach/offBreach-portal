var express = require("express");
var router = express.Router();

var avisoController = require("../controllers/avisoController");

router.get("/", function (req, res) {
  avisoController.testar(req, res);
});

router.get("/listar", function (req, res) {
  avisoController.listar(req, res);
});

router.get("/listar/:idUsuario", function (req, res) {
  avisoController.listarPorUsuario(req, res);
});

router.get("/pesquisar/:descricao", function (req, res) {
  avisoController.pesquisarDescricao(req, res);
});

router.post("/publicar/:idUsuario", function (req, res) {
  avisoController.publicar(req, res);
});

router.put("/editar/:idAviso", function (req, res) {
  avisoController.editar(req, res);
});

router.put("/editarServidor/:idServidor", function (req, res) {
  avisoController.editarServidor(req, res);
});

router.put("/desligarServidor/:idServidor", function (req, res) {
  avisoController.desligarServidor(req, res);
});

router.delete("/removerServidor/:idServidor", function (req, res) {
  avisoController.removerServidor(req, res);
});

router.delete("/deletar/:idAviso", function (req, res) {
  avisoController.deletar(req, res);
});

router.delete("/deletar2/:idAviso", function (req, res) {
  avisoController.deletar2(req, res);
});

module.exports = router;