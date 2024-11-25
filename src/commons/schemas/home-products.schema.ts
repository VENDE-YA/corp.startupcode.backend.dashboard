import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from './audit-properties.schema';

export type HomeProductsDocument = HomeProducts & mongoose.Document;

@Schema({ collection: 'HomeProducts', autoIndex: true })
export class HomeProducts {
  @Prop()
  guiid: string;

  @Prop({
    index: true,
  })
  year: number;

  @Prop(
    raw({
      type: [
        {
          period: String,
          records: [
            {
              period: String,
              period_format: String,
              code: String,
              product: String,
              quantity: Number,
              total_price: Number,
            },
          ],
        },
      ],
    }),
  )
  details: {
    period: string;
    records: [
      {
        period: string;
        period_format: string;
        code: string;
        product: string;
        quantity: number;
        total_price: number;
      },
    ];
  }[];

  @Prop({
    type: AuditPropertiesSchema,
    default: () => new AuditPropertiesSchema(),
  })
  auditProperties: AuditPropertiesSchema;
}

export const HomeProductsSchema = SchemaFactory.createForClass(HomeProducts);
