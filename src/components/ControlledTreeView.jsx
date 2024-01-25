import {TreeView} from '@mui/x-tree-view/TreeView';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useContext, useEffect } from 'react';
import { FileContext } from './MainView'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import FileTree from './FileTree';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../constant'
import ReadonlyFileTree from './ReadOnlyFileTree';
const getFilesByProject = async (projectId, auth) => {
  const { data } = await axios.get(`${API_BASE_URL}/getFiles/${projectId}`,
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
  })
  return data
}
function getFiles(projectId, auth){
  return useQuery({
    queryKey: ['files', projectId], 
    queryFn: () => getFilesByProject(projectId, auth),
    enabled: !!projectId, 
  //  staleTime: 30000,
  })
}
export default function ControlledTreeView({readonly}) {
    const { auth } = useAuth()
    const { setSelectedFile } = useContext(FileContext);
    const { id } = useParams();
    const { status, data: files, refetch } = getFiles(id, auth)
    const [expanded, setExpanded] = useState([])
    const [ allNodeIds, setAllNodeIds ] = useState([])
    const [ refresh, setRefresh ] = useState(false)
    const handleFileClick = (file) => {
      setSelectedFile(file);
    }
    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
    
    useEffect(()=> {
      setExpanded(allNodeIds)
    }, [allNodeIds])
    
    useEffect(()=> {
      if(refresh){
        refetch()
      setRefresh(false)
      }
    }, [refresh])
    if (status === 'loading') {
      return <div>Loading...</div>
    }
    if (status === 'error') {
      return <div>Error: {error.message}</div>
    }
    if (status === 'success' && files) {
      if (status === 'success') {
        if(!readonly){
          return (
            <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
              <TreeView 
                aria-label="customized"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                onNodeToggle={handleToggle}
                multiSelect
                sx={{overflowX: 'hidden'}}
              >
                <FileTree files={files} setRefresh={setRefresh} handleFileClick={handleFileClick} setAllNodeIds={setAllNodeIds} />
              </TreeView>
            </Box>
          );
        } else {
          return (
            <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
              <TreeView 
                aria-label="customized"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                onNodeToggle={handleToggle}
                multiSelect
                sx={{overflowX: 'hidden'}}
              >
                <ReadonlyFileTree files={files} handleFileClick={handleFileClick} setAllNodeIds={setAllNodeIds} />
              </TreeView>
            </Box>
          );
        }
      }
    }
  }