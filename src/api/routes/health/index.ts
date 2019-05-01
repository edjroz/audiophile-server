import express from 'express'
export default function (app: express.Application, services: any) {
  app.get('/health', (req, res) => {
    res.json({ status: "it's running" })
  })
}
