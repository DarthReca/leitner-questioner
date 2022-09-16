// GLOBAL
let boxes = [];
let expectedBoxes = 1;
// FUNCTIONS
function ParseFiles(input, index) {
  let reader = new FileReader();
  reader.readAsText(input.files[0]);
  reader.onload = () => {
    boxes[index] = reader.result
      .trim()
      .split("\r\n")
      .map((x) => x.split(",", 2))
      .map((x) => ({
        question: x[0],
        answer: x.length == 2 ? x[1] : "",
      }));
    document.getElementById("cards").hidden = boxes.length !== expectedBoxes;
    document.getElementById("files").hidden = boxes.length === expectedBoxes;
  };
}

/**
 * Take a random question from a given box
 * @param {number} box
 */
function TakeQuestion(box) {
  // Select question
  let qa = boxes[box][getRandomInt(0, boxes[box].length)];
  // Set question and answer in UI
  let card = document.getElementById(`box${box + 1}-card`);
  card.getElementsByClassName("question")[0].innerHTML = qa.question;
  card.getElementsByClassName("answer")[0].innerHTML = qa.answer;
  // Activate buttons
  activateMoveButtons(card, true);
}

function ShowAnswer(box) {
  let card = document.getElementById(`box${box + 1}-card`);
  card.getElementsByClassName("answer")[0].hidden = false;
}

function activateMoveButtons(card, active) {
  Array.from(
    card.getElementsByClassName("move-buttons")[0].getElementsByClassName("btn")
  ).forEach((x) => (x.disabled = !active));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
