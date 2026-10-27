const http = require('http');
const port = process.env.PORT || 5001;

// http://localhost:5001/welcome should return a status code 200 with a welcome message of your choice in html format

// http://localhost:5001/redirect should redirect the request to '/redirected' by using 302 as the status code / the redirected page should return a redirected message of your choice

// http://localhost:5001/cache should return 'this resource was cached' in html format and set the cache max age to a day

// http://localhost:5001/cookie should return 'cookies… yummm' in plain text and set 'hello=world' as a cookie

// For other routes, such as http://localhost:5001/other, this exercise should return a status code 404 with '404 - page not found' in html format

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  switch (pathname) {
    case '/welcome':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Welcome to my Node.js routing exercise!</h1>');
      break;
    case '/redirect':
      res.writeHead(302, { Location: '/redirected' });
      res.end();
      break;
    case '/redirected':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>You have arrived at the redirected page!</h1>');
      break;
    case '/cache':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      });
      res.end('<p>this resource was cached</p>');
      break;
    case '/cookie':
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Set-Cookie': 'hello=world; Path=/',
      });
      res.end('cookies… yummm');
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - page not found</h1>');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
