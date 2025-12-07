

import { HerbId, CharacterId, Herb, ScriptNode } from './types';

// --- BASE URL ---
// Using the main branch to ensure latest assets (wall.png, pot.png, etc.) are loaded
const BASE_URL = 'https://raw.githubusercontent.com/Sinciya/GirlsGameJamTeamD/main/';

// --- ASSETS ---
export const ASSETS = {
  // Background
  home: `${BASE_URL}home.png`, // New Home Screen
  background: `${BASE_URL}background.png`,
  bgm: 'https://audio.jukehost.co.uk/Qu6ZtDjpgffcI4wjwVunHKWujeTcpn9y.mp3',

  // Environment & Items
  window: `${BASE_URL}wall.png`, 
  cauldron: `${BASE_URL}pot.png`, 
  shelf: `${BASE_URL}herb_shelf.png`, 
  mirror: `${BASE_URL}mirror.png`,
  axe: `${BASE_URL}axe.png`,
  feather: `${BASE_URL}feather.png`,
  dagger: `${BASE_URL}dagger.png`,
  broom: `${BASE_URL}broom.png`, // Added Broom
  book: `${BASE_URL}book.png`,   // Added Book
  
  // Characters
  characters: {
    [CharacterId.MAIN]: `${BASE_URL}mainC.png`,
    [CharacterId.MAIN_GLITCH]: `${BASE_URL}mainC2.png`, // Glitch variant
    [CharacterId.CAT]: `${BASE_URL}cat.png`, 
    // Mapping GUEST_1 to c2 (Boy) for Day 1
    [CharacterId.GUEST_1]: `${BASE_URL}c2.png`, 
    // Mapping GUEST_2 to c1 (Woman/Wife) for Day 2
    [CharacterId.GUEST_2]: `${BASE_URL}c1.png`,
    [CharacterId.GUEST_3]: `${BASE_URL}c1.png`, 
  },

  // Herbs
  herbs: {
    [HerbId.CHAMOMILE]: `${BASE_URL}gr1.png`,
    [HerbId.ACONITE]: `${BASE_URL}gr2.png`,
    [HerbId.ALOE]: `${BASE_URL}gr3.png`,
    [HerbId.ERYNGIUM]: `${BASE_URL}gr4.png`,  
    [HerbId.HEMLOCK]: `${BASE_URL}gr5.png`,   
    [HerbId.MANDRAKE]: `${BASE_URL}gr6.png`,  
    [HerbId.VALERIAN]: `${BASE_URL}gr7.png`,  
    [HerbId.SAGE]: `${BASE_URL}gr8.png`,      
  }
};

// --- Herbs Data ---
export const HERBS: Herb[] = [
  { id: HerbId.CHAMOMILE, name: '甘菊', description: '越被踐踏則越茁壯，多麽謙卑？盎格魯人出版的藥草書《治療》中所列出的九種神奇草藥中排名第五，能夠提振能量。', image: ASSETS.herbs[HerbId.CHAMOMILE] },
  { id: HerbId.ACONITE, name: '烏頭', description: '雖然含有劇毒，卻可以製成解毒劑與麻醉藥。', image: ASSETS.herbs[HerbId.ACONITE] },
  { id: HerbId.ALOE, name: '蘆薈', description: '塗抹在傷處能夠舒緩傷勢，服用則會導致腹瀉。', image: ASSETS.herbs[HerbId.ALOE] },
  { id: HerbId.ERYNGIUM, name: '濱刺芹', description: '保濕護膚，服用會⋯⋯', image: ASSETS.herbs[HerbId.ERYNGIUM] },
  { id: HerbId.HEMLOCK, name: '毒芹', description: '雖然因為某位希臘哲人的死而聲名遠播，但在低劑量時，其實具有鎮靜與解毒的效用。', image: ASSETS.herbs[HerbId.HEMLOCK] },
  { id: HerbId.MANDRAKE, name: '曼德拉草', description: '根部形似人形。傳說拔出時會發出致命的尖叫。', image: ASSETS.herbs[HerbId.MANDRAKE] },
  { id: HerbId.VALERIAN, name: '纈草', description: '強效鎮靜劑，能帶來無夢的深沉睡眠。', image: ASSETS.herbs[HerbId.VALERIAN] },
  { id: HerbId.SAGE, name: '鼠尾草', description: '古老的淨化草藥，能驅逐邪惡與病氣。', image: ASSETS.herbs[HerbId.SAGE] },
];

