import { z } from 'zod';
import { Hono } from 'hono';
import { createId } from '@paralleldrive/cuid2';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { categories, insertCategorySchema } from '@/db/schema';

const app = new Hono()
  .get('/', async (c) => {
    const data = await db.query.categories.findMany({
      with: {
        products: {
          columns: {
            id: true,
            name: true,
            img: true,
          },
        },
      },
      orderBy: [desc(categories.createdAt)],
    });

    return c.json({ data });
  })
  .get(
    '/:id',
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'No id provided' }, 400);
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.id, id));

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertCategorySchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: 'Unauthorized' }, 401),
        });
      }

      const [data] = await db
        .insert(categories)
        .values({
          id: createId(),
          createdAt: new Date(),
          ...values,
        })
        .returning();

      return c.json({ data });
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
    zValidator('json', insertCategorySchema.pick({ name: true })),
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
        .update(categories)
        .set({ ...values })
        .where(eq(categories.id, id))
        .returning({
          name: categories.name,
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
        .delete(categories)
        .where(eq(categories.id, id))
        .returning({ id: categories.id });

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
