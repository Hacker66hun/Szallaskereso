import express from 'express';
import szallasokRoutes from './Routes/szallasok.js';
import varosokRoutes from './Routes/varosok.js';
import orszagokRoutes from './Routes/orszagok.js';
import ajanlatRoutes from './Routes/ajanlat.js';
import legjobbRoutes from './Routes/legjobb.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/szallasok', szallasokRoutes);
app.use('/varosok', varosokRoutes);
app.use('/orszagok', orszagokRoutes);
app.use('/ajanlat', ajanlatRoutes);
app.use('/legjobb', legjobbRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
