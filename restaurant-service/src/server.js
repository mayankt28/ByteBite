import app from './app.js';

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});
