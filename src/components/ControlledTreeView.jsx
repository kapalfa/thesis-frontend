import {TreeView} from '@mui/x-tree-view/TreeView';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useContext } from 'react';
import { FileContext } from './MainView'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import FileTree from './FileTree';
import { useQuery } from '@tanstack/react-query';
const getFilesByProject = async (projectId, auth) => {
  const { data } = await axios.get(`https://127.0.0.1:8443/api/getFiles/${projectId}`,
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
export default function ControlledTreeView() {
    const { auth } = useAuth()
    const [expanded, setExpanded] = useState([]);
    const { setSelectedFile } = useContext(FileContext);
    const { id } = useParams();
    const { status, data: files } = getFiles(id, auth)
    const handleFileClick = (file) => {
      setSelectedFile(file);

      console.log('file from handleFileClick: ', file)
    }

  
    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
    if (status === 'loading') {
      return <div>Loading...</div>
    }
    if (status === 'error') {
      return <div>Error: {error.message}</div>
    }
    if (status === 'success' && files) {
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
          <FileTree files={files} handleFileClick={handleFileClick} />
        </TreeView>
      </Box>
      );
    }
  }