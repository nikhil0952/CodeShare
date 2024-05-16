import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { v4 } from "uuid";

const Home = () => {

    const [roomId , setRoomId] = useState();
    const [userName , setUserName] = useState();

    const navigate = useNavigate();

    const generateUniqueID = (event) => {
        event.preventDefault();

        const id = v4();

        console.log(id);
        setRoomId(id);
        toast.success("Created a new room!")
    }

    const joinRoom = (event)=>{
        event.preventDefault();

        if(!userName || !roomId){
            toast.error("Room ID and Username is required!")
            return
        }

        navigate(`/editor/${roomId}/${userName}`);

    }
    const handleKey = (e)=>{
        if(e.code === "Enter"){
            joinRoom(e);
        }
    }

    return (
        <>
            <div className=" bg-[#090918ed] h-[95vh] flex flex-col justify-center items-center flex-wrap">
                <div className=" h-[20rem] text-white flex flex-col justify-around rounded-xl w-[25rem] bg-[#4e536f51] p-5">
                    <div className="text-3xl text-[#57e057] font-bold">
                        {`Code <> Share`}
                    </div>
                    <div className=" h-[75%] flex flex-col justify-around">
                        <p className=" text-sm font-bold">
                            Paste invitation ROOM ID
                        </p>
                        <form className="flex flex-col text-black justify-between">
                            <input
                                className=" p-2 mb-2 rounded"
                                type="text"
                                placeholder="ROOM ID"
                                value={roomId}
                                onChange={(e)=>{setRoomId(e.target.value)}}
                                onKeyUp={handleKey}
                            />

                            <input
                                className=" p-2 mb-2 rounded"
                                type="text"
                                placeholder="USERNAME"
                                value={userName}
                                onChange={(e)=>{setUserName(e.target.value)}}
                                onKeyUp={handleKey}
                            />

                            <div className=" text-right ">
                                <button 
                                onClick={joinRoom}
                                className="bg-[#57e057] p-1 w-[20%] rounded text-black font-bold">
                                    Join
                                </button>
                            </div>
                        </form>
                        <div className="flex text-sm justify-center items-center text-center">
                            <p className="">
                                If you don't have an invite then create! &nbsp;
                            </p>
                            <button
                            onClick={generateUniqueID}
                                className=" text-[#57e057] underline"
                            >
                                new room
                            </button>
                        </div>
                    </div>

                </div>

            </div>
            <div className=" flex h-[5vh] text-white bg-[#090918ed] justify-center ">
                <p>Build with ❤️ by &nbsp; </p>
                <a className="underline text-[#57e057]" href="https://github.com/nikhil0952">Nikhil Walia</a>
            </div>
        </>
    )
}

export default Home