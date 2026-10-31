import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    // Brand & General
    brand_name: "Kisan Connect",
    tagline: "Turning Farm Waste into Valuable Resources",
    team_name: "CLOVER GUARDIAN",
    home: "Home",
    explore_waste: "Explore Waste",
    explore_farm_waste: "Explore Farm Waste",
    find_partners: "Recycling Partners",
    how_it_works: "How It Works",
    about_us: "About Us",
    education: "Recycling Guide",
    login: "Log In",
    signup: "Register",
    logout: "Log Out",
    welcome: "Welcome",
    notifications: "Notifications",
    get_started: "Get Started",
    explore_partners: "Explore Recycling Partners",
    ai_assistant: "KRITI AI",
    ai_help_prompt: "Need advice on crop stubble, plastics, or finding a collector? Ask KRITI AI!",
    footer_text: "Smart Agricultural Waste Management & Recycling Platform. Connecting Indian farmers directly with verified biomass power plants, commercial composters, and authorized plastic recycling facilities.",
    rights_reserved: "All rights reserved.",
    change_language: "Switch Language / भाषा बदलें",
    engineered_by: "Engineered by Team Clover Guardian",
    team_members: "Prakhar • Ayush • Raj • Aniket Dubey",

    // Homepage Hero Section
    hero_badge: "AI-Powered Agritech Ecosystem • 100% Verified",
    hero_headline_pre: "The Future of",
    hero_headline_highlight: "AI-Powered",
    hero_headline_post: "Agriculture.",
    hero_description: "Empowering Indian farmers to transform crop residue, paddy straw, and farm waste into profitable resources with intelligent logistics, verified buyers, and zero burning.",
    hero_cta_explore: "Explore Waste",
    hero_cta_partners: "Find Recycling Partners",
    stat_tonnes_val: "500+",
    stat_tonnes_label: "Tonnes Diverted",
    stat_buyers_val: "100%",
    stat_buyers_label: "Verified Buyers",
    stat_fee_val: "₹0",
    stat_fee_label: "Farmer Listing Fee",
    hero_ai_match: "⚡ AI Match: 99.4% Accuracy",
    hero_zero_burning: "Zero Field Burning",
    hero_biomass_network: "Verified Biomass Baler Network",
    hero_biomass_rate: "₹220 – ₹280 / Quintal",
    hero_biomass_desc: "Direct farm-gate collection by certified bio-energy plants",
    trust_sustainable: "Sustainable Farming",
    trust_sustainable_desc: "Stop stubble burning & restore topsoil organic carbon",
    trust_verified: "Verified Recycling Partners",
    trust_verified_desc: "Audited bio-energy plants, composters & recyclers",
    trust_value: "Better Value for Farmers",
    trust_value_desc: "Transparent on-site digital weighing & direct payments",

    // What We Do Section
    what_we_do_badge: "AI-Driven Platform Architecture",
    what_we_do_title: "Bridging Indian Agriculture & Clean Industrial Recycling.",
    what_we_do_desc: "India generates over 500 million tonnes of crop residue annually. Kisan Connect eliminates the friction between farmers needing fast field clearance and clean industries hungry for biomass and recyclable polymers.",
    farm_gate_tag: "Direct Farm-Gate Integration",
    farm_gate_title: "From Field Burning Liability to High-Yield Resource.",
    farm_gate_desc: "Rather than spending money on clearing fields or risking severe stubble burning fines, farmers list their residue batches in 2 minutes. Verified collectors bring automated balers straight to the field, baling and clearing acreage within 48 hours of harvest.",
    baler_title: "Mechanized Baler Logistics",
    baler_desc: "Eliminates the acute labor shortage between paddy harvest and wheat sowing. Custom Hiring Centers and biomass aggregators dispatch tractor-mounted balers directly to registered plots.",
    baler_link: "View Baler Fleet Network",
    payment_title: "Zero-Middleman Payments",
    payment_desc: "Every transaction is certified using digital on-site weighbridges. Payments are transferred directly into the farmer's bank account without predatory commission deductions.",
    payment_link: "Check Current Residue Rates",

    // Waste Types Section
    waste_types_badge: "Valorization Catalog",
    waste_types_title: "Types of Agricultural Waste",
    waste_types_desc: "Every agricultural byproduct has a certified recycling pathway. Discover the 6 key agricultural waste streams supported across our regional network.",
    browse_marketplace_link: "Browse All Marketplace Batches →",

    // How It Works Section
    how_works_badge: "Transparent 4-Step Process",
    how_works_title: "How Kisan Connect Works",
    how_works_desc: "Designed specifically for Indian farmers with simple visual steps and zero technical friction.",
    step1_tag: "Quick 2-minute form",
    step1_title: "List Your Farm Waste",
    step1_desc: "Specify crop stubble, quantity, storage condition, and farm gate address with a quick photo.",
    step2_tag: "Direct map & rate comparison",
    step2_title: "Connect with Partners",
    step2_desc: "Browse verified biomass power plants, vermicompost units, and plastic aggregators near you.",
    step3_tag: "Farm-gate pickup",
    step3_title: "Scheduled Collection",
    step3_desc: "Partner approves your listing and dispatches automatic balers or transport trailers directly to your farm.",
    step4_tag: "Zero burn & direct revenue",
    step4_title: "Fair Pay & Clean Air",
    step4_desc: "Weighing verified on-site, collection confirmed, and payment transferred directly into your bank account.",
    callout_ready_title: "Ready to turn your farm residue into income?",
    callout_ready_desc: "Join hundreds of farmers who stopped stubble burning and started earning.",
    start_free_listing: "Start Free Listing",

    // Benefits Section
    benefits_badge: "Farmer Empowerment",
    benefits_title: "Key Benefits for Indian Farmers",
    benefits_desc: "Kisan Connect was designed from the ground up to solve farm-level bottlenecks and put real money back into farmers' pockets.",
    benefit1_title: "Guaranteed Secondary Income",
    benefit1_desc: "Turn discarded paddy straw, wheat husk, and cattle dung into predictable revenue of ₹1,500 – ₹3,500 per acre instead of losing value to burning.",
    benefit2_title: "Zero Fire Penalties & Red Notices",
    benefit2_desc: "Stay 100% compliant with National Green Tribunal (NGT) and district environmental regulations without risking satellite detection penalties.",
    benefit3_title: "Free On-Farm Automated Baling",
    benefit3_desc: "Partner aggregators bring commercial tractor-mounted balers directly to your fields, baling crop residues within 24–48 hours of harvest.",
    benefit4_title: "Preserves Topsoil Fertility",
    benefit4_desc: "Eliminating field burning preserves beneficial earthworms, mycorrhizal fungi, and organic carbon (SOC), boosting next-season wheat yields.",
    benefit5_title: "Transparent Digital Weighing",
    benefit5_desc: "Verified digital weight measurement at collection time prevents middleman deductions. Fast payment release straight into your bank account.",
    benefit6_title: "24/7 KRITI AI Voice Support",
    benefit6_desc: "Ask questions in Hindi or English about moisture requirements, baler schedules, and market pricing with our custom agritech voice assistant.",
    join_thousands_title: "Join thousands of farmers making smart agricultural choices",
    join_thousands_desc: "Takes less than 2 minutes to list your first residue batch or check regional partner rates.",
    create_farmer_acc: "Create Farmer Account",

    // Impact Section
    impact_badge: "Environmental Accountability",
    impact_title: "Measurable Change Across Indian Agriculture",
    impact_desc: "Every collection logged on Kisan Connect is mathematically verified against IPCC agricultural residue emission factors. We never publish estimated or fictitious metrics.",
    conversion_cycle_title: "The Circular Waste Conversion Cycle",
    cycle1_title: "Farm Gate Recovery",
    cycle1_desc: "Automated balers gather paddy straw and stubble without torching the topsoil.",
    cycle2_title: "Industrial Valorization",
    cycle2_desc: "Converted into compressed fuel pellets, high-grade vermicompost, or recycled drainage piping.",
    cycle3_title: "Clean Air & Direct Payouts",
    cycle3_desc: "Zero PM2.5 haze generation + guaranteed direct bank deposit to farmer.",
    metric_co2_label: "Verified CO₂ Emissions Averted",
    metric_co2_desc: "Prevents 1.5t net atmospheric CO₂ release per metric tonne of diverted paddy straw.",
    metric_stubble_label: "Stubble Farmland Cleared",
    metric_stubble_desc: "Zero open field fire across registered farm zones, preserving topsoil organic carbon.",
    metric_waste_label: "Total Residue Recovered",
    metric_waste_desc: "Diverted away from seasonal open burning into circular industrial value chains.",
    metric_payout_label: "Direct Farmer Payouts Disbursed",
    metric_payout_desc: "100% direct bank deposits with verified digital weighbridge certificates.",

    // Featured Partners Section
    partners_badge: "Regional Aggregator Network",
    partners_title: "Verified Recycling Partner Network",
    partners_desc: "Audited biomass pellet plants, commercial composters, and authorized polymer recyclers ready for on-farm collection.",
    explore_all_partners_link: "Explore Complete Partner Directory →",
    accepted_label: "Accepted Residues",
    capacity_label: "Processing Capacity",
    baling_fleet_label: "Baling Support",
    request_collection_btn: "Request Collection",

    // Join Network Section
    join_badge: "Get Started Today",
    join_title: "Join the Kisan Connect Network",
    join_desc: "Whether you cultivate farmland or operate clean recycling facilities, there is a dedicated pathway for you.",
    i_am_farmer: "I am a Farmer",
    i_am_farmer_desc: "Transform paddy stubble, wheat husk, cow dung, and discarded plastics into direct farm revenue instead of penalties or field fires.",
    farmer_point1: "Free listing & instant quotes from verified collectors",
    farmer_point2: "Farm-gate pickup using automated baling trucks",
    farmer_point3: "24/7 KRITI AI Voice Assistant guidance in Hindi & English",
    register_farmer_btn: "Register as a Farmer",
    i_am_partner: "I am a Recycling Partner",
    i_am_partner_desc: "Secure steady, high-volume seasonal biomass and polymer feedstocks directly from aggregated farm clusters across North India.",
    partner_point1: "Direct access to thousands of registered farm listings",
    partner_point2: "Optimized route planning & automated dispatch tools",
    partner_point3: "Verified ESG & carbon credits tracking certificates",
    register_partner_btn: "Register as a Recycling Partner",

    // Footer
    footer_platform_links: "Platform Links",
    footer_waste_streams: "Waste Streams",
    footer_helpline: "Farmer Helpline & Support",
    toll_free_kisan: "Toll-Free Kisan Call Centre",
    available_hours: "Available 6:00 AM – 10:00 PM",
    official_support: "Official Support Desk",
    operational_hubs: "Active Operational Hubs",
    operational_hubs_val: "Punjab, Haryana, Uttar Pradesh, Gujarat",
    zero_stubble_mission: "Zero Stubble Burning Mission",
    safety_guidelines: "Safety Guidelines",
    designed_for_farmers: "Designed with care for Indian Farmers.",

    // Roles & Consoles
    farmer_dashboard: "My Farm Dashboard",
    partner_dashboard: "Partner Console",
    admin_dashboard: "Admin Panel",
    farmer_console: "Farmer Console",
    partner_console: "Recycling Partner Operations Console",
    farmer_workspace: "Farmer Workspace",
    verified: "VERIFIED",

    // Quick Actions
    quick_actions_title: "Quick Actions & Operations",
    list_sell_waste: "List / Sell Waste",
    find_collectors: "Find Collectors",
    list_new_waste: "List New Waste",
    list_new_waste_desc: "Post paddy straw, bhusa, manure or plastics",
    find_a_collector: "Find a Collector",
    find_a_collector_desc: "Discover verified biomass plants & composters",
    track_collection: "Track Collection",
    track_collection_desc: "View scheduled truck dates and pickup status",
    ask_kriti_ai: "Ask KRITI AI",
    ask_kriti_ai_desc: "Instant help on rates, baling & crop advisory",

    // Farmer Dashboard Stats
    my_active_listings: "My Active Listings",
    waste_collected: "Waste Collected",
    completed_pickups: "completed pickups",
    active_pickups: "Active Pickups",
    view_timeline: "View timeline →",
    total_earnings: "Total Earnings",
    in_progress: "in progress",
    acres_under_cultivation: "Acres Under Cultivation",
    village: "Village",

    // Farmer Waste Table
    my_farm_waste_listings: "My Farm Waste Listings",
    my_farm_waste_desc: "Your active residues visible to local recycling aggregators",
    add_new_waste: "+ Add New Waste",
    waste_item: "Waste Item",
    category: "Category",
    available_quantity: "Available Quantity",
    expected_rate: "Expected Rate",
    status: "Status",
    actions: "Actions",
    negotiable: "Negotiable",
    view_details: "View Details",
    delete_listing: "Delete Listing",
    delete_confirm: "Are you sure you want to remove this waste listing?",
    delete_fail: "Failed to delete listing.",
    no_waste_listed_yet: "No waste listed yet",
    no_waste_listed_desc: "List your paddy stubble, bhusa or plastic to get partner pickup quotes.",
    list_first_batch: "List Your First Batch",

    // Collection Requests Section
    active_collection_requests: "Active Collection Requests",
    active_collection_desc: "Live pickup dates and truck schedule from recycling partners",
    all_orders: "All Orders",
    no_requests_active: "No collection requests currently active. Go to Recycling Partners to schedule a pickup.",
    partner_label: "Partner",
    scheduled_date: "Scheduled Date",
    requested_on: "Requested on",
    track_timeline: "Track Timeline →",

    // Partner Dashboard Header & Actions
    operational_service_area: "Operational Service Area",
    review_requests: "Review Requests",
    browse_waste_lots: "Browse Waste Lots",

    // Partner Metrics
    incoming_requests: "Incoming Requests",
    awaiting_dispatch: "Awaiting dispatch review",
    scheduled_pickups: "Scheduled Pickups",
    assigned_fleet: "Assigned for fleet pickup",
    completed_collections: "Completed Collections",
    processed_delivered: "Processed & delivered",
    total_farmer_payouts: "Total Farmer Payouts",
    direct_payments_settled: "Direct payments settled",

    // Partner Live Feed
    open_farm_residues: "Open Farm Residues in Your Service Area",
    open_farm_residues_desc: "Farmers looking for collection in your region matching accepted categories.",
    browse_all_listings: "Browse All Listings",
    no_matching_listings: "No active open listings currently posted in your service area.",
    open_quote: "Open Quote",
    view_lot: "View Lot",

    // Partner Requests Table
    incoming_farmer_requests: "Incoming Farmer Collection Requests",
    incoming_farmer_requests_desc: "Accept requests, schedule dispatch times, and update delivery milestones",
    view_all_tracking: "View All in Tracking →",
    no_requests_received: "No collection requests received yet.",
    request_number: "Request #",
    waste_lot: "Waste Lot",
    farmer: "Farmer",
    offered_payout: "Offered Payout",
    action: "Action",
    manage_order: "Manage Order",

    // Bottom Navigation (Mobile)
    dashboard: "Dashboard",
    sell_waste: "Sell Waste",
    collectors: "Collectors",
    tracking: "Tracking",

    // Status Badges
    status_available: "Available",
    status_pending: "Pending",
    status_accepted: "Accepted",
    status_scheduled: "Scheduled",
    status_in_transit: "In Transit",
    status_picked_up: "Picked Up",
    status_completed: "Completed",
    status_cancelled: "Cancelled",

    // Categories
    cat_paddy_straw: "Paddy Straw",
    cat_wheat_straw: "Wheat Straw (Turi)",
    cat_rice_husk: "Rice Husk",
    cat_sugarcane_trash: "Sugarcane Bagasse & Trash",
    cat_mustard_residue: "Mustard Residue",
    cat_cow_dung: "Animal Manure / Cow Dung",
    cat_plastic_waste: "Agricultural Plastics",
    cat_cotton_stalks: "Cotton Stalks",
    cat_other: "Other Crop Residue",

    // Units
    unit_quintals: "quintals",
    unit_tonnes: "tonnes",
    unit_kg: "kg",

    // Admin Dashboard
    admin_governance: "Kisan Connect Governance & Administration",
    platform_ops_console: "Platform Operations Console",
    admin_ops_desc: "Real-time verification of recyclers, waste listings oversight, and verified environmental metrics",
    tab_approvals: "Approvals",
    tab_manage_users: "Manage Users",
    tab_moderate_listings: "Moderate Listings",
    tab_impact_reports: "Impact Reports",
    reg_farmers: "Registered Farmers",
    reg_farmers_desc: "Active agricultural producers",
    reg_partners: "Recycling Partners",
    pending_verification: "pending verification",
    total_listings: "Total Waste Listings",
    open_on_market: "available on market",
    verified_co2_offset: "CO₂ Emissions Saved",
    clean_air_impact: "Verified clean-air impact",
    pending_partner_verifications: "Pending Partner Verification Applications",
    approve_partner: "Approve Partner",
    reject: "Reject",

    // Auth (Login / Signup)
    signin_heading: "Sign In to Your Account",
    signin_desc: "Access your farm listings, partner orders, and collection schedules.",
    email_label: "Email Address",
    email_placeholder: "Enter your email address",
    password_label: "Password",
    password_placeholder: "Enter your password",
    signin_btn: "Sign In to Kisan Connect",
    no_account: "Don't have an account?",
    register_link: "Register for free",
    signup_heading: "Create Your Account",
    signup_desc: "Join India's leading agricultural waste management platform.",
    role_farmer_label: "Farmer / कृषि उत्पादक",
    role_partner_label: "Recycling Partner / पुनर्चक्रण",
    fullname_label: "Full Name",
    fullname_placeholder: "e.g. Ramesh Kumar",
    phone_label: "Phone Number",
    phone_placeholder: "10-digit mobile number",
    confirm_password_label: "Confirm Password",
    confirm_password_placeholder: "Re-enter your password",
    already_account: "Already registered?",
    login_link: "Sign In",

    // Partner Discovery Page
    find_partners_badge: "Verified Aggregators & Industrial Recyclers",
    find_partners_title: "Find Recycling Partners",
    find_partners_desc: "Locate certified biomass energy plants, commercial vermicompost manufacturers, and authorized plastic recycling facilities operating in your district.",
    card_directory: "Card Directory",
    interactive_map: "Interactive Map",
    search_partner_placeholder: "Search partner organization name or keywords...",
    district_filter_placeholder: "District (e.g. Ludhiana, Anand, Karnal)...",
    filter_directory_btn: "Filter Directory",
    filter_by_material: "Filter by Accepted Material:",
    reset_all: "Reset All",
    no_partners_found: "No Recycling Partners Found",
    no_partners_desc: "Try another district or category to discover available recycling partners.",
    clear_filters: "Clear Filters",
    list_farm_waste: "List Your Farm Waste",
    districts_label: "Districts",
    operating_hours_label: "Hours",
    procurement_label: "Procurement",
    accepted_streams: "Accepted Streams:",
    view_facility: "View Facility",
    request_pickup: "Request Pickup",
    searching_partners: "Searching verified recycling partners...",

    // Auth Visuals & Actions
    visual_badge: "AI-Powered Agritech Platform",
    visual_heading: "Transforming Agricultural Waste into New Opportunities.",
    visual_desc_login: "Connect directly with certified biomass power producers, vermicompost manufacturers, and authorized polymer recycling facilities across India.",
    visual_feature_1: "Zero field fire penalties with timely on-farm baler collection",
    visual_feature_2: "Direct digital weight verification and instant bank settlement",
    visual_feature_3: "Verified buyers across Punjab, Haryana, UP, and Gujarat",
    instant_demo_login: "1-Click Instant Demo Login",
    auto_fill: "Auto-Fill",
    role_farmer: "Farmer",
    role_partner: "Recycling Partner",
    role_admin: "Gov Admin",
    role_admin_sub: "Platform Admin",
    signin_to_platform: "Sign In to Platform",
    authenticating: "Authenticating...",
    dont_have_account: "Don't have an account yet?",
    join_kisan_connect: "Join Kisan Connect →",
    create_account: "Create Your Account",
    select_role_desc: "Select your role to unlock customized tools and features.",
    i_am_farmer_btn: "I am a Farmer",
    partner_btn: "Recycling Partner",
    farm_size_acres: "Farm Size (Acres)",
    primary_crops: "Primary Crops",
    village_tehsil: "Village / Tehsil",
    district: "District",
    state: "State",
    business_name: "Business / Entity Name",
    business_type: "Business Operation Type",
    service_districts: "Service Districts / Radius",
    min_pickup_batch: "Minimum Pickup Batch (qtl)",
    register_as: "Register as",
    already_registered_link: "Sign In Instead →",

    // About Us Page
    about_badge: "Team Clover Guardian Initiative",
    about_title: "Turning Farm Waste into Valuable Resources.",
    about_desc: "Kisan Connect is an integrated circular agricultural platform engineered to eliminate stubble burning, empower Indian farmers with direct income, and feed clean energy industries with verified biomass and recyclable materials.",
    about_explore_btn: "Explore Waste Marketplace",
    about_partners_btn: "Meet Recycling Partners",
    milestone_challenge_title: "The Challenge",
    milestone_challenge_desc: "Over 500 million tonnes of crop residue generated across India annually. Farmers face tight sowing windows between Kharif and Rabi crops, leading to stubble burning penalties and hazardous winter air pollution.",
    milestone_innovation_title: "The Innovation",
    milestone_innovation_desc: "Kisan Connect bridges the last-mile gap by connecting farmers with mechanized baler operators, biomass fuel manufacturers, vermicompost producers, and authorized polymer recyclers.",
    milestone_impact_title: "The Impact",
    milestone_impact_desc: "Zero-burn fields, verified carbon credits, fair farm-gate pricing, and reliable raw material supply for green industry without middlemen exploitation.",
    team_heading: "Meet Team Clover Guardian",
    team_desc: "Engineered with passion for Indian agriculture, clean air, and circular sustainability.",
    prakhar_role: "Full-Stack Architecture & Agritech Systems",
    prakhar_focus: "Waste Marketplace & Partner Network Logistics",
    ayush_role: "UI/UX Design & Frontend Engineering",
    ayush_focus: "Accessible Farmer Interfaces & Visual Journeys",
    raj_role: "Backend APIs & Database Architecture",
    raj_focus: "Role-Based Authentication & Order Fulfillment Engine",
    aniket_role: "AI Assistant & Environmental Impact Modeling",
    aniket_focus: "Conversational Multilingual KRITI AI & Carbon Verification",

    // Recycling Guide Page
    guide_badge: "Agricultural Knowledge Hub",
    guide_title: "Recycling & Farm Waste Valorization Guide",
    guide_desc: "Scientific, field-tested instructions to convert crop residues, straw, livestock manure, and plastics into valuable income streams instead of hazardous open burning.",
    tab_practical_guides: "Practical Recycling Guides",
    tab_waste_directory: "Waste Classification Directory",
    six_core_streams: "Six Core Agricultural Waste Streams",
    loading_guides: "Loading practical recycling guides...",
    recommended_valorization: "Recommended Valorization:",

    // AI Assistant Page
    ai_page_badge: "KRITI AI • Smart Agricultural Assistant",
    ai_page_title: "Two-Way Voice & Chat AI for Farmers",
    ai_page_desc: "Ask questions about stubble management, vermicomposting, biomass pricing, government subsidies, and platform navigation. Speak using your microphone or type.",
    languages_label: "Languages",
    languages_val: "Hindi • English • Hinglish",
    voice_mode_label: "Voice Mode",
    voice_mode_val: "Automated Two-Way",
    how_voice_works: "How Voice Assistant Works",
    voice_step1_strong: "Speak using the microphone:",
    voice_step1_desc: "KRITI AI transcribes your words and automatically speaks the complete answer aloud.",
    voice_step2_strong: "Type a question:",
    voice_step2_desc: "KRITI AI responds in written text without playing audio unless you click the speaker button.",
    voice_step3_strong: "Photo identification:",
    voice_step3_desc: "Click the camera button to upload farm residue for classification.",
    direct_actions: "Direct Platform Actions",
    action_list_waste: "+ List Farm Waste on Marketplace →",
    action_find_partners: "Find Verified Recycling Partners →",
    action_education: "Scientific Composting & Baler Guides →"
  },

  hi: {
    // Brand & General
    brand_name: "किसान कनेक्ट",
    tagline: "खेत के अपशिष्ट को बनाएं मूल्यवान संसाधन",
    team_name: "क्लोवर गार्जियन",
    home: "मुख्य पृष्ठ",
    explore_waste: "अपशिष्ट खोजें",
    explore_farm_waste: "कृषि अपशिष्ट खोजें",
    find_partners: "रीसाइक्लिंग पार्टनर",
    how_it_works: "यह कैसे काम करता है",
    about_us: "हमारे बारे में",
    education: "रीसाइक्लिंग मार्गदर्शिका",
    login: "लॉग इन",
    signup: "पंजीकरण",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    notifications: "सूचनाएं",
    get_started: "शुरुआत करें",
    explore_partners: "पुनर्चक्रण पार्टनर खोजें",
    ai_assistant: "कृति एआई (KRITI AI)",
    ai_help_prompt: "पराली, खाद या खरीदार खोजने में सहायता चाहिए? कृति एआई से पूछें!",
    footer_text: "स्मार्ट कृषि अपशिष्ट प्रबंधन और पुनर्चक्रण मंच। भारतीय किसानों को प्रमाणित बायोमास बिजली संयंत्रों, जैविक खाद निर्माताओं और अधिकृत प्लास्टिक रीसाइक्लिंग सुविधाओं से सीधे जोड़ता है।",
    rights_reserved: "सर्वाधिकार सुरक्षित।",
    change_language: "भाषा बदलें / Switch Language",
    engineered_by: "टीम क्लोवर गार्जियन द्वारा विकसित",
    team_members: "प्रखर • आयुष • राज • अनिकेत दुबे",

    // Homepage Hero Section
    hero_badge: "एआई-संचालित कृषि पारिस्थितिकी तंत्र • 100% सत्यापित",
    hero_headline_pre: "एआई-संचालित आधुनिक",
    hero_headline_highlight: "कृषि",
    hero_headline_post: "का भविष्य।",
    hero_description: "भारतीय किसानों को सशक्त बनाना: फसल अवशेष, धान की पराली और कृषि कचरे को सुरक्षित लॉजिस्टिक्स, सत्यापित खरीदारों और शून्य पराली दहन के साथ लाभदायक संसाधनों में बदलें।",
    hero_cta_explore: "अपशिष्ट खोजें",
    hero_cta_partners: "रीसाइक्लिंग पार्टनर खोजें",
    stat_tonnes_val: "500+",
    stat_tonnes_label: "टन अपशिष्ट पुनर्निर्देशित",
    stat_buyers_val: "100%",
    stat_buyers_label: "सत्यापित खरीदार",
    stat_fee_val: "₹0",
    stat_fee_label: "किसान लिस्टिंग शुल्क",
    hero_ai_match: "⚡ एआई मिलान: 99.4% सटीकता",
    hero_zero_burning: "खेत में पराली जलाना बंद",
    hero_biomass_network: "सत्यापित बायोमास बेलर नेटवर्क",
    hero_biomass_rate: "₹220 – ₹280 / क्विंटल",
    hero_biomass_desc: "प्रमाणित बायो-ऊर्जा संयंत्रों द्वारा सीधे खेत से उठाव",
    trust_sustainable: "सतत एवं टिकाऊ खेती",
    trust_sustainable_desc: "पराली जलाना बंद करें और मिट्टी की जैविक उर्वरता बढ़ाएं",
    trust_verified: "सत्यापित रीसाइक्लिंग पार्टनर",
    trust_verified_desc: "प्रमाणित बायोमास प्लांट, कंपोस्ट निर्माता व रीसाइक्लर्स",
    trust_value: "किसानों के लिए बेहतर मूल्य",
    trust_value_desc: "पारदर्शी ऑन-साइट डिजिटल वजन और सीधा बैंक भुगतान",

    // What We Do Section
    what_we_do_badge: "एआई-संचालित मंच वास्तुकला",
    what_we_do_title: "भारतीय कृषि और स्वच्छ औद्योगिक रीसाइक्लिंग का सीधा संगम।",
    what_we_do_desc: "भारत में प्रतिवर्ष 50 करोड़ टन से अधिक फसल अवशेष उत्पन्न होते हैं। किसान कनेक्ट खेत को शीघ्र खाली करने वाले किसानों और बायोमास व रीसाइक्लेबल प्लास्टिक चाहने वाले उद्योगों के बीच की दूरी मिटाता है।",
    farm_gate_tag: "सीधा खेत-स्तर एकीकरण",
    farm_gate_title: "खेत में आग लगाने की मजबूरी से उच्च-उपज संसाधन तक।",
    farm_gate_desc: "खेत साफ करने पर पैसे खर्च करने या पराली जलाने पर भारी जुर्माने का जोखिम उठाने के बजाय, किसान केवल 2 मिनट में अपने अवशेष लिस्ट करते हैं। सत्यापित कलेक्टर सीधे खेत पर स्वचालित बेलर लाते हैं और कटाई के 48 घंटों के भीतर खेत साफ कर देते हैं।",
    baler_title: "मशीनीकृत बेलर लॉजिस्टिक्स",
    baler_desc: "धान की कटाई और गेहूं की बुवाई के बीच मजदूरों की भारी कमी को दूर करता है। कस्टम हायरिंग सेंटर और बायोमास एग्रीगेटर सीधे पंजीकृत खेतों पर ट्रैक्टर-चालित बेलर भेजते हैं।",
    baler_link: "बेलर फ्लीट नेटवर्क देखें",
    payment_title: "बिचौलिया-मुक्त सीधा भुगतान",
    payment_desc: "प्रत्येक लेनदेन को ऑन-साइट डिजिटल वजन से सत्यापित किया जाता है। बिना किसी अनुचित कमीशन कटौती के सीधे किसान के बैंक खाते में भुगतान अंतरित होता है।",
    payment_link: "वर्तमान अवशेष दरें देखें",

    // Waste Types Section
    waste_types_badge: "अवशेष मूल्य संवर्धन सूची",
    waste_types_title: "कृषि अपशिष्ट के प्रमुख प्रकार",
    waste_types_desc: "प्रत्येक कृषि उपोत्पाद का एक प्रमाणित रीसाइक्लिंग मार्ग है। हमारे क्षेत्रीय नेटवर्क में समर्थित 6 प्रमुख कृषि अपशिष्ट धाराओं को जानें।",
    browse_marketplace_link: "सभी मार्केटप्लेस लॉट ब्राउज़ करें →",

    // How It Works Section
    how_works_badge: "पारदर्शी 4-चरणीय प्रक्रिया",
    how_works_title: "किसान कनेक्ट कैसे काम करता है",
    how_works_desc: "भारतीय किसानों के लिए विशेष रूप से डिज़ाइन किया गया: सरल दृश्य चरण और शून्य तकनीकी झंझट।",
    step1_tag: "त्वरित 2 मिनट का फॉर्म",
    step1_title: "अपना कृषि अपशिष्ट लिस्ट करें",
    step1_desc: "फसल के अवशेष, मात्रा, भंडारण की स्थिति और खेत का पता एक त्वरित फोटो के साथ दर्ज करें।",
    step2_tag: "सीधा नक्शा व दर तुलना",
    step2_title: "रीसाइक्लिंग पार्टनरों से जुड़ें",
    step2_desc: "अपने पास के सत्यापित बायोमास बिजली संयंत्रों, कंपोस्ट इकाइयों और प्लास्टिक खरीदारों को खोजें।",
    step3_tag: "खेत से सीधा उठाव",
    step3_title: "निर्धारित समय पर उठाव",
    step3_desc: "पार्टनर आपकी लिस्टिंग को स्वीकृत करते हैं और सीधे आपके खेत पर स्वचालित बेलर या ट्रॉली भेजते हैं।",
    step4_tag: "शून्य धुआं व सीधी कमाई",
    step4_title: "उचित भुगतान और स्वच्छ हवा",
    step4_desc: "खेत पर डिजिटल वजन सत्यापित होता है, उठाव की पुष्टि होती है और भुगतान सीधे बैंक खाते में आता है।",
    callout_ready_title: "क्या आप अपने खेत के अवशेष को आय में बदलने के लिए तैयार हैं?",
    callout_ready_desc: "उन सैकड़ों किसानों से जुड़ें जिन्होंने पराली जलाना बंद किया और अतिरिक्त कमाई शुरू की।",
    start_free_listing: "निःशुल्क लिस्टिंग शुरू करें",

    // Benefits Section
    benefits_badge: "किसान सशक्तिकरण",
    benefits_title: "भारतीय किसानों के लिए मुख्य लाभ",
    benefits_desc: "किसान कनेक्ट को जमीनी स्तर पर खेतों की समस्याओं को हल करने और किसानों की जेब में वास्तविक आय पहुंचाने के लिए बनाया गया है।",
    benefit1_title: "गारंटीकृत अतिरिक्त आमदनी",
    benefit1_desc: "धान की पराली, गेहूं की तूड़ी और गोबर को जलाने के बजाय ₹1,500 – ₹3,500 प्रति एकड़ की सुनिश्चित आय में बदलें।",
    benefit2_title: "जुर्माने व लाल नोटिस से मुक्ति",
    benefit2_desc: "एनजीटी (NGT) और जिला प्रशासन के नियमों का 100% पालन करें, सैटेलाइट निगरानी और चालान के डर से मुक्त रहें।",
    benefit3_title: "खेत पर निःशुल्क मशीनीकृत बेलिंग",
    benefit3_desc: "पार्टनर एग्रीगेटर्स फसल कटाई के 24-48 घंटों के भीतर सीधे आपके खेत पर ट्रैक्टर-चालित बेलर मशीनें लाते हैं।",
    benefit4_title: "मिट्टी की उर्वरता का संरक्षण",
    benefit4_desc: "खेत में आग न लगाने से मित्र कीट, केंचुए और जैविक कार्बन (SOC) सुरक्षित रहते हैं, जिससे अगली गेहूं की फसल बेहतर होती है।",
    benefit5_title: "पारदर्शी डिजिटल तौल",
    benefit5_desc: "उठाव के समय प्रमाणित डिजिटल कांटे से तौल होती है जिससे बिचौलियों की अनुचित कटौती नहीं होती। सीधा बैंक भुगतान।",
    benefit6_title: "24/7 कृति एआई वॉइस सहायता",
    benefit6_desc: "नमी की मात्रा, बेलर शेड्यूल या बाजार भाव पर हिन्दी या अंग्रेजी में कभी भी हमारे कृषि वॉइस असिस्टेंट से पूछें।",
    join_thousands_title: "हजारों जागरूक किसानों से जुड़ें जो समझदारी से अवशेष प्रबंधन कर रहे हैं",
    join_thousands_desc: "अपना पहला अवशेष बैच लिस्ट करने या क्षेत्रीय पार्टनरों के भाव जांचने में 2 मिनट से भी कम समय लगता है।",
    create_farmer_acc: "किसान खाता बनाएं",

    // Impact Section
    impact_badge: "पर्यावरणीय जवाबदेही",
    impact_title: "भारतीय कृषि में मापने योग्य सकारात्मक बदलाव",
    impact_desc: "किसान कनेक्ट पर दर्ज प्रत्येक कलेक्शन को आईपीसीसी उत्सर्जन मानकों के अनुसार वैज्ञानिक रूप से सत्यापित किया जाता है।",
    conversion_cycle_title: "अपशिष्ट से मूल्य चक्र (Circular Cycle)",
    cycle1_title: "खेत स्तर पर उठाव",
    cycle1_desc: "स्वचालित बेलर मशीनें मिट्टी को जलाए बिना धान की पराली व डंठल एकत्र करती हैं।",
    cycle2_title: "औद्योगिक मूल्य संवर्धन",
    cycle2_desc: "बायोमास पैलेट्स, उच्च गुणवत्ता वाली केंचुआ खाद या रीसाइकिल्ड पाइप में रूपांतरण।",
    cycle3_title: "स्वच्छ हवा और सीधा भुगतान",
    cycle3_desc: "शून्य PM2.5 धुआं + किसान के बैंक खाते में गारंटीकृत सीधा भुगतान।",
    metric_co2_label: "बचाया गया CO₂ वायुमंडलीय उत्सर्जन",
    metric_co2_desc: "प्रति टन धान की पराली को जलाने से बचाकर 1.5 टन शुद्ध CO₂ उत्सर्जन रोकता है।",
    metric_stubble_label: "पराली जलने से बचाई गई कृषि भूमि",
    metric_stubble_desc: "पंजीकृत फार्म क्षेत्रों में शून्य आग, जिससे मिट्टी की ऊपरी जैविक परत सुरक्षित रहती है।",
    metric_waste_label: "कुल एकत्रित व पुनर्निर्देशित अवशेष",
    metric_waste_desc: "मौसमी खुले दहन से हटाकर चक्रीय औद्योगिक मूल्य श्रृंखलाओं में उपयोग।",
    metric_payout_label: "किसानों को वितरित प्रत्यक्ष भुगतान",
    metric_payout_desc: "डिजिटल वे-ब्रिज प्रमाण पत्र के साथ 100% प्रत्यक्ष बैंक जमा।",

    // Featured Partners Section
    partners_badge: "क्षेत्रीय एग्रीगेटर नेटवर्क",
    partners_title: "सत्यापित रीसाइक्लिंग पार्टनर नेटवर्क",
    partners_desc: "प्रमाणित बायोमास पेलेट संयंत्र, व्यावसायिक कंपोस्ट निर्माता और अधिकृत प्लास्टिक रीसाइक्लर्स जो खेत पर उठाव के लिए तैयार हैं।",
    explore_all_partners_link: "पार्टनर डायरेक्टरी देखें →",
    accepted_label: "स्वीकृत कृषि अवशेष",
    capacity_label: "प्रसंस्करण क्षमता",
    baling_fleet_label: "बेलर सहायता",
    request_collection_btn: "कलेक्शन का अनुरोध करें",

    // Join Network Section
    join_badge: "आज ही शुरुआत करें",
    join_title: "किसान कनेक्ट नेटवर्क से जुड़ें",
    join_desc: "चाहे आप खेती करते हों या स्वच्छ रीसाइक्लिंग प्लांट चलाते हों, आपके लिए एक समर्पित मार्ग उपलब्ध है।",
    i_am_farmer: "मैं एक किसान हूँ",
    i_am_farmer_desc: "धान की पराली, गेहूं की तूड़ी, गोबर और कृषि प्लास्टिक को जुर्माने या आग के बजाय सीधी कृषि आय में बदलें।",
    farmer_point1: "सत्यापित कलेक्टरों से निःशुल्क लिस्टिंग और त्वरित कोटेशन",
    farmer_point2: "स्वचालित बेलिंग ट्रकों द्वारा खेत से सीधा उठाव",
    farmer_point3: "24/7 कृति एआई (KRITI AI) वॉइस असिस्टेंट से हिन्दी में मार्गदर्शन",
    register_farmer_btn: "किसान के रूप में पंजीकरण करें",
    i_am_partner: "मैं एक रीसाइक्लिंग पार्टनर हूँ",
    i_am_partner_desc: "उत्तर भारत के किसान समूहों से सीधे उच्च मात्रा में मौसमी बायोमास और प्लास्टिक कच्चा माल प्राप्त करें।",
    partner_point1: "हजारों पंजीकृत कृषि लिस्टिंग तक सीधी पहुंच",
    partner_point2: "अनुकूलित रूट प्लानिंग और स्वचालित डिस्पैच उपकरण",
    partner_point3: "सत्यापित ईएसजी (ESG) और कार्बन क्रेडिट ट्रैकिंग प्रमाण पत्र",
    register_partner_btn: "रीसाइक्लिंग पार्टनर के रूप में पंजीकरण करें",

    // Footer
    footer_platform_links: "प्लेटफॉर्म लिंक्स",
    footer_waste_streams: "अपशिष्ट धाराएं",
    footer_helpline: "किसान हेल्पलाइन एवं सहायता",
    toll_free_kisan: "टोल-फ्री किसान कॉल सेंटर",
    available_hours: "उपलब्ध: सुबह 6:00 बजे – रात 10:00 बजे",
    official_support: "आधिकारिक सहायता डेस्क",
    operational_hubs: "सक्रिय परिचालन केंद्र",
    operational_hubs_val: "पंजाब, हरियाणा, उत्तर प्रदेश, गुजरात",
    zero_stubble_mission: "शून्य पराली दहन मिशन",
    safety_guidelines: "सुरक्षा दिशानिर्देश",
    designed_for_farmers: "भारतीय किसानों के हित में समर्पित।",

    // Roles & Consoles
    farmer_dashboard: "मेरा किसान डैशबोर्ड",
    partner_dashboard: "पार्टनर कंसोल",
    admin_dashboard: "एडमिन पैनल",
    farmer_console: "किसान कंसोल",
    partner_console: "रीसाइक्लिंग पार्टनर संचालन कंसोल",
    farmer_workspace: "किसान कार्यक्षेत्र",
    verified: "सत्यापित (VERIFIED)",

    // Quick Actions
    quick_actions_title: "त्वरित कार्य एवं संचालन",
    list_sell_waste: "अपशिष्ट बेचें / लिस्ट करें",
    find_collectors: "कलेक्टर खोजें",
    list_new_waste: "नया अपशिष्ट लिस्ट करें",
    list_new_waste_desc: "धान की पराली, तूड़ी, गोबर या प्लास्टिक पोस्ट करें",
    find_a_collector: "कलेक्टर खोजें",
    find_a_collector_desc: "सत्यापित बायोमास प्लांट एवं खाद निर्माता खोजें",
    track_collection: "कलेक्शन ट्रैक करें",
    track_collection_desc: "निर्धारित ट्रक की तारीख और पिकअप स्थिति देखें",
    ask_kriti_ai: "कृति एआई से पूछें",
    ask_kriti_ai_desc: "भाव, बेलर व कृषि सलाह पर त्वरित सहायता",

    // Farmer Dashboard Stats
    my_active_listings: "मेरी सक्रिय लिस्टिंग",
    waste_collected: "एकत्रित अपशिष्ट",
    completed_pickups: "पूर्ण पिकअप",
    active_pickups: "सक्रिय पिकअप",
    view_timeline: "टाइमलाइन देखें →",
    total_earnings: "कुल कमाई",
    in_progress: "प्रक्रिया में",
    acres_under_cultivation: "एकड़ खेती योग्य भूमि",
    village: "ग्राम",

    // Farmer Waste Table
    my_farm_waste_listings: "मेरी कृषि अपशिष्ट लिस्टिंग",
    my_farm_waste_desc: "स्थानीय रीसाइक्लिंग एग्रीगेटर्स को दिखाई देने वाले आपके सक्रिय अवशेष",
    add_new_waste: "+ नया अपशिष्ट जोड़ें",
    waste_item: "अपशिष्ट सामग्री",
    category: "श्रेणी",
    available_quantity: "उपलब्ध मात्रा",
    expected_rate: "अपेक्षित दर",
    status: "स्थिति",
    actions: "कार्यवाही",
    negotiable: "परस्पर विचारणीय",
    view_details: "विवरण देखें",
    delete_listing: "लिस्टिंग हटाएं",
    delete_confirm: "क्या आप वाकई इस अपशिष्ट लिस्टिंग को हटाना चाहते हैं?",
    delete_fail: "लिस्टिंग हटाने में विफलता।",
    no_waste_listed_yet: "अभी तक कोई अपशिष्ट लिस्ट नहीं है",
    no_waste_listed_desc: "पार्टनर से पिकअप कोट प्राप्त करने के लिए अपनी पराली, तूड़ी या प्लास्टिक लिस्ट करें।",
    list_first_batch: "अपना पहला लॉट लिस्ट करें",

    // Collection Requests Section
    active_collection_requests: "सक्रिय कलेक्शन अनुरोध",
    active_collection_desc: "रीसाइक्लिंग पार्टनरों से लाइव पिकअप तिथि और ट्रक शेड्यूल",
    all_orders: "सभी ऑर्डर",
    no_requests_active: "वर्तमान में कोई कलेक्शन अनुरोध सक्रिय नहीं है। पिकअप शेड्यूल करने के लिए रीसाइक्लिंग पार्टनर्स पर जाएं।",
    partner_label: "पार्टनर",
    scheduled_date: "निर्धारित तिथि",
    requested_on: "अनुरोध तिथि",
    track_timeline: "टाइमलाइन ट्रैक करें →",

    // Partner Dashboard Header & Actions
    operational_service_area: "परिचालन सेवा क्षेत्र",
    review_requests: "अनुरोधों की समीक्षा करें",
    browse_waste_lots: "अपशिष्ट लॉट ब्राउज़ करें",

    // Partner Metrics
    incoming_requests: "आने वाले अनुरोध",
    awaiting_dispatch: "डिस्पैच समीक्षा की प्रतीक्षा में",
    scheduled_pickups: "निर्धारित पिकअप",
    assigned_fleet: "वाहन पिकअप के लिए आवंटित",
    completed_collections: "पूर्ण कलेक्शन",
    processed_delivered: "संसाधित व वितरित",
    total_farmer_payouts: "किसानों को कुल भुगतान",
    direct_payments_settled: "प्रत्यक्ष भुगतान संपन्न",

    // Partner Live Feed
    open_farm_residues: "आपके सेवा क्षेत्र में उपलब्ध कृषि अवशेष",
    open_farm_residues_desc: "आपकी स्वीकृत श्रेणियों से मेल खाते क्षेत्र के किसान जो कलेक्शन चाहते हैं।",
    browse_all_listings: "सभी लिस्टिंग ब्राउज़ करें",
    no_matching_listings: "वर्तमान में आपके सेवा क्षेत्र में कोई सक्रिय खुली लिस्टिंग पोस्ट नहीं है।",
    open_quote: "कोटेशन आमंत्रित",
    view_lot: "लॉट देखें",

    // Partner Requests Table
    incoming_farmer_requests: "किसानों से प्राप्त कलेक्शन अनुरोध",
    incoming_farmer_requests_desc: "अनुरोध स्वीकार करें, डिस्पैच समय निर्धारित करें और डिलीवरी अपडेट करें",
    view_all_tracking: "ट्रैकिंग में सभी देखें →",
    no_requests_received: "अभी तक कोई कलेक्शन अनुरोध प्राप्त नहीं हुआ।",
    request_number: "अनुरोध संख्या",
    waste_lot: "अपशिष्ट लॉट",
    farmer: "किसान",
    offered_payout: "प्रस्तावित भुगतान",
    action: "कार्यवाही",
    manage_order: "ऑर्डर प्रबंधित करें",

    // Bottom Navigation (Mobile)
    dashboard: "डैशबोर्ड",
    sell_waste: "अपशिष्ट बेचें",
    collectors: "कलेक्टर",
    tracking: "ट्रैकिंग",

    // Status Badges
    status_available: "उपलब्ध (Available)",
    status_pending: "प्रतीक्षारत (Pending)",
    status_accepted: "स्वीकृत (Accepted)",
    status_scheduled: "निर्धारित (Scheduled)",
    status_in_transit: "रास्ते में (In Transit)",
    status_picked_up: "उठाया गया (Picked Up)",
    status_completed: "पूर्ण (Completed)",
    status_cancelled: "रद्द (Cancelled)",

    // Categories
    cat_paddy_straw: "धान की पराली (Paddy Straw)",
    cat_wheat_straw: "गेहूं की तूड़ी / भूसा (Wheat Straw)",
    cat_rice_husk: "धान की भूसी (Rice Husk)",
    cat_sugarcane_trash: "गन्ना अवशेष व खोई (Sugarcane)",
    cat_mustard_residue: "सरसों के अवशेष (Mustard)",
    cat_cow_dung: "पशु खाद / गोबर (Animal Manure)",
    cat_plastic_waste: "कृषि प्लास्टिक अपशिष्ट (Plastics)",
    cat_cotton_stalks: "कपास के डंठल (Cotton Stalks)",
    cat_other: "अन्य कृषि अवशेष (Other Residue)",

    // Units
    unit_quintals: "क्विंटल",
    unit_tonnes: "टन",
    unit_kg: "किलो",

    // Admin Dashboard
    admin_governance: "किसान कनेक्ट शासन एवं प्रशासन",
    platform_ops_console: "मंच संचालन कंसोल",
    admin_ops_desc: "रीसाइक्लर्स का सत्यापन, अपशिष्ट लिस्टिंग निरीक्षण और प्रमाणित पर्यावरणीय मेट्रिक्स",
    tab_approvals: "स्वीकृतियां",
    tab_manage_users: "उपयोगकर्ता प्रबंधित करें",
    tab_moderate_listings: "लिस्टिंग मॉडरेट करें",
    tab_impact_reports: "प्रभाव रिपोर्ट",
    reg_farmers: "पंजीकृत किसान",
    reg_farmers_desc: "सक्रिय कृषि उत्पादक",
    reg_partners: "रीसाइक्लिंग पार्टनर",
    pending_verification: "सत्यापन प्रतीक्षारत",
    total_listings: "कुल अपशिष्ट लिस्टिंग",
    open_on_market: "बाजार में उपलब्ध",
    verified_co2_offset: "बचाया गया CO₂ उत्सर्जन",
    clean_air_impact: "प्रमाणित स्वच्छ वायु प्रभाव",
    pending_partner_verifications: "लंबित पार्टनर सत्यापन आवेदन",
    approve_partner: "पार्टनर स्वीकृत करें",
    reject: "अस्वीकृत करें",

    // Auth (Login / Signup)
    signin_heading: "अपने खाते में साइन इन करें",
    signin_desc: "अपनी फार्म लिस्टिंग, पार्टनर ऑर्डर और कलेक्शन शेड्यूल तक पहुंचें।",
    email_label: "ईमेल पता",
    email_placeholder: "अपना ईमेल पता दर्ज करें",
    password_label: "पासवर्ड",
    password_placeholder: "अपना पासवर्ड दर्ज करें",
    signin_btn: "किसान कनेक्ट में साइन इन करें",
    no_account: "खाता नहीं है?",
    register_link: "निःशुल्क पंजीकरण करें",
    signup_heading: "अपना खाता बनाएं",
    signup_desc: "भारत के अग्रणी कृषि अपशिष्ट प्रबंधन मंच से जुड़ें।",
    role_farmer_label: "किसान / कृषि उत्पादक",
    role_partner_label: "रीसाइक्लिंग पार्टनर / उद्योग",
    fullname_label: "पूरा नाम",
    fullname_placeholder: "उदा. रमेश कुमार",
    phone_label: "मोबाइल नंबर",
    phone_placeholder: "10-अंकीय मोबाइल नंबर",
    confirm_password_label: "पासवर्ड की पुष्टि करें",
    confirm_password_placeholder: "पासवर्ड दोबारा दर्ज करें",
    already_account: "पहले से पंजीकृत हैं?",
    login_link: "साइन इन करें",

    // Partner Discovery Page
    find_partners_badge: "सत्यापित एग्रीगेटर और औद्योगिक रीसाइक्लर्स",
    find_partners_title: "रीसाइक्लिंग पार्टनर खोजें",
    find_partners_desc: "अपने जिले में प्रमाणित बायोमास संयंत्र, वर्मीकम्पोस्ट निर्माता और अधिकृत प्लास्टिक रीसाइक्लिंग केंद्र खोजें।",
    card_directory: "कार्ड सूची",
    interactive_map: "इंटरैक्टिव मैप",
    search_partner_placeholder: "पार्टनर संस्था का नाम या कीवर्ड खोजें...",
    district_filter_placeholder: "जिला (उदा. लुधियाना, करनाल, आनंद)...",
    filter_directory_btn: "फिल्टर करें",
    filter_by_material: "स्वीकृत सामग्री के अनुसार फिल्टर:",
    reset_all: "रीसेट करें",
    no_partners_found: "कोई रीसाइक्लिंग पार्टनर नहीं मिला",
    no_partners_desc: "उपलब्ध रीसाइक्लिंग पार्टनर खोजने के लिए कोई अन्य जिला या श्रेणी चुनें।",
    clear_filters: "फिल्टर हटाएं",
    list_farm_waste: "अपनी फसल का कचरा लिस्ट करें",
    districts_label: "कार्यक्षेत्र जिले",
    operating_hours_label: "कार्य समय",
    procurement_label: "खरीद दर",
    accepted_streams: "स्वीकृत अपशिष्ट:",
    view_facility: "सुविधा विवरण",
    request_pickup: "पिकअप अनुरोध करें",
    searching_partners: "सत्यापित रीसाइक्लिंग पार्टनर्स खोजे जा रहे हैं...",

    // Auth Visuals & Actions
    visual_badge: "एआई-संचालित एग्रीटेक प्लेटफॉर्म",
    visual_heading: "कृषि अपशिष्ट को बनाएं नए आर्थिक अवसर।",
    visual_desc_login: "भारत भर में प्रमाणित बायोमास बिजली उत्पादकों, वर्मीकम्पोस्ट निर्माताओं और अधिकृत प्लास्टिक रीसाइक्लर्स से सीधे जुड़ें।",
    visual_feature_1: "समय पर स्वचालित बेलर उठाव के साथ शून्य पराली दहन जुर्माना",
    visual_feature_2: "प्रत्यक्ष डिजिटल वजन सत्यापन और त्वरित सीधा बैंक भुगतान",
    visual_feature_3: "पंजाब, हरियाणा, उत्तर प्रदेश व गुजरात भर में 100% सत्यापित खरीदार",
    instant_demo_login: "1-क्लिक त्वरित डेमो लॉगिन",
    auto_fill: "स्वतः भरें",
    role_farmer: "किसान",
    role_partner: "रीसाइक्लिंग पार्टनर",
    role_admin: "सरकारी व्यवस्थापक",
    role_admin_sub: "प्लेटफॉर्म व्यवस्थापक",
    signin_to_platform: "मंच पर साइन इन करें",
    authenticating: "प्रमाणीकरण हो रहा है...",
    dont_have_account: "क्या आपका अभी तक कोई खाता नहीं है?",
    join_kisan_connect: "किसान कनेक्ट से जुड़ें →",
    create_account: "अपना खाता बनाएं",
    select_role_desc: "अनुकूलित सुविधाएं पाने के लिए अपनी भूमिका चुनें।",
    i_am_farmer_btn: "मैं एक किसान हूँ",
    partner_btn: "रीसाइक्लिंग पार्टनर",
    farm_size_acres: "खेत का आकार (एकड़)",
    primary_crops: "प्रमुख फसलें",
    village_tehsil: "गाँव / तहसील",
    district: "जिला",
    state: "राज्य",
    business_name: "व्यवसाय / संस्था का नाम",
    business_type: "व्यवसाय का प्रकार",
    service_districts: "सेवा जिले / दायरा",
    min_pickup_batch: "न्यूनतम पिकअप बैच (क्विंटल)",
    register_as: "पंजीकरण करें बतौर",
    already_registered_link: "साइन इन करें →",

    // About Us Page
    about_badge: "टीम क्लोवर गार्जियन पहल",
    about_title: "खेत के अपशिष्ट को बनाएं मूल्यवान संसाधन।",
    about_desc: "किसान कनेक्ट एक एकीकृत सर्कुलर कृषि मंच है, जिसे पराली दहन को समाप्त करने, भारतीय किसानों को अतिरिक्त आय प्रदान करने और स्वच्छ ऊर्जा उद्योगों को प्रमाणित बायोमास उपलब्ध कराने के लिए तैयार किया गया है।",
    about_explore_btn: "अपशिष्ट मार्केटप्लेस देखें",
    about_partners_btn: "रीसाइक्लिंग पार्टनर्स से मिलें",
    milestone_challenge_title: "चुनौती",
    milestone_challenge_desc: "भारत में प्रतिवर्ष 50 करोड़ टन से अधिक फसल अवशेष उत्पन्न होते हैं। खरीफ और रबी फसलों के बीच कम समय के कारण पराली जलाने की मजबूरी और प्रदूषण होता है।",
    milestone_innovation_title: "समाधान एवं नवाचार",
    milestone_innovation_desc: "किसान कनेक्ट किसानों को आधुनिक बेलर ऑपरेटरों, बायोमास ईंधन संयंत्रों, वर्मीकम्पोस्ट निर्माताओं और प्लास्टिक रीसाइक्लर्स से जोड़ता है।",
    milestone_impact_title: "मापने योग्य प्रभाव",
    milestone_impact_desc: "खेतों में शून्य दहन, प्रमाणित कार्बन क्रेडिट, उचित खेत-स्तर मूल्य और बिना बिचौलियों के उद्योगों को कच्चा माल।",
    team_heading: "मिलिए टीम क्लोवर गार्जियन से",
    team_desc: "भारतीय कृषि, स्वच्छ हवा और सतत विकास के प्रति समर्पित टीम द्वारा विकसित।",
    prakhar_role: "फुल-स्टैक वास्तुकला एवं एग्रीटेक सिस्टम",
    prakhar_focus: "अपशिष्ट मार्केटप्लेस एवं पार्टनर नेटवर्क लॉजिस्टिक्स",
    ayush_role: "यूआई/यूएक्स डिज़ाइन एवं फ्रंटएंड इंजीनियरिंग",
    ayush_focus: "सरल किसान इंटरफेस एवं विजुअल डिजाइन",
    raj_role: "बैकएंड एपीआई एवं डेटाबेस वास्तुकला",
    raj_focus: "रोल-आधारित प्रमाणीकरण एवं ऑर्डर इंजन",
    aniket_role: "एआई सहायक एवं पर्यावरणीय प्रभाव मॉडलिंग",
    aniket_focus: "बहुभाषी कृति एआई एवं कार्बन सत्यापन",

    // Recycling Guide Page
    guide_badge: "कृषि ज्ञान केंद्र",
    guide_title: "रीसाइक्लिंग एवं कृषि अपशिष्ट मूल्य संवर्धन मार्गदर्शिका",
    guide_desc: "फसल अवशेष, भूसा, गोबर और कृषि प्लास्टिक को खुले में जलाने के बजाय आय में बदलने के वैज्ञानिक और व्यावहारिक तरीके।",
    tab_practical_guides: "व्यावहारिक रीसाइक्लिंग मार्गदर्शिका",
    tab_waste_directory: "अपशिष्ट वर्गीकरण निर्देशिका",
    six_core_streams: "छह प्रमुख कृषि अपशिष्ट धाराएं",
    loading_guides: "रीसाइक्लिंग मार्गदर्शिका लोड हो रही है...",
    recommended_valorization: "अनुशंसित उपयोग:",

    // AI Assistant Page
    ai_page_badge: "कृति एआई • स्मार्ट कृषि सहायक",
    ai_page_title: "किसानों के लिए टू-वे वॉयस एवं चैट एआई",
    ai_page_desc: "पराली प्रबंधन, वर्मीकंपोस्टिंग, बायोमास दरों, सरकारी योजनाओं और मंच उपयोग पर प्रश्न पूछें। माइक से बोलें या टाइप करें।",
    languages_label: "भाषाएं",
    languages_val: "हिन्दी • English • हिंग्लिश",
    voice_mode_label: "वॉयस मोड",
    voice_mode_val: "स्वचालित टू-वे",
    how_voice_works: "वॉयस असिस्टेंट कैसे काम करता है",
    voice_step1_strong: "माइक से बोलें:",
    voice_step1_desc: "कृति एआई आपके शब्दों को पहचानकर पूरा उत्तर बोलकर सुनाती है।",
    voice_step2_strong: "प्रश्न टाइप करें:",
    voice_step2_desc: "कृति एआई लिखित उत्तर देती है, जिसे स्पीकर बटन दबाकर सुना जा सकता है।",
    voice_step3_strong: "फोटो पहचान:",
    voice_step3_desc: "खेत के अवशेष की पहचान और समाधान के लिए कैमरा बटन से फोटो अपलोड करें।",
    direct_actions: "त्वरित मंच क्रियाएं",
    action_list_waste: "+ मार्केटप्लेस पर अपशिष्ट लिस्ट करें →",
    action_find_partners: "सत्यापित रीसाइक्लिंग पार्टनर खोजें →",
    action_education: "वैज्ञानिक कंपोस्ट एवं बेलर मार्गदर्शिका →"
  }
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key,
  translateCategory: (name) => name,
  translateStatus: (status) => status
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kc_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kc_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key, fallback) => {
    if (translations[language] && translations[language][key] !== undefined) {
      return translations[language][key];
    }
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  const translateCategory = (catName) => {
    if (!catName) return catName;
    const lower = catName.toLowerCase();
    const isHi = language === 'hi';

    if (lower.includes('paddy') || lower.includes('straw') || lower.includes('पराली') || lower.includes('crop_residue') || lower.includes('residue')) {
      return isHi ? translations.hi.cat_paddy_straw : translations.en.cat_paddy_straw;
    }
    if (lower.includes('wheat') || lower.includes('turi') || lower.includes('bhusa') || lower.includes('तूड़ी') || lower.includes('भूसा') || lower.includes('straw_husk')) {
      return isHi ? translations.hi.cat_wheat_straw : translations.en.cat_wheat_straw;
    }
    if (lower.includes('rice husk') || lower.includes('छिलका') || lower.includes('भूसी')) {
      return isHi ? translations.hi.cat_rice_husk : translations.en.cat_rice_husk;
    }
    if (lower.includes('sugarcane') || lower.includes('bagasse') || lower.includes('गन्ने') || lower.includes('खोई')) {
      return isHi ? translations.hi.cat_sugarcane_trash : translations.en.cat_sugarcane_trash;
    }
    if (lower.includes('mustard') || lower.includes('सरसों')) {
      return isHi ? translations.hi.cat_mustard_residue : translations.en.cat_mustard_residue;
    }
    if (lower.includes('dung') || lower.includes('manure') || lower.includes('gobar') || lower.includes('गोबर') || lower.includes('पशु') || lower.includes('animal_manure')) {
      return isHi ? translations.hi.cat_cow_dung : translations.en.cat_cow_dung;
    }
    if (lower.includes('plastic') || lower.includes('mulch') || lower.includes('drip') || lower.includes('प्लास्टिक') || lower.includes('agricultural_plastic')) {
      return isHi ? translations.hi.cat_plastic_waste : translations.en.cat_plastic_waste;
    }
    if (lower.includes('cotton') || lower.includes('कपास')) {
      return isHi ? translations.hi.cat_cotton_stalks : translations.en.cat_cotton_stalks;
    }
    if (lower.includes('organic') || lower.includes('जैविक') || lower.includes('organic_waste')) {
      return isHi ? "जैविक कृषि अपशिष्ट" : "Organic Farm Waste";
    }
    return catName;
  };

  const translateStatus = (status) => {
    if (!status) return status;
    const isHi = language === 'hi';
    const s = String(status).toLowerCase().trim();

    if (s.includes('available') || s.includes('उपलब्ध')) {
      return isHi ? translations.hi.status_available : translations.en.status_available;
    }
    if (s.includes('pending') || s.includes('लंबित') || s.includes('प्रतीक्षारत')) {
      return isHi ? translations.hi.status_pending : translations.en.status_pending;
    }
    if (s.includes('accepted') || s.includes('स्वीकृत')) {
      return isHi ? translations.hi.status_accepted : translations.en.status_accepted;
    }
    if (s.includes('scheduled') || s.includes('शेड्यूल') || s.includes('निर्धारित')) {
      return isHi ? translations.hi.status_scheduled : translations.en.status_scheduled;
    }
    if (s.includes('transit') || s.includes('मार्ग')) {
      return isHi ? translations.hi.status_in_transit : translations.en.status_in_transit;
    }
    if (s.includes('picked') || s.includes('उठाया')) {
      return isHi ? translations.hi.status_picked_up : translations.en.status_picked_up;
    }
    if (s.includes('completed') || s.includes('पूर्ण')) {
      return isHi ? translations.hi.status_completed : translations.en.status_completed;
    }
    if (s.includes('cancelled') || s.includes('रद्द')) {
      return isHi ? translations.hi.status_cancelled : translations.en.status_cancelled;
    }

    const key = `status_${s.replace(/[\s-]/g, '_')}`;
    if (isHi) {
      return translations.hi[key] || status;
    }
    return translations.en[key] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      translateCategory,
      translateStatus
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
