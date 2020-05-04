const app = require('./src/server.js');
const port = process.env.PORT || 3001;

app.listen(port, () => {
   console.log(`Listening on: http://localhost:${port}`);
});