import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs"
import panel from "./routes/panel.mjs"
import mongoose from "mongoose";


const connectionString = process.env.ATLAS_URI || "";
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error);
  });


const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/panel', panel);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})