export const color = (length=50) => {
    let arr = new Array();
    for(let i = 0; i < length; i++) {
        arr.push(`rgba(${i*8},${i*2+75},${i*0},0.8)`);
        // console.log(arr);
    }
    return arr;
}

export const options = {
    aspectRatio: 1.25,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
            color: 'white'
        }
      }
    },
  };

export const activeButton = "rounded-t-lg bg-green-500 p-2";
export const inActiveButton = "p-2 rounded-t-lg border-green-500 border";