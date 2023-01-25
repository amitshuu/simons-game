import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

const app = express();

const PORT = 5000;
app.use(bodyParser.json());
app.use(cors());

type User = {
  id: string;
  highestScore: number;
};

app.get('/register', (req, res) => {
  const id = crypto.randomBytes(16).toString('hex');
  const newUser: User = {
    id,
    highestScore: 0,
  };

  fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
      let data = JSON.parse(jsonString);
      data.push(newUser);
      fs.writeFileSync('data.json', JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  });
  return res.status(201).send(newUser);
});

app.post('/updateScore', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
      let data = JSON.parse(jsonString);
      let userById = data.find((user: User) => {
        return user.id === req.body.id;
      });
      userById.highestScore = req.body.highestScore;
      fs.writeFileSync('data.json', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  });
  res.status(200).send({ msg: 'success' });
});

app.listen(PORT, () => {
  console.log('Server is up 🚀');
});
