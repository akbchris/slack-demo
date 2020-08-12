import React from 'react';
import './App.css';
import {Grid, GridColumn} from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import {connect} from "react-redux"
const App=({currentUser,currentChannel})=>(
    <Grid columns={'equal'} className={'app'} style={{backgroundColor:"#eee"}}>
        <ColorPanel/>
        <SidePanel currentUser={currentUser}
            key={currentUser&&currentUser.uid}/>
        <Grid.Column style ={{marginLeft:320}} >
            <Messages
                currentChannel={currentChannel}
                key={currentChannel&&currentChannel.id}
                currentUser={currentUser}/>
        </Grid.Column>
        <GridColumn width={4}>
            <MetaPanel/>
        </GridColumn>

    </Grid>
);
const   mapStateToProps = state=>({
   currentUser:state.user.currentUser,
    currentChannel:state.channel.currentChannel
});
export default connect(mapStateToProps)(App);
