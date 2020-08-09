import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import Message from "./Message";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import app from "../../firebase";
class Messages extends React.Component {
    state = {
        messagesRef:app.database().ref("messages"),
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        messageLoading:true,
        messages:[],
        numUniqueUsers:'',
        searchTerm:'',
        searchLoading:false,
        searchResults:[]
    };
    componentDidMount() {
        //第一次load完 添加监视器
        const {channel,user} =this.state;

        if (channel&&user){
            this.addListeners(channel.id)
        }

    }
    addListeners=channelId=>{
        this.addMessageListener(channelId);
    };
    addMessageListener = channelId=>{
        //监控是不是这个频道有新更新
        let loadedMessage = [];
        //如果触发了添加child那就更新
        this.state.messagesRef.child(channelId).on('child_added',snap=>{
            loadedMessage.push(snap.val());
            this.setState({
                messages:loadedMessage,
                messageLoading:false
            })
            //console.log(loadedMessage);
            this.countUniqueUsers(loadedMessage);
        })
    };
    countUniqueUsers=messages=>{
        const uniqueUsers=messages.reduce((pre,cur)=>{
            if (!pre.includes(cur.user.name)){
                pre.push(cur.user.name)
            }
            return pre
        },[])
        const numUniqueUsers=`${uniqueUsers.length} 位用户`;
        this.setState({
            numUniqueUsers:numUniqueUsers
        })
    }
    displayMessages=messages=>(
      messages.length>0&&messages.map(message=>(
          <Message
          key={message.timestamp}
          message={message}
          user={this.state.user}
          />
      )));
    displayChannelName = (channel)=>{
        return channel?`#${channel.name}`:''
    }
    handleSearchChange=event=>{
        this.setState({
            searchTerm:event.target.value,
            searchLoading:true
        },()=>{
            this.handleSearchMessages()
        })
    }
    handleSearchMessages=()=>{
        const channelMessages=[...this.state.messages];
        const regex = new RegExp(this.state.searchTerm,'gi')
        const searchResult = channelMessages.reduce((pre,cur)=>{
            if (cur.content.match(regex)){
                pre.push(cur);
            }
            return pre
        },[])
        this.setState({
            searchResult:searchResult
        })
    }
    render() {
        const {messagesRef,channel,user,numUniqueUsers,messages} = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange()}
                />

                <Segment>
                    <Comment.Group className="messages">{this.displayMessages(messages)}</Comment.Group>
                </Segment>

                <MessagesForm
                    //把存下来的数据 解构
                    currentChannel={channel}
                    messagesRef={messagesRef}
                    currentUser={user}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
