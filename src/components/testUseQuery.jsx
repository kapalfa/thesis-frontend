import { useEffect, useState } from 'react'

export default function Bookmarks({userId}) {
    const [data, setData ] = useState([])
    const [ error, setError ] = useState()

    useEffect(()=>{
        fetch(`https://code-editor-eusldaqlhq-zf.a.run.app/getProjects/${userId}`)
        .then(res => res.json())
        .then(d => setData(d))
        .catch(e => setError(e))
    }, [userId])

    if (error)
        console.log(error)
    return (
        <div>
            <h1>Bookmarks</h1>
            <ul>
                {data.map((item, index) => {
                    return <li key={index}>{item}</li>
                })}
            </ul>
        </div>
    )

}