import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem"
import { useEffect, useState } from "react"
import FileUpload from "./FileComponents/FileUpload"
import { alpha, styled } from "@mui/material/styles"
import FolderUpload from "./FileComponents/FolderUpload"
import CreateFile from "./FileComponents/CreateFile"
import CreateFolder from "./FileComponents/CreateFolder"
import DeleteFile from "./FileComponents/DeleteFile"
import DeleteFolder from "./FileComponents/DeleteFolder"
import { MenuItem, Menu } from "@mui/material"
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
export default function FileTree({ files, setRefresh, handleFileClick, setAllNodeIds }) {
    const [ upload, setUpload ] = useState(null)
    const [ folderUpload, setFolderUpload ] = useState(null)
    const [ createFile, setCreateFile ] = useState(null)
    const [ createFolder, setCreateFolder ] = useState(null)
    const [ deleteFolder, setDeleteFolder ] = useState(null)
    const [ anchorEl, setAnchorEl ] = useState(null)
    const [ selectedPath, setSelectedPath ] = useState(null)
    const nodeIds = []
    const handleClick = (event, path) => {
        setAnchorEl(event.currentTarget)
        setSelectedPath(path)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleFileUpload = (path) => {
        setUpload(path)
        handleClose()
    }
    const handleFolderUpload = (path) => {
        setFolderUpload(path)
        handleClose()
    }
    const handleCreateFile = (path) => {
        setCreateFile(path)
        handleClose()
    }
    const handleCreateFolder = (path) => {
        setCreateFolder(path)
        handleClose()
    }
    const handleDeleteFolder = (path) => {
        if (window.confirm('Are you sure you want to delete this folder?')) {
            setDeleteFolder(path)
            handleClose()
        }
    }
    const renderTreeItems = (node, nodeId) => {
        nodeIds.push(nodeId)
        return (
            <StyledTreeItem key={nodeId} nodeId={nodeId} label={
                <div style={{ display:'flex', flexDirection:'row', alignItems:'center'}}
                    onContextMenu={(event)=>{
                        event.preventDefault(); 
                        event.stopPropagation(); 
                        handleClick(event, node.filepath)
                    }}
                >
                    {nodeId == '0' ? 'Files' : node.name} 
                    {node.isDir && (
                        <div> 
                            {/* <Button onClick={(event)=>{event.stopPropagation(); handleClick(event, node.filepath)}}>Choose Action</Button>  */}
                             <Menu 
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                            <MenuItem onClick={(event)=>{event.stopPropagation(); handleFileUpload(selectedPath);}}>Upload File</MenuItem>
                            <MenuItem onClick={(event)=>{event.stopPropagation(); handleFolderUpload(selectedPath);}}>Upload Folder</MenuItem>
                            <MenuItem onClick={(event)=>{event.stopPropagation(); handleCreateFile(selectedPath);}}>Create File</MenuItem> 
                            <MenuItem onClick={(event)=>{event.stopPropagation(); handleCreateFolder(selectedPath);}}>Create Folder</MenuItem>
                            {nodeId !== '0' && <MenuItem onClick={(event)=>{event.stopPropagation(); handleDeleteFolder(selectedPath);}}>Delete Folder</MenuItem>}
                            </Menu>
                        </div>
                    )}
                    {!node.isDir && (
                        <DeleteFile path={node.filepath} onRefresh={()=>setRefresh(true)}/>
                    )}
                </div>
            }
                onClick={node.isDir ? undefined : () => handleFileClick(node.filepath)}>
                {node.isDir && Object.entries(node.children)
                .sort(([key1, node1], [key2, node2]) => node2.isDir - node1.isDir)
                .map(([key, childNode], index) => renderTreeItems({ ...childNode, name: key }, `${nodeId}-${index}`))}
            </StyledTreeItem>
        )
    }
   useEffect(() => {
       setAllNodeIds(nodeIds)
    }, [])

    return (
        <div>
            {renderTreeItems(files, '0')}
            {upload && <FileUpload path={upload} onRefresh={()=>setRefresh(true)} onClose={()=>setUpload(null)}/>}
            {folderUpload && <FolderUpload path={folderUpload} onRefresh={()=>setRefresh(true)} onClose={()=>setFolderUpload(null)}/>}
            {createFile && <CreateFile path={createFile} onRefresh={()=>setRefresh(true)} onClose={()=>setCreateFile(null)} />}
            {deleteFolder && <DeleteFolder path={deleteFolder} onRefresh={()=>setRefresh(true)} onClose={()=>setDeleteFolder(null)} />}
            {createFolder && <CreateFolder path={createFolder} onRefresh={()=>setRefresh(true)} onClose={()=>setCreateFolder(null)} />}
        </div>
    )
}