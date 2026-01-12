import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Authentic recipes from goeduitje.nl - Middle Eastern cuisine from cooking workshops
 * Images sourced from original Wix site
 */
const authenticRecipes = [
  // VOORGERECHTEN
  {
    title: "Champignonsoep",
    slug: "champignonsoep",
    description:
      "Romige champignonsoep met verse champignons, aardappel en wortel. Een hartverwarmend voorgerecht.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_94e4df44d5674048bdc2091473abd598~mv2.jpg/v1/crop/x_0,y_0,w_1384,h_1386/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fee05a_94e4df44d5674048bdc2091473abd598~mv2.jpg",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Makkelijk",
    category: "Voorgerecht",
    ingredients: [
      "500 gram champignons",
      "1 grote ui",
      "2 teentjes knoflook",
      "1 aardappel",
      "1 wortel",
      "750 ml groentebouillon",
      "100 ml slagroom",
      "50 gram boter",
      "Verse peterselie",
      "Zout en peper naar smaak",
    ],
    steps: [
      "Snijd de ui en knoflook fijn en fruit ze in de boter tot ze glazig zijn.",
      "Voeg de aardappel, wortel en champignons toe en bak tien minuten.",
      "Giet de groentebouillon erbij en laat 20 minuten zachtjes koken.",
      "Pureer de soep glad met een staafmixer.",
      "Voeg de slagroom toe en verwarm door.",
      "Breng op smaak met zout en peper.",
      "Garneer met verse peterselie en serveer warm.",
    ],
    tips: "Geniet van je champignonsoep! Serveer met knapperig brood voor een complete maaltijd.",
    isPublished: true,
  },

  // HOOFDGERECHTEN
  {
    title: "Dolmah",
    slug: "dolmah",
    description:
      "Gevulde wijnbladeren met een hartige rijstvulling. Een klassiek Midden-Oosters gerecht vol smaak.",
    imageUrl:
      "https://static.wixstatic.com/media/a8f7ac_5acf359598c244a694b4ddb9c4a302b8~mv2.png/v1/crop/x_320,y_0,w_1098,h_1098/fill/w_666,h_666,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/ui-groep%20(3).png",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: "Gemiddeld",
    category: "Hoofdgerecht",
    ingredients: [
      "200 gram wijnbladeren (uit pot)",
      "200 gram langkorrelige rijst",
      "200 gram gehakt",
      "200 gram champignons",
      "1 ui, fijngehakt",
      "2 teentjes knoflook",
      "1 theelepel komijnpoeder",
      "Zout en zwarte peper",
      "Olijfolie",
      "Sap van 1 citroen",
    ],
    steps: [
      "Spoel de wijnbladeren af met koud water en laat uitlekken.",
      "Was de rijst en week deze 15 minuten in koud water.",
      "Snijd de champignons en de knoflook, voeg ze toe aan het gehakt en bak dit mengsel totdat het gehakt gaar is.",
      "Voeg een beetje zout, een snufje komijnpoeder en een snufje zwarte peper toe.",
      "Meng de uitgelekte rijst met het gekruide gehakt.",
      "Leg een wijnblad plat en plaats een lepel vulling in het midden.",
      "Vouw de zijkanten naar binnen en rol op tot een klein pakketje.",
      "Leg de rolletjes dicht naast elkaar in een pan met een scheutje olijfolie.",
      "Voeg water toe tot net boven de rolletjes en het citroensap.",
      "Kook op laag vuur 45 minuten tot de rijst gaar is.",
    ],
    tips: "Geniet van je Dolmah! Serveer met yoghurt en verse munt.",
    isPublished: true,
  },
  {
    title: "Maqluba",
    slug: "maqluba",
    description:
      "Omgekeerde rijstschotel met kip, aubergine en specerijen. Een feestelijk Palestijns gerecht.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_2b7a55da174142eebd39cf97e5463980~mv2.jpg/v1/crop/x_0,y_1000,w_3000,h_3000/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Maqluba.jpg",
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    difficulty: "Gemiddeld",
    category: "Hoofdgerecht",
    ingredients: [
      "500 gram kipfilet of -dijen",
      "400 gram basmatirijst",
      "2 aubergines",
      "2 tomaten",
      "1 ui",
      "3 teentjes knoflook",
      "1 theelepel kurkuma",
      "1 theelepel komijn",
      "1 theelepel kaneel",
      "1 theelepel baharat (7-kruidenmix)",
      "Zout en peper",
      "Olijfolie",
      "Geroosterde amandelen en pijnboompitten",
    ],
    steps: [
      "Snijd de aubergines in plakken en bak ze goudbruin in olijfolie.",
      "Bak de kip met ui en knoflook tot goudbruin.",
      "Voeg de specerijen toe en bak 2 minuten mee.",
      "Was de rijst en laat uitlekken.",
      "Leg in een grote pan laagjes: kip, aubergine, tomaat, en rijst.",
      "Voeg kippenbouillon toe (dubbele hoeveelheid van rijst).",
      "Kook op laag vuur met deksel tot de rijst gaar is (circa 25 minuten).",
      "Laat 10 minuten rusten, plaats een bord op de pan en keer om.",
      "Garneer met geroosterde noten.",
    ],
    tips: "Geniet van je Maqluba! Dit gerecht draait letterlijk om het 'omkeren' - zorg voor een mooie presentatie!",
    isPublished: true,
  },
  {
    title: "Kabsa",
    slug: "kabsa",
    description:
      "Saudische rijstschotel met kip en aromatische specerijen. Een koninklijk gerecht uit het Midden-Oosten.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_1721f97f2cb440d4a1aac1c7c7bea975~mv2.png/v1/crop/x_326,y_0,w_849,h_849/fill/w_666,h_666,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Kabsa_edited.png",
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: "Gemiddeld",
    category: "Hoofdgerecht",
    ingredients: [
      "1 hele kip, in stukken",
      "400 gram basmatirijst",
      "2 tomaten, geraspt",
      "1 chilipeper",
      "2 eetlepels tomatenpuree",
      "1 laurierblad",
      "1 kaneelstokje",
      "4 kardemompeulen",
      "4 kruidnagels",
      "1 theelepel kurkuma",
      "1 theelepel Kabsa-kruiden",
      "Geroosterde amandelen en rozijnen",
      "Olijfolie",
      "Zout naar smaak",
    ],
    steps: [
      "Bak de kipstukken goudbruin in olijfolie en haal uit de pan.",
      "Fruit de ui tot glazig in dezelfde pan.",
      "Voeg de tomaten, chilipeper, tomatenpuree en de kruiden (laurierblad, kaneelstokje, kardemom, kruidnagels, kurkuma, Kabsa-kruiden) toe en roer het mengsel gedurende 5 minuten door.",
      "Voeg de kip terug en giet er water bij tot de kip onderstaat.",
      "Kook de kip gaar (circa 30 minuten).",
      "Haal de kip eruit en voeg de gewassen rijst toe aan de bouillon.",
      "Kook tot de rijst gaar is en het vocht is opgenomen.",
      "Leg de kip op de rijst en laat 10 minuten rusten.",
      "Serveer de Kabsa warm, eventueel gegarneerd met geroosterde amandelen en rozijnen.",
    ],
    tips: "Geniet van je Kabsa! De speciale Kabsa-kruiden zijn verkrijgbaar bij Midden-Oosterse supermarkten.",
    isPublished: true,
  },
  {
    title: "Ouzzi",
    slug: "ouzzi",
    description:
      "Feestelijke Libanese rijstschotel met kip, noten en specerijen. Perfect voor speciale gelegenheden.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_07285b367baf4264942ce9bdd6a79eb0~mv2.jpg/v1/crop/x_46,y_0,w_949,h_949/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Ouzzi.jpg",
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: "Gemiddeld",
    category: "Hoofdgerecht",
    ingredients: [
      "500 gram lamsvlees of kip",
      "400 gram langkorrelige rijst",
      "100 gram gehakt",
      "100 gram pijnboompitten",
      "100 gram amandelen",
      "1 ui, fijngehakt",
      "1 theelepel kaneel",
      "1 theelepel piment (allspice)",
      "1/2 theelepel nootmuskaat",
      "Zout en peper",
      "Boter en olijfolie",
    ],
    steps: [
      "Kook het vlees gaar met specerijen en een ui.",
      "Bak het gehakt met pijnboompitten en amandelen in boter.",
      "Kook de rijst in de vleesbouillon.",
      "Meng een deel van het notenmengsel door de rijst.",
      "Serveer de rijst met het vlees erop.",
      "Garneer royaal met de rest van de gebakken noten.",
    ],
    tips: "Geniet van je Ouzzi! Dit gerecht wordt traditioneel bij bruiloften en feesten geserveerd.",
    isPublished: true,
  },
  {
    title: "Beryani (optie vegetarisch)",
    slug: "beryani",
    description:
      "Aromatische Indiase rijstschotel met laagjes vlees of groenten en specerijen. Een ware smaaksensatie.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_cbea6096ce164a9690f3d5e94bd29647~mv2.jpg/v1/crop/x_628,y_1504,w_1688,h_1686/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Beryani.jpg",
    prepTime: 30,
    cookTime: 60,
    servings: 4,
    difficulty: "Moeilijk",
    category: "Hoofdgerecht",
    ingredients: [
      "500 gram kip, lam of bloemkool (vegetarisch)",
      "400 gram basmatirijst",
      "1 grote ui, in ringen",
      "200 ml yoghurt",
      "2 tomaten",
      "1 theelepel garam masala",
      "1 theelepel kurkuma",
      "1 theelepel komijn",
      "Saffraan, geweekt in warme melk",
      "Verse munt en koriander",
      "Ghee of boter",
      "Zout naar smaak",
    ],
    steps: [
      "Marineer het vlees of de groenten in yoghurt met specerijen (minimaal 1 uur).",
      "Bak de uien goudbruin (barista ui) en zet apart.",
      "Bak het gemarineerde vlees of groenten half gaar.",
      "Kook de rijst half gaar in gezouten water.",
      "Leg in een pan laagjes: vlees/groenten, rijst, gebakken ui, kruiden.",
      "Sprenkle de saffraanmelk erover.",
      "Sluit de pan af met aluminiumfolie en deksel.",
      "Stoom op zeer laag vuur 30-40 minuten (dum koken).",
      "Meng voorzichtig en serveer met verse kruiden.",
    ],
    tips: "Geniet van je Beryani! De vegetarische versie met bloemkool en aardappel is even heerlijk.",
    isPublished: true,
  },

  // BIJGERECHTEN
  {
    title: "Feta",
    slug: "feta",
    description:
      "Gebakken feta met honing en kruiden. Een heerlijk warm bijgerecht of voorgerecht.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_e58525d40fe24b3ba094470070323ba7~mv2.jpg/v1/crop/x_0,y_200,w_1200,h_1200/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Feta%201.jpg",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Makkelijk",
    category: "Bijgerecht",
    ingredients: [
      "200 gram feta kaas",
      "2 eetlepels honing",
      "1 theelepel gedroogde oregano",
      "Verse tijm",
      "Olijfolie",
      "Versgemalen peper",
      "Sesamzaadjes",
      "Pitabrood om te serveren",
    ],
    steps: [
      "Verwarm de oven voor op 180°C.",
      "Leg de feta in een ovenschaaltje.",
      "Besprenkel met olijfolie en honing.",
      "Bestrooi met oregano, tijm en peper.",
      "Bak 15-20 minuten tot de feta zacht wordt.",
      "Garneer met sesamzaadjes.",
      "Serveer warm met pitabrood.",
    ],
    tips: "Geniet van je Feta! Perfect als onderdeel van een mezze tafel.",
    isPublished: true,
  },
  {
    title: "Tabbouleh",
    slug: "tabbouleh",
    description:
      "Frisse Libanese peterseliesalade met bulgur, tomaat en munt. Een verfrissend bijgerecht.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_95fd32d4e4fd46b283c371222ac179c3~mv2.jpg/v1/crop/x_1000,y_0,w_4000,h_4000/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Tabbouleh.jpg",
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    difficulty: "Makkelijk",
    category: "Bijgerecht",
    ingredients: [
      "4 bosjes verse peterselie",
      "1 bosje verse munt",
      "50 gram fijne bulgur",
      "4 tomaten, in kleine blokjes",
      "1 komkommer, in kleine blokjes",
      "4 lente-uitjes, fijngesneden",
      "Sap van 2 citroenen",
      "4 eetlepels extra vierge olijfolie",
      "Zout en peper naar smaak",
    ],
    steps: [
      "Week de bulgur 10 minuten in warm water en laat goed uitlekken.",
      "Hak de peterselie zeer fijn - dit is de basis van de salade.",
      "Hak de munt fijn.",
      "Meng bulgur met de kruiden in een grote kom.",
      "Voeg tomaat, komkommer en lente-ui toe.",
      "Maak een dressing van citroensap en olijfolie.",
      "Giet de dressing over de salade en meng goed.",
      "Breng op smaak met zout en peper.",
    ],
    tips: "Geniet van je Tabbouleh! De peterselie moet de hoofdrol spelen - gebruik minstens 4 bosjes!",
    isPublished: true,
  },
  {
    title: "Fatoush",
    slug: "fatoush",
    description:
      "Libanese broodsalade met knapperig pitabrood en sumak dressing. Heerlijk fris en crunchy.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_e5b71d88763b4802ad8bbc4d2b9cb069~mv2.jpg/v1/crop/x_761,y_2041,w_1959,h_1959/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Fatoush.jpg",
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    difficulty: "Makkelijk",
    category: "Bijgerecht",
    ingredients: [
      "2 pitabroden",
      "1 krop sla",
      "3 tomaten",
      "1 komkommer",
      "1 groene paprika",
      "5 radijsjes",
      "1 bosje verse munt",
      "1 bosje verse peterselie",
      "2 theelepels sumak",
      "4 eetlepels olijfolie",
      "Sap van 1 citroen",
      "1 teentje knoflook, geperst",
      "Zout naar smaak",
    ],
    steps: [
      "Snijd of scheur de pita in stukjes en bak krokant in olijfolie.",
      "Snijd alle groenten in hapklare stukken.",
      "Hak de kruiden fijn.",
      "Maak de dressing: meng olijfolie, citroensap, knoflook en sumak.",
      "Meng alle groenten en kruiden in een grote kom.",
      "Voeg vlak voor serveren de krokante pita toe.",
      "Besprenkel met de sumak dressing.",
    ],
    tips: "Geniet van je Fatoush! Voeg het brood pas op het laatste moment toe voor maximale crunch.",
    isPublished: true,
  },
  {
    title: "Kibbeh (koud)",
    slug: "kibbeh-koud",
    description:
      "Koude Libanese gehaktballetjes van bulgur en lamsvlees. Een traditioneel voorgerecht.",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_eff3d2f6d3994718a7e3159ebf07957b~mv2.jpg/v1/crop/x_698,y_1699,w_2302,h_2301/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Kibbeh%20(koud).jpg",
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    difficulty: "Makkelijk",
    category: "Bijgerecht",
    ingredients: [
      "250 gram fijne bulgur",
      "300 gram mager lamsgehakt",
      "1 ui, fijngehakt",
      "1 theelepel komijnpoeder",
      "1/2 theelepel piment (allspice)",
      "1/2 theelepel kaneel",
      "Verse munt",
      "Olijfolie",
      "Zout en peper",
    ],
    steps: [
      "Week de bulgur 30 minuten in koud water.",
      "Knijp de bulgur goed uit.",
      "Meng de bulgur met het rauwe gehakt, ui en specerijen.",
      "Kneed het mengsel goed tot een gladde massa (traditioneel in een vijzel).",
      "Breng op smaak met zout en peper.",
      "Vorm tot kleine ovale balletjes met een kuiltje.",
      "Serveer koud met een scheutje olijfolie en verse munt.",
    ],
    tips: "Geniet van je Kibbeh! Kibbeh nayeh (rauw) is een delicatesse - gebruik alleen vers gehakt van hoge kwaliteit.",
    isPublished: true,
  },

  // DESSERTS
  {
    title: "Kunafe",
    slug: "kunafe",
    description:
      "Warm Arabisch dessert van kataifi deeg met zoete kaas en suikersiroop. Hemels!",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_219751ef88f442ab8690f721f132b7c8~mv2.jpg/v1/crop/x_0,y_76,w_961,h_961/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Kunafe%201_edited.jpg",
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    difficulty: "Gemiddeld",
    category: "Dessert",
    ingredients: [
      "500 gram kataifi deeg (engelenhaar)",
      "300 gram mozzarella of akkawi kaas",
      "200 gram boter, gesmolten",
      "Voor de siroop:",
      "400 gram suiker",
      "250 ml water",
      "1 eetlepel citroensap",
      "1 eetlepel rozenwater",
      "Gehakte pistachenoten voor garnering",
    ],
    steps: [
      "Maak de siroop: kook suiker en water 10 minuten, voeg citroensap en rozenwater toe. Laat afkoelen.",
      "Raffel het kataifi deeg uit elkaar in een kom.",
      "Meng het deeg met de gesmolten boter.",
      "Druk de helft van het deeg in een ovenschaal.",
      "Verdeel de geraspte kaas erover.",
      "Bedek met de rest van het deeg en druk aan.",
      "Bak op 180°C tot goudbruin (circa 25-30 minuten).",
      "Keer om op een bord en giet de koude siroop erover.",
      "Garneer met pistachenoten.",
    ],
    tips: "Geniet van je Kunafe! Serveer direct - de kaas moet nog warm en rekbaar zijn!",
    isPublished: true,
  },
  {
    title: "Basboussa",
    slug: "basboussa",
    description:
      "Zoete Egyptische griesmeel cake met suikersiroop. Smelt op je tong!",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_51e20fb892994126a1788796a532ce76~mv2.jpg/v1/crop/x_84,y_131,w_1116,h_1117/fill/w_666,h_666,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Basbousa.jpg",
    prepTime: 15,
    cookTime: 20,
    servings: 8,
    difficulty: "Makkelijk",
    category: "Dessert",
    ingredients: [
      "250 gram griesmeel",
      "100 gram suiker",
      "100 gram kokosnoot (geraspt)",
      "200 gram yoghurt",
      "100 gram boter, gesmolten",
      "1 theelepel bakpoeder",
      "Amandelen voor decoratie",
      "Voor de siroop:",
      "300 gram suiker",
      "200 ml water",
      "1 eetlepel citroensap",
      "1 eetlepel rozenwater",
    ],
    steps: [
      "Maak eerst de siroop: kook suiker met water en citroensap 10 minuten. Voeg rozenwater toe en laat AFKOELEN.",
      "Meng griesmeel, suiker, kokos en bakpoeder.",
      "Voeg yoghurt en gesmolten boter toe en meng tot een glad beslag.",
      "Giet in een ingevoette ovenschaal en strijk glad.",
      "Snijd ruitpatroon in het beslag en plaats een amandel in elk stuk.",
      "Bak op 180°C tot goudbruin (circa 25-30 minuten).",
      "Haal de basboussa uit de oven en giet direct het koude suikerwater beetje voor beetje over. Stop als het suikerwater langzamer wordt opgenomen.",
      "Laat de basboussa afkoelen en snijd in stukjes.",
    ],
    tips: "Geniet van je Basboussa! Het geheim is koude siroop op warme cake - zo blijft hij sappig!",
    isPublished: true,
  },
  {
    title: "Awama",
    slug: "awama",
    description:
      "Luchtige Arabische donuts gedrenkt in honing of suikersiroop. Onweerstaanbaar lekker!",
    imageUrl:
      "https://static.wixstatic.com/media/fee05a_a26ee3b10ff24d5db9879187ea416b60~mv2.png/v1/crop/x_0,y_7,w_311,h_311/fill/w_435,h_435,al_c,lg_1,q_85,enc_avif,quality_auto/Awama.png",
    prepTime: 90,
    cookTime: 15,
    servings: 8,
    difficulty: "Gemiddeld",
    category: "Dessert",
    ingredients: [
      "300 gram bloem",
      "1 zakje instant gist (7 gram)",
      "1 eetlepel suiker",
      "1 theelepel zout",
      "300 ml lauw water",
      "Olie om te frituren",
      "Voor de siroop:",
      "400 gram suiker of honing",
      "250 ml water",
      "1 eetlepel citroensap",
      "1 theelepel rozenwater (optioneel)",
    ],
    steps: [
      "Maak de siroop: kook suiker met water en citroensap 10 minuten tot stroperig. Voeg rozenwater toe en laat afkoelen.",
      "Meng bloem, gist, suiker en zout in een kom.",
      "Voeg geleidelijk lauw water toe en meng tot een glad beslag.",
      "Dek af en laat 60-90 minuten rijzen tot het beslag verdubbeld is.",
      "Verhit de olie tot 180°C.",
      "Schep met een natte lepel kleine balletjes beslag in de olie.",
      "Bak tot goudbruin en draai regelmatig om.",
      "Schep uit de olie en laat even uitlekken.",
      "Dompel direct in de koude siroop.",
      "Serveer warm, bestrooid met sesamzaadjes of gehakte pistaches.",
    ],
    tips: "Geniet van je Awama! Deze bolletjes zijn op hun best als ze nog warm zijn en vers uit de siroop komen.",
    isPublished: true,
  },
];

async function main() {
  console.log("🍳 Seeding database with authentic Goeduitje recipes...\n");

  // Delete existing recipes
  const deletedRecipes = await prisma.recipe.deleteMany({});
  console.log(`  Deleted ${deletedRecipes.count} existing recipes`);

  // Create new recipes
  let createdCount = 0;
  for (const recipe of authenticRecipes) {
    await prisma.recipe.create({
      data: recipe,
    });
    console.log(`  ✓ Created recipe: ${recipe.title} (${recipe.category})`);
    createdCount++;
  }

  console.log(`\n✅ Seeded ${createdCount} authentic recipes successfully!`);
  console.log("\nRecipes by category:");

  const categories = [...new Set(authenticRecipes.map((r) => r.category))];
  for (const cat of categories) {
    const count = authenticRecipes.filter((r) => r.category === cat).length;
    console.log(`  - ${cat}: ${count} recipes`);
  }
}

main()
  .catch((e) => {
    console.error("Error seeding recipes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
