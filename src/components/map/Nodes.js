import React from "react";
import {Node} from "./Node";

function Nodes(props) {
    const {
        nodeHeight,
        nodeWidth,
        padding,
        nodes,
        startY,
        level,
        x,
        y,
        parentWidth,
        getOffset,
        updateLinks,
        setSelected,
    } = props;

    let offset = 0;
    return nodes.map((child, index) => {
        const lastOffset = offset;
        offset = offset + getOffset(child);

        const newStartY = +startY + (index + lastOffset) * (nodeHeight + padding * 4);
        const endY = +startY + (index + offset) * (nodeHeight + padding * 4);
        const nodeY = newStartY + (endY - newStartY) / 2;
        return (
            <Node
                key={index + child.text}
                node={child}
                level={level}
                parentX={x}
                parentStartY={startY}
                parentY={y}
                parentOffset={lastOffset + index}
                parentWidth={parentWidth}
                x={+x + parentWidth + nodeWidth}
                startY={newStartY}
                y={nodeY}
                index={index}
                padding={padding}
                nodeWidth={nodeWidth}
                nodeHeight={nodeHeight}
                updateLinks={updateLinks}
                setSelected={setSelected}
                getOffset={getOffset}
            />
        );
    });
}

export { Nodes }