// --- Herb Book Lore ---
export const HERB_BOOK_LORE_DAY1 = "⋯⋯無花果與濱刺芹根都是城市中盛行的「助興」食物，人們相信吃下這些東西會使死去的激情重燃，貧瘠的土壤潤澤⋯⋯";
export const HERB_BOOK_LORE_DAY2 = "⋯⋯麥稈石竹的存在即是腐敗，這種草一但長在藥草之間，種植者就必須花很多力氣將它拔除，因此麥稈石竹曾出現在奧菲莉亞的瘋言瘋語中⋯⋯";

// --- Journal Entries ---
export const JOURNAL_ENTRIES = [
  // Day 1 (Index 0)
  "山楂在五月開花，宣告春天的來臨，正巧趕上五朔節的慶典，也為牧羊人提供遮陰之處。人們相信山楂具有神奇的力量——「仙子樹」、「杜鵑珠」、「仙靈飲」——人們這麼稱呼它。\n黛安娜夫人常說山楂可以救人，能做成強心劑。\n\n（隔了很久，才有人再次書寫這本日記）\n\n伊娃很久沒來了。\n\n（有些塗抹的痕跡，難以辨認）\n需要撿些阿拉伯膠樹，艾瑪大嬸的眼疾又復發了。\n舞會季節到了，多準備些毛茛與剪秋羅。\n說不定還會有人需要苦艾來解相思呢。\n\n（又隔了一陣子，這本日記才被再次書寫）\n\n艾瑪大嬸也很久沒有來了。",
  // Day 2 (Index 1)
  "沒有停止。\n\n腦海裡的聲音沒有停止。"
];

// --- Item Descriptions Data ---
export const DESCRIPTIONS = {
  mirror: {
    day1: "鏡子：\n鏡中是你。\n雜亂的紅髮，蜂蜜色的眸。",
    day2: "鏡子：\n鏡中是你̴̢̕。\n雜亂的紅̶̯͍͚͇͓̑̄͗̑͢͠髮҈̛͔̳̳͇̋́̌̒͢，蜂蜜色的眸。",
    day3: "鏡子：\n鏡中是你。\n鏡中是你。\n鏡҈̧̛̬͋中҈̢͓̭̊͝只҉̨̰̞͖̇͑͞是҈̡̛̳͒̋̆你̸̡͇͇̬̍̃͡？̷̪̋̈̕͢",
    day4: "鏡子：\n那些我與我以外的。"
  },
  cat: {
    day1: "黑貓：\n黛安娜女士生前非常寵愛這隻貓。\n這隻烏黑的貓沒有名字，就像媽——黛安娜女士從來沒有給你一個名字一樣。\n你想，也許你可以為自己取一個名字。",
    day2: "黑貓：\n牠如此靜定地看著你，彷彿是這變動世界中唯一的不變。\n如同生活的錨點。\n明天又會發生什麼事呢？",
    day3: "黑貓：\n牠眼中的世界也是如此令人發笑嗎？",
    day4: "" // No description for Day 4 Cat
  },
  exit: {
    day1: "窗：\n沿著黑刺李小徑一直走，能在兩聲鐘響之間抵達小鎮。\n此刻外頭被濃霧包圍，這樣的日子已經持續了好一陣子了。",
    day2: "窗：\n沿著黑刺李小徑一直走，能在兩聲鐘響之間抵達小鎮。\n今天的霧似乎沒有那麼濃，要出去採集看看嗎？\n（點擊即可出去走走）"
  },
  cauldron: "鍋釜：\n黛安娜女士留給你的大鍋斧。\n「不用太相信書上寫的，」她總說：「相信感覺與實踐。」",
  axe: "鍋釜：\n黛安娜女士留給你的大鍋斧。「不用太相信書上寫的，」她總說：「相信感覺與實踐。」", 
  feather: {
      default: "尾羽：\n這可不能吃。",
      day4: "尾羽：\n那些哭泣的。"
  },
  dagger: {
      default: "匕首：\n這可不能吃。",
      day4: "匕首：\n那些鋒利的。"
  },
  broom: {
      day3: "掃首：\n這不能吃這不能吃這不能吃。",
      day4: "掃帚：\n那些使人疼痛的。"
  },
  book: {
      day4: "藥草誌：\n那些成就我也使我蒙昧的。"
  }
};


