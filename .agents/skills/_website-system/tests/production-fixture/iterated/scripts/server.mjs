import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const routes = JSON.parse(await fs.readFile(path.join(dist, 'routes.json'), 'utf8').catch(() => { throw new Error('Run npm run build before starting the preview.'); }));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};

export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      if (!['GET','HEAD'].includes(request.method)) {
        response.writeHead(405, {'Allow':'GET, HEAD','Content-Type':'text/plain; charset=utf-8'});
        response.end('Method not allowed'); return;
      }
      const url = new URL(request.url, 'http://localhost');
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch {
        response.writeHead(400, {'Content-Type':'text/plain; charset=utf-8'}); response.end('Bad request'); return;
      }
      let redirect;
      if (pathname.endsWith('/index.html')) redirect = pathname.slice(0, -10);
      else if (!pathname.endsWith('/') && routes[`${pathname}/`]) redirect = `${pathname}/`;
      if (redirect && routes[redirect]) {
        response.writeHead(308, {'Location':redirect + url.search}); response.end(); return;
      }
      const known = Object.hasOwn(routes, pathname);
      const relative = known ? routes[pathname] : '404.html';
      const target = path.resolve(dist, relative);
      if (!target.startsWith(dist + path.sep)) throw new Error('Asset outside output directory.');
      const content = await fs.readFile(target);
      const type = mime[path.extname(target)] || 'application/octet-stream';
      response.writeHead(known ? 200 : 404, {'Content-Type':type,'Content-Length':content.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'}); response.end('Unable to serve this page.');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--port')) throw new Error('Usage: npm start -- --port 0');
  const port = Number(args[1] ?? process.env.PORT ?? 0);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Port must be 0–65535.');
  const server = createServer();
  server.on('error', error => { console.error(error.message); process.exitCode=1; });
  server.listen(port, '127.0.0.1', async () => {
    const origin = `http://127.0.0.1:${server.address().port}`;
    await fs.writeFile(path.join(root, '..', 'preview.json'), JSON.stringify({origin,pid:process.pid},null,2) + '\n');
    console.log(`Northline fictional demonstration\nPreview: ${origin}\nStop with Ctrl+C.`);
  });
}
