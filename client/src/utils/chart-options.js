export const genreColor = (length=50) => {
  let arr = [];
  for(let i = 0; i < length; i++) {
      arr.push(`rgba(${i*8},${i*2+75},${i*0},0.8)`);
  }
  return arr;
}

export const popColor = (length=11) => {
  let arr = [];
  for(let i = 0; i < length; i++) {
      arr.push(`rgba(${i*15+85},${i*10+105},${i*5+170},0.8)`);
  }
  return arr.reverse();
}

export const audioColor = (length=11) => {
  let arr = [];
  for(let i = 0; i < length; i++) {
      arr.push(`rgba(${i*15+85},${i*10+105},${i*5+170},0.8)`);
  }
  return arr.reverse();
}

export const genreOptions = {
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


export const popOptions = {
  aspectRatio: 1.25,
  plugins: {
    legend: {
      display: false
    },
  },
  scales: {
    x: {
      offset:false,
        grid: {
          offset: true
        }
    }
  }
};

export const audioOptions = {
  aspectRatio: 1.25,
  plugins: {
    legend: {
      display: false
    },
    customCanvasBackgroundColor: {
      coloer: 'lightGreen'
    }
  },
  scales: {
    r: {
        backgroundColor:'black',
        angleLines: {
          display: true,
          color: 'white'
        },
        grid: {
          color: 'white'
        },
        suggestedMin: 0,
        suggestedMax: 1,
        pointLabels: {
          color: 'white',
        },
        ticks: {
          stepSize: 0.1,
          display: false,
        }
    }
  },
  
};

export const activeButton = "text-xs md:text-base rounded-t-lg bg-green-500 p-1 md:p-2";
export const inActiveButton = "text-xs md:text-base p-1 md:p-2 rounded-t-lg border-green-500 border";