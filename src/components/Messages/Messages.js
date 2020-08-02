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
        messages:[]
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
        })
    };
    displayMessages=messages=>(
      messages.length>0&&messages.map(message=>(
          <Message
          key={message.timestamp}
          message={message}
          user={this.state.user}
          />
      )));

    render() {
        const {messagesRef,channel,user,messageLoading,messages} = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />

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
