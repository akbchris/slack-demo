import React from "react";
import app from "../../firebase";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import {connect} from 'react-redux';
import {setCurrentChannel} from "../../action";

class Channels extends React.Component {
    state = {
        activeChannel:'',
        user: this.props.currentUser,
        channels: [],
        channelName: "",
        channelDetails: "",
        channelsRef: app.database().ref("channels"),
        modal: false,
        firstLoad:true,

    };
    componentWillUnmount() {
        //离开这个页面摧毁app
        this.removeListeners();
    }

    componentDidMount() {
        this.addListeners();
    }
    removeListeners(){
        this.state.channelsRef.off();
    }
    addListeners = () => {
        let loadedChannels = [];
        //如果那个path触发了增加child就把那个增加的返回
        this.state.channelsRef.on("child_added", snap => {
            loadedChannels.push(snap.val());
            //load完之后 callback默认第一个选中
            this.setState({ channels: loadedChannels },()=>this.setFirstChannel());
        });
    };
    setFirstChannel=()=>{
        const firstChanel=this.state.channels[0];
        //判断若为初次，且至少有一个
        if (this.state.firstLoad&&this.state.channels.length>0){
            this.props.setCurrentChannel(firstChanel);
            this.setActiveChannel(firstChanel);
            //把当前选中的设置了 并触发action
        }
        this.setState({
            firstLoad:false
        })
    };
    changeChannel =channel=>{
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);

    };
    setActiveChannel=channel=>{
        this.setState({activeChannel:channel.id})
    };
    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: "", channelDetails: "" });
                this.closeModal();
                console.log("channel added");
            })
            .catch(err => {
                console.error(err);
            });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    displayChannels = channels =>
        channels.length > 0 &&
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                //把当前这个绑定，传当前信息
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                //只把活动的channel显示为active
                active={channel.id===this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ));

    isFormValid = ({ channelName, channelDetails }) =>
        channelName && channelDetails;

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {
        const { channels, modal } = this.state;

        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: "2em" }}>
                    <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
                        ({channels.length}) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                {/* Add Channel Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(null,{setCurrentChannel})(Channels);
