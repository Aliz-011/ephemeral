import { z } from 'zod';
import { Hono } from 'hono';
import { and, desc, eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { db } from '@/db/drizzle';
import { insertOrderSchema, orders } from '@/db/schema';

const app = new Hono()
  .get('/', async (c) => {
    const data = await db.query.orders.findMany({
      columns: {
        id: true,
        status: true,
        total: true,
        address: true,
      },
      with: {
        orderItems: {
          columns: {
            quantity: true,
            orderId: true,
          },
          with: {
            product: {
              columns: {
                name: true,
                img: true,
              },
            },
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });

    if (!data) {
      return c.json({ data: [] });
    }

    return c.json({ data });
  })
  .get(
    '/:id',
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }

      const data = await db.query.orders.findFirst({
        columns: {
          id: true,
          status: true,
          total: true,
          address: true,
        },
        with: {
          orderItems: {
            with: {
              product: {
                columns: {
                  name: true,
                  img: true,
                },
              },
            },
          },
        },
        where: (orders, { eq }) => eq(orders.id, id),
      });

      if (!data) {
        return c.json({ error: 'Order not found' }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    '/',
    zValidator('json', insertOrderSchema.omit({ id: true, createdAt: true })),
    async (c) => {
      // const auth = getAuth(c);
      const values = c.req.valid('json');

      // if (!auth?.userId) {
      //   throw new HTTPException(401, {
      //     res: c.json({ error: 'Unauthorized' }, 401),
      //   });
      // }

      const [data] = await db
        .insert(orders)
        .values({
          id: createId(),
          createdAt: new Date(),
          ...values,
        })
        .returning({ id: orders.id });

      return c.json({ data }, 201);
    }
  );

export default app;
