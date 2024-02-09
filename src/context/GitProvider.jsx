import { createContext, useState } from 'react'

const GitContext = createContext({})

export const GitProvider = ({ children }) => {
    const [git, setGit] = useState(null)

    return (
        <GitContext.Provider value={{ git, setGit }}>
            {children}
        </GitContext.Provider>
    );
}

export default GitContext;