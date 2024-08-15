const mongoose = require("mongoose");
//VkM9PYT16BtwfaYY
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Database connected!");
  })
  .catch((err) => console.error("Error connecting to database:", err));



 

// mongoose
//   .connect('mongodb+srv://<username>:<password>@<cluster-address>/<dbname>?retryWrites=true&w=majority')
//   .then(() => {
//     console.log("Database connected!");
//   })
//   .catch((err) => {
//     console.error("Error connecting to database:", err);
//   });
