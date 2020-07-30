import React, {Component} from 'react';
import {Menu} from "semantic-ui-react";
import UserPanel from "../UserPanel/UserPanel";
class SidePanel extends Component {
    render() {
        return (
            <Menu
                size={'large'}
                inverted
                fixed={'left'}
                vertical
                style={{background:"#4c3c4c" ,fontSize:"1.2 rem"}}

            >
            <UserPanel></UserPanel>
            </Menu>
        );
    }
}

export default SidePanel;
