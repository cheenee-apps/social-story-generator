document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("storyForm");
  const storyText = document.getElementById("storyText");
  const transition = document.getElementById("transition");
  const customTransition = document.getElementById("customTransition");
  const customTransitionGroup = document.getElementById("customTransitionGroup");
  const emotion = document.getElementById("emotion");
  const customEmotion = document.getElementById("customEmotion");
  const customEmotionGroup = document.getElementById("customEmotionGroup");
  const behaviorFocus = document.getElementById("behaviorFocus");
  const readingLevel = document.getElementById("readingLevel");
  const visualStyle = document.getElementById("visualStyle");
  const formProgress = document.getElementById("formProgress");

  const saveBtn = document.getElementById("saveBtn");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const pdfBtn = document.getElementById("pdfBtn");
  const mp3Btn = document.getElementById("downloadMp3Btn");
  const readBtn = document.getElementById("readAloudBtn");
  const pauseBtn = document.getElementById("pauseReadingBtn");
  const resumeBtn = document.getElementById("resumeReadingBtn");
  const stopBtn = document.getElementById("stopReadingBtn");
  const actionStatus = document.getElementById("actionStatus");

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
  const onePagerOutput = document.getElementById("onePagerOutput");
  const visualStoryPanels = document.getElementById("visualStoryPanels");
  const voiceStyle = document.getElementById("voiceStyle");
  const voiceSelect = document.getElementById("voiceSelect");

  let currentAudio = null;
  let currentAudioUrl = null;
  let currentUtterance = null;
  let currentPhotoData = "";

  const VOICES = {
    en: [
      { id: "en-US-AriaNeural", label: "Aria — English, feminine" },
      { id: "en-US-GuyNeural", label: "Guy — English, masculine" }
    ],
    fil: [
      { id: "fil-PH-BlessicaNeural", label: "Blessica — Filipino, feminine" },
      { id: "fil-PH-AngeloNeural", label: "Angelo — Filipino, masculine" }
    ]
  };

  const BEHAVIOR_TRANSLATIONS = {
    tl: {
      "waiting for a turn": "paghihintay ng aking pagkakataon",
      "following directions": "pagsunod sa mga tagubilin",
      "asking for help": "paghingi ng tulong",
      "keeping hands and feet safe": "pagpapanatiling ligtas ng aking mga kamay at paa",
      "using a calm voice": "paggamit ng mahinahong boses",
      "coping with changes": "pagharap sa mga pagbabago",
      "joining a group activity": "pagsali sa gawaing panggrupo",
      "finishing a task": "pagtatapos ng gawain",
      "taking a break appropriately": "maayos na pagpapahinga",
      "returning to the task": "pagbabalik sa gawain"
    },
    ilo: {
      "waiting for a turn": "panaguray iti turno",
      "following directions": "panangsurot kadagiti bilin",
      "asking for help": "panagkiddaw iti tulong",
      "keeping hands and feet safe": "panangsalimetmet kadagiti ima ken saka a natalged",
      "using a calm voice": "panagusar iti natalna a timek",
      "coping with changes": "panangawat kadagiti panagbalbaliw",
      "joining a group activity": "pannakiraman iti aktibidad ti grupo",
      "finishing a task": "panangleppas iti trabaho",
      "taking a break appropriately": "ummiso a panaginana",
      "returning to the task": "panagsubli iti trabaho"
    }
  };

  const TRANSITION_TRANSLATIONS = {
    tl: {
      "starting class": "pagsisimula ng klase",
      "switching activities": "paglipat ng gawain",
      "going to break": "pagpunta sa oras ng pahinga",
      "ending class": "pagtatapos ng klase",
      "moving to another room": "paglipat sa ibang silid",
      "following a routine": "pagsunod sa routine"
    },
    ilo: {
      "starting class": "panangrugi ti klase",
      "switching activities": "panagsukat iti aktibidad",
      "going to break": "ipapan iti panaginana",
      "ending class": "panagleppas ti klase",
      "moving to another room": "ipapan iti sabali a kuarto",
      "following a routine": "panangsurot iti rutina"
    }
  };

  const EMOTION_OPTIONS = {
    en: [
      ["nervous", "Nervous"],
      ["excited", "Excited"],
      ["frustrated", "Frustrated"],
      ["overwhelmed", "Overwhelmed"],
      ["worried", "Worried"],
      ["angry", "Angry"],
      ["sad", "Sad"],
      ["unsure", "Unsure"],
      ["calm", "Calm"]
    ],
    tl: [
      ["kinakabahan", "Kinakabahan"],
      ["nasasabik", "Nasasabik"],
      ["naiinis", "Naiinis"],
      ["nahihirapan", "Nahihirapan"],
      ["nag-aalala", "Nag-aalala"],
      ["galit", "Galit"],
      ["malungkot", "Malungkot"],
      ["hindi sigurado", "Hindi sigurado"],
      ["kalmado", "Kalmado"]
    ],
    ilo: [
      ["madanagan", "Madanagan"],
      ["naragsak", "Naragsak"],
      ["naupay", "Naupay"],
      ["narigatan", "Narigatan"],
      ["agdanag", "Agdanag"],
      ["nakapungtot", "Nakapungtot"],
      ["naliday", "Naliday"],
      ["saan a sigurado", "Saan a sigurado"],
      ["natalna", "Natalna"]
    ]
  };

  function setStatus(message, type = "") {
    actionStatus.textContent = message;
    actionStatus.className = `status-message ${type}`.trim();
  }

  function capitalizeFirst(text) {
    const value = String(text || "").trim();
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  }

  function getTransitionValue() {
    if (transition.value === "custom") return customTransition.value.trim();
    const lang = storyLanguage.value;
    return TRANSITION_TRANSLATIONS[lang]?.[transition.value] || transition.value;
  }

  function getEmotionValue() {
    if (emotion.value === "custom") return customEmotion.value.trim();
    return emotion.value;
  }

  function getBehaviorValue(language) {
    const value = behaviorFocus.value;
    if (!value || language === "en") return value;
    return BEHAVIOR_TRANSLATIONS[language]?.[value] || value;
  }

  function updateConditionalFields() {
    const customTransitionIsActive = transition.value === "custom";
    customTransitionGroup.classList.toggle("hidden", !customTransitionIsActive);
    customTransition.required = customTransitionIsActive;

    const customEmotionIsActive = emotion.value === "custom";
    customEmotionGroup.classList.toggle("hidden", !customEmotionIsActive);
    customEmotion.required = customEmotionIsActive;

    updateFormProgress();
  }

  function isComposedFieldComplete(selectElement, customElement) {
    if (!selectElement.value) return false;
    if (selectElement.value !== "custom") return true;
    return Boolean(customElement.value.trim());
  }

  function updateFormProgress() {
    const requiredStates = [
      Boolean(document.getElementById("name").value.trim()),
      isComposedFieldComplete(transition, customTransition),
      Boolean(document.getElementById("setting").value.trim()),
      isComposedFieldComplete(emotion, customEmotion)
    ];
    const completeCount = requiredStates.filter(Boolean).length;
    formProgress.textContent = `${completeCount} of 4 required fields complete`;
    formProgress.classList.toggle("is-ready", completeCount === 4);

    form.querySelectorAll(".form-group").forEach((group) => {
      const field = group.querySelector("input:not([type='file']), select, textarea");
      if (!field || group.classList.contains("hidden")) {
        group.classList.remove("is-complete");
        return;
      }
      const hasValue = Boolean(String(field.value || "").trim());
      group.classList.toggle("is-complete", hasValue && field.checkValidity());
    });
  }

  function updateLanguageGuidance() {
    const lang = storyLanguage.value;
    let message;

    if (lang === "tl") {
      message = "Tagalog selected: type custom situations, settings, supports, goals, and details in Tagalog so the story stays natural.";
    } else if (lang === "ilo") {
      message = "Ilokano selected: type custom situations, settings, supports, goals, and details in Ilokano. Audio currently uses a Filipino voice.";
    } else {
      message = "English selected: type all custom inputs in English. Change the fill-ins if you switch languages.";
    }

    languageGuidanceText.textContent = message;
    topLanguageReminder.textContent = message;
    populateEmotionList(lang);
    updatePlaceholders(lang);
  }

  function populateEmotionList(lang) {
    const selectedKey = emotion.selectedOptions[0]?.dataset.key || "";
    emotion.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = lang === "tl"
      ? "Pumili ng nararamdaman"
      : lang === "ilo"
        ? "Agpili iti rikna"
        : "Select a feeling";
    emotion.appendChild(placeholder);

    EMOTION_OPTIONS[lang].forEach(([value, label], index) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.dataset.key = String(index);
      if (selectedKey === String(index)) option.selected = true;
      emotion.appendChild(option);
    });

    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = lang === "tl"
      ? "Ibang nararamdaman"
      : lang === "ilo"
        ? "Sabali a rikna"
        : "Another feeling";
    customOption.dataset.key = "custom";
    if (selectedKey === "custom") customOption.selected = true;
    emotion.appendChild(customOption);
    updateConditionalFields();
  }

  function updatePlaceholders(lang) {
    const fields = {
      name: document.getElementById("name"),
      setting: document.getElementById("setting"),
      support: document.getElementById("support"),
      goal: document.getElementById("goal"),
      details: document.getElementById("details")
    };

    if (lang === "tl") {
      fields.name.placeholder = "hal. Mia";
      fields.setting.placeholder = "hal. silid-aralan, kantina, therapy room";
      fields.support.placeholder = "hal. visual schedule, timer, paalala ng guro";
      fields.goal.placeholder = "hal. manatiling kalmado, sumunod sa direksyon";
      customTransition.placeholder = "hal. pag-aayos ng gamit pagkatapos ng art class";
      customEmotion.placeholder = "hal. nagmamadali, hindi kasali, bigo";
      fields.details.placeholder = "hal. mahilig sa bituin, mas tumutugon sa papuri";
    } else if (lang === "ilo") {
      fields.name.placeholder = "kas pangarigan, Mia";
      fields.setting.placeholder = "kas pangarigan, classroom, canteen, therapy room";
      fields.support.placeholder = "kas pangarigan, timer, pammalagip ti maestro";
      fields.goal.placeholder = "kas pangarigan, agtalna, sumurot kadagiti bilin";
      customTransition.placeholder = "kas pangarigan, panagurnos kalpasan ti art class";
      customEmotion.placeholder = "kas pangarigan, madanagan wenno naliday";
      fields.details.placeholder = "kas pangarigan, kayatna ti bituen, nasayaat no maidaydayaw";
    } else {
      fields.name.placeholder = "e.g., Mia";
      fields.setting.placeholder = "e.g., classroom, canteen, therapy room";
      fields.support.placeholder = "Choose or type a support";
      fields.goal.placeholder = "Choose or type a goal";
      customTransition.placeholder = "e.g., packing up after art class";
      customEmotion.placeholder = "e.g., left out, rushed, or disappointed";
      fields.details.placeholder = "e.g., likes stars, responds well to praise, sits near teacher";
    }
  }

  function updateCharacter() {
    const character = characterType.value || "🧒";
    characterPreview.textContent = character;
    onePagerCharacter.textContent = character;
    renderOnePager();
  }

  function updatePhotoDisplays() {
    const hasPhoto = Boolean(currentPhotoData);
    photoPreview.classList.toggle("hidden", !hasPhoto);
    onePagerPhoto.classList.toggle("hidden", !hasPhoto);
    onePagerCharacter.classList.toggle("hidden", hasPhoto);

    if (hasPhoto) {
      photoPreview.src = currentPhotoData;
      onePagerPhoto.src = currentPhotoData;
    } else {
      photoPreview.removeAttribute("src");
      onePagerPhoto.removeAttribute("src");
    }
  }

  function populateVoiceList() {
    voiceSelect.innerHTML = '<option value="">Auto-select an available voice</option>';
    if (!("speechSynthesis" in window)) {
      voiceSelect.disabled = true;
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Browser read-aloud is not available";
      voiceSelect.appendChild(option);
      return;
    }

    voiceSelect.disabled = false;
    const voices = window.speechSynthesis.getVoices();
    const languagePrefixes = storyLanguage.value === "en" ? ["en"] : ["fil", "tl"];
    const matchingVoices = voices.filter((voice) =>
      languagePrefixes.some((prefix) => voice.lang && voice.lang.toLowerCase().startsWith(prefix))
    );
    const voicesToShow = matchingVoices.length ? matchingVoices : voices;

    if (!voicesToShow.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Browser voices are loading";
      voiceSelect.appendChild(option);
      return;
    }

    voicesToShow.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} — ${voice.lang || "browser voice"}`;
      voiceSelect.appendChild(option);
    });
  }

  function getStepLimit() {
    if (readingLevel.value === "early") return 3;
    if (readingLevel.value === "independent") return 5;
    return 4;
  }

  function fitSteps(steps) {
    const limit = getStepLimit();
    if (steps.length >= limit) return steps.slice(0, limit);
    const result = [...steps];
    while (result.length < limit) {
      result.push(result.length === limit - 1 ? "I notice that I finished the routine." : "I take the next step calmly.");
    }
    return result;
  }

  function generateStepsEnglish() {
    const stepSets = {
      "starting class": [
        "I walk to the learning area calmly.",
        "I put my things in the right place.",
        "I get the materials I need.",
        "I look and listen for directions.",
        "I begin the first task."
      ],
      "switching activities": [
        "I finish the part I am working on.",
        "I put my materials away.",
        "I check what comes next.",
        "I listen to the next direction.",
        "I move calmly to the next activity."
      ],
      "going to break": [
        "I listen when it is time for break.",
        "I move safely to the break area.",
        "I choose a safe break activity.",
        "I notice when break is almost finished.",
        "I return when break time is done."
      ],
      "ending class": [
        "I finish the last task.",
        "I put my materials away.",
        "I pack my things carefully.",
        "I wait calmly for directions.",
        "I leave safely when it is time."
      ],
      "moving to another room": [
        "I listen to where I need to go.",
        "I gather the things I need.",
        "I walk calmly and safely.",
        "I stay with my teacher or group.",
        "I get ready in the new place."
      ],
      "following a routine": [
        "I look at the first step.",
        "I complete one step at a time.",
        "I check what comes next.",
        "I ask for help if I need it.",
        "I notice when the routine is finished."
      ]
    };

    return fitSteps(stepSets[transition.value] || [
      "I listen to the direction.",
      "I look at what I need to do.",
      "I take one step at a time.",
      "I ask for help if I need it.",
      "I notice when I am finished."
    ]);
  }

  function generateStepsTagalog() {
    const stepSets = {
      "starting class": [
        "Kalmado akong pumupunta sa lugar ng pag-aaral.",
        "Inilalagay ko ang aking mga gamit sa tamang lugar.",
        "Inihahanda ko ang mga materyales na kailangan ko.",
        "Tumitingin at nakikinig ako sa mga tagubilin.",
        "Sinisimulan ko ang unang gawain."
      ],
      "switching activities": [
        "Tinatapos ko ang bahaging ginagawa ko.",
        "Inaayos ko ang aking mga materyales.",
        "Tinitingnan ko kung ano ang susunod.",
        "Nakikinig ako sa susunod na tagubilin.",
        "Kalmado akong lumilipat sa susunod na gawain."
      ],
      "going to break": [
        "Nakikinig ako kapag oras na ng pahinga.",
        "Ligtas akong pumupunta sa lugar ng pahinga.",
        "Pumipili ako ng ligtas na gawain.",
        "Napapansin ko kapag malapit nang matapos ang pahinga.",
        "Bumabalik ako kapag tapos na ang pahinga."
      ],
      "ending class": [
        "Tinatapos ko ang huling gawain.",
        "Inaayos ko ang aking mga materyales.",
        "Maingat kong iniimpake ang aking mga gamit.",
        "Kalmado akong naghihintay ng tagubilin.",
        "Ligtas akong umaalis kapag oras na."
      ],
      "moving to another room": [
        "Nakikinig ako kung saan ako pupunta.",
        "Kinukuha ko ang mga bagay na kailangan ko.",
        "Kalmado at ligtas akong naglalakad.",
        "Nananatili ako kasama ng guro o grupo.",
        "Naghahanda ako sa bagong lugar."
      ],
      "following a routine": [
        "Tinitingnan ko ang unang hakbang.",
        "Ginagawa ko ang bawat hakbang nang paisa-isa.",
        "Tinitingnan ko kung ano ang susunod.",
        "Humihingi ako ng tulong kung kailangan ko.",
        "Napapansin ko kapag tapos na ang gawain."
      ]
    };

    const generic = [
      "Nakikinig ako sa tagubilin.",
      "Tinitingnan ko ang kailangan kong gawin.",
      "Ginagawa ko ang bawat hakbang nang paisa-isa.",
      "Humihingi ako ng tulong kung kailangan ko.",
      "Napapansin ko kapag tapos na ako."
    ];
    return (stepSets[transition.value] || generic).slice(0, getStepLimit());
  }

  function generateStepsIlokano() {
    const stepSets = {
      "starting class": [
        "Natalnaak a mapan iti lugar ti panagadal.",
        "Ikabilko dagiti gamitko iti umno a lugar.",
        "Isaganak dagiti kasapulak a materyales.",
        "Agkitak ken dumngegak kadagiti bilin.",
        "Rugian ko ti umuna a trabaho."
      ],
      "switching activities": [
        "Leppasek ti trabahok.",
        "Urnosek dagiti materyalesko.",
        "Kitaek no ania ti sumaruno.",
        "Dumngegak iti sumaruno a bilin.",
        "Natalnaak a mapan iti sumaruno nga aktibidad."
      ],
      "going to break": [
        "Dumngegak no oras ti panaginana.",
        "Natalgedak a mapan iti lugar ti panaginana.",
        "Agpiliak iti natalged nga aramiden.",
        "Mapaneknekak no asidegen ti panagleppas ti panaginana.",
        "Agsubliak no nalpasen ti panaginana."
      ],
      "ending class": [
        "Leppasek ti maudi a trabaho.",
        "Urnosek dagiti materyalesko.",
        "Naannadko nga ipon dagiti gamitko.",
        "Natalnaak nga aguray iti bilin.",
        "Natalgedak a mapan no orasnan."
      ],
      "moving to another room": [
        "Dumngegak no sadino ti papanak.",
        "Alaek dagiti kasapulak.",
        "Natalna ken natalgedak a magna.",
        "Makikaduaak iti maestro wenno grupo.",
        "Agsaganak iti baro a lugar."
      ],
      "following a routine": [
        "Kitaek ti umuna nga addang.",
        "Aramidek ti tunggal addang a saggaysa.",
        "Kitaek no ania ti sumaruno.",
        "Agkiddawak iti tulong no kasapulan.",
        "Mapaneknekak no nalpasen ti trabaho."
      ]
    };

    const generic = [
      "Dumngegak iti bilin.",
      "Kitaek ti kasapulan nga aramidek.",
      "Aramidek ti tunggal addang a saggaysa.",
      "Agkiddawak iti tulong no kasapulan.",
      "Mapaneknekak no nalpasen ti trabahok."
    ];
    return (stepSets[transition.value] || generic).slice(0, getStepLimit());
  }

  function addNumberedSteps(parts, steps) {
    parts.push(steps.map((step, index) => `${index + 1}. ${step}`).join("\n"));
  }

  function buildStoryEnglish() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const feeling = getEmotionValue();
    const support = document.getElementById("support").value.trim();
    const goal = document.getElementById("goal").value.trim();
    const details = document.getElementById("details").value.trim();
    const transitionText = getTransitionValue();
    const behavior = getBehaviorValue("en");
    const parts = [];

    if (readingLevel.value === "early") {
      parts.push(`My name is ${name}.`);
      parts.push(`I am learning about ${transitionText} in the ${setting}.`);
      parts.push(`I may feel ${feeling}. My feelings are okay.`);
    } else if (readingLevel.value === "independent") {
      parts.push(`My name is ${name}. I am learning how to handle ${transitionText} in the ${setting}.`);
      parts.push(`Sometimes I may feel ${feeling}. Feelings are okay, and I can choose a safe next step.`);
      parts.push(`${capitalizeFirst(transitionText)} helps me understand what is happening and what I can do next.`);
    } else {
      parts.push(`My name is ${name}. I am learning about ${transitionText} in the ${setting}.`);
      parts.push(`Sometimes I may feel ${feeling}. That is okay.`);
      parts.push(`${capitalizeFirst(transitionText)} can feel easier when I know the steps.`);
    }

    if (support) parts.push(`I can use ${support} when I need support.`);
    parts.push("Here are the steps I can follow:");
    addNumberedSteps(parts, generateStepsEnglish());
    if (behavior) parts.push(`I can also practice ${behavior}.`);
    if (goal) parts.push(`My goal is to ${goal}.`);
    if (details) parts.push(`My teachers can use what they know about me, such as ${details}, to help me feel ready.`);
    parts.push("I can stay calm, ask for help, and try again. I can feel proud of my effort.");
    return parts.join("\n\n");
  }

  function buildStoryTagalog() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const feeling = getEmotionValue();
    const support = document.getElementById("support").value.trim();
    const goal = document.getElementById("goal").value.trim();
    const details = document.getElementById("details").value.trim();
    const transitionText = getTransitionValue();
    const behavior = getBehaviorValue("tl");
    const parts = [
      `Ako si ${name}. Natututo ako tungkol sa ${transitionText} sa ${setting}.`,
      `Minsan ay maaari akong makaramdam ng ${feeling}. Ayos lang ang nararamdaman ko.`,
      `Mas nagiging madali ang ${transitionText} kapag alam ko ang mga hakbang.`
    ];

    if (support) parts.push(`Maaari kong gamitin ang ${support} kapag kailangan ko ng tulong.`);
    parts.push("Narito ang mga hakbang na maaari kong sundan:");
    addNumberedSteps(parts, generateStepsTagalog());
    if (behavior) parts.push(`Maaari ko ring sanayin ang ${behavior}.`);
    if (goal) parts.push(`Ang layunin ko ay ${goal}.`);
    if (details) parts.push(`Magagamit ng mga guro ko ang alam nila tungkol sa akin—${details}—upang matulungan akong maging handa.`);
    parts.push("Maaari akong huminga nang malalim, humingi ng tulong, at subukang muli. Maaari kong ipagmalaki ang aking pagsisikap.");
    return parts.join("\n\n");
  }

  function buildStoryIlokano() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const feeling = getEmotionValue();
    const support = document.getElementById("support").value.trim();
    const goal = document.getElementById("goal").value.trim();
    const details = document.getElementById("details").value.trim();
    const transitionText = getTransitionValue();
    const behavior = getBehaviorValue("ilo");
    const parts = [
      `Siak ni ${name}. Agad-adalak maipapan iti ${transitionText} idiay ${setting}.`,
      `No dadduma, mabalin a mariknak ti ${feeling}. Naimbag laeng ti riknak.`,
      `Nalaka ti ${transitionText} no ammok dagiti addang.`
    ];

    if (support) parts.push(`Mabalin nga usarak ti ${support} no kasapulak ti tulong.`);
    parts.push("Dagitoy dagiti addang a mabalin a surotek:");
    addNumberedSteps(parts, generateStepsIlokano());
    if (behavior) parts.push(`Mabalin ko pay a praktisen ti ${behavior}.`);
    if (goal) parts.push(`Ti panggepko ket ${goal}.`);
    if (details) parts.push(`Mausar dagiti maestro ti ammoda maipapan kaniak—${details}—tapno matulongandak nga agsagana.`);
    parts.push("Mabalin nga agangesak a nauneg, agkiddaw iti tulong, ken agpadas manen. Mabalin a mariknak ti kinaproudek iti panangpadas.");
    return parts.join("\n\n");
  }

  function buildStory() {
    if (!form.checkValidity() || !getTransitionValue() || !getEmotionValue()) {
      form.reportValidity();
      setStatus("Please complete all required fields before generating.", "error");
      return "";
    }

    if (storyLanguage.value === "tl") return buildStoryTagalog();
    if (storyLanguage.value === "ilo") return buildStoryIlokano();
    return buildStoryEnglish();
  }

  const AAC_LABELS = {
    en: {
      student: "ME",
      feelings: "MY FEELINGS",
      listen: "LISTEN",
      walk: "WALK",
      putAway: "PUT AWAY",
      materials: "GET READY",
      look: "LOOK",
      start: "START",
      finished: "FINISHED",
      wait: "WAIT",
      help: "ASK FOR HELP",
      calm: "STAY CALM",
      goal: "MY GOAL",
      proud: "I TRIED",
      next: "NEXT",
      break: "BREAK",
      group: "STAY WITH GROUP",
      safe: "BE SAFE",
      routine: "MY STEPS",
      choose: "CHOOSE",
      return: "RETURN",
      directions: "DIRECTIONS"
    },
    tl: {
      student: "AKO",
      feelings: "NARARAMDAMAN KO",
      listen: "MAKINIG",
      walk: "MAGLAKAD",
      putAway: "MAG-AYOS",
      materials: "MAGHANDA",
      look: "TUMINGIN",
      start: "MAGSIMULA",
      finished: "TAPOS",
      wait: "MAGHINTAY",
      help: "HUMINGI NG TULONG",
      calm: "KUMALMA",
      goal: "LAYUNIN KO",
      proud: "SINUBUKAN KO",
      next: "SUSUNOD",
      break: "PAHINGA",
      group: "SUMAMA SA GRUPO",
      safe: "MAGING LIGTAS",
      routine: "MGA HAKBANG",
      choose: "PUMILI",
      return: "BUMALIK",
      directions: "TAGUBILIN"
    },
    ilo: {
      student: "SIAK",
      feelings: "RIKNAK",
      listen: "DUMNGEG",
      walk: "MAGNA",
      putAway: "AGURNOS",
      materials: "AGSAGANA",
      look: "KITAEN",
      start: "RUGIAN",
      finished: "NALPAS",
      wait: "AGURAY",
      help: "AGKIDDAW TULONG",
      calm: "AGTALNA",
      goal: "PANGGEPKO",
      proud: "PINADAS KO",
      next: "SUMARUNO",
      break: "PANAGINANA",
      group: "MAKIKADUA ITI GRUPO",
      safe: "AGTALGED",
      routine: "DAGITI ADDANG",
      choose: "AGPILI",
      return: "AGSUBLI",
      directions: "BILIN"
    }
  };

  function includesAny(text, words) {
    return words.some((word) => text.includes(word));
  }

  function getPanelConcept(text, index) {
    const lower = text.toLowerCase();
    const isStep = /^\d+\./.test(lower);

    if (includesAny(lower, ["my name", "ako si", "siak ni"])) return "student";
    if (includesAny(lower, ["proud", "ipagmalaki", "kinaproud", "pagsisikap", "panangpadas"])) return "proud";
    if (includesAny(lower, ["goal", "layunin", "panggep"])) return "goal";
    if (includesAny(lower, ["may feel", "my feelings", "makaramdam", "nararamdaman ko", "mariknak", "riknak"])) return "feelings";
    if (includesAny(lower, ["walk", "pumupunta", "naglalakad", "lumilipat", "naglakad", "magna", "mapan"])) return "walk";
    if (includesAny(lower, ["put my", "put materials", "put my things", "put my materials", "inaayos", "inilalagay", "iniimpake", "ikabil", "urnos", "ipon"])) return "putAway";
    if (includesAny(lower, ["materials i need", "get the materials", "gather the things", "inihahanda", "kinukuha", "isagana", "alaek"])) return "materials";
    if (includesAny(lower, ["look", "tinitingnan", "tumitingin", "kitaek", "agkitak"])) return "look";
    if (includesAny(lower, ["listen", "nakikinig", "dumngeg"])) return "listen";
    if (includesAny(lower, ["begin", "start the", "sinisimulan", "rugian"])) return "start";
    if (includesAny(lower, ["finish", "finished", "tinatapos", "tapos na", "leppas", "nalpas"])) return "finished";
    if (includesAny(lower, ["wait", "naghihintay", "aguray"])) return "wait";
    if (includesAny(lower, ["ask for help", "humingi", "humihingi", "agkiddaw", "tulong", "support"])) return "help";
    if (includesAny(lower, ["break", "pahinga", "panaginana"])) return "break";
    if (includesAny(lower, ["choose", "pumipili", "agpili"])) return "choose";
    if (includesAny(lower, ["group", "grupo", "guro o grupo", "maestro wenno grupo"])) return "group";
    if (includesAny(lower, ["safely", "safe", "ligtas", "natalged"])) return "safe";
    if (includesAny(lower, ["return", "bumabalik", "bumalik", "agsubli"])) return "return";
    if (includesAny(lower, ["calm", "breathe", "kalmado", "huminga", "natalna", "aganges"])) return "calm";
    if (includesAny(lower, ["direction", "tagubilin", "bilin"])) return "directions";
    if (includesAny(lower, ["steps", "hakbang", "addang", "routine", "rutina"])) return "routine";
    if (includesAny(lower, ["next", "susunod", "sumaruno", "transition", "paglipat", "panagsukat"])) return "next";

    const stepFallbacks = ["look", "putAway", "listen", "walk", "finished"];
    if (isStep) {
      const stepNumber = Number(lower.match(/^(\d+)\./)[1]);
      return stepFallbacks[(stepNumber - 1) % stepFallbacks.length];
    }
    return index === 0 ? "student" : "next";
  }

  function getPanelLabel(concept) {
    const language = AAC_LABELS[storyLanguage.value] ? storyLanguage.value : "en";
    return AAC_LABELS[language][concept] || AAC_LABELS[language].next;
  }

  function getVisualSegments(text) {
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !/^(Here are the steps|Narito ang mga hakbang|Dagitoy dagiti addang)/i.test(line));
  }

  function renderVisualPanels() {
    const text = storyText.value.trim();
    visualStoryPanels.innerHTML = "";

    if (!text) {
      const placeholder = document.createElement("div");
      placeholder.className = "visual-placeholder";
      placeholder.textContent = "Generate a story to see illustrated panels.";
      visualStoryPanels.appendChild(placeholder);
      return;
    }

    getVisualSegments(text).forEach((segment, index) => {
      const panel = document.createElement("article");
      panel.className = "story-panel";

      const concept = getPanelConcept(segment, index);
      const symbolCard = document.createElement("div");
      symbolCard.className = "aac-symbol-card";

      const visual = document.createElement("div");
      visual.className = "aac-symbol-visual";
      visual.innerHTML = window.AACSymbols.get(concept);

      const label = document.createElement("div");
      label.className = "aac-symbol-label";
      label.textContent = getPanelLabel(concept);

      symbolCard.append(visual, label);

      const paragraph = document.createElement("p");
      paragraph.className = "story-panel-sentence";
      paragraph.textContent = segment;

      panel.append(symbolCard, paragraph);
      visualStoryPanels.appendChild(panel);
    });
  }

  function applyVisualStyle() {
    const style = visualStyle.value;
    onePagerOutput.dataset.visualStyle = style;
    visualStoryPanels.classList.toggle("hidden", style !== "icons");
    onePagerText.classList.toggle("hidden", style === "icons");
    onePagerOutput.classList.toggle("text-visual", style === "text");
  }

  function renderOnePager() {
    const name = document.getElementById("name").value.trim();
    const setting = document.getElementById("setting").value.trim();
    const transitionText = getTransitionValue() || "A personalized transition story";

    onePagerTitle.textContent = name ? `${name}'s Social Story` : "My Social Story";
    onePagerSubtitle.textContent = setting ? `${capitalizeFirst(transitionText)} · ${setting}` : capitalizeFirst(transitionText);
    onePagerText.textContent = storyText.value.trim() || "Your generated story will appear here.";
    renderVisualPanels();
    applyVisualStyle();
  }

  function getBrowserVoice() {
    if (!("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((voice) => voice.name === voiceSelect.value);
    if (selectedVoice) return selectedVoice;

    const languagePrefixes = storyLanguage.value === "en" ? ["en"] : ["fil", "tl"];
    const languageMatch = voices.find((voice) =>
      languagePrefixes.some((prefix) => voice.lang && voice.lang.toLowerCase().startsWith(prefix))
    );

    return languageMatch || voices[0] || null;
  }

  function getBrowserSpeechLanguage() {
    if (storyLanguage.value === "en") return "en-US";
    return "fil-PH";
  }

  function speakWithBrowserVoice(text) {
    if (!("speechSynthesis" in window)) {
      throw new Error("This browser does not support read-aloud.");
    }

    stopAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getBrowserVoice();

    utterance.lang = selectedVoice?.lang || getBrowserSpeechLanguage();
    utterance.voice = selectedVoice;
    utterance.rate = readingLevel.value === "early" ? 0.85 : 0.92;
    utterance.pitch = voiceStyle.value === "masculine" ? 0.95 : 1.03;

    utterance.onend = function () {
      currentUtterance = null;
      setVoiceBusy(false);
      setStatus("Reading finished.", "success");
    };

    utterance.onerror = function () {
      currentUtterance = null;
      setVoiceBusy(false);
      setStatus("The browser stopped reading. Try a different voice or refresh the page.", "error");
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  function setVoiceBusy(isBusy) {
    readBtn.disabled = isBusy;
    if (mp3Btn) mp3Btn.disabled = isBusy;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const story = buildStory();
    if (!story) return;
    storyText.value = story;
    renderOnePager();
    setStatus("Story generated. You can edit it, listen to it, or export it.", "success");
    document.getElementById("storyText").focus({ preventScroll: true });
  });

  form.addEventListener("input", updateFormProgress);
  form.addEventListener("change", updateFormProgress);
  transition.addEventListener("change", updateConditionalFields);
  emotion.addEventListener("change", updateConditionalFields);
  storyText.addEventListener("input", renderOnePager);
  visualStyle.addEventListener("change", applyVisualStyle);

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
    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.", "error");
      this.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("Please choose an image smaller than 5 MB.", "error");
      this.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      currentPhotoData = event.target.result;
      updatePhotoDisplays();
      setStatus("Student picture added to the preview.", "success");
    };
    reader.readAsDataURL(file);
  });

  readBtn.addEventListener("click", async () => {
    const text = storyText.value.trim();
    if (!text) {
      setStatus("Generate a story before using Read Story.", "error");
      return;
    }

    try {
      setVoiceBusy(true);
      setStatus("Starting browser read-aloud...", "loading");
      speakWithBrowserVoice(text);
      setStatus("Reading the story aloud using this browser's voice.", "success");
    } catch (error) {
      setVoiceBusy(false);
      setStatus(`${error.message} Try opening the tool in Chrome or Edge.`, "error");
    }
  });

  pauseBtn.addEventListener("click", () => {
    if (!("speechSynthesis" in window) || !window.speechSynthesis.speaking) {
      return setStatus("Start Read Story before using Pause.", "error");
    }
    window.speechSynthesis.pause();
    setStatus("Reading paused.");
  });

  resumeBtn.addEventListener("click", async () => {
    if (!("speechSynthesis" in window) || !window.speechSynthesis.paused) {
      return setStatus("Pause the story before using Resume.", "error");
    }
    window.speechSynthesis.resume();
    setStatus("Reading resumed.", "success");
  });

  stopBtn.addEventListener("click", () => {
    stopAudio();
    setVoiceBusy(false);
    setStatus("Reading stopped.");
  });

  if (mp3Btn) {
  mp3Btn.addEventListener("click", async () => {
    const text = storyText.value.trim();
    if (!text) {
      setStatus("Generate a story before downloading an MP3.", "error");
      return;
    }

    try {
      setVoiceBusy(true);
      setStatus("Preparing the MP3 download…", "loading");
      const blob = await getAudio(text);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${getSafeFileName()}-social-story.mp3`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("MP3 downloaded.", "success");
    } catch (error) {
      setStatus(`${error.message} The MP3 could not be downloaded.`, "error");
    } finally {
      setVoiceBusy(false);
    }
  });

  }

  function getSafeFileName() {
    const safeName = (document.getElementById("name").value.trim() || "student")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return safeName || "student";
  }

  function normalizePdfText(text) {
    return String(text || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, " - ")
      .replace(/\u2026/g, "...")
      .replace(/\u00A0/g, " ")
      .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF]/g, "");
  }

  function getPdfLanguage() {
    if (storyLanguage.value === "tl") return "fil-PH";
    if (storyLanguage.value === "ilo") return "ilo-PH";
    return "en-PH";
  }

  async function captureAacCard(card) {
    if (!card) return "";
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false
    });
    return canvas.toDataURL("image/png");
  }

  function addPdfPageHeader(pdf, title, subtitle, isFirstPage) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const left = 16;

    pdf.setTextColor(27, 55, 92);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(isFirstPage ? 20 : 13);
    pdf.text(normalizePdfText(title), left, isFirstPage ? 19 : 15);

    if (isFirstPage) {
      pdf.setTextColor(75, 85, 99);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const subtitleLines = pdf.splitTextToSize(normalizePdfText(subtitle), pageWidth - 32);
      pdf.text(subtitleLines, left, 27);
      pdf.setFontSize(8.5);
      pdf.text(
        "Accessible reading order: each visual cue is followed by its complete story sentence.",
        left,
        36
      );
      pdf.setDrawColor(196, 205, 216);
      pdf.line(left, 40, pageWidth - left, 40);
    } else {
      pdf.setDrawColor(210, 216, 224);
      pdf.line(left, 19, pageWidth - left, 19);
    }
  }

  function addPdfFooters(pdf) {
    const totalPages = pdf.internal.getNumberOfPages();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      pdf.setPage(pageNumber);
      pdf.setDrawColor(220, 224, 230);
      pdf.line(16, pageHeight - 15, pageWidth - 16, pageHeight - 15);
      pdf.setTextColor(95, 105, 119);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text("Created with Teacher Social Story Builder", 16, pageHeight - 9);
      pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 16, pageHeight - 9, { align: "right" });
    }
  }

  async function createReaderFriendlyPdf() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const studentName = document.getElementById("name").value.trim() || "Student";
    const title = `${studentName}'s Social Story`;
    const transitionText = getTransitionValue() || "Personalized social story";
    const setting = document.getElementById("setting").value.trim();
    const subtitle = setting ? `${capitalizeFirst(transitionText)} in ${setting}` : capitalizeFirst(transitionText);
    const segments = getVisualSegments(storyText.value);
    const cards = Array.from(visualStoryPanels.querySelectorAll(".aac-symbol-card"));
    const includeCards = visualStyle.value === "icons";
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const left = 16;
    const right = 16;
    const contentBottom = pageHeight - 21;
    const cardWidth = 38;
    const cardHeight = 40;
    const gap = 7;
    let y = 47;

    pdf.setProperties({
      title,
      subject: `Accessible social story about ${transitionText}`,
      author: "Teacher Social Story Builder",
      creator: "Teacher Social Story Builder",
      keywords: "social story, accessible PDF, AAC, classroom, visual supports"
    });
    if (typeof pdf.setLanguage === "function") pdf.setLanguage(getPdfLanguage());
    if (typeof pdf.viewerPreferences === "function") {
      pdf.viewerPreferences({ DisplayDocTitle: true, FitWindow: true });
    }
    if (typeof pdf.setDisplayMode === "function") {
      pdf.setDisplayMode("fullwidth", "continuous", "UseOutlines");
    }

    addPdfPageHeader(pdf, title, subtitle, true);

    for (let index = 0; index < segments.length; index += 1) {
      const segment = normalizePdfText(segments[index]);
      const concept = getPanelConcept(segments[index], index);
      const cueLabel = normalizePdfText(getPanelLabel(concept));
      const textX = includeCards ? left + cardWidth + gap : left;
      const textWidth = pageWidth - textX - right;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const storyLines = pdf.splitTextToSize(segment, textWidth);
      const textHeight = storyLines.length * 5.2 + 13;
      const sectionHeight = Math.max(includeCards ? cardHeight : 0, textHeight);

      if (y + sectionHeight > contentBottom) {
        pdf.addPage();
        addPdfPageHeader(pdf, title, subtitle, false);
        y = 27;
      }

      if (includeCards && cards[index]) {
        try {
          const cardImage = await captureAacCard(cards[index]);
          pdf.addImage(cardImage, "PNG", left, y, cardWidth, cardHeight, undefined, "FAST");
        } catch (error) {
          pdf.setDrawColor(38, 50, 56);
          pdf.roundedRect(left, y, cardWidth, cardHeight, 2, 2);
        }
      }

      pdf.setTextColor(30, 41, 59);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`Visual cue: ${cueLabel}`, textX, y + 6);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(storyLines, textX, y + 13);

      y += sectionHeight + 6;
      pdf.setDrawColor(226, 231, 237);
      pdf.line(left, y - 3, pageWidth - right, y - 3);
    }

    addPdfFooters(pdf);
    return pdf;
  }

  pdfBtn.addEventListener("click", async () => {
    if (!storyText.value.trim()) {
      setStatus("Generate a story before downloading a PDF.", "error");
      return;
    }

    try {
      pdfBtn.disabled = true;
      setStatus("Preparing a selectable, reader-friendly PDF…", "loading");
      const pdf = await createReaderFriendlyPdf();
      pdf.save(`${getSafeFileName()}-social-story.pdf`);
      setStatus("Accessible PDF downloaded with selectable text and logical reading order.", "success");
    } catch (error) {
      setStatus("The PDF could not be created. Please try Print instead.", "error");
    } finally {
      pdfBtn.disabled = false;
    }
  });

  copyBtn.addEventListener("click", async () => {
    if (!storyText.value.trim()) {
      setStatus("Generate a story before copying it.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(storyText.value);
      setStatus("Story copied to the clipboard.", "success");
    } catch (error) {
      storyText.select();
      document.execCommand("copy");
      setStatus("Story copied to the clipboard.", "success");
    }
  });

  saveBtn.addEventListener("click", () => {
    if (!storyText.value.trim()) {
      setStatus("Generate a story before saving it.", "error");
      return;
    }
    const savedStories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]");
    savedStories.unshift({
      id: Date.now(),
      title: document.getElementById("name").value.trim() || "Student Story",
      text: storyText.value,
      language: storyLanguage.value,
      character: characterType.value,
      photo: currentPhotoData,
      visualStyle: visualStyle.value,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("teacherSocialStories", JSON.stringify(savedStories));
    renderSavedStories();
    setStatus("Story saved on this device.", "success");
  });

  function createButton(label, className, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
  }

  function renderSavedStories() {
    const container = document.getElementById("savedStories");
    const stories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]");
    container.innerHTML = "";

    if (!stories.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No saved stories yet.";
      container.appendChild(empty);
      return;
    }

    stories.forEach((story) => {
      const item = document.createElement("article");
      item.className = "saved-item";

      const title = document.createElement("h4");
      title.textContent = story.title;
      const date = document.createElement("p");
      date.textContent = `Saved: ${story.date}`;

      const characterRow = document.createElement("div");
      characterRow.className = "saved-character-row";
      const character = document.createElement("div");
      character.className = "saved-character-icon";
      character.textContent = story.character || "🧒";
      characterRow.appendChild(character);

      if (story.photo) {
        const photo = document.createElement("img");
        photo.src = story.photo;
        photo.className = "saved-character-photo";
        photo.alt = "Saved student";
        characterRow.appendChild(photo);
      }

      const actions = document.createElement("div");
      actions.className = "saved-actions";
      actions.append(
        createButton("Load", "btn small-btn", () => loadStory(story.id)),
        createButton("Delete", "btn secondary-btn small-btn", () => deleteStory(story.id))
      );

      item.append(title, date, characterRow, actions);
      container.appendChild(item);
    });
  }

  function loadStory(id) {
    const stories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]");
    const story = stories.find((item) => item.id === id);
    if (!story) return;

    storyText.value = story.text || "";
    storyLanguage.value = story.language || "en";
    characterType.value = story.character || "🧒";
    visualStyle.value = story.visualStyle || "icons";
    currentPhotoData = story.photo || "";

    updateLanguageGuidance();
    populateVoiceList();
    updateCharacter();
    updatePhotoDisplays();
    renderOnePager();
    setStatus("Saved story loaded.", "success");
  }

  function deleteStory(id) {
    const stories = JSON.parse(localStorage.getItem("teacherSocialStories") || "[]")
      .filter((story) => story.id !== id);
    localStorage.setItem("teacherSocialStories", JSON.stringify(stories));
    renderSavedStories();
    setStatus("Saved story deleted.");
  }

  clearBtn.addEventListener("click", () => {
    form.reset();
    storyText.value = "";
    currentPhotoData = "";
    stopAudio();
    updateConditionalFields();
    updateLanguageGuidance();
    updateCharacter();
    updatePhotoDisplays();
    populateVoiceList();
    renderOnePager();
    setStatus("Form cleared.");
  });

  updateConditionalFields();
  updateLanguageGuidance();
  updateCharacter();
  updatePhotoDisplays();
  populateVoiceList();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  renderOnePager();
  renderSavedStories();
  updateFormProgress();
});
