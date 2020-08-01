import React, {Component} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon} from "semantic-ui-react";
import {Link} from "react-router-dom";
import app from "../../firebase";
class Login extends Component {
    state ={
        email:"",
        password:"",
        errors:[],
        loading:false,
    };


    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };

    handleSubmit=(event)=>{
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({errors:[],loading:true});
            app.auth()
                .signInWithEmailAndPassword(this.state.email,this.state.password)
                .then(signedInUser=>{
                    console.log(signedInUser);
                })
                .catch(err=>{
                    console.log(err);
                    this.setState({
                        errors:this.state.errors.concat(err),
                        loading:false
                        }
                    );
                })


        }
    };
    isFormValid=({email,password})=>{
        return email&&password
    };

    render() {
        const {email,password, errors,loading} = this.state;
        return (
            <Grid textAlign={"center"} verticalAlign={"middle"} className={"app"}>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as={"h2"} icon color={"violet"} textAlign={"center"}>
                        <Icon name={"code branch"} color={"violet"} />
                        登录 for Dev Chat
                    </Header>
                    <Form size={"large"}>
                        <Segment stacked={true}>

                            <Form.Input fluid={true} name={"email"} icon={"mail"} iconPosition={"left"}
                                        placeholder={"邮箱"} onChange={this.handleChange} type={"email"} value={email}>

                            </Form.Input>
                            <Form.Input fluid={true} name={"password"} icon={"lock"} iconPosition={"left"}
                                        placeholder={"密码"} onChange={this.handleChange} type={"password"} value={password}>

                            </Form.Input>

                            <Button disabled={loading} loading={loading} color={"violet"} fluid size={"large"} onClick={this.handleSubmit} >Submit</Button>
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

                    <Message>没有用户名密码？<Link to={"/register"}>点击注册</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }


}

export default Login;
