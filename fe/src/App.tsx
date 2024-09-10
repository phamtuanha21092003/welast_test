import React from "react"
import axios from "axios"
import { HOST_BE } from "./constants"
import { useEffectAfterMount } from "./hooks"
import { message } from "antd"

function App() {
    const [repositories, setRepositories] = React.useState<Repo[]>([])

    const [languages, setLanguages] = React.useState<(string | null)[]>([])

    const [languageFilter, setLanguageFilter] = React.useState<
        string | undefined
    >(undefined)

    console.log(languageFilter, "filter")

    async function fetchRepos() {
        try {
            const res = await axios.get(`${HOST_BE}/repos`, {
                params: {
                    language: languageFilter,
                },
            })

            setRepositories(res.data?.data || [])
        } catch (error) {
            console.log(error)
            message.error("an error occurred")
        }
    }

    async function fetchFilters() {
        try {
            const res = await axios.get(`${HOST_BE}/filters`)

            setLanguages(res.data?.data || [])
        } catch (error) {
            console.log(error)
            message.error("an error occurred")
        }
    }

    useEffectAfterMount(fetchRepos, [languageFilter])

    useEffectAfterMount(fetchFilters)

    function handleChangeFilterLanguage(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        setLanguageFilter(e.target.value)
    }

    return (
        <div className="px-4 py-6">
            <div className="flex justify-end items-center gap-8">
                <div>
                    <p>Select Language</p>
                </div>
                <select
                    className="outline-none w-80 rounded-lg border border-gray-300 p-3 text-base"
                    onChange={handleChangeFilterLanguage}
                >
                    <option value="ALL">ALL</option>
                    {languages?.map(
                        (language: string | null, index: number) => (
                            <option
                                key={`language_${language}_${index}_`}
                                value={language?.toString()}
                            >
                                {language ?? "NULL"}
                            </option>
                        )
                    )}
                </select>
            </div>

            <div className="mt-4 grid grid-cols-4 text-lg text-center">
                <div>Name</div>
                <div>Description</div>
                <div>Language</div>
                <div>Forks Count</div>

                {repositories.length > 0 ? (
                    repositories.map((repo: Repo, index: number) => (
                        <React.Fragment key={`repo_${repo.id}_index_${index}`}>
                            <div>{repo.name}</div>
                            <div>{repo.description}</div>
                            <div>{repo.language ?? "NULL"}</div>
                            <div>{repo.forksCount}</div>
                        </React.Fragment>
                    ))
                ) : (
                    <div className="col-span-4">NOT FOUND REPOSITORY</div>
                )}
            </div>
        </div>
    )
}

export default App
