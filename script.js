

const imgEl = document.querySelector("#quiz-img");
const btnGuess = document.querySelector(".btnguess");
const btnReset = document.querySelector("#reset");
const divBtnEl = document.querySelector("#btn-group");
const scoreBoardEl = document.querySelector("#score-board");
const startPopupEl = document.querySelector("#popup");
const gameRoomEl = document.querySelector("#game-room");
const divResultEl= document.querySelector("#result");


let state = {
	remainingStudents: students,			// jämförs med guessuedStudents innan svarsalternativ hämtas
	correctStudent: null,                   // = rätt svar
	isCorrectGuess: null,                   // true/false = färgar vald knapp?
    correctGuesses: 0,						// ökar varje gång isCorrectGuess = true
	guessedStudents: [],					// till denna pushas rätt svar efter varje runda		
	roundLengthLimit: students.length,		// kan ändras till 8 eller 16 vid spelstart
	roundCounter: 0							// räknar varje runda, avbryt spelet när den når roundLengthLimit
}


let highScore = -1;

// Clonar en "back up" på state-objekt för att kunna "nollställa" det mellan spelrundor 
let stateReset = structuredClone(state);


// Funktion för att shuffla arrayer (hoppas vi fick använda denna?)
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

// Funktion för att rendera varje spelrunda
const renderGame = () => {
	// "Nollställer" isCorrectGuess om värde är true/false sedan tidigare gissning
    state.isCorrectGuess = null;

	// "Shufflar" remainingStudents för att garantera slumpmässighet i spelet
    shuffleArray(state.remainingStudents);

	// Letar fram det första objektet i remainingStudent som *inte* också finns i guessedStudents - motverkar upprepning av correctStudent
    state.correctStudent = state.remainingStudents.find(student => 
        !state.guessedStudents.some(guessed => guessed.name === student.name)
    );

	// Filtrerar ut tre students som inte är "correctStudent" för att generera svarsalternativ
    let fantasticFour = state.remainingStudents
        .filter(student => student.name !== state.correctStudent.name)
        .slice(0, 3);

	// Pushar in correctStudent bland svarsalternativen
    fantasticFour.push(state.correctStudent);

	// "Shufflar" svarsalternativen
    shuffleArray(fantasticFour);

	// Laddar upp bild på correctStudent
    imgEl.setAttribute("src", state.correctStudent.image);

	// Mappar över svarsalternativ och konverterar dem till knappar i DOM
    divBtnEl.innerHTML = fantasticFour
        .map(student => `
            <button type="button" id="${student.id}" class="btn btn-info btn-lg btnguess">
                ${student.name}
            </button>
        `)
        .join("");
};

// Funktion körs vid varje gissning, ökar spelrunda/rätt gissade svar och ger feedback till spelare
const onGuess = (name, clickedButton) => {

	// Ökar roundCounter med ett för varje gissning som sker
	state.roundCounter++

	// Avgör om gissning är correctStudent eller inte
	if (name === state.correctStudent.name) {
		state.isCorrectGuess = true
		state.correctGuesses++;
		scoreKeeper();
	} else {
        state.isCorrectGuess = false 
	}
	
	// Pushar correctStudent till guessedStudents
	state.guessedStudents.push(state.correctStudent);
	
	// Genererar feedback om rätt/fel svar till användare
    if (state.isCorrectGuess === true) {

		// Om svar är rätt färgas tryckt knapp grön
        clickedButton.setAttribute("class", "btn btn-success btn-lg btnguess");

    } else {
		// Om svar är fel färgas tryckt knapp röd
        clickedButton.setAttribute("class", "btn btn-danger btn-lg btnguess");

		// ... och rätt svar letas upp för att färgas grön
		const correctButton = Array.from(divBtnEl.querySelectorAll(".btnguess")).find(
			button => button.innerText === state.correctStudent.name
		  );
		  
		correctButton.setAttribute("class", "btn btn-success btn-lg btnguess");
		
    }

	// Slutligen jämförs antal spelade rundor med spelets längd + avslutar spel *om* längden är nådd
	if (state.roundCounter === state.roundLengthLimit) {
		setTimeout(() => {
			gameOver();
		}, 700);
	}

	// Kallar på att rendera ny spelrunda efter 0.7 sekunder för att låta spelare hinna uppfatta feedback på gissning
    setTimeout(() => {
        renderGame();
    }, 700);


}

