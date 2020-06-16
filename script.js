var socket = io('http://localhost:3000');

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const newSessionBtn = document.getElementById('newSessionBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const modal = document.getElementById('modal');
const modalSubmit = document.getElementById('modalSubmit');
const inputField = document.getElementById('inputField');
const colorPicker = document.getElementById('colorPicker');
const defaultColor = colorPicker.defaultValue;


modalSubmit.onclick = function (e) {
    e.preventDefault();
    const name = inputField.value;
    const introContent = document.getElementById('introContent');
    let chosenColor = colorPicker.value;
    UserInfo.color = chosenColor;

    let newConnection = new UserInfo(`${name} connected`, chosenColor);
    newConnection.appendMessage();

    socket.emit('newConnection', { name, chosenColor });
    
    modal.style.display = 'none';
    chatForm.style.display = 'block';
    endSessionBtn.style.display = 'block';
    newSessionBtn.style.display = 'none';
    introContent.classList.remove('topMargin');  
};

socket.on('userConnected', data => {
    let newUserConnected = new UserInfo(`${data.name} connected`, `${data.color}`);
    newUserConnected.appendMessage();
    console.log(newUserConnected);
});
socket.on('userMessage', data => {
    let clientChat = new UserInfo(`${data.name}: ${data.message}`, `${data.color}`);
    clientChat.appendMessage();
    console.log(clientChat);
});
socket.on('userDisconnected', name => {
    let userLeft = new UserInfo(`${name} disconnected`, UserInfo.color);
    userLeft.appendMessage();
});

newSessionBtn.addEventListener('click', e => {
    e.preventDefault();
    modal.style.display = 'block';
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageVal = chatInput.value;
    let myColor = UserInfo.color;
    let myChat = new UserInfo(`You: ${messageVal}`, myColor);
    
    myChat.appendMessage();
    socket.emit('sendMessage', { messageVal, myColor });
    chatInput.value = '';
});

endSessionBtn.onclick = function(userName) {
    e.preventDefault();
    chatForm.style.display = 'none';
    socket.emit('disconnect', userName);
    introContent.classList.add('topMargin');
};
function UserInfo(message, color) {
    this.message = message;
    this.color = color;
    this.appendMessage = function() {
        const messageField = document.createElement('section');
        messageField.setAttribute('class', 'messageBlock');
        const messagesArea = document.getElementById('messagesArea');
        messageField.innerText = this.message;
        messageField.style.backgroundColor = this.color;
        messagesArea.append(messageField);
    };
}
