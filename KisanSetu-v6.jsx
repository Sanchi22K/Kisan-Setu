import React, { useState, useMemo, useEffect } from "react";
import {
  Sun, Moon, Globe, ShoppingCart, MapPin, Shield, Truck, Star, Store, Search,
  ArrowRight, ArrowLeft, Sparkles, Route, CheckCircle2, AlertTriangle, Plus, Minus,
  Trash2, Lock, Scale, Boxes, Menu, X, Clock, TrendingUp, Wallet, PackageCheck,
  Users, Leaf, Check, IndianRupee, Delete, Pause, Play, Monitor, Smartphone, LayoutGrid,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, Cell,
} from "recharts";

/* ────────────────────────────────────────────────────────────
   KISAN SETU v6 (SIH26033)
   Ministry of Consumer Affairs, Food & Public Distribution
   Three roles, two shells. All data on this screen is sample data.
   ──────────────────────────────────────────────────────────── */

/* Add to index.html for the intended faces:
   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
   Everything degrades to a decent stack without it. */
const FD = `"Playfair Display","Tiro Devanagari Hindi",Georgia,"Noto Serif Devanagari",serif`;
const FB = `Inter,system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Devanagari",sans-serif`;

/* Materials, not a colour ramp: jute paper, crate wood, slate, field, grain,
   lorry red. Dark mode is the same yard under a lamp, not an inversion. */
const PALETTE = {
  light: {
    bg: "#FAF6F0", surface: "#FFFFFF", raise: "#FDF3E9", peach: "#FCE9D6",
    ink: "#2C2D3F", muted: "#6E6B7B", line: "#EADFD2",
    green: "#2E6F4E", greenDeep: "#1F4E37", greenSoft: "#E3EFE7", greenTop: "#3E8A62",
    gold: "#C9821A", goldBright: "#F5A623", goldSoft: "#FCEBD0",
    red: "#E2603A", redSoft: "#FFE7DE", coral: "#FF7F50",
    violet: "#5A51E0", violetSoft: "#EAE8FF",
    wood: "#C98B4B", woodDark: "#9A6430", woodLit: "#DDA76A",
    slate: "#2C2D3F", chalk: "#FAF6F0", cast: "rgba(125,92,56,.24)",
    slab: ["#E3CDB6", "#D8BCA3", "#CBAB91", "#BE9B80"],
    slabTop: ["#F0DFCE", "#E7D0BC", "#DCC2AB", "#D0B39A"],
  },
  dark: {
    bg: "#1A1512", surface: "#241D18", raise: "#2C2420", peach: "#3A2A1D",
    ink: "#F3EAE0", muted: "#A3968A", line: "#3A2F27",
    green: "#5FB086", greenDeep: "#3E8A62", greenSoft: "#1E2A23", greenTop: "#6FC49A",
    gold: "#F5A623", goldBright: "#F5A623", goldSoft: "#332610",
    red: "#FF9670", redSoft: "#3A2119", coral: "#FF9670",
    violet: "#9A94FF", violetSoft: "#232145",
    wood: "#8A5E33", woodDark: "#5F3F22", woodLit: "#A87944",
    slate: "#15110E", chalk: "#EFE3D4", cast: "rgba(0,0,0,.6)",
    slab: ["#4E3E30", "#473929", "#403322", "#392D1E"],
    slabTop: ["#61503F", "#584737", "#4F402F", "#463928"],
  },
};

/* ── language ──────────────────────────────────────────────── */
const S = {
  brand: ["Kisan Setu", "किसान सेतु"],
  demo_note: ["Sample data. Built for SIH 2026, problem SIH26033.", "नमूना डेटा। SIH 2026, समस्या SIH26033 के लिए बनाया गया।"],
  /* role gate */
  gate_h: ["Who is using the phone?", "फ़ोन कौन चला रहा है?"],
  gate_p: ["Pick one and the app changes. A farmer sees earnings and pickups. A buyer sees the market.",
           "एक चुनिए, ऐप बदल जाएगा। किसान को कमाई और पिकअप दिखेंगे। खरीदार को बाज़ार।"],
  gate_farmer: ["I am a farmer", "मैं किसान हूँ"],
  gate_farmer_s: ["I grow and want to sell", "मैं उगाता हूँ और बेचना चाहता हूँ"],
  gate_buyer: ["I am a buyer", "मैं खरीदार हूँ"],
  gate_buyer_s: ["I cook for my family", "मैं अपने घर के लिए लेता हूँ"],
  gate_shop: ["I am a shopkeeper", "मैं दुकानदार हूँ"],
  gate_shop_s: ["I buy in bulk to resell", "मैं थोक में लेकर बेचता हूँ"],
  switch_role: ["Change", "बदलें"],
  /* nav */
  nav_f_home: ["Today", "आज"],
  nav_f_produce: ["My produce", "मेरी उपज"],
  nav_f_orders: ["Orders", "ऑर्डर"],
  nav_f_earn: ["Earnings", "कमाई"],
  nav_b_home: ["Home", "घर"],
  nav_b_market: ["Market", "बाज़ार"],
  nav_b_mandi: ["Mandi rates", "मंडी भाव"],
  nav_b_orders: ["My orders", "मेरे ऑर्डर"],
  /* farmer home */
  earned_today: ["Earned today", "आज की कमाई"],
  three_orders: ["orders", "ऑर्डर"],
  money_waiting: ["Waiting for delivery", "डिलीवरी का इंतज़ार"],
  money_in_hand: ["Already in your account", "आपके खाते में आ चुका"],
  pickup_today: ["Van comes tomorrow morning", "गाड़ी कल सुबह आएगी"],
  add_crop: ["Add a crop to sell", "बेचने के लिए फ़सल जोड़ें"],
  see_all: ["See all", "सब देखें"],
  todays_mandi: ["Today in the mandi", "आज मंडी में"],
  you_get_here: ["You get here", "यहाँ आपको मिलेगा"],
  /* add crop flow */
  step1: ["Which crop?", "कौन सी फ़सल?"],
  step2: ["How much, and at what rate?", "कितना, और किस भाव?"],
  step3: ["Check once, then confirm", "एक बार देख लीजिए, फिर पक्का कीजिए"],
  how_much: ["Quantity you have", "आपके पास कितना है"],
  your_rate: ["Your rate per", "आपका भाव प्रति"],
  mandi_says: ["Mandi rate today", "आज मंडी का भाव"],
  will_earn: ["If it all sells you get", "सब बिक गया तो मिलेंगे"],
  next: ["Next", "आगे"],
  back_b: ["Back", "पीछे"],
  confirm: ["Put it on sale", "बिक्री पर लगाइए"],
  live_now: ["It is on sale now", "अब यह बिक्री पर है"],
  add_another: ["Add one more", "एक और जोड़ें"],
  /* farmer produce */
  on_sale: ["On sale", "बिक्री पर"],
  paused: ["Paused", "रोका हुआ"],
  left_word: ["left", "बचा"],
  /* earnings */
  earn_h: ["What you earned", "आपने क्या कमाया"],
  sold_word: ["Sold", "बेचा"],
  spent_word: ["Spent", "ख़र्च"],
  kept_word: ["Kept", "बचा"],
  per_unit_got: ["You got per kg", "हर किलो पर मिला"],
  mandi_would: ["mandi would have left you", "मंडी में हाथ आता"],
  day: ["Day", "दिन"], week: ["Week", "हफ़्ता"], month: ["Month", "महीना"], year: ["Year", "साल"],
  chart_month_h: ["Month by month", "महीने-दर-महीने"],
  chart_crop_h: ["Which crop paid best", "किस फ़सल ने सबसे ज़्यादा दिया"],
  demand_h: ["What people will want", "लोग आगे क्या माँगेंगे"],
  route_h: ["Tomorrow's van route", "कल गाड़ी का रास्ता"],
  /* buyer market */
  loc: ["Delivering to", "डिलीवरी यहाँ"],
  search_ph: ["Search tomato, wheat, milk…", "टमाटर, गेहूँ, दूध खोजें…"],
  all: ["All", "सभी"],
  within: ["Within", "के भीतर"],
  sort_near: ["Nearest first", "निकटतम पहले"],
  sort_save: ["Biggest saving", "सबसे ज़्यादा बचत"],
  sort_price: ["Lowest price", "सबसे कम दाम"],
  km_away: ["km away", "किमी दूर"],
  add: ["Add", "जोड़ें"],
  in_cart: ["In cart", "कार्ट में"],
  visit_store: ["Visit farm store", "खेत की दुकान देखें"],
  harvested: ["Harvested", "कटाई"],
  stock_left: ["left", "बचा"],
  market_ref: ["Mandi reference price", "मंडी संदर्भ मूल्य"],
  price_journey: ["Where your money goes", "आपका पैसा कहाँ जाता है"],
  qty: ["Quantity", "मात्रा"],
  consumer_cap: ["Household limit: 25 units per order", "घरेलू सीमा: प्रति ऑर्डर 25 यूनिट"],
  retail_min: ["Bulk orders start at 50 units, 7% trade discount applied", "थोक ऑर्डर 50 यूनिट से शुरू, 7% व्यापार छूट"],
  more_from: ["More from this farm", "इसी खेत से और"],
  verified: ["Verified farm", "सत्यापित खेत"],
  since: ["Selling since", "बिक्री शुरू"],
  orders_done: ["orders delivered", "ऑर्डर पूरे"],
  /* price chain */
  farmer_gets: ["Farmer", "किसान"],
  aggregator: ["Village aggregator", "गाँव का बिचौलिया"],
  commission: ["Mandi commission agent", "मंडी आढ़तिया"],
  wholesaler: ["Wholesaler", "थोक विक्रेता"],
  retailer_cut: ["Retailer", "खुदरा दुकान"],
  /* cart, orders */
  cart: ["Cart", "कार्ट"],
  cart_empty_h: ["Nothing in the cart yet", "कार्ट अभी खाली है"],
  cart_empty_p: ["Pick a farm near you and add what you need this week.", "पास का खेत चुनें और इस हफ़्ते की ज़रूरत जोड़ें।"],
  subtotal: ["Produce subtotal", "उपज उप-योग"],
  platform_fee: ["Platform fee", "प्लेटफ़ॉर्म शुल्क"],
  your_half: ["Your half of transport", "ढुलाई का आपका आधा"],
  farmer_half: ["Farmer's half of transport", "ढुलाई का किसान का आधा"],
  transport: ["Transport", "ढुलाई"],
  total: ["Total payable", "कुल देय"],
  place: ["Pay into the box", "पैसा बक्से में रखें"],
  you_pay: ["You pay", "आप देते हैं"],
  you_save: ["You save", "आपकी बचत"],
  escrow_h: ["The money sits in a locked box", "पैसा बंद बक्से में रहता है"],
  escrow_p: ["Kisan Setu holds it. The lid opens and the farmer is paid only after you confirm delivery.",
             "किसान सेतु उसे रोककर रखता है। डिलीवरी की पुष्टि पर ही ढक्कन खुलता है और किसान को भुगतान होता है।"],
  orders_empty: ["No orders yet", "अभी कोई ऑर्डर नहीं"],
  order: ["Order", "ऑर्डर"],
  advance: ["Advance demo status", "डेमो स्थिति आगे बढ़ाएँ"],
  st_placed: ["Order placed", "ऑर्डर हुआ"],
  st_held: ["Money in the box", "पैसा बक्से में"],
  st_picked: ["Picked up", "उठा लिया"],
  st_transit: ["On the way", "रास्ते में"],
  st_delivered: ["Delivered", "पहुँच गया"],
  st_released: ["Farmer paid", "किसान को भुगतान"],
  held: ["Locked", "बंद"],
  released: ["Paid out", "जारी"],
  transit_loss: ["Transit loss protection", "परिवहन हानि सुरक्षा"],
  picked_qty: ["Weighed at pickup", "उठाते समय तौल"],
  del_qty: ["Weighed at delivery", "पहुँचने पर तौल"],
  loss_covered: ["shortfall verified and paid from the protection fund. The farmer's payout is untouched.",
                 "की कमी सत्यापित हुई और सुरक्षा कोष से भरी गई। किसान की कमाई से कुछ नहीं कटा।"],
  rate_farmer: ["Rate this farmer", "किसान को रेटिंग दें"],
  rate_buyer: ["Rate this buyer", "खरीदार को रेटिंग दें"],
  rated: ["Rating recorded", "रेटिंग दर्ज"],
  /* mandi */
  mandi_board_h: ["Today's mandi board", "आज का मंडी बोर्ड"],
  saved: ["saved", "बचाया"],
  hero_a: ["Tomatoes at ₹18 a kilo.", "टमाटर ₹18 किलो।"],
  hero_b: ["The farm keeps all of it.", "पूरा पैसा खेत को।"],
  hero_p: ["Buy straight from the farm down the road. A fair price for the person who grew it, a better one for you.",
           "पास के खेत से सीधा ख़रीदिए। उगाने वाले को सही दाम, और आपको उससे भी बेहतर।"],
  cta_shop: ["Start shopping", "ख़रीदारी शुरू करें"],
  cta_how: ["See how it works", "यह कैसे चलता है"],
  trust_1: ["Straight from the farm", "सीधे खेत से"],
  trust_1s: ["No middlemen in between", "बीच में कोई बिचौलिया नहीं"],
  trust_2: ["A fair rate", "सही भाव"],
  trust_2s: ["Better for both sides", "दोनों के लिए बेहतर"],
  trust_3: ["Picked this week", "इसी हफ़्ते की कटाई"],
  trust_3s: ["Weighed at both ends", "दोनों सिरों पर तौल"],
  trust_4: ["Open pricing", "खुला हिसाब"],
  trust_4s: ["See every rupee", "हर रुपया दिखेगा"],
  how_h: ["How Kisan Setu works", "किसान सेतु कैसे काम करता है"],
  how_p: ["Four steps, and both sides can see all of them.", "चार क़दम, और दोनों पक्ष चारों देख सकते हैं।"],
  how_1: ["The farmer lists", "किसान सूची बनाता है"],
  how_1s: ["Own farm name, own rate, no commission agent.", "अपने खेत का नाम, अपना भाव, कोई आढ़तिया नहीं।"],
  how_2: ["You pick a farm nearby", "आप पास का खेत चुनते हैं"],
  how_2s: ["Sorted by distance, so the crate travels less.", "दूरी से क्रम, ताकि सामान कम चले।"],
  how_3: ["One van, many drops", "एक गाड़ी, कई जगह"],
  how_3s: ["Transport split evenly and shown to both.", "ढुलाई आधी-आधी और दोनों को दिखती है।"],
  how_4: ["The farmer is paid", "किसान को भुगतान"],
  how_4s: ["The box opens the moment you confirm delivery.", "डिलीवरी की पुष्टि पर बक्सा खुलता है।"],
  compare_h: ["The same 5 kg of basmati", "वही 5 किलो बासमती"],
  direct_from: ["Straight from the farm", "सीधे खेत से"],
  with_middle: ["Through middlemen", "बिचौलियों से होकर"],
  retail_avg: ["Shop shelf price", "दुकान का दाम"],
  farmer_more: ["Farmer earns more, you pay less", "किसान को ज़्यादा, आपको कम"],
  nearby_farms: ["Farms near you", "आपके पास के खेत"],
  categories: ["What are you looking for", "आप क्या ढूँढ रहे हैं"],
  see_all_b: ["See all", "सब देखें"],
  namaste: ["Namaste", "नमस्ते"],
  back: ["Back", "वापस"],
};

const FARMERS = [
  { id: "f1", name: ["Ramesh Kumar", "रमेश कुमार"], store: ["Ramesh Organic Farm", "रमेश ऑर्गैनिक फ़ार्म"], place: ["Loni, Ghaziabad", "लोनी, ग़ाज़ियाबाद"], km: 6.2, rating: 4.8, orders: 312, since: 2019, verified: true, bio: ["Third-generation vegetable grower. No chemical spray since 2021, drip irrigation on all four acres.", "तीसरी पीढ़ी के सब्ज़ी उत्पादक। 2021 से कोई रासायनिक छिड़काव नहीं, चारों एकड़ पर ड्रिप सिंचाई।"] },
  { id: "f2", name: ["Sunita Devi", "सुनीता देवी"], store: ["Sunita Kisan Bhandar", "सुनीता किसान भंडार"], place: ["Modinagar, Ghaziabad", "मोदीनगर, ग़ाज़ियाबाद"], km: 12.4, rating: 4.6, orders: 208, since: 2021, verified: true, bio: ["Runs a six-woman farming group. Wheat in rabi, vegetables the rest of the year.", "छह महिलाओं का खेती समूह चलाती हैं। रबी में गेहूँ, बाक़ी साल सब्ज़ियाँ।"] },
  { id: "f3", name: ["Harpal Singh", "हरपाल सिंह"], store: ["Harpal Green Fields", "हरपाल ग्रीन फ़ील्ड्स"], place: ["Muradnagar, Ghaziabad", "मुरादनगर, ग़ाज़ियाबाद"], km: 18.9, rating: 4.9, orders: 465, since: 2018, verified: true, bio: ["Basmati and orchard fruit. Cold room on site, so mangoes ship the same day they are picked.", "बासमती और बाग़ के फल। खेत पर कोल्ड रूम, इसलिए आम उसी दिन भेजे जाते हैं।"] },
  { id: "f4", name: ["Anita Yadav", "अनीता यादव"], store: ["Yadav Sabzi Farm", "यादव सब्ज़ी फ़ार्म"], place: ["Hapur", "हापुड़"], km: 27.5, rating: 4.4, orders: 141, since: 2022, verified: false, bio: ["Two acres of okra, chilli and banana. Sells to hotels and households alike.", "दो एकड़ में भिंडी, मिर्च और केला। होटल और घरों दोनों को बेचती हैं।"] },
  { id: "f5", name: ["Mohan Lal", "मोहन लाल"], store: ["Mohan Dairy & Grains", "मोहन डेयरी एंड ग्रेन्स"], place: ["Baghpat", "बाग़पत"], km: 34.1, rating: 4.7, orders: 389, since: 2017, verified: true, bio: ["Eighteen Sahiwal cows and twelve acres of bajra. Milk leaves the shed at 4am.", "अठारह साहीवाल गायें और बारह एकड़ बाजरा। दूध सुबह चार बजे निकलता है।"] },
  { id: "f6", name: ["Kavita Sharma", "कविता शर्मा"], store: ["Sharma Organic Roots", "शर्मा ऑर्गैनिक रूट्स"], place: ["Meerut", "मेरठ"], km: 41.3, rating: 4.5, orders: 176, since: 2020, verified: true, bio: ["Turmeric, pulses and amla grown without synthetic fertiliser. Certified organic since 2023.", "बिना रासायनिक खाद की हल्दी, दालें और आँवला। 2023 से प्रमाणित जैविक।"] },
];

const CATS = [
  { id: "veg", label: ["Vegetables", "सब्ज़ियाँ"] },
  { id: "fruit", label: ["Fruits", "फल"] },
  { id: "grain", label: ["Grains", "अनाज"] },
  { id: "pulse", label: ["Pulses", "दालें"] },
  { id: "dairy", label: ["Dairy", "डेयरी"] },
  { id: "spice", label: ["Spices", "मसाले"] },
];

const P = (id, fid, en, hi, cat, unit, unitHi, farmer, mandi, retail, stock, harvest, organic) =>
  ({ id, fid, name: [en, hi], cat, unit: [unit, unitHi], farmer, mandi, retail, stock, harvest, organic });

