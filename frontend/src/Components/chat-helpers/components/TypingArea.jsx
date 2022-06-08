const TypingArea = ({ message, setMessage, onSubmit }) => (
    <div className='p-3 chat-input-section'>
        <form className="row" onSubmit={onSubmit}>
            <div className="col">
                <div className="position-relative">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Type message here..."
                        className="form-control chat-input"
                        />
                </div>
            </div>
            <div className="col-auto">
                <button
                    type="submit"
                    className="btn btn-primary btn-rounded chat-send w-md"
                >
                    <span className="d-none d-sm-inline-block mr-2">Send</span>
                    <svg width={13} height={13} viewBox="0 0 24 24" tabIndex={-1}>
                    </svg>
                </button>
            </div>
        </form>
    </div>
);

export default TypingArea