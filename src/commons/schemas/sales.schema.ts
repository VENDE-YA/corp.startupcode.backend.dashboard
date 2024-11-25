import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from './audit-properties.schema';

export type SalesDocument = Sales & mongoose.Document;

@Schema({ collection: 'Sales', autoIndex: true })
export class Sales {
  @Prop()
  guiid: string;

  @Prop()
  code: string;

  @Prop()
  haveDiscount: boolean;

  @Prop({
    type: Number,
    default: () => 0,
  })
  total_sale_price: number;

  @Prop({
    type: Number,
    default: () => 0,
  })
  total_standard_price: number;

  @Prop({
    type: Number,
    default: () => 0,
  })
  total_discount_price: number;

  @Prop({
    type: Number,
    default: () => 0,
  })
  quantity: number;

  @Prop(
    raw({
      type: [
        {
          idProduct: String,
          code: String,
          name: String,
          quantity: Number,
          sale_price: Number,
          standard_price: Number,
          total_price: Number,
          date_create: Date,
          date_update: Date,
        },
      ],
    }),
  )
  details: {
    idProduct: string;
    code: string;
    name: string;
    quantity: Number;
    sale_price: Number;
    standard_price: Number;
    total_price: Number;
    date_create: Date;
    date_update: Date;
  }[];

  @Prop({
    type: AuditPropertiesSchema,
    default: () => new AuditPropertiesSchema(),
  })
  auditProperties: AuditPropertiesSchema;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
