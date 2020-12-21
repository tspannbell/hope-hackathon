const app = require("express")();
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require('cors')
const crimesByRace = require("./crimesByRace.json")

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

const { API_KEY } = process.env;
const crimeAPIBaseURL = "https://api.usa.gov/crime/fbi/sapi";
const cmpdORI = "NC0600100";

app.get("/cmpd/offenses", (req, res) => {
  const url = `${crimeAPIBaseURL}/api/summarized/agencies/${cmpdORI}/offenses/2019/2019?API_KEY=${API_KEY}`;

  axios.get(url)
    .then((response) => {
      const sortedOffenses = response.data.results.sort((num1, num2) => num2.actual - num1.actual).slice(0,10)
      res.status(200).send(sortedOffenses)
    })
    .catch((err) => {
      res.status(err.response.data.status).send({error: err.response.data.message})
    });
});

app.get("/crimesByRace", (req, res) => {
  res.status(200).send(crimesByRace)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
