const express = require('express');
const routineRouter = require('./routes/routine');
const equipmentRouter = require('./routes/gymEquipment');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/routine', routineRouter);
app.use('/equipment', equipmentRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listening in port: ${process.env.PORT}`);
});
