import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRakhi extends Document {
    _id: mongoose.Types.ObjectId;
    rakhiProfileId: mongoose.Types.ObjectId;
    designId: mongoose.Types.ObjectId;
    senderName: string;
    message: string;
    createdAt: Date;
}

const RakhiSchema = new Schema<IRakhi>(
    {
        rakhiProfileId: { type: Schema.Types.ObjectId, ref: 'RakhiProfile', required: true },
        designId: { type: Schema.Types.ObjectId, ref: 'RakhiDesign', required: true },
        senderName: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

RakhiSchema.index({ rakhiProfileId: 1, createdAt: -1 });

export const Rakhi: Model<IRakhi> =
    mongoose.models.Rakhi || mongoose.model<IRakhi>('Rakhi', RakhiSchema);
