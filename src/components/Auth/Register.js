import React, {Component} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon} from "semantic-ui-react";
import {Link} from "react-router-dom";
import app from "../../firebase";
import md5 from "md5"
class Register extends Component {
    state ={
        username:"",
        email:"",
        password:"",
        passwordConfirmation:"",
        errors:[],
        loading:false,
        usersRef: app.database().ref('users')
    };
    isPasswordValid =({password,passwordConfirmation})=>{
        if (password.length<6||passwordConfirmation.length<6){
            return false;
        }else return password === passwordConfirmation;
    };

    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };

    handleSubmit=(event)=>{
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({errors:[],loading:true});
            app.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    this.setState({loading:false});
                    createdUser.user.updateProfile({
                        displayName:this.state.username,
                        photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                        .then(()=>{
                            this.saveUser(createdUser).then(()=>{
                                console.log("user saved");
                            })
                        })
                        .then(()=>{
                            console.log('user saved')
                        })
                        .catch(err=>{
                            this.setState({errors:this.state.errors.concat(err),loading:false})
                        });

                })
                .catch(err => {
                    console.error(err);
                    this.setState({loading:false});
                    this.setState({errors:this.state.errors.concat(err)})
                })
        }
    };
    saveUser = createdUser=>{
        return this.state.usersRef.child(createdUser.user.uid).set({
            name:createdUser.user.displayName,
            avatar:createdUser.user.photoURL
        });
    };
    isFormValid=()=>{
        let errors=[];
        let error;
        if (this.isFormEmpty(this.state)){
            //throw err
            error ={message:"请填写所有信息"};
            this.setState({errors:errors.concat(error)});
            return false
        }else if(!this.isPasswordValid(this.state)){
            error={message: "密码不合法"};
            this.setState({errors:errors.concat(error)});
            return false
        }else {
            return true
        }
    };
    isFormEmpty=({username,email,password,passwordConfirmation})=>{
        return !username.length||!email.length||!password.length||!passwordConfirmation.length
    };
    render() {
        const {username,email,password,passwordConfirmation, errors,loading} = this.state;
        return (
            <Grid textAlign={"center"} verticalAlign={"middle"} className={"app"}>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as={"h2"} icon color={"orange"} textAlign={"center"}>
                        <Icon name={"puzzle piece"} color={"orange"} />
                        Register for Dev Chat
                    </Header>
                    <Form size={"large"}>
                        <Segment stacked={true}>
                            <Form.Input fluid={true} name={"username"} icon={"user"} iconPosition={"left"}
                                        placeholder={"用户名"} onChange={this.handleChange} type={"text"}
                                        value={username}>

                            </Form.Input>
                            <Form.Input fluid={true} name={"email"} icon={"mail"} iconPosition={"left"}
                                        placeholder={"邮箱"} onChange={this.handleChange} type={"email"} value={email}>

                            </Form.Input>
                            <Form.Input fluid={true} name={"password"} icon={"lock"} iconPosition={"left"}
                                        placeholder={"密码"} onChange={this.handleChange} type={"password"} value={password}>

                            </Form.Input>
                            <Form.Input fluid={true} name={"passwordConfirmation"} icon={"repeat"} iconPosition={"left"}
                                        placeholder={"确认密码"} onChange={this.handleChange} type={"password"} value={passwordConfirmation}>

                            </Form.Input>
                            <Button disabled={loading} loading={loading} color={"orange"} fluid size={"large"} onClick={this.handleSubmit} >Submit</Button>
                        </Segment>
                    </Form>
                    {
                        errors.length>0&&(
                            <Message error>
                                <h3>出错了</h3>
                                {this.state.errors.map((er,index)=><p key={index}>{er.message}</p>)}
                            </Message>
                        )
                    }

                    <Message>已经是用户了?<Link to={"/login"}>登录</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }


}

export default Register;
