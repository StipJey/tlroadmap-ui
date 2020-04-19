import React from "react";
import "./styles.css";
import {Link} from "./components/Link";
import {Node} from "./components/map/Node";
import {debounce} from "./utils/debounce";

import data from "./roadmap.json";

const nodeWidth = 100;
const nodeHeight = 20;
const padding = 10;
const startSize = 1000;

export default class App extends React.PureComponent {
    static getSelected(node) {
        if (!node.children.length) {
            if (node.selected) {
                return {
                    text: node.text,
                    link: node.link
                };
            } else {
                return;
            }
        }

        const childLinks = node.children
            .map(child => App.getSelected(child))
            .filter(Boolean);

        if (childLinks.length) {
            return {
                text: node.text,
                links: childLinks
            };
        }
    }

    static setSelected(node, selected) {
        node.children = node.children.map(child => {
            return App.setSelected(child, selected);
        });
        node.selected = selected;
        return {...node};
    }

    static getOffset(child) {
        let offset = 0;

        getChildrenLength(child);

        function getChildrenLength(child) {
            if (child.children.length) {
                child.children.forEach(getChildrenLength);
            }
            offset += child.children.length;
        }

        return offset;
    }

    state = {
        links: [],
        data: data,
        x: 0,
        y: (App.getOffset(data) * (nodeHeight + padding * 4)) / 2 - startSize / 2,
        width: startSize,
        height: startSize,
        startSize: startSize,
        moving: false,
        lastX: null,
        lastY: null,
        zoom: 1
    };

    showFullMap = () => {
        const bbox = this.map.getBBox();
        const width = bbox.width;
        const height = bbox.height;
        const size = Math.max(width, height);
        this.setState({
            x: 0,
            y: 0,
            width: size,
            height: size,
            zoom: size / this.state.startSize
        });
    };

    resetZoomAndPosition = () => {
        const rect = this.map.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const size = Math.min(width, height);
        this.setState({
            x: 0,
            y: (App.getOffset(data) * (nodeHeight + padding * 4)) / 2 - size / 2,
            width: size,
            height: size,
            startSize: size
        });
    };

    componentDidMount() {
        this.resetZoomAndPosition();
    }

    updateLinks = () => {
        this.setState({
            links: App.getSelected(data)
        });
    };

    onDrugStart = e => {
        this.setState({
            moving: true,
            lastX: e.clientX,
            lastY: e.clientY
        });
    };

    onDrug = debounce(e => {
        if (this.state.moving) {
            if (this.state.lastX && this.state.lastY) {
                this.setState({
                    x: this.state.x + (this.state.lastX - e.clientX) * this.state.zoom,
                    y: this.state.y + (this.state.lastY - e.clientY) * this.state.zoom,
                    lastX: e.clientX,
                    lastY: e.clientY
                });
            }
        }
    }, 30);

    onDrugEnd = () => {
        this.setState({
            moving: false
        });
    };

    onZoom = debounce(e => {
        const newSize = this.state.width + e.deltaY * 5;
        if (newSize < 100) return;
        this.setState({
            x: this.state.x - (newSize - this.state.width) / 2,
            y: this.state.y - (newSize - this.state.width) / 2,
            width: newSize,
            height: newSize,
            zoom: newSize / this.state.startSize
        });
    }, 30);

    render() {
        console.log(this.state.links);
        const startY = 30;
        const y = startY + (App.getOffset(data) * (nodeHeight + padding * 4)) / 2;
        return (
            <div className="app">
                <div className="map">
                    <svg
                        ref={e => (this.map = e)}
                        className="App"
                        viewBox={[
                            this.state.x,
                            this.state.y,
                            this.state.width,
                            this.state.height
                        ]}
                        fill="none"
                        onMouseDown={this.onDrugStart}
                        onMouseMove={this.onDrug}
                        onMouseUp={this.onDrugEnd}
                        onWheel={this.onZoom}
                    >
                        <Node
                            node={data}
                            x="20"
                            y={y}
                            startY={startY}
                            updateLinks={this.updateLinks}
                            setSelected={App.setSelected}
                            getOffset={App.getOffset}
                            nodeWidth={nodeWidth}
                            nodeHeight={nodeHeight}
                            padding={padding}
                        />
                    </svg>
                </div>
                <div className="links">
                    <h2>Темы для изучения</h2>
                    <Link link={this.state.links}/>
                </div>
            </div>
        );
    }
}
