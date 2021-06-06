import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import checkRequest from './middleware/checkRequest';
import DNAScoringRouterV1 from './routes/DNAScoringV1';
import * as env from './config';

const app = express();
const { environment } = env;
const host = environment.webServer.host;
const port = environment.webServer.port;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

app.use(checkRequest);

// routes
app.use('/api/v1/dna', DNAScoringRouterV1);

app.use('*', (req: Request, res: Response) => {
  res.status(200).send('Welcome to this API.');
});

app.listen(port, host, () => {
  return console.log(`Server is listening on ${port}`);
});

export default app; 