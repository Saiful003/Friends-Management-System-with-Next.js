function generateToken(length) {
  const enArr = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let newToken = [];
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * enArr.length);
    newToken.push(enArr[randomNumber]);
  }
  return newToken.join("").toLocaleLowerCase();
}

export default generateToken;
