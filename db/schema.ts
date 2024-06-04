import { relations } from 'drizzle-orm';
import { text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  img: text('image').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const insertProductSchema = createInsertSchema(products, {
  createdAt: z.coerce.date(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories, {
  createdAt: z.coerce.date(),
});

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().notNull(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const insertCustomerSchema = createInsertSchema(customers);

export const statusEnum = pgEnum('status', [
  'pending',
  'delivered',
  'ready',
  'on the way',
  'cancelled',
]);

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  address: text('address').notNull(),
  total: integer('total').notNull(),
  status: statusEnum('status').notNull(),
  customerId: text('customer_id')
    .references(() => customers.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  orderItems: many(orderItems),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));

export const insertOrderSchema = createInsertSchema(orders, {
  createdAt: z.coerce.date(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .references(() => orders.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  productId: text('product_id')
    .references(() => products.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  quantity: integer('quantity').notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const insertOrderItemSchema = createInsertSchema(orderItems);
