import { useEffect, useMemo, useState } from "react";
import { Chess, type Square, type Move } from "chess.js";
import { Activity, BookOpen, ChevronRight, CircleHelp, Crown, History, LayoutDashboard, Menu, RotateCcw, Shield, Swords, Trophy, UserRound, X } from "lucide-react";

type Page = "Overview" | "Play" | "Coaches" | "Review" | "Profile";
const nav: { name: Page; icon: typeof LayoutDashboard }[] = [
  { name: "Overview", icon: LayoutDashboard }, { name: "Play", icon: Swords },
  { name: "Coaches", icon: UserRound }, { name: "Review", icon: History }, { name: "Profile", icon: Shield },
];
const coaches = [
  ["Adrian", "The strategist", "Balanced", "Builds plans patiently and looks for long-term advantages."],
  ["Viktor", "The tactician", "Aggressive", "Looks for forcing moves, initiative, and tactical chances."],
  ["Magnus", "The endgame specialist", "Positional", "Values precision and turns small edges into wins."],
  ["Elias", "The analyst", "Precise", "Prefers clear plans and carefully calculated decisions."],
  ["Nikolai", "The defender", "Solid", "Stays resilient and waits for the right counterattack."],
  ["Arthur", "The classicist", "Balanced", "Favors sound development and dependable principles."],
  ["Leon", "The attacker", "Aggressive", "Creates complications and keeps pressure on the king."],
  ["Vincent", "The technician", "Positional", "Improves pieces and wins through small details."],
  ["Julian", "The explorer", "Creative", "Enjoys unusual ideas and flexible positions."],
  ["Dmitri", "The counterpuncher", "Tactical", "Invites overextension before striking back."],
  ["Felix", "The improver", "Patient", "Makes useful moves and avoids unnecessary risk."],
  ["Marcus", "The competitor", "Direct", "Plays actively and looks to seize the initiative."],
  ["Stefan", "The strategist", "Positional", "Builds pressure with coordinated pieces."],
  ["Alexander", "The calculator", "Precise", "Searches for concrete variations and forcing lines."],
  ["Ivan", "The fortress", "Defensive", "Makes positions difficult to break down."],
  ["Sebastian", "The opportunist", "Tactical", "Keeps an eye out for loose pieces and mistakes."],
  ["Theo", "The speed player", "Dynamic", "Likes open positions and quick development."],
  ["Raphael", "The universalist", "Balanced", "Adapts to the demands of each position."],
  ["Daniel", "The endgame planner", "Positional", "Simplifies when it leads to a favorable ending."],
  ["Silas", "The challenger", "Aggressive", "Asks difficult questions and fights for every tempo."]
] as const;
const glyph: Record<string, string> = { wk:"♔", wq:"♕", wr:"♖", wb:"♗", wn:"♘", wp:"♙", bk:"♚", bq:"♛", br:"♜", bb:"♝", bn:"♞", bp:"♟" };
const files = "abcdefgh";
const pieceValue: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function createGame() {
  try {
    const saved = localStorage.getItem("caissa-game-fen");
    return saved ? new Chess(saved) : new Chess();
  } catch {
    return new Chess();
  }
}
function gameStatus(game: Chess) {
  if (game.isCheckmate()) return game.turn() === "w" ? "Checkmate — Black wins." : "Checkmate — You win.";
  if (game.isStalemate()) return "Draw by stalemate.";
  if (game.isThreefoldRepetition()) return "Draw by repetition.";
  if (game.isInsufficientMaterial()) return "Draw — insufficient material.";
  if (game.isDraw()) return "Game drawn.";
  if (game.isCheck()) return game.turn() === "w" ? "Your king is in check." : "Black is in check.";
  return game.turn() === "w" ? "Your move · White" : "Coach is thinking…";
}
function chooseBotMove(game: Chess, style: string): Move | undefined {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return undefined;
  const scored = moves.map((move) => {
    let score = Math.random() * (style === "Precise" ? 0.35 : 1.5);
    if (move.captured) score += pieceValue[move.captured] * (style === "Aggressive" ? 1.8 : 1.25);
    if (move.san.includes("+")) score += style === "Aggressive" ? 1.8 : 0.8;
    if (move.san.includes("#")) score += 100;
    if (move.promotion) score += 8;
    return { move, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.move;
}

export default function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [game, setGame] = useState<Chess>(createGame);
  const [selected, setSelected] = useState<Square | null>(null);
  const [coach, setCoach] = useState<string>("Adrian");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [gamesPlayed, setGamesPlayed] = useState(() => Number(localStorage.getItem("caissa-games") || 0));
  const [finished, setFinished] = useState(false);
  const currentCoach = coaches.find((item) => item[0] === coach) ?? coaches[0];
  const moves = useMemo(() => game.history({ verbose: true }), [game]);
  const legalTargets = useMemo(() => selected ? game.moves({ square: selected, verbose: true }).map((m) => m.to) : [], [game, selected]);
  const status = gameStatus(game);
  const gameOver = game.isGameOver();

  useEffect(() => {
    localStorage.setItem("caissa-game-fen", game.fen());
    if (gameOver && !finished && moves.length > 0) {
      setFinished(true);
      const next = gamesPlayed + 1;
      setGamesPlayed(next);
      localStorage.setItem("caissa-games", String(next));
    }
  }, [game, gameOver, finished, gamesPlayed, moves.length]);

  useEffect(() => {
    if (game.turn() !== "b" || game.isGameOver()) return;
    const timer = window.setTimeout(() => {
      const next = new Chess(game.fen());
      const botMove = chooseBotMove(next, currentCoach[2]);
      if (botMove) {
        next.move({ from: botMove.from, to: botMove.to, promotion: "q" });
        setLastMove({ from: botMove.from, to: botMove.to });
        setGame(next);
      }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [game, currentCoach]);

  function startNewGame() {
    setGame(new Chess());
    setSelected(null);
    setLastMove(null);
    setFinished(false);
  }
  function undoTurn() {
    const next = new Chess(game.fen());
    if (next.turn() === "w") next.undo();
    next.undo();
    setGame(next);
    setSelected(null);
    setLastMove(null);
    setFinished(false);
  }
  function clickSquare(square: Square) {
    if (game.turn() !== "w" || game.isGameOver()) return;
    const piece = game.get(square);
    if (selected && legalTargets.includes(square)) {
      const next = new Chess(game.fen());
      try {
        const move = next.move({ from: selected, to: square, promotion: "q" });
        setLastMove({ from: move.from, to: move.to });
        setGame(next);
      } catch { /* Ignore illegal moves. */ }
      setSelected(null);
      return;
    }
    if (piece?.color === "w") setSelected(square);
    else setSelected(null);
  }
  function changePage(next: Page) { setPage(next); setMobileMenu(false); }
  const wins = Number(localStorage.getItem("caissa-wins") || 0);

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
      <div className="brand"><span className="brand-mark">♛</span><span>CAISSA</span><button className="icon-button close-nav" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="workspace-label">CHESS STUDIO</div>
      <nav className="nav-list">{nav.map(({name,icon:Icon}) => <button key={name} className={`nav-item ${page === name ? "active" : ""}`} onClick={() => changePage(name)}><Icon size={18}/><span>{name}</span></button>)}</nav>
      <div className="sidebar-divider"/>
      <div className="workspace-label">YOUR PROGRESS</div>
      <div className="sidebar-stat"><div className="stat-icon"><Trophy size={16}/></div><div><strong>Unranked</strong><span>Practice games only</span></div></div>
      <div className="sidebar-stat"><div className="stat-icon"><Activity size={16}/></div><div><strong>{gamesPlayed} games played</strong><span>Saved on this device</span></div></div>
      <div className="sidebar-bottom"><div className="profile-mini"><div className="avatar user-avatar">P</div><div><strong>Player</strong><span>Local profile</span></div></div><div className="sidebar-note">CAISSA · THE ART OF COMPETITION</div></div>
    </aside>
    {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close menu"/>}
    <main className="main-content">
      <header className="topbar"><button className="icon-button menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">Studio <ChevronRight size={14}/><span>{page}</span></div><div className="top-actions"><span className="online-label"><i/> LOCAL PLAY</span><div className="avatar user-avatar top-avatar">P</div></div></header>
      {page === "Overview" && <div className="page">
        <div className="welcome-row"><div><div className="eyebrow">WELCOME TO CAISSA</div><h1>Think clearly. Play boldly.</h1><p className="subheading">A focused chess space for practice, progress, and better decisions.</p></div><button className="primary-button" onClick={() => changePage("Play")}>Play a game <ChevronRight size={16}/></button></div>
        <section className="hero-panel"><div className="hero-copy"><div className="eyebrow gold">YOUR NEXT MOVE</div><h2>Every move<br/>has a reason.</h2><p>Play a full game against a coach, explore all 20 playing personalities, and review your moves as you go.</p><button className="primary-button" onClick={() => changePage("Play")}>Start a game <ChevronRight size={16}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="queen-piece">♛</div><div className="hero-caption">THE ART OF COMPETITION</div></div></section>
        <div className="section-heading"><div><div className="eyebrow">YOUR STUDIO</div><h3>At a glance</h3></div></div>
        <div className="stats-grid"><div className="metric-card"><div className="metric-top">GAMES PLAYED</div><div className="metric-value">{gamesPlayed}</div><div className="metric-foot">Practice games on this device</div></div><div className="metric-card"><div className="metric-top">CURRENT COACH</div><div className="metric-value coach-metric">{coach}</div><div className="metric-foot">{currentCoach[1]}</div></div><div className="metric-card"><div className="metric-top">COMPETITIVE RATING</div><div className="metric-value">—</div><div className="metric-foot">Online ranked play not connected</div></div><div className="metric-card"><div className="metric-top">COACHES</div><div className="metric-value">20</div><div className="metric-foot">All available from the start</div></div></div>
        <div className="lower-grid"><section className="content-panel"><div className="panel-heading"><div><div className="eyebrow">YOUR OPPONENT</div><h3>{currentCoach[0]}</h3></div><button className="subtle-link" onClick={() => changePage("Coaches")}>All coaches <ChevronRight size={14}/></button></div><p className="panel-description">{currentCoach[3]}</p><button className="secondary-button" onClick={() => changePage("Coaches")}>Choose a different coach</button></section><section className="content-panel"><div className="panel-heading"><div><div className="eyebrow">READY WHEN YOU ARE</div><h3>Continue playing</h3></div><BookOpen size={19}/></div><p className="panel-description">Your current board is saved automatically on this device.</p><button className="secondary-button" onClick={() => changePage("Play")}>Open chessboard <ChevronRight size={14}/></button></section></div>
      </div>}
      {page === "Play" && <div className="page">
        <div className="page-heading"><div className="eyebrow">PRACTICE MATCH</div><h1>Play chess.</h1><p className="subheading">You play White. {coach} plays Black. Standard chess rules are enforced.</p></div>
        <div className="play-layout"><section className="content-panel board-panel">
          <div className="board-top"><div className="opponent-line"><div className="coach-avatar">{coach[0]}</div><div><strong>{coach}</strong><span>{coach[1]} · Black</span></div></div><span className={game.isCheck() ? "status-pill check-status" : "status-pill"}>{status}</span></div>
          <div className="chessboard" role="group" aria-label="Chessboard">{Array.from({length:8},(_,r)=><div className="board-rank" key={r}>{Array.from({length:8},(_,c)=>{const square=`${files[c]}${8-r}` as Square;const piece=game.get(square);const isSelected=selected===square;const isTarget=legalTargets.includes(square);const isLast=lastMove?.from===square||lastMove?.to===square;const color=(r+c)%2===0?"light-square":"dark-square";return <button key={square} className={`square ${color} ${isSelected?"selected-square":""} ${isLast?"last-square":""} ${isTarget?"legal-target":""}`} onClick={()=>clickSquare(square)} aria-label={`${square} ${piece ? (piece.color==="w"?"white":"black")+" "+piece.type : "empty"}`}>{c===0&&<span className="coordinate rank-coordinate">{8-r}</span>}{r===7&&<span className="coordinate file-coordinate">{files[c]}</span>}{piece&&<span className={`piece ${piece.color==="w"?"white-piece":"black-piece"}`}>{glyph[piece.color+piece.type]}</span>}{isTarget&&!piece&&<span className="target-dot"/>}{isTarget&&piece&&<span className="target-ring"/>}</button>})}</div>)}</div>
          <div className="board-controls"><span>Tap a piece, then tap a highlighted square.</span><div><button className="secondary-button compact" onClick={undoTurn} disabled={moves.length<2 || gameOver}><RotateCcw size={14}/> Undo</button><button className="primary-button compact" onClick={startNewGame}><RotateCcw size={14}/> New game</button></div></div>
        </section><aside className="play-options"><section className="content-panel"><div className="eyebrow">MOVE HISTORY</div><h3>Moves</h3><div className="move-list">{moves.length===0?<p className="muted-copy">Your moves will appear here.</p>:Array.from({length:Math.ceil(moves.length/2)},(_,i)=><div className="move-row" key={i}><span>{i+1}.</span><strong>{moves[i*2]?.san ?? ""}</strong><strong>{moves[i*2+1]?.san ?? "…"}</strong></div>)}</div></section><section className="content-panel coach-select-panel"><div className="eyebrow">PLAYING STYLE</div><h3>Choose your coach</h3><p className="panel-description">Each coach has a different move-selection style. Changing coach affects your next game.</p><select value={coach} onChange={(e)=>setCoach(e.target.value)} aria-label="Choose coach">{coaches.map((c)=><option key={c[0]} value={c[0]}>{c[0]} — {c[1]}</option>)}</select><button className="secondary-button full-button" onClick={startNewGame}>Start fresh against {coach}</button></section></aside></div>
        {gameOver&&<div className="result-banner"><Trophy size={18}/><div><strong>{status}</strong><span>Game complete. Start a new game whenever you're ready.</span></div><button className="secondary-button" onClick={startNewGame}>Play again</button></div>}
      </div>}
      {page === "Coaches" && <div className="page"><div className="page-heading"><div className="eyebrow">20 PLAYING PERSONALITIES</div><h1>Choose your coach.</h1><p className="subheading">Every coach is available from the beginning. Select one to use in your next practice game.</p></div><div className="coach-grid">{coaches.map((c,i)=><button key={c[0]} className={`coach-card ${coach===c[0]?"chosen-coach":""}`} onClick={()=>setCoach(c[0])}><div className="coach-card-top"><div className="coach-portrait">{c[0][0]}</div><span className="coach-index">{String(i+1).padStart(2,"0")}</span></div><strong>{c[0]}</strong><span className="coach-role">{c[1]}</span><p>{c[3]}</p><span className="coach-rating">{c[2]}</span>{coach===c[0]&&<span className="selected-label">SELECTED</span>}</button>)}</div><button className="primary-button coach-play-button" onClick={()=>changePage("Play")}>Play against {coach} <ChevronRight size={15}/></button></div>}
      {page === "Review" && <div className="page"><div className="page-heading"><div className="eyebrow">YOUR GAME HISTORY</div><h1>Review.</h1><p className="subheading">Move history from your current saved game.</p></div><section className="content-panel review-panel"><div className="panel-heading"><div><div className="eyebrow">CURRENT GAME</div><h3>{moves.length ? `${Math.ceil(moves.length/2)} moves played` : "No moves yet"}</h3></div><button className="secondary-button" onClick={()=>changePage("Play")}>Return to board</button></div><div className="review-moves">{moves.length ? moves.map((m,i)=><div key={i} className="review-move"><span>{i+1}.</span><strong>{m.color==="w"?"White":"Black"}</strong><code>{m.san}</code><span>{m.from} → {m.to}</span></div>) : <p className="muted-copy">Play a game and every move will appear here.</p>}</div><button className="secondary-button" onClick={()=>{navigator.clipboard?.writeText(game.pgn());}}>Copy game PGN</button></section></div>}
      {page === "Profile" && <div className="page"><div className="page-heading"><div className="eyebrow">LOCAL PLAYER PROFILE</div><h1>Your profile.</h1><p className="subheading">Practice statistics are stored in this browser on this device.</p></div><section className="content-panel profile-panel"><div className="avatar profile-avatar">P</div><div><h3>Player</h3><p>Local profile · No account required</p><span className="unranked-pill">UNRANKED</span></div></section><div className="stats-grid profile-stats"><div className="metric-card"><div className="metric-top">GAMES PLAYED</div><div className="metric-value">{gamesPlayed}</div></div><div className="metric-card"><div className="metric-top">CURRENT COACH</div><div className="metric-value coach-metric">{coach}</div></div><div className="metric-card"><div className="metric-top">RATING</div><div className="metric-value">—</div></div><div className="metric-card"><div className="metric-top">WINS</div><div className="metric-value">{wins}</div></div></div><section className="content-panel profile-note"><CircleHelp size={18}/><p>CAISSA currently runs as a local browser prototype. Online accounts, ranked matchmaking, friend challenges, and cloud sync are not connected yet.</p></section></div>}
      <footer className="footer"><span>CAISSA <span className="footer-dot">·</span> THE ART OF COMPETITION</span><span>Practice locally. Improve deliberately.</span></footer>
    </main>
  </div>;
}
