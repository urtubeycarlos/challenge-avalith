const express = require('express');
const userRouter = require('./routes/authentication');
const routineRouter = require('./routes/routine');
const equipmentRouter = require('./routes/gymEquipment');
const professorRouter = require('./routes/professor');
const clientRouter = require('./routes/client');
const diffusionRouter = require('./routes/diffusion');
const { checkToken } = require('./middlewares/authentication');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/user', userRouter);
app.use(checkToken);
app.use('/routine', routineRouter);
app.use('/equipment', equipmentRouter);
app.use('/professor', professorRouter);
app.use('/client', clientRouter);
app.use('/diffusion', diffusionRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listening in: http://localhost:${process.env.PORT}/`);
});
