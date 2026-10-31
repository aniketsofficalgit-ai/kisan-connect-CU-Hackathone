import os
import json
import logging
import bcrypt
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from config import config
from app.database.models import (
    Base, User, FarmerProfile, PartnerProfile, WasteCategory,
    WasteListing, CollectionRequest, CollectionStatusHistory,
    Notification, EducationalResource
)

logger = logging.getLogger("kisan_connect.database")
logging.basicConfig(level=logging.INFO)

db_uri = config.get_database_uri()

# Handle connection with fallback to SQLite if MySQL fails
try:
    if "mysql" in db_uri:
        logger.info(f"Connecting to MySQL database at {config.MYSQL_HOST}:{config.MYSQL_PORT}/{config.MYSQL_DB}...")
        engine = create_engine(db_uri, pool_pre_ping=True, pool_recycle=3600)
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info("Successfully connected to MySQL database.")
    else:
        logger.info(f"Using SQLite database: {config.DEFAULT_SQLITE_URL}")
        engine = create_engine(config.DEFAULT_SQLITE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    logger.warning(f"Could not connect using {db_uri} ({e}). Falling back to local SQLite database.")
    engine = create_engine(config.DEFAULT_SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def seed_data(db):
    """Seed initial data if database is empty."""
    if db.query(User).first():
        logger.info("Database already seeded with initial data.")
        return

    logger.info("Seeding Kisan Connect database with initial data...")

    # 1. Categories
    categories = [
        WasteCategory(
            name="Crop residue and stubble",
            name_hi="फसल अवशेष और पराली",
            slug="crop_residue",
            description="Paddy stubble, wheat residue, sugarcane trash, cotton stalks, and other field remains after harvesting.",
            description_hi="धान की पराली, गेहूं के अवशेष, गन्ने की पत्ती, कपास की डंडियां और कटाई के बाद खेत का कचरा।",
            icon="Wheat",
            recommended_uses="Composting, biochar creation, biomass briquettes, paper pulp, and mushroom cultivation substrate."
        ),
        WasteCategory(
            name="Straw and husk",
            name_hi="भूसा और छिलका",
            slug="straw_husk",
            description="Rice husk, wheat straw, mustard husk, groundnut shells, and grain processing residues.",
            description_hi="चावल का भूसा/छिलका, गेहूं का भूसा, सरसों की तूड़ी और मूंगफली के छिलके।",
            icon="Sprout",
            recommended_uses="Biomass energy pellets, cattle feed supplementation, industrial boilers, packaging material."
        ),
        WasteCategory(
            name="Organic farm waste",
            name_hi="जैविक कृषि अपशिष्ट",
            slug="organic_waste",
            description="Spoiled fruits and vegetables, horticulture clippings, fallen leaves, and discarded crop matter.",
            description_hi="खराब फल और सब्जियां, बागवानी की छंटाई, सूखे पत्ते और खराब फसल।",
            icon="Leaf",
            recommended_uses="Vermicomposting, aerobic microbial composting, liquid bio-fertilizer, and insect protein farming."
        ),
        WasteCategory(
            name="Animal manure",
            name_hi="गोबर और पशु खाद",
            slug="animal_manure",
            description="Cow dung, buffalo slurry, poultry litter, goat manure, and dairy washings.",
            description_hi="गाय का गोबर, भैंस का स्लरी, पोल्ट्री खाद, बकरी की मींगनी और डेयरी अपशिष्ट।",
            icon="PawPrint",
            recommended_uses="Biogas energy production (CBG/CNG), enriched organic vermicompost, Jeevamrut preparation."
        ),
        WasteCategory(
            name="Agricultural plastic",
            name_hi="कृषि प्लास्टिक और मल्चिंग",
            slug="agricultural_plastic",
            description="Drip irrigation lateral pipes, mulch films, empty fertilizer/seed bags, greenhouse sheets, and twine.",
            description_hi="ड्रिप सिंचाई की पाइपें, मल्चिंग फिल्म, खाद और बीज के खाली कट्टे, ग्रीनहाउस पॉलीथिन शीट।",
            icon="Recycle",
            recommended_uses="Mechanical plastic granulate recycling, re-extrusion into non-pressure pipes, and polymer upcycling."
        ),
        WasteCategory(
            name="Other agricultural waste",
            name_hi="अन्य कृषि अपशिष्ट",
            slug="other_waste",
            description="Coconut coir pith, banana pseudostems, spent mushroom substrate, and wood cuttings.",
            description_hi="नारियल की जटा, केले का तना, मशरूम की इस्तेमाल की हुई खाद और लकड़ी के टुकड़े।",
            icon="Trees",
            recommended_uses="Coir geotextiles, natural fiber extraction, potting soil mixes, and engineered bio-boards."
        ),
    ]
    for cat in categories:
        db.add(cat)
    db.commit()

    # 2. Users
    # Admin
    admin_user = User(
        full_name="Prakhar Admin",
        email="admin@kisanconnect.com",
        phone="+91 98765 00001",
        password_hash=hash_password("Admin@123"),
        role="admin",
        is_active=True
    )
    db.add(admin_user)

    # Farmers
    farmer_ramesh = User(
        full_name="Ramesh Kumar",
        email="ramesh@kisanconnect.com",
        phone="+91 98765 11111",
        password_hash=hash_password("Farmer@123"),
        role="farmer",
        is_active=True
    )
    farmer_suresh = User(
        full_name="Suresh Patel",
        email="suresh@kisanconnect.com",
        phone="+91 98765 22222",
        password_hash=hash_password("Farmer@123"),
        role="farmer",
        is_active=True
    )
    farmer_aniket = User(
        full_name="Aniket Dubey",
        email="aniket@kisanconnect.com",
        phone="+91 98765 33333",
        password_hash=hash_password("Farmer@123"),
        role="farmer",
        is_active=True
    )
    db.add_all([farmer_ramesh, farmer_suresh, farmer_aniket])
    db.commit()

    # Farmer Profiles
    profile_ramesh = FarmerProfile(
        user_id=farmer_ramesh.id,
        farm_name="Ramesh Organic Acres",
        farm_size_acres=12.5,
        address="Village Jhammat, Near GT Road",
        village="Jhammat",
        district="Ludhiana",
        state="Punjab",
        pincode="141001",
        latitude=30.9010,
        longitude=75.8573,
        primary_crops="Rice (Paddy), Wheat, Mustard"
    )
    profile_suresh = FarmerProfile(
        user_id=farmer_suresh.id,
        farm_name="Suresh Green Valley",
        farm_size_acres=8.0,
        address="National Highway 8, Samarkha",
        village="Samarkha",
        district="Anand",
        state="Gujarat",
        pincode="388001",
        latitude=22.5645,
        longitude=72.9289,
        primary_crops="Cotton, Banana, Dairy Cattle"
    )
    profile_aniket = FarmerProfile(
        user_id=farmer_aniket.id,
        farm_name="Dubey Agro Fields",
        farm_size_acres=15.0,
        address="Taraori Road, Near Grain Market",
        village="Taraori",
        district="Karnal",
        state="Haryana",
        pincode="132116",
        latitude=29.6857,
        longitude=76.9905,
        primary_crops="Basmati Paddy, Wheat, Sugarcane"
    )
    db.add_all([profile_ramesh, profile_suresh, profile_aniket])

    # Partners
    partner_greenbio = User(
        full_name="Raj Renewable Biomass",
        email="greenbio@kisanconnect.com",
        phone="+91 98765 44444",
        password_hash=hash_password("Partner@123"),
        role="partner",
        is_active=True
    )
    partner_ecocompost = User(
        full_name="Ayush Compost Solutions",
        email="ecocompost@kisanconnect.com",
        phone="+91 98765 55555",
        password_hash=hash_password("Partner@123"),
        role="partner",
        is_active=True
    )
    partner_agriplastic = User(
        full_name="Clover Clean Plastic Recyclers",
        email="agriplastic@kisanconnect.com",
        phone="+91 98765 66666",
        password_hash=hash_password("Partner@123"),
        role="partner",
        is_active=True
    )
    partner_pending = User(
        full_name="SunPower Bio-Energy Plant",
        email="cloverpower@kisanconnect.com",
        phone="+91 98765 77777",
        password_hash=hash_password("Partner@123"),
        role="partner",
        is_active=True
    )
    db.add_all([partner_greenbio, partner_ecocompost, partner_agriplastic, partner_pending])
    db.commit()

    # Partner Profiles
    profile_greenbio = PartnerProfile(
        user_id=partner_greenbio.id,
        business_name="GreenBio Fuels & Biomass Industries",
        business_type="biomass_plant",
        description="Pioneering stubble-to-clean-energy solutions. We procure paddy straw, wheat stubble, and mustard stalk directly at farm gates with our fleet of automated balers.",
        registration_number="REG-BIO-2024-8841",
        contact_person="Harpreet Singh",
        contact_phone="+91 98765 44444",
        contact_email="procurement@greenbiofuels.in",
        service_area="Ludhiana, Jalandhar, Patiala, Sangrur, Karnal",
        accepted_categories=json.dumps(["crop_residue", "straw_husk"]),
        minimum_quantity=50.0,
        pricing_details="₹220 - ₹280 per quintal (Includes on-farm baling & pickup)",
        is_verified=True,
        verification_status="approved",
        operating_hours="Mon-Sun: 7:00 AM - 7:00 PM",
        address="Industrial Growth Centre, Sahnewal, Ludhiana",
        latitude=30.8654,
        longitude=75.9876,
        rating=4.9
    )
    profile_ecocompost = PartnerProfile(
        user_id=partner_ecocompost.id,
        business_name="Prakhar Organic Fertilizers & Vermicompost",
        business_type="compost_manufacturer",
        description="Certified bulk producer of organic vermicompost and liquid bio-fertilizers. We collect cow manure, spoiled horticulture waste, and green farm trimmings.",
        registration_number="REG-COM-2023-1129",
        contact_person="Vikram Desai",
        contact_phone="+91 98765 55555",
        contact_email="vikram@prakharcompost.com",
        service_area="Anand, Vadodara, Kheda, Ahmedabad",
        accepted_categories=json.dumps(["organic_waste", "animal_manure"]),
        minimum_quantity=20.0,
        pricing_details="₹140 - ₹180 per quintal (Free pickup for >5 tonnes)",
        is_verified=True,
        verification_status="approved",
        operating_hours="Mon-Sat: 8:00 AM - 6:00 PM",
        address="GIDC Estate, Anand-Vithal Udyognagar",
        latitude=22.5312,
        longitude=72.9341,
        rating=4.8
    )
    profile_agriplastic = PartnerProfile(
        user_id=partner_agriplastic.id,
        business_name="Ayush Agri-Polymer Recyclers",
        business_type="plastic_recycler",
        description="Authorized CPCB recycling partner transforming discarded farm plastics, drip irrigation tubes, and mulch film into durable non-pressure agro pipes.",
        registration_number="CPCB-PLAST-2024-910",
        contact_person="Rohan Gupta",
        contact_phone="+91 98765 66666",
        contact_email="recycle@ayushcleanearth.org",
        service_area="Delhi-NCR, Sonipat, Panipat, Ludhiana, Karnal",
        accepted_categories=json.dumps(["agricultural_plastic"]),
        minimum_quantity=50.0,
        pricing_details="₹18 - ₹26 per kg depending on grade & cleanliness",
        is_verified=True,
        verification_status="approved",
        operating_hours="Mon-Fri: 9:00 AM - 5:30 PM",
        address="Eco-Industrial Park, Kundli, Sonipat",
        latitude=28.8711,
        longitude=77.1264,
        rating=4.7
    )
    profile_pending = PartnerProfile(
        user_id=partner_pending.id,
        business_name="SunPower Bio-Energy Co.",
        business_type="biomass_plant",
        description="Newly established 10MW biomass power generation facility seeking long-term stubble and husk supply contracts from local farmers.",
        registration_number="REG-BIO-2026-0043",
        contact_person="Amit Tyagi",
        contact_phone="+91 98765 77777",
        contact_email="supply@sunpowerbio.com",
        service_area="Panipat, Karnal, Jind",
        accepted_categories=json.dumps(["crop_residue", "straw_husk", "other_waste"]),
        minimum_quantity=100.0,
        pricing_details="₹240 per quintal fixed seasonal rate",
        is_verified=False,
        verification_status="pending",
        operating_hours="Mon-Sat: 8:30 AM - 6:30 PM",
        address="Sector 25 Industrial Area, Panipat",
        latitude=29.3909,
        longitude=76.9635,
        rating=4.5
    )
    db.add_all([profile_greenbio, profile_ecocompost, profile_agriplastic, profile_pending])
    db.commit()

    # 3. Waste Listings
    cat_residue = db.query(WasteCategory).filter_by(slug="crop_residue").first()
    cat_straw = db.query(WasteCategory).filter_by(slug="straw_husk").first()
    cat_organic = db.query(WasteCategory).filter_by(slug="organic_waste").first()
    cat_manure = db.query(WasteCategory).filter_by(slug="animal_manure").first()
    cat_plastic = db.query(WasteCategory).filter_by(slug="agricultural_plastic").first()

    listing1 = WasteListing(
        farmer_id=farmer_ramesh.id,
        category_id=cat_residue.id,
        title="High Grade Paddy / Rice Straw (Basmati Stubble)",
        quantity=140.0,
        unit="quintal",
        description="Freshly harvested Basmati paddy straw, baled and kept in dry storage. Excellent for biomass power plants or mushroom bed preparation. Fully clean, zero chemical contamination.",
        image_url="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
        location_address="Farm Gate, Village Jhammat, Ludhiana",
        village_district="Jhammat, Ludhiana, Punjab",
        latitude=30.9010,
        longitude=75.8573,
        pickup_available=True,
        expected_price=240.0,
        status="available"
    )
    listing2 = WasteListing(
        farmer_id=farmer_ramesh.id,
        category_id=cat_plastic.id,
        title="Drip Lateral Pipes & Used Mulching Film",
        quantity=380.0,
        unit="kg",
        description="Rolled HDPE drip irrigation lateral pipes (16mm) and black agricultural mulching sheet from vegetable fields. Washed and rolled into tight bundles for easy loading.",
        image_url="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
        location_address="Farm Shed 2, Jhammat, Ludhiana",
        village_district="Ludhiana, Punjab",
        latitude=30.9050,
        longitude=75.8600,
        pickup_available=True,
        expected_price=22.0,
        status="available"
    )
    listing3 = WasteListing(
        farmer_id=farmer_suresh.id,
        category_id=cat_manure.id,
        title="Well-Decomposed Dairy Cow Dung Manure",
        quantity=6.5,
        unit="tonne",
        description="Organic cow dung from our 35 Gir cows herd, collected and cured for 45 days. High nitrogen and beneficial microbial load. Ready for vermicomposting or biogas plant feeding.",
        image_url="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80",
        location_address="Dairy Shed 1, Samarkha, Anand",
        village_district="Samarkha, Anand, Gujarat",
        latitude=22.5645,
        longitude=72.9289,
        pickup_available=True,
        expected_price=1600.0,
        status="available"
    )
    listing4 = WasteListing(
        farmer_id=farmer_aniket.id,
        category_id=cat_straw.id,
        title="Clean Wheat Straw (Turi / Bhusa)",
        quantity=95.0,
        unit="quintal",
        description="Golden wheat straw harvested via combine with straw reaper. Stored under waterproof tarpaulin. Highly suitable for paper mills, biomass fuel, or livestock fodder.",
        image_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        location_address="Taraori Farm Sector 4, Karnal",
        village_district="Taraori, Karnal, Haryana",
        latitude=29.6857,
        longitude=76.9905,
        pickup_available=True,
        expected_price=260.0,
        status="available"
    )
    db.add_all([listing1, listing2, listing3, listing4])
    db.commit()

    # 4. Collection Requests
    req1 = CollectionRequest(
        request_number="KC-REQ-2026-001",
        listing_id=listing1.id,
        farmer_id=farmer_ramesh.id,
        partner_id=partner_greenbio.id,
        status="Scheduled",
        farmer_notes="140 quintals ready at farm gate. Tractor trailer can easily reach our store yard.",
        partner_notes="Our baling truck will arrive on Saturday morning. Driver contact: +91 98765 44444.",
        requested_pickup_date="2026-11-02",
        scheduled_pickup_date="2026-11-03 09:30 AM",
        offered_price=33600.0, # 140 * 240
        payment_status="pending"
    )
    req2 = CollectionRequest(
        request_number="KC-REQ-2026-002",
        listing_id=listing3.id,
        farmer_id=farmer_suresh.id,
        partner_id=partner_ecocompost.id,
        status="Completed",
        farmer_notes="6.5 tonnes of cured cow dung manure. Need quick pickup before rain.",
        partner_notes="Collection completed successfully with heavy tipper truck. Payment transferred via NEFT.",
        requested_pickup_date="2026-10-25",
        scheduled_pickup_date="2026-10-26 11:00 AM",
        actual_pickup_date="2026-10-26 02:15 PM",
        offered_price=10400.0,
        payment_status="paid"
    )
    db.add_all([req1, req2])
    db.commit()

    # 5. History logs
    hist1 = CollectionStatusHistory(
        collection_id=req1.id,
        status="Pending",
        comment="Collection request submitted by Ramesh Kumar.",
        updated_by_id=farmer_ramesh.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=2)
    )
    hist2 = CollectionStatusHistory(
        collection_id=req1.id,
        status="Accepted",
        comment="GreenBio Fuels reviewed the listing and accepted the request.",
        updated_by_id=partner_greenbio.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=1, hours=8)
    )
    hist3 = CollectionStatusHistory(
        collection_id=req1.id,
        status="Scheduled",
        comment="Pickup scheduled for Saturday Nov 3 at 9:30 AM with automatic baler fleet.",
        updated_by_id=partner_greenbio.id,
        created_at=datetime.now(timezone.utc) - timedelta(hours=6)
    )

    hist_c1 = CollectionStatusHistory(
        collection_id=req2.id,
        status="Pending",
        comment="Request sent by Suresh Patel.",
        updated_by_id=farmer_suresh.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=5)
    )
    hist_c2 = CollectionStatusHistory(
        collection_id=req2.id,
        status="Accepted",
        comment="Accepted by Prakhar Organic Fertilizers.",
        updated_by_id=partner_ecocompost.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=4)
    )
    hist_c3 = CollectionStatusHistory(
        collection_id=req2.id,
        status="Scheduled",
        comment="Scheduled for Oct 26 morning.",
        updated_by_id=partner_ecocompost.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=4)
    )
    hist_c4 = CollectionStatusHistory(
        collection_id=req2.id,
        status="Picked Up",
        comment="Loaded 6.5 tonnes onto partner transport vehicle.",
        updated_by_id=partner_ecocompost.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=3)
    )
    hist_c5 = CollectionStatusHistory(
        collection_id=req2.id,
        status="Completed",
        comment="Farmer confirmed completion and received ₹10,400 direct bank transfer.",
        updated_by_id=farmer_suresh.id,
        created_at=datetime.now(timezone.utc) - timedelta(days=3)
    )
    db.add_all([hist1, hist2, hist3, hist_c1, hist_c2, hist_c3, hist_c4, hist_c5])

    # 6. Educational Resources
    edu1 = EducationalResource(
        title="Crop Residue Management & Composting",
        title_hi="फसल अवशेष प्रबंधन और कम्पोस्टिंग",
        waste_category="Crop residue and stubble",
        reuse_method="Aerobic in-situ composting & PUSA Bio-Decomposer",
        summary="Instead of burning paddy and wheat stubble which degrades soil biome and causes extreme air pollution, convert residue into nutrient-rich humus.",
        instructions="1. Cut stubble close to the ground using a Super SMS attached combine.\n2. Spray PUSA bio-decomposer or waste decomposer solution (25 liters/acre) mixed with jaggery.\n3. Incorporate the residue into the topsoil using a Rotavator or Happy Seeder.\n4. Maintain light moisture for 18-21 days to complete decomposition before sowing next crop.",
        safety_guidelines="Wear face masks during spraying. Do not mix chemical pesticides with microbial bio-decomposer solutions.",
        environmental_benefits="Prevents particulate matter (PM2.5) release, preserves 15-20 kg nitrogen and 5 kg phosphorus per acre in soil organic carbon.",
        estimated_value_potential="Saves ₹1,800/acre in fertilizer cost + avoids ₹5,000 burning penalty."
    )
    edu2 = EducationalResource(
        title="Straw and Husk into Clean Biomass Fuel",
        title_hi="भूसा और छिलका: स्वच्छ बायोमास ईंधन",
        waste_category="Straw and husk",
        reuse_method="Densified Pellets & Biomass Briquetting",
        summary="Rice husk and wheat straw have a high calorific value (3,200 to 3,600 kcal/kg), making them superior coal substitutes in thermal power plants and green boilers.",
        instructions="1. Sun-dry husk or chopped straw to less than 12% moisture content.\n2. Screen and remove dirt, stones, and foreign objects.\n3. Feed into a mechanical hydraulic briquette press or pelletizer without chemical binders.\n4. Store cylindrical briquettes on raised pallets in covered sheds away from moisture.",
        safety_guidelines="Ensure proper ventilation in milling rooms to prevent combustible dust buildup. Use spark arrestors.",
        environmental_benefits="Every tonne of biomass briquette displaces approx. 0.8 tonnes of coal and prevents 1.5 tonnes of net carbon dioxide emission.",
        estimated_value_potential="Farmers earn ₹2,200 - ₹2,800 per tonne selling straw directly to bio-energy plants."
    )
    edu3 = EducationalResource(
        title="Agricultural Plastics & Drip Tape Recycling",
        title_hi="कृषि प्लास्टिक और ड्रिप पाइप का सुरक्षित पुनर्चक्रण",
        waste_category="Agricultural plastic",
        reuse_method="Segregation and Authorized CPCB Mechanical Recycling",
        summary="Drip lines, nursery polybags, and mulch films contain recyclable polymers (LDPE, LLDPE, HDPE). Burning them releases highly toxic dioxins.",
        instructions="1. Shake and brush off adhering field soil and roots.\n2. Segregate drip lateral tubes (HDPE) from thin mulching film (LDPE).\n3. Roll drip lines into 25-50 kg neat circular bundles using a simple hand winder.\n4. Request collection from certified recyclers through Kisan Connect.",
        safety_guidelines="Never burn plastics in farm trenches or canals. Burning plastics produces carcinogenic fumes and permanently poisons farm groundwater.",
        environmental_benefits="Recycling 1 tonne of farm plastic saves 5,774 kWh of electricity and eliminates open dump pollution.",
        estimated_value_potential="Direct scrap value of ₹18 to ₹26 per kilogram."
    )
    edu4 = EducationalResource(
        title="Livestock Manure to Compressed Biogas (CBG)",
        title_hi="गोबर और पशु खाद से संपीड़ित बायो-गैस (CBG) और जैविक खाद",
        waste_category="Animal manure",
        reuse_method="Anaerobic Digestion & Bio-Slurry Enrichment",
        summary="Cattle dung generates methane gas for cooking/vehicle fuel while producing slurry that is richer in active nitrogen than raw manure.",
        instructions="1. Mix fresh cattle dung with water in 1:1 ratio.\n2. Feed daily into anaerobic digester tank.\n3. Collect clean combustible methane gas from dome.\n4. Extract digestate bio-slurry and dry it into high-grade organic fertilizer (FOM).",
        safety_guidelines="Install flame arrestors on gas output valves. Check piping regularly for leaks using soap foam.",
        environmental_benefits="Mitigates potent fugitive methane emissions (28x worse than CO2) while restoring soil microbial health.",
        estimated_value_potential="Free cooking gas + ₹1,500/tonne for dried bio-slurry fertilizer."
    )
    db.add_all([edu1, edu2, edu3, edu4])

    # 7. Notifications
    notif1 = Notification(
        user_id=farmer_ramesh.id,
        title="Pickup Scheduled!",
        message="GreenBio Fuels scheduled your paddy straw collection for Saturday, Nov 3 at 9:30 AM.",
        type="collection_request",
        link="/tracking",
        is_read=False
    )
    notif2 = Notification(
        user_id=farmer_suresh.id,
        title="Payment Received ₹10,400",
        message="Prakhar Organic Fertilizers completed payment for 6.5 tonnes of cattle manure.",
        type="status_update",
        link="/tracking",
        is_read=True
    )
    notif3 = Notification(
        user_id=partner_greenbio.id,
        title="New Waste Listing in Your Service Area",
        message="A farmer listed 140 quintals of paddy straw in Ludhiana.",
        type="alert",
        link="/partner-dashboard",
        is_read=False
    )
    db.add_all([notif1, notif2, notif3])

    db.commit()
    logger.info("Database successfully seeded with demo users, partners, listings, and education guides!")

def init_db():
    """Initializes tables and seeds initial data."""
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
