import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import { AdminClass } from "./Admin";
import type { Ref } from "@typegoose/typegoose";

export enum BlogStatus {
    DRAFT = "DRAFT",
    REVIEWED = "REVIEWED",
    PUBLISHED = "PUBLISHED"
}

export enum BlogGenStatus {
    QUEUED = "QUEUED",
    SCRAPING = "SCRAPING",
    PROCESSING = "PROCESSING",
    IMAGE_GENERATING = "IMAGE_GENERATING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

@modelOptions({ schemaOptions: { collection: "blog", timestamps: true } })
export class BlogClass {
    @prop({})
    public original_url!: string

    @prop({})
    public original_title!: string

    @prop({})
    public original_content!: string

    @prop({})
    public cover_image!: string

    @prop({})
    public rewrite_title!: string

    @prop({})
    public rewrite_content!: string

    @prop({})
    public author!: string

    @prop({})
    public published_at!: Date

    @prop({
        enum: BlogStatus,
        default: BlogStatus.DRAFT,
    })
    public status!: string

    @prop({ ref: () => AdminClass })
    public review_by?: Ref<AdminClass>

    @prop({ ref: () => AdminClass })
    public publish_by?: Ref<AdminClass>

    @prop({})
    public review_notes?: string

    @prop({ enum: BlogGenStatus, default: BlogGenStatus.QUEUED })
    public gen_status!: string

    @prop({})
    public source?: string

    @prop({})
    public error_message?: string
}

export default getModelForClass(BlogClass)