// --- Intro Script ---
export const INTRO_SCRIPT = [
  "⋯⋯",
  "⋯⋯",
  "夢中嗅見水仙球根與暴雨的味道。",
  "苔綠色土壤的氣息。",
  "悠悠轉醒，寒意入懷，凜冬將至。",
  "「起霧了。」"
];

// --- Ending Titles ---
export const ENDING_TITLES: Record<string, string> = {
    ending1: "結局一：無盡的業火",
    ending2: "結局二：未知的旅程",
    ending3: "結局三：神之聲",
    ending4: "結局四：肌肉貓貓神"
};

// --- Ending Scripts ---
export const ENDING_SCRIPTS = {
    ending1: [
        [
            "你毅然飲下最後調配的藥劑。",
            "接著像了卻宿願般，任衛兵將你領去未知的遠方。"
        ],
        [
            "數週後，鄉野間流傳著一樁怪事：",
            "某個村落在施行火刑時，不知為何怎麼都點不著火。",
            "年輕的劊子手深怕上頭論罪，",
            "焦急而反覆地埋頭敲擊打火石，",
        ],
        [
            "好不容易點著了，",
            "卻發現審判官連同看熱鬧的觀客全數雙手緊抓喉嚨，",
            "隨後口吐白沫翻倒在地。",
            "他慌張抬頭，見那在刑架上熊熊燃燒的少女，",
            "全身竟散發出不祥的螢綠色霧氣⋯⋯"
        ],
        [
            "劊子手當下連滾帶爬奔出廣場，才僥倖逃出生天。",
            "後來聽說那村落陷入火海，",
            "大火燒了七天七夜，連下好幾天的雷雨都沒能澆熄。"
        ]
    ],
    ending2: [
        [
            "你很難意識到發生了什麼，彷彿電光火石間即塵埃落定。",
            "很久以後回望，",
            "這一段回憶總是斑駁的、碎片的、凌亂的。",
            "紛雜地像一場夢。",
            "唯一深刻的事物是少女騎士的鬢邊的髮香。",
        ],
        [
            "是的，正當那火炬往你足下靠近時，",
            "人群中突然傳來一陣騷動。",
            "一匹白馬躂躂而來，排開眾人，四下驚叫，場面混亂。",
            "而那馬匹上，一位如驕陽般的少女攫住了你的目光。",
        ],
        [
            "也許是眾人太過訝異，",
            "那位女孩割斷麻繩，將你往馬背上一帶，",
            "直到你坐定才聽見第一聲憤怒的叱喝。",
        ],
    ],
    ending3: [
        [
            "依循腦中的低語，你調配出從來沒見過的金色藥劑。",
            "在外頭的衛兵察覺不對勁起身阻止前，",
            "你將藥劑一口灌下——"
        ],
        [
            "光芒自遙遠的彼方冒出頭來，",
            "接著像撒開漁網快速向外擴散。",
            "強烈的光線令你忍不住流下淚來。",
        ],
        [
            "淚眼模糊間，不知為何，",
            "面前凶神惡煞的男人全變成經受蟲蝕的小麥，",
            "在光裡一點點消失。",
        ],
        [
            "不，何止是人，就連包著人們的房屋，包著房屋的信念，",
            "都被鋪天蓋地、沒有溫度的強光吞噬——",
        ],
    ],
    ending4: [
        [
            "正當你束手無策地張望，",
            "腳邊的黑貓映入你的眼簾。",
            "不知是一心救貓，還是抱持死馬當活馬醫的心態，",
            "你忍痛將黑貓扔進鍋爐中。",
        ],
        [
            "伴隨黑貓的哭嚎和一聲巨響，",
            "視線頓時被濃烈的煙霧遮蔽。",
            "待煙霧散去，你眼前豎著一堵生滿絨毛的精實腹部。",
            "顫顫抬頭，正好和曾經蜷在你腳邊的親愛寵物貓對上眼。",
        ],
        [
            "如今牠是身長二十幾尺的肌肉巨獸，",
            "自信地挺著異常健壯的胸膛——",
            "牠的頭甚至頂著剛被撐破的木頭屋頂。",
            "在足以致命的沈默中，",
            "你啞然看著巨獸一拳拳將周遭的衛兵扁成肉餅。",
        ],
        [
            "數十年後，在鄉野流傳著一則傳説：",
            "只要在夜裡上山，",
            "就有機會碰上身騎黑色肌肉巨獸的紅髮少女。",
            "有幸遇見他們的人是這麼說的：",
            "「他們算不上吉兆或凶兆，就只是會不小心被他們發自內心的幸福感染而已。」",
        ],
    ]
};

