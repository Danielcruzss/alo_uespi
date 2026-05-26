import { body } from "express-validator";

export const manifestationValidation = [
  body("title")
    .notEmpty()
    .withMessage("Título obrigatório")
    .isLength({ min: 5 })
    .withMessage("Título deve ter no mínimo 5 caracteres"),

  body("description")
    .notEmpty()
    .withMessage("Descrição obrigatória")
    .isLength({ min: 10 })
    .withMessage("Descrição muito curta"),

  body("category")
    .isIn([
      "DENUNCIA",
      "RECLAMACAO",
      "SUGESTAO",
      "ELOGIO",
    ])
    .withMessage("Categoria inválida"),
];