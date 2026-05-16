// Think Mink NYC — data layer

const TM_DATA = {
  // === Wigs ===
  wigs: [
    {
      id: "wig-1",
      name: "Natural Black 1B Full Lace — Body Wave",
      tags: ["full-lace"],
      price: 425,
      length: '18"–24"',
      meta: "Full lace · body wave · 1B",
      grad: ["#1a1a1a", "#3a2230"],
    },
    {
      id: "wig-2",
      name: "Natural Black 1B Frontal — Body Wave",
      tags: ["frontal"],
      price: 320,
      length: '18"–22"',
      meta: "13x4 frontal · body wave · 1B",
      grad: ["#0f0f0f", "#3d2c4a"],
    },
    {
      id: "wig-3",
      name: "Natural Black 1B Frontal — Water Wave",
      tags: ["frontal"],
      price: 340,
      length: '18"–24"',
      meta: "13x4 frontal · water wave · 1B",
      grad: ["#1c1c1c", "#244658"],
    },
    {
      id: "wig-4",
      name: "613 Blonde Frontal — Mink Straight",
      tags: ["frontal", "blonde"],
      price: 380,
      length: '20"–28"',
      meta: "13x4 frontal · straight · 613",
      grad: ["#cda77a", "#f0d39b"],
      darkText: true,
    },
    {
      id: "wig-5",
      name: "613 Blonde Frontal — Body Wave",
      tags: ["frontal", "blonde"],
      price: 380,
      length: '20"–28"',
      meta: "13x4 frontal · body wave · 613",
      grad: ["#d1ab83", "#f4dbab"],
      darkText: true,
    },
    {
      id: "wig-6",
      name: "613 Blonde Bob",
      tags: ["bob", "blonde"],
      price: 260,
      length: '10"–14"',
      meta: "Bob silhouette · 613 · cut and styled",
      grad: ["#c79a6c", "#ecc78a"],
      darkText: true,
    },
    {
      id: "wig-7",
      name: "1B Natural Bob",
      tags: ["bob"],
      price: 240,
      length: '10"–14"',
      meta: "Bob silhouette · 1B · sleek finish",
      grad: ["#101010", "#2c2a2c"],
    },
    {
      id: "wig-8",
      name: "Red Bob — Straight or Body",
      tags: ["bob"],
      price: 280,
      length: '10"–14"',
      meta: "Statement red · custom texture",
      grad: ["#7a0e1a", "#d2253b"],
    },
  ],

  // === Frontals & Closures ===
  frontals: [
    {
      id: "fc-1",
      name: "Mink Straight Closure",
      tags: ["closure"],
      price: 110,
      meta: "4x4 HD lace · 1B",
      grad: ["#0d0d0d", "#332b3b"],
    },
    {
      id: "fc-2",
      name: "Mink Curly Closure",
      tags: ["closure"],
      price: 120,
      meta: "4x4 HD lace · curly · 1B",
      grad: ["#1a1418", "#3c2535"],
    },
    {
      id: "fc-3",
      name: "Mink Body Closure",
      tags: ["closure"],
      price: 120,
      meta: "4x4 HD lace · body wave · 1B",
      grad: ["#0f0f0f", "#3d2c4a"],
    },
    {
      id: "fc-4",
      name: "Mink Straight Frontal",
      tags: ["frontal"],
      price: 165,
      meta: "13x4 HD lace · straight · 1B",
      grad: ["#0d0d0d", "#3a2735"],
    },
    {
      id: "fc-5",
      name: "Mink Body Wave Frontal",
      tags: ["frontal"],
      price: 175,
      meta: "13x4 HD lace · body wave · 1B",
      grad: ["#101010", "#3e2b48"],
    },
    {
      id: "fc-6",
      name: "613 Body Wave Frontal",
      tags: ["frontal", "blonde"],
      price: 195,
      meta: "13x4 HD lace · body wave · 613",
      grad: ["#d1ab83", "#f4dbab"],
      darkText: true,
    },
    {
      id: "fc-7",
      name: "613 Body Wave Closure",
      tags: ["closure", "blonde"],
      price: 145,
      meta: "4x4 HD lace · body wave · 613",
      grad: ["#cca37c", "#eeca8a"],
      darkText: true,
    },
    {
      id: "fc-8",
      name: "613 Mink Straight Frontal",
      tags: ["frontal", "blonde"],
      price: 195,
      meta: "13x4 HD lace · straight · 613",
      grad: ["#c99a6c", "#ebc789"],
      darkText: true,
    },
    {
      id: "fc-9",
      name: "613 Blonde Straight Closure",
      tags: ["closure", "blonde"],
      price: 145,
      meta: "4x4 HD lace · straight · 613",
      grad: ["#caa37b", "#edc78a"],
      darkText: true,
    },
  ],

  // === Bundles ===
  bundles: [
    {
      id: "b-straight",
      name: "Mink Straight Bundle",
      tags: ["straight"],
      price: 110,
      meta: 'Sold by length, 18"–32"',
      grad: ["#0c0c0c", "#3a2735"],
    },
    {
      id: "b-body",
      name: "Mink Body Wave Bundle",
      tags: ["body"],
      price: 115,
      meta: 'Sold by length, 18"–32"',
      grad: ["#0d0d0d", "#3c2a48"],
    },
    {
      id: "b-curly",
      name: "Mink Curly Bundle",
      tags: ["curly"],
      price: 120,
      meta: 'Sold by length, 18"–28"',
      grad: ["#1a1318", "#3f2438"],
    },
    {
      id: "b-water",
      name: "Mink Water Wave Bundle",
      tags: ["water"],
      price: 120,
      meta: 'Sold by length, 18"–28"',
      grad: ["#0e0e0e", "#234a5c"],
    },
    {
      id: "b-deep",
      name: "Mink Deep Wave Bundle",
      tags: ["body"],
      price: 125,
      meta: 'Sold by length, 18"–32"',
      grad: ["#10101a", "#1c2a52"],
    },
    {
      id: "b-613-straight",
      name: "613 Blonde Straight Bundle",
      tags: ["straight"],
      price: 145,
      meta: 'Sold by length, 18"–28"',
      grad: ["#c99c6e", "#edc88a"],
      darkText: true,
    },
    {
      id: "b-613-body",
      name: "613 Blonde Body Wave Bundle",
      tags: ["body"],
      price: 150,
      meta: 'Sold by length, 18"–28"',
      grad: ["#cba27a", "#f0cd8e"],
      darkText: true,
    },
    {
      id: "b-natural-curly",
      name: "Mink Kinky Curly Bundle",
      tags: ["curly"],
      price: 130,
      meta: '4C natural texture · 14"–22"',
      grad: ["#1a1318", "#3f2438"],
    },
  ],

  // === Stylists ===
  stylists: [
    {
      id: "jenell",
      name: "JENELL",
      role: "Founder · Master Stylist",
      bio: "The mind behind Mink. Jenell has built every chair in the studio and trained every stylist who sits in one. Specializes in melts that disappear and installs that last.",
      specialties: ["Frontal Sew-In", "Glueless Install", "Bridal"],
      grad: ["#ed45a0", "#664398"],
    },
    {
      id: "mimi",
      name: "MIMI",
      role: "Senior Stylist",
      bio: "Color theory nerd and the studio's go-to for blonde transformations. If you want a 613 install you'll never have to touch up, this is your chair.",
      specialties: ["Color", "613 Installs", "Custom Coloring"],
      grad: ["#7fccf7", "#ed45a0"],
    },
    {
      id: "lex",
      name: "LEX",
      role: "Stylist · Protective Styles",
      bio: "Braids, faux locs, knotless — Lex builds long-lasting protective styles with a scalp-first approach. Comfort, longevity, and clean partings every time.",
      specialties: ["Braids", "Faux Locs", "Knotless"],
      grad: ["#664398", "#7fccf7"],
    },
    {
      id: "chassidy",
      name: "CHASSIDY AUTUMN",
      role: "Stylist · Cuts & Color",
      bio: "Precision cuts, layers that move, and color that looks expensive. Chassidy is the chair to book when you want a finish that photographs.",
      specialties: ["Cuts", "Layers", "Highlights"],
      grad: ["#ff8dc8", "#664398"],
    },
    {
      id: "hollywood",
      name: "HOLLYWOOD",
      role: "Stylist · Quick Styles",
      bio: "Swoop ponytails, slick backs, and event-day blowouts. Need to look unreal in 90 minutes? Book Hollywood.",
      specialties: ["Pony", "Blow Out", "Event Styling"],
      grad: ["#2c2530", "#ed45a0"],
    },
  ],

  // === Lash / Beauty talent ===
  lashTeam: [
    {
      id: "lash-1",
      name: "SENIOR LASH ARTIST",
      role: "Lash · Brows",
      bio: "Volume, hybrid and classic sets — built to last 4–6 weeks. Our senior artist also handles brow shaping and tints.",
      specialties: ["Volume", "Hybrid", "Classic", "Brows"],
      grad: ["#ed45a0", "#7fccf7"],
    },
    {
      id: "lash-2",
      name: "LEAD MUA",
      role: "Makeup · Glam",
      bio: "Beats for everyday, weddings, photoshoots and red-carpet looks. Specializes in 'no makeup' makeup and detailed glitter glam.",
      specialties: ["Soft Glam", "Bridal", "Glitter Glam"],
      grad: ["#7fccf7", "#664398"],
    },
    {
      id: "lash-3",
      name: "NAIL ARTIST",
      role: "Nails · Glass",
      bio: "Clear glass nails, structured gels and chrome finishes. Sets last and grow out clean.",
      specialties: ["Glass Nails", "Gel-X", "Chrome"],
      grad: ["#ff8dc8", "#ed45a0"],
    },
  ],

  // === Services (used for booking) ===
  services: [
    {
      id: "wig-glueless",
      cat: "Hair",
      name: "Wig Install — Glueless",
      duration: 90,
      price: 150,
      desc: "Lay, custom-cut, and style — no glue.",
    },
    {
      id: "wig-glued",
      cat: "Hair",
      name: "Wig Install — Glued",
      duration: 120,
      price: 220,
      desc: "Full melt, glued lace, styled to finish.",
    },
    {
      id: "frontal-sewin",
      cat: "Hair",
      name: "Frontal Sew-In Install",
      duration: 180,
      price: 250,
      desc: "Braid down, sew-in, frontal lay and style.",
    },
    {
      id: "wash-set",
      cat: "Hair",
      name: "Wash & Set",
      duration: 60,
      price: 65,
      desc: "Cleanse, condition, blow-dry, set.",
    },
    {
      id: "cut",
      cat: "Hair",
      name: "Cut & Shape",
      duration: 45,
      price: 50,
      desc: "Custom cut on natural hair or wig.",
    },
    {
      id: "braids-pony",
      cat: "Hair",
      name: "Braids to Ponytail",
      duration: 90,
      price: 90,
      desc: "Sleek braided pony — feed-ins available.",
    },
    {
      id: "swoop-pony",
      cat: "Hair",
      name: "Swoop Pony / Slick Back",
      duration: 60,
      price: 75,
      desc: "Glassy slick + sculpted swoop edge.",
    },
    {
      id: "faux-locs",
      cat: "Hair",
      name: "Faux Locs",
      duration: 240,
      price: 250,
      desc: "Soft locs, full install — multi-length options.",
    },
    {
      id: "frontal-class",
      cat: "Education",
      name: "One-on-One Frontal Class",
      duration: 240,
      price: 625,
      desc: "Private 4-hour class with materials.",
    },
    {
      id: "lash-full",
      cat: "Lash",
      name: "Lash Full Set",
      duration: 90,
      price: 200,
      desc: "Classic, hybrid, or volume — your choice.",
    },
    {
      id: "lash-fill",
      cat: "Lash",
      name: "Lash Fill",
      duration: 60,
      price: 95,
      desc: "Top-up within 3 weeks of your last set.",
    },
    {
      id: "lash-removal",
      cat: "Lash",
      name: "Lash Removal",
      duration: 30,
      price: 50,
      desc: "Safe removal of any lash set.",
    },
    {
      id: "beat-classic",
      cat: "Beauty",
      name: "Classic Soft Beat",
      duration: 45,
      price: 80,
      desc: "Natural soft beat with neutral eye.",
    },
    {
      id: "beat-glam",
      cat: "Beauty",
      name: "Soft Glam Beat",
      duration: 60,
      price: 120,
      desc: "Everyday glam with cut crease + lash.",
    },
    {
      id: "beat-glitter",
      cat: "Beauty",
      name: "Glitter Glam Beat",
      duration: 75,
      price: 150,
      desc: "Detailed glitter eye, bold beat, lashes.",
    },
    {
      id: "nails-glass",
      cat: "Beauty",
      name: "Clear Glass Nails",
      duration: 75,
      price: 90,
      desc: "Glass-clear set, structured shape.",
    },
  ],

  // === Featured products to highlight on home ===
  get featuredIds() {
    return ["wig-4", "wig-1", "fc-5", "wig-8", "b-curly", "wig-6"];
  },

  // === Testimonials ===
  testimonials: [
    {
      quote:
        "Walked in with a vision, walked out with the install of my life. Think Mink is the standard.",
      name: "Aaliyah Brooks",
      role: "Repeat client · Brooklyn",
    },
    {
      quote:
        "Jenell laid my 613 so flat my own mama didn't know it was a wig. I'll never go anywhere else.",
      name: "Tasha Williams",
      role: "Bride · Harlem",
    },
    {
      quote:
        "The frontal class was worth every dollar. I went from struggling at home to booking my own clients in three months.",
      name: "Maya Rivera",
      role: "Stylist · Bronx",
    },
    {
      quote:
        "I came in for a soft glam and stayed for the bundle deal. The hair quality is unreal — sheds zero, lays smooth.",
      name: "Joelle Roman",
      role: "Content creator · Queens",
    },
  ],

  // === FAQ ===
  faq: [
    {
      q: "What kind of hair do you use?",
      a: "Every wig, frontal, closure and bundle in our shop is 100% virgin mink hair — single-donor, cuticle-aligned, and unprocessed. It will color-treat, heat-style, and last 2+ years with proper care.",
    },
    {
      q: "How long does an install take?",
      a: "A glueless install runs 90 minutes; a glued install runs 2 hours; a full frontal sew-in is around 3 hours. We'll never rush — but we won't keep you longer than the booked slot.",
    },
    {
      q: "Can I bring my own hair to be installed?",
      a: "Yes. We charge the same install fee whether you buy your hair from us or bring your own. Just make sure it's clean and wefted properly.",
    },
    {
      q: "Do you take walk-ins?",
      a: "No. Every chair is by appointment only so we can respect your time and ours. Book online 24/7.",
    },
    {
      q: "What's the deposit policy?",
      a: "50% of your service price is required at booking and is non-refundable. The deposit applies to your final balance.",
    },
    {
      q: "Can I reschedule?",
      a: "You can reschedule once at no charge if you give us more than 48 hours notice. Inside 48 hours, the deposit is forfeit.",
    },
    {
      q: "What about no-shows or lateness?",
      a: "We treat no-shows and arrivals 15+ minutes late as cancellations. We have a waitlist that fills these slots fast.",
    },
    {
      q: "How should I prep my hair?",
      a: "Wash, blow-dry, and detangle the night before. Come with no product in your hair unless your booking includes a wash service.",
    },
    {
      q: "Do you offer classes?",
      a: "Yes — Jenell runs a one-on-one frontal class (4 hours, $625) covering customization, melt technique, and a full install. Email for group classes and wholesale inquiries.",
    },
    {
      q: "Do you ship hair?",
      a: "Yes, anywhere in the US. Free NYC pickup at the studio. Orders ship within 2 business days.",
    },
  ],

  // === Care guide ===
  careGuide: [
    {
      step: "01",
      title: "Wash gently",
      body:
        "Co-wash with a sulfate-free moisturizing cleanser every 7–10 days. Detangle from ends to roots with a wide-tooth comb — never tug on the lace.",
    },
    {
      step: "02",
      title: "Condition deeply",
      body:
        "Apply a leave-in conditioner mid-shaft to ends. Skip the roots/lace area to avoid breakdown of the knots.",
    },
    {
      step: "03",
      title: "Dry the right way",
      body:
        "Air-dry on a wig stand or low-heat blow dry. High heat shortens the lifespan dramatically — bonnet at night to preserve the style.",
    },
    {
      step: "04",
      title: "Heat with caution",
      body:
        "Always use a heat protectant. Never exceed 350°F for straightening or 380°F for curling. Mink hair handles heat well but it's still hair.",
    },
    {
      step: "05",
      title: "Re-up every 2–3 weeks",
      body:
        "Bring it in for a wash, refresh, and frontal re-lay every 2–3 weeks. Book the 'Wash & Set' or 'Re-Lay' service.",
    },
  ],

  // === Length & density guide ===
  lengthGuide: [
    { len: '14"', desc: "Bob territory — falls at the chin" },
    { len: '18"', desc: "Shoulder-length, ideal for daily wear" },
    { len: '22"', desc: "Mid-back, our most-booked length" },
    { len: '26"', desc: "Lower-back, dramatic with body wave" },
    { len: '30"+', desc: "Waist-length, statement install" },
  ],

  // === Why us ===
  whyUs: [
    {
      title: "Hair you can color",
      body:
        "Every strand is virgin and cuticle-aligned. Bleach it, dye it, tone it — it takes color like your own hair.",
    },
    {
      title: "Hands-on customization",
      body:
        "Plucking, baby hairs, custom-bleached knots — done in-chair so you walk out finished, not 'almost'.",
    },
    {
      title: "Built to last 2+ years",
      body:
        "Treat the hair right and it outlasts every wig you've ever bought. Maintenance services keep it new.",
    },
    {
      title: "A team that books you back",
      body:
        "Every artist here owns their book and remembers your name. You're not a number; you're a recurring chair.",
    },
  ],

  // === Curated portrait images (Black & Latina beauty) ===
  // Tried Unsplash photo IDs first; img onerror falls back to picsum if any 404.
  unsplashIds: [
    "1494790108377-be9c29b29330",
    "1488426862026-3ee34a7d66df",
    "1573496359142-b8d87734a5a2",
    "1531123897727-8f129e1688ce",
    "1583394838336-acd977736f90",
    "1492106087820-71f1a00d2b11",
    "1564564321837-a57b7070ac4f",
    "1594744803329-e58b31de8bf5",
    "1503104834685-7205e8607eb6",
    "1518837695005-2083093ee35b",
    "1605497788044-5a32c7078486",
    "1564415051645-cb13a85ec9b3",
    "1531746020798-e6953c6e8e04",
    "1573472068252-b6ec3ae08b1c",
    "1487412720507-e7ab37603c6f",
    "1530785602389-07594beb8b73",
  ],

  // === Salon interior / suite imagery for the "Step inside" section ===
  salonIds: [
    "1562322140-8baeececf3df",
    "1521590832167-7bcbfaa6381f",
    "1560066984-138dadb4c035",
    "1607008829749-c0f284a49841",
  ],

  // === Salon journey scenes ===
  journey: [
    {
      no: "01",
      title: "Walk in.",
      body:
        "Brass handle, magenta neon, the smell of fresh shampoo. The studio greets you on arrival.",
      seedKey: "salon-entrance",
      salonIdx: 0,
    },
    {
      no: "02",
      title: "Get matched.",
      body:
        "Quick consult — texture, density, finish. Your stylist picks your suite based on the service.",
      seedKey: "salon-reception",
      salonIdx: 1,
    },
    {
      no: "03",
      title: "Your suite.",
      body:
        "Private chair, lighting tuned for color work, a moodboard at every station. Sit. Settle in.",
      seedKey: "salon-suite",
      salonIdx: 2,
    },
    {
      no: "04",
      title: "Walk out unreal.",
      body:
        "Full mirror moment, photoshoot in the mirror, hair so right you'll re-book on the way out.",
      seedKey: "salon-exit",
      salonIdx: 3,
    },
  ],

  // === By the numbers ===
  stats: [
    { num: 8, suffix: "+", label: "Years in the chair" },
    { num: 12000, suffix: "+", label: "Installs delivered", short: true },
    { num: 200, suffix: "+", label: "Stylists trained" },
    { num: 92, suffix: "%", label: "Return-client rate" },
  ],

  // === Rotating slogan words ===
  sloganWords: ["THINK", "MINK", "NYC", "LUXURY", "MINK", "NYC"],
  bigSlogan: "STEP IN. WALK OUT UNREAL.",

  imgFor(seed, idx, w = 600, h = 750) {
    const ids = this.unsplashIds;
    const id = ids[Math.abs(idx) % ids.length];
    return {
      primary: `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`,
      fallback: `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`,
    };
  },

  // === Helper lookups ===
  serviceById(id) {
    return this.services.find((s) => s.id === id);
  },
  stylistById(id) {
    return this.stylists.find((s) => s.id === id);
  },
  allStaff() {
    return [...this.stylists, ...this.lashTeam];
  },
};

window.TM_DATA = TM_DATA;
