import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Budgeting App Backend Running...');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

