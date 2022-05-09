const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello fom the server side!", app: "Natours" });
});

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).
        json({
          status: "success",
          data: {
            tour: newTour,
          },
        });
    }
  );
  res.send("post");
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`)
);
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "succes",
    results: tours.length,
    data: {
      tours,
    },
  });
});
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
