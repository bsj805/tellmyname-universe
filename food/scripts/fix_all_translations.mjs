// scripts/fix_all_translations.mjs — Comprehensive translation repair & audit tool
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const rawFoods = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'raw_foods_collected.json'), 'utf8'));

// 1. English Taglines Map for the 58 shifted / corrupted foods
const EN_TAGLINE_FIXES = {
  "00020": "Fluffy dinner rolls generously stuffed with diced apples, sweet fruit cocktail, and creamy mayonnaise salad.",
  "00068": "The legendary fusion Chinese dish that shook mint chocolate lovers and haters alike: crisp pork tangsuyuk drizzled with sweet mint chocolate sauce.",
  "00069": "The viral luxury bungeoppang pastry packed with crispy kataifi phyllo shreds, rich pistachio cream, and dark chocolate coating.",
  "00070": "Hand-pulled squid ink black bean noodles crowned with an entire forearm-sized crispy fried whole squid.",
  "00071": "A show-stopping visual feast of spicy mala rosé rice cakes and chewy bunmoja smothered in a 1kg cascading waterfall of melted mozzarella.",
  "00072": "Crack open the giant chocolate dinosaur eggshell with a wooden mallet to discover fluffy milk snowflake bingsu and dinosaur gummies inside!",
  "00073": "The ultimate paradise for cilantro lovers: deep rich beef bone pho broth completely submerged beneath a mountain of fresh cilantro.",
  "00074": "A jaw-dropping 55cm wooden board lined with seasoned Hanwoo beef tartare sushi and finished with glistening 24K edible pure gold leaf.",
  "00077": "A hollowed-out fresh musk melon bowl overflowing with fluffy shaved milk ice, melon balls, vanilla ice cream, and sweetened condensed milk.",
  "00081": "Savory fermented soybean stew enriched with buttery beef brisket, paired with a barley rice bowl tossed in crunchy young summer radish kimchi and sesame oil.",
  "00083": "Thick, juicy aged pork belly sizzling on a cast-iron lid with kimchi, bean sprouts, and fragrant fresh water parsley, finished with fried rice.",
  "00084": "A warm bowl of steamed white rice hiding a melted pat of butter, topped with two runny fried eggs, crispy grilled Spam slices, and seasoned soy sauce.",
  "00122": "A rich, bubbling spicy stew packed with minced beef, baked beans, sausages, Spam, ramen noodles, and a slice of melted cheddar cheese.",
  "00127": "Crispy wood-fired sourdough crust topped with pungent Italian Gorgonzola cheese, served with fragrant wild acacia honey for dipping.",
  "00129": "Toasted brioche bun stacked with double smashed Hanwoo beef patties seared on a flat-top grill, melted American cheese, and house secret sauce.",
  "00130": "Melt-in-your-mouth pork shoulder slow-smoked for 12 hours over hickory wood, shredded and piled high on a bun with tangy coleslaw.",
  "00131": "Dry-fried black bean sauce packed with fresh seafood and sweet onions cooked without a drop of water, poured over chewy noodles with a sunny-side-up egg.",
  "00133": "Golden deep-fried toast triangles bursting with juicy minced whole shrimp stuffing, an iconic delicacy of Chinese fine dining.",
  "00134": "Silky soft tofu simmered with minced pork and tongue-numbing Sichuan peppercorns in fiery chili bean paste over warm steamed rice.",
  "00168": "A warm, fluffy castella-like street bread baked with a whole runny egg inside, lightly seasoned with sea salt and parsley flakes.",
  "00170": "Thick, chewy Korean cylinder rice cakes simmered for hours in deep anchovy and crab broth until velvety tender, served on skewers.",
  "00171": "Zero heavy cream! The authentic Roman classic emulsified solely with rendered guanciale pork cheek fat, rich farm egg yolks, and sharp Pecorino Romano cheese.",
  "00172": "Baked in 90 seconds inside a 480°C wood-fired oven: blistered chewy cornicione crust topped with San Marzano tomatoes, fresh buffalo mozzarella, and fragrant basil.",
  "00173": "Handmade butternut squash and ricotta gnocchi pan-seared until golden and crisp, tossed in aromatic nutty brown butter and fried sage leaves.",
  "00174": "Straight from the Venetian lagoon: al dente Carnaroli rice simmered in jet-black squid ink broth with tender calamari rings and sweet black mussels.",
  "00175": "Slow-simmered Carnaroli rice enriched with wild rehydrated porcini mushroom broth and showered with generous shavings of 24-month aged Parmigiano Reggiano.",
  "00176": "Al dente linguine pasta coated in an emulsified sauce of sweet fresh clam nectar, fruity extra virgin olive oil, garlic, and dry white wine.",
  "00177": "Five glorious layers of wide fresh pasta sheets, slow-simmered Bolognese beef ragù, velvety silky béchamel sauce, and bubbling melted Parmigiano.",
  "00181": "Thick slices of charcoal-grilled pork belly fanned out like flower petals over steamed rice, glazed in a sweet and smoky caramelized tare sauce.",
  "00182": "Creamy, frothy chicken broth whipped to an airy silky foam, served with springy noodles and moist sous-vide chicken breast chashu.",
  "00183": "Rich Hokkaido miso ramen broth whisked with decadent monkfish liver paste, unleashing an explosive wave of oceanic umami flavor.",
  "00219": "Crisp toasted dark whole grain rye bread slathered with pure 100% peanut butter, fresh banana slices, and a sprinkle of chia seeds.",
  "00221": "A comforting classic breakfast porridge simmered with lean minced beef and earthy shiitake mushrooms, soothing the stomach and soul.",
  "00222": "The royal morning remedy of the Joseon Dynasty: deep nutty roasted black sesame paste blended with creamy milk and slow-simmered rice.",
  "00223": "Soft whole wheat dinner rolls packed with creamy mashed egg mayo salad, subtly balanced with zesty whole grain Dijon mustard.",
  "00228": "Poached eggs nestled in a bubbling skillet of spiced crushed tomatoes, garlic, onions, and cumin, garnished with tangy feta cheese and fresh parsley.",
  "00235": "A miracle morning health elixir freshly pressed from antioxidant-rich red beets, crisp sweet apples, and beta-carotene packed carrots.",
  "00265": "The undisputed king of Korean convenience store hot-bar snacks: a plump, juicy frankfurter bursting with savory wood-smoked barbecue aroma.",
  "00266": "Over 90% premium pork content! A snappy, succulent smoked sausage infused with aromatic Uiseong garlic that pops crisply with every bite.",
  "00269": "The quintessential Japanese-style convenience store breakfast: pillowy crustless white milk bread generously filled with rich creamy egg salad.",
  "00270": "A microwave-ready convenience store legend: double beef patties glazed in sweet bulgogi sauce, melted American cheese, and pickles on a sesame bun.",
  "00272": "The addictive izakaya-style sweet corn and melted mozzarella cheese gratin, now enjoyed hot in two minutes straight from the convenience store.",
  "00273": "A pouch of sweet hazelnut drip coffee poured over a plastic cup packed with ice, Korean convenience store's most iconic summer pick-me-up.",
  "00275": "The beloved sweet banana milk in an iconic retro yellow jug, sipped through a tiny green straw: a national treasure for over 50 years.",
  "00277": "Bangkok's favorite street stir-fried noodles: rice noodles tossed in sweet-sour tamarind sauce with jumbo prawns, eggs, dried shrimp, crunchy bean sprouts, and crushed peanuts.",
  "00286": "Warm, flaky puff pastry cups filled with a wobbly, fragrant golden egg custard that melts on the tongue, an afternoon tea staple in Hong Kong.",
  "00317": "Shredded beef brisket and tender sweet scallions simmered in fiery chili oil broth, wrapped around bouncy handmade knife-cut noodles.",
  "00318": "Freshly stone-ground mung beans pan-fried in sizzling oil on a heavy cast-iron griddle, achieving a crackling exterior and soft, savory interior.",
  "00320": "Euljiro tavern style: plump sea snails tossed with shredded scallions, dried pollock strips, and thin somyeon noodles in sweet-spicy vinegar dressing.",
  "00321": "Fresh live abalone scored in diamond patterns and seared at high heat with rich French butter and whole garlic cloves, tender and succulent.",
  "00322": "A comforting bowl of warm thin noodles bathed in clear, deep anchovy broth, garnished with golden egg ribbons, seaweed, and seasoned soy chili sauce.",
  "00323": "Busan Jagalchi market specialty: delightfully chewy sea hagfish stir-fried over charcoal in a fiery, sweet, and garlicky pepper glaze.",
  "00324": "Fresh live octopus vigorously chopped on a wooden board, squirming on the plate and tossed in toasted sesame oil and cracked sea salt.",
  "00337": "Authentic Cheonan Byeongcheon style: tender pork casings hand-stuffed with fresh vegetables, pork blood, and cabbage without unpleasant odor, deeply savory and soft.",
  "00367": "Crustless Basque-style cheesecake baked at scorching heat until the top is deeply caramelized, revealing an oozing, velvety molten center.",
  "00375": "Fresh clams steamed in garlic butter, white wine, and Italian chili flakes, releasing a savory tide of pure oceanic umami nectar.",
  "00384": "Chiang Mai specialty: tender whole chicken drumstick submerged in rich coconut milk yellow curry soup, topped with crunchy crispy egg noodles and fresh lime.",
  "00389": "Piping-hot thick-cut French fries smothered in bubbling rich brown gravy and fresh squeaky cheese curds that melt into gooey strands."
};

