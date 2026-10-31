"""
KRITI AI – Comprehensive Agricultural & Policy Knowledge Base
Grounding knowledge covering crop cycles, stubble management, vermicomposting,
biomass energy, plastic recycling, government schemes, FPOs, industrial buyers, and platform mechanics.
"""

KNOWLEDGE_BASE = [
    # 1. WHAT IS STUBBLE BURNING? (Exact dedicated match)
    {
        "id": "stubble_burning_definition",
        "category": "crop_residue",
        "keywords": [
            "what is stubble burning", "stubble burning", "parali burning", "why do farmers burn stubble",
            "crop residue burning", "stubble fire", "parali kya hai", "stubble burning kya hai",
            "पराली जलाना", "पराली दहन", "पराली क्या है", "पराली क्यों जलाते हैं", "पराली का धुआं"
        ],
        "title_en": "What is Stubble Burning? Causes, Impacts & Modern Alternatives",
        "title_hi": "पराली जलाना (Stubble Burning) क्या है? कारण, दुष्परिणाम एवं समाधान",
        "content_en": """**What is Stubble Burning?**
Stubble burning (commonly known in India as *Parali burning*) is the intentional agricultural practice of setting fire to straw and root residues left standing in the field after harvesting grains like paddy (rice) and wheat with combined harvesters.

**1. Why Farmers Resort to Stubble Burning:**
- **Narrow Sowing Window:** Farmers in northern India (Punjab, Haryana, western UP) have only a 15–20 day window between the Kharif paddy harvest in late October and the Rabi wheat sowing in November.
- **Tractor Combine Leftovers:** Modern combine harvesters leave behind 10–14 inch straw stalks anchored in the soil, which clog traditional seed drill machines.
- **Perceived Low Cost:** Burning is fast, effortless, and clears the field in a few hours without upfront labor costs.

**2. Severe Environmental & Soil Consequences:**
- **Severe Air Pollution:** A single tonne of burnt straw emits ~1,460 kg of CO2, 60 kg of CO, 3 kg of particulate matter (PM2.5/PM10), and toxic polycyclic aromatic hydrocarbons (PAHs), blanketing the Indo-Gangetic plain in hazardous smog every winter.
- **Massive Soil Nutrient Destruction:** Burning 1 tonne of paddy straw incinerates approximately 5.5 kg nitrogen, 2.3 kg phosphorus, 25 kg potassium, and 1.2 kg sulfur, while destroying beneficial soil microbial flora and earthworms.
- **Legal Fines:** Stubble burning is strictly prohibited under Section 188 of the IPC and the Air (Prevention & Control of Pollution) Act. The National Green Tribunal (NGT) enforces environmental compensation fines: ₹2,500 (<2 acres), ₹5,000 (2–5 acres), and up to ₹15,000 (>5 acres).

**3. Modern Sustainable Alternatives:**
- **In-Situ (In Field):** Using Happy Seeder or Super Seeder machines that sow wheat directly through standing residue, or spraying PUSA Bio-Decomposer to digest stubble into humus.
- **Ex-Situ (Off Field):** Baling straw with mechanized balers and selling to biomass power plants, CBG plants, or through Kisan Connect for ₹220 – ₹280/quintal.""",
        "content_hi": """**पराली जलाना (Stubble Burning) क्या है?**
पराली जलाना कंबाइन हार्वेस्टर से धान या गेहूं की कटाई के बाद खेत में बचे हुए 10-14 इंच के डंठलों और अवशेषों में आग लगाने की प्रक्रिया है।

**1. किसान पराली क्यों जलाते हैं?**
- **कम समय का अंतर:** धान की कटाई (अक्टूबर) और गेहूं की बुवाई (नवंबर) के बीच केवल 15-20 दिनों का समय मिलता है।
- **खेत साफ करने की जल्दबाजी:** कंबाइन से कटाई के बाद बचे डंठल साधारण बुवाई मशीनों में फंसते हैं, जिन्हें आग लगाकर तुरंत जलाना सबसे आसान व सस्ता तरीका समझा जाता है।

**2. इसके घातक परिणाम:**
- **गंभीर वायु प्रदूषण:** 1 टन पराली जलाने से लगभग 1,460 किलो CO2, 60 किलो जहरीली CO गैस और भारी मात्रा में PM2.5/PM10 धुआं निकलता है जो फेफड़ों को नुकसान पहुंचाता है।
- **जमीन की उर्वरता नष्ट होना:** 1 टन पराली जलने से मिट्टी के 5.5 किग्रा नाइट्रोजन, 2.3 किग्रा फास्फोरस, 25 किग्रा पोटाश और सूक्ष्म मित्र कीट (केंचुए) जलकर नष्ट हो जाते हैं।
- **कानूनी जुर्माना (NGT):** 2 एकड़ तक ₹2,500, 2 से 5 एकड़ तक ₹5,000 और 5 एकड़ से अधिक पर ₹15,000 तक का जुर्माना लगाया जा सकता है।

**3. इसके आधुनिक समाधान:**
- **खेत में ही समाधान (In-situ):** सुपर सीडर / हैप्पी सीडर से सीधे गेहूं बोएं, या पूसा बायो-डीकंपोज़र का छिड़काव करें।
- **खेत से बाहर समाधान (Ex-situ):** बेलर मशीन से पराली की गांठें बनवाकर बायोमास बिजली घरों या किसान कनेक्ट पर ₹220-₹280 प्रति क्विंटल के भाव बेचें।""",
        "actions": [
            {"label": "Sell Baled Stubble on Kisan Connect", "link": "/add-waste"},
            {"label": "Find Equipment & Baler Partners", "link": "/find-partners"}
        ]
    },

    # 2. HOW TO CONVERT PADDY STRAW INTO COMPOST? (Exact dedicated match)
    {
        "id": "paddy_straw_composting",
        "category": "composting",
        "keywords": [
            "convert paddy straw into compost", "how can i convert paddy straw into compost",
            "paddy straw compost", "compost from paddy straw", "rice straw compost", "paddy straw into compost",
            "make compost from parali", "parali se compost", "धान की पराली से खाद", "पराली से कंपोस्ट कैसे बनाएं",
            "पुआल से खाद"
        ],
        "title_en": "How to Convert Paddy Straw into Nutrient-Rich Compost (Step-by-Step)",
        "title_hi": "धान की पराली से उच्च गुणवत्ता वाली जैविक खाद (कंपोस्ट) बनाने की विधि",
        "content_en": """**Step-by-Step Guide: Converting Paddy Straw into Compost:**
Paddy straw has a high Carbon-to-Nitrogen ratio (~80:1) and natural silica coating, which slows down natural decay. By balancing nitrogen and using microbial inoculants, it turns into rich organic manure in 45–60 days.

**Step 1: Chopping & Shredding**
- Shred the straw into 2–3 inch pieces using a crop chopper or tractor-mounted mulcher. Shredding increases microbial contact area by 400%.

**Step 2: Nitrogen & C:N Ratio Adjustment**
- Microbes require a C:N ratio of 25:1 to 30:1 to decompose straw efficiently.
- Prepare a dung slurry: Mix 200 kg fresh cow dung with 400 litres of water per tonne of straw.
- Alternatively, dissolve 1.5 kg urea per 100 kg dry straw into the water spray.

**Step 3: Layering & Bio-Inoculation (The Heap / Pit Method)**
- Make a compost bed (12 ft long × 5 ft wide × 3.5 ft high) in a shaded area.
- Spread an 8-inch layer of chopped straw.
- Thoroughly moisten with the dung slurry and spray **PUSA Bio-Decomposer** solution (or *Trichoderma viride* / *Pleurotus* fungal culture).
- Sprinkle 2 kg single superphosphate (SSP) or rock phosphate per layer to enrich phosphorus content.
- Repeat layering until the pile is 3.5 to 4 feet high.

**Step 4: Moisture Control & Aerobic Turning**
- Maintain 55%–60% moisture (straw should feel damp like a squeezed sponge without dripping excess water).
- Turn the compost heap on Day 15, Day 30, and Day 45 to introduce oxygen. Internal heap temperatures reach 55°C–65°C, killing weed seeds and crop pathogens.

**Step 5: Harvesting (Day 50–60)**
- The straw transforms into dark brown, sweet-smelling crumbly humus.
- **Yield:** 1 tonne of dry straw produces ~600–700 kg of finished organic compost.
- **Value:** Saves ₹1,200/acre in synthetic fertilizer costs or can be sold locally at ₹6 – ₹8/kg.""",
        "content_hi": """**धान की पराली से जैविक खाद बनाने की 5 आसान चरणबद्ध विधि:**
धान की पराली में कार्बन अधिक (80:1 अनुपात) और सिलिका होता है। सही नाइट्रोजन और सूक्ष्मजीव कल्चर मिलाकर 45-60 दिनों में चायपत्ती जैसी भुरभुरी खाद बनाई जा सकती है।

**चरण 1: पराली की कुट्टी करना (Shredding):**
- पराली को 2-3 इंच के टुकड़ों में काट लें। कटी हुई पराली बहुत तेजी से गलती है।

**चरण 2: सी:एन अनुपात संतुलित करना:**
- 1 टन पराली के लिए 200 किलो ताजा गोबर को 400 लीटर पानी में घोलकर स्लरी बनाएं। प्रति 100 किग्रा पराली पर 1.5 किग्रा यूरिया भी मिला सकते हैं।

**चरण 3: गड्ढा या ढेर (Bed) बनाना व पूसा डीकंपोज़र:**
- छायादार जगह पर 12 फीट लंबा, 5 फीट चौड़ा और 3.5 फीट ऊंचा ढेर बनाएं।
- 8 इंच पराली की परत बिछाएं, ऊपर गोबर की स्लरी और **पूसा बायो-डीकंपोज़र (PUSA Bio-Decomposer)** या ट्राइकोडर्मा का घोल छिड़कें।
- ऐसी 4-5 परतें बनाकर ढेर को बोरी या तिरपाल से ढक दें।

**चरण 4: नमी और पलटाई:**
- 55-60% नमी बनाए रखें। 15वें, 30वें और 45वें दिन ढेर की फावड़े से पलटाई करें ताकि हवा मिले। अंदर तापमान 60°C तक जाता है जिससे खरपतवार के बीज नष्ट हो जाते हैं।

**चरण 5: खाद तैयार (50-60 दिन):**
- 50-60 दिनों में गहरी भूरी, भुरभुरी और महकदार जैविक खाद तैयार हो जाती है। 1 टन पराली से 600-700 किलो खाद मिलती है, जो मिट्टी की जान बढ़ाती है।""",
        "actions": [
            {"label": "Explore Composting Video Guide", "link": "/recycling-education"},
            {"label": "List Organic Compost for Sale", "link": "/add-waste"}
        ]
    },

    # 3. HOW CAN I EARN MONEY BY SELLING AGRICULTURAL WASTE? (Exact dedicated match)
    {
        "id": "earn_money_farm_waste",
        "category": "waste_monetization",
        "keywords": [
            "how can i earn money by selling agricultural waste", "earn money by selling agricultural waste",
            "sell agricultural waste", "make money from farm waste", "earn from farm waste", "sell stubble",
            "sell crop residue", "agricultural waste prices", "how to sell waste", "farm waste monetization",
            "कचरे से कमाई", "कृषि अपशिष्ट बेचकर पैसे कैसे कमाएं", "पराली बेचकर कमाई", "खेती के कचरे से आमदनी"
        ],
        "title_en": "How to Earn Money by Selling Agricultural Waste (Market Rates & Channels)",
        "title_hi": "कृषि अपशिष्ट बेचकर पैसे कैसे कमाएं? (बाजार दरें एवं बिक्री के तरीके)",
        "content_en": """**How to Turn Farm Waste into Additional Income:**
Rather than burning or dumping crop residues, Indian farmers can monetize every major waste stream directly through Kisan Connect.

**1. Guaranteed Market Rates by Waste Stream:**
- **Baled Paddy Straw (Parali):** ₹220 – ₹280 per quintal (₹2,200 – ₹2,800 per tonne). Biomass power plants and SATAT Compressed Bio-Gas (CBG) units procure baled straw at your farm gate. A 5-acre farm producing 12 tonnes of straw can generate ₹26,000 – ₹33,000 in gross revenue.
- **Wheat Straw (Turi / Chaff):** ₹400 – ₹700 per quintal (₹4,000 – ₹7,000 per tonne). Exceptional recurring demand as dry animal fodder across dairy hubs.
- **Rice Husk (Chawal ki Bhusi):** ₹300 – ₹450 per quintal. Purchased by boiler plants, brick kilns, and silica extractors.
- **Sugarcane Bagasse & Trash:** ₹180 – ₹240 per quintal for paper manufacturing and boiler co-generation.
- **Agricultural Plastic Scrap (Drip laterals, Mulch sheets):** ₹18 – ₹26 per kg (₹18,000 – ₹26,000 per tonne). Collected by CPCB-registered plastic recyclers.
- **Enriched Vermicompost:** ₹6 – ₹10 per kg retail; ₹4,500 – ₹7,000 per tonne bulk to fruit orchards and landscapers.

**2. Three Simple Steps to Sell on Kisan Connect:**
1. **List Your Waste:** Click **'+ Add Waste'** (/add-waste), enter estimated quantity (in quintals/tonnes), crop type, and location.
2. **Review Verified Buyer Bids:** Nearby bio-energy plants, compost manufacturers, and aggregators submit collection quotes.
3. **Farm-Gate Weighing & Instant Payment:** The buyer dispatches a baler/truck, weighs your batch on digital scales, and pays directly to your bank account or cash upon dispatch.""",
        "content_hi": """**कृषि अपशिष्ट बेचकर अतिरिक्त आय कमाने की संपूर्ण जानकारी:**
खेत के कचरे को जलाने या फेंकने के बजाय किसान कनेक्ट पर बेचकर किसान हर सीजन में अच्छी कमाई कर सकते हैं।

**1. कृषि अपशिष्ट की वर्तमान बाजार दरें:**
- **धान की पराली (Baled Stubble):** ₹220 – ₹280 प्रति क्विंटल (बायोमास बिजली घर और सीएनजी प्लांट खेत से उठाते हैं। 5 एकड़ से ₹25,000-₹33,000 तक की अतिरिक्त आमदनी)।
- **गेहूं की तूड़ी (Turi/Bhusa):** ₹400 – ₹700 प्रति क्विंटल (डेयरी फार्मों में सूखे चारे की भारी मांग)।
- **धान का छिलका (Rice Husk):** ₹300 – ₹450 प्रति क्विंटल (औद्योगिक बॉयलरों और सिलिका प्लांटों द्वारा खरीद)।
- **गन्ने की खोई व सूखी पत्ती:** ₹180 – ₹240 प्रति क्विंटल।
- **कृषि प्लास्टिक (ड्रिप पाइप, मल्चिंग):** ₹18 – ₹26 प्रति किलो (रीसाइक्लिंग पार्टनर सीधे खेत से लेते हैं)।
- **केंचुआ खाद (वर्मीकंपोस्ट):** ₹6 – ₹10 प्रति किलो।

**2. किसान कनेक्ट पर बेचने के 3 आसान चरण:**
1. **'+ Add Waste'** पर जाकर अपनी फसल का अवशेष, मात्रा और गांव का नाम दर्ज करें।
2. आपके जिले के सत्यापित खरीददार और बायोमास प्लांट आपसे संपर्क करेंगे।
3. धर्मकांटे पर वजन होकर सीधा आपके बैंक खाते में भुगतान मिलेगा।""",
        "actions": [
            {"label": "List My Farm Waste for Sale", "link": "/add-waste"},
            {"label": "View Nearby Verified Buyers", "link": "/find-partners"}
        ]
    },

    # 4. WHAT IS AN FPO? (Exact dedicated match)
    {
        "id": "fpo_definition_benefits",
        "category": "farmer_groups",
        "keywords": [
            "what is an fpo", "what is fpo", "farmer producer organization", "fpo meaning",
            "fpo definition", "fpo benefits", "how to form fpo", "fpo kya hota hai", "fpo kya hai",
            "एफपीओ क्या है", "किसान उत्पादक संगठन", "एफपीओ के फायदे", "fpc"
        ],
        "title_en": "What is an FPO (Farmer Producer Organization)? Benefits & 80% Machinery Subsidy",
        "title_hi": "एफपीओ (Farmer Producer Organization / किसान उत्पादक संगठन) क्या है? लाभ एवं 80% सब्सिडी",
        "content_en": """**What is an FPO (Farmer Producer Organization)?**
A **Farmer Producer Organization (FPO)** is a legal entity formed by primary agricultural producers (farmers, dairy keepers, rural artisans) registered under the Companies Act (as a Farmer Producer Company / FPC) or the Cooperative Societies Act. It enables small and marginal farmers to aggregate their land, produce, and purchasing power.

**1. Core Economic Benefits for Farmers:**
- **Bargaining Power & Bulk Savings:** FPOs purchase certified seeds, fertilizers, pesticides, and solar pumps in bulk directly from manufacturers, saving members 15% to 25% on input costs.
- **Direct Market Off-take:** Instead of selling individually at low *Mandi* distress prices to local middlemen, the FPO aggregates hundreds of tonnes and negotiates higher supply contracts with retail chains, agro-processors, and biomass plants.
- **Value Addition & Post-Harvest Infrastructure:** FPOs can install crop residue balers, grading units, cold storages, flour mills, and biomass briquetting machinery.

**2. Government Schemes & Subsidies for FPOs:**
- **CRM Scheme (Crop Residue Management):** While individual farmers get up to 50% subsidy, **FPOs receive up to 80% capital subsidy** to establish Custom Hiring Centers (CHCs) with expensive high-density balers, rakes, and Super Seeders.
- **Matching Equity Grant:** The Ministry of Agriculture provides an equity grant of up to ₹15 Lakh per FPO to enhance borrowing power.
- **Credit Guarantee Fund (via SFAC & NABARD):** Collateral-free credit guarantee coverage for bank project loans up to ₹2 Crore.
- **10,000 FPOs Scheme:** Central financial assistance of ₹18 Lakh per FPO over 3 years for management and operational costs.""",
        "content_hi": """**एफपीओ (Farmer Producer Organization / किसान उत्पादक संगठन) क्या है?**
एफपीओ किसानों का एक पंजीकृत समूह या कंपनी (कंपनी अधिनियम के तहत FPC) होती है, जिसके मालिक और सदस्य स्वयं किसान होते हैं। यह छोटे और सीमांत किसानों को संगठित कर एक बड़ी आर्थिक ताकत बनाता है।

**1. एफपीओ के प्रमुख लाभ:**
- **लागत में 20% तक की बचत:** खाद, बीज, कीटनाशक और उपकरण थोक में सीधे कंपनियों से खरीदे जाते हैं, जिससे बिचौलियों का कमीशन खत्म होता है।
- **उपज का बेहतर दाम:** किसान व्यक्तिगत रूप से मंडियों में कम दाम पर बेचने के बजाय, सामूहिक रूप से बड़ी कंपनियों, फूड प्रोसेसर्स और बायोमास प्लांटों को ऊंचे दामों पर बेचते हैं।
- **सामूहिक मूल्यवर्धन:** एफपीओ ग्रेडिंग, पैकिंग, कोल्ड स्टोरेज और पराली की गांठें बनाने वाली मशीनें लगा सकते हैं।

**2. सरकार की विशेष योजनाएं व 80% सब्सिडी:**
- **फसल अवशेष प्रबंधन (CRM):** सामान्य किसान को मशीनों पर 50% सब्सिडी मिलती है, जबकि **एफपीओ को कस्टम हायरिंग सेंटर (CHC) और बेलर लगाने पर 80% तक सब्सिडी** मिलती है।
- **इक्विटी मैचिंग ग्रांट:** केंद्र सरकार SFAC/नाबार्ड के माध्यम से एफपीओ को ₹15 लाख तक की समतुल्य इक्विटी सहायता देती है।
- **बिना गारंटी ₹2 करोड़ तक का ऋण:** क्रेडिट गारंटी योजना के तहत एफपीओ को बैंकों से 2 करोड़ रुपये तक का व्यावसायिक ऋण बिना अतिरिक्त कोलैटरल के मिल सकता है।""",
        "actions": [
            {"label": "Government Schemes & CRM Subsidies", "link": "/recycling-education"},
            {"label": "Connect with FPO Partners", "link": "/find-partners"}
        ]
    },

    # 5. WHICH INDUSTRIES PURCHASE RICE HUSK? (Exact dedicated match)
    {
        "id": "rice_husk_purchasing_industries",
        "category": "industrial_buyers",
        "keywords": [
            "which industries purchase rice husk", "industries purchase rice husk", "who buys rice husk",
            "rice husk buyers", "rice husk industry", "uses of rice husk", "who purchases rice husk",
            "industries buying rice husk", "rice husk", "धान का छिलका", "चावल की भूसी", "धान की भूसी",
            "धान का छिलका कौन खरीदता है", "चावल की भूसी कौन खरीदता है", "धान की भूसी के खरीदार", "राइस हस्क"
        ],
        "title_en": "Which Industries Purchase Rice Husk? (7 Major Industrial Buyers & Applications)",
        "title_hi": "धान का छिलका (Rice Husk) कौन-सी इंडस्ट्रीज खरीदती हैं? (7 प्रमुख औद्योगिक खरीदार)",
        "content_en": """**7 Major Industries that Actively Purchase Rice Husk:**
Rice husk (the hard protective outer shell of the paddy grain, accounting for ~20% of harvest weight) is one of India's most commercially sought-after agricultural by-products due to its high calorific value (~3,200 to 3,600 kcal/kg) and rich silica content.

**1. Biomass Power Plants & Cogeneration Units:**
- Thermal power stations and decentralized biomass energy plants burn rice husk in fluidised-bed boilers as an eco-friendly direct replacement for coal to generate green electricity.

**2. Precipitated Silica & Green Tire Manufacturers:**
- When burnt under controlled combustion, Rice Husk Ash (RHA) yields over **85% to 92% high-purity amorphous silica**.
- Leading tire companies (like Apollo, CEAT, Michelin) and rubber compounds use green silica to improve tire fuel efficiency, while dental, paint, and cosmetic labs source food-grade silica from husk ash.

**3. Brick Kilns & Ceramic Manufacturers:**
- Brick kilns across Punjab, Haryana, UP, and Bihar mix rice husk into clay formulations and burn it in kiln trenches to achieve uniform brick baking with lower coal consumption.

**4. Rice Bran Oil Solvent Extraction Mills:**
- Rice milling complexes use husk in high-pressure boilers to generate process steam for extracting culinary rice bran oil and refining bio-diesel.

**5. Biomass Briquette & Pellet Manufacturers:**
- Processing units crush and extrude rice husk without chemical binders into dense 70mm–90mm biofuel briquettes (white coal) traded across textile and dye boilers.

**6. Paper, Cardboard & Particle Board Mills:**
- Agro-fiber paper manufacturers use digested husk fibers as a structural additive in high-durability corrugated boxes and sustainable particle boards.

**7. Poultry & Dairy Bedding Aggregators:**
- Commercial poultry sheds buy coarse dry husk as moisture-absorbing floor litter, which is later harvested as high-nitrogen poultry manure compost.

*Market Rate: Raw rice husk currently trades between ₹300 – ₹450 per quintal depending on moisture level (<10%) and delivery distance.*""",
        "content_hi": """**धान का छिलका (Rice Husk / धान की भूसी) खरीदने वाले 7 प्रमुख उद्योग:**
धान का छिलका (चावल की भूसी) अपनी उच्च ज्वलनशीलता (3,400 kcal/kg) और सिलिका की प्रचुरता के कारण औद्योगिक क्षेत्र में बहुत अधिक बिकता है।

**1. बायोमास पावर प्लांट व बिजली घर:**
- कोयले के स्थान पर पर्यावरण-अनुकूल ईंधन के रूप में बॉयलरों में स्टीम और बिजली उत्पादन हेतु उपयोग किया जाता है।

**2. प्रेसिपिटेटेड सिलिका व टायर निर्माता (Silica Industry):**
- धान की भूसी की राख (RHA) में 85% से 90% शुद्ध अक्रिस्टलीय सिलिका होती है, जिसका उपयोग टायर, रबर, पेंट और टूथपेस्ट में प्रीमियम ग्रेड सिलिका के रूप में किया जाता है।

**3. ईंट भट्ठा एवं सिरेमिक उद्योग:**
- ईंटों को समान रूप से पकाने के लिए भट्ठों में कोयले के सस्ते और कारगर विकल्प के रूप में भारी मात्रा में धान की भूसी खरीदी जाती है।

**4. राइस ब्रान ऑयल (तेल मिलें):**
- चावल का तेल निकालने वाली सॉल्वेंट एक्सट्रैक्शन मिलें अपने हाई-प्रेशर बॉयलरों को चलाने के लिए भूसी की नियमित खरीददार होती हैं।

**5. बायोमास ब्रिकेट्स (सफेद कोयला) प्लांट:**
- भूसी को उच्च दबाव में दबाकर ठोस बायोमास ईंटें (Briquettes) बनाई जाती हैं, जो कपड़ा व केमिकल मिलों में बिकती हैं।

**6. पेपर मिल व पार्टिकल बोर्ड:**
- पैकेजिंग कार्टन और इको-फ्रेंडली बोर्ड बनाने के लिए रेशे के रूप में प्रयोग होता है।

**7. पोल्ट्री फार्म (मुर्गी पालन बिछावन):**
- नमी सोखने के लिए पोल्ट्री फार्मों में फर्श पर बिछावन के रूप में बड़े पैमाने पर उपयोग होता है।

*वर्तमान बाजार भाव: ₹300 से ₹450 प्रति क्विंटल।*""",
        "actions": [
            {"label": "Find Rice Husk Buyers & Boilers", "link": "/find-partners"},
            {"label": "List Rice Husk Quantity for Bids", "link": "/add-waste"}
        ]
    },

    # 6. HOW CAN I RECYCLE AGRICULTURAL PLASTIC? (Exact dedicated match)
    {
        "id": "agricultural_plastic_recycling",
        "category": "plastic_recycling",
        "keywords": [
            "how can i recycle agricultural plastic", "recycle agricultural plastic", "agricultural plastic",
            "drip pipe recycling", "mulch film recycling", "plastic waste on farm", "recycle farm plastic",
            "drip irrigation waste", "agricultural plastic recycling", "plastic scrap",
            "कृषि प्लास्टिक रीसाइक्लिंग", "ड्रिप पाइप का पुनर्चक्रण", "मल्चिंग प्लास्टिक कैसे रीसायकल करें",
            "खेत का प्लास्टिक"
        ],
        "title_en": "How to Recycle Agricultural Plastic (Drip Pipes, Mulch Films & Sacks)",
        "title_hi": "कृषि प्लास्टिक (ड्रिप पाइप, मल्चिंग शीट व बैग्स) का सुरक्षित पुनर्चक्रण कैसे करें?",
        "content_en": """**Step-by-Step Practical Guide to Agricultural Plastic Recycling:**
Modern farming consumes large volumes of polymers. Burning plastic in the field is hazardous and illegal, whereas clean, segregated scrap can be sold to CPCB-certified recyclers for attractive returns.

**1. Classify Your Agricultural Plastic by Polymer Type:**
- **Rigid HDPE (High-Density Polyethylene):** Drip lateral tubes, mainline pipes, micro-sprinklers, fertilizer drums. Highest scrap value (₹18 – ₹26/kg).
- **Flexible LDPE / LLDPE (Low-Density Polyethylene):** Mulching films, tunnel films, polyhouse covers, silage bags (₹10 – ₹16/kg).
- **Woven PP (Polypropylene):** Fertilizer, pesticide, and seed sacks (₹8 – ₹14/kg).

**2. Mandatory Field Preparation Steps:**
- **Never Burn:** Open-pit burning of agricultural polymers produces highly carcinogenic dioxins, furans, and black carbon, contaminating soil aquifers and destroying soil microbiology.
- **De-Silting & Cleaning:** Shake off field mud, silt, and entangled crop roots. Recyclers deduct 15–20% on price if scrap contains excessive sand.
- **Drain & Coil:** Drain residual canal water from drip pipes. Coil 16mm/20mm drip lines into neat 25–40 kg round rolls bound with scrap wire.
- **Bundle Films:** Roll dry mulching films into tight bales away from grease or pesticide chemical residue.

**3. Selling to Authorized Recyclers via Kisan Connect:**
- List your plastic batch under **'+ Add Waste'** (/add-waste) selecting category *'Agricultural Plastic'*.
- CPCB-registered recycling partners on Kisan Connect (such as *Ayush Polymers* and *GreenTech Recyclers*) arrange farm-gate truck pickups, weigh the coils on-site, and transport them to extrusion plants where the plastic is granulated into recycled polymer pellets for manufacturing non-potable sewage pipes, conduit ducts, and compost bins.""",
        "content_hi": """**कृषि प्लास्टिक (ड्रिप पाइप व मल्चिंग शीट) को रीसायकल करने की संपूर्ण विधि:**
खेत में प्लास्टिक जलाना पर्यावरण और स्वास्थ्य के लिए अत्यंत हानिकारक और दंडनीय है। इसे सही तरीके से इकट्ठा कर रीसाइक्लर को बेचकर किसान अच्छी आय प्राप्त कर सकते हैं।

**1. प्लास्टिक के प्रकार पहचानें:**
- **कठोर HDPE प्लास्टिक:** ड्रिप इरिगेशन की लेटरल पाइपें, स्प्रिंकलर पाइप, खाद के ड्रम (भाव: ₹18 से ₹26 प्रति किलो)।
- **नरम LDPE शीट:** खेत की मल्चिंग फिल्म, पॉलीहाउस की चादरें, साइलेज बैग (भाव: ₹10 से ₹16 प्रति किलो)।
- **PP बोरे:** यूरिया, डीएपी और बीज की खाली प्लास्टिक बोरियां (भाव: ₹8 से ₹14 प्रति किलो)।

**2. रीसाइक्लिंग के लिए तैयार कैसे करें:**
- **खेत में कभी न जलाएं:** प्लास्टिक जलाने से डाइऑक्सिन और फ्यूरान जैसी जहरीली कैंसरकारी गैसें निकलती हैं।
- **मिट्टी झाड़ें:** पाइप व मल्चिंग से सूखी मिट्टी व पौधों की जड़ें साफ करें। साफ माल पर पूरा भाव मिलता है।
- **रोल बनाएं:** ड्रिप पाइपों को 25-30 किलो के गोल बंडलों में लपेट लें।

**3. अधिकृत खरीदारों को बेचें:**
- किसान कनेक्ट के '+ Add Waste' पेज पर जाएं और 'Agricultural Plastic' श्रेणी चुनें।
- सीपीसीबी (CPCB) अधिकृत रीसाइक्लर आपके खेत पर गाड़ी भेजकर वजन करेंगे और ₹18-₹26/किग्रा की दर से नकद या बैंक में भुगतान करेंगे।""",
        "actions": [
            {"label": "List Plastic Scrap for Pickup", "link": "/add-waste"},
            {"label": "Explore CPCB Recycler Directory", "link": "/find-partners"}
        ]
    },

    # 7. PUNJAB & STATE SPECIFIC INITIATIVES (Follow-up context)
    {
        "id": "punjab_haryana_state_initiatives",
        "category": "state_initiatives",
        "keywords": [
            "punjab", "what about punjab", "haryana", "what about haryana", "punjab stubble",
            "punjab subsidy", "sangrur", "ludhiana", "patiala", "bathinda", "पंजाब", "हरियाणा"
        ],
        "title_en": "Stubble Management & Subsidies in Punjab & Haryana",
        "title_hi": "पंजाब एवं हरियाणा में पराली प्रबंधन, योजनाएं एवं नोडल व्यवस्था",
        "content_en": """**Stubble & Agricultural Waste Management in Punjab & Haryana:**

**1. Punjab CRM Scheme & Machinery Subsidies:**
- The Punjab Department of Agriculture & Farmers Welfare provides a **50% subsidy for individual farmers** and an **80% subsidy for FPOs / Panchayats** on Super Seeders, Smart Seeders, Happy Seeders, Balers, and Rakes.
- Online applications are processed through the state portal: *agrimachinerypb.com*.

**2. Active Bio-Energy Plants Procuring Straw in Punjab:**
- **Sangrur CBG Plant (Verbio India):** Asia's largest commercial Compressed Bio-Gas plant, consuming ~100,000 tonnes of paddy straw annually from over 40,000 acres.
- **Biomass Power Plants:** Operational across Malwa and Majha belts (Bathinda, Mansa, Ferozepur, Ludhiana) purchasing baled straw at ₹240 – ₹280/quintal.

**3. State Monitoring & Red Entry Policy:**
- Active fire incidents are tracked live via ISRO NASA satellites.
- Revenue departments place 'Red Entries' in land records for unmanaged stubble fires, which temporarily restricts crop loan access.
- Instead of risking penalties, utilize Kisan Connect to schedule local baling partners directly to your field.""",
        "content_hi": """**पंजाब एवं हरियाणा में पराली प्रबंधन, सब्सिडी व प्लांट:**

**1. पंजाब में सरकारी सब्सिडी (CRM Scheme):**
- व्यक्तिगत किसानों को मशीनों (सुपर सीडर, बेलर, रेक) पर **50% सब्सिडी** और एफपीओ/पंचायतों को कस्टम हायरिंग सेंटर खोलने पर **80% सब्सिडी** मिलती है।
- ऑनलाइन आवेदन राज्य के पोर्टल *agrimachinerypb.com* पर किए जाते हैं।

**2. पंजाब में सक्रिय बायोमास व सीबीजी प्लांट:**
- **संगरूर बायो-सीएनजी प्लांट (Verbio):** एशिया का सबसे बड़ा पराली आधारित प्लांट जो सालाना 1 लाख टन से अधिक पराली की खरीद करता है।
- **बठिंडा, मानसा, लुधियाना व पटियाला** के बायोमास बिजली घर पराली की गांठों को ₹240 से ₹280 प्रति क्विंटल पर सीधे खेतों से खरीद रहे हैं।

**3. सैटेलाइट निगरानी व रेड एंट्री:**
- पराली जलाने पर प्रशासन द्वारा गिरदावरी (जमीन रिकॉर्ड) में 'रेड एंट्री' दर्ज की जाती है, जिससे बैंक लोन मिलने में बाधा आती है।
- जुर्माने से बचने के लिए किसान कनेक्ट के माध्यम से अपने खेत से बेलर बुक करें।""",
        "actions": [
            {"label": "Find Balers in Punjab & Haryana", "link": "/find-partners"},
            {"label": "List Paddy Straw for Procurement", "link": "/add-waste"}
        ]
    },

    # 8. KEY GOVERNMENT SCHEMES & SUBSIDIES (CRM, SATAT, GOBARdhan, PM-KUSUM)
    {
        "id": "government_schemes_crm",
        "category": "government_schemes",
        "keywords": [
            "government schemes", "schemes", "subsidies", "crm scheme", "subsidy", "smam",
            "machinery subsidy", "happy seeder subsidy", "baler subsidy", "crop residue machinery",
            "सरकारी योजनाएं", "सब्सिडी", "सीआरएम योजना", "मशीनरी सब्सिडी", "अनुदान"
        ],
        "title_en": "Key Indian Government Agricultural Waste Schemes & Subsidies (CRM, SATAT, GOBARdhan)",
        "title_hi": "कृषि अवशेष एवं यंत्रों पर प्रमुख सरकारी योजनाएं व सब्सिडी",
        "content_en": """**Key Government Schemes & Subsidies for Farmers:**

**1. Crop Residue Management (CRM) Scheme:**
- **Individual Farmers:** Up to **50% financial assistance / subsidy** for purchasing in-situ and ex-situ equipment (Super SMS, Happy Seeder, Smart Seeder, Super Seeder, Straw Balers, Rakes, and Mulchers).
- **Custom Hiring Centers (CHCs) & FPOs:** Up to **80% project cost subsidy** for establishing farm machinery banks with high-capacity balers.
- **How to Apply:** Register online at your state agriculture portal (such as agrimachinery.nic.in or agrimachinerypb.com) using Aadhaar and land record (Khasra/Khatauni).

**2. SATAT Initiative (Sustainable Alternative Towards Affordable Transportation):**
- Fosters commercial CBG plants using agro-waste with guaranteed 100% long-term gas offtake agreements by Indian Oil, HPCL, and BPCL.

**3. GOBARdhan Scheme:**
- Up to ₹50 Lakh financial assistance per district to set up community or commercial biogas/CBG plants converting cattle dung and crop residues into organic bio-slurry.

**4. PM-KUSUM Scheme:**
- Up to 60% subsidy for setting up standalone solar agricultural pumps and solarizing existing grid-connected tubewells.""",
        "content_hi": """**किसानों के लिए प्रमुख सरकारी योजनाएं एवं सब्सिडी:**

**1. फसल अवशेष प्रबंधन योजना (CRM Scheme):**
- **व्यक्तिगत किसान:** सुपर सीडर, हैप्पी सीडर, बेलर, रेक व मल्चर खरीदने पर **50% तक सब्सिडी**।
- **कस्टम हायरिंग सेंटर (CHC / FPO):** मशीनों का बैंक स्थापित करने पर **80% तक सब्सिडी**।
- **आवेदन कैसे करें:** राज्य कृषि विभाग के पोर्टल (जैसे agrimachinery.nic.in) पर आधार कार्ड व जमीन की खतौनी से ऑनलाइन आवेदन करें।

**2. गोबरधन योजना (GOBARdhan):**
- पराली व गोबर से बायोगैस/सीएनजी संयंत्र लगाने के लिए ₹50 लाख तक की वित्तीय सहायता।

**3. सतत योजना (SATAT):**
- पराली से बनी बायो-सीएनजी को सरकारी तेल कंपनियों (IOCL, BPCL) द्वारा निश्चित न्यूनतम दर पर खरीदने की गारंटी।

**4. पीएम-कुसुम योजना (PM-KUSUM):**
- सोलर पंप लगवाने पर 60% तक का सरकारी अनुदान।""",
        "actions": [
            {"label": "Explore Educational Resource Guides", "link": "/recycling-education"},
            {"label": "Find Equipment Partners", "link": "/find-partners"}
        ]
    },

    # 9. HOW TO USE KISAN CONNECT PLATFORM
    {
        "id": "kisan_connect_platform_guide",
        "category": "platform_help",
        "keywords": [
            "how to use kisan connect", "kisan connect", "how does kisan connect work",
            "how to list waste", "register", "login", "track order", "add waste",
            "किसान कनेक्ट कैसे काम करता है", "किसान कनेक्ट का उपयोग", "लिस्ट कैसे करें"
        ],
        "title_en": "How Kisan Connect Works: 5-Step Farm-to-Recycler Platform Guide",
        "title_hi": "किसान कनेक्ट प्लेटफॉर्म कैसे काम करता है? (5 आसान चरण)",
        "content_en": """**How Kisan Connect Works for Farmers & Recycling Partners:**

1. **Sign Up & Profile Setup (/signup):**
   - Register in 30 seconds as a **Farmer** or a **Recycling Partner** with your mobile number and district.

2. **List Your Agricultural Waste (/add-waste):**
   - Enter your crop residue type (paddy straw, wheat turi, rice husk, bagasse, plastic, dung), estimated quantity in quintals/tonnes, farm location, and optional photo.

3. **Locate Nearby Recycling Partners (/find-partners):**
   - Browse the interactive geo-map showing verified biomass power plants, composters, and CPCB plastic recyclers within 50 km of your farm.

4. **Request On-Site Collection:**
   - Select your listing and dispatch an instant collection request. The buyer contacts you to schedule mechanical baling or truck transport.

5. **Weighing, Tracking & Instant Payment (/tracking):**
   - Track order milestones (Pending -> Accepted -> Scheduled -> Picked Up -> Completed). Verified digital weighing ensures immediate transparent payment.""",
        "content_hi": """**किसान कनेक्ट प्लेटफॉर्म कैसे काम करता है (5 आसान चरण):**

1. **रजिस्ट्रेशन (/signup):** 'Join Kisan Connect' पर जाकर 'Farmer' या 'Recycling Partner' चुनें।
2. **अपशिष्ट लिस्ट करें (/add-waste):** फसल अवशेष (पराली, तूड़ी, भूसा, गोबर, प्लास्टिक), वजन (क्विंटल) व गांव दर्ज करें।
3. **पार्टनर खोजें (/find-partners):** 50 किमी के दायरे में स्थित बायोमास प्लांट, कंपोस्टर व प्लास्टिक रीसाइक्लर देखें।
4. **कलेक्शन का अनुरोध भेजें:** पार्टनर को चुनें और 'Request Collection' बटन दबाएं।
5. **ट्रैकिंग व सुरक्षित भुगतान (/tracking):** ऑर्डर की लाइव स्थिति देखें और खेत से माल उठते ही तुरंत सही वजन पर भुगतान पाएं।""",
        "actions": [
            {"label": "List Farm Waste Now", "link": "/add-waste"},
            {"label": "Find Recycling Partners", "link": "/find-partners"},
            {"label": "Track Orders", "link": "/tracking"}
        ]
    }
]

