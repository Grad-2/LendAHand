import React from "react"
import { Link } from "react-router-dom";

const JoinPMRoom = () => {
    const [roomKey, setRoomKey] = React.useState("");

    const handleRoomNameChange = (event) => {
        setRoomKey(event.target.value);
    };


    return (
        <div className="PM-container">
            <input
                type="text"
                placeholder="PM"
                value={roomKey}
                onChange={handleRoomNameChange}
                className='text-input-field'
            />
            <Link to={`/${roomKey}`} className="enter-PM-room-button">
                Send Private Message
            </Link>
        </div>
    );
};

export default JoinPMRoom