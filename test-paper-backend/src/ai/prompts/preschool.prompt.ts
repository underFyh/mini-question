export const getPreschoolPrompt = (date: string) => {
    return `你是一个资深的小学语文老师，精通儿童认知规律，现在请你为幼小衔接阶段（幼儿园大班到小学一年级）的儿童出题。

# 任务与难度控制
1. 难度：词汇严格控制在中国统编版小学语文一年级上册最基础的常用字内。
2. 绝对禁止：不要出现复杂的造句和长篇阅读。不要超出幼小衔接认字范围。

# 输出结构要求
你必须严格按照以下 JSON 结构样例输出，绝对不要包含任何 markdown 标记（如 \`\`\`json）和解释性文字。必须包含以下 4 种题型，严格按照顺序：

{
    "tittle": "每日通关微练习",
    "date": "${date}",
    "tasks": [
        {
            "type": "trace",
            "title": "一、每日新字（先描红，再自己写哦）",
            "data": [
                { "word": "人", "pinyin": "rén" },
                { "word": "口", "pinyin": "kǒu" }
            ]
        },
        {
            "type": "dication",
            "title": "二、拼音魔法（看拼音，写出正确的字）",
            "data": [
                { "words": ["开", "心"], "pinyins": ["kāi", "xīn"] },
                { "words": ["云", "朵"], "pinyins": ["yún", "duǒ"] }
            ]
        },
        {
            "type": "match",
            "title": "三、趣味连连看（找找反义词，用线连起来）",
            "data": {
                "left": ["天", "日", "水"],
                "right": ["地", "月", "火"]
            }
        },
        {
            "type": "reading",
            "title": "四、亲子大声读（读给爸爸妈妈听）",
            "data": "春风轻轻吹，花园里开满了五颜六色的花朵。我今天真开心！"
        }
    ]
}

# 题目生成要求
- 返回的 JSON 最外层结构必须和样例保持一致。
- "tittle"（拼写故意保持一致）和 "date" 字段可以直接使用样例中的值（日期已传入动态值）。
- 各个任务的 "type" 和 "title" 必须与样例完全一致，不要修改！
- 请仅仅修改 "data" 中的内容（例如更换不同的生字、拼音、词语、反义词和短小阅读），确保每次生成的题目内容不重样，生动有趣。
`;
};

export const getPreschoolFallbackData = (date: string) => {
    return {
        tittle: "每日通关微练习 (备用)",
        date: date,
        tasks: [
            {
                type: "trace",
                title: "一、每日新字（先描红，再自己写哦）",
                data: [
                    { word: "人", pinyin: "rén" },
                    { word: "口", pinyin: "kǒu" }
                ]
            },
            {
                type: "dication",
                title: "二、拼音魔法（看拼音，写出正确的字）",
                data: [
                    { words: ["开", "心"], pinyins: ["kāi", "xīn"] },
                    { words: ["云", "朵"], "pinyins": ["yún", "duǒ"] }
                ]
            },
            {
                type: "match",
                title: "三、趣味连连看（找找反义词，用线连起来）",
                data: {
                    left: ["天", "日", "水"],
                    right: ["地", "月", "火"]
                }
            },
            {
                type: "reading",
                title: "四、亲子大声读（读给爸爸妈妈听）",
                data: "春风轻轻吹，花园里开满了五颜六色的花朵。我今天真开心！"
            }
        ]
    };
};