const PRODUCTS = [
  P("p1", "f1", "Tomato", "टमाटर", "veg", "kg", "किलो", 18, 27, 44, 420, 2, true),
  P("p2", "f1", "Onion", "प्याज़", "veg", "kg", "किलो", 22, 31, 48, 860, 5, false),
  P("p3", "f1", "Spinach", "पालक", "veg", "bunch", "गड्डी", 12, 18, 30, 190, 1, true),
  P("p4", "f2", "Potato", "आलू", "veg", "kg", "किलो", 14, 21, 34, 1240, 6, false),
  P("p5", "f2", "Cauliflower", "फूलगोभी", "veg", "kg", "किलो", 20, 30, 50, 310, 2, false),
  P("p6", "f2", "Wheat", "गेहूँ", "grain", "kg", "किलो", 24, 29, 41, 3400, 21, false),
  P("p7", "f3", "Basmati rice", "बासमती चावल", "grain", "kg", "किलो", 62, 78, 112, 1800, 30, false),
  P("p8", "f3", "Mango", "आम", "fruit", "kg", "किलो", 45, 68, 120, 540, 1, true),
  P("p9", "f3", "Guava", "अमरूद", "fruit", "kg", "किलो", 30, 45, 80, 260, 3, false),
  P("p10", "f4", "Okra", "भिंडी", "veg", "kg", "किलो", 26, 38, 62, 220, 1, false),
  P("p11", "f4", "Green chilli", "हरी मिर्च", "spice", "kg", "किलो", 34, 50, 85, 130, 2, true),
  P("p12", "f4", "Banana", "केला", "fruit", "dozen", "दर्जन", 32, 45, 70, 400, 2, false),
  P("p13", "f5", "Cow milk", "गाय का दूध", "dairy", "litre", "लीटर", 42, 50, 64, 300, 0, false),
  P("p14", "f5", "Desi ghee", "देसी घी", "dairy", "500 ml", "500 मि.ली.", 520, 640, 850, 46, 4, false),
  P("p15", "f5", "Bajra", "बाजरा", "grain", "kg", "किलो", 21, 27, 38, 2100, 25, false),
  P("p16", "f6", "Turmeric", "हल्दी", "spice", "kg", "किलो", 78, 105, 165, 180, 40, true),
  P("p17", "f6", "Chana dal", "चना दाल", "pulse", "kg", "किलो", 68, 85, 118, 640, 35, false),
  P("p18", "f6", "Amla", "आँवला", "fruit", "kg", "किलो", 40, 58, 95, 210, 4, true),
];

const MONTHLY = [
  { m: ["Apr", "अप्रै"], rev: 41200, exp: 16800 }, { m: ["May", "मई"], rev: 58400, exp: 21300 },
  { m: ["Jun", "जून"], rev: 72900, exp: 24100 }, { m: ["Jul", "जुल"], rev: 51600, exp: 22400 },
  { m: ["Aug", "अग"], rev: 63800, exp: 23900 }, { m: ["Sep", "सित"], rev: 78200, exp: 26100 },
  { m: ["Oct", "अक्तू"], rev: 91500, exp: 29800 }, { m: ["Nov", "नव"], rev: 84300, exp: 27600 },
  { m: ["Dec", "दिस"], rev: 96700, exp: 31200 }, { m: ["Jan", "जन"], rev: 88100, exp: 28900 },
  { m: ["Feb", "फ़र"], rev: 79400, exp: 26300 }, { m: ["Mar", "मार्च"], rev: 102800, exp: 33400 },
].map(x => ({ ...x, profit: x.rev - x.exp }));

const CROP_PROFIT = [
  { c: ["Tomato", "टमाटर"], p: 38400 }, { c: ["Onion", "प्याज़"], p: 31200 },
  { c: ["Spinach", "पालक"], p: 12600 }, { c: ["Cauliflower", "फूलगोभी"], p: 21800 },
  { c: ["Okra", "भिंडी"], p: 17300 },
];

const FORECAST = [
  { w: ["Wk 1", "सप्ताह 1"], tomato: 62, onion: 48, leafy: 30 },
  { w: ["Wk 2", "सप्ताह 2"], tomato: 71, onion: 46, leafy: 34 },
  { w: ["Wk 3", "सप्ताह 3"], tomato: 84, onion: 51, leafy: 41 },
  { w: ["Wk 4", "सप्ताह 4"], tomato: 96, onion: 58, leafy: 39 },
  { w: ["Wk 5", "सप्ताह 5"], tomato: 88, onion: 67, leafy: 46 },
  { w: ["Wk 6", "सप्ताह 6"], tomato: 79, onion: 74, leafy: 52 },
];

const ROUTE_STOPS = [
  { n: ["Ramesh Organic Farm", "रमेश ऑर्गैनिक फ़ार्म"], t: "06:10", km: 0, x: 8, y: 78 },
  { n: ["Sector 62, Noida", "सेक्टर 62, नोएडा"], t: "07:05", km: 14.2, x: 32, y: 34 },
  { n: ["Vaishali, Ghaziabad", "वैशाली, ग़ाज़ियाबाद"], t: "07:48", km: 9.6, x: 55, y: 62 },
  { n: ["Indirapuram", "इंदिरापुरम"], t: "08:20", km: 5.1, x: 74, y: 28 },
  { n: ["Kaushambi hub", "कौशाम्बी हब"], t: "08:55", km: 6.4, x: 93, y: 66 },
];

/* ── mandi reference rates (shape mirrors Agmarknet daily feed) ── */
const MANDI = [
  { pid: "p1", centre: ["Ghaziabad", "ग़ाज़ियाबाद"], arrivals: 42.5, trend: [24, 25, 23, 26, 28, 27, 27] },
  { pid: "p2", centre: ["Ghaziabad", "ग़ाज़ियाबाद"], arrivals: 118.0, trend: [34, 33, 33, 32, 31, 31, 31] },
  { pid: "p4", centre: ["Hapur", "हापुड़"], arrivals: 210.4, trend: [19, 20, 20, 21, 22, 21, 21] },
  { pid: "p5", centre: ["Meerut", "मेरठ"], arrivals: 36.2, trend: [26, 27, 28, 29, 30, 30, 30] },
  { pid: "p6", centre: ["Modinagar", "मोदीनगर"], arrivals: 640.0, trend: [28, 28, 29, 29, 29, 29, 29] },
  { pid: "p7", centre: ["Muradnagar", "मुरादनगर"], arrivals: 95.6, trend: [74, 75, 76, 77, 78, 78, 78] },
  { pid: "p8", centre: ["Meerut", "मेरठ"], arrivals: 24.1, trend: [80, 76, 73, 71, 70, 69, 68] },
  { pid: "p11", centre: ["Hapur", "हापुड़"], arrivals: 12.3, trend: [44, 46, 47, 49, 50, 51, 50] },
  { pid: "p16", centre: ["Meerut", "मेरठ"], arrivals: 8.4, trend: [99, 101, 102, 104, 105, 105, 105] },
  { pid: "p17", centre: ["Meerut", "मेरठ"], arrivals: 58.7, trend: [83, 84, 84, 85, 86, 85, 85] },
];
// What the grower actually banks at a mandi sale: modal rate less commission,
// loading, weighment, the trip in and the shrink on the way.
const MANDI_NET = 0.58;

function Spark({ pts, c, size = [72, 24] }) {
  const [w, h] = size, lo = Math.min(...pts), hi = Math.max(...pts), r = hi - lo || 1;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * w},${h - ((v - lo) / r) * (h - 4) - 2}`).join(" ");
  const up = pts[pts.length - 1] >= pts[0];
  return (
    <svg width={w} height={h} aria-hidden="true">
      <path d={d} fill="none" strokeWidth="1.6" stroke={up ? c.green : c.red} strokeLinejoin="round" />
    </svg>
  );
}

/* ── helpers ───────────────────────────────────────────────── */
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const inr1 = n => "₹" + (Math.round(n * 10) / 10).toLocaleString("en-IN");
const num = { fontVariantNumeric: "tabular-nums" };

// Splits the shelf rupee into the five hands the crop passes through.
function chain(p) {
  const g1 = p.mandi - p.farmer, g2 = p.retail - p.mandi;
  return [
    { k: "farmer_gets", v: p.farmer, farmer: true },
    { k: "aggregator", v: g1 * 0.45 }, { k: "commission", v: g1 * 0.55 },
    { k: "wholesaler", v: g2 * 0.4 }, { k: "retailer_cut", v: g2 * 0.6 },
  ];
}
const transportFor = km => Math.round(km * 6);
const MANDI_NET_F = 0.58; // what a mandi sale actually leaves in the grower's hand

/* ── logo ──────────────────────────────────────────────────── */
/* A bridge (setu) whose span is a wheat stalk; the piers are two crates. */
function Logo({ size = 34, green = "#1F6F43", gold = "#C8901B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M5 33 C 5 15, 43 15, 43 33" stroke={green} strokeWidth="3.4" strokeLinecap="round" />
      {[[13.2, 24.6, -38], [19.6, 21.1, -20], [24, 20.2, 0], [28.4, 21.1, 20], [34.8, 24.6, 38]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.1" ry="3.4" fill={gold}
          transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d="M24 20.2 L24 33" stroke={green} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <rect x="3" y="33" width="11" height="10" rx="2" fill={green} />
      <rect x="34" y="33" width="11" height="10" rx="2" fill={green} />
      <path d="M3 37h11M34 37h11" stroke="#fff" strokeWidth="1.4" opacity=".5" />
      <path d="M16 38h16" stroke={gold} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function Wordmark({ t, lang, c, size = 34 }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} green={c.green} gold={c.gold} />
      <div className="leading-none">
        <div style={{ fontFamily: FD, letterSpacing: "-.02em", color: c.ink, fontWeight: 700, fontSize: size * .55 }}>
          {t("brand")}
        </div>
        <div style={{ color: c.muted, fontSize: size * .265, marginTop: 3 }}>
          {lang === 0 ? "किसान सेतु" : "Kisan Setu"}
        </div>
      </div>
    </div>
  );
}

/* ── produce illustrations ─────────────────────────────────── */
/* Flat two-tone drawings so tiles read at 40px and still look like food. */
const LEAF = "#2F7A3E", LEAF2 = "#48A05A";
const ART = {
  tomato: <><circle cx="24" cy="28" r="13" fill="#D6402F" /><circle cx="19" cy="24" r="3.4" fill="#fff" opacity=".28" /><path d="M24 15v3M24 15l-6 2.6M24 15l6 2.6M19 17l2.6 3.6M29 17l-2.6 3.6" stroke={LEAF} strokeWidth="2.2" strokeLinecap="round" /></>,
  onion: <><path d="M24 41c-7.5 0-11-5-11-10.5S17.5 18 24 18s11 7 11 12.5S31.5 41 24 41z" fill="#B0688B" /><path d="M20 20c-2 6-2 14 0 19M28 20c2 6 2 14 0 19" stroke="#8A4A6B" strokeWidth="1.4" fill="none" /><path d="M24 18c0-3 1-5 3-6M24 18c0-3-1-5-3-6" stroke={LEAF} strokeWidth="2" strokeLinecap="round" fill="none" /></>,
  potato: <><ellipse cx="24" cy="27" rx="15" ry="11" fill="#C79A63" transform="rotate(-12 24 27)" /><circle cx="18" cy="24" r="1.5" fill="#9A7040" /><circle cx="27" cy="30" r="1.7" fill="#9A7040" /><circle cx="30" cy="22" r="1.2" fill="#9A7040" /></>,
  leafy: <><path d="M24 42c0-12 4-20 13-24-1 13-5 20-13 24z" fill={LEAF2} /><path d="M24 42c0-12-4-20-13-24 1 13 5 20 13 24z" fill={LEAF} /><path d="M24 42V22" stroke="#1F5E2E" strokeWidth="1.6" /></>,
  cauliflower: <><path d="M9 27c0-5 4-8 6-8 1-4 5-6 9-6s8 2 9 6c2 0 6 3 6 8 0 6-6 8-15 8S9 33 9 27z" fill="#F2EFD9" /><circle cx="18" cy="25" r="3.2" fill="#E4DFBF" /><circle cx="29" cy="26" r="3" fill="#E4DFBF" /><path d="M11 30c-3 4-2 9 3 10 3-4 3-8 0-10zM37 30c3 4 2 9-3 10-3-4-3-8 0-10z" fill={LEAF} /></>,
  wheat: <><path d="M24 42V18" stroke="#B07C2A" strokeWidth="2" strokeLinecap="round" />{[0,1,2,3].map(i=>(<g key={i}><ellipse cx="19" cy={20+i*5} rx="2.2" ry="3.6" fill="#DFA93B" transform={`rotate(-32 19 ${20+i*5})`} /><ellipse cx="29" cy={20+i*5} rx="2.2" ry="3.6" fill="#DFA93B" transform={`rotate(32 29 ${20+i*5})`} /></g>))}<ellipse cx="24" cy="14" rx="2.3" ry="4" fill="#E8BC55" /></>,
  bajra: <><path d="M24 43V22" stroke="#8E7A3C" strokeWidth="2" strokeLinecap="round" /><rect x="19" y="8" width="10" height="17" rx="5" fill="#B9A75E" />{[0,1,2,3,4].map(i=>(<circle key={i} cx={21.5+(i%2)*5} cy={11+i*3} r="1.5" fill="#8E7A3C" />))}<path d="M24 30c5-1 8-4 9-8" stroke={LEAF} strokeWidth="2" fill="none" strokeLinecap="round" /></>,
  rice: <><path d="M10 34c0-7 6-13 14-13s14 6 14 13z" fill="#F1EDE0" /><rect x="7" y="34" width="34" height="6" rx="3" fill="#CFC7B2" />{[[17,29],[24,26],[31,29],[21,32],[28,32]].map(([x,y],i)=>(<ellipse key={i} cx={x} cy={y} rx="2.2" ry="1.2" fill="#DCD5C2" transform={`rotate(${i*38} ${x} ${y})`} />))}</>,
  mango: <><path d="M31 14c6 3 8 11 4 17s-13 8-18 3-4-14 2-18c4-3 8-4 12-2z" fill="#E8A020" /><path d="M20 22c2-3 6-5 9-5" stroke="#fff" strokeWidth="2.4" opacity=".3" strokeLinecap="round" fill="none" /><path d="M31 14c1-3 3-4 6-4-1 3-3 5-6 4z" fill={LEAF} /></>,
  guava: <><circle cx="24" cy="28" r="13" fill="#BFD06A" /><circle cx="24" cy="28" r="6" fill="#E9B0A6" opacity=".7" /><path d="M24 15v-4" stroke="#7A6B35" strokeWidth="2" strokeLinecap="round" /><path d="M24 12c3-2 6-2 8 0-2 2-5 3-8 0z" fill={LEAF} /></>,
  banana: <><path d="M12 20c1 12 9 19 20 18-3-9-9-16-20-18z" fill="#E8C33C" /><path d="M14 15c1 12 9 19 20 18-3-9-9-16-20-18z" fill="#F2D75B" /><path d="M32 38c3-1 4-3 4-6" stroke="#B99A22" strokeWidth="2" fill="none" strokeLinecap="round" /></>,
  okra: <><g fill={LEAF2}><path d="M17 10c3 0 5 3 5 8s-2 20-6 22-5-3-4-8 2-22 5-22z" /><path d="M28 12c3 0 5 3 5 8s-2 18-6 20-5-3-4-8 2-20 5-20z" opacity=".82" /></g><path d="M17 14v22M28 16v20" stroke="#1F5E2E" strokeWidth="1.1" opacity=".5" /></>,
  chilli: <><path d="M30 12c1 12-3 24-12 27-4 1-7-2-6-6 2-9 10-18 18-21z" fill="#CC3324" /><path d="M28 14c-6 4-11 11-13 18" stroke="#fff" strokeWidth="2" opacity=".22" fill="none" strokeLinecap="round" /><path d="M30 12c1-3 3-4 6-4-1 2-2 4-6 4z" fill={LEAF} /></>,
  milk: <><path d="M18 6h12v5l4 7v22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V18l4-7z" fill="#E7EDF2" /><path d="M14 24h20v14a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="#FBFCFD" /><rect x="17" y="4" width="14" height="4" rx="1.6" fill="#5E86A8" /></>,
  ghee: <><path d="M13 20h22v18a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z" fill="#EFD79A" /><rect x="11" y="14" width="26" height="7" rx="2.5" fill="#D9B95F" /><path d="M18 26h12" stroke="#C79E3F" strokeWidth="2" strokeLinecap="round" /></>,
  turmeric: <><path d="M12 30c0-6 5-9 10-8s6 6 3 9-13 4-13-1z" fill="#D4802A" /><path d="M23 24c4-4 10-4 12 0s-2 9-7 9-9-4-5-9z" fill="#E39A3F" /><path d="M31 20c2-3 5-4 7-2-1 3-4 4-7 2z" fill={LEAF} /></>,
  dal: <><path d="M8 26h32c0 8-7 14-16 14S8 34 8 26z" fill="#D9CDB4" /><rect x="6" y="23" width="36" height="4" rx="2" fill="#C4B594" />{[[16,19],[22,17],[28,19],[19,21],[26,21],[24,21]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="2.6" fill={i%2?"#E3B84A":"#EFCB69"} />))}</>,
  amla: <><circle cx="24" cy="28" r="12.5" fill="#CBD866" /><path d="M24 15.5v25M15 21c4 4 4 10 0 14M33 21c-4 4-4 10 0 14" stroke="#AFC04F" strokeWidth="1.5" fill="none" /><path d="M24 15c2-3 5-4 8-3-1 3-4 5-8 3z" fill={LEAF} /></>,
};
const ART_OF = { p1:"tomato", p2:"onion", p3:"leafy", p4:"potato", p5:"cauliflower", p6:"wheat",
  p7:"rice", p8:"mango", p9:"guava", p10:"okra", p11:"chilli", p12:"banana", p13:"milk",
  p14:"ghee", p15:"bajra", p16:"turmeric", p17:"dal", p18:"amla" };

function Produce({ id, size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {ART[ART_OF[id]] || ART.leafy}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   CRAFT MOTIFS
   Hand-block print, toran, rangoli, folk figures, farmer faces.
   All drawn here. No image files, nothing external.
   ════════════════════════════════════════════════════════════ */

/* A Bagru-style block print band. Runs under headings the way a
   printed border runs along the edge of a cloth. */
let _pid = 0;
function BlockPrint({ c, h = 18, col, op = .45 }) {
  const id = useMemo(() => "bp" + (++_pid), []);
  const k = col || c.wood;
  return (
    <svg width="100%" height={h} style={{ display: "block", opacity: op }} aria-hidden="true">
      <defs>
        <pattern id={id} width="32" height={h} patternUnits="userSpaceOnUse">
          <g fill={k}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <ellipse key={a} cx="9" cy={h / 2} rx="1.5" ry="3.6" fill={k}
                transform={`rotate(${a} 9 ${h / 2})`} opacity=".85" />
            ))}
            <circle cx="9" cy={h / 2} r="1.7" />
            <path d={`M22 ${h / 2 - 5} q6 5 0 10 q-5 -5 0 -10z`} />
            <circle cx="28.5" cy={h / 2 - 4} r="1" />
            <circle cx="28.5" cy={h / 2 + 4} r="1" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#${id})`} />
    </svg>
  );
}

/* Toran. The marigold and mango-leaf string hung over a doorway
   when guests are expected. Here it hangs over the front page. */