// Körs om spellängd är uppnådd
const gameOver = () => {


	// Gömmer spel-yta och visar resultat i pop-up
	gameRoomEl.classList.add("hide");
	divResultEl.classList.remove("hide");


	// Jämför om spelare uppnått ny high score sedan tidigare runda eller inte och ger feedback
	if (state.correctGuesses > highScore) {

		highScore = state.correctGuesses;

		divResultEl.querySelector("img").
		setAttribute("src", "assets/images/game-over/congratz.gif");

		divResultEl.querySelector("p").
		innerText = `You set a new HIGH SCORE of ${state.correctGuesses}!`; 

	} else {

		divResultEl.querySelector("img").
		setAttribute("src", "assets/images/game-over/defeat.gif");

		divResultEl.querySelector("p").
		innerHTML = `<p id="congratz" class="card-text h3 py-3">
		Bummer! You got ${state.correctGuesses} right... </br>
		Try again to you beat the high score of ${highScore}.</p>`

	}
}

// Renderar värden från state-objekt till spelare
const scoreKeeper = () => {
	scoreBoardEl.innerText = `Score: ${state.correctGuesses} / ${state.roundLengthLimit}`;
}

// "Nollställer" state-objekt
const newGame = () => {
	state = structuredClone(stateReset);
}

// Lyssnar efter click på svarsalternativ
divBtnEl.addEventListener("click", (e) => {
    if (e.target.tagName ===  "BUTTON") {

		// Inaktiverar knappar efter click för att motverka fusk (button.disabled = false är ej nödvändigt då knapparna renderas på nytt varje runda)
		Array.from(divBtnEl.children).forEach(button => {
            button.disabled = true;
        });

		// Kallar på onGuess och skickar in vilken knapp som tryckts samt dess "namn" som argument
        onGuess(e.target.innerText, e.target);
    }
}); 

// Lyssnar efter click i "start-popupen", möjliggör för spelare att välja längd på spel
startPopupEl.addEventListener("click", (e) => {

	// Om spelare väljer "8" eller "16" sätts detta som spelets längd
	if (e.target.tagName === "BUTTON" && e.target.innerText === "8" || e.target.innerText === "16") {

		state.roundLengthLimit = Number(e.target.innerText); 
		
		// Göm popup och visa knappar med svarsalternativ
		startPopupEl.classList.add("hide");
		gameRoomEl.querySelector("#btn-group").classList.remove("hide");

		// Annars behålls listans längd som spelets längd (originalvärde i state-objektet)
		} else if (e.target.tagName === "BUTTON") {

		// Göm popup och visa knappar med svarsalternativ (igen! förlåt...)
		startPopupEl.classList.add("hide");
		gameRoomEl.querySelector("#btn-group").classList.remove("hide");

	}

	scoreKeeper();
});


// Lyssnar efter click i "resultat pop-up"
divResultEl.addEventListener("click", (e) => {

	// Om knapp lyder "Play again"
	if (e.target.innerText === "Play Again?") {

		// Nollställ state-objekt för ny spelrunda
		newGame();				

		// Rendera ny spelrunda
		renderGame();			

		// Gömmer "resultat pop-up" och visar "start pop-up"
		divResultEl.classList.add("hide");
		startPopupEl.classList.remove("hide");

		// Visar spelyta, gömmer knappar med svarsalternativ och tömmer "Scoreboard" från tidigare rundas poäng
		gameRoomEl.classList.remove("hide");
		gameRoomEl.querySelector("#btn-group").classList.add("hide");
		scoreBoardEl.innerText = "";

	// Om knapp lyder "I'm Done" = Hej då!
	} else if (e.target.innerText === "I'm Done") {

		divResultEl.querySelector("img").
		setAttribute("src", "assets/images/game-over/next-time.gif");
		setTimeout(() => {
			window.location.href = "https://www.merriam-webster.com/dictionary/quitter";
		}, 2500);
	}
});


// Renderar spelrunda en första gång
renderGame();


