import { Schema, model, Document } from 'mongoose';

export interface IChemical extends Document {
  name: string;
  formula: string;
  atomic_number?: number;
  type: 'element' | 'compound' | 'mixture' | 'other';
  cas_number?: string;
  smiles?: string;
  molecular_weight?: number;
  properties?: Record<string, any>;
  tags?: string[];
  created_at: Date;
}

const ChemicalSchema = new Schema<IChemical>({
  name: { type: String, required: true },
  formula: { type: String, required: true },
  atomic_number: { type: Number },
  type: { 
    type: String, 
    required: true, 
    enum: ['element', 'compound', 'mixture', 'other']
  },
  cas_number: { type: String },
  smiles: { type: String },
  molecular_weight: { type: Number },
  properties: { type: Schema.Types.Mixed },
  tags: [{ type: String }],
  created_at: { type: Date, default: Date.now }
});

export const ChemicalModel = model<IChemical>('Chemical', ChemicalSchema);