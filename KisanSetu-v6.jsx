import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Sun, Moon, Globe, ShoppingCart, MapPin, Shield, Truck, Star, Store, Search,
  ArrowRight, ArrowLeft, Sparkles, Route, CheckCircle2, AlertTriangle, Plus, Minus,
  Trash2, Lock, Scale, Boxes, Menu, X, Clock, TrendingUp, Wallet, PackageCheck,
  Users, Leaf, Check, IndianRupee, Delete, Pause, Play, Monitor, Smartphone, LayoutGrid,
  ChevronDown, ChevronRight, Settings, Info, FileText, CloudRain, CloudSun, Cloud,
  CloudLightning, Droplets, Bell, Sprout, Landmark
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, Cell,
} from "recharts";

/* ────────────────────────────────────────────────────────────
   KISAN SETU (SIH26033)
   Ministry of Consumer Affairs, Food & Public Distribution
   Design System Compliant: Professional Lucide Icons, Clean Monochrome Nav,
   Initials-based Avatars, Consolidated Rich KPI Cards with Micro-charts,
   and Modal-driven Complex Input Flows.
   ──────────────────────────────────────────────────────────── */

const FD = `"Playfair Display","Tiro Devanagari Hindi",Georgia,"Noto Serif Devanagari",serif`;
const FB = `Inter,system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Devanagari",sans-serif`;

/* Cohesive Organic & Slate Base Scheme */
const PALETTE = {
  light: {
    bg: "#F9F8F5", surface: "#FFFFFF", raise: "#F2EFE9", peach: "#EFEBE3",
    ink: "#1E232A", muted: "#64707D", line: "#E5DFD5",
    green: "#245A3C", greenDeep: "#183F29", greenSoft: "#EAF3ED", greenTop: "#2F724C",
    gold: "#A86D12", goldBright: "#D98E18", goldSoft: "#F9F2E3",
    red: "#C84B31", redSoft: "#FCECE8", coral: "#D65A31",
    violet: "#4740B8", violetSoft: "#EEEDFA",
    wood: "#B8834A", woodDark: "#855829", woodLit: "#CC995E",
    slate: "#1E232A", chalk: "#F9F8F5", cast: "rgba(30,35,42,.08)",
    slab: ["#DDD5C7", "#D0C6B5", "#C2B6A2", "#B3A690"],
    slabTop: ["#EBE4D8", "#DFD6C7", "#D2C7B6", "#C4B8A5"],
  },
  dark: {
    bg: "#131619", surface: "#1C2126", raise: "#242B32", peach: "#2C343D",
    ink: "#F0F3F6", muted: "#8E9BA8", line: "#2E3740",
    green: "#4E9F6E", greenDeep: "#326F4A", greenSoft: "#18281E", greenTop: "#62BF87",
    gold: "#D98E18", goldBright: "#F2A732", goldSoft: "#2D2415",
    red: "#E26D54", redSoft: "#351F1A", coral: "#E26D54",
    violet: "#8B84F0", violetSoft: "#222040",
    wood: "#8A643B", woodDark: "#5C4123", woodLit: "#A87D4E",
    slate: "#111417", chalk: "#E6EAEE", cast: "rgba(0,0,0,.5)",
    slab: ["#38424D", "#313B45", "#2A323C", "#232A32"],
    slabTop: ["#45515E", "#3E4955", "#37414C", "#303943"],
  },
};

