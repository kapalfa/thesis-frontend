import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import Button from "@mui/material/Button";
import { useState } from "react";
import FileUpload from "./FileUpload";
import { alpha, styled } from "@mui/material/styles";
const StyledTreeItem = styled(TreeItem)(({theme}) => ({
    [`& .${treeItemClasses.iconContainer}`] : {
        '& .close' : {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`] : {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));
export default function FileTree({ files, handleFileClick }) {
    const [ upload, setUpload ] = useState(null)
    const handleUpload = (path) => {
        setUpload(path)
    }

    const renderTreeItems = (node, nodeId) => {
        return (
            <StyledTreeItem key={nodeId} nodeId={nodeId} label={
                <div style={{marginLeft: node.isDir ? '0px' : '-20px'}}>
                    {nodeId == '0' ? 'Files' : node.name} 
                    {node.isDir && <Button onClick={(event)=>{event.stopPropagation(); handleUpload(node.filepath); }}>Add File</Button>}
                </div>
            }
            onClick={node.isDir ? undefined : () => handleFileClick(node.filepath)}>
                {node.isDir && Object.entries(node.children)
                .sort(([key1, node1], [key2, node2]) => node2.isDir - node1.isDir)
                .map(([key, childNode], index) => renderTreeItems({ ...childNode, name: key }, `${nodeId}-${index}`))}
            </StyledTreeItem>
        )
    }
   
    return (
        <div>
            {renderTreeItems(files, '0')}
            {upload && <FileUpload path={upload} onClose={()=>setUpload(null)}/>}
            
        </div>
    )
}