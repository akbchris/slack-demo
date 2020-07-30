import React, {Component} from 'react';
import {Grid, GridColumn, GridRow, Header, HeaderContent, Icon} from "semantic-ui-react";

class UserPanel extends Component {
    render() {
        return (
            <Grid style={{background:'#4c3c4c'}}>
                <GridColumn >
                    <GridRow style={{padding:'1.2 rem',margin:0}}>
                        <Header inverted floated={'left'} as={'h2'}>
                            <Icon name={'code'}/>
                            <HeaderContent>聊天系统</HeaderContent>
                        </Header>
                    </GridRow>
                </GridColumn>
            </Grid>
        );
    }
}

export default UserPanel;