// --- True Ending Sequence Script ---
export const TRUE_ENDING_SCRIPT: ScriptNode[] = [
    { id: "te_1", speaker: "系統", text: "「喔，腦裡的聲音，神啊！\n我總算遇見你了。」" },
    { id: "te_2", speaker: "系統", text: "「請您告訴我，我該怎麼做？\n現在的苦難是您給我的試煉嗎？」" },
    { id: "te_3", speaker: "系統", text: "「啊，我好想逃跑。\n請您指點我面對這場苦難的方法吧。」", choices: [
        { text: "我沒辦法直接告訴你該怎麼做。", next: "te_4" }
    ]},
    { id: "te_4", speaker: "系統", text: "「⋯⋯為什麼？\n明明經你指點，我才調配出正確的草藥，\n現在卻不肯為我解圍⋯⋯」" },
    { id: "te_5", speaker: "系統", text: "「媽媽從小指導我，一步步告訴我可以怎麼做，怎樣才是對的。\n我才能一路走到現在。\n難道萬能的神就做不到嗎？」", choices: [
        { text: "對不起，但這不是我的作風。", next: "te_6" },
    ]},
    { id: "te_6", speaker: "系統", text: "", choices: [
        { text: "為表歉意，請讓我分享一件在這個時代還鮮為人知的事情。", next: "te_7" }
    ]},
    { id: "te_7", speaker: "系統", text: "「⋯⋯」" },
    { id: "te_8", speaker: "系統", text: "「你想說什麼？」" },
    { id: "te_9", speaker: "系統", text: "", choices: [
        { text: "你可以成為任何模樣的女人，你可以做出任何選擇。", next: "te_final" }
    ]},
    //{ id: "te_final", speaker: "", text: "" }
];


// --- Hints Variables ---
export const DAY1_HINT_LOVE = "悉聽尊便，照客人說的試試看甘菊和濱刺芹的組合吧。";
export const DAY1_HINT_FAIL = "該替他好好清理那一肚子壞水了。";
export const DAY2_HINT_HEAL = "使用那兩個能滋潤肌膚又屬於同色系的兩種藥材吧。\n之前拿來泡茶的那個材料也不錯。"; /* 提示：蘆薈、濱刺芹（或加甘菊）。*/
export const DAY2_HINT_POISON = "使用那兩個充滿毒性又是對比色的兩種藥材吧。"; /* 提示：烏頭、毒芹（只使用其中一項將使藥效削弱）。 */
export const DAY3_HINT_FAKE = "只有那兩種藥草同時有劇毒和解毒的習性。";
export const DAY3_HINT_POISON = "雖說可以雙毒攻心，可是只用一份真的夠嗎？"; /*毒芹能讓心跳慢到像死了一樣。烏頭則是永遠停止心跳。*/
export const DAY4_HINT = "結束一切，或是⋯⋯";
export const DAY4_HINT_ED3 = "你至今的所有行為都會有所回報。";
export const DAY4_HINT_ED3NOT = "『時候』到了，醒來吧。";

export const HINTS: Record<number, string> = {
    1: "查閱藥草誌，也許能找到適合少年的配方。",
    2: "傷口有時不僅在身體上。觀察她的需求。",
    3: "有些請求即使被拒絕，命運也未必改變。但妳可以選擇。",
    4: DAY4_HINT
};

// --- Result Titles ---
export const RESULT_TITLES: Record<string, string> = {
    // Keys match the script keys
    "day1_result_love": "事件：想得到愛情的少年",
    "day1_result_bad": "事件：想得到愛情的少年",
    "day1_result_fail": "事件：想得到愛情的少年",
    "day2_result_heal": "事件：受傷的婦人",
    "day2_result_poison": "事件：受傷的婦人",
    "day2_result_fail": "事件：受傷的婦人",
    "day3_result_fake": "事件：求死的少女",
    "day3_result_death": "事件：求死的少女",
    "day3_result_fail": "事件：求死的少女",
};


