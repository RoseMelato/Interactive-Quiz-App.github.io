const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById("answer-buttons");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");
const timerElement = document.getElementById("timer");  
const questionNumberEl = document.getElementById("question-number");

let shuffledQuestions, currentQuestionIndex, score;
let timeLeft=10;
let timer;

// Quiz questions
const questions = [
{
question: "What does HTML stand for?",
answers: [
{ text: "HyperTransfer Markup language", correct: false },
{ text: "HyperText Markup Language", correct: true },
{ text: "HighText Machine Language", correct: false },
{ text: "HyperText Markdown Language", correct: false }
]
},
{
question: "Which technology is primarily responsible for the styling of web pages?",
answers: [
{ text: "JavaScript", correct: false },
{ text: "HTML", correct: false },
{ text: "CSS", correct: true },
{ text: "Python", correct: false }
]
},
{   question: "Which part of web development is responsible for handilng data, storage and retrieval?",
answers: [
{ text: "Front-End development", correct: false },
{ text: "Back-End development", correct: true },
{ text: "Full-stack development", correct: false },
{ text: "Middleware development", correct: false }
]
},
{
question: "What does CSS stand for?",
answers: [
{ text: "Creative style sheets", correct: false },
{ text: "Computer Style Sheets", correct: false },
{ text: "Cascading style Sheets", correct: true },
{ text: "Custom Style sheets", correct: false }
]
}
];


startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
});

restartButton.addEventListener("click", startGame);

function startGame() {
    startButton.classList.add("hide");
    scoreContainer.classList.add("hide");
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
}

function setNextQuestion() {
    clearInterval(timer);
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    questionNumberEl.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`
}

function showQuestion(question) {
    startTimer();
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    startTimer();
    nextButton.classList.add("hide");
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function startTimer(){
    clearInterval(timer);
    timeLeft = 10;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <=0){
            clearInterval(timer);
            handleTimeUp();
            if(answerSelected){
                setNextQuestion();
            }
        }
    },1000)
}


function handleTimeUp() {
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct) {
            setStatusClass(button, true);
        }
        button.disabled = true;
    });
if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        showScore();
    }
}

function updateQuestionProgress() {
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    totalQuestionsElement.textContent = questions.length;
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    if (correct) score++;

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("hide");
    } else {
        showScore();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add("correct");
    } else {
        element.classList.add("wrong");
    }
}

function clearStatusClass(element) {
    element.classList.remove("correct");
    element.classList.remove("wrong");
}

function showScore() {
    questionContainerElement.classList.add("hide");
    scoreContainer.classList.remove("hide");
    scoreElement.innerText = `${score} out of ${questions.length}`;
    clearInterval(timer);
}