import {TreeView} from '@mui/x-tree-view/TreeView';
import {TreeItem} from '@mui/x-tree-view/TreeItem';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useContext, useEffect } from 'react';
import { FileContext } from './MainView'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
function renderTree(nodes, index) {
  return (
    <TreeItem key={index} nodeId={index.toString()} label={nodes.name} onClick={()=>handleFileClick(nodes)}>
      {Array.isArray(nodes.children) ? nodes.children.map((node, i) => renderTree(node, `${index}-${i}`)) : null}
    </TreeItem>
  )
}

export default function ControlledTreeView() {
    const auth = useAuth()
    const [expanded, setExpanded] = useState([]);
    const { setSelectedFile } = useContext(FileContext);
    const { id } = useParams();
    const [ files, setFiles ] = useState([])
    const handleFileClick = (file) => {
      setSelectedFile(file);
    }
  
    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };

    useEffect(()=> {
      const fetchFiles = async () => {
        try {
            const response = await axios.get(`https://localhost:8443/api/getFiles/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setFiles(response.data)
            console.log("response from get files" , response.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchFiles()
}, [auth])// tha ithela otan create file, na emfanizete kateutheian sto my files
  
  
    return (
      <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
        <TreeView
          aria-label="controlled"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          onNodeToggle={handleToggle}
          multiSelect
        >
          <TreeItem nodeId='0' label="Files">
   
          </TreeItem>

        </TreeView>
      </Box>
    );
  }