// 2. Process English (en.json)
console.log('--- Fixing en.json ---');
const enPath = path.join(ROOT_DIR, 'data', 'i18n', 'foods', 'en.json');
const currentEn = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fixedEn = {};

for (const item of rawFoods) {
  const code = item.code;
  const officialEnName = item.englishName || currentEn[code]?.name || item.name;
  let tagline = EN_TAGLINE_FIXES[code];

  if (!tagline) {
    tagline = currentEn[code]?.tagline || item.tagline;
  }

  fixedEn[code] = {
    name: officialEnName,
    tagline: tagline
  };
}

fs.writeFileSync(enPath, JSON.stringify(fixedEn, null, 2), 'utf8');
console.log(`✔ Fixed all ${Object.keys(fixedEn).length} English foods (100% aligned with official English names)`);

// 3. Process Vietnamese (vi.json)
console.log('--- Fixing vi.json ---');
const viPath = path.join(ROOT_DIR, 'data', 'i18n', 'foods', 'vi.json');
const currentVi = JSON.parse(fs.readFileSync(viPath, 'utf8'));

const VI_FIXES = {
  "00373": {
    name: "Da heo nướng than hoa khía tổ ong giòn béo chấm bột đậu nành",
    tagline: "Da heo được khía hình tổ ong nướng trên than hồng chảy bớt mỡ, giòn rụm bên ngoài dai mềm bên trong chấm bột đậu nành thơm bùi."
  },
  "00374": {
    name: "Sụn heo cay xào sốt Gochujang rực lửa ăn kèm cơm nắm trứng cá chuồn",
    tagline: "Sụn heo giòn sần sật xào cùng sốt ớt Gochujang cay nồng đượm khói, ăn kèm cơm nắm rong biển trứng cá chuồn bùi béo."
  },
  "00375": {
    name: "Ngao hoa hấp rượu vang trắng bơ tỏi và ớt khô cay thơm lừng (Bajirak Suljjim)",
    tagline: "Ngao tươi mở miệng tiết ra nước cốt ngọt lịm từ biển cả, hòa quyện cùng bơ béo ngậy, tỏi phi thơm và hương rượu vang trắng tinh tế."
  },
  "00376": {
    name: "Bạch tuộc đại dương luộc thái lát mỏng chấm dầu mè muối và tương ớt chua cay",
    tagline: "Bạch tuộc tươi sống bờ biển phía Đông luộc vừa chín tới thái lát mỏng tang, dai giòn sần sật chấm dầu mè muối hạt thơm lừng."
  },
  "00377": {
    name: "Thịt bò nướng xiên Churrasco Picanha Brazil nướng than hoa mọng nước",
    tagline: "Thịt thăn bò Picanha xỏ xiên kiếm dài truyền thống nướng trên than hoa đỏ rực, lớp mỡ cháy xém thơm lừng bên trong mọng nước ngọt ngào."
  },
  "00378": {
    name: "Sườn bò nướng Asado kiểu Argentina trên lửa củi 4 tiếng sốt Chimichurri",
    tagline: "Sườn bò tảng lớn nướng chậm 4 tiếng trên than củi Pampas cho thịt mềm róc xương, rưới sốt thảo mộc Chimichurri thanh mát chống ngấy."
  },
  "00379": {
    name: "Phô mai Raclette Thụy Sĩ nướng chảy cạo phủ khoai tây luộc và xúc xích",
    tagline: "Tảng phô mai bánh xe dãy Alps hơ nóng chảy xèo xèo rồi cạo lớp phô mai béo ngậy phủ ngập lên khoai tây nghiền và xúc xích nóng hổi."
  },
  "00380": {
    name: "Lẩu lòng bò Motsunabe Hakata Nhật Bản ngập tràn hẹ xanh và tỏi thơm béo",
    tagline: "Nước dùng tương thanh ngọt đun cùng lòng bò béo ngậy ngọt tan, xếp một ngọn núi hẹ xanh mướt và ớt đỏ kích thích vị giác."
  },
  "00381": {
    name: "Lẩu hai ngăn Tứ Xuyên Thành Đô: Cay tê nồng Mala và thanh ngọt nước hầm xương",
    tagline: "Một bên cay tê đầu lưỡi với ớt đỏ và hoa tiêu Tứ Xuyên, một bên ngọt dịu thanh tao từ nước hầm xương ống hầm kỳ công."
  },
  "00382": {
    name: "Thịt ức bò hun khói Texas Austin 16 tiếng gỗ sồi mềm tan mọng nước (Brisket)",
    tagline: "Tảng ức bò được ướp muối tiêu hun khói liên tục 16 tiếng bằng gỗ sồi, tạo lớp vỏ đen bóng giòn tan và thớ thịt mềm ngọt như bơ."
  },
  "00383": {
    name: "Bò bít tết T-Bone Bistecca alla Fiorentina 1kg nướng than củi tái hồng",
    tagline: "Miếng sườn bò Chianina dày 5cm nướng trực tiếp trên than củi cháy rực, lớp ngoài xém thơm bên trong đỏ hồng mọng nước."
  },
  "00384": {
    name: "Mì cà ri cốt dừa Khao Soi Chiang Mai Thái Lan đùi gà mềm và mì trứng chiên giòn",
    tagline: "Đùi gà mềm nhừ ngập trong nước dùng cà ri vàng béo ngậy nước cốt dừa, ăn kèm sợi mì trứng mềm và mì chiên giòn rụm bên trên."
  },
  "00385": {
    name: "Bún bò Huế hoàng gia cay nồng sả thơm nước dùng xương đậm đà",
    tagline: "Hương thơm nồng nàn của sả tươi, mắm ruốc Huế hòa quyện cùng bắp bò hoa và chả cua trong tô bún bò trứ danh cố đô."
  },
  "00386": {
    name: "Gỏi hải sản Ceviche Peru: Cá trắng tươi và tôm tái nước cốt chanh hành tím",
    tagline: "Cá tuyết trắng và tôm tươi được làm chín tự nhiên bằng axit trong nước cốt chanh tươi, trộn cùng hành tím giòn và rau mùi thơm mát."
  },
  "00387": {
    name: "Cơm thịt bò băm Loco Moco Hawaii sốt Gravy đậm đà và trứng ốp-la lòng đào",
    tagline: "Miếng thịt bò băm nướng dày dặn đặt trên bát cơm nóng hổi, rưới đẫm sốt Gravy nâu đậm đà và quả trứng ốp-la lòng đào béo ngậy."
  },
  "00388": {
    name: "Thịt viên Thụy Điển Köttbullar sốt kem nâu béo ngậy kèm mứt quả Lingonberry",
    tagline: "Những viên thịt bò băm mềm mượt đẫm trong sốt kem bơ sánh mịn, ăn kèm khoai tây nghiền và mứt quả dại chua ngọt đặc trưng Stockholm."
  },
  "00389": {
    name: "Khoai tây chiên Poutine Quebec Canada ngập phô mai viên và sốt Gravy nóng hổi",
    tagline: "Khoai tây chiên giòn nóng hổi ngập trong phô mai viên dẻo dai kêu sần sật và lớp sốt thịt nâu óng ánh đậm đà."
  }
};

for (const [code, fix] of Object.entries(VI_FIXES)) {
  currentVi[code] = fix;
}

fs.writeFileSync(viPath, JSON.stringify(currentVi, null, 2), 'utf8');
console.log(`✔ Fixed all ${Object.keys(VI_FIXES).length} Vietnamese shifted food items (00373 ~ 00389)`);

// 4. Copy to web/i18n/foods and dist/i18n/foods
for (const lang of ['en', 'vi']) {
  const srcFile = path.join(ROOT_DIR, 'data', 'i18n', 'foods', `${lang}.json`);
  const webFile = path.join(ROOT_DIR, 'web', 'i18n', 'foods', `${lang}.json`);
  const distFile = path.join(ROOT_DIR, 'dist', 'i18n', `${lang}.json`);
  fs.copyFileSync(srcFile, webFile);
  if (fs.existsSync(path.dirname(distFile))) {
    fs.copyFileSync(srcFile, distFile);
  }
}

console.log('✔ Copied fixed translation bundles to web/ and dist/');
