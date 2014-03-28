/*jslint browser: true, devel: true */
//Problem! Den fastnar efter ett visst antal frågor i docs. Antar att det beror på att question-"fältet" är tomt i vissa objekt. Gäller att fixa det. Kanske ha en funktion som presenterar frågorna i textform och om de är tomma bara visar tomt? Eller ska man kolla vad det beror på först och försöka förhindra att de kommer in ö.h.t?
//Beror på att man måste skrolla igenom hela dokumentet innan den söker!!
//Detta kan göras automatiskt genom element.scrollTop = 1000;, vilket funkar på body normalt, men här behöver jag ha tag på diven kix-appview-editor (det är den som får ändrat värde på scrollTop när jag scrollar) - för att kunna ändra värdet manuellt!
//Men... jag kan inte få tag på diven, får "undefined" när jag köttar in: document.getElementsByClassName("kix-appview-editor"); ...
//..faaaast det får jag med "var htmlArray = document.getElementsByClassName('kix-lineview-content');" också, så det är inte något fel i sig! Najs.

//Okej, sidan kan scrolla, najs. Nu måste jag få resten av koden att vänta med att exekveras tills scroll-grejen är klar.

// ------- SCROLL THROUGH PAGE ------- \\
var numberScrolls = 1;
//var isScrolled = false;

function scroll() {
    var div = document.getElementsByClassName("kix-appview-editor");

    div[0].scrollTop += 1000;
    numberScrolls++;

    if(div[0].scrollHeight - div[0].scrollTop === div[0].clientHeight) {
        clearInterval(interval1);
        questionsAndOverlay();
    }
}


var interval1 = window.setInterval(scroll, 500);


// ------- QUESTION CONSTRUCTOR ------- \\

//Question-constructor with a question-string and answers-array
function Question(question, answers) {
    this.question = question;
    this.answers = [];
}

// ------- FIND QUESTIONS AND ANSWERS ------- \\
var questionArrayLength = 0;

function FindQAs() {
    //Finds all elements where the Q/A:s are in google docs,
    //saves in an array (list node..)
    var htmlArray = document.getElementsByClassName('kix-lineview-content');

    //Creates an array to save the question objects in
    var questionArray = [];

    //Extracts and saves the Q&A-strings into separate objects and saves
    //them in the question array
    for (var i = 0; i < htmlArray.length; i++) {
        if (htmlArray[i].style.marginLeft === "24px") {

            //Creates a question-object and adds the
            //question-string as an argument right away
            var question = new Question(htmlArray[i].innerText);

            //Loops through everything indented under the question (the answers)
            for (var j = i + 1; j < htmlArray.length; j++) {
                //Easier to keep offsetLeft instaed of marginLeft here
                if (htmlArray[j].offsetLeft > 33) {
                    //Saves the answer in the answers-array in the question-object
                    question.answers.push(htmlArray[j].innerText);

                }
                //If the next element offset is NOT greater than 33, break
                else {
                    break;
                }
            }

            //Saves the question-object in an array
            questionArray.push(question);
        }
    }

    questionArrayLength = questionArray.length;

    //Returns the Q&A-object array
    return questionArray;
}


// ------- OVERLAY ------- \\

//Har precis kopierat upp leftButton i AddOverlayfunktionen. Går nämligen inte att hitta en nyskapad div med getELementById i DOMen.. Så alla divisar måste finnas inuti den diven jag ska lägga till i dokumentet - nästad och klar!
//KOLLA HÄR: https://developer.mozilla.org/en-US/docs/Web/API/document.createElement

function AddOverlay() {
    //Creates the overlay-div
    var overlay = document.createElement("div");
    var questionText = document.createElement("div");
    var buttonLeft = document.createElement("input");
    var buttonRight = document.createElement("input");

    overlay.setAttribute("id", "overlay");
    questionText.setAttribute("id", "questionText");

    buttonLeft.setAttribute("id", "buttonLeft");
    buttonLeft.setAttribute("type", "button");
    buttonLeft.setAttribute("value", "<");
    buttonLeft.setAttribute("onclick", "previousQuestion()");

    buttonRight.setAttribute("id", "buttonRight");
    buttonRight.setAttribute("type", "button");
    buttonRight.setAttribute("value", ">");
    buttonRight.setAttribute("onclick", "nextQuestion()");

    var overlayStyleString = "color: red; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto; width: 80%; height: 80%; background-color: #000; opacity: .7; filter: alpha(opacity=70); z-index: 10000; overflow: hidden;";
    var questionTextStyleString = "color: white; position: absolute; top: 20px; bottom: 0; left: 0; right: 0; margin-left: auto; margin-right:auto; width: 90%; height: 60px; background-color: red; 1 z-index: 10000;";
    var buttonLeftStyleString = "position: absolute; top: 45%; bottom: 0; left: 10px; right: 0; width: 30px; height: 30px; background-color: blue;1 z-index: 10000;";
    var buttonRightStyleString = "position: absolute; top: 45%; bottom: 0; left: 90%; right: 0; width: 30px; height: 30px; background-color: blue;1 z-index: 10000;";

    //Sets the string as css for the buttonLeft-div
    overlay.style.cssText = overlayStyleString;
    questionText.style.cssText = questionTextStyleString;
    buttonLeft.style.cssText = buttonLeftStyleString;
    buttonRight.style.cssText = buttonRightStyleString;


    //Adds some text (later a question)
    questionText.textContent = "1. Fråga ett om jag får be!";


    overlay.appendChild(questionText);
    overlay.appendChild(buttonLeft);
    overlay.appendChild(buttonRight);


    //Inserts the overlay-div in the html body
    document.body.appendChild(overlay);
}
//var questionArray = [];
var currentQuestion = 0;

function previousQuestion() {
    if(currentQuestion > 0) {
        document.getElementById("questionText").textContent = questionArray[currentQuestion - 1].question;
        currentQuestion -= 1;
    }
    else
        console.log("Du är vid 0!");
}

function nextQuestion() {
    if(currentQuestion < questionArray.length - 1) {
        document.getElementById("questionText").textContent = questionArray[currentQuestion + 1].question;
        currentQuestion += 1;
    }
    else
        console.log("Du är vid max!");
}


function questionsAndOverlay() {
    var questionArray = FindQAs()
    AddOverlay();
    document.getElementById("questionText").innerText = CreateQAString(questionArray);

}



// ------- OVERLAY BUTTONS ------- \\




// ------- CREATE Q&A-STRING ------- \\

function CreateQAString(arrayIn) {
    //Declares a Q&A-string to put all
    var stringQA = "";

    //Loops through the array and saves each question
    //and its corresponding answers in the string
    for (var i = 0; i < arrayIn.length; i++) {
        stringQA += arrayIn[i].question + "\n";

        for (var j = 0; j < arrayIn[i].answers.length; j++) {
            stringQA += arrayIn[i].answers[j] + "\n";
        }
    }

    //Returns the string
    return stringQA;
}



// ------- DISPLAY Q&As IN OVERLAY ------- \\

//Kommenterar bort denna så länge. Verkar som att button-divarna inte vill synas när denna finns med.. Skumt.
//document.getElementById("questionText").innerText = questionArray[currentQuestion].question;




//output[1].innerHTML += '<div id="output"></div>';
/*document.getElementById("output").innerText += questionArray[0].question;
document.getElementById("output").innerText += questionArray[0].answers[0];
document.getElementById("output").innerText += "\n"; */