function Toran({ c, h = 44 }) {
  const id = useMemo(() => "tr" + (++_pid), []);
  return (
    <svg width="100%" height={h} style={{ display: "block" }} aria-hidden="true">
      <defs>
        <pattern id={id} width="58" height={h} patternUnits="userSpaceOnUse">
          <path d={`M0 4 q14 7 29 0 q15 -7 29 0`} stroke={c.woodDark} strokeWidth="1.6" fill="none" />
          <g>
            <path d="M12 6 q9 8 0 20 q-9 -12 0 -20z" fill={c.green} />
            <path d="M12 8 v16" stroke={c.greenDeep} strokeWidth="1" />
          </g>
          <g transform="translate(35,16)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <circle key={a} cx={Math.cos(a * Math.PI / 180) * 6} cy={Math.sin(a * Math.PI / 180) * 6}
                r="3.4" fill={c.goldBright} />
            ))}
            <circle r="4.4" fill={c.coral} />
          </g>
          <path d="M35 20 v10" stroke={c.woodDark} strokeWidth="1.2" />
          <circle cx="35" cy="33" r="2.4" fill={c.green} />
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#${id})`} />
    </svg>
  );
}

/* Rangoli, used faintly behind panels the way chalk sits on a swept floor. */
function Rangoli({ c, size = 190, col }) {
  const k = col || c.green;
  const pet = [];
  for (let a = 0; a < 360; a += 30) pet.push(a);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g stroke={k} fill="none" strokeWidth="1">
        <circle cx="50" cy="50" r="10" />
        <circle cx="50" cy="50" r="30" strokeDasharray="1 5" />
        <circle cx="50" cy="50" r="44" strokeDasharray="1 7" />
        {pet.map(a => (
          <g key={a} transform={`rotate(${a} 50 50)`}>
            <path d="M50 40 q9 -12 0 -24 q-9 12 0 24z" />
            <circle cx="50" cy="8" r="1.6" fill={k} stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* Folk figures for the four steps. Two triangles and a circle,
   the way village wall painting draws a person. */
function FolkFigure({ c, kind, size = 76 }) {
  const g = c.green, w = 2.1;
  const Body = ({ x = 32 }) => (
    <g stroke={g} strokeWidth={w} fill="none" strokeLinecap="round">
      <circle cx={x} cy="15" r="5.5" />
      <path d={`M${x - 6} 22 L${x + 6} 22 L${x} 32 Z`} />
      <path d={`M${x} 32 L${x - 6} 43 L${x + 6} 43 Z`} />
      <path d={`M${x - 5} 45 L${x - 8} 56 M${x + 5} 45 L${x + 8} 56`} />
    </g>
  );
  const art = {
    list: <>
      <Body x="26" />
      <g stroke={g} strokeWidth={w} fill="none" strokeLinecap="round">
        <path d="M32 26 L44 22" />
        <rect x="44" y="14" width="14" height="18" rx="2" fill={c.greenSoft} />
        <path d="M47 20h8M47 25h8" />
      </g>
    </>,
    pick: <>
      <Body x="24" />
      <g stroke={g} strokeWidth={w} fill="none" strokeLinecap="round">
        <path d="M30 26 L42 30" />
        <path d="M40 32 h20 l-3 14 h-14z" fill={c.goldSoft} />
        <path d="M45 32 a5 5 0 0 1 10 0" />
      </g>
    </>,
    van: <>
      <Body x="16" />
      <g stroke={g} strokeWidth={w} fill="none" strokeLinecap="round">
        <path d="M32 34 h20 v12 h-26 v-8z" fill={c.greenSoft} />
        <path d="M52 38 h6 l4 6 v2 h-10z" />
        <circle cx="34" cy="50" r="3.5" />
        <circle cx="56" cy="50" r="3.5" />
      </g>
    </>,
    pay: <>
      <Body x="24" />
      <g stroke={g} strokeWidth={w} fill="none" strokeLinecap="round">
        <path d="M30 26 L40 24" />
        <circle cx="50" cy="24" r="8" fill={c.goldSoft} />
        <path d="M46 21h8M46 24h8M53 21c0 5-7 3-7 3l7 7" />
      </g>
    </>,
  }[kind];
  return <svg width={size} height={size} viewBox="0 0 72 62" aria-hidden="true">{art}</svg>;
}

/* Faces, drawn rather than photographed. Pagdi for the men,
   dupatta for the women, one cloth colour each. */
const FEMALE = ["f2", "f4", "f6"];
function FarmerFace({ id, size = 56, c }) {
  const i = FARMERS.findIndex(f => f.id === id);
  const she = FEMALE.includes(id);
  const cloth = [c.green, c.red, c.goldBright, c.woodDark, c.violet, c.coral][(i + 6) % 6];
  const skin = "#D9A273";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill={c.peach} />
      <path d="M8 64 q6 -16 24 -16 t24 16z" fill={cloth} opacity=".9" />
      {she && <path d="M13 40 Q32 2 51 40 L51 56 Q32 40 13 56z" fill={cloth} />}
      <ellipse cx="32" cy="31" rx="13" ry="15" fill={skin} />
      {she
        ? <>
            <path d="M16 30 Q32 8 48 30 Q32 20 16 30z" fill="#2E2119" />
            <path d="M13 40 Q22 30 24 20" stroke={cloth} strokeWidth="5" fill="none" />
            <circle cx="32" cy="17" r="1.8" fill={c.red} />
            <circle cx="19" cy="36" r="2" fill={c.goldBright} />
            <circle cx="45" cy="36" r="2" fill={c.goldBright} />
          </>
        : <>
            <path d="M16 26 Q32 4 48 26 Q40 20 32 21 Q22 22 16 26z" fill={cloth} />
            <path d="M17 25 Q32 12 47 25" stroke="rgba(0,0,0,.18)" strokeWidth="2" fill="none" />
            <path d="M46 22 q7 -3 6 5 q-4 1 -6 -5z" fill={cloth} />
            <path d="M26 39 q6 3 12 0" stroke="#3A2A1C" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </>}
      <circle cx="27" cy="30" r="1.8" fill="#2E2119" />
      <circle cx="38" cy="30" r="1.8" fill="#2E2119" />
      <path d={she ? "M28 40 q4 3 8 0" : "M28 45 q4 3 8 0"} stroke="#5A3A25" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* A field at first light, for the top of the front page. */
function HeroScene({ c }) {
  return (
    <div className="relative" style={{ minHeight: 330 }}>
      <svg viewBox="0 0 460 330" className="w-full" style={{ display: "block" }} aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.peach} /><stop offset="100%" stopColor={c.goldSoft} />
          </linearGradient>
        </defs>
        <rect width="460" height="330" rx="10" fill="url(#sky)" />
        <circle cx="300" cy="128" r="72" fill={c.goldBright} opacity=".55" />
        <path d="M0 168 q70 -34 150 -8 t150 -14 q90 -20 160 10 v40 H0z" fill={c.greenSoft} />
        <path d="M0 200 q90 -30 180 -4 t170 -12 q60 -8 110 8 v50 H0z" fill={c.green} opacity=".55" />
        <path d="M0 238 q110 -26 220 2 t240 -8 v98 H0z" fill={c.green} />
        <g stroke={c.greenDeep} strokeWidth="1.6" opacity=".45">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <path key={i} d={`M${-40 + i * 96} 330 q${60 + i * 6} -46 ${150 + i * 10} -66`} fill="none" />
          ))}
        </g>
        <g fill="none" stroke={c.woodDark} strokeWidth="1.6" opacity=".7">
          <path d="M56 74 q7 -7 14 0" /><path d="M84 62 q6 -6 12 0" /><path d="M70 92 q5 -5 10 0" />
        </g>
        <g transform="translate(392,214)">
          <rect x="-14" y="-16" width="28" height="16" fill={c.surface} stroke={c.woodDark} strokeWidth="1.4" />
          <path d="M-18 -16 L0 -28 L18 -16z" fill={c.red} />
        </g>
      </svg>

      <div className="absolute" style={{ right: "6%", bottom: 6 }}>
        <FarmerFace id="f1" size={128} c={c} />
      </div>
      <div className="absolute" style={{ left: "8%", bottom: 18, transform: "rotate(-3deg)" }}>
        <div style={{
          background: c.wood, borderRadius: 3, padding: "8px 10px 10px",
          boxShadow: `0 10px 18px -10px ${c.cast}`,
          backgroundImage: `repeating-linear-gradient(90deg, ${c.woodDark} 0 2px, transparent 2px 15px)`,
        }}>
          <div className="flex gap-1">
            {["p1", "p3", "p2", "p11"].map(id => (
              <span key={id} className="grid place-items-center rounded-sm"
                style={{ background: c.surface, width: 38, height: 38 }}>
                <Produce id={id} size={30} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute grid place-items-center rounded-md text-center"
        style={{
          right: "2%", top: "8%", width: 92, height: 92, background: c.green, color: "#fff",
          boxShadow: `0 12px 22px -12px ${c.cast}`, transform: "rotate(-6deg)",
        }}>
        <div>
          <div style={{ fontSize: 10, opacity: .85 }}>DIRECT FROM</div>
          <div style={{ fontFamily: FD, fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>Farmers</div>
          <div style={{ fontSize: 9, opacity: .85 }}>NO MIDDLEMEN</div>
        </div>
      </div>
    </div>
  );
}

/* ── crate: the card, built as a physical box ──────────────── */
/* Front face plus a darker right cheek, wooden top and bottom rails,
   sitting a few degrees off true until you touch it. */
function Crate({ c, children, tilt = -5, className = "", pad = "p-4", onClick, active }) {
  const [up, setUp] = useState(false);
  return (
    <div className={className} style={{ perspective: 1000 }}>
      <div
        onMouseEnter={() => setUp(true)} onMouseLeave={() => setUp(false)}
        onClick={onClick}
        style={{
          position: "relative", transformStyle: "preserve-3d",
          transition: "transform .32s cubic-bezier(.2,.7,.3,1)",
          transform: up || active ? "rotateY(0deg) translateY(-3px)" : `rotateY(${tilt}deg)`,
          cursor: onClick ? "pointer" : "default",
        }}>
        <div style={{
          position: "absolute", top: 8, right: -11, width: 12, height: "calc(100% - 16px)",
          background: c.woodDark, transform: "rotateY(64deg)", transformOrigin: "left center",
          borderRadius: 1,
        }} />
        <div style={{
          background: c.surface, borderRadius: 3,
          border: `1px solid ${c.line}`,
          borderTop: `7px solid ${c.wood}`, borderBottom: `5px solid ${c.woodDark}`,
          boxShadow: active ? `0 16px 26px -12px ${c.cast}` : `0 10px 20px -12px ${c.cast}`,
          outline: active ? `2px solid ${c.green}` : "none",
        }}>
          <div style={{
            height: 4, background: c.woodLit,
            backgroundImage: `repeating-linear-gradient(90deg, ${c.woodDark} 0 1px, transparent 1px 13px)`,
          }} />
          <div className={pad}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* Flat panel for places a crate would be silly (forms, tables, totals). */
const Panel = ({ c, children, className = "", style = {}, ...r }) => (
  <div className={"rounded-sm " + className}
    style={{ background: c.surface, border: `1px solid ${c.line}`, boxShadow: `0 6px 14px -10px ${c.cast}`, ...style }} {...r}>
    {children}
  </div>
);

function Btn({ c, kind = "solid", big, children, className = "", ...r }) {
  const st = kind === "solid" ? { background: c.green, color: "#fff", borderColor: c.greenDeep }
    : kind === "gold" ? { background: c.gold, color: "#1c1405", borderColor: c.gold }
    : kind === "ghost" ? { background: "transparent", color: c.ink, borderColor: c.line }
    : { background: c.greenSoft, color: c.green, borderColor: "transparent" };
  return (
    <button {...r} className={"rounded-sm border font-semibold " + className}
      style={{
        fontFamily: FB, minHeight: big ? 54 : 38, fontSize: big ? 17 : 14,
        padding: big ? "0 20px" : "0 14px",
        boxShadow: kind === "ghost" ? "none" : `0 3px 0 0 ${kind === "gold" ? "#8d6512" : c.greenDeep}`,
        ...st,
      }}>{children}</button>
  );
}

const Tag = ({ c, tone = "green", children }) => {
  const m = { green: [c.greenSoft, c.green], gold: [c.goldSoft, c.gold], red: [c.redSoft, c.red], flat: [c.raise, c.muted] }[tone];
  return <span className="rounded-md px-2.5 py-0.5 text-xs font-semibold"
    style={{ background: m[0], color: m[1] }}>{children}</span>;
};

/* Stencilled label, the way a crate or a jute sack is marked. */
const Stencil = ({ c, children, col }) => (
  <div className="text-xs font-bold uppercase" style={{ color: col || c.muted, letterSpacing: ".16em" }}>
    {children}
  </div>
);

const H = ({ c, children, sub, className = "" }) => (
  <div className={"mb-4 " + className}>
    <h2 className="text-xl sm:text-2xl" style={{ fontFamily: FD, color: c.ink, fontWeight: 700, letterSpacing: "-.02em" }}>
      {children}
    </h2>
    {sub && <p className="mt-1 text-sm" style={{ color: c.muted, maxWidth: "58ch" }}>{sub}</p>}
  </div>
);

/* ── the argument of the project, extruded ─────────────────── */
/* Farmer's slab stands at the front, full height and solid. Every hand after
   it is shorter, greyer and further back, so the loss is a shape not a number. */
function PriceRail({ c, t, p, small }) {
  const parts = chain(p), total = p.retail;
  const hs = small ? [30, 25, 21, 18, 15] : [58, 48, 40, 33, 27];
  return (
    <div>
      <div className="flex w-full items-end" style={{ paddingTop: small ? 8 : 12 }}>
        {parts.map((s, i) => {
          const face = s.farmer ? c.green : c.slab[i - 1];
          const top = s.farmer ? c.greenTop : c.slabTop[i - 1];
          const w = (s.v / total) * 100;
          return (
            <div key={i} style={{ width: `${w}%`, height: hs[i], position: "relative" }}>
              <div style={{
                position: "absolute", top: -9, left: 0, right: 0, height: 9, background: top,
                transform: "skewX(-45deg)", transformOrigin: "bottom left",
              }} />
              <div style={{
                position: "absolute", inset: 0, background: face,
                backgroundImage: s.farmer ? "none"
                  : `repeating-linear-gradient(135deg, rgba(0,0,0,.13) 0 4px, transparent 4px 9px)`,
                boxShadow: `inset -1px 0 0 rgba(0,0,0,.16)`,
              }} />
              {w > 11 && !small && (
                <span className="absolute inset-0 grid place-items-center text-xs font-bold"
                  style={{ ...num, color: s.farmer ? "#fff" : "rgba(0,0,0,.5)" }}>{inr1(s.v)}</span>
              )}
            </div>
          );
        })}
      </div>
      {!small && (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5">
          {parts.map((s, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5" style={{ background: s.farmer ? c.green : c.slab[i - 1] }} />
                <span className="text-xs" style={{ color: c.muted }}>{t(s.k)}</span>
              </div>
              <div className="mt-0.5 text-sm font-bold" style={{ ...num, color: s.farmer ? c.green : c.ink }}>
                {inr1(s.v)}<span className="ml-1 font-normal" style={{ color: c.muted }}>
                  {Math.round((s.v / total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── escrow, drawn as a box with a lid ─────────────────────── */
function LockBox({ c, open, size = 96 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 100 78" aria-hidden="true">
      <g style={{ transition: "transform .5s cubic-bezier(.3,.8,.3,1)", transformOrigin: "14% 44%", transform: open ? "rotate(-104deg)" : "rotate(0deg)" }}>
        <rect x="12" y="22" width="76" height="12" rx="2" fill={c.woodDark} />
        <rect x="12" y="22" width="76" height="5" rx="2" fill={c.wood} />
      </g>
      <rect x="16" y="30" width="68" height="20" rx="2" fill={open ? c.greenSoft : "transparent"} />
      {open && <>
        <rect x="26" y="32" width="20" height="12" rx="1.5" fill={c.green} transform="rotate(-7 36 38)" />
        <rect x="50" y="34" width="20" height="12" rx="1.5" fill={c.greenDeep} transform="rotate(5 60 40)" />
      </>}
      <rect x="12" y="34" width="76" height="34" rx="3" fill={c.wood} />
      <rect x="12" y="34" width="76" height="34" rx="3" fill="none"
        stroke={c.woodDark} strokeWidth="2" />
      <path d="M12 46h76M12 56h76" stroke={c.woodDark} strokeWidth="1.5" opacity=".55" />
      <rect x="42" y="40" width="16" height="16" rx="2" fill={open ? c.green : c.slate} />
      {open
        ? <path d="M46 48l3 3 6-6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        : <><circle cx="50" cy="47" r="2.4" fill={c.chalk} /><rect x="49" y="47" width="2" height="5" fill={c.chalk} /></>}
    </svg>
  );
}


Object.assign(S, {
  greet_sub: ["6 farms listing today, all within 50 km of Ghaziabad 201009.", "आज 6 खेतों की सूची, सभी ग़ाज़ियाबाद 201009 से 50 किमी के भीतर।"],
  quick_pick: ["Quick pick", "झट से चुनें"],
  shop_now: ["Shop now", "अभी ख़रीदें"],
  view_cart: ["View cart", "कार्ट देखें"],
  checkout: ["Checkout", "आगे बढ़ें"],
  items_word: ["items", "चीज़ें"],
  track: ["Track", "देखें"],
  tab_cart: ["Cart", "कार्ट"],
  fresh_today: ["Picked today", "आज की कटाई"],
  deals: ["Biggest savings", "सबसे ज़्यादा बचत"],
  our_farmers: ["Meet the farmers", "किसानों से मिलिए"],
  empty_sub: ["Your basket is waiting to be filled.", "आपकी टोकरी भरने का इंतज़ार कर रही है।"],
  step_of: ["of", "में से"],
  sell_now: ["Put on sale", "बिक्री पर लगाएँ"],
  quick_actions: ["Quick actions", "झट से"],
  new_orders: ["New orders", "नए ऑर्डर"],
  see_route: ["See route", "रास्ता देखें"],
  total_word: ["Total", "कुल"],
});

/* ════════════════════════════════════════════════════════════
   APP SHELL. Phone first. On a laptop it sits inside a handset
   so a judge sees the thing as it would actually be used.
   ════════════════════════════════════════════════════════════ */
const RAD = { card: 10, chip: 8, sheet: 12 };
const lift = c => `0 1px 2px ${c.cast}, 0 10px 24px -16px ${c.cast}`;
const liftHi = c => `0 2px 4px ${c.cast}, 0 18px 34px -18px ${c.cast}`;

function StatusBar({ c }) {
  return (
    <div className="hidden items-center px-5 pb-1 pt-2 sm:flex" style={{ color: c.ink }}>
      <span className="text-xs font-bold" style={num}>9:41</span>
      <span className="ml-auto flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={i * 4.4} y={8 - i * 2.4} width="3" height={3 + i * 2.4} rx=".8" fill={c.ink} />
          ))}
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true">
          <path d="M7.5 9.5l-2-2a3 3 0 014 0z" fill={c.ink} />
          <path d="M2 4.5a8 8 0 0111 0M4.4 6.9a5 5 0 016.2 0" stroke={c.ink} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" aria-hidden="true">
          <rect x=".6" y=".6" width="19" height="9.8" rx="2.6" fill="none" stroke={c.ink} strokeWidth="1" opacity=".5" />
          <rect x="2" y="2" width="13" height="7" rx="1.6" fill={c.green} />
          <path d="M21.4 4v3a2 2 0 000-3z" fill={c.ink} opacity=".5" />
        </svg>
      </span>
    </div>
  );
}

/* Top bar. Two shapes: a home bar with the location, and a
   back bar for anything pushed on top of a tab. */
function AppBar({ c, t, lang, setLang, dark, setDark, title, back, addr, role, openGate, right }) {
  return (
    <div className="sticky top-0 z-30" style={{ background: c.bg }}>
      <StatusBar c={c} />
      <div className="flex items-center gap-2 px-4 pb-2 pt-2">
        {back ? (
          <>
            <button onClick={back} className="grid shrink-0 place-items-center rounded-md"
              style={{ width: 38, height: 38, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
              <ArrowLeft size={18} />
            </button>
            <span className="truncate" style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, color: c.ink }}>{title}</span>
          </>
        ) : (
          <>
            <Logo size={30} green={c.green} gold={c.goldBright} />
            <div className="min-w-0">
              <div className="flex items-center gap-1" style={{ color: c.muted, fontSize: 11 }}>
                <MapPin size={11} style={{ color: c.green }} />{addr}
              </div>
              <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: c.ink, lineHeight: 1.1 }}>{title}</div>
            </div>
          </>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {right}
          <button onClick={() => setLang(lang === 0 ? 1 : 0)} className="grid place-items-center rounded-md text-xs font-bold"
            style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {lang === 0 ? "अ" : "A"}
          </button>
          <button onClick={() => setDark(!dark)} className="grid place-items-center rounded-md"
            style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {openGate && (
            <button onClick={openGate} className="grid place-items-center rounded-md overflow-hidden"
              style={{ width: 34, height: 34, border: `1px solid ${c.line}` }}>
              {role === "farmer" ? <FarmerFace id={ME} size={32} c={c} />
                : <span className="grid h-full w-full place-items-center" style={{ background: c.violetSoft, color: c.violet }}>
                    <Users size={15} />
                  </span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Bottom tabs. The active one gets a marigold dot above it,
   the same eight-petal shape used in the block print. */
function TabBar({ c, tabs, view, go, cartCount }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full" style={{ maxWidth: 430, transform: "translateX(-50%)" }}>
      <div style={{
        background: c.surface, borderTop: `1px solid ${c.line}`,
        boxShadow: `0 -8px 24px -18px ${c.cast}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        <BlockPrint c={c} col={c.wood} op={.22} h={10} />
        <div className="flex">
          {tabs.map(([id, k, Ic]) => {
            const on = view === id;
            return (
              <button key={id} onClick={() => go(id)} className="relative flex-1 pb-2 pt-1.5">
                <span className="relative mx-auto grid place-items-center" style={{ width: 34, height: 26 }}>
                  <Ic size={20} style={{ color: on ? c.green : c.muted }} />
                  {id === "cart" && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid place-items-center rounded-md text-xs font-bold"
                      style={{ background: c.coral, color: "#fff", minWidth: 16, height: 16, fontSize: 10 }}>{cartCount}</span>
                  )}
                </span>
                <span className="mt-0.5 block text-center" style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, color: on ? c.green : c.muted }}>
                  {k}
                </span>
                {on && (
                  <svg width="14" height="14" viewBox="0 0 14 14" className="absolute left-1/2 top-0" style={{ transform: "translate(-50%,-6px)" }}>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                      <ellipse key={a} cx="7" cy="7" rx="1.1" ry="2.6" fill={c.goldBright}
                        transform={`rotate(${a} 7 7)`} />
                    ))}
                    <circle cx="7" cy="7" r="1.5" fill={c.coral} />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Phone({ c, children }) {
  return (
    <div className="flex min-h-screen justify-center sm:py-7"
      style={{ background: c.bg, backgroundImage: `radial-gradient(circle at 50% 0%, ${c.peach} 0%, transparent 55%)` }}>
      <div className="relative w-full sm:rounded-3xl sm:border-8"
        style={{
          maxWidth: 430, background: c.bg, borderColor: "#15151A",
          boxShadow: liftHi(c), overflow: "hidden",
        }}>
        {children}
      </div>
    </div>
  );
}

/* ── small pieces used all over the app ────────────────────── */
const Sheet = ({ c, children, className = "", style = {}, tone }) => (
  <div className={className} style={{
    background: tone || c.surface, borderRadius: RAD.card,
    border: `1px solid ${c.line}`, boxShadow: lift(c), ...style,
  }}>{children}</div>
);

function SectionHead({ c, title, action, onAction }) {
  return (
    <div className="mb-3 flex items-end gap-3 px-4">
      <div className="min-w-0">
        <h2 className="truncate" style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: c.ink }}>{title}</h2>
        <div style={{ width: 46, marginTop: 3 }}><BlockPrint c={c} col={c.wood} op={.5} h={9} /></div>
      </div>
      {action && (
        <button onClick={onAction} className="ml-auto shrink-0 text-xs font-bold" style={{ color: c.green }}>{action}</button>
      )}
    </div>
  );
}

const Pill = ({ c, tone = "green", children, className = "" }) => {
  const m = {
    green: [c.greenSoft, c.green], gold: [c.goldSoft, c.gold], coral: [c.redSoft, c.red],
    violet: [c.violetSoft, c.violet], flat: [c.raise, c.muted],
  }[tone];
  return <span className={"rounded-md px-2.5 py-1 text-xs font-bold " + className}
    style={{ background: m[0], color: m[1] }}>{children}</span>;
};

/* A stepper that grows out of the Add button, the way grocery apps do. */
function AddStepper({ c, qty, add, sub, small }) {
  if (!qty) return (
    <button onClick={add} className="rounded-md font-bold"
      style={{
        background: c.green, color: "#fff", height: small ? 30 : 34, padding: "0 16px",
        fontSize: small ? 12 : 13, boxShadow: `0 2px 0 0 ${c.greenDeep}`,
      }}>+ ADD</button>
  );
  return (
    <span className="flex items-center rounded-md"
      style={{ background: c.green, height: small ? 30 : 34, boxShadow: `0 2px 0 0 ${c.greenDeep}` }}>
      <button onClick={sub} className="grid place-items-center" style={{ width: 30, color: "#fff" }}><Minus size={14} /></button>
      <span className="text-center font-bold" style={{ ...num, color: "#fff", width: 22, fontSize: 13 }}>{qty}</span>
      <button onClick={add} className="grid place-items-center" style={{ width: 30, color: "#fff" }}><Plus size={14} /></button>
    </span>
  );
}

/* Sticky action bar that sits above the tabs on detail screens. */
function ActionBar({ c, left, right, onClick, label, lift = 0, wide }) {
  return (
    <div className="fixed left-1/2 z-40 w-full" style={{ bottom: lift, maxWidth: wide ? 768 : 430, transform: "translateX(-50%)" }}>
      <div className="flex items-center gap-3 px-4 pb-4 pt-3"
        style={{ background: c.surface, borderTop: `1px solid ${c.line}`, boxShadow: `0 -10px 26px -18px ${c.cast}` }}>
        <div className="min-w-0">
          <div className="truncate text-xs" style={{ color: c.muted }}>{left}</div>
          <div style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 21, color: c.ink }}>{right}</div>
        </div>
        <button onClick={onClick} className="ml-auto flex items-center gap-2 rounded-md font-bold"
          style={{ background: c.green, color: "#fff", height: 48, padding: "0 24px", fontSize: 15, boxShadow: `0 3px 0 0 ${c.greenDeep}` }}>
          {label} <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ONBOARDING
   ════════════════════════════════════════════════════════════ */
function Onboard({ c, t, lang, setLang, dark, setDark, pick, canClose, close }) {
  const opts = [
    { id: "farmer", face: "f1", k: ["gate_farmer", "gate_farmer_s"], tone: c.greenSoft, ink: c.green },
    { id: "consumer", face: null, icon: Users, k: ["gate_buyer", "gate_buyer_s"], tone: c.goldSoft, ink: c.gold },
    { id: "retailer", face: null, icon: Boxes, k: ["gate_shop", "gate_shop_s"], tone: c.redSoft, ink: c.red },
  ];
  return (
    <Phone c={c}>
      <StatusBar c={c} />
      <div className="flex items-center gap-2 px-4 pt-1">
        {canClose && (
          <button onClick={close} className="grid place-items-center rounded-md"
            style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            <X size={16} />
          </button>
        )}
        <div className="ml-auto flex gap-1.5">
          <button onClick={() => setLang(lang === 0 ? 1 : 0)} className="rounded-md px-3 text-xs font-bold"
            style={{ height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {lang === 0 ? "हिंदी" : "English"}
          </button>
          <button onClick={() => setDark(!dark)} className="grid place-items-center rounded-md"
            style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      <div className="relative px-5 pb-10 pt-4">
        <div className="pointer-events-none absolute" style={{ right: -60, top: -20, opacity: .07 }}>
          <Rangoli c={c} size={240} col={c.green} />
        </div>
        <div className="relative flex items-center gap-2.5">
          <Logo size={38} green={c.green} gold={c.goldBright} />
          <div>
            <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 22, color: c.ink }}>{t("brand")}</div>
            <div style={{ color: c.muted, fontSize: 12 }}>{lang === 0 ? "किसान सेतु" : "Kisan Setu"}</div>
          </div>
        </div>
        <div className="mt-3"><Toran c={c} h={36} /></div>

        <h1 className="relative mt-5 text-3xl leading-tight" style={{ fontFamily: FD, fontWeight: 700, color: c.ink }}>
          {t("gate_h")}
        </h1>
        <p className="relative mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{t("gate_p")}</p>

        <div className="relative mt-6 space-y-3">
          {opts.map(o => (
            <button key={o.id} onClick={() => pick(o.id)} className="flex w-full items-center gap-3 p-3 text-left"
              style={{ background: c.surface, borderRadius: RAD.card, border: `1px solid ${c.line}`, boxShadow: lift(c) }}>
              <span className="grid shrink-0 place-items-center overflow-hidden rounded-md"
                style={{ width: 52, height: 52, background: o.tone, color: o.ink }}>
                {o.face ? <FarmerFace id={o.face} size={52} c={c} /> : <o.icon size={23} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block" style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: c.ink }}>{t(o.k[0])}</span>
                <span className="block text-xs" style={{ color: c.muted }}>{t(o.k[1])}</span>
              </span>
              <ArrowRight size={19} style={{ color: o.ink }} />
            </button>
          ))}
        </div>
        <p className="relative mt-6 text-center text-xs" style={{ color: c.muted }}>{t("demo_note")}</p>
      </div>
    </Phone>
  );
}

/* ════════════════════════════════════════════════════════════
   BUYER
   ════════════════════════════════════════════════════════════ */
function ProdCard({ c, t, lang, p, qty, add, sub, open, wide }) {
  const f = FARMERS.find(x => x.id === p.fid);
  const save = Math.round(((p.retail - p.farmer) / p.retail) * 100);
  return (
    <div style={{
      background: c.surface, borderRadius: RAD.card, border: `1px solid ${c.line}`,
      boxShadow: lift(c), overflow: "hidden", width: wide ? 156 : "auto", flexShrink: 0,
    }}>
      <button onClick={open} className="relative block w-full" style={{ background: c.peach, height: 104 }}>
        <span className="absolute inset-0 grid place-items-center"><Produce id={p.id} size={70} /></span>
        <span className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-bold"
          style={{ background: c.coral, color: "#fff", fontSize: 10 }}>−{save}%</span>
        {p.organic && (
          <span className="absolute right-2 top-2 grid place-items-center rounded-md"
            style={{ background: c.green, width: 20, height: 20 }}><Leaf size={11} color="#fff" /></span>
        )}
      </button>
      <div className="p-3">
        <button onClick={open} className="block w-full text-left">
          <div className="truncate text-sm font-bold" style={{ color: c.ink }}>{p.name[lang]}</div>
          <div className="mt-0.5 flex items-center gap-1 truncate text-xs" style={{ color: c.muted }}>
            <MapPin size={10} />{f.store[lang].split(" ")[0]} · {f.km} km
          </div>
        </button>
        <div className="mt-2 flex items-end gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 17, color: c.ink }}>{inr(p.farmer)}</span>
              <span className="text-xs line-through" style={{ ...num, color: c.muted }}>{inr(p.retail)}</span>
            </div>
            <div className="text-xs" style={{ color: c.muted }}>/{p.unit[lang]}</div>
          </div>
          <span className="ml-auto"><AddStepper c={c} qty={qty} add={add} sub={sub} small /></span>
        </div>
      </div>
    </div>
  );
}

function BuyerHome({ c, t, lang, go, openStore, openProduct, cart, addToCart, subFromCart, setCat }) {
  const tom = PRODUCTS.find(p => p.id === "p1");
  const fresh = PRODUCTS.filter(p => p.harvest <= 2).slice(0, 6);
  const deals = [...PRODUCTS].sort((a, b) => (b.retail - b.farmer) / b.retail - (a.retail - a.farmer) / a.retail).slice(0, 6);
  const steps = [["list", "how_1", "how_1s"], ["pick", "how_2", "how_2s"], ["van", "how_3", "how_3s"], ["pay", "how_4", "how_4s"]];
  const q = id => cart.find(x => x.id === id)?.qty;

  return (
    <div className="pb-4">
      {/* hero */}
      <div className="px-4 pt-1">
        <div className="relative overflow-hidden" style={{ borderRadius: RAD.sheet, background: c.green, boxShadow: liftHi(c) }}>
          <Toran c={c} h={30} />
          <div className="pointer-events-none absolute" style={{ right: -46, bottom: -46, opacity: .16 }}>
            <Rangoli c={c} size={190} col="#fff" />
          </div>
          <div className="relative flex items-end gap-2 p-4 pt-3">
            <div className="min-w-0 flex-1">
              <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 25, color: "#fff", lineHeight: 1.12 }}>
                {t("hero_a")}<br />{t("hero_b")}
              </h1>
              <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,.85)", maxWidth: "28ch" }}>{t("greet_sub")}</p>
              <button onClick={() => go("shop")} className="mt-3 flex items-center gap-2 rounded-md font-bold"
                style={{ background: c.goldBright, color: "#2C2110", height: 38, padding: "0 18px", fontSize: 13 }}>
                {t("shop_now")} <ArrowRight size={15} />
              </button>
            </div>
            <div className="shrink-0" style={{ marginBottom: -4 }}><FarmerFace id="f1" size={92} c={c} /></div>
          </div>
        </div>
      </div>

      {/* categories */}
      <div className="mt-6">
        <SectionHead c={c} title={t("quick_pick")} />
        <div className="flex gap-3 overflow-x-auto px-4 pb-1">
          {CATS.map(k => {
            const sample = PRODUCTS.find(p => p.cat === k.id);
            return (
              <button key={k.id} onClick={() => { setCat(k.id); go("shop"); }} className="shrink-0 text-center" style={{ width: 68 }}>
                <span className="grid place-items-center rounded-md"
                  style={{ width: 64, height: 64, background: c.peach, border: `1px solid ${c.line}`, boxShadow: lift(c) }}>
                  <Produce id={sample.id} size={40} />
                </span>
                <span className="mt-1.5 block text-xs font-semibold" style={{ color: c.ink }}>{k.label[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* the argument, as a tappable card */}
      <div className="mt-6 px-4">
        <button onClick={() => openProduct(tom.id)} className="block w-full text-left">
          <Sheet c={c} className="p-4">
            <div className="flex items-center gap-2">
              <Scale size={15} style={{ color: c.violet }} />
              <span className="text-xs font-bold uppercase" style={{ color: c.violet, letterSpacing: ".12em" }}>{t("price_journey")}</span>
              <ArrowRight size={14} className="ml-auto" style={{ color: c.muted }} />
            </div>
            <p className="mt-2 text-sm leading-snug" style={{ color: c.ink }}>
              {lang === 0 ? "Five hands touch your tomatoes. The farmer gets one."
                : "आपके टमाटर पाँच हाथों से गुज़रते हैं। किसान को एक मिलता है।"}
            </p>
            <div className="mt-3"><PriceRail c={c} t={t} p={tom} small /></div>
            <div className="mt-3 flex items-center gap-2">
              <Pill c={c} tone="green">{t("farmer_gets")} {inr(tom.farmer)}</Pill>
              <Pill c={c} tone="coral">{lang === 0 ? "Middlemen" : "बिचौलिये"} {inr(tom.retail - tom.farmer)}</Pill>
            </div>
          </Sheet>
        </button>
      </div>

      {/* picked today */}
      <div className="mt-6">
        <SectionHead c={c} title={t("fresh_today")} action={t("see_all_b")} onAction={() => go("shop")} />
        <div className="flex gap-3 overflow-x-auto px-4 pb-2">
          {fresh.map(p => (
            <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} wide qty={q(p.id)}
              add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
          ))}
        </div>
      </div>

      {/* farmers */}
      <div className="mt-6">
        <SectionHead c={c} title={t("our_farmers")} action={t("see_all_b")} onAction={() => go("shop")} />
        <div className="flex gap-3 overflow-x-auto px-4 pb-2">
          {FARMERS.map(f => (
            <button key={f.id} onClick={() => openStore(f.id)} className="shrink-0 text-left" style={{ width: 172 }}>
              <Sheet c={c} className="h-full p-3">
                <div className="flex items-center gap-2">
                  <FarmerFace id={f.id} size={44} c={c} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold" style={{ color: c.ink }}>{f.name[lang]}</div>
                    <div className="text-xs" style={{ color: c.muted }}>
                      {PRODUCTS.filter(x => x.fid === f.id).length} {lang === 0 ? "crops listed" : "फ़सलें सूचीबद्ध"}
                    </div>
                  </div>
                </div>
                <div className="mt-2 truncate text-xs" style={{ color: c.muted }}>{f.store[lang]}</div>
                <div className="mt-1 flex items-center gap-1 text-xs" style={{ color: c.muted }}>
                  <MapPin size={10} />{f.place[lang]} · {f.km} km
                </div>
              </Sheet>
            </button>
          ))}
        </div>
      </div>

      {/* biggest savings */}
      <div className="mt-6">
        <SectionHead c={c} title={t("deals")} />
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {deals.slice(0, 4).map(p => (
            <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} qty={q(p.id)}
              add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
          ))}
        </div>
      </div>

      {/* how it works */}
      <div className="mt-7">
        <SectionHead c={c} title={t("how_h")} />
        <div className="flex gap-3 overflow-x-auto px-4 pb-2">
          {steps.map(([kind, k, ks], i) => (
            <div key={i} className="shrink-0" style={{ width: 186 }}>
              <Sheet c={c} className="h-full p-4" tone={c.raise}>
                <div className="flex items-center justify-between">
                  <FolkFigure c={c} kind={kind} size={64} />
                  <span className="grid place-items-center rounded-md text-xs font-bold"
                    style={{ background: c.green, color: "#fff", width: 20, height: 20 }}>{i + 1}</span>
                </div>
                <div className="mt-1 text-sm font-bold" style={{ color: c.ink }}>{t(k)}</div>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: c.muted }}>{t(ks)}</p>
              </Sheet>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Shop({ c, t, lang, role, cat, setCat, openProduct, openStore, cart, addToCart, subFromCart }) {
  const [q, setQ] = useState(""), [radius, setRadius] = useState(50), [sort, setSort] = useState("near");
  const list = useMemo(() => {
    let l = PRODUCTS.map(p => ({ ...p, f: FARMERS.find(x => x.id === p.fid) }))
      .filter(p => p.f.km <= radius).filter(p => cat === "all" || p.cat === cat)
      .filter(p => !q.trim() || p.name[0].toLowerCase().includes(q.toLowerCase()) || p.name[1].includes(q));
    if (sort === "near") l.sort((a, b) => a.f.km - b.f.km);
    if (sort === "price") l.sort((a, b) => a.farmer - b.farmer);
    if (sort === "save") l.sort((a, b) => (b.retail - b.farmer) / b.retail - (a.retail - a.farmer) / a.retail);
    return l;
  }, [q, cat, radius, sort]);
  const qty = id => cart.find(x => x.id === id)?.qty;

  return (
    <div className="pb-4">
      <div className="sticky z-20 px-4 pb-3 pt-1" style={{ top: 72, background: c.bg }}>
        <div className="flex items-center gap-2 px-3" style={{ background: c.surface, borderRadius: RAD.chip, border: `1px solid ${c.line}`, height: 42, boxShadow: lift(c) }}>
          <Search size={16} style={{ color: c.muted }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("search_ph")}
            className="w-full bg-transparent text-sm outline-none" style={{ color: c.ink }} />
          {q && <button onClick={() => setQ("")} style={{ color: c.muted }}><X size={15} /></button>}
        </div>
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {[{ id: "all", label: [t("all"), t("all")] }, ...CATS].map(k => {
            const on = cat === k.id;
            return (
              <button key={k.id} onClick={() => setCat(k.id)} className="shrink-0 rounded-md px-3 py-1.5 text-xs font-bold"
                style={{
                  background: on ? c.green : c.surface, color: on ? "#fff" : c.muted,
                  border: `1px solid ${on ? c.green : c.line}`,
                }}>{k.label[lang]}</button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="rounded-md px-3 py-1.5 text-xs font-semibold outline-none"
          style={{ background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
          <option value="near">{t("sort_near")}</option>
          <option value="save">{t("sort_save")}</option>
          <option value="price">{t("sort_price")}</option>
        </select>
        <span className="ml-auto text-xs" style={{ color: c.muted }}>{t("within")}</span>
        <input type="range" min="5" max="50" step="5" value={radius} onChange={e => setRadius(+e.target.value)}
          className="w-20" style={{ accentColor: c.green }} />
        <span className="text-xs font-bold" style={{ ...num, color: c.ink }}>{radius}km</span>
      </div>

      <div className="mb-3 px-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {FARMERS.filter(f => f.km <= radius).map(f => (
            <button key={f.id} onClick={() => openStore(f.id)} className="shrink-0 text-center" style={{ width: 62 }}>
              <FarmerFace id={f.id} size={54} c={c} />
              <div className="truncate text-xs font-semibold" style={{ color: c.ink }}>{f.store[lang].split(" ")[0]}</div>
              <div className="text-xs" style={{ ...num, color: c.muted }}>{f.km}km</div>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="px-4 py-14 text-center">
          <FolkFigure c={c} kind="pick" size={90} />
          <p className="mt-2 text-sm" style={{ color: c.muted }}>
            {lang === 0 ? "No farm within this radius is listing that." : "इस दायरे में किसी खेत ने वह सूचीबद्ध नहीं किया।"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map(p => (
            <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} qty={qty(p.id)}
              add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
          ))}
        </div>
      )}
      {role === "retailer" && (
        <div className="mt-4 px-4"><Sheet c={c} className="flex items-center gap-2 p-3" tone={c.goldSoft}>
          <Boxes size={16} style={{ color: c.gold }} />
          <span className="text-xs" style={{ color: c.gold }}>{t("retail_min")}</span>
        </Sheet></div>
      )}
    </div>
  );
}

function ProductScreen({ c, t, lang, role, pid, openStore, openProduct, addToCart, go, wide }) {
  const p = PRODUCTS.find(x => x.id === pid), f = FARMERS.find(x => x.id === p.fid);
  const min = role === "retailer" ? 50 : 1, max = role === "retailer" ? 500 : 25, stepBy = role === "retailer" ? 10 : 1;
  const [qty, setQty] = useState(min);
  const bulk = role === "retailer" ? .93 : 1;
  const produce = p.farmer * bulk * qty, trans = transportFor(f.km), fee = produce * .02;
  const pay = produce + fee + trans / 2, shelf = p.retail * qty;

  return (
    <div className="pb-28">
      <div className="relative px-4 pt-1">
        <div className="relative overflow-hidden" style={{ background: c.peach, borderRadius: RAD.sheet, height: 190 }}>
          <div className="absolute inset-0 grid place-items-center opacity-10"><Rangoli c={c} size={210} col={c.green} /></div>
          <div className="absolute inset-0 grid place-items-center"><Produce id={p.id} size={132} /></div>
          <div className="absolute left-3 top-3 flex gap-2">
            <Pill c={c} tone="coral">−{Math.round(((p.retail - p.farmer) / p.retail) * 100)}%</Pill>
            {p.organic && <Pill c={c} tone="green">{lang === 0 ? "Organic" : "जैविक"}</Pill>}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 26, color: c.ink }}>{p.name[lang]}</h1>
        <p className="mt-1 text-xs" style={{ color: c.muted }}>
          {t("harvested")} {p.harvest === 0 ? (lang === 0 ? "this morning" : "आज सुबह")
            : `${p.harvest} ${lang === 0 ? "days ago" : "दिन पहले"}`} · {p.stock} {p.unit[lang]} {t("stock_left")}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 32, color: c.green }}>{inr(p.farmer * bulk)}</span>
          <span className="text-sm" style={{ color: c.muted }}>/{p.unit[lang]}</span>
          <span className="text-sm line-through" style={{ ...num, color: c.muted }}>{inr(p.retail)}</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: c.ink }}>{t("qty")}</span>
          <span className="flex items-center rounded-md" style={{ border: `1px solid ${c.line}`, background: c.surface, height: 40 }}>
            <button onClick={() => setQty(Math.max(min, qty - stepBy))} className="grid place-items-center" style={{ width: 40, color: c.ink }}><Minus size={16} /></button>
            <span className="text-center font-bold" style={{ ...num, width: 44, color: c.ink }}>{qty}</span>
            <button onClick={() => setQty(Math.min(max, qty + stepBy))} className="grid place-items-center" style={{ width: 40, color: c.ink }}><Plus size={16} /></button>
          </span>
          <span className="text-xs" style={{ color: c.muted }}>{p.unit[lang]}</span>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: role === "retailer" ? c.gold : c.muted }}>
          {role === "retailer" ? <Boxes size={12} className="mt-0.5 shrink-0" /> : <Users size={12} className="mt-0.5 shrink-0" />}
          {role === "retailer" ? t("retail_min") : t("consumer_cap")}
        </p>
      </div>

      <div className="mt-5 px-4">
        <Sheet c={c} className="p-4">
          <div className="flex items-center gap-2">
            <Scale size={15} style={{ color: c.violet }} />
            <span className="text-xs font-bold uppercase" style={{ color: c.violet, letterSpacing: ".12em" }}>{t("price_journey")}</span>
          </div>
          <div className="mt-3"><PriceRail c={c} t={t} p={p} /></div>
          <div className="mt-3 rounded-xl p-3" style={{ background: c.greenSoft }}>
            <p className="text-xs leading-relaxed" style={{ color: c.green }}>
              {lang === 0
                ? `In the open market only ${Math.round((p.farmer / p.retail) * 100)} paise of your rupee reaches the farm. Here the whole ${inr(p.farmer)} does.`
                : `खुले बाज़ार में आपके रुपये का सिर्फ़ ${Math.round((p.farmer / p.retail) * 100)} पैसा खेत तक पहुँचता है। यहाँ पूरा ${inr(p.farmer)} पहुँचता है।`}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs" style={{ color: c.muted }}>
            <span>{t("market_ref")}</span>
            <span style={{ ...num, fontWeight: 700, color: c.ink }}>{inr(p.mandi)}/{p.unit[lang]}</span>
          </div>
        </Sheet>
      </div>

      <div className="mt-4 px-4">
        <button onClick={() => openStore(f.id)} className="block w-full text-left">
          <Sheet c={c} className="flex items-center gap-3 p-3">
            <FarmerFace id={f.id} size={48} c={c} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold" style={{ color: c.ink }}>{f.store[lang]}</span>
                {f.verified && <CheckCircle2 size={13} style={{ color: c.green }} />}
              </div>
              <div className="truncate text-xs" style={{ color: c.muted }}>{f.name[lang]} · {f.km} {t("km_away")}</div>
            </div>
            <ArrowRight size={16} style={{ color: c.muted }} />
          </Sheet>
        </button>
      </div>

      <div className="mt-4 px-4">
        <Sheet c={c} className="p-4">
          {[[t("subtotal"), produce], [`${t("platform_fee")} 2%`, fee], [`${t("your_half")} · ${f.km}km`, trans / 2]].map(([l, v], i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span style={{ color: c.muted }}>{l}</span><span style={{ ...num, color: c.ink }}>{inr1(v)}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: c.goldSoft }}>
            <span className="text-xs font-bold" style={{ color: c.gold }}>{t("you_save")}</span>
            <span className="text-sm font-bold" style={{ ...num, color: c.gold }}>{inr(shelf - pay)}</span>
          </div>
        </Sheet>
      </div>

      <div className="mt-4 px-4">
        <Sheet c={c} className="flex items-center gap-3 p-4">
          <LockBox c={c} open={false} size={66} />
          <div>
            <div className="text-sm font-bold" style={{ color: c.ink }}>{t("escrow_h")}</div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: c.muted }}>{t("escrow_p")}</p>
          </div>
        </Sheet>
      </div>

      <div className="mt-5">
        <SectionHead c={c} title={t("more_from")} />
        <div className="flex gap-3 overflow-x-auto px-4 pb-2">
          {PRODUCTS.filter(x => x.fid === f.id && x.id !== p.id).map(x => (
            <button key={x.id} onClick={() => openProduct(x.id)} className="shrink-0" style={{ width: 108 }}>
              <Sheet c={c} className="p-2 text-center">
                <span className="mx-auto grid place-items-center rounded-xl" style={{ background: c.peach, height: 62 }}>
                  <Produce id={x.id} size={44} />
                </span>
                <div className="mt-1.5 truncate text-xs font-semibold" style={{ color: c.ink }}>{x.name[lang]}</div>
                <div className="text-xs font-bold" style={{ ...num, color: c.green }}>{inr(x.farmer)}</div>
              </Sheet>
            </button>
          ))}
        </div>
      </div>

      <ActionBar c={c} wide={wide} left={`${qty} ${p.unit[lang]} · ${t("total_word")}`} right={inr(pay)}
        label={t("add")} onClick={() => { addToCart(p.id, qty); go("cart"); }} />
    </div>
  );
}

function StoreScreen({ c, t, lang, fid, openProduct, cart, addToCart, subFromCart }) {
  const f = FARMERS.find(x => x.id === fid), items = PRODUCTS.filter(p => p.fid === fid);
  const avg = Math.round(items.reduce((s, p) => s + (p.retail - p.farmer) / p.retail, 0) / items.length * 100);
  const qty = id => cart.find(x => x.id === id)?.qty;
  return (
    <div className="pb-4">
      <div className="px-4 pt-1">
        <div className="relative overflow-hidden p-4" style={{ borderRadius: RAD.sheet, background: c.green, boxShadow: liftHi(c) }}>
          <div className="pointer-events-none absolute" style={{ right: -50, top: -50, opacity: .15 }}>
            <Rangoli c={c} size={180} col="#fff" />
          </div>
          <div className="relative flex items-center gap-3">
            <FarmerFace id={f.id} size={70} c={c} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate" style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, color: "#fff" }}>{f.store[lang]}</span>
                {f.verified && <CheckCircle2 size={14} color="#fff" />}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,.85)" }}>{f.name[lang]} · {f.place[lang]}</div>
              <div className="mt-1 flex gap-2">
                <span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(255,255,255,.2)", color: "#fff" }}>
                  {f.km} km
                </span>
              </div>
            </div>
          </div>
          <p className="relative mt-3 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,.9)" }}>{f.bio[lang]}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 px-4">
        {[[PRODUCTS.filter(x => x.fid === f.id).length, lang === 0 ? "crops listed" : "फ़सलें"],
          [f.since, t("since")], [`${avg}%`, lang === 0 ? "below shop price" : "दुकान से कम"]].map(([v, l], i) => (
          <Sheet c={c} key={i} className="p-3 text-center">
            <div style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 19, color: c.ink }}>{v}</div>
            <div className="text-xs" style={{ color: c.muted }}>{l}</div>
          </Sheet>
        ))}
      </div>

      <div className="mt-5">
        <SectionHead c={c} title={lang === 0 ? "In season right now" : "अभी मौसम में"} />
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map(p => (
            <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} qty={qty(p.id)}
              add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CartScreen({ c, t, lang, role, cart, addToCart, subFromCart, remove, go, placeOrder, addr, wide }) {
  const rows = cart.map(ci => {
    const p = PRODUCTS.find(x => x.id === ci.id), f = FARMERS.find(x => x.id === p.fid);
    return { ...ci, p, f, line: p.farmer * (role === "retailer" ? .93 : 1) * ci.qty };
  });
  if (!rows.length) return (
    <div className="px-6 py-16 text-center">
      <FolkFigure c={c} kind="pick" size={110} />
      <h2 className="mt-3" style={{ fontFamily: FD, fontWeight: 700, fontSize: 21, color: c.ink }}>{t("cart_empty_h")}</h2>
      <p className="mt-1 text-sm" style={{ color: c.muted }}>{t("empty_sub")}</p>
      <button onClick={() => go("shop")} className="mt-6 rounded-md font-bold"
        style={{ background: c.green, color: "#fff", height: 46, padding: "0 26px", boxShadow: `0 3px 0 0 ${c.greenDeep}` }}>
        {t("shop_now")}
      </button>
    </div>
  );
  const farms = [...new Set(rows.map(r => r.f.id))];
  const produce = rows.reduce((s, r) => s + r.line, 0);
  const trans = farms.reduce((s, id) => s + transportFor(FARMERS.find(f => f.id === id).km), 0);
  const fee = produce * .02, total = produce + fee + trans / 2;
  const shelf = rows.reduce((s, r) => s + r.p.retail * r.qty, 0);

  return (
    <div className="pb-32">
      <div className="px-4 pb-3">
        <Sheet c={c} className="flex items-center gap-2 p-3" tone={c.greenSoft}>
          <MapPin size={14} style={{ color: c.green }} />
          <span className="text-xs" style={{ color: c.green }}>{t("loc")} <b>{addr}</b></span>
        </Sheet>
      </div>
      {farms.map(fid => {
        const f = FARMERS.find(x => x.id === fid);
        return (
          <div key={fid} className="mb-3 px-4">
            <Sheet c={c} className="overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: c.raise, borderBottom: `1px solid ${c.line}` }}>
                <FarmerFace id={f.id} size={28} c={c} />
                <span className="truncate text-xs font-bold" style={{ color: c.ink }}>{f.store[lang]}</span>
                <span className="ml-auto text-xs" style={{ ...num, color: c.muted }}>
                  <Truck size={11} className="mr-1 inline" />{inr(transportFor(f.km) / 2)}
                </span>
              </div>
              {rows.filter(r => r.f.id === fid).map(r => (
                <div key={r.id} className="flex items-center gap-3 px-3 py-3" style={{ borderBottom: `1px solid ${c.line}` }}>
                  <span className="grid place-items-center rounded-xl" style={{ background: c.peach, width: 48, height: 48 }}>
                    <Produce id={r.p.id} size={34} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold" style={{ color: c.ink }}>{r.p.name[lang]}</div>
                    <div className="text-xs" style={{ ...num, color: c.muted }}>
                      {inr(r.p.farmer * (role === "retailer" ? .93 : 1))}/{r.p.unit[lang]}
                    </div>
                  </div>
                  <span style={{ ...num, fontWeight: 700, color: c.ink, fontSize: 14 }}>{inr(r.line)}</span>
                  <AddStepper c={c} qty={r.qty} add={() => addToCart(r.id)} sub={() => subFromCart(r.id)} small />
                  <button onClick={() => remove(r.id)} style={{ color: c.muted }}><Trash2 size={14} /></button>
                </div>
              ))}
            </Sheet>
          </div>
        );
      })}

      <div className="px-4">
        <Sheet c={c} className="p-4">
          {[[t("subtotal"), produce], [`${t("platform_fee")} 2%`, fee], [t("your_half"), trans / 2]].map(([l, v], i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span style={{ color: c.muted }}>{l}</span><span style={{ ...num, color: c.ink }}>{inr1(v)}</span>
            </div>
          ))}
          <div className="flex justify-between py-1 text-sm">
            <span style={{ color: c.muted }}>{t("farmer_half")}</span>
            <span style={{ ...num, color: c.muted }}>{inr1(trans / 2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-3" style={{ borderColor: c.line }}>
            <span className="text-sm font-bold" style={{ color: c.ink }}>{t("total")}</span>
            <span style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 22, color: c.ink }}>{inr(total)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: c.goldSoft }}>
            <span className="text-xs font-bold" style={{ color: c.gold }}>{t("you_save")}</span>
            <span className="text-sm font-bold" style={{ ...num, color: c.gold }}>{inr(shelf - total)}</span>
          </div>
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <Sheet c={c} className="flex items-center gap-3 p-4">
          <LockBox c={c} open={false} size={62} />
          <p className="text-xs leading-relaxed" style={{ color: c.muted }}>{t("escrow_p")}</p>
        </Sheet>
      </div>

      <ActionBar c={c} wide={wide} lift={wide ? 0 : 62} left={`${rows.length} ${t("items_word")}`} right={inr(total)} label={t("place")} onClick={placeOrder} />
    </div>
  );
}

const STEPS = ["st_placed", "st_held", "st_picked", "st_transit", "st_delivered", "st_released"];

function OrdersScreen({ c, t, lang, orders, advance, rate, go }) {
  if (!orders.length) return (
    <div className="px-6 py-16 text-center">
      <FolkFigure c={c} kind="van" size={110} />
      <h2 className="mt-3" style={{ fontFamily: FD, fontWeight: 700, fontSize: 21, color: c.ink }}>{t("orders_empty")}</h2>
      <button onClick={() => go("shop")} className="mt-6 rounded-md font-bold"
        style={{ background: c.green, color: "#fff", height: 46, padding: "0 26px", boxShadow: `0 3px 0 0 ${c.greenDeep}` }}>
        {t("shop_now")}
      </button>
    </div>
  );
  return (
    <div className="space-y-3 px-4 pb-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0">
      {orders.map(o => {
        const f = FARMERS.find(x => x.id === o.fid), done = o.step >= 5;
        return (
          <Sheet c={c} key={o.id} className="overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: c.raise, borderBottom: `1px solid ${c.line}` }}>
              <span className="text-xs font-bold" style={{ ...num, color: c.ink }}>{o.code}</span>
              <Pill c={c} tone={done ? "green" : o.step >= 4 ? "green" : "gold"}>{t(STEPS[o.step])}</Pill>
              <span className="ml-auto text-xs" style={{ color: c.muted }}>{o.date}</span>
            </div>
            <div className="flex gap-3 p-3">
              <LockBox c={c} open={done} size={64} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FarmerFace id={f.id} size={26} c={c} />
                  <span className="truncate text-sm font-bold" style={{ color: c.ink }}>{f.store[lang]}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {o.items.map(it => {
                    const p = PRODUCTS.find(x => x.id === it.id);
                    return (
                      <span key={it.id} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                        style={{ background: c.raise, color: c.ink }}>
                        <Produce id={p.id} size={18} />{p.name[lang]} <b style={num}>×{it.qty}</b>
                      </span>
                    );
                  })}
                </div>
              </div>
              <span style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 18, color: c.ink }}>{inr(o.total)}</span>
            </div>

            <div className="px-3 pb-3">
              <div className="flex items-center gap-1">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s}>
                    <span className="grid shrink-0 place-items-center rounded-md"
                      style={{
                        width: 18, height: 18, background: i <= o.step ? c.green : c.raise,
                        border: `1px solid ${i <= o.step ? c.green : c.line}`, color: "#fff",
                      }}>{i <= o.step && <Check size={10} />}</span>
                    {i < 5 && <span className="h-0.5 flex-1" style={{ background: i < o.step ? c.green : c.line }} />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-xs" style={{ color: done ? c.green : c.gold }}>
                {done ? <Wallet size={12} /> : <Lock size={12} />}
                {done ? `${t("released")} ${inr(o.farmerPayout)} → ${f.name[lang]}` : `${t("held")} ${inr(o.total)}`}
              </div>

              {o.step >= 4 && o.loss > 0 && (
                <div className="mt-3 rounded-xl p-3" style={{ background: c.greenSoft }}>
                  <div className="flex items-center gap-1.5">
                    <Shield size={13} style={{ color: c.green }} />
                    <span className="text-xs font-bold" style={{ color: c.green }}>{t("transit_loss")}</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs" style={{ color: c.green }}>
                    <span>{t("picked_qty")} <b style={num}>{o.pickup}kg</b></span>
                    <span>{t("del_qty")} <b style={num}>{o.pickup - o.loss}kg</b></span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed" style={{ color: c.green }}>{o.loss} kg {t("loss_covered")}</p>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                {o.step >= 4 && (o.rated ? <Pill c={c} tone="green">{t("rated")}</Pill>
                  : <div className="flex items-center gap-1">
                      <span className="text-xs" style={{ color: c.muted }}>{t("rate_farmer")}</span>
                      {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => rate(o.id)}><Star size={15} style={{ color: c.goldBright }} /></button>)}
                    </div>)}
                {o.step < 5 && (
                  <button onClick={() => advance(o.id)} className="ml-auto rounded-md px-3 py-1.5 text-xs font-bold"
                    style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }}>{t("advance")}</button>
                )}
              </div>
            </div>
          </Sheet>
        );
      })}
    </div>
  );
}

function MandiScreen({ c, t, lang, openProduct }) {
  const [sel, setSel] = useState("p1");
  const rows = MANDI.map(m => {
    const p = PRODUCTS.find(x => x.id === m.pid);
    return { ...m, p, modal: p.mandi * 100, nets: p.mandi * MANDI_NET_F };
  });
  const r = rows.find(x => x.pid === sel);
  const bars = [
    { l: [`Auction at ${r.centre[0]}`, `${r.centre[1]} की नीलामी`], v: r.p.mandi, col: c.muted },
    { l: ["Grower banks after costs", "लागत के बाद किसान के हाथ"], v: r.nets, col: c.red },
    { l: ["Grower's rate here", "यहाँ किसान की दर"], v: r.p.farmer, col: c.green },
    { l: ["Shop shelf", "दुकान का दाम"], v: r.p.retail, col: c.gold },
  ];
  const top = Math.max(...bars.map(b => b.v));
  return (
    <div className="pb-4">
      <div className="px-4">
        <div style={{
          background: c.slate, borderRadius: RAD.sheet, border: `7px solid ${c.wood}`,
          boxShadow: `inset 0 0 60px rgba(0,0,0,.5), ${lift(c)}`,
        }}>
          <div className="flex items-baseline justify-between px-4 pb-2 pt-4">
            <span style={{ fontFamily: FD, fontSize: 18, color: c.chalk }}>{lang === 0 ? "Mandi Bhav" : "मंडी भाव"}</span>
            <span style={{ ...num, fontSize: 11, color: c.chalk, opacity: .65 }}>13 SEP · 18:40</span>
          </div>
          <div className="mx-4" style={{ height: 1, background: c.chalk, opacity: .3 }} />
          <div className="px-2 pb-3 pt-1">
            {rows.map(x => (
              <button key={x.pid} onClick={() => setSel(x.pid)} className="flex w-full items-center gap-2 px-2 py-2.5 text-left"
                style={{
                  borderBottom: `1px dashed rgba(237,231,214,.2)`,
                  background: sel === x.pid ? "rgba(250,246,240,.09)" : "transparent",
                }}>
                <Produce id={x.pid} size={24} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm" style={{ color: c.chalk }}>{x.p.name[lang]}</span>
                  <span className="block text-xs" style={{ color: c.chalk, opacity: .6 }}>{x.centre[lang]} · {x.arrivals}t</span>
                </span>
                <Spark pts={x.trend} c={c} size={[48, 20]} />
                <span style={{ ...num, fontFamily: FD, fontSize: 17, color: c.chalk, width: 52, textAlign: "right" }}>
                  {x.modal.toLocaleString("en-IN")}
                </span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-3 text-xs" style={{ color: c.chalk, opacity: .5 }}>
            {lang === 0 ? "₹ per quintal · shape follows Agmarknet · sample values" : "₹ प्रति क्विंटल · ढाँचा Agmarknet जैसा · नमूना आँकड़े"}
          </div>
        </div>
      </div>

      <div className="mt-4 px-4">
        <Sheet c={c} className="p-4">
          <div className="flex items-center gap-2">
            <Produce id={r.pid} size={30} />
            <span className="text-sm font-bold" style={{ color: c.ink }}>{r.p.name[lang]}</span>
            <span className="ml-auto text-xs" style={{ color: c.muted }}>{lang === 0 ? "per" : "प्रति"} {r.p.unit[lang]}</span>
          </div>
          <div className="mt-3 space-y-2.5">
            {bars.map((b, i) => (
              <div key={i}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="text-xs" style={{ color: c.muted }}>{b.l[lang]}</span>
                  <span className="text-sm font-bold" style={{ ...num, color: b.col }}>{inr1(b.v)}</span>
                </div>
                <div className="h-2 rounded-md" style={{ background: c.raise }}>
                  <div className="h-2 rounded-md" style={{ width: `${(b.v / top) * 100}%`, background: b.col }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl p-3 text-xs leading-relaxed" style={{ background: c.greenSoft, color: c.green }}>
            {lang === 0
              ? `The auction number is not the farmer's number. After commission, loading and the trip in, ${inr1(r.p.mandi)} leaves about ${inr1(r.nets)} in hand. Sold here it leaves ${inr1(r.p.farmer)}, ${Math.round((r.p.farmer / r.nets - 1) * 100)}% more.`
              : `नीलामी का आँकड़ा किसान का आँकड़ा नहीं है। आढ़त, लदाई और फेरे के बाद ${inr1(r.p.mandi)} में से हाथ आते हैं ${inr1(r.nets)}। यहाँ बेचने पर मिलते हैं ${inr1(r.p.farmer)}, ${Math.round((r.p.farmer / r.nets - 1) * 100)}% ज़्यादा।`}
          </p>
          <button onClick={() => openProduct(r.pid)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md font-bold"
            style={{ height: 42, background: c.greenSoft, color: c.green, fontSize: 13 }}>
            {lang === 0 ? "See farms listing this" : "इसे बेचने वाले खेत देखें"} <ArrowRight size={15} />
          </button>
        </Sheet>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FARMER. Larger type, one action per screen
   ════════════════════════════════════════════════════════════ */
const ME = "f1";
const big = { fontFamily: FD, fontWeight: 700 };

const Says = ({ c, children }) => (
  <p className="mt-2 flex gap-2 text-sm leading-relaxed" style={{ color: c.muted }}>
    <span style={{ color: c.green }}>→</span>{children}
  </p>
);

function FarmerHome({ c, t, lang, go, orders, listings, startAdd }) {
  const me = FARMERS.find(f => f.id === ME);
  const paid = orders.filter(o => o.step >= 5).reduce((s, o) => s + o.farmerPayout, 0);
  const locked = orders.filter(o => o.step < 5).reduce((s, o) => s + o.farmerPayout, 0);
  const fresh = orders.filter(o => o.step < 4).length;
  const tom = PRODUCTS.find(p => p.id === "p1");

  return (
    <div className="pb-4" style={{ fontSize: 16 }}>
      <div className="px-4 pt-1">
        <div className="relative overflow-hidden" style={{ borderRadius: RAD.sheet, background: c.green, boxShadow: liftHi(c) }}>
          <Toran c={c} h={30} />
          <div className="pointer-events-none absolute" style={{ right: -50, bottom: -60, opacity: .15 }}>
            <Rangoli c={c} size={200} col="#fff" />
          </div>
          <div className="relative flex items-center gap-3 px-4 pt-2">
            <FarmerFace id={ME} size={58} c={c} />
            <div className="min-w-0">
              <div style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{t("namaste")}</div>
              <div className="truncate" style={{ ...big, fontSize: 21, color: "#fff" }}>{me.name[lang]}</div>
            </div>
          </div>
          <div className="relative px-4 pb-4 pt-4">
            <div style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{t("earned_today")}</div>
            <div style={{ ...big, ...num, fontSize: 42, color: "#fff", lineHeight: 1.1 }}>{inr(paid + locked)}</div>
            <div style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{orders.length} {t("three_orders")}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 px-4 lg:grid-cols-4">
        <Sheet c={c} className="p-3">
          <LockBox c={c} open={false} size={52} />
          <div className="mt-1" style={{ color: c.muted, fontSize: 13 }}>{t("money_waiting")}</div>
          <div style={{ ...big, ...num, fontSize: 22, color: c.gold }}>{inr(locked)}</div>
        </Sheet>
        <Sheet c={c} className="p-3">
          <LockBox c={c} open={true} size={52} />
          <div className="mt-1" style={{ color: c.muted, fontSize: 13 }}>{t("money_in_hand")}</div>
          <div style={{ ...big, ...num, fontSize: 22, color: c.green }}>{inr(paid)}</div>
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <button onClick={startAdd} className="flex w-full items-center justify-center gap-2 rounded-md"
          style={{ background: c.green, color: "#fff", height: 56, fontSize: 17, fontWeight: 700, boxShadow: `0 4px 0 0 ${c.greenDeep}` }}>
          <Plus size={22} /> {t("add_crop")}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4 lg:grid-cols-4">
        <button onClick={() => go("orders")}>
          <Sheet c={c} className="flex items-center gap-2 p-3">
            <span className="grid place-items-center rounded-md" style={{ width: 40, height: 40, background: c.redSoft, color: c.red }}>
              <PackageCheck size={19} />
            </span>
            <span className="text-left">
              <span className="block" style={{ ...big, ...num, fontSize: 19, color: c.ink }}>{fresh}</span>
              <span className="block" style={{ color: c.muted, fontSize: 13 }}>{t("new_orders")}</span>
            </span>
          </Sheet>
        </button>
        <button onClick={() => go("earn")}>
          <Sheet c={c} className="flex items-center gap-2 p-3">
            <span className="grid place-items-center rounded-md" style={{ width: 40, height: 40, background: c.goldSoft, color: c.gold }}>
              <Truck size={19} />
            </span>
            <span className="text-left">
              <span className="block" style={{ ...big, fontSize: 15, color: c.ink }}>6:10</span>
              <span className="block" style={{ color: c.muted, fontSize: 13 }}>{t("see_route")}</span>
            </span>
          </Sheet>
        </button>
      </div>

      <div className="mt-5 px-4">
        <Sheet c={c} className="p-4">
          <Stencil c={c}>{t("todays_mandi")}</Stencil>
          <div className="mt-3 flex items-center gap-3">
            <Produce id="p1" size={38} />
            <span className="flex-1" style={{ color: c.ink }}>{tom.name[lang]}</span>
            <span className="text-right">
              <span className="block" style={{ color: c.muted, fontSize: 12 }}>{t("mandi_says")}</span>
              <span className="block" style={{ ...big, ...num, fontSize: 19, color: c.muted }}>{inr(tom.mandi)}</span>
            </span>
            <span className="text-right">
              <span className="block" style={{ color: c.muted, fontSize: 12 }}>{t("you_get_here")}</span>
              <span className="block" style={{ ...big, ...num, fontSize: 19, color: c.green }}>{inr(tom.farmer)}</span>
            </span>
          </div>
          <Says c={c}>
            {lang === 0
              ? `The mandi calls ${inr(tom.mandi)}, but after commission and the trip you keep about ${inr1(tom.mandi * MANDI_NET_F)}. Here the whole ${inr(tom.farmer)} is yours.`
              : `मंडी में बोली ${inr(tom.mandi)} लगती है, पर आढ़त और फेरे के बाद हाथ आते हैं करीब ${inr1(tom.mandi * MANDI_NET_F)}। यहाँ पूरा ${inr(tom.farmer)} आपका है।`}
          </Says>
        </Sheet>
      </div>

      <div className="mt-5">
        <SectionHead c={c} title={t("nav_f_produce")} action={t("see_all")} onAction={() => go("produce")} />
        <div className="flex gap-3 overflow-x-auto px-4 pb-2">
          {listings.slice(0, 6).map((l, i) => {
            const p = PRODUCTS.find(x => x.id === l.pid);
            return (
              <div key={i} className="shrink-0" style={{ width: 120 }}>
                <Sheet c={c} className="p-3 text-center">
                  <span className="mx-auto grid place-items-center rounded-xl" style={{ background: c.peach, height: 60 }}>
                    <Produce id={p.id} size={42} />
                  </span>
                  <div className="mt-1.5 truncate text-sm" style={{ color: c.ink }}>{p.name[lang]}</div>
                  <div style={{ ...big, ...num, fontSize: 17, color: c.green }}>{inr(l.rate)}</div>
                </Sheet>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NumPad({ c, onKey }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "back"].map(k => (
        <button key={k} onClick={() => onKey(k)} className="grid place-items-center rounded-xl font-bold"
          style={{ height: 54, fontSize: 22, ...num, border: `1px solid ${c.line}`, background: c.surface, color: c.ink, boxShadow: lift(c) }}>
          {k === "back" ? <Delete size={20} /> : k}
        </button>
      ))}
    </div>
  );
}

function FarmerAdd({ c, t, lang, close, save }) {
  const [step, setStep] = useState(0), [pid, setPid] = useState(null);
  const [qty, setQty] = useState(""), [rate, setRate] = useState(""), [field, setField] = useState("qty");
  const [done, setDone] = useState(false);
  const p = pid ? PRODUCTS.find(x => x.id === pid) : null;
  const key = k => {
    const cur = field === "qty" ? qty : rate;
    const nxt = k === "back" ? cur.slice(0, -1) : (cur + k).replace(/^0+/, "").slice(0, 5);
    (field === "qty" ? setQty : setRate)(nxt);
  };
  const uniq = [];
  PRODUCTS.forEach(x => { if (!uniq.find(u => u.name[0] === x.name[0])) uniq.push(x); });

  if (done) return (
    <div className="px-5 py-10 text-center" style={{ fontSize: 16 }}>
      <div className="mx-auto grid place-items-center rounded-md" style={{ width: 86, height: 86, background: c.greenSoft }}>
        <Check size={44} style={{ color: c.green }} />
      </div>
      <h2 className="mt-4" style={{ ...big, fontSize: 24, color: c.ink }}>{t("live_now")}</h2>
      <div className="mt-5">
        <Sheet c={c} className="flex items-center gap-3 p-4 text-left">
          <span className="grid place-items-center rounded-xl" style={{ background: c.peach, width: 56, height: 56 }}>
            <Produce id={p.id} size={40} />
          </span>
          <div>
            <div style={{ ...big, fontSize: 18, color: c.ink }}>{p.name[lang]}</div>
            <div style={{ ...num, color: c.muted, fontSize: 14 }}>{qty} {p.unit[lang]}</div>
          </div>
          <div className="ml-auto text-right">
            <div style={{ ...big, ...num, fontSize: 22, color: c.green }}>{inr(+rate)}</div>
            <div style={{ color: c.muted, fontSize: 12 }}>/{p.unit[lang]}</div>
          </div>
        </Sheet>
      </div>
      <button onClick={() => { setDone(false); setStep(0); setPid(null); setQty(""); setRate(""); }}
        className="mt-6 w-full rounded-md" style={{ background: c.green, color: "#fff", height: 54, fontSize: 17, fontWeight: 700, boxShadow: `0 4px 0 0 ${c.greenDeep}` }}>
        {t("add_another")}
      </button>
      <button onClick={close} className="mt-3 w-full rounded-md"
        style={{ background: "transparent", border: `1px solid ${c.line}`, color: c.ink, height: 52, fontSize: 16, fontWeight: 700 }}>
        {t("nav_f_produce")}
      </button>
    </div>
  );

  return (
    <div className="px-4 pb-8" style={{ fontSize: 16 }}>
      <div className="mb-4 flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <span key={i} className="h-1.5 flex-1 rounded-md" style={{ background: i <= step ? c.green : c.line }} />
        ))}
        <span className="text-xs" style={{ ...num, color: c.muted }}>{step + 1} {t("step_of")} 3</span>
      </div>
      <h2 style={{ ...big, fontSize: 24, color: c.ink }}>{t(["step1", "step2", "step3"][step])}</h2>

      {step === 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {uniq.map(x => (
            <button key={x.id} onClick={() => { setPid(x.id); setRate(String(x.farmer)); setStep(1); }}
              className="grid place-items-center py-3"
              style={{ background: c.surface, borderRadius: RAD.card, border: `1px solid ${c.line}`, boxShadow: lift(c), minHeight: 100 }}>
              <Produce id={x.id} size={42} />
              <span className="mt-1 text-center text-xs font-semibold" style={{ color: c.ink }}>{x.name[lang]}</span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {[["qty", t("how_much"), qty, p.unit[lang]], ["rate", `${t("your_rate")} ${p.unit[lang]}`, rate, "₹"]].map(([f, label, val]) => (
              <button key={f} onClick={() => setField(f)} className="p-3 text-left"
                style={{
                  background: c.surface, borderRadius: RAD.card, boxShadow: lift(c),
                  border: `${field === f ? 2 : 1}px solid ${field === f ? c.green : c.line}`,
                }}>
                <div style={{ color: c.muted, fontSize: 13 }}>{label}</div>
                <div className="mt-1" style={{ ...big, ...num, fontSize: 28, color: val ? c.ink : c.line }}>
                  {f === "rate" && val ? "₹" : ""}{val || "0"}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl p-3" style={{ background: c.goldSoft }}>
            <Scale size={17} style={{ color: c.gold }} />
            <span style={{ color: c.gold, fontSize: 14 }}>
              {t("mandi_says")} <b style={num}>{inr(p.mandi)}</b> · {lang === 0 ? "in hand" : "हाथ आता"} <b style={num}>{inr1(p.mandi * MANDI_NET_F)}</b>
            </span>
          </div>
          <NumPad c={c} onKey={key} />
          <button onClick={() => qty && rate && setStep(2)} className="mt-4 w-full rounded-md"
            style={{ background: c.green, color: "#fff", height: 54, fontSize: 17, fontWeight: 700, boxShadow: `0 4px 0 0 ${c.greenDeep}` }}>
            {t("next")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4">
          <Sheet c={c} className="p-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center rounded-xl" style={{ background: c.peach, width: 60, height: 60 }}>
                <Produce id={p.id} size={44} />
              </span>
              <div>
                <div style={{ ...big, fontSize: 20, color: c.ink }}>{p.name[lang]}</div>
                <div style={{ ...num, color: c.muted, fontSize: 14 }}>{qty} {p.unit[lang]} · {inr(+rate)}/{p.unit[lang]}</div>
              </div>
            </div>
            <div className="mt-4 border-t pt-3" style={{ borderColor: c.line }}>
              <div style={{ color: c.muted, fontSize: 14 }}>{t("will_earn")}</div>
              <div style={{ ...big, ...num, fontSize: 36, color: c.green }}>{inr((+qty) * (+rate))}</div>
            </div>
          </Sheet>
          <button onClick={() => { save({ pid, rate: +rate, stock: +qty, live: true }); setDone(true); }}
            className="mt-5 w-full rounded-md"
            style={{ background: c.green, color: "#fff", height: 56, fontSize: 17, fontWeight: 700, boxShadow: `0 4px 0 0 ${c.greenDeep}` }}>
            {t("confirm")}
          </button>
          <button onClick={() => setStep(1)} className="mt-3 w-full rounded-md"
            style={{ border: `1px solid ${c.line}`, color: c.ink, height: 50, fontSize: 16, fontWeight: 700 }}>
            {t("back_b")}
          </button>
        </div>
      )}
    </div>
  );
}

function FarmerProduce({ c, t, lang, listings, toggle, startAdd }) {
  return (
    <div className="pb-24" style={{ fontSize: 16 }}>
      <div className="space-y-3 px-4">
        {listings.map((l, i) => {
          const p = PRODUCTS.find(x => x.id === l.pid);
          return (
            <Sheet c={c} key={i} className="flex items-center gap-3 p-3">
              <span className="grid shrink-0 place-items-center rounded-xl" style={{ background: c.peach, width: 58, height: 58 }}>
                <Produce id={p.id} size={42} />
              </span>
              <div className="min-w-0 flex-1">
                <div style={{ ...big, fontSize: 17, color: c.ink }}>{p.name[lang]}</div>
                <div style={{ ...num, color: c.muted, fontSize: 14 }}>{l.stock} {p.unit[lang]} {t("left_word")}</div>
                <div className="mt-1"><Pill c={c} tone={l.live ? "green" : "flat"}>{l.live ? t("on_sale") : t("paused")}</Pill></div>
              </div>
              <div className="text-right">
                <div style={{ ...big, ...num, fontSize: 21, color: c.green }}>{inr(l.rate)}</div>
                <button onClick={() => toggle(i)} className="mt-1 grid place-items-center rounded-md"
                  style={{ width: 40, height: 40, border: `1px solid ${c.line}`, color: c.ink, marginLeft: "auto" }}>
                  {l.live ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            </Sheet>
          );
        })}
      </div>
      <div className="fixed bottom-0 left-1/2 z-40 w-full px-4 pb-20" style={{ maxWidth: 430, transform: "translateX(-50%)" }}>
        <button onClick={startAdd} className="flex w-full items-center justify-center gap-2 rounded-md"
          style={{ background: c.green, color: "#fff", height: 54, fontSize: 17, fontWeight: 700, boxShadow: `0 6px 18px -6px ${c.cast}, 0 4px 0 0 ${c.greenDeep}` }}>
          <Plus size={21} /> {t("add_crop")}
        </button>
      </div>
    </div>
  );
}

function FarmerOrders({ c, t, lang, orders, advance, rate }) {
  return (
    <div className="space-y-3 px-4 pb-4" style={{ fontSize: 16 }}>
      {orders.map(o => {
        const paid = o.step >= 5;
        return (
          <Sheet c={c} key={o.id} className="p-4">
            <div className="flex items-start gap-3">
              <LockBox c={c} open={paid} size={70} />
              <div className="min-w-0 flex-1">
                <div style={{ ...big, fontSize: 17, color: c.ink }}>{o.buyer[lang]}</div>
                <div style={{ color: c.muted, fontSize: 13 }}>{o.date}</div>
                <div className="mt-1"><Pill c={c} tone={paid ? "green" : "gold"}>{t(STEPS[o.step])}</Pill></div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.items.map(it => {
                const p = PRODUCTS.find(x => x.id === it.id);
                return (
                  <span key={it.id} className="flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                    style={{ background: c.raise, color: c.ink }}>
                    <Produce id={p.id} size={20} />{p.name[lang]} <b style={num}>×{it.qty}</b>
                  </span>
                );
              })}
            </div>
            <div className="mt-3 flex items-end justify-between border-t pt-3" style={{ borderColor: c.line }}>
              <div>
                <div style={{ color: c.muted, fontSize: 13 }}>{paid ? t("released") : t("held")}</div>
                <div style={{ ...big, ...num, fontSize: 26, color: paid ? c.green : c.gold }}>{inr(o.farmerPayout)}</div>
              </div>
              <div className="text-right" style={{ color: c.muted, fontSize: 13 }}>
                {t("transport")} {inr(o.transport)}<br />
                <span style={{ color: c.ink }}>{lang === 0 ? "your half" : "आपका आधा"} {inr(o.transport / 2)}</span>
              </div>
            </div>

            {o.step >= 4 && o.loss > 0 && (
              <div className="mt-3 rounded-xl p-3" style={{ background: c.greenSoft }}>
                <div className="flex items-center gap-1.5">
                  <Shield size={15} style={{ color: c.green }} />
                  <span className="text-sm font-bold" style={{ color: c.green }}>{t("transit_loss")}</span>
                </div>
                <div className="mt-1.5 flex gap-4 text-sm" style={{ color: c.green }}>
                  <span>{t("picked_qty")} <b style={num}>{o.pickup}kg</b></span>
                  <span>{t("del_qty")} <b style={num}>{o.pickup - o.loss}kg</b></span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: c.green }}>{o.loss} kg {t("loss_covered")}</p>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {o.step >= 4 && (o.ratedBuyer ? <Pill c={c} tone="green">{t("rated")}</Pill>
                : <div className="flex items-center gap-1">
                    <span className="text-sm" style={{ color: c.muted }}>{t("rate_buyer")}</span>
                    {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => rate(o.id)}><Star size={18} style={{ color: c.goldBright }} /></button>)}
                  </div>)}
              {o.step < 5 && (
                <button onClick={() => advance(o.id)} className="ml-auto rounded-md px-5"
                  style={{ background: c.green, color: "#fff", height: 46, fontSize: 15, fontWeight: 700, boxShadow: `0 3px 0 0 ${c.greenDeep}` }}>
                  {t(STEPS[o.step + 1])}
                </button>
              )}
            </div>
          </Sheet>
        );
      })}
    </div>
  );
}

function FarmerEarnings({ c, t, lang }) {
  const [per, setPer] = useState("year");
  const m = per === "day" ? 1 / 365 : per === "week" ? 7 / 365 : per === "month" ? 1 / 12 : 1;
  const rev = MONTHLY.reduce((s, x) => s + x.rev, 0) * m, exp = MONTHLY.reduce((s, x) => s + x.exp, 0) * m;
  const tx = { fill: c.muted, fontSize: 10 };
  const best = CROP_PROFIT[0];
  const tip = { background: c.surface, border: `1px solid ${c.line}`, borderRadius: 10, color: c.ink, fontSize: 12 };

  return (
    <div className="pb-4 pt-1" style={{ fontSize: 16 }}>
      <div className="mb-3 flex gap-2 overflow-x-auto px-4">
        {["day", "week", "month", "year"].map(k => (
          <button key={k} onClick={() => setPer(k)} className="shrink-0 rounded-md px-4 text-sm font-bold"
            style={{
              height: 40, background: per === k ? c.green : c.surface, color: per === k ? "#fff" : c.muted,
              border: `1px solid ${per === k ? c.green : c.line}`,
            }}>{t(k)}</button>
        ))}
      </div>

      <div className="px-4">
        <Sheet c={c} className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {[[t("sold_word"), rev, c.ink], [t("spent_word"), exp, c.red], [t("kept_word"), rev - exp, c.green]].map(([l, v, col], i) => (
              <div key={i}>
                <Stencil c={c}>{l}</Stencil>
                <div style={{ ...big, ...num, fontSize: i === 2 ? 24 : 20, color: col }}>{inr(v)}</div>
              </div>
            ))}
          </div>
          <Says c={c}>
            {lang === 0 ? `Out of every ₹100 you sold, ₹${Math.round(((rev - exp) / rev) * 100)} stayed with you.`
              : `आपने जो ₹100 बेचा, उसमें से ₹${Math.round(((rev - exp) / rev) * 100)} आपके पास रहे।`}
          </Says>
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <Sheet c={c} className="flex items-center gap-3 p-4">
          <Scale size={24} style={{ color: c.green }} />
          <div>
            <div style={{ color: c.muted, fontSize: 13 }}>{t("per_unit_got")}</div>
            <div style={{ ...big, ...num, fontSize: 24, color: c.green }}>₹18.40</div>
          </div>
          <div className="ml-auto text-right">
            <div style={{ color: c.muted, fontSize: 13 }}>{t("mandi_would")}</div>
            <div style={{ ...big, ...num, fontSize: 20, color: c.muted }}>₹15.70</div>
          </div>
        </Sheet>
      </div>

      <div className="mt-4 px-4">
        <Sheet c={c} className="p-4">
          <Stencil c={c}>{t("chart_month_h")}</Stencil>
          <div className="mt-2" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY.map(x => ({ name: x.m[lang], ...x }))} margin={{ top: 4, right: 2, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.green} stopOpacity={.4} /><stop offset="100%" stopColor={c.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={c.line} vertical={false} />
                <XAxis dataKey="name" tick={tx} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={tx} axisLine={false} tickLine={false} tickFormatter={v => v / 1000 + "k"} />
                <Tooltip formatter={v => inr(v)} contentStyle={tip} />
                <Area type="monotone" dataKey="rev" stroke={c.green} strokeWidth={2} fill="url(#gR)" name={t("sold_word")} />
                <Line type="monotone" dataKey="profit" stroke={c.goldBright} strokeWidth={2} dot={false} name={t("kept_word")} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Says c={c}>
            {lang === 0 ? "March was your best month. Winter vegetables sell for more than summer ones."
              : "मार्च सबसे अच्छा महीना रहा। जाड़े की सब्ज़ी गर्मी वाली से ज़्यादा भाव पाती है।"}
          </Says>
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <Sheet c={c} className="p-4">
          <Stencil c={c}>{t("chart_crop_h")}</Stencil>
          <div className="mt-2" style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CROP_PROFIT.map(x => ({ name: x.c[lang], p: x.p }))} layout="vertical" margin={{ top: 0, right: 8, left: 2, bottom: 0 }}>
                <CartesianGrid stroke={c.line} horizontal={false} />
                <XAxis type="number" tick={tx} axisLine={false} tickLine={false} tickFormatter={v => v / 1000 + "k"} />
                <YAxis type="category" dataKey="name" tick={tx} axisLine={false} tickLine={false} width={62} />
                <Tooltip cursor={{ fill: c.greenSoft }} formatter={v => inr(v)} contentStyle={tip} />
                <Bar dataKey="p" radius={[0, 4, 4, 0]}>
                  {CROP_PROFIT.map((x, i) => <Cell key={i} fill={c.green} opacity={1 - i * .14} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Says c={c}>
            {lang === 0 ? `${best.c[0]} paid the most this year, ${inr(best.p)}. Consider more land next season.`
              : `इस साल सबसे ज़्यादा ${best.c[1]} ने दिया, ${inr(best.p)}। अगली बार थोड़ी और ज़मीन दे सकते हैं।`}
          </Says>
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <Sheet c={c} className="p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={15} style={{ color: c.gold }} />
            <Stencil c={c} col={c.gold}>{t("demand_h")}</Stencil>
          </div>
          <div className="mt-2" style={{ height: 165 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST.map(x => ({ name: x.w[lang], ...x }))} margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                <CartesianGrid stroke={c.line} vertical={false} />
                <XAxis dataKey="name" tick={tx} axisLine={false} tickLine={false} />
                <YAxis tick={tx} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} />
                <Line type="monotone" dataKey="tomato" stroke={c.red} strokeWidth={2} dot={false} name={lang === 0 ? "Tomato" : "टमाटर"} />
                <Line type="monotone" dataKey="onion" stroke={c.goldBright} strokeWidth={2} dot={false} name={lang === 0 ? "Onion" : "प्याज़"} />
                <Line type="monotone" dataKey="leafy" stroke={c.green} strokeWidth={2} dot={false} name={lang === 0 ? "Leafy" : "पत्तेदार"} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Says c={c}>
            {lang === 0 ? "Tomato buyers rise sharply in week 4. Holding about 120 kg back is worth roughly ₹1,900 more."
              : "चौथे हफ़्ते टमाटर के खरीदार तेज़ी से बढ़ेंगे। करीब 120 किलो रोकना लगभग ₹1,900 ज़्यादा देगा।"}
          </Says>
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <Sheet c={c} className="p-4">
          <div className="flex items-center gap-2">
            <Route size={15} style={{ color: c.green }} />
            <Stencil c={c}>{t("route_h")}</Stencil>
          </div>
          <svg viewBox="0 0 100 100" className="mt-3 w-full" style={{ height: 120 }} preserveAspectRatio="none">
            <path d={ROUTE_STOPS.map((s, i) => `${i ? "L" : "M"}${s.x} ${s.y}`).join(" ")} stroke={c.green}
              strokeWidth="1.4" fill="none" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
            {ROUTE_STOPS.map((s, i) => (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r="4" fill={i === 0 ? c.goldBright : c.green} />
                <text x={s.x} y={s.y + 1.6} textAnchor="middle" fontSize="4.4" fontWeight="700" fill="#fff">{i === 0 ? "F" : i}</text>
              </g>
            ))}
          </svg>
          <div className="mt-2 space-y-1.5">
            {ROUTE_STOPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span style={{ ...num, color: c.muted, width: 42 }}>{s.t}</span>
                <span className="flex-1 truncate" style={{ color: c.ink }}>{s.n[lang]}</span>
                <span style={{ ...num, color: c.muted }}>{s.km ? s.km + "km" : "start"}</span>
              </div>
            ))}
          </div>
          <Says c={c}>
            {lang === 0 ? "Four drops in one trip: 35 km instead of 58, about ₹137 saved on diesel."
              : "चार जगह एक ही फेरे में: 58 की जगह 35 किमी, डीज़ल में करीब ₹137 की बचत।"}
          </Says>
        </Sheet>
      </div>
    </div>
  );
}

/* ── legal pages ───────────────────────────────────────────── */
/* Written for an Indian marketplace: the platform is an intermediary,
   not the seller. Grievance timelines follow the Consumer Protection
   (E-Commerce) Rules 2020; data handling follows the DPDP Act 2023. */
const PRIVACY = [
  { h: ["What we collect", "हम क्या लेते हैं"],
    p: ["Your name, mobile number, delivery address and pincode. Your order history. For farmers, the bank or UPI account that receives payouts. Nothing else.",
        "आपका नाम, मोबाइल नंबर, पता और पिनकोड। आपके ऑर्डर का ब्योरा। किसानों का वह बैंक या UPI खाता जिसमें भुगतान जाता है। इसके अलावा कुछ नहीं।"] },
  { h: ["Why we collect it", "क्यों लेते हैं"],
    p: ["To show you farms near your pincode, to deliver your order, and to pay the farmer. We do not build advertising profiles and we do not sell data to anyone.",
        "आपके पिनकोड के पास के खेत दिखाने, ऑर्डर पहुँचाने और किसान को भुगतान करने के लिए। हम विज्ञापन प्रोफ़ाइल नहीं बनाते और किसी को डेटा नहीं बेचते।"] },
  { h: ["Who else sees it", "और कौन देखता है"],
    p: ["The farmer you order from sees your name and delivery address. The delivery partner sees the address. The payment processor sees the transaction. That is the full list.",
        "जिस किसान से आप लेते हैं वह आपका नाम और पता देखता है। डिलीवरी वाला पता देखता है। भुगतान प्रोसेसर लेन-देन देखता है। सूची इतनी ही है।"] },
  { h: ["Your farming record", "आपका काम का खाता"],
    p: ["A farmer's sales record belongs to that farmer. You can export it at any time and you can ask us to delete it. We will not share it with a lender or an agency without your written consent.",
        "किसान का बिक्री रिकॉर्ड उसी किसान का है। आप जब चाहें उसे निर्यात कर सकते हैं और मिटाने को कह सकते हैं। आपकी लिखित सहमति के बिना हम इसे किसी ऋणदाता या संस्था को नहीं देंगे।"] },
  { h: ["How long we keep it", "कब तक रखते हैं"],
    p: ["Order and payment records for eight years, as tax law requires. Everything else is deleted within 30 days of you closing your account.",
        "ऑर्डर और भुगतान का रिकॉर्ड आठ साल, जैसा कर कानून कहता है। बाकी सब खाता बंद करने के 30 दिन के भीतर मिटा दिया जाता है।"] },
  { h: ["Your rights", "आपके अधिकार"],
    p: ["Under the Digital Personal Data Protection Act 2023 you may ask for a copy of your data, correct it, or withdraw consent. Write to the grievance officer below and we will act within 30 days.",
        "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के तहत आप अपने डेटा की प्रति माँग सकते हैं, उसे सुधार सकते हैं, या सहमति वापस ले सकते हैं। नीचे दिए शिकायत अधिकारी को लिखें, हम 30 दिन में कार्रवाई करेंगे।"] },
];

const TERMS = [
  { h: ["What Kisan Setu is", "किसान सेतु क्या है"],
    p: ["A marketplace. The farmer is the seller and the seller of record. We do not own the produce, do not set the price, and are an intermediary under the Consumer Protection (E-Commerce) Rules 2020.",
        "एक बाज़ार। किसान ही विक्रेता है। उपज हमारी नहीं है, दाम हम तय नहीं करते, और उपभोक्ता संरक्षण (ई-कॉमर्स) नियम 2020 के तहत हम बिचौलिया मंच हैं।"] },
  { h: ["Who sets the price", "दाम कौन तय करता है"],
    p: ["The farmer. We show the mandi reference rate as a hint and flag a listing far above the band for review, but the rate on the listing is the farmer's own.",
        "किसान। हम मंडी की दर संकेत के रूप में दिखाते हैं और सीमा से बहुत ऊपर की सूची जाँच के लिए चिह्नित करते हैं, पर भाव किसान का अपना है।"] },
  { h: ["Two kinds of buyer account", "खरीदार खाते दो तरह के"],
    p: ["A household account may order up to 25 units per product per order. A shopkeeper account has a 50-unit minimum and a trade rate. Using a household account to buy for resale ends the account.",
        "घरेलू खाता प्रति उत्पाद प्रति ऑर्डर 25 यूनिट तक ले सकता है। दुकानदार खाते की न्यूनतम सीमा 50 यूनिट और व्यापार दर है। दोबारा बेचने के लिए घरेलू खाते का उपयोग करने पर खाता बंद कर दिया जाएगा।"] },
  { h: ["Transport", "ढुलाई"],
    p: ["The transport cost for an order is split evenly between farmer and buyer. Both see the same figure before the order is confirmed.",
        "ऑर्डर की ढुलाई किसान और खरीदार में आधी-आधी बँटती है। पुष्टि से पहले दोनों को एक ही आँकड़ा दिखता है।"] },
  { h: ["Payment and escrow", "भुगतान और एस्क्रो"],
    p: ["Your payment is held by Kisan Setu and released to the farmer after you confirm delivery. If you do not confirm within 48 hours of delivery, it is released automatically.",
        "आपका भुगतान किसान सेतु के पास रहता है और डिलीवरी की पुष्टि पर किसान को जारी होता है। डिलीवरी के 48 घंटे में पुष्टि न होने पर वह अपने आप जारी हो जाता है।"] },
  { h: ["Transit loss", "परिवहन हानि"],
    p: ["Crates are weighed at pickup and at delivery. A verified shortfall is paid from the protection fund, which is funded by the platform fee. It is not deducted from the farmer and not added to your bill.",
        "सामान उठाते और पहुँचाते समय तौला जाता है। सत्यापित कमी सुरक्षा कोष से भरी जाती है, जो प्लेटफ़ॉर्म शुल्क से चलता है। न किसान से कटती है, न आपके बिल में जुड़ती है।"] },
  { h: ["Cancellation and refund", "रद्द और वापसी"],
    p: ["Cancel free of charge until the crate is picked up. After pickup, perishable produce cannot be cancelled, but anything that arrives spoiled is refunded in full within five working days.",
        "सामान उठने तक रद्द करना मुफ़्त है। उठने के बाद जल्दी खराब होने वाली उपज रद्द नहीं होती, पर खराब पहुँचने पर पाँच कार्य दिवसों में पूरा पैसा लौटाया जाता है।"] },
  { h: ["Ratings", "रेटिंग"],
    p: ["Only a buyer and a farmer who completed an order together may rate each other. We do not write, buy, edit or delete ratings, except to remove abuse.",
        "केवल वही खरीदार और किसान एक-दूसरे को रेटिंग दे सकते हैं जिन्होंने साथ ऑर्डर पूरा किया हो। हम रेटिंग न लिखते हैं, न खरीदते हैं, न बदलते हैं, न हटाते हैं, सिवाय दुर्व्यवहार हटाने के।"] },
  { h: ["Complaints", "शिकायत"],
    p: ["Write to the grievance officer. We acknowledge within 48 hours and resolve within one month, as the Consumer Protection (E-Commerce) Rules 2020 require. Disputes fall under the courts at Ghaziabad, Uttar Pradesh.",
        "शिकायत अधिकारी को लिखें। उपभोक्ता संरक्षण (ई-कॉमर्स) नियम 2020 के अनुसार हम 48 घंटे में पावती और एक माह में समाधान देते हैं। विवाद ग़ाज़ियाबाद, उत्तर प्रदेश के न्यायालयों के अधीन हैं।"] },
];

function Legal({ c, t, lang, tab, setTab }) {
  const doc = tab === "privacy" ? PRIVACY : TERMS;
  return (
    <div className="px-4 pb-6">
      <div className="mb-4 flex gap-2">
        {[["privacy", ["Privacy policy", "निजता नीति"]], ["terms", ["Terms and conditions", "नियम और शर्तें"]]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-md px-3 py-2 text-sm font-semibold"
            style={{
              background: tab === k ? c.greenSoft : c.surface, color: tab === k ? c.green : c.muted,
              border: `1px solid ${tab === k ? c.green : c.line}`,
            }}>{l[lang]}</button>
        ))}
      </div>

      <Sheet c={c} className="p-5">
        <p className="text-xs" style={{ color: c.muted }}>
          {lang === 0 ? "Last updated 5 September 2026. Kisan Setu is a prototype built for Smart India Hackathon 2026 and is not yet operating commercially. These pages state the terms the service will run on."
            : "अंतिम बदलाव 5 सितंबर 2026। किसान सेतु स्मार्ट इंडिया हैकाथॉन 2026 के लिए बनाया गया प्रोटोटाइप है और अभी व्यावसायिक रूप से नहीं चल रहा। ये पन्ने बताते हैं कि सेवा किन शर्तों पर चलेगी।"}
        </p>
        <div className="mt-4 space-y-5">
          {doc.map((sec, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold" style={{ color: c.ink }}>{sec.h[lang]}</h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: c.muted }}>{sec.p[lang]}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md p-4" style={{ background: c.raise }}>
          <h3 className="text-sm font-bold" style={{ color: c.ink }}>
            {lang === 0 ? "Grievance officer" : "शिकायत अधिकारी"}
          </h3>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: c.muted }}>
            {lang === 0 ? "Name and contact details are published here before launch, as required. Acknowledgement within 48 hours, resolution within one month."
              : "नाम और संपर्क शुरू होने से पहले यहाँ प्रकाशित किए जाएँगे, जैसा अनिवार्य है। 48 घंटे में पावती, एक माह में समाधान।"}
          </p>
        </div>
      </Sheet>
    </div>
  );
}

/* ── responsive: one codebase, two shells ──────────────────── */
function useViewport() {
  const [w, setW] = useState(typeof window === "undefined" ? 1280 : window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

/* The web header. Same tabs, laid out along the top instead of the bottom. */
function TopNav({ c, t, lang, setLang, dark, setDark, tabs, view, go, cartCount, role, openGate, addr, setAddr, mobilePreview, setMobilePreview }) {
  return (
    <header className="sticky top-0 z-30" style={{ background: c.bg, borderBottom: `1px solid ${c.line}` }}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
        <button onClick={() => go(tabs[0][0])} className="flex shrink-0 items-center gap-2.5">
          <Logo size={34} green={c.green} gold={c.goldBright} />
          <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, color: c.ink }}>{t("brand")}</span>
        </button>

        <nav className="ml-4 flex items-center gap-1">
          {tabs.filter(([id]) => id !== "cart").map(([id, label, Ic]) => {
            const on = view === id;
            return (
              <button key={id} onClick={() => go(id)} className="relative flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold"
                style={{ color: on ? c.green : c.muted, background: on ? c.greenSoft : "transparent" }}>
                <Ic size={15} />{label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-md px-3 lg:flex"
            style={{ background: c.surface, border: `1px solid ${c.line}`, height: 36 }}>
            <MapPin size={13} style={{ color: c.green }} />
            <input value={addr} onChange={e => setAddr(e.target.value)}
              className="w-32 bg-transparent text-xs font-semibold outline-none" style={{ color: c.ink }} />
          </span>
          <button onClick={() => setMobilePreview(!mobilePreview)} title="Switch view"
            className="grid place-items-center rounded-md"
            style={{ width: 36, height: 36, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {mobilePreview ? <Monitor size={15} /> : <Smartphone size={15} />}
          </button>
          <button onClick={() => setLang(lang === 0 ? 1 : 0)} className="grid place-items-center rounded-md text-xs font-bold"
            style={{ width: 36, height: 36, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {lang === 0 ? "अ" : "A"}
          </button>
          <button onClick={() => setDark(!dark)} className="grid place-items-center rounded-md"
            style={{ width: 36, height: 36, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {role !== "farmer" && (
            <button onClick={() => go("cart")} className="relative grid place-items-center rounded-md"
              style={{ width: 36, height: 36, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
              <ShoppingCart size={15} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid place-items-center rounded-md text-xs font-bold"
                  style={{ background: c.coral, color: "#fff", minWidth: 17, height: 17, fontSize: 10 }}>{cartCount}</span>
              )}
            </button>
          )}
          <button onClick={openGate} className="grid place-items-center overflow-hidden rounded-md"
            style={{ width: 36, height: 36, border: `1px solid ${c.line}` }}>
            {role === "farmer" ? <FarmerFace id={ME} size={34} c={c} />
              : <span className="grid h-full w-full place-items-center" style={{ background: c.violetSoft, color: c.violet }}>
                  <Users size={15} />
                </span>}
          </button>
        </div>
      </div>
      <BlockPrint c={c} col={c.wood} op={.22} h={10} />
    </header>
  );
}

/* ── seeds ─────────────────────────────────────────────────── */
const BUYER_ORDERS = [
  { id: 1, code: "KS-2418", fid: "f3", step: 4, date: "12 Sep", items: [{ id: "p8", qty: 10 }],
    total: 520, transport: 113, farmerPayout: 507, pickup: 10, loss: .6, rated: false },
  { id: 2, code: "KS-2415", fid: "f1", step: 2, date: "12 Sep", items: [{ id: "p1", qty: 6 }, { id: "p3", qty: 3 }],
    total: 178, transport: 37, farmerPayout: 163, pickup: 9, loss: 0, rated: false },
  { id: 3, code: "KS-2409", fid: "f5", step: 5, date: "10 Sep", items: [{ id: "p13", qty: 8 }, { id: "p14", qty: 1 }],
    total: 976, transport: 205, farmerPayout: 958, pickup: 9, loss: 0, rated: true },
];
const FARM_ORDERS = [
  { id: 11, code: "KS-2418", buyer: ["Neha Sharma, Indirapuram", "नेहा शर्मा, इंदिरापुरम"], step: 5, date: "13 Sep",
    items: [{ id: "p1", qty: 8 }, { id: "p3", qty: 4 }], transport: 74, farmerPayout: 3560, pickup: 12, loss: 0, ratedBuyer: true },
  { id: 12, code: "KS-2417", buyer: ["Gupta Sabzi Store, Vaishali", "गुप्ता सब्ज़ी स्टोर, वैशाली"], step: 2, date: "13 Sep",
    items: [{ id: "p2", qty: 60 }], transport: 74, farmerPayout: 1260, pickup: 60, loss: 0, ratedBuyer: false },
  { id: 13, code: "KS-2412", buyer: ["Arun Verma, Noida 62", "अरुण वर्मा, नोएडा 62"], step: 4, date: "12 Sep",
    items: [{ id: "p1", qty: 25 }], transport: 86, farmerPayout: 450, pickup: 25, loss: 1.2, ratedBuyer: false },
];

/* ── app ───────────────────────────────────────────────────── */
export default function KisanSetu() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState(0);
  const [role, setRole] = useState(null);
  const [gate, setGate] = useState(false);
  const [view, setView] = useState("home");
  const [stack, setStack] = useState(null);        // pushed screen over the tabs
  const [pid, setPid] = useState("p1");
  const [fid, setFid] = useState("f1");
  const [cat, setCat] = useState("all");
  const [addr, setAddr] = useState("Ghaziabad 201009");
  const [cart, setCart] = useState([]);
  const [bOrders, setBOrders] = useState(BUYER_ORDERS);
  const [fOrders, setFOrders] = useState(FARM_ORDERS);
  const [listings, setListings] = useState(
    PRODUCTS.filter(p => p.fid === ME).map(p => ({ pid: p.id, rate: p.farmer, stock: p.stock, live: true })));
  const [mobilePreview, setMobilePreview] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");
  const vw = useViewport();
  const desktop = vw >= 1024 && !mobilePreview;

  const c = dark ? PALETTE.dark : PALETTE.light;
  const t = k => (S[k] ? S[k][lang] : k);
  const top = () => window.scrollTo({ top: 0 });
  const go = v => { setStack(null); setView(v); top(); };
  const push = s => { setStack(s); top(); };
  const pop = () => { setStack(null); top(); };

  const pick = r => {
    setRole(r); setGate(false); setStack(null);
    setLang(r === "farmer" ? 1 : 0);
    setView("home"); top();
  };
  const openProduct = id => { setPid(id); push("product"); };
  const openStore = id => { setFid(id); push("store"); };
  const addToCart = (id, q = role === "retailer" ? 50 : 1) =>
    setCart(cs => cs.find(x => x.id === id) ? cs.map(x => x.id === id ? { ...x, qty: x.qty + q } : x) : [...cs, { id, qty: q }]);
  const subFromCart = id => setCart(cs => cs.map(x => x.id === id ? { ...x, qty: x.qty - 1 } : x).filter(x => x.qty > 0));

  const placeOrder = () => {
    const f = FARMERS.find(x => x.id === PRODUCTS.find(p => p.id === cart[0].id).fid);
    const bulk = role === "retailer" ? .93 : 1;
    const produce = cart.reduce((s, ci) => s + PRODUCTS.find(p => p.id === ci.id).farmer * bulk * ci.qty, 0);
    const tr = transportFor(f.km);
    setBOrders(os => [{
      id: Date.now(), code: "KS-" + (2419 + os.length), fid: f.id, step: 1, date: "13 Sep",
      items: cart.map(x => ({ ...x })), total: Math.round(produce * 1.02 + tr / 2), transport: tr,
      farmerPayout: Math.round(produce - tr / 2), pickup: cart.reduce((s, x) => s + x.qty, 0), loss: 0, rated: false,
    }, ...os]);
    setCart([]); go("orders");
  };
  const bump = (set, id) => set(os => os.map(o => o.id === id
    ? { ...o, step: Math.min(5, o.step + 1), loss: o.step + 1 === 4 && o.loss === 0 ? .4 : o.loss } : o));

  if (!role || gate) return (
    <div style={{ fontFamily: FB }}>
      <Onboard c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
        pick={pick} canClose={!!role} close={() => setGate(false)} />
    </div>
  );

  const farmer = role === "farmer";
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const tabs = farmer
    ? [["home", t("nav_f_home"), Leaf], ["produce", t("nav_f_produce"), Boxes],
       ["orders", t("nav_f_orders"), PackageCheck], ["earn", t("nav_f_earn"), Wallet]]
    : [["home", t("nav_b_home"), Store], ["shop", t("nav_b_market"), Search],
       ["mandi", t("nav_b_mandi"), Scale], ["orders", t("nav_b_orders"), PackageCheck],
       ["cart", t("tab_cart"), ShoppingCart]];

  const titles = {
    home: farmer ? t("nav_f_home") : t("greet_sub"), shop: t("nav_b_market"), mandi: t("mandi_board_h"),
    orders: farmer ? t("nav_f_orders") : t("nav_b_orders"), cart: t("cart"),
    produce: t("nav_f_produce"), earn: t("earn_h"), add: t("add_crop"),
    product: PRODUCTS.find(p => p.id === pid).name[lang],
    store: FARMERS.find(f => f.id === fid).store[lang],
    legal: legalTab === "privacy" ? (lang === 0 ? "Privacy policy" : "निजता नीति")
      : (lang === 0 ? "Terms and conditions" : "नियम और शर्तें"),
  };
  const cur = stack || view;
  const pushed = !!stack;

  const legalLinks = (
    <div className="mt-6 px-4 pb-2 text-center">
      <p className="text-xs" style={{ color: c.muted }}>{t("demo_note")}</p>
      <div className="mt-1.5 flex items-center justify-center gap-4">
        {[["privacy", ["Privacy policy", "निजता नीति"]], ["terms", ["Terms and conditions", "नियम और शर्तें"]]].map(([k, l]) => (
          <button key={k} onClick={() => { setLegalTab(k); push("legal"); }}
            className="text-xs font-semibold underline" style={{ color: c.muted }}>{l[lang]}</button>
        ))}
      </div>
    </div>
  );

  const body = (
    <div style={{ paddingBottom: desktop ? 24 : cur === "product" ? 120 : cur === "cart" ? 190 : 96 }}>
      {cur === "legal" ? <Legal c={c} t={t} lang={lang} tab={legalTab} setTab={setLegalTab} /> : farmer ? (
            <>
              {cur === "home" && <FarmerHome c={c} t={t} lang={lang} go={go} orders={fOrders}
                listings={listings} startAdd={() => push("add")} />}
              {cur === "produce" && <FarmerProduce c={c} t={t} lang={lang} listings={listings}
                toggle={i => setListings(ls => ls.map((l, j) => j === i ? { ...l, live: !l.live } : l))}
                startAdd={() => push("add")} />}
              {cur === "orders" && <FarmerOrders c={c} t={t} lang={lang} orders={fOrders}
                advance={id => bump(setFOrders, id)}
                rate={id => setFOrders(os => os.map(o => o.id === id ? { ...o, ratedBuyer: true } : o))} />}
              {cur === "earn" && <FarmerEarnings c={c} t={t} lang={lang} />}
              {cur === "add" && <FarmerAdd c={c} t={t} lang={lang} close={() => { pop(); setView("produce"); }}
                save={l => setListings(ls => [l, ...ls])} />}
            </>
          ) : (
            <>
              {cur === "home" && <BuyerHome c={c} t={t} lang={lang} go={go} openStore={openStore}
                openProduct={openProduct} cart={cart} addToCart={addToCart} subFromCart={subFromCart} setCat={setCat} />}
              {cur === "shop" && <Shop c={c} t={t} lang={lang} role={role} cat={cat} setCat={setCat}
                openProduct={openProduct} openStore={openStore} cart={cart} addToCart={addToCart} subFromCart={subFromCart} />}
              {cur === "mandi" && <MandiScreen c={c} t={t} lang={lang} openProduct={openProduct} />}
              {cur === "orders" && <OrdersScreen c={c} t={t} lang={lang} orders={bOrders}
                advance={id => bump(setBOrders, id)}
                rate={id => setBOrders(os => os.map(o => o.id === id ? { ...o, rated: true } : o))} go={go} />}
              {cur === "cart" && <CartScreen c={c} t={t} lang={lang} role={role} cart={cart} addToCart={addToCart}
                subFromCart={subFromCart} remove={id => setCart(cs => cs.filter(x => x.id !== id))}
                go={go} placeOrder={placeOrder} addr={addr} wide={desktop} />}
              {cur === "product" && <ProductScreen c={c} t={t} lang={lang} role={role} pid={pid}
                openStore={openStore} openProduct={openProduct} addToCart={addToCart} go={go} wide={desktop} />}
              {cur === "store" && <StoreScreen c={c} t={t} lang={lang} fid={fid} openProduct={openProduct}
                cart={cart} addToCart={addToCart} subFromCart={subFromCart} />}
            </>
          )}
      {cur !== "legal" && !desktop && legalLinks}
    </div>
  );

  /* ── web ── */
  if (desktop) return (
    <div style={{ fontFamily: FB, background: c.bg, color: c.ink, minHeight: "100vh" }}>
      <TopNav c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark} tabs={tabs}
        view={view} go={go} cartCount={cartCount} role={role} openGate={() => setGate(true)}
        addr={addr} setAddr={setAddr} mobilePreview={mobilePreview} setMobilePreview={setMobilePreview} />
      <main className={"mx-auto px-2 pt-6 " + (["home", "shop", "store"].includes(cur) ? "max-w-6xl" : "max-w-3xl")}>
        {pushed && (
          <button onClick={pop} className="mb-4 ml-4 flex items-center gap-2 text-sm font-semibold" style={{ color: c.muted }}>
            <ArrowLeft size={16} /> {t("back")}
          </button>
        )}
        {body}
      </main>
      <footer className="mt-10" style={{ background: c.surface, borderTop: `1px solid ${c.line}` }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-7">
          <Logo size={28} green={c.green} gold={c.goldBright} />
          <p className="max-w-xl text-xs leading-relaxed" style={{ color: c.muted }}>{t("demo_note")}</p>
          <span className="ml-auto flex items-center gap-4">
            {[["privacy", ["Privacy policy", "निजता नीति"]], ["terms", ["Terms and conditions", "नियम और शर्तें"]]].map(([k, l]) => (
              <button key={k} onClick={() => { setLegalTab(k); push("legal"); }}
                className="text-xs font-semibold underline" style={{ color: c.muted }}>{l[lang]}</button>
            ))}
            <span className="flex items-center gap-1.5 text-xs" style={{ color: c.muted }}>
              <Smartphone size={13} />{lang === 0 ? "Also built for the phone" : "फ़ोन के लिए भी बना"}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );

  /* ── phone ── */
  return (
    <div style={{ fontFamily: FB }}>
      <Phone c={c}>
        <AppBar c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
          title={titles[cur]} addr={addr} role={role} openGate={pushed ? null : () => setGate(true)}
          back={pushed ? pop : null}
          right={vw >= 1024 ? (
            <button onClick={() => setMobilePreview(false)} className="grid place-items-center rounded-md"
              style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
              <Monitor size={15} />
            </button>
          ) : null} />
        {body}
        {!pushed && <TabBar c={c} tabs={tabs} view={view} go={go} cartCount={cartCount} />}
      </Phone>
    </div>
  );
}
