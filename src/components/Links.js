import React from "react";
import { Link } from './Link';

function Links(props) {
    return props.links.map((link, index) => {
        return <Link link={link} key={index + link.text} />;
    });
}

export { Links }
