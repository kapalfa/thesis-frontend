import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem"
import { useEffect } from "react"
import React from "react";
import { alpha, styled } from "@mui/material/styles"

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
export default function ReadonlyFileTree({files, handleFileClick, setAllNodeIds}){
        const nodeIds = []
    
        const renderTreeItems = (node, nodeId) => {
            nodeIds.push(nodeId)
            return (
                <StyledTreeItem key={nodeId} nodeId={nodeId} label={
                    <div style={{marginLeft: node.isDir ? '0px' : '-20px'}}>
                        {nodeId == '0' ? 'Files' : node.name}    
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
            </div>
        )
}