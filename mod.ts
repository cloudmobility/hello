import { Application, Router, send, v4 } from './deps.ts'
import { Entry } from './types.ts';

type Config = {
  web: {
    port: number;
  };
};

const config: Config = {
  web: {
    port: Number(Deno.env.get('WEB_PORT')) || 8000,
  },
};

const db = new Map();

const app = new Application();
const router = new Router();

app.use(async (ctx, next) => {
  await next();
  console.log(ctx.request.method, ctx.request.url.href, ctx.response.status);
});

// Health check endpoint
router.get('/health', (ctx) => {
  ctx.response.status = 200;
});

// Returns all entries
router.get('/entries', async (ctx) => {
  ctx.response.body = {
    entries: [...db.values()],
  };
});

router.post('/entries', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value as Entry;

  const newId = v4.generate();
  const entry = {
    id: newId,
    name: body.name,
    message: body.message,
    createdAt: new Date(),
  };
  const insertId = db.set(newId, entry);

  ctx.response.body = insertId;
});

app.use(router.routes());
app.use(router.allowedMethods());

// Serves web page
app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/static`,
    index: 'index.html',
  });
});

app.addEventListener('listen', (e) => {
  console.log('App listening at', e.port);
});

app.addEventListener('error', console.log);

await app.listen({ port: config.web.port });
