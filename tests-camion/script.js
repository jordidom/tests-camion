let questions = [];
let currentTest = [];
let currentQuestionIndex = 0;
let score = 0;
let answers = {};

async function loadQuestions() {
    const response = await fetch('preguntas.json');
    questions = await response.json();
    const testSelect = document.getElementById('test');
    for (let i = 0; i < questions.length; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = `Test ${i + 1}`;
        testSelect.appendChild(option);
    }
}

function startTest() {
    let testIndex = document.getElementById('test').value;
    currentTest = questions[testIndex];
    currentQuestionIndex = 0;
    score = 0;
    answers = {};
    document.getElementById('test-selector').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    let questionData = currentTest[currentQuestionIndex];
    document.getElementById('question-text').textContent = questionData.question;
    let optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    questionData.options.forEach((option, index) => {
        let button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index, button);
        if (answers[currentQuestionIndex] !== undefined) {
            button.disabled = true;
            if (answers[currentQuestionIndex] === index) {
                button.classList.add(currentTest[currentQuestionIndex].correct === index ? 'correct' : 'incorrect');
            }
            if (index === currentTest[currentQuestionIndex].correct) {
                button.classList.add('correct');
            }
        }
        optionsContainer.appendChild(button);
    });
    updateNavigationButtons();
}

function checkAnswer(selectedIndex, selectedButton) {
    if (answers[currentQuestionIndex] !== undefined) return;

    answers[currentQuestionIndex] = selectedIndex;
    let correctIndex = currentTest[currentQuestionIndex].correct;
    let buttons = document.querySelectorAll('#options button');
    let questionButtons = document.querySelectorAll('#question-buttons button');
    
    // Disable all options after an answer is selected
    buttons.forEach(button => button.disabled = true);

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        questionButtons[currentQuestionIndex].classList.add('correct-number');
        score++;
    } else {
        selectedButton.classList.add('incorrect');
        buttons[correctIndex].classList.add('correct');
        questionButtons[currentQuestionIndex].classList.add('incorrect-number');
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResult();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function updateNavigationButtons() {
    let navContainer = document.getElementById('question-buttons');
    navContainer.innerHTML = '';
    for (let i = 0; i < currentTest.length; i++) {
        let btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.onclick = () => {
            currentQuestionIndex = i;
            loadQuestion();
        };
        if (answers[i] !== undefined) {
            btn.classList.add(answers[i] === currentTest[i].correct ? 'correct-number' : 'incorrect-number');
        }
        navContainer.appendChild(btn);
    }
}

function showResult() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('score').textContent = `Has acertado ${score} de ${currentTest.length} preguntas.`;
}

window.onload = loadQuestions;