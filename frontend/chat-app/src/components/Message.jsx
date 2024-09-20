function Message({ user, message }) {
    return (
      <div>
        <strong>{user}</strong>: {message}
      </div>
    );
  }
  
  export default Message;
  