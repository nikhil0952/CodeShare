import React, { useEffect, useRef } from "react";
import '../../src/App.css'
import codemirror from "codemirror";
import "codemirror/lib/codemirror.css"
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from "../Actions";
const Editor = ({socketRef, roomId, onCodeChange})=>{
    const editorRef = useRef();
    useEffect(
        ()=>{
            const init = async()=>{
                editorRef.current = codemirror.fromTextArea(document.getElementById('textAreaEditor'),{
                    mode : {name:'javascript', json:true},
                    theme : 'dracula',
                    autoCloseTags : true,
                    autoCloseBrackets : true,
                    lineNumbers:true

                })
              
                editorRef.current.on('change', (instance , changes)=>{
                   
                    const {origin} = changes;
                    const code = instance.getValue();
                    onCodeChange(code);
                    console.log(code);
                    if(origin !== 'setValue'){
                        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                            roomId,
                            code,
                        })
                    }
                })
            };
            init();
            return () => {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
                
                socketRef.current.disconnect();
            }
        },
        []
    );

    useEffect(
        ()=>{
            if(socketRef.current){
                socketRef.current.on(ACTIONS.CODE_CHANGE, ({code})=>{
                    if(code !== null){
                        editorRef.current.setValue(code);
                    }
                })
            }
        },
        [socketRef.current]
    )

    return(
        <>
        <textarea  id="textAreaEditor">

        </textarea>
        </>
    )
}

export default Editor