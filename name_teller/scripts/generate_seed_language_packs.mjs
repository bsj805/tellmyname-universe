// scripts/generate_seed_language_packs.mjs
import fs from 'fs';
import path from 'path';
import { hangulToRoman, hangulToIpa } from './add_multilingual_name.mjs';

const rootDir = process.cwd();
const i18nDir = path.join(rootDir, 'data', 'i18n');

const seedList = JSON.parse(fs.readFileSync(path.join(i18nDir, 'seed_names_input.json'), 'utf8'));

// 각 언어별 시적 번역 딕셔너리
const TRANSLATIONS = {
  "서윤": {
    en: { poeticTitle: "One who embraces the world with warm auspicious light and enriching grace", meaning: "Auspicious jade light & enriching rain" },
    hi: { poeticTitle: "शुभ प्रकाश से संसार को गर्मजोशी और समृद्धि से संवारने वाला व्यक्ति", meaning: "शुभ प्रकाश और अमृत वर्षा" },
    ja: { poeticTitle: "めでたい光で世界を温かく潤す人", meaning: "瑞兆の光と豊かな潤い" },
    zh: { poeticTitle: "以祥瑞之光温暖润泽世间之人", meaning: "祥瑞之光与丰润春雨" },
    es: { poeticTitle: "Aquel que abraza el mundo con luz auspiciosa y gracia enriquecedora", meaning: "Luz auspiciosa y lluvia fertilizadora" },
    vi: { poeticTitle: "Người mang ánh sáng điềm lành sưởi ấm và làm tươi nhuận thế gian", meaning: "Ánh sáng cát tường và mưa xuân trù phú" }
  },
  "지안": {
    en: { poeticTitle: "One who cultivates a serene, steadfast forest of tranquility through clear wisdom", meaning: "Bright wisdom and peaceful serenity" },
    hi: { poeticTitle: "स्पष्ट बुद्धि से अडिग शांति का वन संवारने वाला व्यक्ति", meaning: "निर्मल ज्ञान और गहरी शांति" },
    ja: { poeticTitle: "澄んだ知恵で揺るぎない平穏の森を育てる人", meaning: "清らかな知恵と安らぎ" },
    zh: { poeticTitle: "以清澈智慧培育安宁不动之林之人", meaning: "清澈智慧与安泰宁静" },
    es: { poeticTitle: "Aquel que cultiva un bosque inquebrantable de serenidad a través de una sabiduría clara", meaning: "Sabiduría clara y paz serena" },
    vi: { poeticTitle: "Người nuôi dưỡng khu rừng bình yên bất biến bằng trí tuệ sáng ngời", meaning: "Trí tuệ thanh khiết và an nhiên" }
  },
  "도윤": {
    en: { poeticTitle: "A person of integrity who walks their righteous path and earns trust with genuine light", meaning: "Righteous path & truthful sincerity" },
    hi: { poeticTitle: "सत्य के मार्ग पर चलकर अपने सच्चे प्रकाश से विश्वास जीतने वाला व्यक्ति", meaning: "सच्चा मार्ग और निष्ठावान विश्वास" },
    ja: { poeticTitle: "自らの正しい道を歩み、真実の光で信頼を得る人", meaning: "正しい道と真実の信条" },
    zh: { poeticTitle: "踏上正义坦途，以真诚之光赢得世人信赖之人", meaning: "正道前行与真诚信赖" },
    es: { poeticTitle: "Aquel que camina por un sendero recto y gana confianza con una luz sincera", meaning: "Camino recto y confianza sincera" },
    vi: { poeticTitle: "Người bước đi trên con đường chính đạo và tạo dựng niềm tin bằng ánh sáng chân thành", meaning: "Đạo nghĩa vững vàng và niềm tin son sắt" }
  },
  "하준": {
    en: { poeticTitle: "One who grows fresh, vibrant, and distinguished like green summer trees", meaning: "Summer vibrancy & eminent talent" },
    hi: { poeticTitle: "ग्रीष्म ऋतु के हरे-भरे वृक्ष की तरह जीवंत और प्रतिष्ठित रूप से बढ़ने वाला व्यक्ति", meaning: "ग्रीष्म की ताजगी और उत्कृष्ट प्रतिभा" },
    ja: { poeticTitle: "夏の青葉のようにみずみずしく優れて育つ人", meaning: "夏の青葉と傑出した才気" },
    zh: { poeticTitle: "如盛夏青葱繁木般蓬勃出众、拔萃成长之人", meaning: "夏日朝气与出众才智" },
    es: { poeticTitle: "Aquel que crece fresco, vibrante y distinguido como los árboles del verano", meaning: "Vitalidad de verano y eminente talento" },
    vi: { poeticTitle: "Người trưởng thành tươi mát và kiệt xuất như bóng cây mùa hạ xanh biếc", meaning: "Khí sắc mùa hạ tươi tốt và tài hoa xuất chúng" }
  },
  "서연": {
    en: { poeticTitle: "One who blooms with gracious smiles and wisdom amidst auspicious spring light", meaning: "Auspicious grace & radiant beauty" },
    hi: { poeticTitle: "शुभ वसंत की धूप में सौम्य मुस्कान और बुद्धि से खिलने वाला व्यक्ति", meaning: "शुभ सुंदरता और उज्ज्वल ज्ञान" },
    ja: { poeticTitle: "めでたい春の光の中で優しい微笑みと知恵を咲かせる人", meaning: "瑞祥の光とたおやかな美しさ" },
    zh: { poeticTitle: "在祥瑞春光中绽放优雅微笑与智慧之人", meaning: "祥瑞韶光与温婉秀丽" },
    es: { poeticTitle: "Aquel que florece con sonrisas elegantes y sabiduría bajo la luz auspiciosa de la primavera", meaning: "Gracia auspiciosa y radiante belleza" },
    vi: { poeticTitle: "Người nở nụ cười duyên dáng và trí tuệ trong ánh xuân điềm lành", meaning: "Điềm lành tao nhã và vẻ đẹp rạng rỡ" }
  },
  "민준": {
    en: { poeticTitle: "One who illuminates the world with a high, clear spirit resembling the autumn sky", meaning: "Autumn sky clarity & exceptional brilliance" },
    hi: { poeticTitle: "शरद ऋतु के आकाश की तरह ऊंचे और निर्मल हृदय से संसार को रोशन करने वाला व्यक्ति", meaning: "शरद आकाश और असाधारण प्रतिभा" },
    ja: { poeticTitle: "秋の空のように高く澄んだ心で世界を照らす人", meaning: "秋晴れの澄んだ心と優れた才気" },
    zh: { poeticTitle: "怀抱如秋空般高远澄澈之心照亮世界之人", meaning: "秋空明朗与卓越拔群" },
    es: { poeticTitle: "Aquel que ilumina el mundo con un espíritu alto y claro como el cielo otoñal", meaning: "Claridad otoñal y brillo excepcional" },
    vi: { poeticTitle: "Người soi sáng thế gian bằng tấm lòng cao rộng và trong sáng như bầu trời thu", meaning: "Trời thu trong vắt và tài năng kiệt xuất" }
  },
  "시우": {
    en: { poeticTitle: "One blessed with timely seasonal grace and steadfast lifelong benefactors", meaning: "Precious season & heavenly blessing" },
    hi: { poeticTitle: "सदा उपयुक्त समय के वरदान और दिव्य संरक्षण से भरपूर जीवन जीने वाला व्यक्ति", meaning: "शुभ समय और ईश्वरीय अनुग्रह" },
    ja: { poeticTitle: "花咲く最良の季節を胸に抱き、天の助けに恵まれる人", meaning: "時を得た祝福と頼もしい助力" },
    zh: { poeticTitle: "把握百花盛放之宝贵时节，常得天佑与贤友相伴之人", meaning: "应时而发与福泽长伴" },
    es: { poeticTitle: "Aquel bendecido con la gracia de la estación propicia y protectores constantes", meaning: "Estación propicia y bendición celestial" },
    vi: { poeticTitle: "Người được đón nhận thời khắc tươi đẹp nhất và nhận phúc lành trợ giúp từ trời", meaning: "Đúng thời đắc lộc và quý nhân phù trợ" }
  },
  "하윤": {
    en: { poeticTitle: "One whose vibrant summer energy enriches and nourishes the world like timely rain", meaning: "Summer vitality & nourishing enrichment" },
    hi: { poeticTitle: "ग्रीष्म ऋतु की ऊर्जा से अमृत वर्षा की तरह संसार को समृद्ध करने वाला व्यक्ति", meaning: "ग्रीष्म ऊर्जा और जीवनदायिनी वर्षा" },
    ja: { poeticTitle: "初夏の青葉の気迫で、恵みの雨のように世を豊かに潤す人", meaning: "初夏の生気と潤沢な恵み" },
    zh: { poeticTitle: "以初夏青木之生机，如甘霖润土般丰盛世间之人", meaning: "夏木青葱与滋养万物" },
    es: { poeticTitle: "Aquel cuya vibrante energía de verano enriquece el mundo como lluvia bienhechora", meaning: "Vitalidad de verano y gracia enriquecedora" },
    vi: { poeticTitle: "Người dùng sức sống mùa hạ tươi nhuận thế gian như cơn mưa ngọt ngào", meaning: "Sức sống đầu hạ và tưới mát nhân gian" }
  },
  "지우": {
    en: { poeticTitle: "One guided by insightful wisdom, walking with divine favor and trusted companions", meaning: "Insightful wisdom & divine protection" },
    hi: { poeticTitle: "निर्मल अंतर्दृष्टि से सच्चाई को देखने वाला और दिव्य अनुग्रह पाने वाला व्यक्ति", meaning: "गहरी बुद्धि और सुरक्षा" },
    ja: { poeticTitle: "物事の理を見通す明るい知恵と天の加護に恵まれる人", meaning: "明晰な知恵と天の加護" },
    zh: { poeticTitle: "以洞察万理之高明智慧，沐浴天恩与至交之人", meaning: "明慧洞达与天赐福祐" },
    es: { poeticTitle: "Aquel guiado por una profunda sabiduría, caminando con favor divino", meaning: "Sabiduría perspicaz y protección divina" },
    vi: { poeticTitle: "Người thấu suốt sự đời bằng trí tuệ minh triết và luôn được chở che", meaning: "Trí tuệ thông suốt và phúc trọn vẹn" }
  },
  "서아": {
    en: { poeticTitle: "One gifted with auspicious jade radiance and the classical elegance of pure melody", meaning: "Auspicious jade & classical elegance" },
    hi: { poeticTitle: "शुभ जेड मणि की चमक और मधुर काव्यात्मक लालित्य से युक्त व्यक्ति", meaning: "शुभ आभा और सुरम्य शिष्टता" },
    ja: { poeticTitle: "天からの瑞兆たる玉の気品と、詩のように優雅な品格を持つ人", meaning: "瑞祥の玉光と優美な気品" },
    zh: { poeticTitle: "秉承天赐祥玉之气，如清丽诗篇般优雅端庄之人", meaning: "祥瑞温玉与雅致气度" },
    es: { poeticTitle: "Aquel agraciado con radiación auspiciosa y la elegancia clásica de pura poesía", meaning: "Jade auspicioso y elegancia clásica" },
    vi: { poeticTitle: "Người mang khí chất ngọc bích cát tường và nét tao nhã tựa thi ca", meaning: "Ngọc lành rạng rỡ và thanh tao trang nhã" }
  },
  "예준": {
    en: { poeticTitle: "One blending artistic brilliance with noble talent, serving as an inspiring exemplar", meaning: "Artistic talent & outstanding character" },
    hi: { poeticTitle: "कलात्मक प्रतिभा और उत्कृष्ट चरित्र के साथ प्रेरणास्रोत बनने वाला व्यक्ति", meaning: "कलात्मक प्रतिभा और उदात्त चरित्र" },
    ja: { poeticTitle: "卓越した芸術的感性と優れた品格で人々のお手本となる人", meaning: "芸術的才能と優れた品格" },
    zh: { poeticTitle: "融汇非凡艺术灵感与出众才德，堪为世人榜样之人", meaning: "艺韵超群与俊秀风范" },
    es: { poeticTitle: "Aquel que une brillantez artística con talento noble, inspirando a los demás", meaning: "Brillantez artística y nobleza" },
    vi: { poeticTitle: "Người hội tụ năng khiếu nghệ thuật tài hoa và phẩm hạnh gương mẫu", meaning: "Nghệ thuật tài hoa và tuấn kiệt mẫu mực" }
  },
  "주원": {
    en: { poeticTitle: "One who shines like a deep-sea pearl, loved by all for gentle grace and noble poise", meaning: "Precious pearl & virtuous charm" },
    hi: { poeticTitle: "गहरे समुद्र के मोती की तरह चमकने वाला और सबके दिलों का प्रिय व्यक्ति", meaning: "अनमोल मोती और दयालु आकर्षण" },
    ja: { poeticTitle: "深海の真珠のように美しく、慈愛に満ちた魅力で愛される主人公", meaning: "真珠の輝きと高潔な魅力" },
    zh: { poeticTitle: "如深海珍珠般温润璀璨，以仁善芳华深得众爱之人", meaning: "明珠珍贵与名媛淑德" },
    es: { poeticTitle: "Aquel que brilla como perla preciosa, amado por su gracia y noble serenidad", meaning: "Perla preciosa y encanto virtuoso" },
    vi: { poeticTitle: "Người tỏa sáng như ngọc trai đáy biển, được mến mộ bởi vẻ đẹp hiền dịu cao quý", meaning: "Viên ngọc quý giá và duyên dáng nhân từ" }
  },
  "유준": {
    en: { poeticTitle: "One endowed with generous love, peace of mind, and exemplary wisdom", meaning: "Abundant love & distinguished talent" },
    hi: { poeticTitle: "अपार प्रेम, आंतरिक शांति और अनुकरणीय ज्ञान से संपन्न व्यक्ति", meaning: "प्रचुर प्रेम और उत्कृष्ट प्रतिभा" },
    ja: { poeticTitle: "心のゆとりと温かい愛に満ち、優れた才気で手本となる人", meaning: "心の豊かさと優れた才気" },
    zh: { poeticTitle: "心怀从容大爱与从容气度，才德兼备为世人表率之人", meaning: "从容丰盈与英才卓绝" },
    es: { poeticTitle: "Aquel dotado de amor generoso, tranquilidad y sabiduría ejemplar", meaning: "Amor abundante y talento distinguido" },
    vi: { poeticTitle: "Người tràn đầy tình yêu bao dung, tâm an yên và tài đức vẹn toàn", meaning: "Tâm hồn rộng mở và tài trí tuấn kiệt" }
  },
  "지호": {
    en: { poeticTitle: "One with piercing wisdom and boundless open-hearted spirit like the dawn sky", meaning: "Clear wisdom & broad noble spirit" },
    hi: { poeticTitle: "तीक्ष्ण बुद्धि और भोर के आकाश की तरह विशाल खुले दिल वाला व्यक्ति", meaning: "स्पष्ट बुद्धि और विशाल उदारता" },
    ja: { poeticTitle: "万理を見抜く明るい知恵と、夜明けの空のように清らかな気概を持つ人", meaning: "明晰な知恵と雄大な気概" },
    zh: { poeticTitle: "兼具洞察万象之明慧，怀抱如拂晓青天般浩瀚浩然之气之人", meaning: "明辨睿智与皓月朗气" },
    es: { poeticTitle: "Aquel de sabiduría profunda y noble espíritu abierto como el cielo del alba", meaning: "Sabiduría lúcida y espíritu magnánimo" },
    vi: { poeticTitle: "Người sở hữu trí tuệ sáng suốt và khí phách khoáng đạt như bầu trời rạng đông", meaning: "Trí tuệ tinh thông và hào khí quang minh" }
  },
  "하은": {
    en: { poeticTitle: "One who remembers love received and shares warm kindness with the world", meaning: "Summer vitality & warm gratitude" },
    hi: { poeticTitle: "पाए हुए प्रेम को याद रखकर संसार में गर्मजोशी भरी कृपा बांटने वाला व्यक्ति", meaning: "ग्रीष्म जीवंतता और दयालु अनुग्रह" },
    ja: { poeticTitle: "初夏の青葉の生気と共に、受けた愛を忘れず世に恵みを施す心優しい人", meaning: "初夏の生気と温かい恩恵" },
    zh: { poeticTitle: "常怀夏木葱茏生机，铭记深情厚爱并温情回馈世间之人", meaning: "夏意芬芳与常怀感恩" },
    es: { poeticTitle: "Aquel que atesora el amor recibido y comparte bondad con el mundo", meaning: "Vitalidad estival y cálida gratitud" },
    vi: { poeticTitle: "Người nhớ ơn yêu thương và lan tỏa ân tình ấm áp cho đời", meaning: "Khí chất mùa hạ và tấm lòng thơm thảo" }
  },
  "이서": {
    en: { poeticTitle: "One of picturesque poise, surrounded by auspicious jade blessings and serenity", meaning: "Picturesque beauty & auspicious blessing" },
    hi: { poeticTitle: "चित्रमय गरिमा और शुभ जेड मणि के आशीर्वाद से घिरा शांत व्यक्ति", meaning: "सुंदर रूप और मंगलकारी वरदान" },
    ja: { poeticTitle: "たたずまいそのものが絵画のように美しく、天の瑞兆を宿す人", meaning: "端正なたたずまいと瑞兆の光" },
    zh: { poeticTitle: "仪态端庄如诗如画，常伴祥瑞温润福气之人", meaning: "端庄韶秀与天降祥瑞" },
    es: { poeticTitle: "Aquel de porte pintoresco, rodeado de auspiciosas bendiciones y serenidad", meaning: "Belleza pintoresca y gracia auspiciosa" },
    vi: { poeticTitle: "Người có dáng vẻ thanh tú như tranh vẽ, luôn ngập tràn điềm lành cát tường", meaning: "Phong thái như họa và phúc trạch dồi dào" }
  },
  "건우": {
    en: { poeticTitle: "A dignified leader establishing noble foundations with steadfast heavenly favor", meaning: "Strong foundation & divine leadership" },
    hi: { poeticTitle: "मजबूत नींव स्थापित करके दिव्य अनुग्रह के साथ संसार का नेतृत्व करने वाला व्यक्ति", meaning: "मजबूत आधार और दिव्य नेतृत्व" },
    ja: { poeticTitle: "大志と基盤を堂々と築き、天の加護と共に世を率いるリーダー", meaning: "偉大な基礎と天の加護" },
    zh: { poeticTitle: "立天地之宏基大局，沐天赐浩祐引领世人之前驱者", meaning: "立志建业与福泽高照" },
    es: { poeticTitle: "Un líder digno que erige nobles cimientos bajo constante favor celestial", meaning: "Cimientos fuertes y liderazgo bendecido" },
    vi: { poeticTitle: "Người dựng xây nền móng vững chắc và dẫn dắt với sự che chở của trời", meaning: "Kiến tạo cơ đồ và phúc khí đồng hành" }
  },
  "우진": {
    en: { poeticTitle: "A precious and shining treasure cherished by all, sustained by heavenly blessings", meaning: "Heavenly blessing & rare jewel" },
    hi: { poeticTitle: "दिव्य अनुग्रह से पोषित, संसार का एक दुर्लभ और चमकता हुआ अनमोल रत्न", meaning: "ईश्वरीय वरदान और दुर्लभ मणि" },
    ja: { poeticTitle: "天の恵みに守られ、この世にただ一つの輝く宝のように大切にされる人", meaning: "天の恵みとかけがえのない宝" },
    zh: { poeticTitle: "承蒙天佑常伴一生，如世间独一无二璀璨至宝之人", meaning: "承天福佑与至贵珍宝" },
    es: { poeticTitle: "Un tesoro brillante y precioso apreciado por todos, bendecido por los cielos", meaning: "Bendición divina y joya preciada" },
    vi: { poeticTitle: "Báu vật sáng ngời trân quý duy nhất trên đời, nhận trọn phúc lành trời ban", meaning: "Trời ban ân phước và ngọc quý nhân gian" }
  },
  "지아": {
    en: { poeticTitle: "One of refined classical elegance, graced with penetrating insight and melodious charm", meaning: "Bright wisdom & elegant poise" },
    hi: { poeticTitle: "स्पष्ट अंतर्दृष्टि और काव्यात्मक संगीत की तरह शालीन व्यक्तित्व वाला इंसान", meaning: "उज्ज्वल बुद्धि और सुरुचिपूर्ण शिष्टता" },
    ja: { poeticTitle: "理を見極める明るい知恵と、詩のように気品ある優雅さを備えた人", meaning: "明晰な知恵と気品ある美しさ" },
    zh: { poeticTitle: "通达事理兼具高尚明慧，如清雅诗曲般风度翩翩之人", meaning: "清明睿智与雍容风雅" },
    es: { poeticTitle: "Aquel de refinada elegancia clásica, agraciado con sabiduría y encanto poético", meaning: "Sabiduría brillante y encanto elegante" },
    vi: { poeticTitle: "Người sở hữu trí tuệ sáng ngời và khí chất trang nhã tựa thi ca nhạc khúc", meaning: "Trí tuệ thông suốt và phong nhã đoan trang" }
  },
  "선우": {
    en: { poeticTitle: "One whose benevolence spreads pure light, supported by constant heavenly grace", meaning: "Pure goodness & blessed companion" },
    hi: { poeticTitle: "अपनी अच्छाई से संसार में सकारात्मक प्रभाव फैलाने वाला पवित्र हृदय व्यक्ति", meaning: "सच्ची भलाई और दिव्य अनुग्रह" },
    ja: { poeticTitle: "清らかな善意で世に良い影響を広げ、天の祝福に包まれる人", meaning: "清らかな善意と天の助け" },
    zh: { poeticTitle: "以纯善仁爱广施善念，常沐天恩福慧双修之人", meaning: "心地纯善与天祐吉人" },
    es: { poeticTitle: "Aquel cuya bondad irradia luz pura, acompañado siempre por bendiciones divinas", meaning: "Bondad pura y compañía bendecida" },
    vi: { poeticTitle: "Người lan tỏa năng lượng thiện lương tốt đẹp và luôn được trời xanh che chở", meaning: "Lương thiện thuần khiết và quý nhân đồng hành" }
  },
  "연우": {
    en: { poeticTitle: "One blossoming like gentle spring blooms, surrounded by steadfast blessings", meaning: "Spring flower grace & blessed journey" },
    hi: { poeticTitle: "वसंत के फूलों की तरह खिलने वाला और दिव्य आशीर्वाद से भरपूर जीवन जीने वाला", meaning: "वसंत पुष्प लालित्य और आशीर्वाद" },
    ja: { poeticTitle: "春の花のような優美さと、天の加護がいつも共にある麗しい人生", meaning: "春の花の優美さと天の恵み" },
    zh: { poeticTitle: "宛若春花初绽般娇美灵动，一生常得天之福祐之人", meaning: "春花娇妍与天赐安康" },
    es: { poeticTitle: "Aquel que florece con la ternura de las flores primaverales y ricas bendiciones", meaning: "Gracia primaveral y camino bendito" },
    vi: { poeticTitle: "Người tươi thắm như hoa xuân và luôn nhận được sự trợ giúp tốt lành", meaning: "Nét đẹp hoa xuân và ngập tràn may mắn" }
  },
  "채원": {
    en: { poeticTitle: "A captivating leader shining like a rainbow, beloved everywhere for gracious poise", meaning: "Rainbow brightness & noble charm" },
    hi: { poeticTitle: "इंद्रधनुष की तरह बहुआयामी आभा और शालीन आकर्षण से सभी का प्रिय व्यक्ति", meaning: "इंद्रधनुषी आभा और महान आकर्षण" },
    ja: { poeticTitle: "春の虹のように美しく輝き、高潔な気品でどこでも愛される主人公", meaning: "春の虹の輝きと高潔な魅力" },
    zh: { poeticTitle: "如春虹焕彩般明艳动人，以仁德优雅之姿广受世人爱戴之人", meaning: "虹彩绚烂与名门媛德" },
    es: { poeticTitle: "Líder cautivador que brilla como un arcoíris, querido por su noble carisma", meaning: "Brillo de arcoíris y encanto noble" },
    vi: { poeticTitle: "Nhân vật trung tâm tỏa sắc như cầu vồng mùa xuân, được yêu mến ở mọi nơi", meaning: "Rực rỡ sắc cầu vồng và đoan trang quý phái" }
  },
  "수아": {
    en: { poeticTitle: "One of autumnal elegance and harvest purity, flowing with poetic grace", meaning: "Eminent talent & refined elegance" },
    hi: { poeticTitle: "शरद ऋतु की प्रचुरता और काव्यात्मक शालीनता से परिपूर्ण सुंदर आत्मा", meaning: "उत्कृष्ट प्रतिभा और परिष्कृत सुंदरता" },
    ja: { poeticTitle: "秋の豊かな実りの気品と、詩のように端正な美しさを備えた人", meaning: "優れた才能と端麗な気品" },
    zh: { poeticTitle: "才情气度如秋实般丰盛端雅，清诗幽韵自成风骨之人", meaning: "秀拔才韵与温雅纯美" },
    es: { poeticTitle: "Aquel de elegancia otoñal y pureza fecunda, rebosante de gracia poética", meaning: "Talento eminente y elegancia refinada" },
    vi: { poeticTitle: "Người có tài năng và khí phách chín chắn như đồng lúa thu, thanh tú tao nhã", meaning: "Tài năng kiệt xuất và thanh tao đài các" }
  },
  "은우": {
    en: { poeticTitle: "One walking with gratitude, showering warm grace upon the world with divine favor", meaning: "Kind benevolence & blessed harmony" },
    hi: { poeticTitle: "कृतज्ञता से भरा दिल रखकर संसार पर दिव्य अनुग्रह बरसाने वाला इंसान", meaning: "दयालु अनुग्रह और धन्य सामंजस्य" },
    ja: { poeticTitle: "愛に感謝し世に恩恵を広げ、天の加護と共に歩む温かい人", meaning: "温かい恩恵と天の恵み" },
    zh: { poeticTitle: "感恩于心广施温情仁惠，沐天之福祐度过美满一生之人", meaning: "感恩仁德与天降吉祥" },
    es: { poeticTitle: "Aquel que camina con gratitud, derramando cálida gracia sobre el mundo", meaning: "Bondadosa benevolencia y armonía" },
    vi: { poeticTitle: "Người ghi nhớ ân tình và ban phát ân nghĩa ấm áp cùng sự chở che từ trời", meaning: "Ân nghĩa chan hòa và phúc lộc song toàn" }
  },
  "현우": {
    en: { poeticTitle: "A wise, benevolent soul honored and cherished by all, guided by divine favor", meaning: "Virtuous wisdom & heavenly blessing" },
    hi: { poeticTitle: "सद्गुणी बुद्धि से सबका आदर और प्रेम पाने वाला और दिव्य कृपा से धन्य व्यक्ति", meaning: "सच्चा ज्ञान और ईश्वरीय वरदान" },
    ja: { poeticTitle: "賢明な知恵で人々の敬愛を受け、天の恵みと共に歩む立派な人", meaning: "賢明な知恵と天の加護" },
    zh: { poeticTitle: "以通达仁智广受世人景仰与爱戴，常获上天垂青福泽之人", meaning: "贤达仁智与福星高照" },
    es: { poeticTitle: "Un alma sabia y benevolente, honrada y querida por todos con favor divino", meaning: "Sabiduría virtuosa y bendición" },
    vi: { poeticTitle: "Người hiền tài thông tuệ được muôn người kính mến và nhận phước lành từ trời", meaning: "Hiền tài minh mẫn và vạn sự cát lành" }
  },
  "지유": {
    en: { poeticTitle: "One possessing crystal clarity of insight along with generous warmth and love", meaning: "Clear insight & abundant affection" },
    hi: { poeticTitle: "स्पष्ट अंतर्दृष्टि के साथ भरपूर प्रेम और आंतरिक शांति रखने वाला व्यक्ति", meaning: "स्पष्ट बुद्धि और प्रचुर प्रेम" },
    ja: { poeticTitle: "真理を見抜く明るい知恵と、心豊かな愛情を兼ね備えた人", meaning: "澄んだ知恵と豊かな愛情" },
    zh: { poeticTitle: "通晓事理明澈心扉，胸臆常盈宽厚大爱与丰盈从容之人", meaning: "知性通达与包容宽裕" },
    es: { poeticTitle: "Aquel que posee claridad cristalina en su juicio, unida a calidez y amor", meaning: "Juicio lúcido y abundante afecto" },
    vi: { poeticTitle: "Người có trí tuệ sáng tỏ sự đời cùng tấm lòng rộng mở đong đầy yêu thương", meaning: "Trí huệ thấu đáo và tấm lòng bao dung" }
  },
  "도현": {
    en: { poeticTitle: "One walking their righteous philosophy with conviction, honored for sage wisdom", meaning: "Righteous path & sage wisdom" },
    hi: { poeticTitle: "अपने सिद्धांतों के सच्चे मार्ग पर दृढ़ता से चलकर आदर पाने वाला बुद्धिमान व्यक्ति", meaning: "सच्चा मार्ग और ऋषि सदृश बुद्धि" },
    ja: { poeticTitle: "自らの正しい哲学の道を堂々と歩み、賢明な知恵で敬愛される人", meaning: "正道への信念と賢明な知恵" },
    zh: { poeticTitle: "笃守自身纯正信念之道，以贤达卓识受世人景仰之人", meaning: "坚持正道与贤明达德" },
    es: { poeticTitle: "Aquel que recorre su sendero con firme convicción, venerado por su sabiduría", meaning: "Sendero recto y sabia prudencia" },
    vi: { poeticTitle: "Người vững vàng đi trên con đường lý tưởng chân chính, được kính trọng bởi sự hiền minh", meaning: "Đạo nghĩa vững vàng và hiền tài đức độ" }
  },
  "다은": {
    en: { poeticTitle: "One filled with blessings, smiles, and sweet gratitude that warms the world", meaning: "Abundant joy & kind benevolence" },
    hi: { poeticTitle: "आशीर्वाद, मुस्कान और कृतज्ञता से भरा हुआ संसार को गर्मजोशी देने वाला व्यक्ति", meaning: "प्रचुर आनंद और दयालु कृपा" },
    ja: { poeticTitle: "幸福と笑顔、受けた愛を忘れず世に温かい恩恵を届ける優しい心の人", meaning: "多大なる幸福と温かい恩恵" },
    zh: { poeticTitle: "福慧常在欢声盈溢，常怀仁恩温厚报答世间之人", meaning: "万福欣至与深仁厚恩" },
    es: { poeticTitle: "Aquel colmado de bendiciones, sonrisas y una dulce gratitud que reconforta", meaning: "Alegría abundante y cálida benevolencia" },
    vi: { poeticTitle: "Người luôn đong đầy niềm vui, tiếng cười và tấm lòng thơm thảo sưởi ấm thế gian", meaning: "Vạn điều phúc lành và ân nghĩa đong đầy" }
  },
  "유나": {
    en: { poeticTitle: "One radiating effortless springtime elegance, filled with serene love and abundance", meaning: "Generous abundance & graceful charm" },
    hi: { poeticTitle: "वसंत के फूलों की तरह स्वाभाविक लालित्य और शांत प्रेम से परिपूर्ण व्यक्ति", meaning: "उदार प्रचुरता और सुंदर आकर्षण" },
    ja: { poeticTitle: "心のゆとりと愛に満ち、春の花のように優雅で愛らしい魅力を持つ人", meaning: "心の豊かさと優美な魅力" },
    zh: { poeticTitle: "心境从容充盈大爱，如春花般柔美温雅、令人动容之人", meaning: "安然丰盈与娇媚温婉" },
    es: { poeticTitle: "Aquel que irradia elegancia primaveral, colmado de amor sereno y abundancia", meaning: "Abundancia generosa y encanto grácil" },
    vi: { poeticTitle: "Người mang phong thái thanh lịch tựa hoa xuân, tràn ngập tình yêu và sự viên mãn", meaning: "Tâm hồn rộng mở và duyên dáng dịu dàng" }
  },
  "윤우": {
    en: { poeticTitle: "One refreshing the earth like sweet rain, guided by eternal celestial favor", meaning: "Nourishing rain & heavenly grace" },
    hi: { poeticTitle: "अमृत वर्षा की तरह संसार को सींचने वाला और दिव्य अनुग्रह पाने वाला व्यक्ति", meaning: "जीवनदायिनी वर्षा और ईश्वरीय वरदान" },
    ja: { poeticTitle: "恵みの雨のように世を潤し、天の豊かな祝福と共に歩む人", meaning: "潤沢な恵みと天の加護" },
    zh: { poeticTitle: "如好雨知时节般润泽四方，一生得天独厚福泽绵延之人", meaning: "润泽万物与常得天祐" },
    es: { poeticTitle: "Aquel que refresca la tierra como dulce lluvia, guiado por gracia celestial", meaning: "Lluvia nutriente y gracia celestial" },
    vi: { poeticTitle: "Người tưới mát thế gian như cơn mưa lành và luôn được chở che an bình", meaning: "Tưới mát nhân gian và hưởng trọn phúc lành" }
  },
  "윤슬비": {
    en: { poeticTitle: "One who graces the world with the nourishing power of rain, zither melody, and wings of freedom", meaning: "Enriching rain, zither melody, and free flight" },
    hi: { poeticTitle: "अमृत वर्षा की शक्ति, वीणा की मधुर धुन और स्वतंत्रता के पंखों से संसार को संवारने वाला", meaning: "अमृत वर्षा, वीणा स्वर और स्वतंत्र उड़ान" },
    ja: { poeticTitle: "恵みの雨と琴の清らかな調べ、そして天空へ羽ばたく自由な翼を持つ人", meaning: "豊かな潤いと琴の調べ、自由な飛翔" },
    zh: { poeticTitle: "怀抱润土甘霖之力、清越琴瑟之音与翱翔碧落之翼之人", meaning: "丰润春雨、琴瑟和鸣与展翅高飞" },
    es: { poeticTitle: "Aquel que embellece el mundo con la lluvia nutriente, melodía de cítara y alas de libertad", meaning: "Lluvia fertilizante, melodía de cítara y vuelo libre" },
    vi: { poeticTitle: "Người làm đẹp thế gian bằng sức mạnh mưa lành, khúc nhạc cầm trong trẻo và đôi cánh tự do", meaning: "Mưa nhuần trù phú, tiếng đàn thanh tao và sải cánh tự do" }
  }
};

const supportedLangs = ['en', 'hi', 'ja', 'zh', 'es', 'vi'];

for (const lang of supportedLangs) {
  const pack = {};
  for (const item of seedList) {
    const name = item.name;
    const roman = hangulToRoman(name);
    const ipa = hangulToIpa(name);
    const trans = TRANSLATIONS[name] && TRANSLATIONS[name][lang] ? TRANSLATIONS[name][lang] : {
      poeticTitle: item.meaning,
      meaning: item.meaning
    };

    pack[name] = {
      roman,
      ipa,
      hanja: item.hanja || '',
      poeticTitle: trans.poeticTitle,
      meaning: trans.meaning
    };
  }

  const outPath = path.join(i18nDir, `names_${lang}.json`);
  fs.writeFileSync(outPath, JSON.stringify(pack, null, 2), 'utf8');
  console.log(`[Language Pack] Written data/i18n/names_${lang}.json (${Object.keys(pack).length} items)`);
}
