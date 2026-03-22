document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("storyForm");
  const storyText = document.getElementById("storyText");

  const saveBtn = document.getElementById("saveBtn");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");

  const pdfBtn = document.getElementById("pdfBtn");
  const mp3Btn = document.getElementById("downloadMp3Btn");

  const readBtn = document.getElementById("readAloudBtn");
  const pauseBtn = document.getElementById("pauseReadingBtn");
  const resumeBtn = document.getElementById("resumeReadingBtn");
  const stopBtn = document.getElementById("stopReadingBtn");

  const storyLanguage = document.getElementById("storyLanguage");
  const languageGuidanceText = document.getElementById("languageGuidanceText");
  const topLanguageReminder = document.getElementById("topLanguageReminder");

  const characterType = document.getElementById("characterType");
  const characterPreview = document.getElementById("characterPreview");

  const photoUpload = document.getElementById("photoUpload");
  const photoPreview = document.getElementById("photoPreview");

  const onePagerText = document.getElementById("onePagerText");
  const onePagerCharacter = document.getElementById("onePagerCharacter");
  const onePagerPhoto = document.getElementById("onePagerPhoto");
  const onePagerTitle = document.getElementById("onePagerTitle");
  const onePagerSubtitle = document.getElementById("onePagerSubtitle");

  const voiceStyle = document.getElementById("voiceStyle");
  const voiceSelect = document.getElementById("voiceSelect");

  let currentAudio = null;
  let currentAudioUrl = null;
  let currentPhotoData = "";

  const EXACT_FILIPINO_VOICES = [
    "Microsoft Blessica Online (Natural) - Filipino (Philippines)",
    "Microsoft Angelo Online (Natural) - Filipino (Philippines)"
  ];

  const EXACT_ENGLISH_VOICES = [
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Guy Online (Natural) - English (United States)"
  ];

  function updateLanguageGuidance() {
    const lang = storyLanguage.value;

    if (lang === "tl") {
      const msg =
        "Tagalog selected: please type your transition, setting, feeling, support, goal, and details in Tagalog too so the story stays natural and coherent.";
      languageGuidanceText.textContent = msg;
      if (topLanguageReminder) topLanguageReminder.textContent = msg;
      updatePlaceholders("tl");
    } else if (lang === "ilo") {
      const msg =
        "Ilokano selected: please type your transition, setting, feeling, support, goal, and details in Ilokano too so the story stays coherent. Audio may still use the Filipino voice for smoother speech.";
      languageGuidanceText.textContent = msg;
      if (topLanguageReminder) topLanguageReminder.textContent = msg;
      updatePlaceholders("ilo");
    } else {
      const msg =
        "English selected: please type all inputs in English. If you switch to Tagalog or Ilokano, change the fill-ins to the same language.";
      languageGuidanceText.textContent = msg;
      if (topLanguageReminder) topLanguageReminder.textContent = msg;
      updatePlaceholders("en");
    }
  }

  function updatePlaceholders(lang) {
    const name = document.getElementById("name");
    const setting = document.getElementById("setting");
    const emotion = document.getElementById("emotion");
    const support = document.getElementById("support");
    const goal = document.getElementById("goal");
    const customTransition = document.getElementById("customTransition");
    const details = document.getElementById("details");

    if (lang === "tl") {
      name.placeholder = "hal. Mia";
      setting.placeholder = "hal. silid-aralan, kantina, therapy room";
      emotion.placeholder = "hal. kinakabahan, masaya, naiinis";
      support.placeholder = "hal. timer, paalala ng guro, reward chart";
      goal.placeholder = "hal. manatiling kalmado, sumunod sa direksyon";
      customTransition.placeholder = "hal. pag-aayos ng gamit pagkatapos ng art class";
      details.placeholder = "hal. mahilig sa bituin, mas tumutugon sa papuri";
      return;
    }

    if (lang === "ilo") {
      name.placeholder = "kas pangarigan, Mia";
      setting.placeholder = "kas pangarigan, classroom, canteen, therapy room";
      emotion.placeholder = "kas pangarigan, agbuteng, naragsak, naupay";
      support.placeholder = "kas pangarigan, timer, pammalagip ti maestro, reward chart";
      goal.placeholder = "kas pangarigan, agtalna, sumurot kadagiti bilin";
      customTransition.placeholder = "kas pangarigan, panagurnos kalpasan ti art class";
      details.placeholder = "kas pangarigan, kayatna ti bituen, nasayaat no maidaydayaw";
      return;
    }

    name.placeholder = "e.g., Mia";
    setting.placeholder = "e.g., classroom, canteen, therapy room";
    emotion.placeholder = "e.g., nervous, excited, frustrated";
    support.placeholder = "e.g., timer, teacher reminder, reward chart";
    goal.placeholder = "e.g., stay calm, follow directions, wait for turn";
    customTransition.placeholder = "e.g., packing up after art class";
    details.placeholder = "e.g., likes stars, responds well to praise, sits near teacher";
  }

  function updateCharacter() {
    const char = characterType.value || "🧒";
    characterPreview.textContent = char;
    onePagerCharacter.textContent = char;
  }

  function updatePhotoDisplays() {
    if (currentPhotoData) {
      photoPreview.src = currentPhotoData;
      onePagerPhoto.src = currentPhotoData;
      photoPreview.classList.remove("hidden");
      onePagerPhoto.classList.remove("hidden");
      onePagerCharacter.classList.add("hidden");
    } else {
      photoPreview.classList.add("hidden");
      onePagerPhoto.classList.add("hidden");
      onePagerCharacter.classList.remove("hidden");
    }
  }

  function populateVoiceList() {
    if (!voiceSelect) return;

    voiceSelect.innerHTML = `<option value="">Auto-select allowed voice</option>`;

    const lang = storyLanguage.value;
    const voices = lang === "en" ? EXACT_ENGLISH_VOICES : EXACT_FILIPINO_VOICES;

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice;
      option.textContent = voice;
      voiceSelect.appendChild(option);
    });
  }

  function getTransitionValue() {
    const transition = document.getElementById("transition").value;
    const customTransition = document.getElementById("customTransition").value.trim();

    if (transition === "custom" && customTransition) {
      return customTransition;
    }
    return transition;
  }

  function generateStepsEnglish(transitionText, name) {
    const lower = transitionText.toLowerCase();

    if (lower.includes("starting class")) {
      return [
        `${name} walks to the learning area calmly.`,
        `${name} gets ready for class.`,
        `${name} looks and listens for directions.`,
        `${name} starts the task step by step.`
      ];
    }

    if (lower.includes("switching")) {
      return [
        `${name} finishes the first activity.`,
        `${name} puts materials away.`,
        `${name} listens to the next direction.`,
        `${name} moves calmly to the next activity.`
      ];
    }

    if (lower.includes("break")) {
      return [
        `${name} listens when it is time for break.`,
        `${name} moves safely.`,
        `${name} enjoys the break.`,
        `${name} returns when break time is done.`
      ];
    }

    if (lower.includes("ending") || lower.includes("dismissal")) {
      return [
        `${name} finishes the last task.`,
        `${name} packs things carefully.`,
        `${name} waits calmly.`,
        `${name} goes home safely.`
      ];
    }

    if (lower.includes("moving")) {
      return [
        `${name} listens to where to go.`,
        `${name} walks calmly and safely.`,
        `${name} stays with the teacher or group.`,
        `${name} gets ready in the new place.`
      ];
    }

    return [
      `${name} listens to the direction.`,
      `${name} takes one step at a time.`,
      `${name} can ask for help if needed.`,
      `${name} tries their best.`
    ];
  }

  function buildStoryEnglish() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const emotion = document.getElementById("emotion").value.trim();
    const support = document.getElementById("support").value.trim();
    const goal = document.getElementById("goal").value.trim();
    const details = document.getElementById("details").value.trim();
    const transitionText = getTransitionValue();

    if (!name || !setting || !emotion || !transitionText) {
      alert("Please complete the required fields first.");
      return "";
    }

    const steps = generateStepsEnglish(transitionText, name);

    let story = `${name} is learning about ${transitionText} in the ${setting}.\n\n`;
    story += `Sometimes ${name} may feel ${emotion}. That is okay.\n\n`;
    story += `${transitionText} is important because it helps ${name} know what to do and feel more ready.\n\n`;

    if (support) {
      story += `${name} can use ${support} for help.\n\n`;
    }

    story += `Here are the steps ${name} can follow:\n`;
    steps.forEach((step, index) => {
      story += `${index + 1}. ${step}\n`;
    });

    if (goal) {
      story += `\nThe goal is for ${name} to ${goal}.\n`;
    }

    if (details) {
      story += `\nHelpful personal details: ${details}.\n`;
    }

    story += `\n${name} can stay calm, ask for help, and try again.\n`;
    story += `${name} can feel proud for trying.`;

    return story;
  }

  function buildStoryTagalog() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const emotion = document.getElementById("emotion").value.trim();
    const support = document.getElementById("support").value.trim();
    const goal = document.getElementById("goal").value.trim();
    const details = document.getElementById("details").value.trim();
    const transitionText = getTransitionValue();

    if (!name || !setting || !emotion || !transitionText) {
      alert("Please complete the required fields first.");
      return "";
    }

    const steps = generateStepsEnglish(transitionText, name);

    let story = `Si ${name} ay nag-aaral tungkol sa ${transitionText} sa ${setting}.\n\n`;
    story += `Minsan maaaring makaramdam si ${name} ng ${emotion}. Ayos lang iyon.\n\n`;
    story += `Mahalaga ang ${transitionText} dahil tinutulungan nito si ${name} na malaman kung ano ang gagawin at maging mas handa.\n\n`;

    if (support) {
      story += `Maaaring gamitin ni ${name} ang ${support} para makatulong.\n\n`;
    }

    story += `Narito ang mga hakbang na maaaring sundan ni ${name}:\n`;
    steps.forEach((step, index) => {
      story += `${index + 1}. ${step}\n`;
    });

    if (goal) {
      story += `\nAng layunin ay matulungan si ${name} na ${goal}.\n`;
    }

    if (details) {
      story += `\nMahahalagang personal na detalye: ${details}.\n`;
    }

    story += `\nMaaaring huminga nang malalim si ${name}, humingi ng tulong, at subukang muli.\n`;
    story += `Maaaring ipagmalaki ni ${name} ang kanyang pagsisikap.`;

    return story;
  }

  function buildStoryIlokano() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const emotion = document.getElementById("emotion").value.trim();
    const support = document.getElementById("support").value.trim();
    const goal = document.getElementById("goal").value.trim();
    const details = document.getElementById("details").value.trim();
    const transitionText = getTransitionValue();

    if (!name || !setting || !emotion || !transitionText) {
      alert("Please complete the required fields first.");
      return "";
    }

    const steps = generateStepsEnglish(transitionText, name);

    let story = `Ni ${name} ket agadal maipapan iti ${transitionText} idiay ${setting}.\n\n`;
    story += `No dadduma, mabalin a marikna ni ${name} ti ${emotion}. Naimbag laeng dayta.\n\n`;
    story += `Napateg ti ${transitionText} gapu ta tumulong daytoy ken ${name} tapno maammuanna no ania ti aramiden ken tapno agbalin a nakasagana.\n\n`;

    if (support) {
      story += `Mabalin a usaren ni ${name} ti ${support} a tumulong kenkuana.\n\n`;
    }

    story += `Dagitoy ti addang a mabalin a suroten ni ${name}:\n`;
    steps.forEach((step, index) => {
      story += `${index + 1}. ${step}\n`;
    });

    if (goal) {
      story += `\nTi panggep ket tapno matulungan ni ${name} a ${goal}.\n`;
    }

    if (details) {
      story += `\nNapateg a personal a detalye: ${details}.\n`;
    }

    story += `\nMabalin a aganges a nauneg ni ${name}, agkiddaw iti tulong, ken agpadas manen.\n`;
    story += `Mabalin a marikna ni ${name} ti kinaproud iti panangpadasna.`;

    return story;
  }

  function buildStory() {
    const lang = storyLanguage.value;
    if (lang === "tl") return buildStoryTagalog();
    if (lang === "ilo") return buildStoryIlokano();
    return buildStoryEnglish();
  }

  function renderOnePager() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const transitionText = getTransitionValue() || "A personalized transition story";

    onePagerTitle.textContent = name ? `${name}'s Social Story` : "My Social Story";
    onePagerSubtitle.textContent = setting ? `${transitionText} in the ${setting}` : transitionText;
    onePagerText.textContent = storyText.value.trim() || "Your generated story will appear here.";
  }

  function getVoiceStyleForServer() {
    if (voiceSelect.value) {
      const lower = voiceSelect.value.toLowerCase();
      if (lower.includes("angelo") || lower.includes("guy")) return "masculine";
      if (lower.includes("blessica") || lower.includes("aria")) return "feminine";
    }

    if (voiceStyle.value === "masculine") return "masculine";
    return "feminine";
  }

  async function getAudio(text) {
    const language = storyLanguage.value;
    const style = getVoiceStyleForServer();

    const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000" : "";
const res = await fetch(`${API_BASE}/api/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        language,
        style
      })
    });

    if (!res.ok) {
      throw new Error("TTS failed");
    }

    return res.blob();
  }

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const story = buildStory();
    if (!story) return;

    storyText.value = story;
    renderOnePager();
  });

  storyText.addEventListener("input", renderOnePager);
  storyLanguage.addEventListener("change", function () {
    updateLanguageGuidance();
    populateVoiceList();
  });

  characterType.addEventListener("change", updateCharacter);

  photoUpload.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
      currentPhotoData = "";
      updatePhotoDisplays();
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      currentPhotoData = e.target.result;
      updatePhotoDisplays();
    };
    reader.readAsDataURL(file);
  });

  readBtn.addEventListener("click", async () => {
    const text = storyText.value.trim();
    if (!text) {
      alert("Generate story first.");
      return;
    }

    try {
      stopAudio();
      const blob = await getAudio(text);
      currentAudioUrl = URL.createObjectURL(blob);
      currentAudio = new Audio(currentAudioUrl);
      currentAudio.play();
    } catch (error) {
      alert("Read aloud failed.");
    }
  });

  pauseBtn.addEventListener("click", () => {
    if (currentAudio) currentAudio.pause();
  });

  resumeBtn.addEventListener("click", () => {
    if (currentAudio) currentAudio.play();
  });

  stopBtn.addEventListener("click", stopAudio);

  mp3Btn.addEventListener("click", async () => {
    const text = storyText.value.trim();
    if (!text) {
      alert("Generate story first.");
      return;
    }

    try {
      const blob = await getAudio(text);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "story.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert("MP3 download failed.");
    }
  });

  pdfBtn.addEventListener("click", async () => {
    const target = document.getElementById("onePagerOutput");
    if (!storyText.value.trim()) {
      alert("Generate story first.");
      return;
    }

    try {
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let finalWidth = imgWidth;
      let finalHeight = imgHeight;

      if (finalHeight > pageHeight - 20) {
        finalHeight = pageHeight - 20;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = 10;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
      pdf.save("story.pdf");
    } catch (error) {
      alert("PDF download failed.");
    }
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(storyText.value);
    alert("Copied!");
  });

  saveBtn.addEventListener("click", () => {
    const savedStories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]");
    savedStories.unshift({
      id: Date.now(),
      title: document.getElementById("name").value.trim() || "Student Story",
      text: storyText.value,
      language: storyLanguage.value,
      character: characterType.value,
      photo: currentPhotoData,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("teacherSocialStories", JSON.stringify(savedStories));
    renderSavedStories();
    alert("Saved!");
  });

  function renderSavedStories() {
    const stories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]");

    if (!stories.length) {
      document.getElementById("savedStories").innerHTML = `<p class="muted">No saved stories yet.</p>`;
      return;
    }

    document.getElementById("savedStories").innerHTML = stories.map(story => `
      <div class="saved-item">
        <h4>${story.title}</h4>
        <p><strong>Saved:</strong> ${story.date}</p>
        <div class="saved-character-row">
          <div class="saved-character-icon">${story.character || "🧒"}</div>
          ${story.photo ? `<img src="${story.photo}" class="saved-character-photo" alt="Saved student photo" />` : ""}
        </div>
        <div class="saved-actions">
          <button class="btn small-btn" onclick="loadStory(${story.id})">Load</button>
          <button class="btn secondary-btn small-btn" onclick="deleteStory(${story.id})">Delete</button>
        </div>
      </div>
    `).join("");
  }

  window.loadStory = function (id) {
    const stories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]");
    const story = stories.find(s => s.id === id);
    if (!story) return;

    storyText.value = story.text || "";
    storyLanguage.value = story.language || "en";
    characterType.value = story.character || "🧒";
    currentPhotoData = story.photo || "";

    updateLanguageGuidance();
    populateVoiceList();
    updateCharacter();
    updatePhotoDisplays();
    renderOnePager();
  };

  window.deleteStory = function (id) {
    const stories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]")
      .filter(s => s.id !== id);
    localStorage.setItem("teacherSocialStories", JSON.stringify(stories));
    renderSavedStories();
  };

  clearBtn.addEventListener("click", () => {
    form.reset();
    storyText.value = "";
    onePagerText.textContent = "";
    currentPhotoData = "";
    stopAudio();
    updateLanguageGuidance();
    updateCharacter();
    updatePhotoDisplays();
    populateVoiceList();
    renderOnePager();
  });

  updateLanguageGuidance();
  updateCharacter();
  updatePhotoDisplays();
  populateVoiceList();
  renderOnePager();
  renderSavedStories();
});