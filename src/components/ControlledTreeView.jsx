import {TreeView} from '@mui/x-tree-view/TreeView';
import {TreeItem} from '@mui/x-tree-view/TreeItem';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useContext } from 'react';
import { files } from '../../fileCodes/files.js'
import { FileContext } from './MainView'

export default function ControlledTreeView() {
    const [expanded, setExpanded] = useState([]);
    const { setSelectedFile } = useContext(FileContext);
  
    const handleFileClick = (file) => {
      setSelectedFile(file);
    }
  
    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
  
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
          <TreeItem nodeId="1" label="Applications">
            <TreeItem nodeId="2" label="main.js" onClick={()=>handleFileClick(files[0])}/>
            <TreeItem nodeId="3" label="Chrome"/>
            <TreeItem nodeId="4" label="Webstorm" />
          </TreeItem>
          <TreeItem nodeId="5" label="Documents">
            <TreeItem nodeId="6" label="MUI">
              <TreeItem nodeId="7" label="src">
                <TreeItem nodeId="8" label="index.js" />
                <TreeItem nodeId="9" label="tree-view.js" />
              </TreeItem>
            </TreeItem>
          </TreeItem>
          </TreeItem>
        </TreeView>
      </Box>
    );
  }