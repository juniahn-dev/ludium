import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  SESSION_SECRET_KEY: Joi.string().required(),
  SESSION_EXPIRES_IN: Joi.number().required(),

  COOKIE_NAME: Joi.string().required(),

  LOCAL_SERVICE_DB_HOST: Joi.string().required(),
  LOCAL_SERVICE_DB_DATABASE: Joi.string().required(),
  LOCAL_SERVICE_DB_USER: Joi.string().required(),
  LOCAL_SERVICE_DB_PASSWORD: Joi.string().required(),
  LOCAL_SERVICE_DB_PORT: Joi.number().required(),
});
