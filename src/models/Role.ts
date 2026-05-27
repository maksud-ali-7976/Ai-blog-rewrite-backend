import {
    prop,
    getModelForClass,
    modelOptions,
} from "@typegoose/typegoose";
import type { Permissions } from "src/config/rabc/permission";


export enum RoleLevel {
    L1 = 1,
    L2 = 2,
    L3 = 3,
}

@modelOptions({ schemaOptions: { collection: "role", timestamps: true } })
export class RoleClass {
    @prop({
        required: true,
    })
    public name!: string;

    @prop({
        type: () => Object,
        required: true,
    })
    public permissions!: Permissions;

    @prop({ default: false })
    public super_admin!: boolean;

    @prop({
        enum: RoleLevel,
        default: RoleLevel.L3,
    })
    public level!: number;
}

export default getModelForClass(RoleClass);