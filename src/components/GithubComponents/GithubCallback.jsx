import { useSearchParams } from "react-router-dom"
import axios from "axios"
import useAuth from "../../hooks/useAuth" 
import useGit from "../../hooks/useGit"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

export default function AccessTokenFetcher () {
    const [searchParams] = useSearchParams()
    const { setAuth } = useAuth();
    const { setGit } = useGit();
    const navigate = useNavigate();
    const code = searchParams.get("code")

    const mutation = useMutation({
      mutationFn: async () => {
      try {
          const response = await axios.post('https://localhost:8443/github/callback',
            {code: code} ,
            {headers: { 'Content-Type': 'application/json' }}
          )
          const token = response.data.access_token
          setAuth(token)
          setGit(true)
          navigate('/main', { replace: true })
        } catch (error) {
          console.log("error: ", error)
        }
    }})    

    useEffect(() => {
      if (code) {
        mutation.mutate()
      }
    }, [code])

    if (mutation.isLoading) {
      return (
        <div>
          <h1>Fetching access token...</h1>
        </div>
      )
    }
}
