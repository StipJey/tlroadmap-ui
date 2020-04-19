import React from "react";
import {Links} from "./Links";

/**
 * @return {null}
 */
function Link(props) {
    const { link } = props;

    if (!link) return null;

    if (link && link.links) {
        return (
            <>
                <ul>
                    {link.text}
                    <Links links={link.links} />
                </ul>
            </>
        );
    }

    if (link && link.link) {
        return (
            <li>
                <a href={link.link}>{link.text}</a>
            </li>
        );
    }

    return <li>{link.text}</li>;
}

export { Link }
