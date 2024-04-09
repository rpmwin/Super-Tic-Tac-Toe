import React, { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [counter, setCounter] = useState(0);
  const [gridData, setGridData] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')),
  );

  const [winnersArray, setWinnersArray] = useState(Array(9).fill(''));

  const [gridRow, setGridRow] = useState(0);

  const [player, setPlayer] = useState('X');

  const [playableBoxes, setPlayableBoxes] = useState([4]);
  const [Winner , setWinner] = useState(false)

  const notify = (info) => toast.success(info);

  const [Players, setPlayers] = useState({
    X: '',
    O: '',
  });

  const checkWinningConditions = (row, player) => {
    console.log('Checking row:', row);
    const isWinner =
      (row[0] === player && row[1] === player && row[2] === player) ||
      (row[3] === player && row[4] === player && row[5] === player) ||
      (row[6] === player && row[7] === player && row[8] === player) ||
      (row[0] === player && row[3] === player && row[6] === player) ||
      (row[1] === player && row[4] === player && row[7] === player) ||
      (row[2] === player && row[5] === player && row[8] === player) ||
      (row[0] === player && row[4] === player && row[8] === player) ||
      (row[2] === player && row[4] === player && row[6] === player);

    console.log('isWinner:', isWinner);
    return isWinner;
  };
  useEffect(() => {
    let dummy = [...winnersArray];

    if (
      dummy[gridRow] === '' &&
      checkWinningConditions(gridData[gridRow], 'X')
    ) {
      dummy[gridRow] = 'X';
      setWinnersArray(dummy);
      console.log('Updated dummy: of X', dummy);
      console.log('Updated winnersArray: of X', winnersArray);
    } else if (
      dummy[gridRow] === '' &&
      checkWinningConditions(gridData[gridRow], 'O')
    ) {
      dummy[gridRow] = 'O';
      setWinnersArray(dummy);
      console.log('Updated dummy: of O', dummy);
      console.log('Updated winnersArray: of O', winnersArray);
    }
  }, [gridData, gridRow, player]);

  useEffect(() => {
    console.log('winnersArray:', winnersArray);

    const XisWinner = checkWinningConditions(winnersArray, 'X');
    const OisWinner = checkWinningConditions(winnersArray, 'O');

    if (XisWinner) {
      const info = 'X is winner';
      setWinner('X');
      notify(info);
    }
    if (OisWinner) {
      const info = 'O is winner';
      setWinner('O');
      notify(info);
    }

    for (let i = 0; i < winnersArray.length; i++) {
      if (winnersArray[i] !== '') {
        setCounter(counter + 1);
      }
    }
    if (counter === 9) {
      const info = 'Game is tie';
      notify(info);
    }
  }, [winnersArray]);

  const checkPlayableBoxes = (rowIndex) => {
    const row = gridData[rowIndex];
    let playable = false;

    for (let i = 0; i < row.length; i++) {
      if (row[i] === '') {
        playable = true;
        break;
      }
    }

    return playable;
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (
      gridData[rowIndex][colIndex] !== '' ||
      playableBoxes.indexOf(rowIndex) === -1
    ) {
      return;
    }
    if (checkPlayableBoxes(colIndex)) {
      const dummyPlayableBoxes = [colIndex];
      setPlayableBoxes(dummyPlayableBoxes);
    } else {
      const dummyPlayableBoxes = [];
      for (let i = 0; i < 9; i++) {
        if (checkPlayableBoxes(i)) {
          dummyPlayableBoxes.push(i);
        }
      }
      setPlayableBoxes(dummyPlayableBoxes);
    }

    setGridRow(rowIndex);
    const updatedGridData = [...gridData];
    updatedGridData[rowIndex][colIndex] = player;
    setGridData(updatedGridData);

    setPlayer(player === 'X' ? 'O' : 'X');
  };

  

  return (
    <>
      <div className="text-white min-h-screen bg-slate-800 flex flex-col justify-center items-center text-5xl text-center relative ">
        <h1 className="text-7xl font-thin italic  uppercase text-center mt-2 ">
          ULTIMATE
          <br /> Tic-Tac-Toe
        </h1>{' '}
        <br />
        <div className="flex flex-col sm:flex-row items-center justify-center translate-y-[-8%]">
          <div className="text-3xl  left-10 uppercase text-center  flex flex-col ">
            {
              Winner && 'Winner : ' + Winner 
            }
            <br />
            Player : {Players[player] || player}{' '}
            <div className="flex flex-col">
              <form className="flex flex-col ">
                <input
                  type="text"
                  value={Players.X}
                  onChange={(e) => {
                    setPlayers({ ...Players, X: e.target.value });
                  }}
                  className="text-black text-xl text-center  p-2 rounded-2xl bg-slate-400 placeholder:text-slate-700 m-3 "
                  placeholder="Enter player X name :"
                />
                <input
                  type="text"
                  value={Players.O}
                  onChange={(e) => {
                    setPlayers({ ...Players, O: e.target.value });
                  }}
                  className="text-black text-xl text-center  p-2 rounded-2xl bg-slate-400 placeholder:text-slate-700 m-3 "
                  placeholder="Enter player O name :"
                />
              </form>
            </div>
          </div>
          <div className="grid grid-cols-3 text-2xl sm:text-4xl scale-[70%] pt-0 mt-0 translate-y-[-10%]" >
            {gridData.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-3 sm:p-3 duration-500 rounded-2xl sm:m-1 ${
                  rowIndex === 0 || rowIndex === 1 || rowIndex === 3 
                    ? 'border-b-[8px] border-r-[8px] border-slate-500'
                    : rowIndex === 2 || rowIndex === 5 ? 'border-b-[8px] border-slate-500' : rowIndex === 7 ? ' border-l-[8px] border-r-[8px] border-slate-500' : rowIndex === 4 ? ' border-[8px] border-slate-500' : ''
                }`}
                style={{
                  pointerEvents:
                    playableBoxes.indexOf(rowIndex) !== -1 ? 'auto' : 'none',
                  backgroundColor:
                    playableBoxes.indexOf(rowIndex) !== -1
                      ? 'rgba(0, 255, 0, 0.4)'
                      : winnersArray[rowIndex] === 'X'
                      ? 'rgb(233, 116, 81 , 0.7)'
                      : winnersArray[rowIndex] === 'O'
                      ? 'rgba(30,190,255 , 0.5)'
                      : '',
                      
                }}
              >
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`border w-9 h-9 flex items-center justify-center sm:w-20 sm:h-20  ${
                      cell === ''
                        ? ''
                        : cell === 'X'
                        ? 'bg-red-500 '
                        : 'bg-blue-500 '
                    } hover:text-black hover:bg-slate-200 duration-500 `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      pointerEvents: cell !== '' ? 'none' : 'auto',
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className=" text-left text-lg">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
    </>
  );
}

export default App;
