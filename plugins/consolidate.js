export default ({ app }, inject) => {
  inject("consolidate", (arr) => consolidate(arr));
};

const consolidate = (arr) => {
  //getting [[1,2],[3,4]] and return [4,6]
  const tot = []; //total
  const months = arr[0].length; //24 month
  for (let i = 0; i < months; i++) {
    const sumOfMonth = arr.reduce((acc, r) => (acc += parseFloat(r[i])), 0);
    const rounded = Math.round(sumOfMonth * 10) / 10;
    tot.push(rounded);
  }
  return tot;
};