def search_knowledge_base(query: str, language: str = "en") -> dict:
    """Searches knowledge base for top matching topic based on phrase and keyword density."""
    q = query.lower().strip()
    is_hindi = language == "hi" or any(char in q for char in "अआइईउऊऋएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह")

    best_match = None
    best_score = 0

    # Direct phrase matching first
    for item in KNOWLEDGE_BASE:
        for kw in item["keywords"]:
            if kw == q:
                return {
                    "matched": True,
                    "id": item["id"],
                    "title": item["title_hi"] if is_hindi else item["title_en"],
                    "content": item["content_hi"] if is_hindi else item["content_en"],
                    "actions": item.get("actions", [])
                }

    # Keyword density scoring
    for item in KNOWLEDGE_BASE:
        score = 0
        for kw in item["keywords"]:
            if kw in q:
                # Give higher weight to multi-word phrase matches
                score += (len(kw.split()) * 3)
        if score > best_score:
            best_score = score
            best_match = item

    if best_match and best_score >= 3:
        return {
            "matched": True,
            "id": best_match["id"],
            "title": best_match["title_hi"] if is_hindi else best_match["title_en"],
            "content": best_match["content_hi"] if is_hindi else best_match["content_en"],
            "actions": best_match.get("actions", [])
        }

    return {"matched": False}
