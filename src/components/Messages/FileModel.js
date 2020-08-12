import React, {Component} from 'react';
import {Modal,Input,Button,Icon} from "semantic-ui-react";
import mime from 'mime-types';
class FileModel extends Component {
    state={
        file:null,
        authorized:['image/jpeg',['image/png']]
    };
    addFile=(event)=>{
        const file=event.target.files[0];
        if (file){
            this.setState({
                file
            })
        }
    }
    clearFile=()=>{
        this.setState({
            file:null

        })
    }
    senFile=()=>{
        const {file}=this.state;
        const {uploadFile,closeModal}=this.props;
        console.log('sending')
        if (file!==null){
            if (this.isAuthorized(file.name)){
                //send File
                const metadata={contentType:mime.lookup(file.name)};
                uploadFile(file,metadata);
                this.clearFile();
                closeModal();
            }
        }
    }

    isAuthorized =fileName=>this.state.authorized.includes(mime.lookup(fileName));
    render() {
        const {modal,closeModal}=this.props;
        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>
                    选择你的图片文件
                </Modal.Header>
                <Modal.Content>
                    <Input onChange={this.addFile} fluid label={"文件类型：jpg,png"} name={'file'} type={'file'}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.senFile} color={'green'} inverted>
                        <Icon name={'checkmark'}></Icon>
                        发送
                    </Button>
                    <Button color={'red'} inverted onClick={closeModal}>
                        <Icon name={'remove'}></Icon>
                        取消
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

}

export default FileModel;
