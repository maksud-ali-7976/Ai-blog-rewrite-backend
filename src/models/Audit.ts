import {
    prop,
    getModelForClass,
    modelOptions,
    type Ref,
} from "@typegoose/typegoose";

import { AdminClass } from "./Admin";

@modelOptions({ schemaOptions: { collection: "audit", timestamps: true, } })
export class AuditLogClass {
    @prop({ ref: () => AdminClass })
    public admin!: Ref<AdminClass>;

    @prop({ required: true })
    public action!: string;

    @prop({ required: true })
    public entity!: string;

    @prop()
    public entity_id!: string;

    @prop()
    public before?: string;

    @prop()
    public after?: string;

    @prop()
    public description?: string;
}

export default getModelForClass(AuditLogClass);