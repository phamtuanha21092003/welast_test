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
    language: string | null
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

app.get("/filters", async (req: Request, res: Response) => {
    const response: AxiosResponse<any> = await axios.get(
        "https://api.github.com/users/freeCodeCamp/repos"
    )

    const languages: Set<string | null> = response.data?.reduce(
        (accumulator: Set<string | null>, repo: Repo) => {
            if (accumulator.has(repo.language)) {
                return accumulator
            }

            accumulator.add(repo.language)
            return accumulator
        },
        new Set<string | null>()
    )

    res.json({
        data: Array.from(languages),
    })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
