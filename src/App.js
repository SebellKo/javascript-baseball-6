import { Console, Random } from "@woowacourse/mission-utils";

class App {
  async play() {
    await playBaseBall();
  }
}

const playBaseBall = async () => {
  let randomNumber = makeRandomNumber();
  let isEnd = false;

  Console.print("숫자 야구 게임을 시작합니다.");
  while (!isEnd) {
    const userInput = await Console.readLineAsync("숫자를 입력해주세요 : ");
    const inputIsValid = checkInputIsValid(userInput);
    if (inputIsValid) {
      const scoreBoard = calculateScore(userInput, randomNumber);
      if (scoreBoard.strike === 3) {
        const keepOrEndInput = await getUserInputForGameSet(scoreBoard);
        isEnd = checkGameIsEnd(keepOrEndInput);
        if (!isEnd && !isEnd.isError) {
          randomNumber = makeRandomNumber();
        } else if (isEnd.isError) {
          throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
        }
      } else {
        Console.print(printScore(scoreBoard));
      }
    } else if (!inputIsValid) {
      throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
    }
  }
};

const getUserInputForGameSet = async (scoreBoard) => {
  Console.print(printScore(scoreBoard));
  Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료.");
  Console.print("게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.");

  return await Console.readLineAsync("");
};

const makeRandomNumber = () => {
  const randomNumber = [];
  while (randomNumber.length < 3) {
    let number = Random.pickNumberInRange(1, 9);
    if (!randomNumber.includes(number)) {
      randomNumber.push(number);
    }
  }

  return randomNumber;
};

const checkInputIsValid = (userInput) => {
  const input = [...userInput]
    .sort()
    .reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), []);

  return input.length === 3 ? true : false;
};

const calculateScore = (userInput, randomNumber) => {
  const input = [...userInput].map((number) => +number);
  const socreBoard = { strike: 0, ball: 0 };

  randomNumber.forEach((number, randomIndex) => {
    const userInputIndex = input.findIndex((inputNum) => {
      return inputNum === number;
    });

    if (userInputIndex === randomIndex) {
      socreBoard.strike += 1;
    } else if (userInputIndex != -1) {
      socreBoard.ball += 1;
    }

    return;
  });

  return socreBoard;
};

const printScore = (scoreBoard) => {
  let returnString = "낫싱";
  if (scoreBoard.strike != 0 || scoreBoard.ball != 0) {
    returnString = `${scoreBoard.ball === 0 ? "" : scoreBoard.ball + "볼"} ${
      scoreBoard.strike === 0 ? "" : scoreBoard.strike + "스트라이크"
    }`.trim();
  }
  return returnString;
};

const checkGameIsEnd = (userInput) => {
  if (userInput === "1") {
    return false;
  } else if (userInput === "2") {
    return true;
  }
  return { isError: true };
};

const app = new App();
app.play();

export default App;
