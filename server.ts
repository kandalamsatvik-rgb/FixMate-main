import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateMahaFallback(query: string, lang = 'en') {
  const q = query.toLowerCase();

  // Beauty & Salon at Home
  if (q.includes('facial') || q.includes('wax') || q.includes('pedicure') || q.includes('manicure') || q.includes('beauty') || q.includes('parlour') || q.includes('parlor') || q.includes('spa') || q.includes('bleach') || q.includes('skin')) {
    return {
      summary: 'Home beauty & salon pampering package recommended for skin glow and grooming.',
      recommendedCategory: 'beauty_women',
      categoryTitle: 'Beauty & Salon at Home',
      recommendedWorkTitle: q.includes('wax') ? 'Rica / Honey Full Arms & Full Legs Waxing' : q.includes('pedicure') || q.includes('manicure') ? 'Deluxe Rose & Crystal Spa Pedicure + Manicure' : 'O3+ Shine & Glow Facial with Cleanup',
      estimatedLaborCost: q.includes('wax') ? 449 : 599,
      visitingFee: 199,
      urgency: 'standard',
      urgencyReason: 'Certified beautician brings 100% disposable hygienic kits and branded cosmetics.',
      safetyWarning: 'Notify beautician of any active skin allergies or sensitivities before starting.',
      toolsNeeded: ['Disposable bedsheet', 'Sterilized salon toolkit', 'Wax warmer', 'Facial steamer', 'Organic creams'],
      estimatedMinutes: 60,
      mahaTip: 'Maha recommends washing your face with lukewarm water before the beautician arrives for maximum absorption.'
    };
  }

  // Men's Grooming & Barber
  if (q.includes('haircut') || q.includes('beard') || q.includes('fade') || q.includes('barber') || q.includes('champi') || q.includes('shave') || q.includes('grooming')) {
    return {
      summary: "Doorstep men's grooming, haircut styling or relaxing champi massage requested.",
      recommendedCategory: 'grooming_men',
      categoryTitle: "Men's Grooming & Salon",
      recommendedWorkTitle: q.includes('beard') ? 'Beard Trim, Sharp Line Razor Edge & Conditioning' : q.includes('massage') || q.includes('champi') ? 'Stress Relief Ayurvedic Head & Shoulder Massage (20m)' : "Men's Haircut, Style & Refreshing Wash",
      estimatedLaborCost: q.includes('beard') ? 140 : 180,
      visitingFee: 199,
      urgency: 'standard',
      urgencyReason: 'Professional stylist arrives with sanitized shears, clippers and cape.',
      safetyWarning: 'Ensure good room lighting and a standard comfortable chair.',
      toolsNeeded: ['Cordless hair clipper', 'Sterilized scissor set', 'Cape & neck wrap', 'Beard straightener', 'Organic oils'],
      estimatedMinutes: 35,
      mahaTip: 'Maha suggests keeping an electrical socket reachable nearby for the clipper charger and dryer.'
    };
  }

  // Vehicle Care (Car Wash / Jumpstart)
  if (q.includes('car wash') || q.includes('bike') || q.includes('battery') || q.includes('jumpstart') || q.includes('vehicle') || q.includes('car won')) {
    return {
      summary: 'Doorstep vehicle maintenance, foam wash or emergency battery jumpstart detected.',
      recommendedCategory: 'vehicle_care',
      categoryTitle: 'Doorstep Car & Bike Care',
      recommendedWorkTitle: (q.includes('battery') || q.includes('jumpstart') || q.includes('won')) ? 'Emergency 12V Car Battery Jumpstart (30-Min Arrival)' : 'Eco High-Pressure Foam Car Wash & Vacuum',
      estimatedLaborCost: (q.includes('battery') || q.includes('jumpstart')) ? 250 : 350,
      visitingFee: 199,
      urgency: (q.includes('battery') || q.includes('jumpstart')) ? 'emergency_30min' : 'standard',
      urgencyReason: (q.includes('battery') || q.includes('jumpstart')) ? 'Vehicle immobilized; rapid 30-min pro arrival assigned.' : 'Scheduled doorstep washing.',
      safetyWarning: 'Park vehicle on flat level ground with handbrake firmly engaged.',
      toolsNeeded: ['Portable high-pressure washer', 'Heavy copper jumper cables', 'Deep vacuum extractor', 'Digital tyre gauge'],
      estimatedMinutes: 35,
      mahaTip: 'Maha technician will also test your alternator charge rate free with the multimeter.'
    };
  }

  // Elderly Care & Home Nurse
  if (q.includes('elderly') || q.includes('nurse') || q.includes('bp') || q.includes('sugar') || q.includes('injection') || q.includes('dressing') || q.includes('patient')) {
    return {
      summary: 'Home healthcare vitals check, elderly nursing assistance or wound dressing required.',
      recommendedCategory: 'home_health',
      categoryTitle: 'Elderly Care & Home Nurse',
      recommendedWorkTitle: 'Senior Health Checkup (BP, Sugar, SpO2, Pulse)',
      estimatedLaborCost: 150,
      visitingFee: 199,
      urgency: 'standard',
      urgencyReason: 'Certified compassionate nursing attendant visits to record vitals and assist.',
      safetyWarning: 'Keep recent prescription slips and previous doctor records accessible for reference.',
      toolsNeeded: ['Digital BP monitor', 'Glucometer with fresh strips', 'Pulse oximeter', 'Sterile dressing kit'],
      estimatedMinutes: 30,
      mahaTip: 'Maha logs all vital signs digitally so family members can review reading trends.'
    };
  }

  // Laptop & WiFi Setup
  if (q.includes('laptop') || q.includes('computer') || q.includes('wifi') || q.includes('router') || q.includes('pc') || q.includes('windows') || q.includes('slow')) {
    return {
      summary: 'Computer hardware slow down, OS corruption, thermal overheating or WiFi dead zone.',
      recommendedCategory: 'gadget_repair',
      categoryTitle: 'Laptop, PC & WiFi Setup',
      recommendedWorkTitle: 'Laptop Speed Booster: SSD Upgrade & Thermal Paste',
      estimatedLaborCost: 399,
      visitingFee: 199,
      urgency: 'standard',
      urgencyReason: 'Doorstep hardware technician cleans fans, replaces dry thermal paste & optimizes startup.',
      safetyWarning: 'Back up any critical confidential files if feasible before technician starts OS maintenance.',
      toolsNeeded: ['Anti-static precision toolkit', 'Arctic MX-4 thermal paste', 'SSD cloning dock', 'Multimeter'],
      estimatedMinutes: 50,
      mahaTip: 'Maha guarantees zero data loss during SSD cloning and OS speed optimization.'
    };
  }

  if (q.includes('spark') || q.includes('mcb') || q.includes('shock') || q.includes('wire') || q.includes('switch') || q.includes('fan') || q.includes('inverter') || q.includes('power')) {
    return {
      summary: 'Electrical short circuit or overloaded breaker contact point detected.',
      recommendedCategory: 'electrical',
      categoryTitle: 'Electrical & Wiring',
      recommendedWorkTitle: q.includes('mcb') ? 'Main MCB Tripping & Short Circuit Diagnostic' : q.includes('fan') ? 'Ceiling Fan Installation & Regulator Repair' : 'Switchboard Repair & 16A/6A Socket Replacement',
      estimatedLaborCost: 180,
      visitingFee: 199,
      urgency: (q.includes('spark') || q.includes('shock') || q.includes('mcb')) ? 'emergency_30min' : 'standard',
      urgencyReason: (q.includes('spark') || q.includes('shock')) ? 'Sparking poses immediate fire hazard. Priority dispatch recommended.' : 'Standard electrical diagnostic required.',
      safetyWarning: 'Turn off the main MCB breaker immediately. Do not touch bare switchboards or wet sockets.',
      toolsNeeded: ['Digital clamp multimeter', 'Insulated neon tester', 'MCB isolator kit', 'Wire stripper'],
      estimatedMinutes: 35,
      mahaTip: 'Maha recommends inspecting if high wattage appliances (geyser, microwave) are on the same circuit loop.'
    };
  }

  if (q.includes('leak') || q.includes('pipe') || q.includes('tap') || q.includes('drain') || q.includes('tank') || q.includes('toilet') || q.includes('flush') || q.includes('water')) {
    return {
      summary: 'Plumbing pipeline pressure failure, washer erosion, or drain trap obstruction.',
      recommendedCategory: 'plumbing',
      categoryTitle: 'Plumbing & Pipes',
      recommendedWorkTitle: q.includes('drain') ? 'Clogged Kitchen Sink or Drain Unclog' : q.includes('flush') ? 'Toilet Flush Tank & Commode Leakage Fix' : q.includes('burst') ? 'Pipeline Burst & Concealed Leak Repair' : 'Tap Replacement & Leak Repair',
      estimatedLaborCost: 190,
      visitingFee: 199,
      urgency: (q.includes('burst') || q.includes('flood')) ? 'emergency_30min' : 'standard',
      urgencyReason: q.includes('burst') ? 'Uncontrolled water flow can cause structural damage.' : 'Standard plumbing restoration.',
      safetyWarning: 'Turn off the main overhead water tank ball valve or inlet stopcock to halt leakage.',
      toolsNeeded: ['Heavy pipe wrench', 'Drain auger snake', 'Teflon sealant tape', 'Pressure gauge'],
      estimatedMinutes: 40,
      mahaTip: 'Maha advises keeping a bucket beneath the leak point to prevent water seepage into subflooring.'
    };
  }

  if (q.includes('ac') || q.includes('cool') || q.includes('gas') || q.includes('condenser') || q.includes('filter')) {
    return {
      summary: 'AC cooling coil dirt accumulation or refrigerant pressure drop detected.',
      recommendedCategory: 'ac_cooling',
      categoryTitle: 'AC & Air Cooling',
      recommendedWorkTitle: q.includes('gas') ? 'AC Gas Leak Testing & Full Gas Charging' : 'Split AC Power Jet Deep Servicing',
      estimatedLaborCost: 449,
      visitingFee: 199,
      urgency: 'standard',
      urgencyReason: 'Scheduled deep jet wash or gas refill restores full cooling capacity.',
      safetyWarning: 'Turn off AC from the main 16A wall switch before technicians open the indoor unit cover.',
      toolsNeeded: ['High-pressure jet wash pump', 'Manifold refrigerant gauge', 'Vacuum pump', 'Fin comb'],
      estimatedMinutes: 60,
      mahaTip: 'Maha suggests checking if the outdoor compressor is kicking on within 3 minutes of switching on cool mode.'
    };
  }

  if (q.includes('lock') || q.includes('key') || q.includes('door') || q.includes('godrej') || q.includes('biometric')) {
    return {
      summary: 'Door cylinder deadlock, mechanical key jamming, or biometric alignment failure.',
      recommendedCategory: 'locksmith',
      categoryTitle: 'Locksmith & Smart Locks',
      recommendedWorkTitle: q.includes('locked out') ? 'Emergency House Lockout Door Opening' : q.includes('smart') ? 'Smart Biometric Fingerprint & WiFi Lock Install' : 'Godrej / Yale Main Door Lock Replacement',
      estimatedLaborCost: 260,
      visitingFee: 199,
      urgency: q.includes('locked out') ? 'emergency_30min' : 'standard',
      urgencyReason: q.includes('locked out') ? 'Customer stranded outside residence.' : 'Standard lock upgrade.',
      safetyWarning: 'Do not force the key with pliers to avoid snapping the brass blade inside the mortise cylinder.',
      toolsNeeded: ['Precision pick kit', 'Cylinder extractor', 'Hole saw cutter', 'Key duplicator'],
      estimatedMinutes: 30,
      mahaTip: 'Maha pro tip: Always keep digital smart locks calibrated with fresh alkaline batteries.'
    };
  }

  // Default General Diagnostic
  return {
    summary: `Comprehensive diagnostic analysis for "${query}".`,
    recommendedCategory: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    recommendedWorkTitle: 'Doorstep Comprehensive Diagnostic & Repair',
    estimatedLaborCost: 180,
    visitingFee: 199,
    urgency: 'standard',
    urgencyReason: 'FixMate certified pro will inspect on-site and confirm exact parts.',
    safetyWarning: 'Ensure safe access to the work area and keep pets in a separate room.',
    toolsNeeded: ['Complete professional toolbox', 'Multimeter', 'Inspection lamp'],
    estimatedMinutes: 45,
    mahaTip: 'Maha will dispatch the highest-rated nearby technician with complete tools for ₹199 base visit.'
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // AI Maha Search Endpoint
  app.post('/api/maha/search', async (req, res) => {
    try {
      const { query, language = 'en' } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      if (ai) {
        const prompt = `You are "Maha", the friendly expert AI Diagnostic Specialist for FixMate India (on-demand doorstep home, beauty, repair and maintenance platform).
FixMate visiting fee is fixed at flat ₹199 across all categories (no higher surge pricing).
The user describes the following problem or service request:
"${query}"
The user's preferred language is: "${language}".

Respond in the user's preferred language for summary, recommendations, warnings, and tips, but keep the "recommendedCategory" key as one of the exact enum strings below.

Return ONLY valid JSON with no markdown fences, formatted as:
{
  "summary": "Clear diagnosis or service overview in user's language",
  "recommendedCategory": "beauty_women" | "grooming_men" | "plumbing" | "electrical" | "ac_cooling" | "appliances" | "ro_purifier" | "carpentry" | "cleaning" | "pest_control" | "locksmith" | "painting" | "roofing" | "cctv_smart_home" | "masonry_tiling" | "vehicle_care" | "home_health" | "gadget_repair",
  "categoryTitle": "Name of service category in user's language",
  "recommendedWorkTitle": "Name of exact service work needed in user's language",
  "estimatedLaborCost": number (fair labor charge in INR, e.g. 140 - 599),
  "visitingFee": 199,
  "urgency": "emergency_30min" | "standard" | "scheduled",
  "urgencyReason": "Why this is or is not an emergency in user's language",
  "safetyWarning": "Helpful safety or hygiene precaution in user's language",
  "toolsNeeded": ["tool/kit 1", "tool/kit 2", "tool/kit 3"],
  "estimatedMinutes": number,
  "mahaTip": "Helpful expert tip from Maha in user's language"
}`;

        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          });

          const text = response.text || '';
          const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(cleaned);
          parsed.visitingFee = 199;
          return res.json({ success: true, data: parsed });
        } catch (apiErr: any) {
          console.error('Gemini API call failed, falling back to heuristic engine:', apiErr?.message);
        }
      }

      const fallback = generateMahaFallback(query);
      return res.json({ success: true, data: fallback });
    } catch (err: any) {
      console.error('Maha Search Error:', err);
      res.status(500).json({ error: 'Failed to process AI search' });
    }
  });

  // AI Maha Interactive Chat Endpoint
  app.post('/api/maha/chat', async (req, res) => {
    try {
      const { messages, language = 'en' } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const latestUserMessage = messages[messages.length - 1]?.text || '';

      if (ai) {
        const systemInstruction = `You are "Maha", the friendly, knowledgeable 24/7 AI Service & Repair Consultant for FixMate (India's premier doorstep home, beauty, and maintenance platform).
Key FixMate Policy:
- FixMate has a guaranteed flat ₹199 doorstep visiting/inspection fee across all categories.
- Zero surge pricing, no higher charges required. Transparent fixed fare with 30-day warranty.
- Services include: Salon & Beauty at Home for Women, Men's Grooming, Plumbing, Electrical, AC & Cooling, Appliance Repair, Carpentry, Deep Cleaning, Locksmith, Painting, Vehicle Care (Foam wash & battery jumpstart), Elderly Healthcare, and Laptop/WiFi repair.

Your personality: Warm, knowledgeable, helpful, and concise. Always answer in the user's preferred language: "${language}".
Help users diagnose problems, answer beauty & grooming queries, provide safety precautions, and estimate costs.

If your response recommends a specific doorstep service work that the user can book or have dispatched, append a JSON action block at the very end of your message in this exact format:
[[ACTION:{"category":"plumbing|electrical|beauty_women|grooming_men|ac_cooling|appliances|vehicle_care|home_health|carpentry|cleaning|locksmith","title":"Service Title","labor":150,"visitingFee":199,"urgency":"standard|emergency_30min"}]]
Only add [[ACTION:...]] when clearly relevant to the user's query.`;

        try {
          // Format conversation contents for Gemini
          const contents = messages.map((m: any) => ({
            role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.3
            }
          });

          const rawReply = response.text || "Hello! I am Maha, your FixMate AI consultant. How can I help you today?";

          // Parse optional embedded action block
          let action = null;
          let replyText = rawReply;
          const actionMatch = rawReply.match(/\[\[ACTION:(.*?)\]\]/s);
          if (actionMatch && actionMatch[1]) {
            try {
              action = JSON.parse(actionMatch[1]);
              action.visitingFee = 199;
              replyText = rawReply.replace(/\[\[ACTION:(.*?)\]\]/s, '').trim();
            } catch (_) {}
          }

          return res.json({
            success: true,
            reply: replyText,
            action
          });
        } catch (apiErr: any) {
          console.error('Gemini Chat API call failed, using heuristic chat fallback:', apiErr?.message);
        }
      }

      // Intelligent Fallback for Maha Chat
      const fallbackDiag = generateMahaFallback(latestUserMessage, language);
      let fallbackText = `Namaste! I am Maha. Based on what you shared: "${latestUserMessage}", ${fallbackDiag.summary}

Our FixMate visiting fee is flat ₹199 (no surge or higher charges). The pro brings all required tools and provides a 30-day warranty. Safety tip: ${fallbackDiag.safetyWarning}`;

      if (latestUserMessage.toLowerCase().includes('visiting') || latestUserMessage.toLowerCase().includes('charge') || latestUserMessage.toLowerCase().includes('price')) {
        fallbackText = `FixMate has a transparent pricing policy! The doorstep visiting & inspection fee is strictly flat ₹199 across all categories (no higher surge charges). Work labor is charged fairly based on the exact repair, plus actual parts if needed. You get a 30-day warranty on all completed jobs.`;
      } else if (latestUserMessage.toLowerCase().includes('facial') || latestUserMessage.toLowerCase().includes('wax') || latestUserMessage.toLowerCase().includes('beauty')) {
        fallbackText = `For salon at home, our certified beauticians arrive with 100% disposable hygienic kits, branded cosmetics (O3+, L'Oreal, Rica), and waxing warmers! The visiting fee is flat ₹199. Would you like me to dispatch a beautician to your doorstep?`;
      }

      const action = {
        category: fallbackDiag.recommendedCategory,
        title: fallbackDiag.recommendedWorkTitle,
        labor: fallbackDiag.estimatedLaborCost,
        visitingFee: 199,
        urgency: fallbackDiag.urgency
      };

      return res.json({
        success: true,
        reply: fallbackText,
        action
      });
    } catch (err: any) {
      console.error('Maha Chat Error:', err);
      res.status(500).json({ error: 'Failed to process chat with Maha' });
    }
  });

  // Vite development mode integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FixMate full-stack server running on port ${PORT}`);
  });
}

startServer();
