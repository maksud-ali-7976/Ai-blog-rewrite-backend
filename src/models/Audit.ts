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

    @prop({})
    public action!: string;

    @prop({})
    public entity!: string;

    @prop()
    public entity_id!: string;

    @prop()
    public description?: string;
}

export default getModelForClass(AuditLogClass);