import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CURRENCY } from "../models/product.model";

// Junta los errores de las reglas de abajo. Si hay alguno -> 400 y no llega al controller
const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Datos inválidos",
      errors: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : error.type,
        message: error.msg,
      })),
    });
    return;
  }
  next();
};

const registerRules = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("email").trim().toLowerCase().isEmail().withMessage("El email no es válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidation,
];

const loginRules = [
  body("email").trim().toLowerCase().isEmail().withMessage("El email no es válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleValidation,
];

// En el alta todos los campos son obligatorios; en la edición (isUpdate) se puede mandar solo lo que cambia
const productFields = (isUpdate: boolean) => {
  const field = (name: string) => (isUpdate ? body(name).optional() : body(name));
  return [
    field("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("description").optional().trim(),
    field("price").isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0").toFloat(),
    field("currency")
      .isIn(Object.values(CURRENCY))
      .withMessage(`La moneda debe ser ${Object.values(CURRENCY).join(" o ")}`),
    field("stock").isInt({ min: 0 }).withMessage("El stock debe ser un entero mayor o igual a 0").toInt(),
  ];
};

const productRules = [...productFields(false), handleValidation];
const productUpdateRules = [...productFields(true), handleValidation];

export { registerRules, loginRules, productRules, productUpdateRules };
