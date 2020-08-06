// Shuffle algorithm is the Fisher-Yates: https://github.com/coolaj86/knuth-shuffle
export function shuffle(array: Array<any>): Array<any> {
  let currentIndex = array.length;
  let randomIndex: number;
  let tempValue: any;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    tempValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
  }

  return array;
}