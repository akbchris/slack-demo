import React, {Component} from 'react';
import {Grid, GridColumn, GridRow, Header, HeaderContent, Icon,Dropdown,Image} from "semantic-ui-react";
import app from "../../firebase";
import {connect} from 'react-redux'
class UserPanel extends Component {
    state = {
        user: this.props.currentUser
    };



    dropdownOptions =()=>[
        {key:"user",
        text:<p>你好<strong>{this.state.user.displayName}</strong> </p>,
        disabled:true
    },{
        key:'avatar',
        text: <p>更改头像</p>
        },{
        key:'signout',
        text:<p onClick={this.handleSignout}>登出</p>
    }
    ];
    handleSignout=()=>{
        console.log('clicked');
        app
            .auth()
            .signOut()
            .then(()=>console.log('singned out'));
    };
    render() {
        const {user} = this.state;
        return (
            <Grid style={{background:'#4c3c4c'}}>
                <GridColumn >
                    <GridRow style={{padding:'1.2 em',margin:0}}>
                        <Header inverted floated={'left'} as={'h2'} style={{paddingBottom:'1em'}}>
                            <Icon name={'code'}/>
                            <HeaderContent >聊天系统</HeaderContent>
                        </Header>
                    </GridRow>
                    <GridRow>
                        <Header style={{ padding: "0.25em" }} as={'h4'} inverted>
                            <Dropdown  trigger={<span>
                                <Image src={user.photoURL} spaced={'right'} avatar/>
                                {user.displayName}
                            </span>} options={this.dropdownOptions()}>
                            </Dropdown>
                        </Header>
                    </GridRow>

                </GridColumn>
            </Grid>
        );
    }
}
const mapStateToProps=state=>({
    currentUser:state.user.currentUser

});

export default connect(mapStateToProps)(UserPanel);
