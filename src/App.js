import React, { useEffect, useState } from "react";
import "./App.css";
import Stadium from "./Icons/stadium.png";
import Batting from "./Icons/batting.png";
import Bawling from "./Icons/bawling.png";
import Wicket from "./Icons/wicket.png";
import Ball from "./Icons/ball.png";
import Tie from "./Icons/tie.png";
import Trophy from "./Icons/trophy.png";

export default function App() {
  const [pRun, setPRun] = useState([]);
  const [cRun, setCRun] = useState([]);
  const [bat, setBat] = useState(0);
  const [ball, setBall] = useState(0);
  const [out, setOut] = useState(false);
  const [outShow, setOutShow] = useState(false);
  const [over, setOver] = useState(false);
  const [overShow, setOverShow] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalPRun, setTotalPRun] = useState(0);
  const [totalCRun, setTotalCRun] = useState(0);
  const [whoPlayFirst, setWhoPlayFirst] = useState(false); // false = COMPUTER, true = YOU
  const [secondInning, setSecondInning] = useState(false); // false = COMPUTER, true = YOU
  const [whoWin, setWhoWin] = useState("");
  const [whoWinShow, setWhoWinShow] = useState(false);
  const overBalls = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    let toss = Math.floor(Math.random() * (99 - 1 + 1)) + 1;

    if (toss % 2 === 0) {
      setWhoPlayFirst(true);
      setTotalCRun(-1);
      setTotalPRun(0);
    } else {
      setWhoPlayFirst(false);
      setTotalCRun(0);
      setTotalPRun(-1);
    }
  });

  useEffect(() => {
    if (secondInning) {
      if (whoPlayFirst) {
        whoWinMatch(totalCRun, totalPRun, "YOU", "COMPUTER");
      } else {
        whoWinMatch(totalPRun, totalCRun, "COMPUTER", "YOU");
      }
    }
  }, [totalPRun, totalCRun, out, over, secondInning, whoPlayFirst]);

  useEffect(() => {
    if (out) {
      setOutShow(true);
      setTimeout(() => {
        if (whoWin !== "") {
          setOutShow(false);
          setWhoWinShow(true);
        }
      }, 2000);
    } else if (over) {
      setOverShow(true);
      setTimeout(() => {
        if (whoWin !== "") {
          setOverShow(false);
          setWhoWinShow(true);
        }
      }, 2000);
    } else if (whoWin !== "") {
      setWhoWinShow(true);
    }
  }, [out, over, whoWin]);

  const play = (e) => {
    let pbat = Number(e.target.value || 0);
    let pball = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

    setBat(pbat);
    setBall(pball);

    if (whoPlayFirst) {
      isOut(pbat, pball);
      isOver(pRun.length);
      if (pbat !== pball || pRun.length === 6) {
        setPRun([...pRun, pbat]);
        setTotalPRun((prev) => prev + pbat);
      }
    } else {
      isOut(pbat, pball);
      isOver(cRun.length);
      if (pbat !== pball || cRun.length === 6) {
        setCRun([...cRun, pball]);
        setTotalCRun((prev) => prev + pball);
      }
    }
  };

  const isOut = (bat, ball) => {
    if (bat === ball) {
      setOut(true);
      if (whoPlayFirst && pRun.length === 0) setPRun([...pRun, 0]);
      if (!whoPlayFirst && cRun.length === 0) setCRun([...cRun, 0]);
    }
  };

  const isOver = (ball) => {
    if (ball === 5) {
      setOver(true);
    }
  };

  const whoWinMatch = (
    totalFirstInningRuns,
    totalSecondInningRuns,
    secondInning,
    firstInning,
  ) => {
    if (totalFirstInningRuns < totalSecondInningRuns) {
      winMatch({ secondInning }, true);
    } else if (totalFirstInningRuns === totalSecondInningRuns) {
      if (out || over) {
        winMatch({ matchDraw: "MATCH TIE" }, true);
      }
    } else {
      if (out || over) {
        winMatch({ firstInning }, true);
      }
    }
  };

  const winMatch = (win, gameover) => {
    setWhoWin(win.matchDraw || (win.secondInning || win.firstInning) + " WIN");
    setGameOver(gameover);
    setBat(0);
    setBall(0);
  };

  const refresh = () => {
    window.location.reload();
  };

  const secondInnings = () => {
    setWhoPlayFirst(!whoPlayFirst);
    setSecondInning(true);
    setBat(0);
    setBall(0);
    setOut(false);
    setOver(false);
    setOutShow(false);
    setOverShow(false);
    setWhoWinShow(false);
    if (totalPRun === -1) {
      setTotalPRun(0);
    }
    if (totalCRun === -1) {
      setTotalCRun(0);
    }
  };

  return (
    <div className="App bg-[#73c04a]">
      <div
        className={`flex bg-no-repeat bg-cover flex-col justify-around items-stretch h-screen`}
        style={{
          backgroundImage: `url(${Stadium})`,
          backgroundPositionY: -250,
        }}
      >
        <div className={"flex justify-between h-1/2 p-20"}>
          <div className={"flex flex-col items-start"}>
            <div className={"flex flex-col items-start"}>
              <div className={"ml-[60px] text-[#ebf6fe] text-4xl font-bold"}>
                {" YOU "}
              </div>
              {whoPlayFirst ? (
                <img src={Batting} alt="" width={"38%"} />
              ) : (
                <img src={Bawling} alt="" width={"35%"} className={"py-2.5"} />
              )}
            </div>
            <div className={"flex justify-center gap-1.5"}>
              {pRun.map((e) => (
                <div
                  className={
                    "px-3 py-1 bg-[#e15c63] text-[#ebf6fe] font-bold rounded-full"
                  }
                >
                  {e}
                </div>
              ))}
            </div>
            <div
              className={"text-[#ebf6fe] text-3xl font-bold py-2"}
              style={{
                display:
                  (out || over) && whoPlayFirst
                    ? "block"
                    : totalPRun >= 0
                      ? "block"
                      : "none",
              }}
            >
              {"TOTAL RUN :  " + totalPRun}
            </div>
          </div>
          <div>
            <div style={{ display: outShow ? "block" : "none" }}>
              <div className={"flex flex-col items-center"}>
                <div className={"text-[#ebf6fe] text-4xl font-bold"}>
                  {"OUT"}
                </div>
                <img src={Wicket} alt="" width={"30%"} />
              </div>
            </div>
            <div style={{ display: overShow ? "block" : "none" }}>
              <div className={"flex flex-col items-center"}>
                <div className={"text-[#ebf6fe] text-4xl font-bold"}>
                  {"OVER"}
                </div>
                <img src={Ball} alt="" width={"30%"} />
              </div>
            </div>
            <div style={{ display: whoWinShow ? "block" : "none" }}>
              <div className={"flex flex-col items-center"}>
                <div className={"text-[#ebf6fe] text-4xl font-bold"}>
                  {whoWin}
                </div>
                {whoWin === "MATCH TIE" ? (
                  <img src={Tie} alt="" width={"36%"} />
                ) : (
                  <img src={Trophy} alt="" width={"36%"} />
                )}
              </div>
            </div>
          </div>
          <div className={"flex flex-col items-end"}>
            <div className={"flex flex-col items-end"}>
              <div className={"text-4xl font-bold text-[#ebf6fe]"}>
                {" COMPUTER "}
              </div>
              {whoPlayFirst ? (
                <img src={Bawling} alt="" width={"35%"} className={"py-2.5"} />
              ) : (
                <img src={Batting} alt="" width={"38%"} />
              )}
            </div>

            <div className={"flex justify-center gap-1.5"}>
              {cRun.map((e) => (
                <div
                  className={
                    "px-3 py-1 bg-[#e15c63] text-[#ebf6fe] font-bold rounded-full"
                  }
                >
                  {e}
                </div>
              ))}
            </div>
            <div
              className={"text-3xl text-[#ebf6fe] font-bold py-2"}
              style={{
                display:
                  (out || over) && !whoPlayFirst
                    ? "block"
                    : totalCRun >= 0
                      ? "block"
                      : "none",
              }}
            >
              {"TOTAL RUN :  " + totalCRun}
            </div>
          </div>
        </div>
        <div className={"flex justify-center gap-52"}>
          <div>
            <div className={"text-[#ebf6fe] text-6xl font-bold"}>{bat}</div>
            <div
              className={"text-[#ebf6fe] text-4xl font-bold"}
              style={{ color: "#ebf6fe", fontSize: 24, fontWeight: 600 }}
            >
              {"YOU"}
            </div>
          </div>
          <div>
            <div className={"text-[#ebf6fe] text-6xl font-bold"}>{ball}</div>
            <div className={"text-[#ebf6fe] text-4xl font-bold"}>
              {"COMPUTER"}
            </div>
          </div>
        </div>
        <div className={"flex justify-center gap-2.5"}>
          {out || over || gameOver ? (
            <button
              onClick={
                totalPRun === -1 || totalCRun === -1 ? secondInnings : refresh
              }
              className={
                "cursor-pointer w-[10%] p-4 rounded-xl bg-[#ebf6fe] text-[#605b5b] text-base font-bold"
              }
            >
              {totalPRun === -1 || totalCRun === -1 ? "PLAY" : "RE-PLAY"}
            </button>
          ) : (
            overBalls.map((b) => (
              <button
                name={b}
                value={b}
                onClick={play}
                disabled={out || over || gameOver}
                className={
                  "cursor-pointer py-2.5 px-12 rounded-xl bg-[#ebf6fe] text-[#605b5b] text-2xl font-bold"
                }
              >
                {b}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
