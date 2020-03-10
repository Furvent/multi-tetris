import { app } from './testApp'

const port = 10200;
app.listen(port, () => {
  'Now listening on port' + port;
})