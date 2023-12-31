import { kv } from '@vercel/kv'
import { baiduTranslate } from '@/app/baidu_translate'

const lang = process.env.LANG || 'zh' // default to zh
const assert = require('assert');
assert(lang == 'zh' || lang == 'en')

export class PsyDI {
  private apiUrl: string;
  private MBTIOptions: Record<string, string> = {};
  private MBTIOptionsInfo: Record<string, string> = {};
  private BlobTreeOptions: Record<string, string> = {};
  private MBTIOptionsTrans: Record<string, string> = {};
  private MBTIOptionsInfoTrans: Record<string, string> = {};
  private BlobTreeOptionsTrans: Record<string, string> = {};
  private MBTIStatistics: Record<string, number> = {};
  private phase2StartTurnCount: number = 1;
  private phase3StartTurnCount: number = 5;
  private visualArtPrefix: string = '';
  private explanationPrefix: string = '';
  private visualArtChoicePrefix: string = '';
  private mbtiHeadUrls: Record<string, string> = {
    'ISTJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fistj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=92BfIcC0qlWv7JX3c%2BEnyZD9CMQ%3D",

    'ISFJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fisfj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=Y1AWQpn13hxRo1LDzPD1OKZ0xf0%3D",

    'INFJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Finfj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=OJmvjJWiyRCRrwSPXTeD7vEYeEc%3D",

    'INTJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fintj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=Fkq1YRUJWHMkXPUS2whNm%2BhatjA%3D",

    'ISTP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fistp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=NA65XH4Xg%2F3z0Bv7t1xARq329QI%3D",

    'ISFP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fisfp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=MNIVTjj%2B8fU0YXpdFR8TxQ%2BDNl8%3D",

    'INFP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Finfp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=738Oo393hwiNBIiciFEKbZ74uZI%3D",

    'INTP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fintp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=7uH%2F5%2BRU%2B%2Beqnt2ryeDyrvJ9%2FC0%3D",

    'ESTP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Festp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=aLHC6U4tRqLOlj%2BdoEzkPUPUyTI%3D",

    'ESFP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fesfp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=34TzshsZTsxStL2fDeMBd8faxPA%3D",

    'ENFP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fenfp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=gt3gmvZMxbdxvNwtm099IRF00vU%3D",

    'ENTP': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fentp.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=sa4NMevLmGK5ksWozxkwuokX2j8%3D",

    'ESTJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Festj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=ubXcrS5D%2BtlUbP%2B7y6ETXqwgPSo%3D",

    'ESFJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fesfj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=p9J2gZr3F8b5EXpqlobJuuDgW00%3D",

    'ENFJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fenfj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=97u1MQr1RCDsN1msfXeTo204RSk%3D",

    'ENTJ': "https://psydi.oss-cn-shanghai.aliyuncs.com/official_assets%2Fhead%2Fentj.png?x-oss-process&OSSAccessKeyId=LTAI5tJqfodvyN7cj7pHuYYn&Expires=1711908537&Signature=WJB49ZObC7bgL03sId%2F2DZZ8riA%3D",
  }

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.MBTIOptions = {
        '1': 'I have a appreciation for the beauty of representational painting, especially when it evokes a sense of pleasantness. This preference hints at my inclination toward adventure, responsibility, and an agreeable nature.',
        '2': 'I have a appreciation for the beauty of representational painting. This preference hints at my inclination toward adventure, responsibility, and an agreeable nature.',
        '3': 'I have a strong affinity for pop art, which might indicate that I have a sensitive and perceptive nature.',
        '4': 'I have a fondness for pleasing abstract paintings, which might suggest that I have a more neurotic disposition.',
        '5': 'I have a fondness for neutral abstract paintings, which might suggest that I have a more neurotic disposition.',
        '6': 'I have a fondness for unpleasing abstract paintings, which might suggest that I have a more neurotic disposition.',
        '7': 'I have a appreciation for the beauty of representational painting, especially when it evokes a sense of unpleasantness. This preference hints at my inclination toward adventure, responsibility, and an agreeable nature.',
        '8': 'I have a deep appreciation for impressionist art, which suggests that I may tend to be more agreeable and conscientious while being somewhat less open in my approach.',
        '9': 'I have a strong affinity for cubism, which could be an indicator that I may be relatively younger and more extroverted in nature.'
    };
    this.MBTIOptionsInfo = {
        '1': "This painting I selected is \"Sweet daily life\" created by Swiss artist Seline Burn, capturing the pleasant and intimate moments of everyday life.",
        '2': "This painting I selected is \"Nighthawks\" created by American artist Edward Hopper in 1942, depicting the loneliness of a big city from a street restaurant.",
        '3': "This painting I selected is \"Marilyn Monroe\" created by American artist Andy Warhol in 1962. Based on the portrait of Marilyn Monroe, Andy Warhol's unique artistic techniques are used to present a unique visual effect, which has become one of the classics of the Pop Art movement.",
        '4': "This painting I selected is \"Composition II with Red, Blue and Yellow\" created by Dutch artist Mondrian in 1930. It represents Mondrian's new artistic style, emphasizing the purity of geometric shapes and the balance of composition.",
        '5': "This painting I selected is \"Suprematist composition\" created by Russian artist Kazimir Malevich in 1916. It is one of the representative works of surrealism, emphasizing the importance of form and composition.",
        '6': "This painting I selected is \"The butcher's wife\" created by American artist George Condo in 1997. The cartoonish features are both cute and deformed, perfectly interpreting George Condo's concept of \"artificial realism\".",
        '7': "This painting I selected is \"Government Bureau\" created by American artist George Tooker in 1956. It outlines a cold indoor space full of compartments, and the bewildered eyes of the employees in the compartments give people a sense of uneasiness and alienation.",
        '8': "This painting I selected is \"Bridge at Villeneuve-la-Garenne\" created by French artist Alfred Sisley in 1872. It is one of the representatives of the Impressionist painting style. Alfred Sisley is known for depicting natural light and outdoor scenes. His works show sensitivity to the natural environment and a unique artistic perspective.",
        '9': "This painting I selected is \"Three Musicians\" created by Spanish artist Pablo Picasso in 1921. It is characterized by bright and rich colors, simplified shapes and figurative elements. It shows Pablo Picasso's bold experiments with form and unique interpretation of the subject during this period."
    }
    this.BlobTreeOptions = {
        '1': 'For the "blob tree" psychology test, it defines me as a self-confident person, happy with my life and optimistic. I\'m an intelligent person, able to see the great picture and to put things into perspective.',
        '2': 'For the "blob tree" psychology test, it defines me as an ambitious and confident person. I know that I will succeed at all times and that there will always be convenient situations to help me in my evolution.',
        '3': 'For the "blob tree" psychology test, it defines me as an ambitious and confident person. I know that I will succeed at all times and that there will always be convenient situations to help me in my evolution.',
        '4': 'For the "blob tree" psychology test, it defines me as an unsociable, suspicious and distrustful person. I give up too quickly and not trust my extraordinary potential.',
        '5': 'For the "blob tree" psychology test, it defines me as creative, loves life, enjoys every moment, of love and knows how to be grateful for all the good things around me. This helps me maintain a positive outlook and so I always have my doors open to the best!',
        '6': 'For the "blob tree" psychology test, it defines me as having needs to feel loved, protected, and safe. I\'m the kind of person who always falls in love with the wrong person, because of my inexhaustible need for affection and love. I need to learn to look more closely for those people who can help him in my evolution, and not for those who do not understand my vulnerability.',
        '7': 'For the "blob tree" psychology test, it defines me as communicative people who know how to offer support to my friends. I\'m characterized by high emotional intelligence, which helps me cope successfully with life situations. I have a team spirit, see the full side of the glass and always find solutions',
        '8': 'For the "blob tree" psychology test, it defines me as dreamy and romantic. I like to have some moments just for myself. In this way, I regain my energy and zest for life and socialization. It is good for loved ones to understand my need for isolation and not misinterpret it, to understand it, and to give me the space I need.',
        '9': 'For the "blob tree" psychology test, it defines me as an unsociable, suspicious and distrustful person. I would do anything to prove that I\'m also wonderful, but it is easier to keep away from others and stand alone because in this way I justify my distrust of others.',
        '10': 'For the "blob tree" psychology test, it defines me as ambitious, but also very cautious. I\'m hardworking and determined, that’s why I succeed in almost anything I set out to do. My ideas always stand out and I\'m appreciated in any environment.',
        '11': 'For the "blob tree" psychology test, it defines me as communicative people who know how to offer support to my friends. I\'m characterized by high emotional intelligence, which helps me cope successfully with life situations. I have a team spirit, see the full side of the glass and always find solutions',
        '12': 'For the "blob tree" psychology test, it defines me as communicative people who know how to offer support to my friends. I\'m characterized by high emotional intelligence, which helps me cope successfully with life situations. I have a team spirit, see the full side of the glass and always find solutions',
        '13': 'For the "blob tree" psychology test, it defines me as filled with despair and loss of hope. I have to do my best to recalibrate myselves in the tree of life and the easiest way is to regain my self-confidence, seeking the support of loved ones!',
        '14': 'For the "blob tree" psychology test, it defines me as a soulmate, a philanthropist, would do anything to help others. I\'m characterized by much empathy and are usually a “great soul.” But I should learn to take great care of myself, not just others.',
        '15': 'For the "blob tree" psychology test, it defines me as motivated by the beauty of the road to success rather than the success itself. I\'m curious to learn new things, to have new experiences, to meet people, and to learn something from each one.',
        '16': 'For the "blob tree" psychology test, it defines me as optimistic, full of life, with a team spirit, I perform in any field and look at the challenges with detachment.',
        '17': 'For the "blob tree" psychology test, it defines me as optimistic, full of life, with a team spirit, I perform in any field and look at the challenges with detachment.',
        '18': 'For the "blob tree" psychology test, it defines me as optimistic, full of life, with a team spirit, I perform in any field and look at the challenges with detachment. And I like to feel loved and appreciated.',
        '19': 'For the "blob tree" psychology test, it defines me as an unsociable, suspicious and distrustful person. I may have narcissistic inclinations and is envious of the success of others.',
        '20': 'For the "blob tree" psychology test, it defines me as ambitious, confident, and full of life, I\'m innovator and not afraid to take risks. My detachment and passion bring me many successes and satisfactions.',
        '21': 'For the "blob tree" psychology test, it defines me as a person who tries but does not know how to find the best solutions for my life. I\'m a person who must learn to ask for help from those around me and give up my suspicious nature.'
    };
    if (lang === 'en') {
        this.MBTIOptionsTrans = this.MBTIOptions;
        this.MBTIOptionsInfoTrans = this.MBTIOptionsInfo;
        this.BlobTreeOptionsTrans = this.BlobTreeOptions;
        this.visualArtPrefix = "For visual art styles, "
        this.explanationPrefix = "The results you selected/answered previously represent: "
        this.visualArtChoicePrefix = "This choice possibly means that "
    } else if (lang === 'zh') {
        this.visualArtPrefix = "对于视觉艺术风格方面，"
        this.explanationPrefix = "您之前选择/回答的结果表明（以下为第一人称）："
        this.visualArtChoicePrefix = "这个选择可能意味着"
        this.MBTIOptionsTrans = {
            '1': '我对具有代表性的绘画的美感有很高的欣赏度，尤其是当它唤起了愉悦感的时候。这种偏好暗示了我对冒险、责任和友善的倾向。',
            '2': '我对具有代表性的绘画的美感有很高的欣赏度。这种偏好暗示了我对冒险、责任和友善的倾向。',
            '3': '我对流行艺术有很强的亲和力，这可能表明我有着敏感和有洞察力的天性。',
            '4': '我喜欢令人愉悦的抽象画，这可能表明我有着更神经质的性格。',
            '5': '我喜欢中性抽象画，这可能表明我有着更神经质的性格。',
            '6': '我喜欢令人不愉悦的抽象画，这可能表明我有着更神经质的性格。',
            '7': '我对具有代表性的绘画的美感有很高的欣赏度，尤其是当它唤起了不愉悦感的时候。这种偏好暗示了我对冒险、责任和友善的倾向。',
            '8': '我对印象派艺术有很深的欣赏度，这表明我可能在性格上更加友善和有责任心，同时在处理问题上更加开放。',
            '9': '我对立体主义有很强的亲和力，这可能表明我在性格上相对较年轻，更外向。'
        };
        this.MBTIOptionsInfoTrans = {
            '1': "这是瑞士艺术家 Seline Burn 所创作的《Sweet daily life》，捕捉了日常生活中惬意而亲切的瞬间。",
            '2': "这是美国艺术家 Edward Hopper 于1942年创作的《Nighthawks》，从一家街边餐馆中描绘出一座大城市的孤独。",
            '3': "这是美国艺术家 Andy Warhol 于 1962 年创作的《Marilyn Monroe》，以梦露的肖像为基础，运用 Andy Warhol 独特的艺术手法，呈现出了独特的视觉效果，成为波普艺术运动中的经典之一。",
            '4': "这是荷兰艺术家 Mondrian 于1930年创作的抽象艺术作品《Composition II with Red, Blue and Yellow》，代表了 Mondrian 的新艺术风格，强调几何形状的纯净和构图的平衡。",
            '5': "这是俄罗斯艺术家 Kazimir Malevich 于1916年创作的《Suprematist composition》，是超现实主义的代表作之一，强调了形式和构图的重要性。",
            '6': "这是美国艺术家 George Condo 于1997 年创作的《The butcher's wife》，其中卡通化的特征既可爱又畸形，完美地诠释了 George Condo 的“人造现实主义”概念。",
            '7': "这是美国艺术家 George Tooker 于1956年创作的《Government Bureau》勾勒出一个充满隔间的阴冷室内，隔间内雇员茫然的眼神给人一种不安的疏远感。",
            '8': "这是法国艺术家 Alfred Sisley 于1872年创作的《Bridge at Villeneuve-la-Garenne》，是印象派绘画风格的代表之一。Alfred Sisley 以描绘自然光影和户外场景而闻名，他的作品展现了对自然环境的敏感和独特的艺术视角。",
            '9': "这是西班牙艺术家 Pablo Picasso 于1921年创作的油画《Nous autres musiciens (Three Musicians) 》，以明亮丰富的颜色、简化的形状和具象化的元素为特征，展现了 Pablo Picasso 在这一时期对于形式的大胆实验和对于主题的独特演绎。"
        }
        this.BlobTreeOptionsTrans = {
            '1': '对于 “blob tree” 心理测试，它定义我为一个自信的人，对我的生活感到满意和乐观。我是一个聪明的人，能够看到事物宏观的愿景，并能透过现象看本质。',
            '2': '对于 “blob tree” 心理测试，它定义我为一个雄心勃勃和自信的人。我知道我总是能够成功，总会有幸运且恰当的情况帮助我进步。',
            '3': '对于 “blob tree” 心理测试，它定义我为一个雄心勃勃和自信的人。我知道我总是能够成功，总会有幸运且恰当的情况帮助我进步。',
            '4': '对于 “blob tree” 心理测试，它定义我为一个不合群、猜疑和不信任的人。我经常放弃得太快，不相信我非凡的潜力。',
            '5': '对于 “blob tree” 心理测试，它定义我为一个有创造力、热爱生活、享受每一刻、热爱和知道如何感激周围所有美好事物的人。这有助于我保持积极的态度，因此我总是对最好的事情敞开大门！',
            '6': '对于 “blob tree” 心理测试，它定义我为一个需要被爱、被保护和安全的人。我总是爱上错误的人，因为我对爱和感情的无穷需求。我需要学会更仔细地寻找那些可以帮助我进步的人，而不是那些不理解我的脆弱的人。',
            '7': '对于 “blob tree” 心理测试，它定义我为一个善于沟通的人，我知道如何为我的朋友提供支持。我以高情商著称，这有助于我成功地应对生活中的各种情况。我有团队精神，看到事物的各个方面，总是找到解决方案',
            '8': '对于 “blob tree” 心理测试，它定义我为一个梦幻和浪漫的人。我喜欢有一些属于自己的时刻。这样，我就能恢复精力和对生活和社交的热情。亲人们最好能理解我对隔离的需求，不要误解它，理解它，并给我我需要的空间。',
            '9': '对于 “blob tree” 心理测试，它定义我为一个不合群、猜疑和不信任的人。我会为了证明我也很棒而不惜一切代价，但是与其这样，不如远离他人，独自站立，因为这样我就可以证明我对他人的不信任是合理的。',
            '10': '对于 “blob tree” 心理测试，它定义我为一个雄心勃勃，但也非常谨慎的人。我勤奋而坚定，这就是为什么我几乎在任何我想做的事情上都能成功。我的想法总是脱颖而出，我在任何环境中都受到赞赏。',
            '11': '对于 “blob tree” 心理测试，它定义我为一个善于沟通的人，我知道如何为我的朋友提供支持。我以高情商著称，这有助于我成功地应对生活中的各种情况。我有团队精神，看到事物的各个方面，总是找到解决方案',
            '12': '对于 “blob tree” 心理测试，它定义我为一个善于沟通的人，我知道如何为我的朋友提供支持。我以高情商著称，这有助于我成功地应对生活中的各种情况。我有团队精神，看到事物的各个方面，总是找到解决方案',
            '13': '对于 “blob tree” 心理测试，它定义我为一个充满绝望和失去希望的人。我必须尽我所能在生活中重新校准自己，最简单的方法是恢复自信，寻求亲人的支持！',
            '14': '对于 “blob tree” 心理测试，它定义我为一个灵魂伴侣，一个慈善家，会为了帮助他人而不惜一切。我具有很强的同理心，通常是一个“伟大的灵魂”。但我应该学会照顾自己，而不仅仅是别人。',
            '15': '对于 “blob tree” 心理测试，它定义我为一个受到成功之路美丽的驱使而不是成功本身的人。我很好奇学习新事物，有新的经历，结识新的人，并从每个人身上学到一些东西。',
            '16': '对于 “blob tree” 心理测试，它定义我为一个乐观、充满生机、有团队精神的人，我在任何领域都表现出色，并且在战略上藐视一切挑战。',
            '17': '对于 “blob tree” 心理测试，它定义我为一个乐观、充满生机、有团队精神的人，我在任何领域都表现出色，并且在战略上藐视一切挑战。',
            '18': '对于 “blob tree” 心理测试，它定义我为一个乐观、充满生机、有团队精神的人，我在任何领域都表现出色，并且在战略上藐视一切挑战。而且我喜欢感受到被爱和被赞赏。',
            '19': '对于 “blob tree” 心理测试，它定义我为一个不合群、猜疑和不信任的人。我可能有自恋的倾向，嫉妒别人的成功。',
            '20': '对于 “blob tree” 心理测试，它定义我为一个雄心勃勃、自信、充满生机的人，我是创新者，不怕冒险。我的自信、进取心和激情给我带来了许多成功和满足。',
            '21': '对于 “blob tree” 心理测试，它定义我为一个努力但不知道如何为自己的生活找到最佳解决方案的人。我是一个必须学会向身边的人寻求帮助并放弃自己猜疑的人。'
        }
    }
    this.MBTIStatistics = {
        'INTP': 5.71,
        'INTJ': 3.74,
        'ENTP': 4.35,
        'ENTJ': 3.03,
        'INFP': 10.63,
        'INFJ': 5.60,
        'ENFP': 9.43,
        'ENFJ': 5.69,
        'ISTJ': 4.74,
        'ISFJ': 9.52,
        'ESTJ': 5.41,
        'ESFJ': 10.16,
        'ISTP': 3.59,
        'ISFP': 8.41,
        'ESTP': 3.20,
        'ESFP': 6.81,
    }
  }

  async registerUser(userId: string, isEmpty: boolean) {
    try {
      const turnCount = await kv.hget(`ucount:${userId}`, 'turnCount');
      if (!(turnCount)) {
        await kv.hset(`ucount:${userId}`, {turnCount: 0});
      } else {
        if (isEmpty && (typeof turnCount === 'number') && turnCount > 0) {
          await kv.hset(`ucount:${userId}`, {turnCount: 0});
        }
      }
    } catch (e) {
      throw new Error('User not registered or kv error', e || '');
    }
    return true;
  }

  async getTurnCount(userId: string): Promise<number> {
    try {
      const turnCount = await kv.hget(`ucount:${userId}`, 'turnCount');
      if (typeof turnCount === 'number') {
        return turnCount;
      } else {
        throw new Error('User not registered');
      }
    } catch (e) {
      throw new Error('User not registered or kv error', e || '');
    }
  }

  async setTurnCount(userId: string, turnCount: number) {
    try {
      await kv.hset(`ucount:${userId}`, {turnCount: turnCount}); 
    } catch (e) {
      throw new Error('User not registered or kv error', e || '');
    }
  }

  private async getPreQuestions(payload: any): Promise<any> {
    const url = `${this.apiUrl}/get_pre_question`;
    let retryCount = 0
    while (true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.PSYDI_API_KEY || ''}`,
                },
                body: JSON.stringify({'uid': payload.uid, 'index': payload.turnCount - 1}),
            });
            const data = await response.json();
            console.info(`[${payload.uid}]get pre question data`, data.ret)
            const q = data.ret
            let responseString = ''
            if (lang == "en" ) {
                responseString += q['Question_EN'] + '\n(A) ' + q['Option A_EN'] + '\n(B) ' + q['Option B_EN'] + '\n(C) ' + q['Option C_EN'] + '\n(D) ' + q['Option D_EN'];
            } else if (lang == "zh") {
                responseString += q['Question_CN'] + '\n(A) ' + q['Option A_CN'] + '\n(B) ' + q['Option B_CN'] + '\n(C) ' + q['Option C_CN'] + '\n(D) ' + q['Option D_CN'];
            }
            return {'done': false, 'response_string': responseString};
        } catch (error) {
            // retry
            retryCount += 1
            if (retryCount > 5) {
                throw error
            }
            console.error(`[${payload.uid}Comm Error:`, error);
            await setTimeout(() => {}, 1000);
        }
    }
    
  }

  private async getPhase3Questions(payload: any): Promise<any> {
    const url = `${this.apiUrl}/get_question`;
    let retryCount = 0
    let done = false
    while (true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.PSYDI_API_KEY || ''}`,
                },
                body: JSON.stringify({'uid': payload.uid}),
            });
            const data = await response.json();
            console.info(`[${payload.uid}]get phase3 question data`, data.ret)
            if (!('done' in data.ret)) {
                done = true 
            } else {
                done = data.ret.done;
            }

            if (!done) {
                const q = data.ret.question
                const index = data.ret.index
                const userPostsCount = payload.messages[0].content.split(/[\n,;,；]/).length
                const phase2Index = index + 1 - userPostsCount

                var infoString = ''
                if (index < userPostsCount) {
                    if (lang == 'en') {
                      infoString += `> Tip: This problem is based on the ${index + 1}-th your daily post.`
                    } else if (lang == 'zh') {
                      infoString += `> 注意：这个问题是基于你的第${index + 1}条日常动态。`
                    }
                } else {
                    if (lang == 'en') {
                      infoString += `> Tip: This problem is based on the ${phase2Index}-th dialogue in the exploration phase.`
                    } else if (lang == 'zh') {
                      infoString += `> 注意：这个问题是基于你在探索阶段的第${phase2Index}条对话定制设计的。`
                    }
                }

                if (phase2Index >= 1) {
                  const choiceExplanation = await kv.hget(`ucount:${payload.uid}chat:${phase2Index + 1}`, 'post');
                  infoString += this.explanationPrefix
                  if (phase2Index === 1) {
                    infoString += `**${this.visualArtPrefix} ${choiceExplanation}**`
                  } else if (phase2Index === 2) {
                    infoString += `**${choiceExplanation}**`
                  } else {
                    infoString += `**${choiceExplanation}**`
                  }
                }
                if (phase2Index === 1) {
                  infoString += `\n![alt text](${process.env.MBTI_OPTION_IMAGE_URL})`
                } else if (phase2Index === 2) {
                  infoString += `\n![alt text](${process.env.BLOB_TREE_IMAGE_URL})`
                }
                let responseString = ''
                if (lang == "en" ) {
                  responseString += infoString + '\n' + q['Question_EN'] + '\n(A) ' + q['Option A_EN'] + '\n(B) ' + q['Option B_EN'] + '\n(C) ' + q['Option C_EN'] + '\n(D) ' + q['Option D_EN'];
                } else if (lang == "zh") {
                  responseString += infoString + '\n' + q['Question_CN'] + '\n(A) ' + q['Option A_CN'] + '\n(B) ' + q['Option B_CN'] + '\n(C) ' + q['Option C_CN'] + '\n(D) ' + q['Option D_CN'];
                }
                return {'done': false, 'response_string': responseString};
            } else {
                break
            }
        } catch (error) {
            // retry
            retryCount += 1
            if (retryCount > 5) {
                throw error
            }
            console.error(`[${payload.uid}Comm Error:`, error);
            await setTimeout(() => {}, 1000);
        }
    }
    
    let retryCount2 = 0
    while (done) {
        try {
            const url = `${this.apiUrl}/get_result`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PSYDI_API_KEY || ''}`,
                },
                body: JSON.stringify({'uid': payload.uid}),
            });
            const data = await response.json();
            const result = data.ret.result;
            const processedResult = result.slice(1, result.length - 1)
            const mbti = data.ret.mbti
            const table = data.ret.table
            const keyword1 = processedResult.split('"Keyword A": ')[1].split('"')[1]
            const keyword2 = processedResult.split('"Keyword B": ')[1].split('"')[1]
            const reason1 = processedResult.split('"Reason A": ')[1].split('"')[1]
            const reason2 = processedResult.split('"Reason B": ')[1].split('"')[1]
            const description = {keywords: [keyword1, keyword2], texts: [reason1, reason2]}
            const naiveAttr = this.getNaiveAttrValue(table, mbti)
            const imageUrl = data.ret?.image_url
            const headUrl = this.mbtiHeadUrls[mbti]

            let finalResult = ""
            if (lang == 'en') {
                finalResult += `### Test Completed\n\nYour MBTI type is **${mbti}**. According to statistics, it accounts for ${this.MBTIStatistics[mbti]}% of the MBTI test results.\n`
                finalResult += "The detailed rating is: " + Object.keys(naiveAttr).map(key => `${key}: ${(naiveAttr[key]*100).toFixed(1)}%`).join(', ') + '\n'
                finalResult += "Here is some detailed description about your personality:\n"
                finalResult += `> Tag A: ${description.keywords[0]}` + '\n' + `Explanation: ${description.texts[0]}` + '\n'
                finalResult += `> Tag B: ${description.keywords[1]}` + '\n' + `Explanation: ${description.texts[1]}` + '\n'
                if (imageUrl !== 'null') {
                    finalResult += `\n\nYour MBTI Badge and Personalized Characteristic Image are as follows: ![final img](${headUrl}) \n ![final img](${imageUrl})` 
                }
            } else if (lang == 'zh') {
                finalResult += `### 测试完成\n\n你的 MBTI 人格类型推测是 **${mbti}**，根据统计，它占 MBTI 测试结果人数的${this.MBTIStatistics[mbti]}%。\n`
                finalResult += "具体的各维度评分如下：" + Object.keys(naiveAttr).map(key => `${key}: ${(naiveAttr[key]*100).toFixed(1)}%`).join(', ') + '\n'
                finalResult += "以下是关于你的详细描述：\n"
                finalResult += `> 标签 A: ${description.keywords[0]}` + '\n' + `解释: ${description.texts[0]}` + '\n'
                finalResult += `> 标签 B: ${description.keywords[1]}` + '\n' + `解释: ${description.texts[1]}` + '\n'
                if (imageUrl !== 'null') {
                    finalResult += `\n\n你的 MBTI 徽章和个性化形象图如下： ![final img](${headUrl}) \n ![final img](${imageUrl})` 
                }
                finalResult += "测试完成后有任何反馈和建议都可以填写问卷来和我们联系（支持多次填写），感谢参与！[传送门](https://www.wjx.cn/vm/mrpdkZw.aspx#)"
            }

            console.info(`[${payload.uid}]QA test done, the result is: `, finalResult);
            let resultExtras = {
                mbti: mbti, 
                headUrl: headUrl,
                imageUrl: imageUrl,
                description: description,
                naiveAttr: naiveAttr,
                // totalRatio: [], 
            }
            return {done: true, 'response_string': finalResult, 'result_extras': resultExtras};
        } catch (error) {
            // retry
            retryCount2 += 1
            if (retryCount2 > 5) {
                throw error
            }
            console.error(`[${payload.uid}Final Result Comm Error:`, error);
            await setTimeout(() => {}, 1000);
        }
    }
  }

  async postPosts(payload: any): Promise<any> {
    const startTime: Date = new Date();
    let finalPayload: { [key: string]: any } = payload;
    if (finalPayload.turnCount === this.phase2StartTurnCount) {
        finalPayload = await this.getPostsPayload(payload.uid, payload.messages, false);
    } else if (finalPayload.turnCount === this.phase3StartTurnCount) {
        finalPayload = await this.getPostsPayload(payload.uid, payload.messages, true);
    } else {
      throw new Error('Invalid turn count' + finalPayload.turnCount);
    }
    console.info(`[${finalPayload.uid}]post posts payload:`, finalPayload);
    const url = `${this.apiUrl}/${finalPayload.endpoint}`;

    let code = -1;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PSYDI_API_KEY || ''}`,
        },
        body: JSON.stringify(finalPayload),
      });
      const data = await response.json();
      code = data.code;
    } catch (error) {
      console.error(`[${finalPayload.uid}]Comm Error:`, error);
      throw error;
    }
  }

  async getQuestions(payload: any): Promise<any> {
    // post answer
    const startTime: Date = new Date();
    const uid = payload.uid;
    const turnCount = payload.turnCount;
    let endpoint = '';
    let answer = '';
    let index = -1;
    if (turnCount < this.phase3StartTurnCount + 1) {
        endpoint = 'post_user_pre_answer';
        answer = payload.messages[turnCount - 1].content;
        index = turnCount - 2;
    } else {
        endpoint = 'post_user_answer';
        answer = payload.messages[turnCount - 1].content;
    }

    let code = -1;
    if (turnCount === (this.phase2StartTurnCount + 2)) {
      code = 0
    } else {
      let finalPayload = {'uid': uid, 'answer': answer, 'index': index};
      console.info(`[${uid}]post answer payload:`, finalPayload);
      const url = `${this.apiUrl}/${endpoint}`;
      try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.PSYDI_API_KEY || ''}`,
            },
            body: JSON.stringify(finalPayload)
        });
        const data = await response.json();
        code = data.code;
        if (code === 0 && endpoint === 'post_user_pre_answer') {
            const newExplanation = await baiduTranslate(data.ret.post, 'en', 'zh')
            await kv.hset(`ucount:${uid}chat:${turnCount}`, {post: newExplanation});
        }
        //if (code === 0 && endpoint === 'post_user_answer') {
        //   const newExplanation = await baiduTranslate(data.ret.post, lang, 'en')
        //    await kv.hset(`ucount:${uid}chat:${turnCount}`, {post: newExplanation});
        //}
        } catch (error) {
        console.error(`[${uid}]Comm Error:`, error);
        throw error;
      }
    }

    const endTime: Date = new Date();
    const elapsedTime: number = endTime.getTime() - startTime.getTime();
    console.info(`[${uid}]${endpoint} elapsed time: ${elapsedTime}ms`);

    // post posts
    if (turnCount === this.phase3StartTurnCount) {
      await this.postPosts(payload);
    }

    // get question
    if (code === 0) {
      if (turnCount < this.phase3StartTurnCount) {
        return this.getPreQuestions(payload);
      } else {
        return this.getPhase3Questions(payload);
      }
    } else {
      console.error(`[${uid}Sever Error:`);
      throw new Error('Server Error');
    }
  }

  getNaiveAttrValue(table: Record<string, number>, predictedMBTI: string): Record<string, number> {
    const compareMapping = {
      'E': 'I',
      'S': 'N',
      'T': 'F',
      'J': 'P',
      'I': 'E',
      'N': 'S',
      'F': 'T',
      'P': 'J',
    }
    let naiveAttrValue = {} as Record<string, number>;
    for (let i = 0; i < 4; i++) {
      let oppositeMBTIArray = Array.from(predictedMBTI)  // deepcopy
      // @ts-ignore
      oppositeMBTIArray[i] = compareMapping[predictedMBTI[i]];
      const oppositeMBTI = oppositeMBTIArray.join('');
      const val = table[predictedMBTI] / (table[predictedMBTI] + table[oppositeMBTI])
      naiveAttrValue[predictedMBTI[i]] = val;
      naiveAttrValue[oppositeMBTI[i]] = 1 - val;
    }
    return naiveAttrValue
  }

  getMBTIOptionAnswer(answer: string): string[] {
    try {
      const option = parseInt(answer).toString();
      return [this.MBTIOptions[option], this.MBTIOptionsTrans[option], this.MBTIOptionsInfoTrans[option]];
    } catch (error) {
      // TODO error hints
      return ["none", "none", "none"]
    }
  }

  getBlobTreeAnswer(answer: string): string[] {
    try {
      const option = parseInt(answer).toString();
      return [this.BlobTreeOptions[option], this.BlobTreeOptionsTrans[option]];
    } catch (error) {
      // TODO error hints
      return ["none", "none"];
    }
  }

  getPhilosophyAnswer(answer: string): string {
    if (answer === '(A)') {
      return "Facing the trolley promblem, my decision is: Do nothing and let the train run over the five people on the normal route."
    } else if (answer === '(B)') {
      return "Facing the trolley promblem, my decision is: Pull the lever and change to another track, so that the train runs over the person on the other track."
    } else if (answer === '(C)') {
      return "Facing the trolley promblem, my decision is: Rush to the track and stop the train with your body to save the six people."
    } else if (answer === '(D)') {
      return "Facing the trolley promblem, my decision is: Do nothing, because no choice is inherently good or bad."
    } else {
      return "Facing the trolley promblem, my decision is: " + answer
    }
  }

  async getPostsPayload(uid: string, messages: Record<string, string>[], additional: boolean): Promise<Record<string, any>> {
    const startTime: Date = new Date();
    const rawContent = messages.map((message) => message.content)
    if (additional) {
      let postList = rawContent.slice(1)
      const mbtiOptionAnswer = this.getMBTIOptionAnswer(postList[0])
      const blobTreeAnswer = this.getBlobTreeAnswer(postList[1])
      postList[0] = mbtiOptionAnswer[0]
      postList[1] = blobTreeAnswer[0]

      kv.hset(`ucount:${uid}chat:2`, {post: mbtiOptionAnswer[2] + this.visualArtChoicePrefix + mbtiOptionAnswer[1]});
      kv.hset(`ucount:${uid}chat:3`, {post: blobTreeAnswer[1]});
      const post4 = kv.hget(`ucount:${uid}chat:4`, 'post') as Promise<string>;
      const post5 = kv.hget(`ucount:${uid}chat:5`, 'post') as Promise<string>;
      postList[2] = (await post4).toString()
      postList[3] = (await post5).toString()
      return {
        endpoint: 'post_additional_posts',
        uid: uid,
        post_list: postList,
      }
    } else {
      let postList = rawContent[0].split(/[\n,;,；]/)

      for (let i = 0; i < postList.length; i++) {
        postList[i] = await baiduTranslate(postList[i], lang, 'en')
      }
      return {
        endpoint: 'post_user_posts',
        uid: uid,
        post_list: postList,
        record: 'True',
      }
    }
  }
}

const agent = new PsyDI(process.env.PSYDI_API_URL || "placeholder")

export const getPsyDIAgent = () => {
  return agent;
};
