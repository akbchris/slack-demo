import React, {Component} from 'react';
import {Header, Segment, Icon, Input} from "semantic-ui-react";

class MessagesHeader extends Component {
    render() {
        return (
            <Segment clearing>
                <Header fluid={'true'}
                as={'h2'}
                floated={"left"}
                style={{marginBottom:0}}>
                    <span>
                        <Icon name={'star outline'} color={'black'}/>
                        频道

                    </span>
                    <Header.Subheader>
                        2 USERS
                    </Header.Subheader>
                </Header>
                <Header floated={"right"}>
                    <Input size={'mini'}
                        icon={'search'}
                        name={'searchTerm'}
                        placeholder={'搜索消息'}/>
                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;
