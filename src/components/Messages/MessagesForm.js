import React from "react";
import {Button, Input, Segment} from "semantic-ui-react";
import firebase from "firebase";
import FileModel from "./FileModel";
import uuidv4 from 'uuid/v4';
import app from "../../firebase";
import ProgressBar from "./ProgressBar";
class MessageForm extends React.Component {
    state={
        uploadTask:null,
        uploadState:'',
        message:"",
        //判定提交状态
        loading:false,
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        errors:[],
        modal:false,
        storageRef:app.storage().ref(),
        percentUploaded:0,
    };
    closeModal=()=>this.setState({modal:false});
    openModal=()=>this.setState({modal:true});
    handleChange=event=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };
    createMessage=(fileUrl=null)=>{
        const message ={
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL

            },
            content: this.state.message
        }
        //根据判断是否有url 生成content
        if (fileUrl){
            message['image']=fileUrl;
        }else {
            message['content']=this.state.message;
        }
        return message;
    };
    sendMessage=()=>{
        const {getMessagesRef} = this.props;
        const {message,channel} = this.state;
        //如果提交了之后信息不为空，把父组件的Prop拿到firebase的path读取
        if (message){
            this.setState({
                loading:true
            });
            getMessagesRef()
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
    getPath=()=>{
        if (this.props.isPrivateChannel){
            return `chat/private-${this.state.channel.id}`
        }else {
            return 'chat/pulic'
        }
    }
    uploadFile=(file,metadata)=>{
        const pathToUpload =this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath=`${this.getPath()}/${uuidv4()}.jpeg`;
        this.setState({
            uploadState:'uploading',
            uploadTask:this.state.storageRef.child(filePath).put(file,metadata)
            },()=>{
                this.state.uploadTask.on('state_changed',snap=>{
                    const percentUploaded=Math.round((snap.bytesTransferred/snap.totalBytes)*100);
                    this.setState({percentUploaded})
                },
                    err=>{
                        console.log(err);
                        this.setState({
                            errors:this.state.errors.concat(err),
                            uploadTask:null,
                            uploadState:''
                        })
                    },()=>{
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl=>{
                        this.sendFileMessage(downloadUrl,ref,pathToUpload);
                    }).catch(err=>{
                        console.log(err);
                        this.setState({
                            errors:this.state.errors.concat(err),
                            uploadTask:null,
                            uploadState:''
                        });
                    })
                    })
        })

    };
    sendFileMessage=(fileUrl,ref,pathToUpload)=>{
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(()=>{
                this.setState({
                    uploadState:'done'
                })
            })
            .catch(err=>{
                console.log(err);
                this.setState({
                    errors:this.state.errors.concat(err)
                })
            })
    };
    render() {
        const {errors,message,loading,modal,uploadState,percentUploaded} = this.state;
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
                        disabled={uploadState==='uploading'}
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />


                </Button.Group>
                <FileModel
                modal={modal}
                closeModal={this.closeModal}
                uploadFile={this.uploadFile}>

                </FileModel>
                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}/>
            </Segment>
        );
    }
}

export default MessageForm;
