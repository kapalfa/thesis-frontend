import { useContext } from "react"
import GitContext from "../context/GitProvider"

const useGit = () => {
    return useContext(GitContext)
}

export default useGit