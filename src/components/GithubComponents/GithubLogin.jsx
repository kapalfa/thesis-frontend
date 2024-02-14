import React from "react"
import axios from "../../api/axios"
import Button from '@mui/material/Button'

export default function GithubLogin () {
    const handleGithubLogin = async () => {
        axios.get('/github/login')
            .then(function (response) {
                console.log("response from github login: ", response)
                window.location.href = response.data
            })
            .catch(function (error) {
                console.log("error: ", error)
            })
    }
    return (
        <Button fullWidth variant="contained" onClick={handleGithubLogin}>Login to Github</Button>
    )
}