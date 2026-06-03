// Entry point
import { server, port } from './server.js'

server.listen(port, () => {
    console.log(`Double Backend Server is listeing on ${port}`)
})