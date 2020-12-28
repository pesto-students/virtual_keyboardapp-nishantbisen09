const keyboardContainer = document.getElementById("keyboardContainer");
const inputTextField = document.getElementById("inputTextField");
let isShiftModeEnabled = false;

const addEventListners = () => {
  const keys = document.getElementsByName("key");
  keys.forEach((key) => key.addEventListener("click", onKeyClick));
};

const onKeyClick = (event) => {
  const value = event.target.value;
  const { Shift, Cancel, Clear, Enter } = ACTION_KEYS;
  switch (value) {
    case Shift:
      toggleShift();
      createKeyboard();
      break;
    case Clear:
      clearInput();
      break;
    case Enter:
      return;
    case Cancel:
      return;
    default:
      changeInput(value);
      break;
  }
  addEventListners();
};

const clearInput = () => {
  inputTextField.value = "";
  inputTextField.focus();
};

const toggleShift = () => (isShiftModeEnabled = !isShiftModeEnabled);

const changeInput = (value) => {
  let currentCursorPosition = inputTextField.selectionStart;
  inputTextField.value = getInputValueByCursorPosition(
    value,
    currentCursorPosition
  );
  currentCursorPosition =
    value === ACTION_KEYS.Backspace
      ? currentCursorPosition - 1
      : currentCursorPosition + 1;
  setCursorPosition(currentCursorPosition);
};

const setCursorPosition = (currentCursorPosition) => {
  inputTextField.focus();
  inputTextField.setSelectionRange(
    currentCursorPosition,
    currentCursorPosition
  );
};

const getInputValueByCursorPosition = (value, currentCursorPosition) => {
  let firstHalf = getFirstHalf(currentCursorPosition, value);
  const secondHalf = inputTextField.value.substr(currentCursorPosition);
  return firstHalf + getValueByLabel(value) + secondHalf;
};

const getFirstHalf = (currentCursorPosition, value) => {
  let firstHalf = inputTextField.value.substr(0, currentCursorPosition);
  if (value === ACTION_KEYS.Backspace) {
    firstHalf = firstHalf.substr(0, firstHalf.length - 1);
  }
  return firstHalf;
};

const getValueByLabel = (label) => {
  return label === ACTION_KEYS.Space || label === ACTION_KEYS.Backspace
    ? " "
    : label;
};

const createKeyboard = () => {
  keyboardContainer.innerHTML = getKeyboard();
};

const getKeyboard = () => {
  const firstRow = getRow(KEYS.firstRow);
  const secondRow = getRow(KEYS.secondRow);
  const thirdRow = getRow(KEYS.thirdRow);
  const fourthRow = getRow(KEYS.fourthRow);
  const fifthRow = getRow(KEYS.fifthRow);
  return firstRow + secondRow + thirdRow + fourthRow + fifthRow;
};

const getRow = (row) => {
  return `<div class="keys-row">
    ${row
      .map(({ label, shiftLabel }) => {
        return `<button class="key col-span-${getColSpanValue(label)} ${
          label === "Shift" && isShiftModeEnabled ? "active" : "not-active"
        }" name=key value="${isShiftModeEnabled ? shiftLabel : label}">${
          isShiftModeEnabled ? shiftLabel : label
        }</button>`;
      })
      .join("")}
    </div>`;
};

const getColSpanValue = (label) => {
  const { Shift, Cancel, Clear, Enter, Space, Backspace } = ACTION_KEYS;
  if (label === Shift) return 2;
  if (label === Space) return 6;
  if (
    label === Enter ||
    label === Backspace ||
    label === Clear ||
    label === Cancel
  )
    return 3;
  return 0;
};

createKeyboard();
addEventListners();
