import type { Schema, Struct } from '@strapi/strapi';

export interface OrderedItemOrderedtem extends Struct.ComponentSchema {
  collectionName: 'components_ordered_item_orderedtems';
  info: {
    displayName: 'Orderedtem';
    icon: 'layer';
  };
  attributes: {
    docId: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'ordered-item.orderedtem': OrderedItemOrderedtem;
    }
  }
}
