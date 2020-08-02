import React from "react";
import {Button, Input, Segment} from "semantic-ui-react";
import firebase from "firebase";

class MessageForm extends React.Component {
    state={
        message:"",
        //判定提交状态
        loading:false,
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        errors:[]
    };


    handleChange=event=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };
    createMessage=()=>{
        return {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL

            },
            content: this.state.message
        }
    };
    sendMessage=()=>{
        const {messagesRef} = this.props;
        const {message,channel} = this.state;
        //如果提交了之后信息不为空，把父组件的Prop拿到firebase的path读取
        if (message){
            this.setState({
                loading:true
            });
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(()=>{
                    this.setState({
                        loading:false,
                        message: '',
                        errors:[]
                    })
                })
                .catch(error=>{
                    console.log(error);
                    this.setState({
                        loading:false,
                        errors:this.state.errors.concat(error)
                    })
                })
            //如果为空进入else
        }else {
            this.setState({
                errors:this.state.errors.concat({message:'请添加信息'})
            })
        }
    };
    render() {
        const {errors,message,loading} = this.state;
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    onChange={this.handleChange}
                    name="message"
                    style={{ marginBottom: "0.7em" }}
                    label={<Button icon={"add"} />}
                    //把消息和state绑定
                    value={message}
                    labelPosition="left"
                    className={errors.some(err=>err.message.includes('请添加信息'))/*如果里面不包含不填导致的报错信息*/
                    ?'error':""}
                    placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        disabled={loading}
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        onClick={this.sendMessage}
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;
