import validator from "email-validator";
import PasswordValidator from "password-validator";
import { createAccountInput } from "./inputs";

export const Validator = (inputs: createAccountInput) => {
  const emailValidator = validator.validate(inputs.email);

  const schema = new PasswordValidator();
  // Add properties to it
  schema
    .is()
    .min(4) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

  const passwordValidator = schema.validate(inputs.password);

  const error = {
    emailValidator,
    passwordValidator,
  };

  return error;
};
