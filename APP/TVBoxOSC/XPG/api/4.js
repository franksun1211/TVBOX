import cheerio from 'assets://js/lib/cheerio.min.js';

// import cheerio from '../lib/cheerio.min.js';
const sites = [
    'https://www.cd-zj.com',
    'https://www.gzwlr.com',
]
const appConfig = {
    siteName: "枫叶4k影院",
    siteUrl: sites[0]
}
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
const Headers = {
    "User-Agent": UA,
    "Referer": appConfig.siteUrl + "/",
}
async function init(ext) {}

function getYearFilter() {
    let years = [{
        "n": "全部",
        "v": ""
    }];
    const currentYear = new Date().getFullYear().toString();
    for (let y = currentYear; y >= currentYear - 22; y--) {
        years.push({
            "n": String(y),
            "v": String(y)
        });
    }
    return {
        "key": "year",
        "name": "年份",
        "value": years
    };
}

function getLetterFilter() {
    return {
        "key": "letter",
        "name": "字母",
        "value": [{
                "n": "全部",
                "v": ""
            },
            {
                "n": "A",
                "v": "A"
            }, {
                "n": "B",
                "v": "B"
            }, {
                "n": "C",
                "v": "C"
            }, {
                "n": "D",
                "v": "D"
            },
            {
                "n": "E",
                "v": "E"
            }, {
                "n": "F",
                "v": "F"
            }, {
                "n": "G",
                "v": "G"
            }, {
                "n": "H",
                "v": "H"
            },
            {
                "n": "I",
                "v": "I"
            }, {
                "n": "J",
                "v": "J"
            }, {
                "n": "K",
                "v": "K"
            }, {
                "n": "L",
                "v": "L"
            },
            {
                "n": "M",
                "v": "M"
            }, {
                "n": "N",
                "v": "N"
            }, {
                "n": "O",
                "v": "O"
            }, {
                "n": "P",
                "v": "P"
            },
            {
                "n": "Q",
                "v": "Q"
            }, {
                "n": "R",
                "v": "R"
            }, {
                "n": "S",
                "v": "S"
            }, {
                "n": "T",
                "v": "T"
            },
            {
                "n": "U",
                "v": "U"
            }, {
                "n": "V",
                "v": "V"
            }, {
                "n": "W",
                "v": "W"
            }, {
                "n": "X",
                "v": "X"
            },
            {
                "n": "Y",
                "v": "Y"
            }, {
                "n": "Z",
                "v": "Z"
            }, {
                "n": "0-9",
                "v": "0-9"
            }
        ]
    }
}
const OtherFilters = [{
        "key": "area",
        "name": "地区",
        "value": [{
                "n": "全部",
                "v": ""
            }, {
                "n": "大陆",
                "v": "大陆"
            }, {
                "n": "香港",
                "v": "香港"
            },
            {
                "n": "台湾",
                "v": "台湾"
            }, {
                "n": "美国",
                "v": "美国"
            }, {
                "n": "韩国",
                "v": "韩国"
            },
            {
                "n": "日本",
                "v": "日本"
            }, {
                "n": "泰国",
                "v": "泰国"
            }, {
                "n": "新加坡",
                "v": "新加坡"
            },
            {
                "n": "马来西亚",
                "v": "马来西亚"
            }, {
                "n": "印度",
                "v": "印度"
            }, {
                "n": "英国",
                "v": "英国"
            },
            {
                "n": "法国",
                "v": "法国"
            }, {
                "n": "加拿大",
                "v": "加拿大"
            }, {
                "n": "西班牙",
                "v": "西班牙"
            },
            {
                "n": "俄罗斯",
                "v": "俄罗斯"
            }, {
                "n": "其它",
                "v": "其它"
            }
        ]
    },
    getYearFilter(),
    {
        "key": "lang",
        "name": "语言",
        "value": [{
                "n": "全部",
                "v": ""
            }, {
                "n": "国语",
                "v": "国语"
            }, {
                "n": "英语",
                "v": "英语"
            },
            {
                "n": "粤语",
                "v": "粤语"
            }, {
                "n": "闽南语",
                "v": "闽南语"
            }, {
                "n": "韩语",
                "v": "韩语"
            },
            {
                "n": "日语",
                "v": "日语"
            }, {
                "n": "其它",
                "v": "其它"
            }
        ]
    },
    getLetterFilter()
];
const myFilters = {
    "2": [{
            key: "type",
            "name": "类型",
            value: [{
                    "n": "全部",
                    "v": "2"
                },
                {
                    "n": "国产剧",
                    "v": "13"
                },
                {
                    "n": "日韩剧",
                    "v": "15"
                },
                {
                    "n": "海外剧",
                    "v": "16"
                },
            ]
        },
        {
            "key": "class",
            "name": "剧情",
            "value": [{
                    "n": "全部",
                    "v": ""
                }, {
                    "n": "古装",
                    "v": "古装"
                }, {
                    "n": "战争",
                    "v": "战争"
                },
                {
                    "n": "青春偶像",
                    "v": "青春偶像"
                }, {
                    "n": "喜剧",
                    "v": "喜剧"
                }, {
                    "n": "家庭",
                    "v": "家庭"
                },
                {
                    "n": "犯罪",
                    "v": "犯罪"
                }, {
                    "n": "动作",
                    "v": "动作"
                }, {
                    "n": "奇幻",
                    "v": "奇幻"
                },
                {
                    "n": "剧情",
                    "v": "剧情"
                }, {
                    "n": "历史",
                    "v": "历史"
                }, {
                    "n": "经典",
                    "v": "经典"
                },
                {
                    "n": "乡村",
                    "v": "乡村"
                }, {
                    "n": "情景",
                    "v": "情景"
                }, {
                    "n": "商战",
                    "v": "商战"
                },
                {
                    "n": "网剧",
                    "v": "网剧"
                }, {
                    "n": "其他",
                    "v": "其他"
                }
            ]
        },
        ...OtherFilters
    ],
    "1": [{
            "key": "type",
            "name": "类型",
            value: [{
                    "n": "全部",
                    "v": "1"
                },
                {
                    "n": "动作片",
                    "v": "6"
                },
                {
                    "n": "喜剧片",
                    "v": "7"
                },
                {
                    "n": "恐怖片",
                    "v": "8"
                },
                {
                    "n": "科幻片",
                    "v": "9"
                },
                {
                    "n": "爱情片",
                    "v": "10"
                },
                {
                    "n": "剧情片",
                    "v": "11"
                }
            ]
        },
        {
            "key": "class",
            "name": "剧情",
            "value": [{
                    "n": "全部",
                    "v": ""
                },
                {
                    "n": "喜剧",
                    "v": "喜剧"
                },
                {
                    "n": "爱情",
                    "v": "爱情"
                },
                {
                    "n": "恐怖",
                    "v": "恐怖"
                },
                {
                    "n": "动作",
                    "v": "动作"
                },
                {
                    "n": "科幻",
                    "v": "科幻"
                },
                {
                    "n": "剧情",
                    "v": "剧情"
                },
                {
                    "n": "战争",
                    "v": "战争"
                },
                {
                    "n": "警匪",
                    "v": "警匪"
                },
                {
                    "n": "犯罪",
                    "v": "犯罪"
                },
                {
                    "n": "动画",
                    "v": "动画"
                },
                {
                    "n": "奇幻",
                    "v": "奇幻"
                },
                {
                    "n": "武侠",
                    "v": "武侠"
                },
                {
                    "n": "冒险",
                    "v": "冒险"
                },
                {
                    "n": "枪战",
                    "v": "枪战"
                },
                {
                    "n": "悬疑",
                    "v": "悬疑"
                },
                {
                    "n": "惊悚",
                    "v": "惊悚"
                },
                {
                    "n": "经典",
                    "v": "经典"
                },
                {
                    "n": "青春",
                    "v": "青春"
                },
                {
                    "n": "文艺",
                    "v": "文艺"
                },
                {
                    "n": "微电影",
                    "v": "微电影"
                },
                {
                    "n": "古装",
                    "v": "古装"
                },
                {
                    "n": "历史",
                    "v": "历史"
                },
                {
                    "n": "运动",
                    "v": "运动"
                },
                {
                    "n": "农村",
                    "v": "农村"
                },
                {
                    "n": "儿童",
                    "v": "儿童"
                },
                {
                    "n": "网络电影",
                    "v": "网络电影"
                }
            ]
        },
        ...OtherFilters
    ],
    "4": [{
            "key": "type",
            "name": "类型",
            "value": [{
                    "n": "全部",
                    "v": "4"
                },
                {
                    "n": "国产动漫",
                    "v": "25"
                },
                {
                    "n": "日韩动漫",
                    "v": "26"
                },
            ]
        },
        {
            "key": "class",
            "name": "剧情",
            "value": [{
                    "n": "全部",
                    "v": ""
                },
                {
                    "n": "情感",
                    "v": "情感"
                },
                {
                    "n": "科幻",
                    "v": "科幻"
                },
                {
                    "n": "热血",
                    "v": "热血"
                },
                {
                    "n": "推理",
                    "v": "推理"
                },
                {
                    "n": "搞笑",
                    "v": "搞笑"
                },
                {
                    "n": "冒险",
                    "v": "冒险"
                },
                {
                    "n": "萝莉",
                    "v": "萝莉"
                },
                {
                    "n": "校园",
                    "v": "校园"
                },
                {
                    "n": "动作",
                    "v": "动作"
                },
                {
                    "n": "机战",
                    "v": "机战"
                },
                {
                    "n": "运动",
                    "v": "运动"
                },
                {
                    "n": "战争",
                    "v": "战争"
                },
                {
                    "n": "少年",
                    "v": "少年"
                },
                {
                    "n": "少女",
                    "v": "少女"
                },
                {
                    "n": "社会",
                    "v": "社会"
                },
                {
                    "n": "原创",
                    "v": "原创"
                },
                {
                    "n": "亲子",
                    "v": "亲子"
                },
                {
                    "n": "益智",
                    "v": "益智"
                },
                {
                    "n": "励志",
                    "v": "励志"
                },
                {
                    "n": "其他",
                    "v": "其他"
                }
            ]
        },
        ...OtherFilters
    ],
    "3": [{
            "key": "type",
            "name": "类型",
            value: [{
                    "n": "全部",
                    "v": "3"
                },
                {
                    "n": "大陆综艺",
                    "v": "21"
                },
                {
                    "n": "日韩综艺",
                    "v": "22"
                },
            ]
        },
        {
            "key": "class",
            "name": "剧情",
            "value": [{
                    "n": "全部",
                    "v": ""
                },
                {
                    "n": "选秀",
                    "v": "选秀"
                },
                {
                    "n": "情感",
                    "v": "情感"
                },
                {
                    "n": "访谈",
                    "v": "访谈"
                },
                {
                    "n": "播报",
                    "v": "播报"
                },
                {
                    "n": "旅游",
                    "v": "旅游"
                },
                {
                    "n": "音乐",
                    "v": "音乐"
                },
                {
                    "n": "美食",
                    "v": "美食"
                },
                {
                    "n": "纪实",
                    "v": "纪实"
                },
                {
                    "n": "曲艺",
                    "v": "曲艺"
                },
                {
                    "n": "生活",
                    "v": "生活"
                },
                {
                    "n": "游戏互动",
                    "v": "游戏互动"
                },
                {
                    "n": "财经",
                    "v": "财经"
                },
                {
                    "n": "求职",
                    "v": "求职"
                }
            ]
        },
        ...OtherFilters
    ],
    "5": [
        getYearFilter(),
        getLetterFilter()
    ],
};
async function home(filter) {
    return JSON.stringify({
        class: [{
                type_id: "/label/qq",
                type_name: "腾讯精选"
            },
            {
                type_id: "/label/bli",
                type_name: "B站精选"
            },
            {
                type_id: "/label/youku",
                type_name: "优酷精选"
            },
            {
                type_id: "2",
                type_name: "电视剧",
            },
            {
                type_id: "1",
                type_name: "电影"
            },
            {
                type_id: "4",
                type_name: "动漫"
            },
            {
                type_id: "3",
                type_name: "综艺"
            },
            {
                type_id: "5",
                type_name: "热门短剧"
            }


        ],
        filters: myFilters
    });
}
async function category(tid, pg, filter, extend) {
    pg = pg || 1;
    let type = extend.type || tid;
    const isLanel = tid.startsWith("/label");
    let url = "";
    const typePrefix = appConfig.siteUrl === 'https://www.gzwlr.com' ? "list" : "cupfox-list";
    if (isLanel) {
        url = appConfig.siteUrl + tid + `/page/${pg}.html`;
    } else {
        let classVal = extend.class || '';
        let areaVal = extend.area || '';
        let langVal = extend.lang || '';
        let letterVal = extend.letter || '';
        let orderVal = extend.orderBy || '';
        let yearVal = extend.year || '';
        url = `${appConfig.siteUrl}/${typePrefix}/${type}-${areaVal}-${''}-${classVal}-${langVal}-${letterVal}-${orderVal}-${''}-${pg}-${''}-${''}-${yearVal}.html`;
    }
    const html = (await req(url)).content;
    const $ = cheerio.load(html);
    let list = [];
    $(".public-list-div.public-list-bj").each(function(index, el) {
        let vod_id = $(el).find("a.public-list-exp").attr("href");
        let vod_name = $(el).find("a.public-list-exp").attr("title").trim();
        let _4k = $(el).find(".public-prt-g").text().trim()
        let vod_pic = $(el).find(".public-list-exp img").attr("data-src");
        let upto = $(el).find(".ft2").text().trim();
        let vod_remarks = _4k + ' ' + upto
        list.push({
            vod_id,
            vod_name,
            vod_pic,
            vod_remarks
        });
    });
    const pageStr = $('.page-tip').text().trim()
    const pagecount = pageStr.match(/\d+\/(\d+)页/)?.[1] || 1
    return JSON.stringify({
        list,
        pagecount
    });
}
async function search(wd, quick, page) {
    if (page >= 2) {
        return JSON.stringify({
            list: [],
            pagecount: 1
        });
    }
    try {
        const searchPrefex = appConfig.siteUrl === 'https://www.gzwlr.com' ? "search" : "cupfox-search";
        const url = `${appConfig.siteUrl}/${searchPrefex}/-------------.html?wd=${wd}`;
        const html = (await req(url)).content;
        const $ = cheerio.load(html);
        let list = [];
        $('.search-box').each((i, el) => {
            const vod_id = $(el).find(".thumb-txt a").attr('href') || '';
            const vod_name = $(el).find(".thumb-txt a").text().trim()
            const vod_pic = $(el).find('.left img').attr('data-src') || '';
            const vod_remarks = $(el).find('.public-list-prb').text().trim()
            list.push({
                vod_id,
                vod_name,
                vod_pic,
                vod_remarks
            });
        })
        return JSON.stringify({
            list: list,
            pagecount: 1
        });
    } catch (e) {
        console.error("❌ search 遭遇内部崩溃 =", e.message);
        return JSON.stringify({
            list: []
        });
    }
}
async function detail(id) {
    try {
        const videoId = id;
        const url = appConfig.siteUrl + videoId;
        const response = await req(url);
        const html = response ? response.content : '';
        const $ = cheerio.load(html);

        const vod_name = $('.slide-info-title').text().trim();
        const imgSrc = $('.detail-pic img').attr("data-src") || '';
        const vod_pic = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : appConfig.siteUrl + imgSrc) : '';
        const vod_actor = $('.detail-info .slide-info').eq(2).text().replace(/演员：\s*/, '').trim();
        const vod_remarks = $('.detail-info .slide-info').eq(4).text().replace(/连载\s*:\s*/, '').trim();
        const vod_content = ''+$('#height_limit').text().trim();


        let rawLines = [];
        let rawPlaylists = [];
        $('.swiper-slide').each((i, el) => {
            const lineName = $(el).clone().find('i, span').remove().end().text().trim();
            rawLines.push(lineName);
        });
        $('.anthology-list-box').each((lineIndex, poolEl) => {
            const episodes = [];
            $(poolEl).find('a').each((episodeIndex, epEl) => {
                const name = $(epEl).text().trim();
                const href = $(epEl).attr('href') || '';
                if (name && href) {
                    episodes.push(`${name}\$${href}`);
                }
            });
            rawPlaylists.push(episodes);
        });


        let targetLineIdx = -1;

        for (let i = 0; i < rawLines.length; i++) {
            const name = rawLines[i];
            const eps = rawPlaylists[i];
            if (name.includes("至臻4k") && eps.length > 0) {
                targetLineIdx = i;
                break;
            }
        }

        if (targetLineIdx === -1 && rawLines.length > 0) {
            targetLineIdx = 0;
        }

        let finalLines = [];
        let finalPlaylists = [];
        if (targetLineIdx !== -1) {
            finalLines.push("🍎小苹果影视");
            finalPlaylists.push(rawPlaylists[targetLineIdx]);
        }


        const {
            vod_play_from,
            vod_play_url
        } = buildVodPlayData(finalLines, finalPlaylists, true);
        const vod = {
            vod_id: videoId,
            vod_name,
            vod_pic,
            vod_actor,
            vod_remarks,
            vod_content,
            vod_play_from,
            vod_play_url
        };
        return JSON.stringify({
            list: [vod]
        });
    } catch (error) {
        console.error(`解析详情页异常 [ID: ${id}]:`, error);
        return JSON.stringify({
            list: []
        });
    }
}

