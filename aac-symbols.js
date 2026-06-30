(function () {
  const ink = "#263238";
  const skin = "#C9825B";
  const hair = "#3D2B1F";
  const shirt = "#4A90E2";
  const yellow = "#FFD45A";
  const green = "#5DBB78";
  const red = "#EF6A67";
  const purple = "#8B72C8";
  const blue = "#62B6E8";

  function svg(content) {
    return `
      <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="158" height="118" rx="8" fill="#FFFFFF"/>
        ${content}
      </svg>
    `;
  }

  function face(cx, cy, mood = "happy", scale = 1) {
    const mouth = mood === "worried"
      ? `<path d="M ${cx - 10 * scale} ${cy + 12 * scale} Q ${cx} ${cy + 3 * scale} ${cx + 10 * scale} ${cy + 12 * scale}" fill="none" stroke="${ink}" stroke-width="${3 * scale}" stroke-linecap="round"/>`
      : `<path d="M ${cx - 10 * scale} ${cy + 7 * scale} Q ${cx} ${cy + 17 * scale} ${cx + 10 * scale} ${cy + 7 * scale}" fill="none" stroke="${ink}" stroke-width="${3 * scale}" stroke-linecap="round"/>`;

    return `
      <circle cx="${cx}" cy="${cy}" r="${24 * scale}" fill="${skin}" stroke="${ink}" stroke-width="${3 * scale}"/>
      <path d="M ${cx - 22 * scale} ${cy - 11 * scale} Q ${cx} ${cy - 34 * scale} ${cx + 22 * scale} ${cy - 10 * scale}" fill="${hair}" stroke="${ink}" stroke-width="${2 * scale}"/>
      <circle cx="${cx - 8 * scale}" cy="${cy}" r="${2.5 * scale}" fill="${ink}"/>
      <circle cx="${cx + 8 * scale}" cy="${cy}" r="${2.5 * scale}" fill="${ink}"/>
      ${mouth}
    `;
  }

  function student() {
    return svg(`
      ${face(80, 43, "happy", 1)}
      <path d="M45 113 Q48 72 80 72 Q112 72 115 113" fill="${shirt}" stroke="${ink}" stroke-width="4"/>
      <path d="M61 82 L80 99 L99 82" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    `);
  }

  function feelings() {
    return svg(`
      ${face(80, 58, "worried", 1.35)}
      <path d="M32 30 C18 16 7 38 32 52 C57 38 46 16 32 30Z" fill="${red}" stroke="${ink}" stroke-width="3"/>
      <path d="M128 30 C114 16 103 38 128 52 C153 38 142 16 128 30Z" fill="${yellow}" stroke="${ink}" stroke-width="3"/>
    `);
  }

  function listen() {
    return svg(`
      <path d="M31 88 Q24 55 40 36 Q55 17 78 26 Q94 33 93 52 Q92 65 82 72 Q74 78 75 94" fill="${skin}" stroke="${ink}" stroke-width="4"/>
      <path d="M37 43 Q54 18 82 32" fill="none" stroke="${hair}" stroke-width="12" stroke-linecap="round"/>
      <path d="M75 52 Q91 42 96 57 Q99 68 88 73 Q80 77 82 87" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
      <path d="M112 45 Q126 55 112 65" fill="none" stroke="${blue}" stroke-width="5" stroke-linecap="round"/>
      <path d="M126 34 Q151 55 126 76" fill="none" stroke="${blue}" stroke-width="5" stroke-linecap="round"/>
    `);
  }

  function walk() {
    return svg(`
      <circle cx="77" cy="24" r="15" fill="${skin}" stroke="${ink}" stroke-width="3"/>
      <path d="M66 17 Q77 4 89 18" fill="none" stroke="${hair}" stroke-width="8" stroke-linecap="round"/>
      <path d="M76 40 L68 72 L96 84" fill="none" stroke="${shirt}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M70 51 L43 66" fill="none" stroke="${skin}" stroke-width="10" stroke-linecap="round"/>
      <path d="M82 53 L108 45" fill="none" stroke="${skin}" stroke-width="10" stroke-linecap="round"/>
      <path d="M70 72 L43 104" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="round"/>
      <path d="M94 83 L119 106" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="round"/>
      <path d="M20 108 H140" stroke="#9AA5B1" stroke-width="4" stroke-linecap="round"/>
      <path d="M20 37 H43 M13 51 H36" stroke="${green}" stroke-width="5" stroke-linecap="round"/>
    `);
  }

  function putAway() {
    return svg(`
      <path d="M88 54 H142 L135 106 H95Z" fill="#B8D8F0" stroke="${ink}" stroke-width="4"/>
      <path d="M84 54 H146" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
      <rect x="22" y="28" width="29" height="29" rx="3" fill="${yellow}" stroke="${ink}" stroke-width="4"/>
      <circle cx="65" cy="43" r="15" fill="${red}" stroke="${ink}" stroke-width="4"/>
      <path d="M52 72 Q82 71 102 60" fill="none" stroke="${green}" stroke-width="7" stroke-linecap="round"/>
      <path d="M91 53 L105 60 L97 72" fill="none" stroke="${green}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    `);
  }

  function materials() {
    return svg(`
      <rect x="18" y="36" width="72" height="58" rx="5" fill="#F7F3E8" stroke="${ink}" stroke-width="4"/>
      <path d="M54 36 V94" stroke="${ink}" stroke-width="3"/>
      <path d="M25 48 H47 M25 59 H47 M61 48 H82 M61 59 H82" stroke="#8A98A8" stroke-width="3" stroke-linecap="round"/>
      <path d="M107 24 L137 89" stroke="${yellow}" stroke-width="13" stroke-linecap="round"/>
      <path d="M103 17 L111 12 L143 83 L134 87Z" fill="${yellow}" stroke="${ink}" stroke-width="3"/>
      <path d="M134 87 L143 83 L142 99Z" fill="${ink}"/>
      <rect x="95" y="96" width="48" height="10" rx="5" fill="${purple}" stroke="${ink}" stroke-width="3"/>
    `);
  }

  function look() {
    return svg(`
      <path d="M13 60 Q42 24 80 60 Q42 96 13 60Z" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <path d="M80 60 Q112 24 147 60 Q112 96 80 60Z" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <circle cx="54" cy="60" r="15" fill="${blue}" stroke="${ink}" stroke-width="3"/>
      <circle cx="106" cy="60" r="15" fill="${blue}" stroke="${ink}" stroke-width="3"/>
      <circle cx="54" cy="60" r="6" fill="${ink}"/>
      <circle cx="106" cy="60" r="6" fill="${ink}"/>
    `);
  }

  function start() {
    return svg(`
      <circle cx="80" cy="60" r="48" fill="#EAF8EF" stroke="${ink}" stroke-width="4"/>
      <path d="M65 36 L111 60 L65 86Z" fill="${green}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
    `);
  }

  function finished() {
    return svg(`
      <rect x="25" y="17" width="110" height="88" rx="8" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <rect x="40" y="35" width="27" height="27" rx="3" fill="#EAF8EF" stroke="${ink}" stroke-width="4"/>
      <path d="M46 48 L53 56 L65 40" fill="none" stroke="${green}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M79 42 H121 M79 56 H112 M40 80 H121" stroke="#7E8B96" stroke-width="5" stroke-linecap="round"/>
    `);
  }

  function wait() {
    return svg(`
      <circle cx="104" cy="55" r="40" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <path d="M104 55 V30 M104 55 L122 67" stroke="${red}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="104" cy="55" r="5" fill="${ink}"/>
      <circle cx="38" cy="42" r="16" fill="${skin}" stroke="${ink}" stroke-width="3"/>
      <path d="M24 38 Q38 19 52 39" fill="none" stroke="${hair}" stroke-width="8" stroke-linecap="round"/>
      <path d="M20 106 Q22 61 38 61 Q55 61 57 106" fill="${shirt}" stroke="${ink}" stroke-width="4"/>
    `);
  }

  function help() {
    return svg(`
      ${face(52, 38, "happy", 0.7)}
      <path d="M31 104 Q33 60 52 60 Q70 60 73 104" fill="${shirt}" stroke="${ink}" stroke-width="4"/>
      <path d="M68 73 L94 48" stroke="${skin}" stroke-width="10" stroke-linecap="round"/>
      <path d="M96 52 V22 M96 25 L88 15 M96 25 L104 15" stroke="${skin}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="124" cy="43" r="17" fill="#E8C39E" stroke="${ink}" stroke-width="3"/>
      <path d="M105 106 Q108 64 124 64 Q141 64 144 106" fill="${purple}" stroke="${ink}" stroke-width="4"/>
      <path d="M113 77 L91 67" stroke="#E8C39E" stroke-width="10" stroke-linecap="round"/>
    `);
  }

  function calm() {
    return svg(`
      ${face(80, 38, "happy", 0.8)}
      <path d="M51 103 Q54 62 80 62 Q106 62 109 103" fill="${shirt}" stroke="${ink}" stroke-width="4"/>
      <path d="M64 76 Q80 87 96 76" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>
      <path d="M20 45 Q8 55 20 65 M140 45 Q152 55 140 65" fill="none" stroke="${blue}" stroke-width="5" stroke-linecap="round"/>
      <path d="M13 34 Q-2 55 13 76 M147 34 Q162 55 147 76" fill="none" stroke="${blue}" stroke-width="4" stroke-linecap="round"/>
    `);
  }

  function goal() {
    return svg(`
      <circle cx="75" cy="60" r="49" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <circle cx="75" cy="60" r="35" fill="${red}" stroke="${ink}" stroke-width="3"/>
      <circle cx="75" cy="60" r="22" fill="#FFFFFF" stroke="${ink}" stroke-width="3"/>
      <circle cx="75" cy="60" r="9" fill="${red}" stroke="${ink}" stroke-width="3"/>
      <path d="M69 65 L132 20" stroke="${purple}" stroke-width="7" stroke-linecap="round"/>
      <path d="M121 18 L139 15 L134 33" fill="${purple}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    `);
  }

  function proud() {
    return svg(`
      ${face(55, 61, "happy", 1)}
      <path d="M27 115 Q30 88 55 88 Q80 88 83 115" fill="${shirt}" stroke="${ink}" stroke-width="4"/>
      <path d="M117 14 L126 37 L151 39 L132 55 L138 80 L117 67 L96 80 L102 55 L83 39 L108 37Z" fill="${yellow}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
    `);
  }

  function next() {
    return svg(`
      <rect x="13" y="31" width="48" height="58" rx="6" fill="#EAF3FF" stroke="${ink}" stroke-width="4"/>
      <rect x="99" y="31" width="48" height="58" rx="6" fill="#EAF8EF" stroke="${ink}" stroke-width="4"/>
      <path d="M66 60 H92" stroke="${green}" stroke-width="8" stroke-linecap="round"/>
      <path d="M84 48 L96 60 L84 72" fill="none" stroke="${green}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="37" cy="52" r="9" fill="${blue}"/>
      <path d="M25 78 Q27 62 37 62 Q48 62 50 78" fill="${blue}"/>
      <path d="M111 46 H135 M111 58 H135 M111 70 H129" stroke="${green}" stroke-width="5" stroke-linecap="round"/>
    `);
  }

  function breakTime() {
    return svg(`
      <rect x="21" y="26" width="48" height="65" rx="8" fill="#EAF3FF" stroke="${ink}" stroke-width="4"/>
      <path d="M35 43 V73 M55 43 V73" stroke="${blue}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="111" cy="60" r="34" fill="${yellow}" stroke="${ink}" stroke-width="4"/>
      <path d="M96 53 Q111 39 126 53 M98 72 Q111 83 124 72" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
    `);
  }

  function group() {
    return svg(`
      ${face(42, 44, "happy", 0.65)}
      ${face(80, 35, "happy", 0.72)}
      ${face(119, 44, "happy", 0.65)}
      <path d="M20 110 Q22 71 42 71 Q61 71 64 110" fill="${green}" stroke="${ink}" stroke-width="3"/>
      <path d="M54 110 Q57 68 80 68 Q104 68 107 110" fill="${shirt}" stroke="${ink}" stroke-width="3"/>
      <path d="M97 110 Q100 71 119 71 Q139 71 141 110" fill="${purple}" stroke="${ink}" stroke-width="3"/>
    `);
  }

  function safe() {
    return svg(`
      <path d="M80 10 L137 30 V59 Q137 94 80 112 Q23 94 23 59 V30Z" fill="#EAF8EF" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M53 60 L70 77 L109 39" fill="none" stroke="${green}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    `);
  }

  function routine() {
    return svg(`
      <rect x="24" y="15" width="112" height="90" rx="8" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <rect x="36" y="29" width="25" height="20" rx="3" fill="${yellow}" stroke="${ink}" stroke-width="3"/>
      <rect x="36" y="58" width="25" height="20" rx="3" fill="${blue}" stroke="${ink}" stroke-width="3"/>
      <rect x="36" y="87" width="25" height="8" rx="3" fill="${green}"/>
      <path d="M72 37 H121 M72 45 H108 M72 65 H121 M72 73 H103 M72 91 H115" stroke="#7E8B96" stroke-width="4" stroke-linecap="round"/>
    `);
  }

  function choose() {
    return svg(`
      <rect x="13" y="15" width="57" height="66" rx="6" fill="#FFF6D6" stroke="${ink}" stroke-width="4"/>
      <circle cx="41" cy="43" r="13" fill="${yellow}" stroke="${ink}" stroke-width="3"/>
      <rect x="90" y="15" width="57" height="66" rx="6" fill="#EAF3FF" stroke="${ink}" stroke-width="4"/>
      <circle cx="118" cy="43" r="13" fill="${blue}" stroke="${ink}" stroke-width="3"/>
      <path d="M80 108 V65 M80 68 L68 80 M80 68 L91 81" stroke="${skin}" stroke-width="11" stroke-linecap="round"/>
    `);
  }

  function returnToTask() {
    return svg(`
      <rect x="78" y="51" width="67" height="42" rx="4" fill="#D5A96F" stroke="${ink}" stroke-width="4"/>
      <path d="M88 93 V110 M134 93 V110" stroke="${ink}" stroke-width="5"/>
      <rect x="93" y="32" width="38" height="24" rx="3" fill="#FFFFFF" stroke="${ink}" stroke-width="3"/>
      <path d="M67 27 Q28 29 27 64 Q27 85 53 89" fill="none" stroke="${green}" stroke-width="8" stroke-linecap="round"/>
      <path d="M44 77 L57 90 L43 101" fill="none" stroke="${green}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    `);
  }

  function directions() {
    return svg(`
      <rect x="33" y="13" width="94" height="94" rx="7" fill="#FFFFFF" stroke="${ink}" stroke-width="4"/>
      <path d="M50 38 L59 47 L74 29 M50 64 L59 73 L74 55 M50 89 L59 98 L74 81" fill="none" stroke="${green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M84 39 H112 M84 65 H112 M84 91 H112" stroke="#7E8B96" stroke-width="5" stroke-linecap="round"/>
    `);
  }

  const symbols = {
    student,
    feelings,
    listen,
    walk,
    putAway,
    materials,
    look,
    start,
    finished,
    wait,
    help,
    calm,
    goal,
    proud,
    next,
    break: breakTime,
    group,
    safe,
    routine,
    choose,
    return: returnToTask,
    directions
  };

  window.AACSymbols = {
    get(concept) {
      return (symbols[concept] || symbols.next)();
    }
  };
})();