// --- Scripts by Day ---
export const SCRIPTS: Record<string, ScriptNode[]> = {
  "day1_start": [
    /*{ id: "d1_dream", speaker: "夢境中神（玩家）的低喃", text: "", choices: [
        { text: "⋯⋯", next: "d1_wake" }
      ]
    },*/
    { id: "d1_wake", speaker: "系統", text: "「啊⋯⋯」" },
    { id: "d1_1", speaker: "系統", text: "被喚醒的你百無聊賴望向窗外。不知為何，最近的天色逐漸變得黯淡。\n你覺得烏雲密佈的樣子很像袒出肚腹沈睡的黑色貓咪。" },
    /*{ id: "d1_2", speaker: "系統", text: "" },*/
    { id: "d1_2", speaker: "黑貓", text: "喵——" },
    { id: "d1_3", speaker: "系統", text: "⋯⋯像是不甘寂寞，窗外的聲音緊跟著慵懶的貓叫聲響起。" }, 
    { id: "d1_4", speaker: "系統", text: "走近窗戶，一道濕漉漉的修長身影便如眷戀故居的鬼魂被牽入屋內。" },
  ],
  "day1_guest": [
    { id: "d1_g1", speaker: "少年", text: "晚安，女士。" },
    { id: "d1_g2", speaker: "少年", text: "這陣子從村落前往森林的管制越來越嚴格，差點沒瞞過守夜人。\n你就是那個有名的草藥師嗎？" },
    { id: "d1_g3", speaker: "少年", text: "今天冒著風險和風雨慕名前來，希望您能幫幫我。" },
    { id: "d1_g4", speaker: "系統", text: "你為來人倒了一杯甘菊茶。\n甘菊茶素來有舒緩精神的效果。最適合為推心置腹的談話開場。" },
    { id: "d1_g5", speaker: "少年", text: "好喝！⋯⋯唉⋯⋯" },
    { id: "d1_g6", speaker: "少年", text: "女士，請您聽我說⋯⋯ \n是這樣的。猶豫不決的女孩讓我害了相思病。" },
    { id: "d1_g7", speaker: "少年", text: "我和那女孩是青梅竹馬。\n幾乎天天在村後那座長著蘋果樹的小山坡玩耍。" },
    { id: "d1_g8", speaker: "少年", text: "還記得那天，我們想爬上樹摘蘋果。卻連樹枝都碰不到。\n那女孩不死心，氣鼓鼓地繞著樹又搖又試，卻一無所獲。" },
    { id: "d1_g9", speaker: "少年", text: "眼看著天色變暗，夕陽西下⋯⋯ \n再不回去很可能會迷路的！\n我想勸他回去又不想潑冷水，只能眼巴巴看著⋯⋯" },
    { id: "d1_g10", speaker: "少年", text: "這時不知道他從哪撿來一根長樹枝，\n使勁揮舞幾下，總算勾落了兩三顆蘋果。" },
    { id: "d1_g11", speaker: "少年", text: "我忘不了他燦笑著舉起蘋果時，那對遠比蘋果更鮮紅飽滿的臉頰。\n從那個瞬間開始，我就喜歡上他了。" },
    { id: "d1_g12", speaker: "少年", text: "如今我倆都十五歲，正是適合成婚的年齡。" },
    { id: "d1_g13", speaker: "少年", text: "可是啊，即使我在口袋放滿剪秋羅，他依然無法體察我的用心。\n不！說不定是他害羞，不願意正視我的感情也說不定。" },
    { id: "d1_g14", speaker: "少年", text: "所以，希望您能給他——" },
    { id: "d1_g15", speaker: "系統", text: "不是要治相思病嗎——\n似乎感受到你目光中的疑問，少年鎮重地説：" },
    { id: "d1_g16", speaker: "少年", text: "他不喜歡我又能喜歡誰？我們可是從小一起長大的。" },
    { id: "d1_g17", speaker: "系統", text: "你一時不知作何表情，只得低聲咕噥：「世界很大呀。」" },
    { id: "d1_g18", speaker: "少年", text: "正因為世界很大，我才不希望他迷路。\n女士，請用你的藥替他指點迷津吧，讓他知道我是值得他愛的人。" },
    { id: "d1_g19", speaker: "少年", text: "這是可能會用到的藥草。它是無花果。\n可以跟甘菊和濱刺芹調和，但切記不能和蘆薈混合。" },
    /*{ id: "d1_g20", speaker: "少年", text: "報酬我當然也帶了。請您收下。" },*/
    // Choices Node Added for Day 1
    { id: "d1_guest_choices", speaker: "低語", text: "⋯⋯", choices: [
        { text: "真是青澀的愛情", next: "d1_brew_love" },
        { text: "給這自作多情的渾蛋一個教訓！", next: "d1_brew_fail" },
        /*{ text: "成全他", next: "d1_brew_start" }*/
      ]
    }
  ],
  "day1_result": [
      { id: "d1_r_end", speaker: "少年", text: "謝謝您！\n有了這個藥，明天的約會一定會很順利！" },
      { id: "d1_r_end2", speaker: "系統", text: "你默默目送少年興高采烈地離去。" }
  ],
  "day1_result_love": [
    { id: "d1_r1", speaker: "系統", text: "今日的雲雀未啼，杜鵑倒是嘯得賣力。" },
    { id: "d1_r2", speaker: "系統", text: "不知道少年與他的「愛人」怎麼樣了。" },
    { id: "d1_r3", speaker: "系統", text: "你在門廊前撿到杜鵑的尾羽。" },
  ],
  "day1_result_bad": [
    { id: "d1_r4", speaker: "系統", text: "你祝他們排洩通暢。" },
    { id: "d1_r5", speaker: "系統", text: "這樣也許反而幫了那位不知名的女孩。" },
    { id: "d1_r6", speaker: "系統", text: "今夜，他們註定與浪漫無緣。" },
  ],
  "day1_result_fail": [
    { id: "d1_r7", speaker: "系統", text: "你在凌晨被一聲鈍響驚醒——門被重重撞擊了一下。" },
    { id: "d1_r8", speaker: "系統", text: "你小心地點燃火把，緩緩開門。" },
    { id: "d1_r9", speaker: "系統", text: "木門外插著一把匕首。" },
    { id: "d1_r10", speaker: "系統", text: "看來有人對你的能力表示輕蔑。" },
  ],

  // --- Day 2 ---
  "day2_start": [
    { id: "d2_1", speaker: "系統", text: "今天的天空是黃色的。病態且帶著瘀痕。\n你覺得像一隻流落街頭人人喊打的流浪貓。" },
    { id: "d2_2", speaker: "黑貓", text: "喵——" },
    { id: "d2_3", speaker: "系統", text: "聽見外頭有騷動，看向窗外，是一個婦人。\n這位婦人神色憔悴，蒼白不安，讓你想起黃楊木那簌簌顫抖的葉。"}
  ],
  "day2_guest": [
    { id: "d2_g1", speaker: "婦人", text: "晚安。" },
    { id: "d2_g2", speaker: "婦人", text: "我來找一些⋯⋯傷藥。" },
    { id: "d2_g3", speaker: "系統", text: "她蒼白的肌膚上浮現猙獰的紅痕。" },
    { id: "d2_g4", speaker: "系統", text: "你認出來了，那是樺樹枝毆打的痕跡。" },
    { id: "d2_g5", speaker: "系統", text: "黛安娜女士的掃帚便是樺樹枝製成，你小時候可沒少被教訓。" },
    { id: "d2_g6", speaker: "系統", text: "你想起黛安娜女士說的，「別找個用樺樹枝鞭打老婆的男人——」\n回憶中的她翻了個大大的白眼：「——那比波斯椰棗還要稀有。」" },
    //{ id: "d2_g7", speaker: "系統", text: "你不清楚波斯椰棗是什麼，\n但你很清楚此刻、當下，關於這名婦人，有什麼事情不對勁。" },
    { id: "d2_choices", speaker: "低語", text: "你不清楚波斯椰棗是什麼，\n但你很清楚此刻、當下，關於這名婦人，有什麼事情不對勁。", choices: [
        { text: "你還好嗎？", next: "d2_b1" }, 
        { text: "調製傷藥", next: "d2_bhp_1" } 
      ]
    }
  ],
  "day2_breakdown": [
    { id: "d2_b1", speaker: "系統", text: "你本只想試探看看，這名婦人卻像是找到了什麼突破口，突地流下淚來。" },
    { id: "d2_b2", speaker: "系統", text: "她全講了，\n她那酗酒的丈夫是如何苛待她，\n而她年幼的孩子又是如何試圖保護她，並因此險些瞎了一隻眼。" },
    //{ id: "d2_b3", speaker: "系統", text: "你詫異、驚慌，但隨後，一股憤怒破開了所有念想——" },
    { id: "d2_b_choices", speaker: "低語", text: "你詫異、驚慌，但隨後，一股憤怒破開了所有念想——", choices: [
        { text: "調製傷藥", next: "d2_bhp_1" }, 
        { text: "調製毒藥", next: "d2_bpp_1" } 
      ]
    }
  ],
  "day2_brew_heal_prompt": [
     { id: "d2_bhp_1", speaker: "系統", text: "「你需要的是好好的休息與養護。」\n仔細想想，需要的是能夠舒緩與修護的草藥⋯⋯" },
     //{ id: "d2_bhp_2", speaker: "婦人", text: "這是⋯⋯好，我會試試。" }
  ],
  "day2_brew_poison_prompt": [
     { id: "d2_bpp_1", speaker: "系統", text: "「你需要的是一場復仇。」\n仔細想想，越毒越好。" },
     //{ id: "d2_bpp_2", speaker: "婦人", text: "復仇⋯⋯？我⋯⋯或許你是對的。" }
  ],
  "day2_result": [
      { id: "d2_r_end", speaker: "系統", text: "婦人買下了這瓶藥，你看見她的背影被濃霧吞沒。" },
      { id: "d2_r_end2", speaker: "系統", text: "抬頭望向沈甸甸的灰色天空，這穹頂之下，還有多少這樣的事？" }
  ],
  "day2_result_heal": [
      { id: "d2_rh1", speaker: "系統", text: "清晨的空氣比以往清新了一些。" },
      { id: "d2_rh2", speaker: "系統", text: "你聽說村裡有個婦人帶著孩子離開了，沒有人知道她去了哪裡。" },
      { id: "d2_rh3", speaker: "系統", text: "也許這就是最好的結局。" }
  ],
  "day2_result_poison": [
      { id: "d2_rp1", speaker: "系統", text: "村裡的鐘聲敲得很急。" },
      { id: "d2_rp2", speaker: "系統", text: "據說有個酒鬼暴斃在家中，臉色發青，像是中了邪。" },
      { id: "d2_rp3", speaker: "系統", text: "你摩挲著指尖殘留的草藥氣味，不置可否。" }
  ],
  "day2_result_fail": [
      { id: "d2_rf1", speaker: "系統", text: "一切如舊。" },
      { id: "d2_rf2", speaker: "系統", text: "那個婦人再也沒有出現過。" },
      { id: "d2_rf3", speaker: "系統", text: "有些傷痕是藥石罔效的。" }
  ],


  // --- Day 3 ---
  "day3_start": [
    { id: "d3_1", speaker: "系統", text: "今天的天空是黑色的。沒有星光。\n你覺得像一隻已經屍僵的黑色貓咪。" },
    { id: "d3_2", speaker: "黑貓", text: "喵——" },
    { id: "d3_3", speaker: "系統", text: "聽見清脆的敲窗聲，外頭站著一個少女。" },
  ],
  // 這裡要補少女敲窗戶的說明
  "day3_guest": [
    { id: "d3_g1", speaker: "系統", text: "寒風凍紅她的雙頰，灰霧則襯得她的雙眼分外清亮。" },
    { id: "d3_g2", speaker: "少女", text: "我需要一帖假死藥。" },
    { id: "d3_g3", speaker: "系統", text: "「假死藥並不存在。」\n你覺得她大概又是一個被劇作家誤導的年輕姑娘，於是謹慎地回答。" },
    { id: "d3_g4", speaker: "系統", text: "其實這種藥是有的，深層的麻痺會讓人形同死亡，\n但這種藥也十分危險，一不小心就會真的出人命。" },
    { id: "d3_g5", speaker: "少女", text: "那就給我一帖毒藥。" },
    { id: "d3_g6", speaker: "系統", text: "見到你詫異的神情，她急忙補充：「是我自己要用的，別擔心。」" },
    { id: "d3_g7", speaker: "低語", text: "不，這完全無法讓人放心啊！", choices: [
        { text: "發生什麼事了？", next: "d3_story_1" },
        { text: "調製毒藥", next: "d3_bpp_1" }
      ] 
    }
  ],
  
  "day3_story": [
      { id: "d3_story_1", speaker: "少女", text: "我父母打算把我嫁給一個我不喜歡的人。" },
      { id: "d3_story_2", speaker: "系統", text: "少女露出一個狡猾的笑容。" },
      { id: "d3_story_3", speaker: "少女", text: "你不給我這帖藥，我也會去其他地方求的。" },
      { id: "d3_story_choices", speaker: "低語", text: "⋯⋯", choices: [
          { text: "嘗試調製假死藥", next: "d3_bfp_1" },
          { text: "調製毒藥", next: "d3_bpp_1" }
      ]}
  ],
  
  // Day 3 Brew Prompts
  "day3_brew_fake_prompt": [
      { id: "d3_bfp_1", speaker: "系統", text: "若要調配假死藥，\n需要麻醉的效果，同時也需要一些解毒藥草的抑制⋯⋯" }
  ],
  "day3_brew_poison_prompt": [
      { id: "d3_bpp_1", speaker: "系統", text: "有些藥草在低劑量的情況下有可能會發揮不全，\n需要注意。" }
  ],

  // Immediate response for Day 3 (before transition)
  "day3_brew_complete": [
      { id: "d3_bc1", speaker: "少女", text: "⋯⋯多謝。" },
      { id: "d3_bc2", speaker: "系統", text: "她誠懇地看向你，隨即轉身，那背影決絕地像一隻春迴北返的雁。" }
  ],
  "day3_result_fake": [
    { id: "d3_r1_1", speaker: "主角", text: "你讓她去冥府暫時避風頭。" },
    { id: "d3_r1_2", speaker: "主角", text: "婚禮當然取消了。" },
    { id: "d3_r1_3", speaker: "主角", text: "聽說新娘的遺體在家屬的慟哭中消失無蹤。" },
    ],
  "day3_result_death": [
    { id: "d3_r2_1", speaker: "主角", text: "你如她所願，給予她永恆的安寧。" },
    { id: "d3_r2_2", speaker: "主角", text: "婚禮當然取消了。你彷彿聽見家屬如雷的慟哭。" },],
  "day3_result_fail": [
    { id: "d3_r3_1", speaker: "主角", text: "婚禮如期舉行。" }, 
    { id: "d3_r3_2", speaker: "主角", text: "你做了一個懦弱的選擇。" }],

  // --- Day 4 ---
  "day4_start": [
    { id: "d4_1", speaker: "系統", text: "大雨如奏響的輓歌淅淅瀝瀝落下。\n晦暗的天空發出如同把怒氣憋在喉頭的雷鳴。" },
    { id: "d4_2", speaker: "黑貓", text: "喵喵——" },
    { id: "d4_3", speaker: "系統", text: "彷彿要應驗你心底不安的預感，外頭響起敲門聲。" },
    { id: "d4_4", speaker: "系統", text: "你還沒來得及應門\n就被衝進來的壯碩男人架住身子扛出屋外。" },
    { id: "d4_5", speaker: "系統", text: "他們要求你跪在小花圃的泥濘中。\n跟前是一個穿著黑色長袍的白髮男人。\n他傲慢地手持紙卷，正高聲宣讀你的罪行：" },
    { id: "d4_6", speaker: "審判官", text: "經查證與證詞一致，被告以藥草為名，行巫術之實。\n此等行為已構成褻瀆上帝，交由世俗權力處置。" },
    { id: "d4_7", speaker: "系統", text: "在決議押送的前一刻，\n你央求他們最後給你些時間收拾房屋，狼狽躲回屋內。" },
    { id: "d4_8", speaker: "系統", text: "放眼望去，書櫃裡、牆壁上、房間角落，\n盡是陪你度過多年光陰充滿回憶的物品。" },
    { id: "d4_9", speaker: "系統", text: "你和窗邊那只沈甸甸的鍋釜相顧無言。" },
    { id: "d4_choices", speaker: "低語", text: "⋯⋯", choices: [
        { text: "『時候』到了，醒來吧。", next: "d4_brew_prompt_1" }
      ]
    }
  ],

  "day4_brew_prompt": [
      { id: "d4_brew_prompt_1", speaker: "系統", text: "事到如今，你還能做什麼？" }
  ],
};