function buildVodPlayData(lines, playlists, shouldReverse = true) {
    const processedPlaylists = playlists.map(eps => {
        if (shouldReverse) {
            eps.reverse();
        }
        return eps.join('#');
    });
    return {
        vod_play_from: lines.filter(Boolean).join('$$$'),
        vod_play_url: processedPlaylists.join('$$$')
    };
}

function isDirectUrl(url) {
    return url.startsWith('http') || url.endsWith(".m3u8") || url.endsWith(".mp4");
}
async function parsePLayUrl(is2kLine, url) {
    const parseApiUrl = is2kLine ? "https://zzrs.mfdyvip.com/player/" : "https://fgsrg.hzqingshan.com/player/"
    try {
        const html = (await req(`${parseApiUrl}?url=${url}`, {
            method: 'GET',
            headers: Headers
        })).content
        const $ = cheerio.load(html)
        const token = $('#player-data').attr('data-te');
        console.log("🚀 成功拿到 token:", token);
        let playData = await req(`${parseApiUrl}/mplayer.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                url: url,
                token: token,
            }
        }).content
        playData = JSON.parse(playData)
        return playData.url
    } catch (e) {
        console.error("❌ play  encounters an internal crash =", e);
        return "";
    }
}
async function play(flag, id, flags) {
    try {
        const html = (await req(`${appConfig.siteUrl}${id}`)).content;
        const url = getPlayUrl(html)
        if (isDirectUrl(url)) {
            return JSON.stringify({
                parse: 0,
                Header: {
                    "User-Agent": UA
                },
                url,
            });
        }
        const is2kLine = flag.includes('2k')
        const playUrl = await parsePLayUrl(is2kLine, url)
        return JSON.stringify({
            parse: 0,
            Header: {
                "User-Agent": UA
            },
            url: playUrl
        });
    } catch (e) {
        console.error("❌ play 遭遇内部崩溃 =", e);
        return JSON.stringify({
            parse: 0,
            url: ""
        });
    }
}

function getPlayUrl(html) {
    const match = html.match(/var\s+player_aaaa[\s\S]*?"url"\s*:\s*"([^"]+)"/);
    let url = match ? match[1] : '';
    url = url.replace(/\\/g, '');
    return url;
}
export default {
    init,
    home,
    category,
    detail,
    search,
    play
};
