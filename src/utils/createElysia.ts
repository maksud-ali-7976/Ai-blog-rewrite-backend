import { DocumentType } from "@typegoose/typegoose";
import { Elysia, t } from "elysia";
import { AdminClass } from "src/models/Admin";

export const createElysia = (
  config?: ConstructorParameters<typeof Elysia>[0],
) =>
  new Elysia({ ...config, aot: process.env.RUNTIME === "bun" })
    .decorate("user", {} as DocumentType<AdminClass>)
    .guard({
      headers: t.Object({
        authorization: t.Optional(t.String({})),
      }),
    });