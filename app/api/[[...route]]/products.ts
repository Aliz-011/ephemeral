import { z } from 'zod';
import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { db } from '@/db/drizzle';
import { categories, insertProductSchema, products } from '@/db/schema';

const app = new Hono()
  .get('/', async (c) => {
    const data = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        category: categories.name,
        categoryId: products.categoryId,
        price: products.price,
        img: products.img,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    return c.json({ data }, 200);
  })
  .get('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid('param');

    if (!id) {
      return c.json({ error: 'Missing id' }, 400);
    }

    const [data] = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        category: categories.name,
        categoryId: products.categoryId,
        price: products.price,
        img: products.img,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!data) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ data }, 200);
  })
  .post(
    '/',

    zValidator('json', insertProductSchema.omit({ id: true })),
    async (c) => {
      const values = c.req.valid('json');

      const [data] = await db
        .insert(products)
        .values({
          id: createId(),
          createdAt: new Date(),
          ...values,
        })
        .returning();

      return c.json({ data }, 201);
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator('json', insertProductSchema.omit({ id: true, createdAt: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'No id provided' }, 400);
      }

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: 'Unauthorized' }, 401),
        });
      }

      const [data] = await db
        .update(products)
        .set({ ...values })
        .where(eq(products.id, id))
        .returning({
          name: products.name,
        });

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'No id provided' }, 400);
      }

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: 'Unauthorized' }, 401),
        });
      }

      const [data] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning({ id: products.id });

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
