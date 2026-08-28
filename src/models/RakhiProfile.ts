import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRakhiProfile extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | null;
    slug: string;
    displayName: string;
    customMessage: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RakhiProfileSchema = new Schema<IRakhiProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        displayName: { type: String, required: true, trim: true },
        customMessage: { type: String, default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

RakhiProfileSchema.index({ slug: 1 }, { unique: true });
RakhiProfileSchema.index({ userId: 1 });

export const RakhiProfile: Model<IRakhiProfile> =
    mongoose.models.RakhiProfile || mongoose.model<IRakhiProfile>('RakhiProfile', RakhiProfileSchema);
