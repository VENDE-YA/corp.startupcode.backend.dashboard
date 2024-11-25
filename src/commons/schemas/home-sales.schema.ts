import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from './audit-properties.schema';

export type HomeSalesDocument = HomeSales & mongoose.Document;

@Schema({ collection: 'HomeSales', autoIndex: true })
export class HomeSales {
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

export const HomeSalesSchema = SchemaFactory.createForClass(HomeSales);