/* ── helpers & avatar ──────────────────────────────────────── */
function getInitials(name) {
  if (!name) return "KS";
  const str = Array.isArray(name) ? name[0] : name;
  const parts = str.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InitialsAvatar({ id, name, size = 36, c, verified }) {
  const farmer = id ? FARMERS.find(f => f.id === id) : null;
  const displayName = name || (farmer ? farmer.name[0] : "User");
  const initials = getInitials(displayName);
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center font-bold select-none"
      style={{
        width: size, height: size, borderRadius: 8,
        background: c.raise, border: `1px solid ${c.line}`,
        color: c.ink, fontSize: Math.max(11, Math.round(size * 0.38)),
        letterSpacing: "0.02em"
      }}>
      {initials}
      {verified && (
        <span className="absolute -bottom-1 -right-1 grid place-items-center rounded-full"
          style={{ width: size * 0.38, height: size * 0.38, background: c.green, color: "#fff" }}>
          <Check size={size * 0.24} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

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
  quick_pick: ["Quick Categories", "श्रेणियाँ"],
  fresh_today: ["Fresh From The Harvest", "आज की ताज़ा कटाई"],
  our_farmers: ["Nearby Farm Stores", "आस-पास के किसान"],
  deals: ["Top Direct Savings", "सीधी बचत के सौदे"],
  see_all_b: ["See all", "सब देखें"],
  namaste: ["Namaste", "नमस्ते"],
  back: ["Back", "वापस"],
  weather_h: ["Weather Forecast", "मौसम का पूर्वानुमान"],
  weather_5day: ["5-day forecast →", "5-दिन का पूर्वानुमान →"],
  smart_alerts: ["Smart Notifications", "स्मार्ट अलर्ट व सूचनाएँ"],
  unread_alerts: ["new", "नए"],
  mark_all_read: ["Mark all read", "सभी पढ़े"],
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

function Produce({ id, size = 44, bg = "white", vector = false, className = "" }) {
  const [error, setError] = useState(false);
  const folder = bg === "beige" ? "beige" : "white";
  if (!vector && !error && id) {
    return (
      <img
        src={`./produce/${folder}/${id}.jpg`}
        alt={id}
        onError={() => setError(true)}
        className={"object-contain " + className}
        style={{ width: size, height: size, maxWidth: "100%", maxHeight: "100%", display: "block" }}
        loading="lazy"
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className={className}>
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

/* Price Journey Rail - Data Visualization representing producer & intermediary realization */
function PriceRail({ c, t, p, small }) {
  const parts = chain(p), total = p.retail;
  const hs = small ? [24, 20, 18, 16, 14] : [48, 40, 34, 28, 24];
  return (
    <div>
      <div className="flex w-full items-end gap-1" style={{ paddingTop: small ? 6 : 10 }}>
        {parts.map((s, i) => {
          const face = s.farmer ? c.green : c.slab[i - 1] || c.raise;
          const w = (s.v / total) * 100;
          return (
            <div key={i} className="rounded-t-sm relative overflow-hidden"
              style={{ width: `${w}%`, height: hs[i], background: face }}>
              {w > 12 && !small && (
                <span className="absolute inset-0 grid place-items-center text-xs font-bold"
                  style={{ ...num, color: s.farmer ? "#fff" : c.ink }}>{inr1(s.v)}</span>
              )}
            </div>
          );
        })}
      </div>
      {!small && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5">
          {parts.map((s, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.farmer ? c.green : c.slab[i - 1] || c.muted }} />
                <span className="text-xs" style={{ color: c.muted }}>{t(s.k)}</span>
              </div>
              <div className="mt-0.5 text-xs font-bold" style={{ ...num, color: s.farmer ? c.green : c.ink }}>
                {inr1(s.v)}<span className="ml-1 font-normal text-muted" style={{ color: c.muted }}>
                  {Math.round((s.v / total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Account Popover Menu (Rule 4: Secondary items in popover) ── */
function AccountPopover({ c, t, lang, setLang, dark, setDark, role, pick, addr, setAddr, openLegal, close }) {
  const popRef = useRef(null);
  useEffect(() => {
    const handleDown = e => {
      if (popRef.current && !popRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [close]);

  const me = FARMERS.find(f => f.id === ME);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-5" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div ref={popRef} className="w-full max-w-xs rounded-xl p-4 shadow-2xl"
        style={{ background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: c.line }}>
          <div className="flex items-center gap-2.5">
            <InitialsAvatar id={role === "farmer" ? ME : null} name={role === "farmer" ? me.name[lang] : "Buyer Account"} size={36} c={c} verified={role === "farmer"} />
            <div>
              <div className="text-sm font-bold" style={{ color: c.ink }}>
                {role === "farmer" ? me.name[lang] : role === "retailer" ? (lang === 0 ? "Retailer Shop" : "खुदरा दुकान") : (lang === 0 ? "Household Buyer" : "घरेलू खरीदार")}
              </div>
              <div className="text-xs" style={{ color: c.muted }}>{addr}</div>
            </div>
          </div>
          <button onClick={close} className="p-1 rounded-md" style={{ color: c.muted }}><X size={16} /></button>
        </div>

        {/* Role Selector */}
        <div className="mt-3">
          <div className="text-xs font-semibold uppercase mb-1.5" style={{ color: c.muted, letterSpacing: "0.08em" }}>
            {lang === 0 ? "Active Profile" : "सक्रिय प्रोफ़ाइल"}
          </div>
          <div className="space-y-1">
            {[
              { id: "farmer", label: lang === 0 ? "Farmer (Ramesh Kumar)" : "किसान (रमेश कुमार)", icon: Leaf },
              { id: "consumer", label: lang === 0 ? "Household Consumer" : "घरेलू खरीदार", icon: Users },
              { id: "retailer", label: lang === 0 ? "Bulk Retailer" : "थोक दुकानदार", icon: Boxes },
            ].map(r => (
              <button key={r.id} onClick={() => { pick(r.id); close(); }}
                className="flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold"
                style={{
                  background: role === r.id ? c.greenSoft : "transparent",
                  color: role === r.id ? c.green : c.ink,
                  border: `1px solid ${role === r.id ? c.green : "transparent"}`
                }}>
                <span className="flex items-center gap-2">
                  <r.icon size={14} /> {r.label}
                </span>
                {role === r.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Preferences */}
        <div className="mt-4 pt-3 border-t space-y-2 text-xs" style={{ borderColor: c.line }}>
          <div className="flex items-center justify-between py-1">
            <span style={{ color: c.muted }}>{lang === 0 ? "Language" : "भाषा"}</span>
            <button onClick={() => setLang(lang === 0 ? 1 : 0)} className="px-2.5 py-1 rounded-md font-bold"
              style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }}>
              {lang === 0 ? "हिंदी" : "English"}
            </button>
          </div>
          <div className="flex items-center justify-between py-1">
            <span style={{ color: c.muted }}>{lang === 0 ? "Theme" : "थीम"}</span>
            <button onClick={() => setDark(!dark)} className="px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5"
              style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }}>
              {dark ? <Sun size={13} /> : <Moon size={13} />}
              {dark ? (lang === 0 ? "Light Mode" : "लाइट") : (lang === 0 ? "Dark Mode" : "डार्क")}
            </button>
          </div>
        </div>

        {/* Secondary Links & Legal */}
        <div className="mt-3 pt-3 border-t space-y-1.5 text-xs" style={{ borderColor: c.line }}>
          <button onClick={() => { openLegal("privacy"); close(); }} className="flex items-center gap-2 w-full text-left py-1" style={{ color: c.muted }}>
            <Shield size={13} /> {lang === 0 ? "Privacy Policy (DPDP Act 2023)" : "निजता नीति"}
          </button>
          <button onClick={() => { openLegal("terms"); close(); }} className="flex items-center gap-2 w-full text-left py-1" style={{ color: c.muted }}>
            <FileText size={13} /> {lang === 0 ? "Terms of Trade & Escrow" : "नियम और शर्तें"}
          </button>
        </div>
      </div>
    </div>
  );
}

const RAD = { card: 12, chip: 8, sheet: 14 };
const lift = c => `0 1px 2px ${c.cast}, 0 8px 16px -8px ${c.cast}`;
const liftHi = c => `0 2px 4px ${c.cast}, 0 16px 28px -12px ${c.cast}`;

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

/* Top bar. Clean & functional, with secondary menu popover */
function AppBar({ c, t, lang, setLang, dark, setDark, title, back, addr, role, openGate, right, pick, openLegal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30" style={{ background: c.bg, borderBottom: `1px solid ${c.line}` }}>
      <StatusBar c={c} />
      <div className="flex items-center gap-2 px-4 pb-2.5 pt-2">
        {back ? (
          <>
            <button onClick={back} className="grid shrink-0 place-items-center rounded-lg"
              style={{ width: 36, height: 36, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
              <ArrowLeft size={16} />
            </button>
            <span className="truncate" style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: c.ink }}>{title}</span>
          </>
        ) : (
          <>
            <Logo size={28} green={c.green} gold={c.goldBright} />
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs" style={{ color: c.muted }}>
                <MapPin size={11} style={{ color: c.green }} />{addr}
              </div>
              <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>{title}</div>
            </div>
          </>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {right}
          <button onClick={() => setMenuOpen(true)} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
            style={{ background: c.surface, border: `1px solid ${c.line}` }}>
            <InitialsAvatar id={role === "farmer" ? ME : null} size={26} c={c} />
            <ChevronDown size={13} style={{ color: c.muted }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <AccountPopover c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
          role={role} pick={pick} addr={addr} setAddr={() => {}} openLegal={openLegal} close={() => setMenuOpen(false)} />
      )}
    </div>
  );
}

/* Bottom tabs */
function TabBar({ c, tabs, view, go, cartCount }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full" style={{ maxWidth: 430, transform: "translateX(-50%)" }}>
      <div style={{
        background: c.surface, borderTop: `1px solid ${c.line}`,
        boxShadow: `0 -4px 16px -8px ${c.cast}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        <div className="flex">
          {tabs.map(([id, k, Ic]) => {
            const on = view === id;
            return (
              <button key={id} onClick={() => go(id)} className="relative flex-1 pb-2 pt-2 text-center">
                <span className="relative mx-auto grid place-items-center" style={{ width: 32, height: 24 }}>
                  <Ic size={18} style={{ color: on ? c.green : c.muted }} />
                  {id === "cart" && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid place-items-center rounded-full text-xs font-bold"
                      style={{ background: c.green, color: "#fff", minWidth: 16, height: 16, fontSize: 10 }}>{cartCount}</span>
                  )}
                </span>
                <span className="mt-0.5 block text-center" style={{ fontSize: 11, fontWeight: on ? 700 : 500, color: on ? c.green : c.muted }}>
                  {k}
                </span>
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
    <div className="flex min-h-screen justify-center sm:py-6" style={{ background: c.bg }}>
      <div className="relative w-full sm:rounded-2xl sm:border"
        style={{
          maxWidth: 430, background: c.bg, borderColor: c.line,
          boxShadow: liftHi(c),
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
    <div className="mb-2.5 flex items-end gap-3 px-4">
      <div className="min-w-0">
        <h2 className="truncate" style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: c.ink }}>{title}</h2>
      </div>
      {action && (
        <button onClick={onAction} className="ml-auto shrink-0 text-xs font-semibold" style={{ color: c.green }}>{action}</button>
      )}
    </div>
  );
}

const Pill = ({ c, tone = "green", children, className = "" }) => {
  const m = {
    green: [c.greenSoft, c.green], gold: [c.goldSoft, c.gold], coral: [c.redSoft, c.red],
    violet: [c.violetSoft, c.violet], flat: [c.raise, c.muted],
  }[tone] || [c.raise, c.muted];
  return <span className={"rounded-md px-2 py-0.5 text-xs font-semibold " + className}
    style={{ background: m[0], color: m[1] }}>{children}</span>;
};

function AddStepper({ c, qty, add, sub, small }) {
  if (!qty) return (
    <button onClick={add} className="rounded-md font-semibold"
      style={{
        background: c.green, color: "#fff", height: small ? 28 : 32, padding: "0 14px",
        fontSize: small ? 12 : 13,
      }}>+ ADD</button>
  );
  return (
    <span className="flex items-center rounded-md"
      style={{ background: c.green, height: small ? 28 : 32 }}>
      <button onClick={sub} className="grid place-items-center" style={{ width: 28, color: "#fff" }}><Minus size={13} /></button>
      <span className="text-center font-bold" style={{ ...num, color: "#fff", width: 20, fontSize: 12 }}>{qty}</span>
      <button onClick={add} className="grid place-items-center" style={{ width: 28, color: "#fff" }}><Plus size={13} /></button>
    </span>
  );
}

function ActionBar({ c, left, right, onClick, label, lift = 0, wide }) {
  return (
    <div className="fixed left-1/2 z-40 w-full" style={{ bottom: lift, maxWidth: wide ? 768 : 430, transform: "translateX(-50%)" }}>
      <div className="flex items-center gap-3 px-4 pb-4 pt-3"
        style={{ background: c.surface, borderTop: `1px solid ${c.line}`, boxShadow: `0 -6px 20px -10px ${c.cast}` }}>
        <div className="min-w-0">
          <div className="truncate text-xs" style={{ color: c.muted }}>{left}</div>
          <div style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 20, color: c.ink }}>{right}</div>
        </div>
        <button onClick={onClick} className="ml-auto flex items-center gap-2 rounded-lg font-semibold"
          style={{ background: c.green, color: "#fff", height: 44, padding: "0 20px", fontSize: 14 }}>
          {label} <ArrowRight size={15} />
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
    { id: "farmer", idRef: "f1", icon: Leaf, k: ["gate_farmer", "gate_farmer_s"] },
    { id: "consumer", idRef: null, icon: Users, k: ["gate_buyer", "gate_buyer_s"] },
    { id: "retailer", idRef: null, icon: Boxes, k: ["gate_shop", "gate_shop_s"] },
  ];
  return (
    <Phone c={c}>
      <StatusBar c={c} />
      <div className="flex items-center gap-2 px-4 pt-2">
        {canClose && (
          <button onClick={close} className="grid place-items-center rounded-lg"
            style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            <X size={15} />
          </button>
        )}
        <div className="ml-auto flex gap-1.5">
          <button onClick={() => setLang(lang === 0 ? 1 : 0)} className="rounded-lg px-2.5 text-xs font-semibold"
            style={{ height: 32, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {lang === 0 ? "हिंदी" : "English"}
          </button>
          <button onClick={() => setDark(!dark)} className="grid place-items-center rounded-lg"
            style={{ width: 32, height: 32, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      <div className="px-5 pb-10 pt-4">
        <div className="flex items-center gap-2.5">
          <Logo size={34} green={c.green} gold={c.goldBright} />
          <div>
            <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 20, color: c.ink }}>{t("brand")}</div>
            <div style={{ color: c.muted, fontSize: 11 }}>{lang === 0 ? "किसान सेतु" : "Kisan Setu"}</div>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold leading-snug" style={{ fontFamily: FD, color: c.ink }}>
          {t("gate_h")}
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed" style={{ color: c.muted }}>{t("gate_p")}</p>

        <div className="mt-5 space-y-2.5">
          {opts.map(o => (
            <button key={o.id} onClick={() => pick(o.id)} className="flex w-full items-center gap-3 p-3.5 text-left rounded-xl transition-all"
              style={{ background: c.surface, border: `1px solid ${c.line}`, boxShadow: lift(c) }}>
              <InitialsAvatar id={o.idRef} size={42} c={c} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold" style={{ color: c.ink }}>{t(o.k[0])}</span>
                <span className="block text-xs" style={{ color: c.muted }}>{t(o.k[1])}</span>
              </span>
              <ArrowRight size={16} style={{ color: c.muted }} />
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs" style={{ color: c.muted }}>{t("demo_note")}</p>
      </div>
    </Phone>
  );
}

/* ════════════════════════════════════════════════════════════
   BUYER SCREENS
   ════════════════════════════════════════════════════════════ */
function ProdCard({ c, t, lang, p, qty, add, sub, open, wide }) {
  const f = FARMERS.find(x => x.id === p.fid);
  const save = Math.round(((p.retail - p.farmer) / p.retail) * 100);
  return (
    <div style={{
      background: c.surface, borderRadius: RAD.card, border: `1px solid ${c.line}`,
      boxShadow: lift(c), overflow: "hidden", width: wide ? 160 : "auto", flexShrink: 0,
    }}>
      <button onClick={open} className="relative block w-full overflow-hidden" style={{ background: "#FFFFFF", height: 110 }}>
        <span className="absolute inset-0 grid place-items-center p-2">
          <Produce id={p.id} size={90} className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" />
        </span>
        <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-xs font-bold z-10 shadow-sm"
          style={{ background: c.green, color: "#fff", fontSize: 10 }}>−{save}%</span>
        {p.organic && (
          <span className="absolute right-2 top-2 grid place-items-center rounded z-10 shadow-sm"
            style={{ background: c.surface, border: `1px solid ${c.line}`, width: 20, height: 20 }}>
            <Leaf size={11} style={{ color: c.green }} />
          </span>
        )}
      </button>
      <div className="p-3">
        <button onClick={open} className="block w-full text-left">
          <div className="truncate text-xs font-bold" style={{ color: c.ink }}>{p.name[lang]}</div>
          <div className="mt-0.5 flex items-center gap-1 truncate text-xs" style={{ color: c.muted }}>
            <MapPin size={10} />{f.store[lang].split(" ")[0]} · {f.km} km
          </div>
        </button>
        <div className="mt-2 flex items-end gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 16, color: c.ink }}>{inr(p.farmer)}</span>
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

function BuyerHome({ c, t, lang, role, go, openStore, openProduct, cart, addToCart, subFromCart, setCat }) {
  const isShopkeeper = role === "retailer";
  const tom = PRODUCTS.find(p => p.id === "p1");
  const fresh = PRODUCTS.filter(p => p.harvest <= 2).slice(0, 6);
  const deals = [...PRODUCTS].sort((a, b) => (b.retail - b.farmer) / b.retail - (a.retail - a.farmer) / a.retail).slice(0, 6);
  const steps = [["list", "how_1", "how_1s"], ["pick", "how_2", "how_2s"], ["van", "how_3", "how_3s"], ["pay", "how_4", "how_4s"]];
  const q = id => cart.find(x => x.id === id)?.qty;

  return (
    <div className="pb-4">
      {/* Hero Banner with Full Farmer & Tomato Basket Visual */}
      <div className="px-4 pt-1">
        <div
          className="relative overflow-hidden rounded-2xl text-white min-h-[260px] sm:min-h-[320px] md:min-h-[350px] lg:min-h-[380px] flex items-center p-5 md:p-8"
          style={{
            background: "#133522",
            boxShadow: liftHi(c),
          }}>
          {/* Image layer anchored to right with full-height cover to remove any top gap */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-7/12 md:w-3/5 lg:w-3/5 pointer-events-none overflow-hidden">
            <img
              src={isShopkeeper ? "./hero-mango.jpg" : "./hero-farmer.jpg"}
              alt={isShopkeeper ? "Farmer holding crate of fresh orchard mangoes" : "Farmer holding basket of fresh tomatoes"}
              className="h-full w-full object-cover"
              style={{ objectPosition: "85% 30%" }}
            />
            {/* Left-to-right fade overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, #133522 0%, rgba(19,53,34,0.95) 25%, rgba(19,53,34,0.3) 65%, transparent 100%)",
              }}
            />
            {/* Mobile bottom-to-top subtle fade */}
            <div
              className="absolute inset-0 sm:hidden"
              style={{
                background: "linear-gradient(0deg, rgba(19,53,34,0.88) 0%, rgba(19,53,34,0.3) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Content layer */}
          <div className="relative z-10 max-w-sm md:max-w-md lg:max-w-lg">
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md mb-2.5 border"
              style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.22)", color: "#FFFFFF" }}>
              <Sparkles size={12} className="text-amber-300" />
              <span>
                {isShopkeeper
                  ? (lang === 0 ? "Bulk Farm-to-Shop Direct • 7% Trade Margin" : "सीधा खेत-से-दुकान थोक आपूर्ति • 7% व्यापार छूट")
                  : (lang === 0 ? "Direct From Verified Farms" : "सत्यापित खेतों से सीधा")}
              </span>
            </div>

            <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 26, lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              {isShopkeeper ? (
                <>
                  {lang === 0 ? "Orchard-Fresh Mangoes." : "बाग़ के ताज़ा आम क्रेट।"}<br />
                  {lang === 0 ? "Zero Commission, Farm Rate." : "शून्य आढ़त, सीधा खेत का भाव।"}
                </>
              ) : (
                <>
                  {t("hero_a")}<br />{t("hero_b")}
                </>
              )}
            </h1>

            <p className="mt-2.5 text-xs md:text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255, 255, 255, 0.92)", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              {isShopkeeper
                ? (lang === 0
                    ? "Direct bulk supply from Muradnagar orchards with 7% trade discount, verified crates, and next-day hub delivery."
                    : "मुरादनगर के बाग़ों से 7% व्यापार छूट, डिजिटल तौल और सुबह की हब डिलीवरी के साथ सीधा थोक माल लें।")
                : t("hero_p")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button onClick={() => go("shop")}
                className="flex items-center gap-2 rounded-lg font-bold transition-transform active:scale-95 shadow-md"
                style={{ background: "#FFFFFF", color: c.greenDeep, height: 40, padding: "0 20px", fontSize: 13 }}>
                {isShopkeeper ? (lang === 0 ? "Explore Bulk Mandi" : "थोक मंडी देखें") : t("cta_shop")} <ArrowRight size={14} />
              </button>
              <button onClick={() => openProduct(isShopkeeper ? "p8" : "p1")}
                className="flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2.5 backdrop-blur-md border transition-colors hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.25)", color: "#FFFFFF" }}>
                <span>{isShopkeeper ? (lang === 0 ? "Bulk Mango ₹41.8/kg (50kg+)" : "थोक आम ₹41.8/किलो (50kg+)") : (lang === 0 ? "Fresh Tomato ₹18/kg" : "ताज़ा टमाटर ₹18/किलो")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5">
        <SectionHead c={c} title={t("quick_pick")} />
        <div className="flex gap-2.5 overflow-x-auto px-4 pb-1">
          {CATS.map(k => {
            const sample = PRODUCTS.find(p => p.cat === k.id);
            return (
              <button key={k.id} onClick={() => { setCat(k.id); go("shop"); }} className="shrink-0 text-center" style={{ width: 64 }}>
                <span className="grid place-items-center rounded-lg"
                  style={{ width: 60, height: 60, background: c.peach, border: `1px solid ${c.line}` }}>
                  <Produce id={sample.id} size={40} bg="beige" />
                </span>
                <span className="mt-1 block text-xs font-semibold" style={{ color: c.ink }}>{k.label[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown Micro-card */}
      <div className="mt-5 px-4">
        <button onClick={() => openProduct(tom.id)} className="block w-full text-left">
          <Sheet c={c} className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase" style={{ color: c.muted, letterSpacing: "0.08em" }}>
                <Scale size={14} /> {t("price_journey")}
              </div>
              <ArrowRight size={14} style={{ color: c.muted }} />
            </div>
            <div className="mt-2.5"><PriceRail c={c} t={t} p={tom} small /></div>
            <div className="mt-3 flex items-center gap-2">
              <Pill c={c} tone="green">{t("farmer_gets")} {inr(tom.farmer)}</Pill>
              <Pill c={c} tone="flat">{lang === 0 ? "Intermediary Gap" : "बिचौलिया अंतर"} {inr(tom.retail - tom.farmer)}</Pill>
            </div>
          </Sheet>
        </button>
      </div>

      {/* Picked Today */}
      <div className="mt-5">
        <SectionHead c={c} title={t("fresh_today")} action={t("see_all_b")} onAction={() => go("shop")} />
        <div className="flex gap-2.5 overflow-x-auto px-4 pb-2">
          {fresh.map(p => (
            <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} wide qty={q(p.id)}
              add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
          ))}
        </div>
      </div>

      {/* Nearby Farms */}
      <div className="mt-5">
        <SectionHead c={c} title={t("our_farmers")} action={t("see_all_b")} onAction={() => go("shop")} />
        <div className="flex gap-2.5 overflow-x-auto px-4 pb-2">
          {FARMERS.map(f => (
            <button key={f.id} onClick={() => openStore(f.id)} className="shrink-0 text-left" style={{ width: 160 }}>
              <Sheet c={c} className="h-full p-3">
                <div className="flex items-center gap-2">
                  <InitialsAvatar id={f.id} size={38} c={c} verified={f.verified} />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold" style={{ color: c.ink }}>{f.name[lang]}</div>
                    <div className="text-xs" style={{ color: c.muted }}>{f.km} km</div>
                  </div>
                </div>
                <div className="mt-2 truncate text-xs" style={{ color: c.muted }}>{f.store[lang]}</div>
              </Sheet>
            </button>
          ))}
        </div>
      </div>

      {/* Deals */}
      <div className="mt-5">
        <SectionHead c={c} title={t("deals")} />
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
          {deals.slice(0, 4).map(p => (
            <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} qty={q(p.id)}
              add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
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
      <div className="sticky z-20 px-4 pb-3 pt-1" style={{ top: 60, background: c.bg }}>
        <div className="flex items-center gap-2 px-3" style={{ background: c.surface, borderRadius: RAD.chip, border: `1px solid ${c.line}`, height: 40, boxShadow: lift(c) }}>
          <Search size={15} style={{ color: c.muted }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("search_ph")}
            className="w-full bg-transparent text-xs outline-none" style={{ color: c.ink }} />
          {q && <button onClick={() => setQ("")} style={{ color: c.muted }}><X size={14} /></button>}
        </div>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {[{ id: "all", label: [t("all"), t("all")] }, ...CATS].map(k => {
            const on = cat === k.id;
            return (
              <button key={k.id} onClick={() => setCat(k.id)} className="shrink-0 rounded-md px-3 py-1 text-xs font-semibold"
                style={{
                  background: on ? c.green : c.surface, color: on ? "#fff" : c.muted,
                  border: `1px solid ${on ? c.green : c.line}`,
                }}>{k.label[lang]}</button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3 text-xs">
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="rounded-md px-2.5 py-1 text-xs font-semibold outline-none"
          style={{ background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
          <option value="near">{t("sort_near")}</option>
          <option value="save">{t("sort_save")}</option>
          <option value="price">{t("sort_price")}</option>
        </select>
        <span className="ml-auto" style={{ color: c.muted }}>{t("within")}</span>
        <input type="range" min="5" max="50" step="5" value={radius} onChange={e => setRadius(+e.target.value)}
          className="w-20" style={{ accentColor: c.green }} />
        <span className="font-bold" style={{ ...num, color: c.ink }}>{radius}km</span>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map(p => (
          <ProdCard key={p.id} c={c} t={t} lang={lang} p={p} qty={qty(p.id)}
            add={() => addToCart(p.id)} sub={() => subFromCart(p.id)} open={() => openProduct(p.id)} />
        ))}
      </div>
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
      <div className="px-4 pt-1">
        <div className="relative rounded-xl p-4 flex items-center justify-center overflow-hidden" style={{ background: "#FFFFFF", height: 180, border: `1px solid ${c.line}` }}>
          <Produce id={p.id} size={150} className="w-full h-full object-contain" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Pill c={c} tone="green">−{Math.round(((p.retail - p.farmer) / p.retail) * 100)}%</Pill>
            {p.organic && <Pill c={c} tone="flat">{lang === 0 ? "Organic" : "जैविक"}</Pill>}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, color: c.ink }}>{p.name[lang]}</h1>
        <p className="mt-1 text-xs" style={{ color: c.muted }}>
          {t("harvested")} {p.harvest === 0 ? (lang === 0 ? "this morning" : "आज सुबह") : `${p.harvest}d ago`} · {p.stock} {p.unit[lang]} {t("stock_left")}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 30, color: c.green }}>{inr(p.farmer * bulk)}</span>
          <span className="text-xs" style={{ color: c.muted }}>/{p.unit[lang]}</span>
          <span className="text-xs line-through" style={{ ...num, color: c.muted }}>{inr(p.retail)}</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: c.ink }}>{t("qty")}</span>
          <span className="flex items-center rounded-lg" style={{ border: `1px solid ${c.line}`, background: c.surface, height: 36 }}>
            <button onClick={() => setQty(Math.max(min, qty - stepBy))} className="grid place-items-center" style={{ width: 36, color: c.ink }}><Minus size={14} /></button>
            <span className="text-center font-bold text-xs" style={{ ...num, width: 40, color: c.ink }}>{qty}</span>
            <button onClick={() => setQty(Math.min(max, qty + stepBy))} className="grid place-items-center" style={{ width: 36, color: c.ink }}><Plus size={14} /></button>
          </span>
          <span className="text-xs" style={{ color: c.muted }}>{p.unit[lang]}</span>
        </div>
      </div>

      <div className="mt-4 px-4">
        <Sheet c={c} className="p-3.5">
          <div className="text-xs font-semibold uppercase mb-2" style={{ color: c.muted, letterSpacing: "0.08em" }}>{t("price_journey")}</div>
          <PriceRail c={c} t={t} p={p} />
        </Sheet>
      </div>

      <div className="mt-3 px-4">
        <button onClick={() => openStore(f.id)} className="block w-full text-left">
          <Sheet c={c} className="flex items-center gap-3 p-3">
            <InitialsAvatar id={f.id} size={40} c={c} verified={f.verified} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold" style={{ color: c.ink }}>{f.store[lang]}</div>
              <div className="truncate text-xs" style={{ color: c.muted }}>{f.place[lang]} · {f.km} {t("km_away")}</div>
            </div>
            <ArrowRight size={14} style={{ color: c.muted }} />
          </Sheet>
        </button>
      </div>

      <ActionBar c={c} wide={wide} left={`${qty} ${p.unit[lang]} · ${t("total_word")}`} right={inr(pay)}
        label={t("add")} onClick={() => { addToCart(p.id, qty); go("cart"); }} />
    </div>
  );
}

function StoreScreen({ c, t, lang, fid, openProduct, cart, addToCart, subFromCart }) {
  const f = FARMERS.find(x => x.id === fid), items = PRODUCTS.filter(p => p.fid === fid);
  const qty = id => cart.find(x => x.id === id)?.qty;
  return (
    <div className="pb-4">
      <div className="px-4 pt-1">
        <div className="rounded-xl p-4" style={{ background: c.green, color: "#fff" }}>
          <div className="flex items-center gap-3">
            <InitialsAvatar id={f.id} size={48} c={c} verified={f.verified} />
            <div className="min-w-0">
              <div className="truncate font-bold text-base">{f.store[lang]}</div>
              <div className="text-xs text-white/80">{f.name[lang]} · {f.place[lang]} · {f.km} km</div>
            </div>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-white/90">{f.bio[lang]}</p>
        </div>
      </div>

      <div className="mt-4">
        <SectionHead c={c} title={lang === 0 ? "In season right now" : "अभी मौसम में"} />
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
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
      <ShoppingCart size={48} className="mx-auto mb-3" style={{ color: c.muted }} />
      <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 20, color: c.ink }}>{t("cart_empty_h")}</h2>
      <p className="mt-1 text-xs" style={{ color: c.muted }}>{t("empty_sub")}</p>
      <button onClick={() => go("shop")} className="mt-5 rounded-lg font-semibold text-xs"
        style={{ background: c.green, color: "#fff", height: 40, padding: "0 20px" }}>
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
    <div className="pb-32 px-4 space-y-3">
      <Sheet c={c} className="flex items-center gap-2 p-3" tone={c.greenSoft}>
        <MapPin size={14} style={{ color: c.green }} />
        <span className="text-xs" style={{ color: c.green }}>{t("loc")} <b>{addr}</b></span>
      </Sheet>

      {farms.map(fid => {
        const f = FARMERS.find(x => x.id === fid);
        return (
          <Sheet c={c} key={fid} className="overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ background: c.raise, borderColor: c.line }}>
              <InitialsAvatar id={f.id} size={24} c={c} />
              <span className="truncate text-xs font-bold" style={{ color: c.ink }}>{f.store[lang]}</span>
              <span className="ml-auto text-xs" style={{ ...num, color: c.muted }}>
                <Truck size={11} className="mr-1 inline" />{inr(transportFor(f.km) / 2)}
              </span>
            </div>
            {rows.filter(r => r.f.id === fid).map(r => (
              <div key={r.id} className="flex items-center gap-2.5 px-3 py-2.5 border-b" style={{ borderColor: c.line }}>
                <Produce id={r.p.id} size={30} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold" style={{ color: c.ink }}>{r.p.name[lang]}</div>
                  <div className="text-xs" style={{ ...num, color: c.muted }}>
                    {inr(r.p.farmer * (role === "retailer" ? .93 : 1))}/{r.p.unit[lang]}
                  </div>
                </div>
                <span style={{ ...num, fontWeight: 700, color: c.ink, fontSize: 13 }}>{inr(r.line)}</span>
                <AddStepper c={c} qty={r.qty} add={() => addToCart(r.id)} sub={() => subFromCart(r.id)} small />
                <button onClick={() => remove(r.id)} style={{ color: c.muted }}><Trash2 size={13} /></button>
              </div>
            ))}
          </Sheet>
        );
      })}

      <Sheet c={c} className="p-3.5 space-y-1.5 text-xs">
        <div className="flex justify-between" style={{ color: c.muted }}>
          <span>{t("subtotal")}</span><span style={num}>{inr1(produce)}</span>
        </div>
        <div className="flex justify-between" style={{ color: c.muted }}>
          <span>{t("platform_fee")} 2%</span><span style={num}>{inr1(fee)}</span>
        </div>
        <div className="flex justify-between" style={{ color: c.muted }}>
          <span>{t("your_half")}</span><span style={num}>{inr1(trans / 2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t font-bold text-sm" style={{ borderColor: c.line, color: c.ink }}>
          <span>{t("total")}</span><span style={num}>{inr(total)}</span>
        </div>
      </Sheet>

      <ActionBar c={c} wide={wide} lift={wide ? 0 : 62} left={`${rows.length} ${t("items_word")}`} right={inr(total)} label={t("place")} onClick={placeOrder} />
    </div>
  );
}

const STEPS = ["st_placed", "st_held", "st_picked", "st_transit", "st_delivered", "st_released"];

function OrdersScreen({ c, t, lang, orders, advance, rate, go }) {
  if (!orders.length) return (
    <div className="px-6 py-16 text-center">
      <PackageCheck size={48} className="mx-auto mb-3" style={{ color: c.muted }} />
      <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 20, color: c.ink }}>{t("orders_empty")}</h2>
      <button onClick={() => go("shop")} className="mt-5 rounded-lg font-semibold text-xs"
        style={{ background: c.green, color: "#fff", height: 40, padding: "0 20px" }}>
        {t("shop_now")}
      </button>
    </div>
  );
  return (
    <div className="space-y-3 px-4 pb-4">
      {orders.map(o => {
        const f = FARMERS.find(x => x.id === o.fid), done = o.step >= 5;
        return (
          <Sheet c={c} key={o.id} className="overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ background: c.raise, borderColor: c.line }}>
              <span className="text-xs font-bold" style={{ ...num, color: c.ink }}>{o.code}</span>
              <Pill c={c} tone={done ? "green" : "gold"}>{t(STEPS[o.step])}</Pill>
              <span className="ml-auto text-xs" style={{ color: c.muted }}>{o.date}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <InitialsAvatar id={f.id} size={34} c={c} />
                <div>
                  <div className="text-xs font-bold" style={{ color: c.ink }}>{f.store[lang]}</div>
                  <div className="text-xs" style={{ color: c.muted }}>{o.items.length} {t("items_word")}</div>
                </div>
              </div>
              <div className="text-right">
                <div style={{ ...num, fontFamily: FD, fontWeight: 700, fontSize: 16, color: c.ink }}>{inr(o.total)}</div>
                {o.step < 5 && (
                  <button onClick={() => advance(o.id)} className="mt-1 rounded px-2 py-0.5 text-xs font-semibold"
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
    <div className="pb-4 px-4 space-y-3">
      <div className="rounded-xl p-4" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
        <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: c.line }}>
          <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: c.ink }}>{lang === 0 ? "Mandi Reference Board" : "मंडी संदर्भ भाव"}</span>
          <span className="text-xs" style={{ color: c.muted }}>Daily Feed</span>
        </div>
        <div className="mt-2 space-y-1">
          {rows.map(x => (
            <button key={x.pid} onClick={() => setSel(x.pid)} className="flex w-full items-center justify-between p-2 rounded-lg text-left"
              style={{ background: sel === x.pid ? c.raise : "transparent" }}>
              <div className="flex items-center gap-2">
                <Produce id={x.pid} size={22} />
                <span className="text-xs font-semibold" style={{ color: c.ink }}>{x.p.name[lang]}</span>
              </div>
              <span style={{ ...num, fontWeight: 700, fontSize: 13, color: c.ink }}>₹{x.p.mandi}/kg</span>
            </button>
          ))}
        </div>
      </div>

      <Sheet c={c} className="p-4">
        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: c.line }}>
          <Produce id={r.pid} size={26} />
          <span className="text-xs font-bold" style={{ color: c.ink }}>{r.p.name[lang]} Price Journey</span>
        </div>
        <div className="mt-3 space-y-2">
          {bars.map((b, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: c.muted }}>{b.l[lang]}</span>
                <span className="font-bold" style={{ ...num, color: b.col }}>{inr1(b.v)}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: c.raise }}>
                <div className="h-1.5 rounded-full" style={{ width: `${(b.v / top) * 100}%`, background: b.col }} />
              </div>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FARMER SCREENS (Consolidated KPI Cards & Trends)
   ════════════════════════════════════════════════════════════ */
const ME = "f1";
const big = { fontFamily: FD, fontWeight: 700 };

/* ── Weather Visual Helper ─────────────────────────────────── */
function getWeatherVisuals(code, lang = 0) {
  if (code === 0) return { label: lang === 0 ? "Clear Sky" : "साफ़ आसमान", Icon: Sun, color: "#F59E0B", bg: "./weather/sunny.jpg" };
  if ([1, 2].includes(code)) return { label: lang === 0 ? "Partly Cloudy" : "आंशिक बादल", Icon: CloudSun, color: "#FBBF24", bg: "./weather/clear.jpg" };
  if (code === 3) return { label: lang === 0 ? "Overcast" : "घने बादल", Icon: Cloud, color: "#94A3B8", bg: "./weather/cloudy.jpg" };
  if ([45, 48].includes(code)) return { label: lang === 0 ? "Foggy" : "कोहरा", Icon: Cloud, color: "#94A3B8", bg: "./weather/cloudy.jpg" };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: lang === 0 ? "Rain / Showers" : "बारिश", Icon: CloudRain, color: "#60A5FA", bg: "./weather/rain.jpg" };
  if ([95, 96, 99].includes(code)) return { label: lang === 0 ? "Thunderstorm" : "तूफ़ान व गरज", Icon: CloudLightning, color: "#C084FC", bg: "./weather/cloudy.jpg" };
  return { label: lang === 0 ? "Mild" : "सामान्य", Icon: CloudSun, color: "#4ADE80", bg: "./weather/clear.jpg" };
}

/* ── Auto-Sliding Farmer Hero Carousel (2 Slides) ─────────── */
function FarmerHeroCarousel({ c, t, lang, go, onRainAlert, wide }) {
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [weather, setWeather] = useState(null);
  const touchStartX = useRef(null);
  const autoSlideTimer = useRef(null);

  // Fetch Open-Meteo weather data for Ghaziabad (28.6692° N, 77.4538° E)
  useEffect(() => {
    let mounted = true;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=28.6692&longitude=77.4538&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata")
      .then(res => res.json())
      .then(data => {
        if (mounted && data?.current && data?.daily) {
          setWeather(data);
          const tomorrowRainProb = data.daily.precipitation_probability_max?.[1] || 0;
          if (onRainAlert && tomorrowRainProb > 50) {
            onRainAlert(tomorrowRainProb);
          }
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [onRainAlert]);

  // Auto-advance every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    autoSlideTimer.current = setInterval(() => {
      setSlide(s => (s === 0 ? 1 : 0));
    }, 5500);
    return () => clearInterval(autoSlideTimer.current);
  }, [isPaused]);

  const handleManualNav = newSlide => {
    setSlide(newSlide);
    setIsPaused(true);
    clearTimeout(autoSlideTimer.current);
    setTimeout(() => setIsPaused(false), 5500);
  };

  const handleTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 35) {
      handleManualNav(1); // Swipe left
    } else if (diff < -35) {
      handleManualNav(0); // Swipe right
    }
    touchStartX.current = null;
  };

  // Weather fallback & calculations
  const currentTemp = weather?.current?.temperature_2m ?? 28;
  const weatherCode = weather?.current?.weather_code ?? 1;
  const humidity = weather?.current?.relative_humidity_2m ?? 62;
  const wind = weather?.current?.wind_speed_10m ?? 8.2;
  const currentVisual = getWeatherVisuals(weatherCode, lang);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysHi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
  const todayIndex = new Date().getDay();

  const forecastDays = useMemo(() => {
    return [0, 1, 2, 3, 4].map(i => {
      const dayIdx = (todayIndex + i) % 7;
      const dayName = i === 0 ? (lang === 0 ? "Today" : "आज") : (lang === 0 ? days[dayIdx] : daysHi[dayIdx]);
      const code = weather?.daily?.weather_code?.[i] ?? (i === 1 ? 61 : i === 2 ? 2 : 1);
      const maxT = Math.round(weather?.daily?.temperature_2m_max?.[i] ?? (32 - (i === 1 ? 4 : 0)));
      const minT = Math.round(weather?.daily?.temperature_2m_min?.[i] ?? (24 - (i === 1 ? 2 : 0)));
      const rainProb = weather?.daily?.precipitation_probability_max?.[i] ?? (i === 1 ? 65 : 15);
      const vis = getWeatherVisuals(code, lang);
      return { dayName, code, maxT, minT, rainProb, vis };
    });
  }, [weather, lang, todayIndex]);

  return (
    <div
      className={"relative overflow-hidden rounded-2xl text-white select-none " + (wide ? "min-h-[380px]" : "min-h-[390px]")}
      style={{
        background: "#133522",
        boxShadow: liftHi(c),
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>

      {/* ── Slide 1: Family Welcome ── */}
      <div
        className={"absolute inset-0 transition-opacity duration-700 " +
          (slide === 0 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0")}>
        
        {wide ? (
          /* ── Desktop Wide Layout ── */
          <div className="relative h-full flex items-center p-8 min-h-[380px]">
            {/* Photo on right */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none overflow-hidden">
              <img
                src="./farmer-family.jpg"
                alt="Farmer family in the field"
                className="h-full w-full object-cover"
                style={{ objectPosition: "52% 10%" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, #133522 0%, rgba(19,53,34,0.65) 15%, rgba(19,53,34,0.12) 34%, transparent 55%)",
                }}
              />
            </div>

            {/* Text on left */}
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md mb-2.5 border"
                style={{ background: "rgba(19,53,34,0.75)", borderColor: "rgba(255,255,255,0.25)", color: "#FFFFFF" }}>
                <Sparkles size={12} className="text-amber-300" />
                <span>{lang === 0 ? "🌾 Verified Farmer" : "🌾 सत्यापित किसान"}</span>
              </div>

              <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 26, lineHeight: 1.15, textShadow: "0 2px 10px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.85)" }}>
                {lang === 0 ? "Good morning, Ramesh." : "सुप्रभात, रमेश जी।"}
              </h1>

              <p className="mt-2.5 text-xs md:text-sm leading-relaxed max-w-sm"
                style={{ color: "rgba(255, 255, 255, 0.95)", textShadow: "0 2px 8px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.85)" }}>
                {lang === 0
                  ? "Track today's earnings, orders, and deliveries — all in one place."
                  : "आज की कमाई, नए ऑर्डर और डिलीवरी — सब कुछ एक ही जगह देखें।"}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => go("earn")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-200 hover:text-white transition-colors"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
                  <span>{lang === 0 ? "View today's summary" : "आज का सारांश देखें"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Mobile Layout (Full Photo + Clean Bottom Text) ── */
          <div className="relative h-full min-h-[390px] flex flex-col justify-end p-4 pb-7">
            {/* Full coverage photo: Natural sunlight, NO green overlay on the family */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src="./farmer-family.jpg"
                alt="Farmer family in the field"
                className="h-full w-full object-cover"
                style={{ objectPosition: "52% 8%" }}
              />
              {/* Scrim strictly behind the bottom text ONLY */}
              <div
                className="absolute inset-x-0 bottom-0 h-48"
                style={{
                  background: "linear-gradient(0deg, rgba(8,24,15,0.94) 0%, rgba(8,24,15,0.7) 48%, rgba(8,24,15,0.15) 78%, transparent 100%)",
                }}
              />
            </div>

            {/* Text block strictly in the bottom third below the faces */}
            <div className="relative z-10 w-full">
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md mb-2 border"
                style={{ background: "rgba(8,24,15,0.78)", borderColor: "rgba(255,255,255,0.25)", color: "#FFFFFF" }}>
                <Sparkles size={12} className="text-amber-300" />
                <span>{lang === 0 ? "🌾 Verified Farmer" : "🌾 सत्यापित किसान"}</span>
              </div>

              <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 23, lineHeight: 1.15, textShadow: "0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)" }}>
                {lang === 0 ? "Good morning, Ramesh." : "सुप्रभात, रमेश जी।"}
              </h1>

              <p className="mt-1 text-xs leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.95)", textShadow: "0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)" }}>
                {lang === 0
                  ? "Track today's earnings, orders, and deliveries — all in one place."
                  : "आज की कमाई, नए ऑर्डर और डिलीवरी — सब कुछ एक ही जगह देखें।"}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => go("earn")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-200 hover:text-white transition-colors"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                  <span>{lang === 0 ? "View today's summary" : "आज का सारांश देखें"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Slide 2: Weather Forecast ── */}
      <div
        className={"absolute inset-0 flex flex-col justify-between p-5 md:p-8 transition-opacity duration-700 " +
          (slide === 1 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0")}>
        
        {/* Weather Background Image with glassmorphism gradient scrim */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={currentVisual.bg || "./weather-bg.jpg"}
            alt="Weather Forecast Background"
            className="h-full w-full object-cover transition-all duration-1000 scale-105"
            style={{ objectPosition: "center 38%" }}
          />
          {/* Multi-layer gradient scrim for crisp readability */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(10,26,17,0.78) 0%, rgba(10,26,17,0.56) 40%, rgba(6,17,11,0.92) 100%)",
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[0.5px]" />
        </div>

        {/* Top Header & Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md border shadow-sm"
            style={{ background: "rgba(10,26,17,0.78)", borderColor: "rgba(255,255,255,0.25)", color: "#FFFFFF" }}>
            <CloudSun size={13} className="text-amber-300" />
            <span>{lang === 0 ? "🌤️ Live Weather • Loni, Ghaziabad" : "🌤️ लाइव मौसम • लोनी, ग़ाज़ियाबाद"}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-emerald-100 font-medium px-3 py-1 rounded-full backdrop-blur-md border border-white/15"
            style={{ background: "rgba(10,26,17,0.65)" }}>
            <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-300" /> {humidity}% {lang === 0 ? "Humidity" : "नमी"}</span>
            <span className="flex items-center gap-1"><Leaf size={12} className="text-emerald-300" /> {wind} km/h {lang === 0 ? "Wind" : "हवा"}</span>
          </div>
        </div>

        {/* Middle Main Temperature & Conditions */}
        <div className="relative z-10 my-auto py-2">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl backdrop-blur-md border shrink-0 shadow-lg"
              style={{ background: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.3)" }}>
              <currentVisual.Icon size={34} style={{ color: currentVisual.color }} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span style={{ ...big, ...num, fontSize: 36, lineHeight: 1, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{Math.round(currentTemp)}°C</span>
                <span className="text-sm font-semibold text-emerald-100" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{currentVisual.label}</span>
              </div>
              <p className="mt-1 text-xs text-white/95 max-w-sm" style={{ textShadow: "0 1px 5px rgba(0,0,0,0.85)" }}>
                {lang === 0
                  ? "Optimal harvest conditions for tomatoes & leafy greens today."
                  : "टमाटर और पत्तेदार सब्ज़ियों की कटाई के लिए आज उत्तम मौसम।"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom 5-Day Forecast Strip */}
        <div className="relative z-10 pt-2.5 border-t grid grid-cols-5 gap-1.5 sm:gap-2 text-center"
          style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          {forecastDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-between rounded-xl py-1.5 px-1 backdrop-blur-md border transition-all shadow-sm"
              style={{
                background: idx === 0 ? "rgba(255,255,255,0.24)" : "rgba(10,26,17,0.72)",
                borderColor: idx === 0 ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.15)",
              }}>
              <span className="text-[10px] sm:text-[11px] font-semibold text-white/95">
                {item.dayName}
              </span>
              <div className="my-1">
                <item.vis.Icon size={16} style={{ color: item.vis.color }} />
              </div>
              <div className="text-[11px] sm:text-xs font-bold leading-none text-white" style={num}>
                {item.maxT}°
                <span className="ml-0.5 text-[9px] sm:text-[10px] font-normal text-white/75">{item.minT}°</span>
              </div>
              {item.rainProb > 40 ? (
                <span className="mt-1 inline-flex items-center rounded px-1 py-0.2 text-[8px] sm:text-[9px] font-bold bg-blue-500/40 text-blue-100 border border-blue-400/40">
                  💧{item.rainProb}%
                </span>
              ) : (
                <span className="mt-1 text-[8px] sm:text-[9px] text-white/80">
                  {item.vis.label.split(" ")[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Carousel Dot Indicators (Bottom Right) ── */}
      <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-1.5">
        <button
          onClick={() => handleManualNav(0)}
          aria-label="Slide 1 - Welcome"
          className={"h-1.5 transition-all duration-300 rounded-full " + (slide === 0 ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70")}
        />
        <button
          onClick={() => handleManualNav(1)}
          aria-label="Slide 2 - Weather"
          className={"h-1.5 transition-all duration-300 rounded-full " + (slide === 1 ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70")}
        />
      </div>

      {/* Subtle Desktop Left/Right Arrows */}
      {wide && (
        <>
          <button
            onClick={() => handleManualNav(slide === 0 ? 1 : 0)}
            aria-label="Previous Slide"
            className="hidden md:grid absolute left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 place-items-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => handleManualNav(slide === 0 ? 1 : 0)}
            aria-label="Next Slide"
            className="hidden md:grid absolute right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 place-items-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
            <ArrowRight size={14} />
          </button>
        </>
      )}
    </div>
  );
}

/* ── Smart Notifications Panel ─────────────────────────────── */
function SmartNotifications({ c, t, lang, rainAlertProb }) {
  const [notifications, setNotifications] = useState([
    {
      id: "n_rain",
      type: "weather",
      Icon: CloudRain,
      iconColor: "#2563EB",
      iconBg: "rgba(59,130,246,0.12)",
      title: ["Rain Alert: Heavy Rain Expected", "बारिश का अलर्ट: भारी बारिश की संभावना"],
      desc: [
        `Tomorrow's rain probability is ${rainAlertProb || 65}%. Pause spray operations & ensure trench drainage.`,
        `कल बारिश की संभावना ${rainAlertProb || 65}% है। कीटनाशक छिड़काव रोकें और जल निकासी दुरुस्त रखें।`
      ],
      time: ["10m ago", "10 मिनट पहले"],
      read: false
    },
    {
      id: "n_mandi",
      type: "price",
      Icon: TrendingUp,
      iconColor: "#16A34A",
      iconBg: "rgba(22,163,74,0.12)",
      title: ["Mandi Alert: Tomato Price Up +₹2.5/kg", "मंडी अलर्ट: टमाटर के भाव में +₹2.5/किलो की तेज़ी"],
      desc: [
        "Modal rate reached ₹22/kg in Sahibabad & Ghazipur mandis. Demand is strong for A-Grade crates.",
        "साहिबाबाद और ग़ाज़ीपुर मंडी में मॉडल भाव ₹22/किलो पहुँचा। A-ग्रेड क्रेट की भारी मांग।"
      ],
      time: ["1h ago", "1 घंटा पहले"],
      read: false
    },
    {
      id: "n_crop",
      type: "crop",
      Icon: Sprout,
      iconColor: "#059669",
      iconBg: "rgba(5,150,105,0.12)",
      title: ["Crop Reminder: Tomato Drip Cycle", "फसल अनुस्मारक: टमाटर ड्रिप सिंचाई चक्र"],
      desc: [
        "Scheduled 25-min evening drip irrigation recommended for Plot 2 tomato beds.",
        "खेत संख्या 2 के टमाटर के लिए शाम को 25 मिनट का ड्रिप चक्र चलाने का समय।"
      ],
      time: ["3h ago", "3 घंटे पहले"],
      read: false
    },
    {
      id: "n_scheme",
      type: "scheme",
      Icon: Landmark,
      iconColor: "#D98E18",
      iconBg: "rgba(217,142,24,0.14)",
      title: ["Govt Scheme: PMKSY 55% Drip Subsidy", "सरकारी योजना: PMKSY 55% ड्रिप सब्सिडी"],
      desc: [
        "UP Horticulture Dept opened application window for micro-irrigation equipment subsidy.",
        "उद्यान विभाग यूपी ने ड्रिप एवं सूक्ष्म सिंचाई यंत्रों पर 55% अनुदान पोर्टल शुरू किया।"
      ],
      time: ["1d ago", "1 दिन पहले"],
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = id => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  };

  return (
    <Sheet c={c} className="p-4" tone={c.surface}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-full" style={{ background: c.greenSoft, color: c.green }}>
            <Bell size={13} />
          </div>
          <div className="text-xs font-semibold uppercase" style={{ color: c.muted, letterSpacing: "0.08em" }}>
            {t("smart_alerts")}
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: c.green }}>
              {unreadCount} {t("unread_alerts")}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: c.green }}>
            {t("mark_all_read")}
          </button>
        )}
      </div>

      {/* List of Notification Rows */}
      <div className="space-y-2">
        {notifications.map(n => {
          const isUnread = !n.read;
          return (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className="group flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-all"
              style={{
                background: isUnread ? c.raise : "transparent",
                border: isUnread ? `1px solid ${c.line}` : "1px solid transparent",
              }}>
              {/* Category Icon */}
              <div className="grid shrink-0 h-9 w-9 place-items-center rounded-lg mt-0.5"
                style={{ background: n.iconBg, color: n.iconColor }}>
                <n.Icon size={18} />
              </div>

              {/* Text content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={"text-xs leading-tight " + (isUnread ? "font-bold" : "font-semibold")}
                    style={{ color: c.ink }}>
                    {n.title[lang]}
                  </span>
                  <span className="shrink-0 text-[10px]" style={{ color: c.muted }}>
                    {n.time[lang]}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: isUnread ? c.ink : c.muted }}>
                  {n.desc[lang]}
                </p>
              </div>

              {/* Unread indicator dot & chevron */}
              <div className="flex shrink-0 items-center gap-1.5 self-center">
                {isUnread && (
                  <span className="h-2 w-2 rounded-full" style={{ background: c.green }} />
                )}
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" style={{ color: c.muted }} />
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

/* Consolidated KPI & Dashboard for Farmer (Rule 3) */
function FarmerHome({ c, t, lang, go, orders, listings, startAdd, wide }) {
  const me = FARMERS.find(f => f.id === ME);
  const paid = orders.filter(o => o.step >= 5).reduce((s, o) => s + o.farmerPayout, 0);
  const locked = orders.filter(o => o.step < 5).reduce((s, o) => s + o.farmerPayout, 0);
  const fresh = orders.filter(o => o.step < 4).length;
  const tom = PRODUCTS.find(p => p.id === "p1");
  const [rainProb, setRainProb] = useState(65);

  // Sample weekly sparkline data
  const weekSpark = [
    { day: "Mon", v: 3100 }, { day: "Tue", v: 3400 }, { day: "Wed", v: 2900 },
    { day: "Thu", v: 4200 }, { day: "Fri", v: 4600 }, { day: "Sat", v: 4820 }
  ];

  return (
    <div className="pb-4 px-4 space-y-3">
      {/* ── Upper Section with Sticky-Until-Anchor Action Button ── */}
      <div className="space-y-3">
        {/* Auto-sliding Hero Carousel with Natural Color Family Slide & Live Weather Slide */}
        <FarmerHeroCarousel c={c} t={t} lang={lang} go={go} onRainAlert={prob => setRainProb(prob)} wide={wide} />

        {/* Consolidated Master Earnings & Liquidity Card */}
        <Sheet c={c} className="p-4" tone={c.surface}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase" style={{ color: c.muted, letterSpacing: "0.08em" }}>
                {t("earned_today")}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span style={{ ...big, ...num, fontSize: 32, color: c.green }}>{inr(paid + locked)}</span>
                <span className="flex items-center text-xs font-bold" style={{ color: c.green }}>
                  <TrendingUp size={12} className="mr-0.5 inline" /> +18.4%
                </span>
              </div>
            </div>
            <InitialsAvatar id={ME} size={44} c={c} verified />
          </div>

          {/* Micro-trend sparkline chart */}
          <div className="mt-2 h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekSpark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="farmSpark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.green} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={c.green} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={c.green} strokeWidth={2} fill="url(#farmSpark)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Consolidated Breakdown Columns */}
          <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t text-xs" style={{ borderColor: c.line }}>
            <div className="p-2.5 rounded-lg" style={{ background: c.raise }}>
              <div className="flex items-center gap-1.5" style={{ color: c.muted }}>
                <Wallet size={13} style={{ color: c.green }} /> {t("money_in_hand")}
              </div>
              <div className="mt-1 font-bold text-sm" style={{ ...num, color: c.green }}>{inr(paid)}</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ background: c.raise }}>
              <div className="flex items-center gap-1.5" style={{ color: c.muted }}>
                <Lock size={13} style={{ color: c.gold }} /> {t("money_waiting")}
              </div>
              <div className="mt-1 font-bold text-sm" style={{ ...num, color: c.gold }}>{inr(locked)}</div>
            </div>
          </div>
        </Sheet>

        {/* Smart Notifications Panel */}
        <SmartNotifications c={c} t={t} lang={lang} rainAlertProb={rainProb} />

        {/* Sticky-Until-Anchor "Add Crop" Action Button */}
        <div
          className="sticky z-30 pt-1 pointer-events-auto"
          style={{ bottom: wide ? 24 : 76 }}>
          <button
            onClick={startAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: c.green,
              color: "#fff",
              height: 48,
              fontSize: 15,
              boxShadow: "0 8px 24px -2px rgba(24,63,41,0.45), 0 3px 10px rgba(0,0,0,0.15)",
            }}>
            <Plus size={18} /> {t("add_crop")}
          </button>
        </div>
      </div>

      {/* Dispatch & Orders Summary */}
      <div className="grid grid-cols-2 gap-2.5">
        <button onClick={() => go("orders")} className="text-left">
          <Sheet c={c} className="p-3">
            <div className="flex items-center justify-between text-xs" style={{ color: c.muted }}>
              <span>{t("new_orders")}</span>
              <PackageCheck size={14} style={{ color: c.green }} />
            </div>
            <div className="mt-1 font-bold text-lg" style={{ ...num, color: c.ink }}>{fresh}</div>
            <div className="text-xs" style={{ color: c.muted }}>{orders.length} total orders</div>
          </Sheet>
        </button>

        <button onClick={() => go("earn")} className="text-left">
          <Sheet c={c} className="p-3">
            <div className="flex items-center justify-between text-xs" style={{ color: c.muted }}>
              <span>{t("see_route")}</span>
              <Truck size={14} style={{ color: c.green }} />
            </div>
            <div className="mt-1 font-bold text-lg" style={{ color: c.ink }}>06:10 AM</div>
            <div className="text-xs" style={{ color: c.muted }}>4 stops · 35 km</div>
          </Sheet>
        </button>
      </div>

      {/* Mandi vs Direct Comparison */}
      <Sheet c={c} className="p-3.5">
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: c.muted, letterSpacing: "0.08em" }}>{t("todays_mandi")}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Produce id="p1" size={32} />
            <div>
              <div className="text-xs font-bold" style={{ color: c.ink }}>{tom.name[lang]}</div>
              <div className="text-xs" style={{ color: c.muted }}>Mandi modal: {inr(tom.mandi)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: c.muted }}>{t("you_get_here")}</div>
            <div className="text-sm font-bold" style={{ ...num, color: c.green }}>{inr(tom.farmer)}/kg</div>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

/* Modal-driven Complex Input Flow (Rule 5: Forms in Modals) */
function AddCropModal({ c, t, lang, close, save }) {
  const [step, setStep] = useState(0), [pid, setPid] = useState(null);
  const [qty, setQty] = useState(""), [rate, setRate] = useState("");
  const p = pid ? PRODUCTS.find(x => x.id === pid) : null;
  const uniq = [];
  PRODUCTS.forEach(x => { if (!uniq.find(u => u.name[0] === x.name[0])) uniq.push(x); });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-md rounded-2xl p-5 shadow-2xl"
        style={{ background: c.surface, border: `1px solid ${c.line}`, color: c.ink, maxHeight: "90vh", overflowY: "auto" }}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: c.line }}>
          <div className="flex items-center gap-2">
            <Plus size={18} style={{ color: c.green }} />
            <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18 }}>{t("add_crop")}</h2>
          </div>
          <button onClick={close} className="p-1 rounded-md" style={{ color: c.muted }}><X size={16} /></button>
        </div>

        {/* Step Progress */}
        <div className="mt-3 flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? c.green : c.line }} />
          ))}
        </div>

        {step === 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold mb-3" style={{ color: c.muted }}>{t("step1")}</div>
            <div className="grid grid-cols-3 gap-2">
              {uniq.map(x => (
                <button key={x.id} onClick={() => { setPid(x.id); setRate(String(x.farmer)); setStep(1); }}
                  className="p-2.5 rounded-xl text-center border transition-all"
                  style={{ background: c.raise, borderColor: c.line }}>
                  <div className="mx-auto mb-1.5 flex justify-center"><Produce id={x.id} size={42} bg="beige" className="rounded-lg" /></div>
                  <div className="text-xs font-semibold truncate" style={{ color: c.ink }}>{x.name[lang]}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Produce id={p.id} size={28} />
              <span className="font-bold text-sm">{p.name[lang]}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: c.muted }}>
                {t("how_much")} ({p.unit[lang]})
              </label>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 100"
                className="w-full px-3 py-2 rounded-lg text-sm font-semibold outline-none"
                style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: c.muted }}>
                {t("your_rate")} ₹/{p.unit[lang]}
              </label>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 24"
                className="w-full px-3 py-2 rounded-lg text-sm font-semibold outline-none"
                style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }} />
            </div>

            <div className="p-3 rounded-lg text-xs" style={{ background: c.raise, color: c.muted }}>
              {t("mandi_says")} <b style={{ ...num, color: c.ink }}>{inr(p.mandi)}</b> · Net in hand: <b style={{ ...num, color: c.green }}>{inr1(p.mandi * MANDI_NET_F)}</b>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(0)} className="flex-1 rounded-lg py-2.5 text-xs font-semibold"
                style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }}>{t("back_b")}</button>
              <button onClick={() => qty && rate && setStep(2)} className="flex-1 rounded-lg py-2.5 text-xs font-bold"
                style={{ background: c.green, color: "#fff" }}>{t("next")}</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 space-y-3">
            <div className="p-3.5 rounded-xl" style={{ background: c.raise }}>
              <div className="flex items-center gap-2">
                <Produce id={p.id} size={32} bg="beige" />
                <div>
                  <div className="text-sm font-bold">{p.name[lang]}</div>
                  <div className="text-xs" style={{ color: c.muted }}>{qty} {p.unit[lang]} @ ₹{rate}/{p.unit[lang]}</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t flex justify-between items-center" style={{ borderColor: c.line }}>
                <span className="text-xs" style={{ color: c.muted }}>{t("will_earn")}</span>
                <span className="text-base font-bold" style={{ ...num, color: c.green }}>{inr((+qty) * (+rate))}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="flex-1 rounded-lg py-2.5 text-xs font-semibold"
                style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }}>{t("back_b")}</button>
              <button onClick={() => { save({ pid, rate: +rate, stock: +qty, live: true }); close(); }}
                className="flex-1 rounded-lg py-2.5 text-xs font-bold"
                style={{ background: c.green, color: "#fff" }}>{t("confirm")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FarmerProduce({ c, t, lang, listings, toggle, startAdd }) {
  return (
    <div className="pb-24 px-4 space-y-2.5">
      {listings.map((l, i) => {
        const p = PRODUCTS.find(x => x.id === l.pid);
        return (
          <Sheet c={c} key={i} className="flex items-center gap-3 p-3">
            <Produce id={p.id} size={36} />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold" style={{ color: c.ink }}>{p.name[lang]}</div>
              <div className="text-xs" style={{ ...num, color: c.muted }}>{l.stock} {p.unit[lang]} {t("left_word")}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold" style={{ ...num, color: c.green }}>{inr(l.rate)}</div>
              <button onClick={() => toggle(i)} className="mt-0.5 rounded px-2 py-0.5 text-xs"
                style={{ background: c.raise, border: `1px solid ${c.line}`, color: c.ink }}>
                {l.live ? <Pause size={12} className="inline mr-1" /> : <Play size={12} className="inline mr-1" />}
                {l.live ? t("on_sale") : t("paused")}
              </button>
            </div>
          </Sheet>
        );
      })}
      <div className="fixed bottom-0 left-1/2 z-40 w-full px-4 pb-16" style={{ maxWidth: 430, transform: "translateX(-50%)" }}>
        <button onClick={startAdd} className="flex w-full items-center justify-center gap-2 rounded-xl font-semibold"
          style={{ background: c.green, color: "#fff", height: 48, fontSize: 14, boxShadow: `0 4px 14px -4px ${c.cast}` }}>
          <Plus size={16} /> {t("add_crop")}
        </button>
      </div>
    </div>
  );
}

function FarmerOrders({ c, t, lang, orders, advance, rate }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      {orders.map(o => {
        const paid = o.step >= 5;
        return (
          <Sheet c={c} key={o.id} className="p-3.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold" style={{ color: c.ink }}>{o.buyer[lang]}</div>
                <div className="text-xs" style={{ color: c.muted }}>{o.date}</div>
              </div>
              <Pill c={c} tone={paid ? "green" : "gold"}>{t(STEPS[o.step])}</Pill>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t" style={{ borderColor: c.line }}>
              <div>
                <div className="text-xs" style={{ color: c.muted }}>{paid ? t("released") : t("held")}</div>
                <div className="text-sm font-bold" style={{ ...num, color: paid ? c.green : c.gold }}>{inr(o.farmerPayout)}</div>
              </div>
              {o.step < 5 && (
                <button onClick={() => advance(o.id)} className="rounded-lg px-3 py-1.5 text-xs font-bold"
                  style={{ background: c.green, color: "#fff" }}>
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
  const tip = { background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, color: c.ink, fontSize: 12 };

  return (
    <div className="pb-4 px-4 space-y-3">
      <div className="flex gap-1.5">
        {["day", "week", "month", "year"].map(k => (
          <button key={k} onClick={() => setPer(k)} className="flex-1 rounded-lg py-1.5 text-xs font-semibold"
            style={{
              background: per === k ? c.green : c.surface, color: per === k ? "#fff" : c.muted,
              border: `1px solid ${per === k ? c.green : c.line}`,
            }}>{t(k)}</button>
        ))}
      </div>

      {/* Consolidated Financial Summary Card (Rule 3) */}
      <Sheet c={c} className="p-4">
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: c.muted, letterSpacing: "0.08em" }}>
          P&L Summary
        </div>
        <div className="grid grid-cols-3 gap-2 text-center py-1">
          <div>
            <div className="text-xs" style={{ color: c.muted }}>{t("sold_word")}</div>
            <div className="font-bold text-sm" style={{ ...num, color: c.ink }}>{inr(rev)}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: c.muted }}>{t("spent_word")}</div>
            <div className="font-bold text-sm" style={{ ...num, color: c.red }}>{inr(exp)}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: c.muted }}>{t("kept_word")}</div>
            <div className="font-bold text-sm" style={{ ...num, color: c.green }}>{inr(rev - exp)}</div>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t flex justify-between text-xs" style={{ borderColor: c.line, color: c.muted }}>
          <span>Net Profit Retention Margin</span>
          <span className="font-bold text-green-700" style={{ color: c.green }}>{Math.round(((rev - exp) / rev) * 100)}%</span>
        </div>
      </Sheet>

      {/* Monthly Chart */}
      <Sheet c={c} className="p-4">
        <div className="text-xs font-semibold mb-2" style={{ color: c.muted }}>{t("chart_month_h")}</div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY.map(x => ({ name: x.m[lang], ...x }))} margin={{ top: 4, right: 2, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="name" tick={tx} axisLine={false} tickLine={false} />
              <YAxis tick={tx} axisLine={false} tickLine={false} tickFormatter={v => v / 1000 + "k"} />
              <Tooltip formatter={v => inr(v)} contentStyle={tip} />
              <Area type="monotone" dataKey="rev" stroke={c.green} fill={c.greenSoft} name={t("sold_word")} />
              <Line type="monotone" dataKey="profit" stroke={c.goldBright} strokeWidth={2} dot={false} name={t("kept_word")} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Sheet>
    </div>
  );
}

/* ── legal pages ───────────────────────────────────────────── */
const PRIVACY = [
  { h: ["Data Processing & Retention", "डेटा प्रसंस्करण"],
    p: ["We process only necessary identifiers under the DPDP Act 2023 for order logistics and direct farm payouts. No advertising profiles or third-party brokers."] },
  { h: ["Farmer Record Sovereignty", "किसान रिकॉर्ड संप्रभुता"],
    p: ["A farmer's sales record belongs exclusively to them. Exportable anytime without platform lock-in."] },
];

const TERMS = [
  { h: ["Marketplace Intermediary", "बिचौलिया मंच नियम"],
    p: ["Kisan Setu functions as an open marketplace intermediary under Consumer Protection Rules 2020. The farmer is the independent seller of record."] },
  { h: ["Escrow Protection & Transit Fund", "एस्क्रो और परिवहन सुरक्षा"],
    p: ["Buyer payments remain locked until verified delivery. Transit loss discrepancies are absorbed by the safety fund, leaving farmer payouts untouched."] },
];

function Legal({ c, t, lang, tab, setTab }) {
  const doc = tab === "privacy" ? PRIVACY : TERMS;
  return (
    <div className="px-4 pb-6 space-y-3">
      <div className="flex gap-2">
        {[["privacy", ["Privacy Policy", "निजता नीति"]], ["terms", ["Terms of Service", "नियम"]]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-lg px-3 py-1.5 text-xs font-semibold"
            style={{
              background: tab === k ? c.greenSoft : c.surface, color: tab === k ? c.green : c.muted,
              border: `1px solid ${tab === k ? c.green : c.line}`,
            }}>{l[lang]}</button>
        ))}
      </div>

      <Sheet c={c} className="p-4 space-y-3 text-xs">
        {doc.map((sec, i) => (
          <div key={i}>
            <div className="font-bold text-sm" style={{ color: c.ink }}>{sec.h[lang]}</div>
            <p className="mt-1 leading-relaxed" style={{ color: c.muted }}>{sec.p[lang]}</p>
          </div>
        ))}
      </Sheet>
    </div>
  );
}

function useViewport() {
  const [w, setW] = useState(typeof window === "undefined" ? 1280 : window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

/* Web Header (Rule 4: Clean, left-aligned, popovers for secondary items) */
function TopNav({ c, t, lang, setLang, dark, setDark, tabs, view, go, cartCount, role, pick, addr, setAddr, openLegal, mobilePreview, setMobilePreview }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30" style={{ background: c.bg, borderBottom: `1px solid ${c.line}` }}>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-2.5">
        <button onClick={() => go(tabs[0][0])} className="flex shrink-0 items-center gap-2">
          <Logo size={28} green={c.green} gold={c.goldBright} />
          <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: c.ink }}>{t("brand")}</span>
        </button>

        {/* Minimal left-aligned tab navigation */}
        <nav className="flex items-center gap-1">
          {tabs.filter(([id]) => id !== "cart").map(([id, label, Ic]) => {
            const on = view === id;
            return (
              <button key={id} onClick={() => go(id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{ color: on ? c.green : c.muted, background: on ? c.greenSoft : "transparent" }}>
                <Ic size={14} />{label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Profile Popover */}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setMobilePreview(!mobilePreview)} title="Toggle Handset Preview"
            className="grid place-items-center rounded-lg"
            style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
            {mobilePreview ? <Monitor size={14} /> : <Smartphone size={14} />}
          </button>
          {role !== "farmer" && (
            <button onClick={() => go("cart")} className="relative grid place-items-center rounded-lg"
              style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
              <ShoppingCart size={14} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid place-items-center rounded-full text-xs font-bold"
                  style={{ background: c.green, color: "#fff", minWidth: 16, height: 16, fontSize: 9 }}>{cartCount}</span>
              )}
            </button>
          )}
          <button onClick={() => setMenuOpen(true)} className="flex items-center gap-2 rounded-lg px-2.5 py-1"
            style={{ background: c.surface, border: `1px solid ${c.line}` }}>
            <InitialsAvatar id={role === "farmer" ? ME : null} size={24} c={c} />
            <span className="text-xs font-semibold" style={{ color: c.ink }}>
              {role === "farmer" ? "Farmer" : role === "retailer" ? "Retailer" : "Buyer"}
            </span>
            <ChevronDown size={13} style={{ color: c.muted }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <AccountPopover c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
          role={role} pick={pick} addr={addr} setAddr={setAddr} openLegal={openLegal} close={() => setMenuOpen(false)} />
      )}
    </header>
  );
}

/* ── Seeds & Main App Entry ────────────────────────────────── */
const BUYER_ORDERS = [
  { id: 1, code: "KS-2418", fid: "f3", step: 4, date: "12 Sep", items: [{ id: "p8", qty: 10 }], total: 520, transport: 113, farmerPayout: 507, pickup: 10, loss: .6, rated: false },
  { id: 2, code: "KS-2415", fid: "f1", step: 2, date: "12 Sep", items: [{ id: "p1", qty: 6 }, { id: "p3", qty: 3 }], total: 178, transport: 37, farmerPayout: 163, pickup: 9, loss: 0, rated: false },
  { id: 3, code: "KS-2409", fid: "f5", step: 5, date: "10 Sep", items: [{ id: "p13", qty: 8 }, { id: "p14", qty: 1 }], total: 976, transport: 205, farmerPayout: 958, pickup: 9, loss: 0, rated: true },
];

const FARM_ORDERS = [
  { id: 11, code: "KS-2418", buyer: ["Neha Sharma, Indirapuram", "नेहा शर्मा, इंदिरापुरम"], step: 5, date: "13 Sep", items: [{ id: "p1", qty: 8 }, { id: "p3", qty: 4 }], transport: 74, farmerPayout: 3560, pickup: 12, loss: 0, ratedBuyer: true },
  { id: 12, code: "KS-2417", buyer: ["Gupta Sabzi Store, Vaishali", "गुप्ता सब्ज़ी स्टोर, वैशाली"], step: 2, date: "13 Sep", items: [{ id: "p2", qty: 60 }], transport: 74, farmerPayout: 1260, pickup: 60, loss: 0, ratedBuyer: false },
];

export default function KisanSetu() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState(0);
  const [role, setRole] = useState(null);
  const [gate, setGate] = useState(false);
  const [view, setView] = useState("home");
  const [stack, setStack] = useState(null);
  const [pid, setPid] = useState("p1");
  const [fid, setFid] = useState("f1");
  const [cat, setCat] = useState("all");
  const [addr, setAddr] = useState("Ghaziabad 201009");
  const [cart, setCart] = useState([]);
  const [bOrders, setBOrders] = useState(BUYER_ORDERS);
  const [fOrders, setFOrders] = useState(FARM_ORDERS);
  const [listings, setListings] = useState(PRODUCTS.filter(p => p.fid === ME).map(p => ({ pid: p.id, rate: p.farmer, stock: p.stock, live: true })));
  const [mobilePreview, setMobilePreview] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");
  const [addModalOpen, setAddModalOpen] = useState(false);
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
  const openLegal = tab => { setLegalTab(tab || "privacy"); push("legal"); };

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
    produce: t("nav_f_produce"), earn: t("earn_h"),
    product: PRODUCTS.find(p => p.id === pid)?.name[lang],
    store: FARMERS.find(f => f.id === fid)?.store[lang],
    legal: legalTab === "privacy" ? "Privacy Policy" : "Terms & Conditions",
  };
  const cur = stack || view;
  const pushed = !!stack;

  const body = (
    <div style={{ paddingBottom: desktop ? 24 : cur === "product" ? 110 : cur === "cart" ? 180 : 88 }}>
      {cur === "legal" ? <Legal c={c} t={t} lang={lang} tab={legalTab} setTab={setLegalTab} /> : farmer ? (
        <>
          {cur === "home" && <FarmerHome c={c} t={t} lang={lang} go={go} orders={fOrders}
            listings={listings} startAdd={() => setAddModalOpen(true)} wide={desktop} />}
          {cur === "produce" && <FarmerProduce c={c} t={t} lang={lang} listings={listings}
            toggle={i => setListings(ls => ls.map((l, j) => j === i ? { ...l, live: !l.live } : l))}
            startAdd={() => setAddModalOpen(true)} />}
          {cur === "orders" && <FarmerOrders c={c} t={t} lang={lang} orders={fOrders}
            advance={id => bump(setFOrders, id)}
            rate={id => setFOrders(os => os.map(o => o.id === id ? { ...o, ratedBuyer: true } : o))} />}
          {cur === "earn" && <FarmerEarnings c={c} t={t} lang={lang} />}
        </>
      ) : (
        <>
          {cur === "home" && <BuyerHome c={c} t={t} lang={lang} role={role} go={go} openStore={openStore}
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
    </div>
  );

  return (
    <div style={{ fontFamily: FB }}>
      {desktop ? (
        <div style={{ background: c.bg, color: c.ink, minHeight: "100vh" }}>
          <TopNav c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark} tabs={tabs}
            view={view} go={go} cartCount={cartCount} role={role} pick={pick}
            addr={addr} setAddr={setAddr} openLegal={openLegal}
            mobilePreview={mobilePreview} setMobilePreview={setMobilePreview} />
          <main className={"mx-auto px-4 pt-6 " + (["home", "shop", "store"].includes(cur) ? "max-w-6xl" : "max-w-3xl")}>
            {pushed && (
              <button onClick={pop} className="mb-4 flex items-center gap-2 text-xs font-semibold" style={{ color: c.muted }}>
                <ArrowLeft size={14} /> {t("back")}
              </button>
            )}
            {body}
          </main>
        </div>
      ) : (
        <Phone c={c}>
          <AppBar c={c} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
            title={titles[cur]} addr={addr} role={role} pick={pick} openLegal={openLegal}
            back={pushed ? pop : null}
            right={vw >= 1024 ? (
              <button onClick={() => setMobilePreview(false)} className="grid place-items-center rounded-lg"
                style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}`, color: c.ink }}>
                <Monitor size={14} />
              </button>
            ) : null} />
          {body}
          {!pushed && <TabBar c={c} tabs={tabs} view={view} go={go} cartCount={cartCount} />}
        </Phone>
      )}

      {/* Complex Input Modal for Add Crop (Rule 5) */}
      {addModalOpen && (
        <AddCropModal c={c} t={t} lang={lang} close={() => setAddModalOpen(false)}
          save={l => setListings(ls => [l, ...ls])} />
      )}
    </div>
  );
}

