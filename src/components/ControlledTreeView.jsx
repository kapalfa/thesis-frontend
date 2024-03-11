import {TreeView} from '@mui/x-tree-view/TreeView';
import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useContext, useEffect } from 'react';
import { FileContext } from './MainView'
import { useParams } from 'react-router-dom';
import FileTree from './FileTree';
import ReadonlyFileTree from './ReadOnlyFileTree';
import useGetFilesByProject from '../hooks/useGetFilesByProject';

export default function ControlledTreeView({readonly}) {
    const { selectedFile, setSelectedFile } = useContext(FileContext);
    const { id } = useParams();
    const { status, data: files, refetch, error } = useGetFilesByProject(id)
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
        console.log("edw sto refresh")
        setRefresh(false)
      }
    }, [refresh])
    useEffect(()=> {
      if(!selectedFile && files.length > 0){
        setSelectedFile(files[0].path)
      }
    }, [files])

    if (status === 'loading') {
      return <div>Loading...</div>
    }
    if (status === 'error') return <div>Error: {error.message}</div>    
    if (status === 'success' && files) {
      if (status === 'success') {
        if(!readonly){
          return (
            <>
            <Box sx={{ minHeight: 270, flexGrow: 1, width: 400 }}>
              <TreeView 
                aria-label="customized"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                onNodeToggle={handleToggle}
                multiSelect
                sx={{overflowX: 'hidden', height: "750px"}}
              >
                <FileTree files={files} setRefresh={setRefresh} handleFileClick={handleFileClick} setAllNodeIds={setAllNodeIds} />
              </TreeView>
            </Box>
            </>
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
                sx={{overflowX: 'hidden', height: "800px"}}
              >
                <ReadonlyFileTree files={files} handleFileClick={handleFileClick} setAllNodeIds={setAllNodeIds} />
              </TreeView>
            </Box>
          );
        }
      }
    }
  }