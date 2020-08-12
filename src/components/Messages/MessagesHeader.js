import React, {Component} from 'react';
import {Header, Segment, Icon, Input} from "semantic-ui-react";

class MessagesHeader extends Component {

    render() {
        const {channelName,numUniqueUsers,handleSearchChange,searchLoading} = this.props;
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
                           onChange={handleSearchChange}
                        icon={'search'}
                        name={'searchTerm'}
                        placeholder={'搜索消息'}
                    loading={searchLoading}/>
                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;
