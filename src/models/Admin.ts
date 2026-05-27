import {
    prop,
    getModelForClass,
    modelOptions,
    type Ref,
} from "@typegoose/typegoose";

import { RoleClass } from "./Role";

@modelOptions({ schemaOptions: { collection: "admin", timestamps: true } })
export class AdminClass {
    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ ref: () => RoleClass, required: true, })
    public role!: Ref<RoleClass>;

    @prop({ default: false })
    public super_admin!: boolean;
}

export default getModelForClass(AdminClass);