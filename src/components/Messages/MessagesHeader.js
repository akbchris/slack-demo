import React, {Component} from 'react';
import {Header, Segment, Icon, Input} from "semantic-ui-react";

class MessagesHeader extends Component {

    render() {
        const {channelName,numUniqueUsers,handleSearchChange} = this.props;
        return (
            <Segment clearing>
                <Header fluid={'true'}
                as={'h2'}
                floated={"left"}
                style={{marginBottom:0}}>
                    <span>
                        <Icon name={'star outline'} color={'black'}/>
                        {channelName}

                    </span>
                    <Header.Subheader>
                        {numUniqueUsers||'0位用户'}
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
