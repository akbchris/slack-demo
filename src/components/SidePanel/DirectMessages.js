import React, {Component} from 'react';
import {Menu,Icon} from "semantic-ui-react";
import app from "../../firebase";
class DirectMessages extends Component {
    state={
        users:[],
        user:this.props.currentUser,
        usersRef:app.database().ref('users'),
        connectedRef:app.database().ref('.info/connected'),
        presenceRef:app.database().ref('presence')
    }
    componentDidMount() {
        if (this.state.user){
            //加载完成后，传递当前user信息
            this.addListeners(this.state.user.uid)
        }

    }
    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on("child_added", snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user["uid"] = snap.key;
                user["status"] = "offline";
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });

        this.state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true).then(r => console.log(r));
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                }).then(r => console.log(r));
            }
        });

        this.state.presenceRef.on("child_added", snap => {
            if (currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key);
            }
        });

        this.state.presenceRef.on("child_removed", snap => {
            if (currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key, false);
            }
        });
    };
    addStatusToUser=(userId,connected=true)=> {
        const updatedUser = this.state.users.reduce((acc,user)=>{
            if (user.uid===userId){
                user['status']=`${connected?'online':'offline'}`;
            }
            return acc.concat(user)
        },[])
        this.setState({
            users:updatedUser
        })
    }
    isUserOnline =(user)=>user.status==='online'
    render() {
        const {users} = this.state
        return (
            <Menu.Menu className={'menu'}>
                <Menu.Item>
                    <span>
                        <Icon name={'mail'}/>
                    </span>{''}
                ({users.length})<Icon name={'add'}/>
                </Menu.Item>
                {users.map(user=>(

                    <Menu.Item
                        key={user.uid}
                        onClick={() => console.log(user)}
                        style={{opacity:0.7,fontStyle:'italic'}}>
                    <Icon name={'circle'}
                     color={this.isUserOnline(user)?'green':'red'}/>
                        @{user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

export default DirectMessages;
