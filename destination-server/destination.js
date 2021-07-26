const express = require('express')
const app = express()
const port = 9500

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Dati ricevuti \n')
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
