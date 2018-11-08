const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

let familymembers = [];

app.get('/', (req, res) => {
  res.send("HEJ");
});

app.get('/api/familymembers', (req, res) => {
  res.json(familymembers);
});


app.get('/api/familymembers/:id', (req, res) => {
  const id = req.params.id;
  const familymember = familymembers.find(c => c.id === parseInt(id));

  if (!familymember) {
    res.status(404).json({message: `Familymember id: ${id} not found!`});
  }
  else {
    res.json(familymember);
  }
});

// Test PUT
// curl -X PUT --data name="Lovy" http://localhost:1337/api/familymembers/8

app.put('/api/familymembers/:id', (req, res) => {
  const id = req.params.id;
  let familymember = familymembers.find(c => c.id === parseInt(id));
  if (!familymember) {
    res.status(404).json({message: `Familymember id: ${id} not found!`});
  }
  else {
    const schema = Joi.object().keys({
      name: Joi.string().min(3)
    });
    const data = req.body;
    Joi.validate(data, schema, (err, value) => {
      if (err) {
        res.status(400).json({
          status: "error",
          message: "Invalid request data",
          data: data
        });
      }
      else {
        familymember.name = data.name;
        res.json(familymember);
      }
    })
  }
});

// TEST Route with curl like this.
//curl --data name="Billy" http://localhost:1337/api/familymembers
app.post('/api/familymembers', (req, res) => {
  const data = req.body;

  const schema = Joi.object().keys({
    name: Joi.string().min(3).required()
  });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      res.status(400).json({
        status: "error",
        message: "Invalid request data",
        data: data
      });
    }
    else {
      const newCustomer = {
        id: familymembers.length + 1,
        name: value.name
      }
      familymembers.push(newCustomer);

      res.json({
        status: "Success",
        message: "Familymember created!",
        data: data
      });
    }
  });


  /*
  if (!req.body.name || req.body.name.length < 3 ) {
    res.status(400).send("Name is required and minimum 3 chars...");
  }

  const newCustomer = {
    id: familymembers.length + 1,
    name: req.body.name
  }
  familymembers.push(newCustomer);
  res.json(newCustomer);
  */
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
