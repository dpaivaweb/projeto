// Aqui esta nossas variaveis e suas identificações / 
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
const hintText = document.querySelector(".hint-text b");

/*let currentWord;
let correctLetters = [];
let wrongGuessCount;
const maxGuesses = 6;*/

// Palavra atual, letras corretas e contagem de palpites errados; const maxGuesses = 6; Máximo de tentativas incorretas permitidas/
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

/* A função resetGame reinicia o estado do jogo da forca ao limpar as letras corretas, zerar os palpites errados, 
resetar a imagem do enforcado para o estado inicial e atualizar o texto que mostra os palpites errados atuais em relação ao máximo permitido. */
const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "./assets/image/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    /* Atribui ao innerHTML de wordDisplay uma string gerada ao dividir a palavra atual em caracteres,
    mapeando cada letra para um elemento <li> com classe 'letter' ou 'space' se for espaço, e juntando tudo em uma única string para exibir na tela. */
    wordDisplay.innerHTML = currentWord.split("").map(letter => {
        if (letter === " ") {
            return `<li class="letter space"> </li>`;
        } else {
            return `<li class="letter"></li>`;
        }
    }).join("");

    // Habilita todos os botões do teclado, removendo a desativação, e remove a classe 'show' do modal do jogo para escondê-lo.
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

// Aqui trabalhando a const "getRandomWord" que usa a word list para gerar uma pergunta aleatória para o jogo da forca.
const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word.toUpperCase();
    hintText.innerText = hint;
    resetGame();
}

// Define a mensagem do modal de game over com base na vitória ou derrota do jogador
const gameOver = (isVictory) => {
    const modalText = isVictory ? `Você encontrou a palavra:` : 'A palavra correta era:';

    /* Atualiza a imagem do modal com uma gif de vitória ou derrota, dependendo do resultado, define o título como 'Parabéns!' ou 'Fim de Jogo!', 
    exibe a mensagem com a palavra atual em negrito e mostra o modal adicionando a classe 'show'. */
    gameModal.querySelector("img").src = `./assets/image/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Parabéns!' : 'Fim de Jogo!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

//
const initGame = (button, clickedLetter) => {
    const upperClickedLetter = clickedLetter.toUpperCase();
    button.disabled = true;

    /* Verifica se a letra clicada está na palavra, revelando todas as ocorrências e marcando-as como adivinhadas; caso contrário,
    incrementa o erro e atualiza a imagem do enforcado, além de exibir a quantidade de tentativas.*/
    if (currentWord.includes(upperClickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === upperClickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `./assets/image/hangman-${wrongGuessCount}.svg`;
    }
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    /* Verifica se o número de erros atingiu o limite máximo para acabar o jogo com derrota; 
    também verifica se todas as letras foram adivinhadas para vencer, chamando gameOver com o resultado correspondente. */
    if (wrongGuessCount === maxGuesses) return gameOver(false); // Se atingiu o máximo de erros, chama gameOver com false (derrota).
    const totalLetters = [...currentWord].filter(l => l !== " ").length;
    if (wordDisplay.querySelectorAll(".guessed").length === totalLetters) return gameOver(true);
}

// Cria botões para as letras de A a Z, adiciona ao teclado e atribui evento de clique que inicia o jogo com a letra selecionada.
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i).toUpperCase();
    button.innerText = letter;
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, letter));
}

// Seleciona uma palavra aleatória para o jogo e adiciona evento ao botão para reiniciar o jogo com uma nova palavra ao ser clicado.
getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);