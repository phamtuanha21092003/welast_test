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
    id: number
    name: string
    description: string
    forks_count: number
}

interface Language {
    language: string
}

function checkLanguage({
    repo,
    language,
}: {
    repo: Repo
    language: string | undefined
}): boolean {
    if (!language || language === "ALL") return true

    return language === "NULL"
        ? repo.language === null
        : repo.language === language
}

app.get("/repos", async (req: Request<{}, {}, {}, Language>, res: Response) => {
    try {
        const language = req.query.language

        const response: AxiosResponse<any> = await axios.get(
            "https://api.github.com/users/freeCodeCamp/repos"
        )

        const repositories: any[] =
            response.data
                ?.filter(
                    (repo: Repo) =>
                        repo.fork &&
                        repo.forks > 5 &&
                        checkLanguage({ repo, language })
                )
                ?.map((repo: Repo) => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    language: repo.language,
                    forksCount: repo.forks_count,
                })) || []

        res.setHeader("Content-Type", "application/json")
        res.json({
            data: repositories,
        })
    } catch (err) {
        console.log("error", err)
        res.json({
            data: [],
        })
    }
})

app.get("/filters", async (req: Request, res: Response) => {
    try {
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
    } catch (err) {
        console.log("error", err)
        res.json({
            data: [],
        })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
