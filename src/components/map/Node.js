import React from "react";
import {Nodes} from "./Nodes";

class Node extends React.PureComponent {
    state = {
        width: 0,
        height: 10,
    };

    componentDidMount() {
        const {
            padding,
        } = this.props;
        const bbox = this.text.getBBox();
        this.setState({
            width: bbox.width + 2 * padding,
            height: bbox.height + 2 * padding,
        });
        this.rect.setAttribute("x", bbox.x - padding);
        this.rect.setAttribute("y", bbox.y - padding);
        this.rect.setAttribute("width", bbox.width + 2 * padding);
    }

    onClick = () => {
        if (this.props.node.selected) {
            this.props.setSelected(this.props.node, false);
        } else {
            this.props.setSelected(this.props.node, true);
        }
        this.props.updateLinks();
        this.forceUpdate();
    };

    render() {
        const props = this.props;
        const level = props.level ? props.level + 1 : 1;
        const {
            padding,
        } = this.props;

        return (
            <>
                <rect
                    onClick={this.onClick}
                    x={props.x - padding}
                    y={props.y - padding}
                    width={this.state.width}
                    height={this.state.height}
                    fill={
                        this.props.node.selected || this.props.parentSelected
                            ? "#aaaaaa"
                            : "aliceblue"
                    }
                    stroke="black"
                    ref={e => (this.rect = e)}
                />
                <text
                    x={props.x}
                    y={+props.y + padding}
                    dx={props.dx}
                    dy={props.dy}
                    ref={e => (this.text = e)}
                >
                    {props.node.text}
                </text>
                <path
                    d={`M ${+props.parentX + props.parentWidth - padding} ${
                        props.parentY
                        } C${+props.parentX + props.parentWidth + padding + 50} ${
                        props.parentY
                        } ${+props.x - padding - 50} ${props.y} ${props.x - padding} ${
                        props.y
                        }`}
                    stroke="black"
                />
                <Nodes
                    nodes={props.node.children}
                    level={level}
                    parentOffset={props.parentOffset}
                    x={props.x}
                    y={props.y}
                    startY={props.startY}
                    parentWidth={this.state.width}
                    nodeWidth={this.props.nodeWidth}
                    nodeHeight={this.props.nodeHeight}
                    padding={padding}
                    updateLinks={this.props.updateLinks}
                    setSelected={this.props.setSelected}
                    getOffset={this.props.getOffset}
                />
            </>
        );
    }
}

export { Node };
