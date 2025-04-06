const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy to Hugging Face API
  app.use(
    '/api/hf',
    createProxyMiddleware({
      target: 'https://huggingface.co/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api/hf': ''
      },
      onProxyRes: function(proxyRes, req, res) {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
      }
    })
  );
}; 