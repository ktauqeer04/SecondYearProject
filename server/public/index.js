// const chatLog = document.getElementById('chat-log'),
//     userInput = document.getElementById('user-input'),
//     sendButton = document.getElementById('send-button'),
//     buttonIcon = document.getElementById('button-icon'),
//     info = document.querySelector('.info');

// sendButton.addEventListener('click', sendMessage);
// userInput.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//         sendMessage();
//     }
// });

// function sendMessage() {
//     const message = userInput.value.trim();
//     // if message = empty do nothing
//     if (message === '') {
//         return;
//     }
//     // if message = developer - show our message
//     else if (message === 'developer') {
//         // clear input value
//         userInput.value = '';
//         // append message as user - we will code it's function
//         appendMessage('user', message);
//         // sets a fake timeout that showing loading on send button
//         setTimeout(() => {
//             // send our message as bot(sender : bot)
//             appendMessage('bot', 'This Source Coded By Reza Mehdikhanlou \nYoutube : @AsmrProg');
//             // change button icon to default
//             buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
//             buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
//         }, 2000);
//         return;
//     }

//     // else if none of above
//     // appends users message to screen
//     appendMessage('user', message);
//     userInput.value = '';

//     const options = {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '665f29af18msh3026265a8df41d2p10f798jsna9c588beba73',
//             'X-RapidAPI-Host': 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com'
//             // if you want use official api
//             /*
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': 'Your Key',
//             'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
//             */
//         },
//         body: JSON.stringify({ query: message })
//         // body: `{query:${message}"}`
//         // if you want use official api you need have this body
//         // `{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"${message}"}]}`
//     };
//     // official api : 'https://openai80.p.rapidapi.com/chat/completions';
//     fetch('https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask', options).then((response) => response.json()).then((response) => {
//         appendMessage('bot', response.choices[0].message.content);

//         buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
//         buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
//     }).catch((err) => {
//         if (err.name === 'TypeError') {
//             appendMessage('bot', 'Error : Check Your Api Key!');
//             buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
//             buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
//         }
//     });
// }

// function appendMessage(sender, message) {
//     info.style.display = "none";
//     // change send button icon to loading using fontawesome
//     buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
//     buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

//     const messageElement = document.createElement('div');
//     const iconElement = document.createElement('div');
//     const chatElement = document.createElement('div');
//     const icon = document.createElement('i');

//     chatElement.classList.add("chat-box");
//     iconElement.classList.add("icon");
//     messageElement.classList.add(sender);
//     messageElement.innerText = message;

//     // add icons depending on who send message bot or user
//     if (sender === 'user') {
//         icon.classList.add('fa-regular', 'fa-user');
//         iconElement.setAttribute('id', 'user-icon');
//     } else {
//         icon.classList.add('fa-solid', 'fa-robot');
//         iconElement.setAttribute('id', 'bot-icon');
//     }

//     iconElement.appendChild(icon);
//     chatElement.appendChild(iconElement);
//     chatElement.appendChild(messageElement);
//     chatLog.appendChild(chatElement);
//     chatLog.scrollTo = chatLog.scrollHeight;

// }






const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');
const info = document.querySelector('.info');

// Event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') {
        return; // Do nothing for empty messages
    }

    // Clear the user input
    userInput.value = '';

    // Append the user's message
    appendMessage('user', message);

    // Set loading state
    setButtonLoading(true);

    // Prepare the request to the chatbot API
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '665f29af18msh3026265a8df41d2p10f798jsna9c588beba73', // Replace with your API key
            'X-RapidAPI-Host': 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com'
        },
        body: JSON.stringify({ query: message })
    };

    // Make the API request
    fetch('https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask', requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            // Extract the response from the API
            const botResponse = data.response;

            // Append the bot's response
            appendMessage('bot', botResponse);

            // Clear loading state
            setButtonLoading(false);
        })
        .catch((err) => {
            // Handle errors, e.g., network errors or API key issues
            appendMessage('bot', `Error: ${err.message}`);
            setButtonLoading(false);
        });
}

function setButtonLoading(loading) {
    if (loading) {
        buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');
    } else {
        buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
    }
}

function appendMessage(sender, message) {
    info.style.display = "none";

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}
