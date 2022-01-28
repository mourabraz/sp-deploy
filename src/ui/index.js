import boxen from "boxen";

// https://stackoverflow.com/questions/34848505/how-to-make-a-loading-animation-in-console-application-written-in-javascript-or
const P = ["\\", "|", "/", "-"];

export const twirlTimer = () => {
  let x = 0;
  const intervalId = setInterval(function() {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);

  return () => {
    process.stdout.write("...\n");
    clearInterval(intervalId);
  };
};

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "white",
  // backgroundColor: "#555555"
 };

export const showInBox = (message) => {
  console.log(boxen(message, boxenOptions));
}