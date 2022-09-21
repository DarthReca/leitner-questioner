// GLOBAL
let boxes = [];
let currentQuestion = [];
let expectedBoxes = 3;

// PROTOTYPES
const htmlFile = (i) =>
  `<div class='col gx-5 input-group'> \
  <label class='input-group-text' for='box${i}'>Box${i}</label> \
  <input class='form-control' type='file' id='box1' onchange='ParseFiles(this, ${i})' accept='.csv'/>\
  </div>`;

const htmlCard = (i) =>
  `<div class="col card text-center" id="box${i}-card">
<div class="card-header">Box ${i}</div>
<div class="card-body">
  <p class="card-text question">Question</p>
  <p class="card-text answer" hidden>Answer</p>
  <div class="move-buttons">
    <button
      class="col btn btn-success"
      onclick="MoveToBox(${i}, 1)"
      disabled
    >
      Correct
    </button>
    <button
      class="col btn btn-danger"
      onclick="MoveToBox(${i}, -1)"
      disabled
    >
      Wrong
    </button>
  </div>
</div>
<div class="card-footer">
  <button class="btn btn-primary" onclick="TakeQuestion(${i})">
    New question
  </button>
  <button class="btn btn-primary" onclick="ShowAnswer(${i})">
    Show answer
  </button>
</div>
</div> `;

// FUNCTIONS
function MakeFilesUI() {
  document.getElementById("files").innerHTML = Array.from(
    { length: expectedBoxes },
    (v, k) => htmlFile(k)
  ).join("");
}

function ParseFiles(input, index) {
  let reader = new FileReader();
  reader.readAsText(input.files[0]);
  reader.onload = () => {
    boxes[index] = reader.result
      .trim()
      .replaceAll("\r", "")
      .split("\n")
      .filter((x) => x.length > 0)
      .map((x) => x.split(",", 2))
      .map((x) => ({
        question: x[0],
        answer: x.length == 2 ? x[1] : "",
      }));
    currentQuestion[index] = -1;
    let cards = document.getElementById("cards");
    let ready = boxes.length === expectedBoxes;
    cards.hidden = !ready;
    document.getElementById("files").hidden = ready;
    document.getElementById("warning").hidden = ready;
    document.getElementById("save-area").hidden = !ready;
    cards.innerHTML += htmlCard(boxes.length - 1);
  };
}

/**
 * Take a random question from a given box
 * @param {number} box
 */
function TakeQuestion(box) {
  // Get UI elements
  let card = document.getElementById(`box${box}-card`);
  let question = card.getElementsByClassName("question")[0];
  let answer = card.getElementsByClassName("answer")[0];
  if (boxes[box].length == 0) {
    question.innerHTML = "Box empty";
    answer.hidden = true;
    return;
  }
  // Select question
  currentQuestion[box] = getRandomInt(0, boxes[box].length);
  let qa = boxes[box][currentQuestion[box]];
  // Set question and answer in UI
  question.innerHTML = qa.question;
  answer.innerHTML = qa.answer ? qa.answer : "No Answer";
  answer.hidden = true;
  // Activate buttons
  activateMoveButtons(card, true);
}

function ShowAnswer(box) {
  let card = document.getElementById(`box${box}-card`);
  card.getElementsByClassName("answer")[0].hidden = false;
}

function MoveToBox(box, amount) {
  let toMove = boxes[box].splice(currentQuestion[box], 1);
  boxes[clamp(box + amount, 0, boxes.length - 1)].push(...toMove);
  activateMoveButtons(document.getElementById(`box${box}-card`), false);
}

function SaveFiles() {
  // Map each box to a files in csv format
  let files = boxes.map(
    (x) =>
      new Blob(
        x.map((y) => y.question + "," + y.answer + "\r\n"),
        { type: "text/plain" }
      )
  );
  let buttons = boxes.map((x) => document.createElement("a"));
  buttons.forEach((x, i) => {
    x.href = URL.createObjectURL(files[i]);
    x.download = `box${i}.csv`;
    x.click();
    setTimeout(() => window.URL.revokeObjectURL(x.href), 0);
  });
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

function clamp(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
}
