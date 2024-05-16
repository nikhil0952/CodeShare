import React, { useEffect, useRef, useState } from "react";
import Editor from "./Components/Editor";
import { initSocket } from "./socket";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import ACTIONS from './Actions.js'
import Client from "./Components/Client.js";

const Editorpage = () => {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const { roomId, username } = useParams();
    const [client, setClient] = useState();


    useEffect(
        () => {
            const init = async () => {
                try {
                    socketRef.current = await initSocket();
                } catch (error) {
                    toast.error("Error in connecting server !");
                    console.log(error);
                }

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username
                })



                // listening
                socketRef.current.on(ACTIONS.JOINED, ({ clients, user, socketId }) => {
                    if (username !== user) {
                        toast.success(`${user} is joined successfully!`)
                    }
                    setClient(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE,{
                        code : codeRef.current,
                        socketId
                    })

                })

                // disconnecting
                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, user }) => {
                    toast.success(`${user} leaves!`);
                    setClient((prev) => {
                        return prev.filter(client => client.socketId !== socketId)
                    })
                })

            };
            init();
            return () => {
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.disconnect();
            }
        },
        []
    )

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room Id copied successfully! ")
        }catch(error){
            toast.error("Error in copy Room Id!");
        }
    }

    const leaveRoom = ()=>{
        navigate('/');
    }

    console.log(client);

    return (
        <>
            <div className="bg-[#090918ed] h-[100vh] text-white flex">
                <div className="flex text-center flex-col justify-between w-[15rem] p-5 bg-[#090918ed]">
                    <div>
                        <div className=" mb-5">
                            <h1 className="text-3xl mb-5 font-bold text-[#57e057]">
                                {`Code<>Share`}
                            </h1>
                            <h1 className=" border"></h1>
                        </div>
                        <div className="">
                            <p>Connected</p>
                            <div className="flex flex-wrap p-2">
                                {
                                    client &&
                                    client.map((value) => {
                                        return (
                                            <>
                                                <Client
                                                    key={value.socketId}
                                                    username={value.user}
                                                />
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button
                            onClick={copyRoomId}
                            className="mb-3 rounded p-1 bg-white font-bold text-black">
                            Copy ROOM ID
                        </button>
                        <button 
                        onClick={leaveRoom}
                        className="rounded p-1 bg-[#57e057] font-bold text-black">
                            Leave
                        </button>
                    </div>
                </div>

                <div className="p-10 text-black w-[90%] h-[100vh]">
                    <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}} />
                </div>
            </div>
        </>
    )
}

export default Editorpage