import React, {Component} from 'react';
import {Loader, Dimmer} from "semantic-ui-react";

class Spinner extends Component {
    render() {
        return (
            <Dimmer active>
                <Loader size={'huge'} content={"正在加载中"}/>
            </Dimmer>
        );
    }
}

export default Spinner;
