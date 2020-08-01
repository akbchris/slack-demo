import React, {Component} from 'react';
import {Icon, Menu, MenuItem, MenuMenu, Modal, Form, Input, Button} from "semantic-ui-react";
import app from "../../firebase";
class Channels extends Component {
    state ={
        user:this.props.currentUser,
        channels:[],
        channelName:"",
        channelDetails:"",
        channelsRef:app.database().ref('channels'),
        modal:false,
    };
    closeModal=()=>{
        this.setState({
            modal:false
        })
    };
    openModal=()=>{
        this.setState({
            modal:true
        })
    };
    addChannel=()=>{
        const {user,channelsRef,channelName,channelDetails} =this.state;
        const key =channelsRef.push().key;
        const newChanel ={
            id:key,
            name:channelName,
            details:channelDetails,
            createdBy:{
                name:user.displayName,
                avatar:user.photoURL,

            }
        };
        channelsRef.child(key)
            .update(newChanel)
            .then(()=>{
                this.setState({channelName: '',
                channelDetails: ''},this.closeModal)
            }).catch(err=>{
            console.log(err);
        })
    };
    handleChange=event=>{
        this.setState({[event.target.name]:event.target.value})
    };
    handleSubmit=event=>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            console.log('channel Added');
            this.addChannel();
        }

    };
    isFormValid=({channelName,channelDetails})=>channelDetails&&channelDetails;
    render() {
        const {channels,modal} = this.state;
        return (
            <React.Fragment>
            <MenuMenu style={{paddingBottom:'2em'}}>
                <MenuItem>
                    <span>
                        <Icon name={"exchange"}/>
                        频道
                    </span>
                    <Icon name={'add'} onClick={this.openModal}/>
                </MenuItem>
            </MenuMenu>
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>
                        添加一个频道
                    </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input label={'频道名'}
                                        fluid
                                        name={'channelName'}
                                        onChange={this.handleChange}/>
                            </Form.Field>
                            <Form.Field>
                                <Input label={'关于频道'}
                                       fluid
                                       name={'channelDetails'}
                                       onChange={this.handleChange}/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color={"green"} inverted onClick={this.handleSubmit}>
                            确认
                            <Icon name={"checkmark"}/>
                        </Button>
                        <Button color={"red"} inverted onClick={this.closeModal}>
                            取消
                            <Icon name={"remove"}/>
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Channels;
