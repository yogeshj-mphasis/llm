const baseUrl = "http://127.0.0.1:5000/api/";

const sentimentMap = {

    "anger": `<i class="bi bi-emoji-angry-fill text-warning f-20 "></i>`,
    "disgust": `<i class="bi bi-emoji-astonished-fill text-warning f-20 "></i>`,
    "fear": `<i class="bi bi-emoji-tear-fill-fill text-warning f-20 "></i>`,
    "joy": `<i class="bi bi-emoji-smile-fill text-warning f-20 "></i>`,
    "neutral": `<i class="bi bi-emoji-neutral-fill text-warning f-20 "></i>`,
    "sadness": `<i class="bi bi-emoji-frown-fill text-warning f-20 "></i>`,
    "surprise": `<i class="bi bi-emoji-surprise-fill text-warning f-20 "></i>`,

}

function fetchMessages() {
    fetch(`${baseUrl}conversation/conversation`, {
        method: "GET",
        redirect: "follow"
    })
        .then((response) => response.text())
        .then((result) => {

            result = JSON.parse(result);
            let html = '';
            for (let item of result) {
                html += `
            <li class="${item.from === 'user' ? 'sender' : 'repaly'}">
                <p> ${item.message} </p>
                <span class="time">${new Date(item.time).toLocaleString()}</span>
            </li>
            `;
            }
            const div = document.getElementById('msg-body');
            div.innerHTML = html;


        })
        .catch((error) => console.error(error));
}

function sendAgantMessage() {

    const message = document.getElementById('agent_message').value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "message": message
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(`${baseUrl}conversation/agent_message`, requestOptions)
        .then((response) => response.text())
        .then(() => fetchMessages())
        .catch((error) => console.error(error));
}
function fetchSentiment() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`${baseUrl}sentiment/sentiment`, requestOptions)
        .then((response) => response.text())
        .then((result) => {

            result = JSON.parse(result);
            console.log(result)

            console.log(sentimentMap[result])


            let html = sentimentMap[result] + `<span class="text-muted ms-2 f-20">${result} </span>`;

            const div = document.getElementById('sentiment');
            div.innerHTML = html;

        })
        .catch((error) => console.error(error));
}

function fetchSummary() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`${baseUrl}summary/generate_summary`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result);
            const div = document.getElementById('summary');
            div.innerHTML = result.summary;
            //getNextAction(result.summary);
        })
        .catch((error) => console.error(error));
}

function fetchSuggetion() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`${baseUrl}next_sentence/next_sentence`, requestOptions)
        .then((response) => response.text())
        .then((result) => {

            let html = '';
            html += `
                <div class="alert alert-secondary" role="alert">
                            ${result}
                </div>
                `;
            const div = document.getElementById('suggestion');
            div.innerHTML = html;
        })
        .catch((error) => console.error(error));


}
function clearMessages() {
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch(`${baseUrl}/conversation/clear_conversation`, requestOptions)
        .then(response => response.text())
        .then(result => fetchMessages())
        .catch(error => console.log('error', error));
}

function getNextAction(summary) {


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "summary": summary
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(`${baseUrl}/conversation/next_best_action`, requestOptions)
        .then((response) => response.text())
        .then((result) => {

            result = JSON.parse(result);

            let html = '';
            html += `
                <div class="alert alert-secondary" role="alert">
                            ${result.action}
                </div>
                `;
            const div = document.getElementById('next_best_action');
            div.innerHTML = html;


        })
        .catch((error) => console.error(error));

}


fetchMessages();


const sendButton = document.getElementById('send_button');
sendButton.addEventListener("click", sendAgantMessage);

const clearBtn = document.getElementById('clear_btn');
clearBtn.addEventListener("click", clearMessages);


setInterval(fetchMessages, 6000);
setInterval(fetchSentiment, 10000);

const fetchSummaryBtn = document.getElementById('fetchSummary');
fetchSummaryBtn.addEventListener("click", fetchSummary);

const fetchPredicationBtn = document.getElementById('fetchPredication');
fetchPredicationBtn.addEventListener("click", fetchSuggetion);





