const express = require('express');
const userRouter = require('./routes/user');
const routineRouter = require('./routes/routine');
const equipmentRouter = require('./routes/gymEquipment');
const schedulesRouter = require('./routes/schedules');
const visits = require('./routes/visits');
const diffusionRouter = require('./routes/diffusion');
const { decodeToken } = require('./middlewares/authentication');
const { resolveError } = require('./middlewares/errorHandling');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(decodeToken);
app.use('/user', userRouter);
app.use('/routine', routineRouter);
app.use('/equipment', equipmentRouter);
app.use('/schedule', schedulesRouter);
app.use('/visit', visits);
app.use('/diffusion', diffusionRouter);
app.use(resolveError);

app.listen(process.env.PORT, () => {
    console.log(`Server listening in: http://localhost:${process.env.PORT}/`);
});
