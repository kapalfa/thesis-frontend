import { useSearchParams } from "react-router-dom"
import axios from "axios"
import useAuth from "../../hooks/useAuth" 
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { API_BASE_URL } from "../../constant"
import { set } from "lodash"

export default function AccessTokenFetcher () {
    const [searchParams] = useSearchParams()
    const code = searchParams.get("code")
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const { data: token } = useQuery({
        queryKey: ['githubToken'],
        queryFn: async () => {
            try {
                const response = await axios.get('https://localhost:8443/github/callback', {
                    params: { code: code },
                    headers: { 'Content-Type': 'application/json' }
                })
                const params = new URLSearchParams(response.data)
                const token = params.get('access_token')
                return token
            } catch (error) {
                console.log("error: ", error)
                return 
            }
        }
    })
    const {status, data} = useQuery({
        queryKey: ['githubEmail'],
        queryFn: async () => {
            try {
                console.log("token in email: ", token)
                const response =  axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${token}` }
            })
            //const email = response.data[0].email
            console.log("response: ", response)

            return response
        } catch (error) {
            console.log("error: ", error)
            return
        }
        },
        enabled: !!token
    })
           
    if (status === 'success') {
        var email = data.data[0].email
        console.log("email: ", email)
        axios.post(`${API_BASE_URL}/githubLogin`, {email})
        .then(response => {
            console.log("response: ", response)
            setAuth(response.data.access_token)
            navigate('/main', {replace: true})
            return 
        })
        .catch(error => {
            console.log("error: ", error)
        })

    }
                //navigate('/main', {replace: true})  
          //      axios.get('https://api.github.com/user', {
            //    headers: {
              //      'Authorization' : `Bearer ${token}`
               // }
                //})
                //.then(function (res) {
                  //  console.log("res: ", res)
          //  const repoOwner = res.data.login 
            //    const repoName = "HPC"
              //  const branchName = "main"
               // console.log("repoOwner: ", repoOwner)
               // axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/${branchName}`, {
                 //   headers: { Authorization: `Bearer ${token}` }
                //})
                // .then(function (res) {
                //     const sha = res.data.object.sha
                // })
                // .catch(function (error) {
                //     console.log("error: ", error)
              //  })
              //  .catch(function (error) {
              //      console.log("error: ", error)
              //  })
    
    return (
        <div>DAFAK</div>
    )
}
