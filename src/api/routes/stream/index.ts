import express from 'express'
export default function (app: express.Application, services: any) {
  app.get('/stream/:id', (req, res) => {
    const id = req.params.id
    services.stream.getById(id, res)
  })
}
