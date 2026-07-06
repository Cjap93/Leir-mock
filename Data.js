/* ════════════════════════════════════════════════════════════════
   LEIR — data.js
   Gemensam datakälla för index.html (publik sida) och leir-admin.html.
   Läser/skriver till localStorage så att ändringar i admin syns
   direkt på den publika sidan (samma webbläsare/enhet).
   ════════════════════════════════════════════════════════════════ */

(function (global) {
  const STORAGE_PREFIX = "leir:";

  // ── DEFAULT DATA (används första gången, eller om localStorage saknas) ──
  const DEFAULTS = {
    menu: {
      mon: { subtitle: "Veckan börjar tryggt", dishes: [
        { type: "veg",   name: "Friterad lasagne",          price: "139:-", desc: "Tomatsås, rucolasallad och riven grana padano." },
        { type: "fish",  name: "Smörstekt dagens fångst",   price: "139:-", desc: "Remouladsås, dillkokt potatis, pepparrot och dill- & gurksallad." },
        { type: "meat",  name: "BBQ-glaserad gårdsgris",    price: "139:-", desc: "Friterad mac 'n cheese, chipotle skysås och spicy slaw." },
        { type: "salad", name: "Caesarsallad",               price: "139:-", desc: "Romansallad, caesardressing, bacon, grillad kyckling, krutonger och grana padano." },
      ]},
      tue: { subtitle: "Smaker från öst & väst", dishes: [
        { type: "veg",   name: "Tikka masala",              price: "139:-", desc: "Grönsaker och bönor med grillad halloumi, jasminris och koriander." },
        { type: "fish",  name: "Laxfärserad dagens fångst", price: "139:-", desc: "Smörad skaldjursbuljong, saffransaioli och potatispuré." },
        { type: "meat",  name: "Schnitzel",                 price: "139:-", desc: "Vispat västerbottensmör, rödvinsås, rostad potatis och gröna ärtor." },
        { type: "salad", name: "Caesarsallad",               price: "139:-", desc: "Romansallad, caesardressing, bacon, grillad kyckling, krutonger och grana padano." },
      ]},
      wed: { subtitle: "Halvvägs, med kraftiga smaker", dishes: [
        { type: "veg",   name: "Okonomiyaki",               price: "139:-", desc: "Sesamkål, edamamebönor, jasminris, chilimajonäs och furikake." },
        { type: "fish",  name: "Fisk- & skaldjursgryta",    price: "139:-", desc: "Bohusländsk gryta med rotfrukter, aioli och vitlöksbröd." },
        { type: "meat",  name: "Kalv wallenbergare",         price: "139:-", desc: "Gräddsås, potatispuré, pressgurka och rårörda lingon." },
        { type: "salad", name: "Caesarsallad",               price: "139:-", desc: "Romansallad, caesardressing, bacon, grillad kyckling, krutonger och grana padano." },
      ]},
      thu: { subtitle: "Rotfrukter i centrum", dishes: [
        { type: "veg",   name: "Rotfruktsbiff",             price: "139:-", desc: "Ört- & västerbottenostsås, puré på palsternacka och broccoli." },
        { type: "fish",  name: "Vitvinspocherad fångst",    price: "139:-", desc: "Puré på palsternacka, citronsås och broccoli." },
        { type: "meat",  name: "Kycklingfärsbiff",          price: "139:-", desc: "Currysås, jasminris, mangochutney, jordnötter och pak choy." },
        { type: "salad", name: "Caesarsallad",               price: "139:-", desc: "Romansallad, caesardressing, bacon, grillad kyckling, krutonger och grana padano." },
      ]},
      fri: { subtitle: "Veckan avslutas på topp", dishes: [
        { type: "veg",   name: "Sesampanerad rotselleri",   price: "139:-", desc: "Rosmarin- & hallonsky-rostad svamp och potatispuré." },
        { type: "fish",  name: "Dillrimmad dagens fångst",  price: "139:-", desc: "Sandefjordsås, bakade tomater och potatispuré." },
        { type: "meat",  name: "Grillad gårdsgris",         price: "139:-", desc: "Bearnaisesås, tomatsallad, pommes frites och rödvinsås." },
        { type: "salad", name: "Caesarsallad",               price: "139:-", desc: "Romansallad, caesardressing, bacon, grillad kyckling, krutonger och grana padano." },
      ]},
    },

    drinks: [
      { id: "d1", name: "Mineralvatten", price: "25:-" },
      { id: "d2", name: "Läsk",         price: "25:-" },
    ],

    events: [
      { id: "e1", date: "2026-07-03", start: "18:00", end: "22:00", type: "open",    name: "Sommarsupé på altanen",   desc: "Tre-rätters meny med fokus på västkustens råvaror. Boka bord i förväg.", recurring: null },
      { id: "e2", date: "2026-07-09", start: "17:00", end: "23:00", type: "private", name: "Privat bokning",           desc: "Lokalen är bokad för ett privat firande denna kväll.", recurring: null },
      { id: "e3", date: "2026-07-16", start: "18:30", end: "21:30", type: "open",    name: "Vinprovning: Rhônedalen",  desc: "Fem viner, lätta tilltugg och en kort guidning. Begränsat antal platser.", recurring: { type: "monthly", end: "2026-12-31" } },
    ],

    dishLibrary: [
      { id: "lib1", type: "veg",   name: "Rödbetsbiff",              price: "139:-", desc: "Smörsås, getost och rostad valnöt." },
      { id: "lib2", type: "meat",  name: "Biff Rydberg",             price: "149:-", desc: "Smörfräst oxfilé, potatistärningar, senap och rödlök." },
      { id: "lib3", type: "fish",  name: "Gravlax med hovmästarsås", price: "139:-", desc: "Dillkokt potatis och kapris." },
      { id: "lib4", type: "salad", name: "Nicoise",                  price: "139:-", desc: "Tonfisk, ägg, oliver, haricots verts och kapris." },
    ],

    eventTemplates: [
      { id: "t1", start: "18:00", end: "22:00", type: "open",    name: "Temakvällar",   desc: "Boka bord i förväg via telefon." },
      { id: "t2", start: "17:00", end: "23:00", type: "private", name: "Privat bokning", desc: "Lokalen är bokad för ett privat firande denna kväll." },
    ],

    admins: [
      { username: "admin",         name: "Admin",          mustChange: false },
      { username: "anna.svensson", name: "Anna Svensson",  mustChange: false },
    ],

    about: {
      title: "Mat som smakar något.",
      p1: "Leir startade med en enkel idé: att laga riktigt bra lunch varje vardag, utan krångel. Vi lagar allt från grunden — fyra alternativ per dag, alltid ett vegetariskt, ett fisk, ett kött och en sallad.",
      p2: "Vi sitter på Ullevigatan mitt i Göteborg och har hållit på sedan 2018. Välkommen in.",
      stats: [
        { num: "2018", label: "Grundat" },
        { num: "5",    label: "Dagar i veckan" },
        { num: "4",    label: "Alternativ varje dag" },
        { num: "139",  label: "Kronor per rätt" },
      ],
    },
  };

  // ── STORAGE HELPERS ──────────────────────────────────────────────
  function readKey(key, fallback) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("LeirData: kunde inte läsa", key, e);
      return fallback;
    }
  }

  function writeKey(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("LeirData: kunde inte spara", key, e);
      return false;
    }
  }

  // Seed localStorage with defaults on first run (per key, so partial
  // localStorage state from earlier sessions doesn't get clobbered).
  function ensureSeeded() {
    Object.keys(DEFAULTS).forEach((key) => {
      if (localStorage.getItem(STORAGE_PREFIX + key) === null) {
        writeKey(key, DEFAULTS[key]);
      }
    });
  }

  // ── PUBLIC API ────────────────────────────────────────────────────
  const LeirData = {
    DEFAULTS,

    init() {
      ensureSeeded();
    },

    get(key) {
      return readKey(key, DEFAULTS[key]);
    },

    set(key, value) {
      return writeKey(key, value);
    },

    // Convenience getters
    getMenu()           { return this.get("menu"); },
    getDrinks()         { return this.get("drinks"); },
    getEvents()         { return this.get("events"); },
    getDishLibrary()    { return this.get("dishLibrary"); },
    getEventTemplates() { return this.get("eventTemplates"); },
    getAdmins()         { return this.get("admins"); },
    getAbout()          { return this.get("about"); },

    // Convenience setters
    setMenu(v)           { return this.set("menu", v); },
    setDrinks(v)         { return this.set("drinks", v); },
    setEvents(v)         { return this.set("events", v); },
    setDishLibrary(v)    { return this.set("dishLibrary", v); },
    setEventTemplates(v) { return this.set("eventTemplates", v); },
    setAdmins(v)         { return this.set("admins", v); },
    setAbout(v)          { return this.set("about", v); },

    // Reset everything back to defaults (used for demo resets)
    resetAll() {
      Object.keys(DEFAULTS).forEach((key) => writeKey(key, DEFAULTS[key]));
    },

    // Expand recurring events into concrete occurrences within a date range.
    // Returns a flat array of {..., date} entries (non-recurring events pass through once).
    expandEvents(events, rangeStart, rangeEnd) {
      const out = [];
      const start = new Date(rangeStart + "T00:00:00");
      const end = new Date(rangeEnd + "T23:59:59");

      events.forEach((e) => {
        if (!e.recurring) {
          const d = new Date(e.date + "T00:00:00");
          if (d >= start && d <= end) out.push(e);
          return;
        }
        const step = e.recurring.type === "weekly" ? 7
                   : e.recurring.type === "biweekly" ? 14
                   : null; // monthly handled separately
        const recurEnd = new Date((e.recurring.end || e.date) + "T23:59:59");
        let cursor = new Date(e.date + "T00:00:00");

        if (step) {
          while (cursor <= end && cursor <= recurEnd) {
            if (cursor >= start) out.push({ ...e, date: cursor.toISOString().slice(0, 10) });
            cursor = new Date(cursor.getTime() + step * 86400000);
          }
        } else {
          // monthly: same day-of-month each month
          while (cursor <= end && cursor <= recurEnd) {
            if (cursor >= start) out.push({ ...e, date: cursor.toISOString().slice(0, 10) });
            const next = new Date(cursor);
            next.setMonth(next.getMonth() + 1);
            cursor = next;
          }
        }
      });

      return out.sort((a, b) => a.date.localeCompare(b.date));
    },
  };

  global.LeirData = LeirData;
})(window);
