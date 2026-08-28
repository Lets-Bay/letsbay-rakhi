import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRakhiDesign extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
    description: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
}

const RakhiDesignSchema = new Schema<IRakhiDesign>(
    {
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        description: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

RakhiDesignSchema.index({ isActive: 1, sortOrder: 1 });

export const RakhiDesign: Model<IRakhiDesign> =
    mongoose.models.RakhiDesign || mongoose.model<IRakhiDesign>('RakhiDesign', RakhiDesignSchema);
