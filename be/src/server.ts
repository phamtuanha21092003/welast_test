import express, { Request, Response } from "express"
import axios, { AxiosResponse } from "axios"
import cors from "cors"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

interface Repo {
    fork: boolean
    forks: number
}

app.get("/repos", async (req: Request, res: Response) => {
    const response: AxiosResponse<any> = await axios.get(
        "https://api.github.com/users/freeCodeCamp/repos"
    )

    const repositories: any[] =
        response.data?.filter((repo: Repo) => repo.fork && repo.forks > 0) || []

    res.setHeader("Content-Type", "application/json")
    res.json({
        data: repositories,
    })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
