import React from "react";
import {Comment, CommentMetadata, Image} from "semantic-ui-react";
import moment from 'moment'
const isOwnMessage = (message,user)=>{
  return message.user.id===user.uid?'message__self':'';
};
const isImage =(msg)=>{
    //用hasownProperty检查是不是有某个属性
    return msg.hasOwnProperty('image')&&msg.hasOwnProperty('content')
}
const timeFromNow=timestamp=>moment(timestamp).fromNow();

const Message=({message,user})=>(
    <Comment>
        <Comment.Avatar src={message.user.avatar}/>
        <Comment.Content className={isOwnMessage(message,user)}>
            <Comment.Author as={'a' }>{message.user.name}</Comment.Author>
            <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>
            {/*//判断传过来的信息是图片还是文本*/}
            {isImage(message)?<Image src={message.image} className={'message_image'}/>:<Comment.Text>{message.content}</Comment.Text>
            }
        </Comment.Content   >
    </Comment>
);

export default Message;
