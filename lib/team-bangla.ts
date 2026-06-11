export const fifaTeamsMap: Record<string, string> = {

  "united states": "মার্কিন যুক্তরাষ্ট্র",
  "mexico": "মেক্সিকো",
  "canada": "কানাডা",
  "jamaica": "জ্যামাইকা",
  "costa rica": "কোস্টা রিকা",
  "panama": "পানামা",
  "honduras": "হন্ডুরাস",
  "el salvador": "এল সালভাদর",


  "argentina": "আর্জেন্টিনা",
  "brazil": "ব্রাজিল",
  "uruguay": "উরুগুয়ে",
  "colombia": "কলম্বিয়া",
  "ecuador": "ইকুয়েডর",
  "paraguay": "প্যারাগুয়ে",
  "venezuela": "ভেনিজুয়েলা",
  "chile": "চিলি",
  "peru": "পেরু",


  "france": "ফ্রান্স",
  "england": "ইংল্যান্ড",
  "spain": "স্পেন",
  "germany": "জার্মানি",
  "portugal": "পর্তুগাল",
  "italy": "ইতালি",
  "netherlands": "নেদারল্যান্ডস",
  "belgium": "বেলজিয়াম",
  "croatia": "ক্রোয়েশিয়া",
  "switzerland": "সুইজারল্যান্ড",
  "denmark": "ডেনমার্ক",
  "ukraine": "ইউক্রেন",
  "austria": "অস্ট্রিয়া",
  "poland": "পোল্যান্ড",
  "serbia": "সার্বিয়া",
  "scotland": "স্কটল্যান্ড",


  "morocco": "মরক্কো",
  "senegal": "সেনেগাল",
  "tunisia": "তিউনিসিয়া",
  "algeria": "আলজেরিয়া",
  "egypt": "মিশর",
  "nigeria": "নাইজেরিয়া",
  "cameroon": "ক্যামেরুন",
  "ivory coast": "আইভরি কোস্ট",
  "ghana": "ঘানা",
  "mali": "মালি",
  "south africa": "দক্ষিণ আফ্রিকা",


  "japan": "জাপান",
  "south korea": "দক্ষিণ কোরিয়া",
  "iran": "ইরান",
  "saudi arabia": "সৌদি আরব",
  "australia": "অস্ট্রেলিয়া",
  "qatar": "কাতার",
  "iraq": "ইরাক",
  "uzbekistan": "উজবেকিস্তান",
  "united arab emirates": "সংযুক্ত আরব আমিরাত",
  "jordan": "জর্ডান",


  "new zealand": "নিউজিল্যান্ড",

  "bosnia-herzegovina" : "বস্নিয়া-হার্জেগোভিনা",
  "czechia" : "চেক প্রজাতন্ত্র",
  "slovakia" : "স্লোভাকিয়া",
  "haiti" : "হাইতি",
  "turkey" : "তুরস্ক",
  "curaçao": "কুরাকাও",
  "trinidad and tobago": "ত্রিনিদাদ ও টোবাগো","sweden": "সুইডেন", "cape verde islands": "কেপ ভার্দে দ্বীপপুঞ্জ", "congo dr": "কঙ্গো ডিআর", "norway": "নরওয়ে",
};


export const teamInBangla = (englishName: string): string => {
  const sanitized = englishName?.toLowerCase()?.trim();
  return fifaTeamsMap[sanitized] || englishName;
};
