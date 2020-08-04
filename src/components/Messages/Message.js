import React from "react";
import {Comment, CommentMetadata} from "semantic-ui-react";
import moment from 'moment'
const isOwnMessage = (message,user)=>{
  return message.user.id===user.uid?'message__self':'';
};
const timeFromNow=timestamp=>moment(timestamp).fromNow();

const Message=({message,user})=>(
    <Comment>
        <Comment.Avatar src={message.user.avatar}/>
        <Comment.Content className={isOwnMessage(message,user)}>
            <Comment.Author as={'a' }>{message.user.name}</Comment.Author>
            <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>
            <Comment.Text>{message.content}</Comment.Text>
        </Comment.Content   >
    </Comment>
);

export default Message;
