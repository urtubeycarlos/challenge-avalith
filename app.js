const express = require('express');
const userRouter = require('./routes/authentication');
const routineRouter = require('./routes/routine');
const equipmentRouter = require('./routes/gymEquipment');
const { checkToken } = require('./middlewares/authentication');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/user', userRouter);
app.use(checkToken);
app.use('/routine', routineRouter);
app.use('/equipment', equipmentRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listening in: http://localhost:${process.env.PORT}/`);
});
