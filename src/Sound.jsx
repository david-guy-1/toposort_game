import React, { useDebugValue } from 'react';

class Sound extends React.Component {
    constructor(props){
        super(props);
        this.mute = this.mute.bind(this);
        this.changeSound = this.changeSound.bind(this);
        this.audio = undefined;
        this.audioStr = undefined
        this.muted = false;
    }
    mute(){
        if(this.audio !== undefined){
            this.muted = !this.muted
            if(this.muted){
                this.audio.pause();
            } else {
                this.audio.play();
            }
        }
        this.forceUpdate();
    }
    changeSound(s){
        if(this.audio !== undefined){
            this.audio.pause();
        }
        if(s !== undefined){
            this.audioStr = s;
            this.audio = new Audio(s); 
            this.audio.loop = true;
            if(this.muted){
                this.audio.pause();
            } else {
                this.audio.play();
            }
        } else {
            this.audio = undefined;
            this.audioStr = undefined
        }
    }
    render(){
        return <>
        <div style={{"position":"absolute", "left":900}}>
        <img src={this.muted ? "images/mute.png" : "images/unmute.png"} onClick={this.mute} /></div>
        
        </>
    }
    componentWillUnmount(){
        if(this.audio !== undefined){
            this.audio.pause();
        }
    }
}

export default Sound; 