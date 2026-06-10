export interface Protocol {
  id: string
  title: string
  severity: 'CRITICAL' | 'URGENT' | 'STABLE'
  keywords: string[]
  steps: string[]
  doNot: string[]
  timeCritical: boolean
}

export const PROTOCOLS: Protocol[] = [

// ============ EMERGENCY NUMBERS ============
{
  id: 'INFO_001',
  title: 'Emergency Phone Numbers (India)',
  severity: 'STABLE',
  keywords: ['police phone no', 'police number', 'ambulance number', 'fire brigade number', 'emergency numbers', 'helpline', 'call police', 'call ambulance'],
  steps: [
    'National Emergency Number: 112 (All emergencies)',
    'Police: 100',
    'Ambulance / Medical: 108',
    'Fire Brigade: 101',
    'Women Helpline: 1091',
    'Disaster Management: 108'
  ],
  doNot: [
    'Do NOT hang up until the dispatcher tells you to',
    'Do NOT panic when speaking, clearly state your location first'
  ],
  timeCritical: false,
},

// ============ CARDIAC ============
{
  id: 'CARDIAC_001',
  title: 'Cardiac Arrest / No Pulse',
  severity: 'CRITICAL',
  keywords: ['heart attack', 'cardiac arrest', 'no pulse', 'heart stopped', 'not breathing', 'collapsed unconscious', 'unresponsive adult', 'person fell down not waking'],
  steps: [
    'Call for help loudly — shout for anyone nearby',
    'Check responsiveness — tap shoulders and shout "Are you okay?"',
    'If no response and no normal breathing — begin CPR immediately',
    'Place heel of hand on center of chest (lower half of breastbone)',
    'Push hard and fast — 30 compressions at 100-120 per minute (rate of "Stayin Alive" song)',
    'Compress at least 5cm deep',
    'After 30 compressions — give 2 rescue breaths if trained, or continue compressions only',
    'Do not stop until emergency services arrive or person shows signs of life',
  ],
  doNot: [
    'Do NOT leave the person alone',
    'Do NOT give food or water',
    'Do NOT wait — every second without CPR reduces survival by 10%',
  ],
  timeCritical: true,
},
{
  id: 'CARDIAC_002',
  title: 'Heart Attack (Conscious)',
  severity: 'CRITICAL',
  keywords: ['chest pain', 'heart attack', 'chest tightness', 'arm pain', 'jaw pain', 'sweating chest pain', 'crushing chest', 'heart pain', 'left arm numb'],
  steps: [
    'Have the person sit or lie in a comfortable position — half-sitting with knees bent is best',
    'Loosen any tight clothing around neck and chest',
    'If person is not allergic — give one adult aspirin (325mg) to chew slowly',
    'Keep them calm and still — do not let them walk around',
    'Monitor breathing and consciousness continuously',
    'Be prepared to start CPR if they lose consciousness',
  ],
  doNot: [
    'Do NOT let them eat or drink anything except aspirin',
    'Do NOT let them walk or exert themselves',
    'Do NOT leave them alone',
  ],
  timeCritical: true,
},

// ============ BREATHING ============
{
  id: 'BREATH_001',
  title: 'Choking — Adult',
  severity: 'CRITICAL',
  keywords: ['choking', 'food stuck throat', 'cannot breathe', 'blocked airway', 'heimlich', 'something in throat', 'turning blue lips', 'cannot speak suddenly'],
  steps: [
    'Ask "Are you choking?" — if they cannot speak, cough, or breathe, act immediately',
    'Give 5 firm back blows between shoulder blades with heel of hand',
    'If object not dislodged — give 5 abdominal thrusts (Heimlich maneuver)',
    'For Heimlich: stand behind person, arms around waist, fist above navel below ribs, pull sharply inward and upward',
    'Alternate 5 back blows and 5 abdominal thrusts until object is dislodged',
    'If person becomes unconscious — begin CPR and look for object in mouth before rescue breaths',
  ],
  doNot: [
    'Do NOT do blind finger sweeps in the mouth',
    'Do NOT give water',
    'Do NOT do Heimlich on infants — use back blows and chest thrusts only',
  ],
  timeCritical: true,
},
{
  id: 'BREATH_002',
  title: 'Choking — Infant (under 1 year)',
  severity: 'CRITICAL',
  keywords: ['baby choking', 'infant choking', 'baby cannot breathe', 'baby turning blue', 'newborn choking', 'small child choking'],
  steps: [
    'Hold baby face-down on your forearm, supporting head lower than chest',
    'Give 5 firm back blows between shoulder blades with 2 fingers',
    'Turn baby face-up on your other forearm',
    'Give 5 chest thrusts using 2 fingers on center of chest just below nipple line',
    'Alternate back blows and chest thrusts until object dislodges',
    'If baby becomes unconscious — start infant CPR',
  ],
  doNot: [
    'Do NOT do abdominal thrusts on infants',
    'Do NOT shake the baby',
    'Do NOT do blind finger sweeps',
  ],
  timeCritical: true,
},
{
  id: 'BREATH_003',
  title: 'Asthma Attack',
  severity: 'URGENT',
  keywords: ['asthma attack', 'cannot breathe asthma', 'wheezing badly', 'inhaler not working', 'breathing difficulty asthma', 'tight chest wheezing'],
  steps: [
    'Sit the person upright — do not lay them down',
    'If they have an inhaler — give 1 puff every 30-60 seconds, up to 10 puffs',
    'Keep the person calm — panic worsens breathing',
    'Loosen all tight clothing',
    'If inhaler unavailable — keep upright, lean slightly forward with hands on knees',
    'If no improvement after 10 puffs or 15 minutes — condition is life-threatening',
  ],
  doNot: [
    'Do NOT lay person flat',
    'Do NOT leave them alone',
    'Do NOT expose to smoke, dust, or cold air',
  ],
  timeCritical: false,
},
{
  id: 'BREATH_004',
  title: 'Smoke Inhalation',
  severity: 'CRITICAL',
  keywords: ['smoke inhalation', 'breathed in smoke', 'fire smoke breathing', 'coughing from smoke', 'smoke filled room', 'toxic fumes breathed'],
  steps: [
    'Move person to fresh air immediately — away from smoke source',
    'Loosen all clothing around neck and chest',
    'Keep person sitting upright or in recovery position if unconscious',
    'Monitor for worsening symptoms: confusion, loss of consciousness, blue lips',
    'If breathing stops — begin CPR',
    'Do not re-enter the smoke-filled area',
  ],
  doNot: [
    'Do NOT re-enter smoke-filled building',
    'Do NOT give anything by mouth if confused',
  ],
  timeCritical: true,
},

// ============ BLEEDING ============
{
  id: 'BLEED_001',
  title: 'Severe External Bleeding',
  severity: 'CRITICAL',
  keywords: ['severe bleeding', 'heavy bleeding', 'blood not stopping', 'deep cut bleeding', 'artery cut', 'gushing blood', 'spurting blood', 'major wound'],
  steps: [
    'Apply firm direct pressure with cleanest cloth available',
    'Press continuously for minimum 10 minutes — do not lift to check',
    'If cloth soaks through — add more cloth on top, do not remove first cloth',
    'Elevate the injured area above heart level if possible',
    'If limb is bleeding severely and pressure fails — apply tourniquet 5cm above wound',
    'For tourniquet: tie tightly, note exact time applied, do not remove',
    'Keep person lying down to prevent shock',
  ],
  doNot: [
    'Do NOT remove the first cloth — it helps clotting',
    'Do NOT apply tourniquet on neck, armpit, or groin',
    'Do NOT give food or water if severe blood loss suspected',
  ],
  timeCritical: true,
},
{
  id: 'BLEED_002',
  title: 'Nosebleed',
  severity: 'STABLE',
  keywords: ['nosebleed', 'nose bleeding', 'blood from nose', 'bleeding nose'],
  steps: [
    'Sit upright and lean slightly forward — not backward',
    'Pinch the soft part of nose firmly (not the bony bridge)',
    'Hold continuously for 10-15 minutes without releasing',
    'Breathe through mouth',
    'Apply cold compress to bridge of nose',
    'If bleeding continues after 30 minutes — seek medical help',
  ],
  doNot: [
    'Do NOT tilt head backward — blood will flow into throat',
    'Do NOT pack nose tightly',
    'Do NOT blow nose during or immediately after',
  ],
  timeCritical: false,
},
{
  id: 'BLEED_003',
  title: 'Internal Bleeding (Suspected)',
  severity: 'CRITICAL',
  keywords: ['internal bleeding', 'bleeding inside', 'hit stomach bleeding', 'abdominal injury', 'fell hard on belly', 'blood in urine after injury', 'black stool after injury'],
  steps: [
    'Lay person flat on their back',
    'Raise legs 30cm above heart level unless head, neck, back injury suspected',
    'Keep person still and warm — cover with blanket',
    'Do not give food or water',
    'Monitor pulse and breathing every 2 minutes',
    'If unconscious and breathing — place in recovery position',
  ],
  doNot: [
    'Do NOT move person unnecessarily',
    'Do NOT give any medication',
    'Do NOT apply heat to abdomen',
  ],
  timeCritical: true,
},

// ============ BURNS ============
{
  id: 'BURN_001',
  title: 'Thermal Burn (Heat/Fire)',
  severity: 'URGENT',
  keywords: ['burn', 'fire burn', 'heat burn', 'scalded', 'hot water burn', 'cooking burn', 'flame burn', 'blister from heat'],
  steps: [
    'Cool the burn immediately — run cool (not cold/ice) water for 20 minutes',
    'Remove clothing and jewelry near burn UNLESS stuck to skin',
    'Cover with clean cling film or clean plastic bag — do not use cotton wool',
    'If face is burned — keep upright, make breathing holes in any covering',
    'For large burns — keep person warm to prevent hypothermia while cooling burn',
  ],
  doNot: [
    'Do NOT use ice, iced water, butter, toothpaste, or any creams',
    'Do NOT burst blisters',
    'Do NOT remove clothing stuck to skin',
    'Do NOT use fluffy cotton materials on burn',
  ],
  timeCritical: false,
},
{
  id: 'BURN_002',
  title: 'Chemical Burn',
  severity: 'CRITICAL',
  keywords: ['chemical burn', 'acid burn', 'bleach burn', 'industrial chemical skin', 'corrosive on skin', 'cleaning product burn', 'chemical spill on body'],
  steps: [
    'Remove contaminated clothing — cut off, do NOT pull over head',
    'Wear gloves if available before touching contaminated clothing',
    'Flush with large amounts of running water for minimum 20 minutes',
    'If chemical is powder — brush off before flushing',
    'For eye chemical burn — flush eye with water for 20 minutes, hold eyelid open',
    'Cover loosely with clean dry cloth after flushing',
  ],
  doNot: [
    'Do NOT use neutralizing agents (baking soda, vinegar)',
    'Do NOT rub the burned area',
    'Do NOT apply any creams or ointments',
  ],
  timeCritical: true,
},
{
  id: 'BURN_003',
  title: 'Electrical Burn',
  severity: 'CRITICAL',
  keywords: ['electric shock burn', 'electrocution burn', 'lightning strike burn', 'electric current injury', 'power line contact'],
  steps: [
    'DO NOT TOUCH THE PERSON if still in contact with electrical source',
    'Turn off power at the source or breaker first',
    'If power cannot be cut — use non-conductive object (dry wood, plastic) to separate person from source',
    'Once safe — check breathing and pulse',
    'All electrical burns need medical attention even if they look minor (internal damage may be severe)',
    'Treat visible burns with cool water',
    'Watch for heart rhythm problems — be prepared to start CPR',
  ],
  doNot: [
    'Do NOT touch person while connected to electrical source',
    'Do NOT use metal or wet objects to separate person from source',
    'Do NOT assume small surface burn means minor injury',
  ],
  timeCritical: true,
},

// ============ FRACTURES & TRAUMA ============
{
  id: 'FRACT_001',
  title: 'Suspected Bone Fracture',
  severity: 'URGENT',
  keywords: ['broken bone', 'fracture', 'bone sticking out', 'bone crack sound', 'cannot move arm', 'cannot move leg', 'deformed limb', 'fell and arm bent wrong'],
  steps: [
    'Keep the injured area completely still — do not try to straighten it',
    'Immobilize the area using whatever is available — rolled newspaper, sticks, padded boards',
    'Secure splint above and below the fracture site',
    'For open fracture (bone visible) — cover with clean cloth, do not push bone back',
    'Apply ice pack wrapped in cloth to reduce swelling',
    'Keep person warm and still — watch for shock symptoms',
  ],
  doNot: [
    'Do NOT try to straighten the fracture',
    'Do NOT push exposed bone back',
    'Do NOT apply ice directly to skin',
  ],
  timeCritical: false,
},
{
  id: 'FRACT_002',
  title: 'Spinal / Neck Injury',
  severity: 'CRITICAL',
  keywords: ['neck injury', 'spinal injury', 'spine hurt', 'cannot feel legs', 'fell on head', 'neck pain after accident', 'tingling hands after fall', 'back injury cannot move'],
  steps: [
    'Do NOT move the person unless they are in immediate danger',
    'Keep head and neck completely still in the position found',
    'If conscious — keep them calm and tell them not to move',
    'If you must move them — keep head, neck, and spine aligned as one unit',
    'Roll as a log — one person supports head, others support body in one synchronized movement',
    'If unconscious but breathing — keep still in position found unless airway needs clearing',
  ],
  doNot: [
    'Do NOT bend, twist, or rotate the neck or spine',
    'Do NOT leave unconscious person on their back without airway monitoring',
    'Do NOT remove helmet if they are wearing one',
  ],
  timeCritical: true,
},
{
  id: 'FRACT_003',
  title: 'Head Injury / Concussion',
  severity: 'CRITICAL',
  keywords: ['head injury', 'hit head', 'concussion', 'knocked out', 'head bleeding', 'confused after fall', 'vomiting after head hit', 'dizzy after hit head', 'unconscious head trauma'],
  steps: [
    'Keep person still and calm — do not let them walk it off',
    'Apply gentle pressure to any bleeding scalp wounds with clean cloth',
    'Do NOT apply direct pressure if you suspect skull fracture',
    'If unconscious but breathing — recovery position, monitor airway',
    'Check pupils — unequal pupils are a danger sign',
    'Watch for: worsening headache, repeated vomiting, seizures, increasing confusion',
    'Keep person awake if mild — talk to them, ask simple questions',
  ],
  doNot: [
    'Do NOT give aspirin or ibuprofen — they increase bleeding risk',
    'Do NOT leave alone for 24 hours',
    'Do NOT apply pressure if skull fracture suspected',
  ],
  timeCritical: true,
},

// ============ SHOCK ============
{
  id: 'SHOCK_001',
  title: 'Shock (Medical)',
  severity: 'CRITICAL',
  keywords: ['shock', 'pale cold clammy skin', 'rapid weak pulse', 'confusion blood loss', 'fainting blood loss', 'dizzy pale sweating', 'person going into shock'],
  steps: [
    'Lay person flat on back immediately',
    'Raise legs 30cm above heart level — unless head, chest, or spinal injury',
    'Keep person warm with blanket or extra clothing',
    'Do not give food or water',
    'Loosen all tight clothing',
    'Monitor breathing every 2 minutes',
    'If unconscious and breathing — recovery position',
    'If breathing stops — begin CPR',
  ],
  doNot: [
    'Do NOT let person sit up or walk',
    'Do NOT give food, water, or alcohol',
    'Do NOT apply heat directly to skin',
  ],
  timeCritical: true,
},
{
  id: 'SHOCK_002',
  title: 'Anaphylactic Shock (Severe Allergy)',
  severity: 'CRITICAL',
  keywords: ['anaphylaxis', 'severe allergic reaction', 'bee sting swelling throat', 'allergy throat closing', 'epipen', 'face swelling allergy', 'hives throat tightening', 'cannot breathe after eating'],
  steps: [
    'Use epinephrine auto-injector (EpiPen) immediately if available — outer thigh',
    'Call for help immediately',
    'Lay person flat — raise legs unless difficulty breathing, then sit up',
    'If second EpiPen available — use after 5-15 minutes if no improvement',
    'If no EpiPen — keep airway open, position for easiest breathing',
    'Be prepared to start CPR',
    'Symptoms can return 4-8 hours later even after improvement',
  ],
  doNot: [
    'Do NOT let person stand or walk',
    'Do NOT give antihistamines as primary treatment — they are too slow',
    'Do NOT assume improvement means it is over',
  ],
  timeCritical: true,
},

// ============ ENVIRONMENTAL ============
{
  id: 'ENV_001',
  title: 'Heatstroke',
  severity: 'CRITICAL',
  keywords: ['heatstroke', 'heat stroke', 'overheating', 'too hot confused', 'hot weather collapse', 'heat exhaustion', 'high body temperature confused', 'fainted in heat'],
  steps: [
    'Move person to coolest available location — shade, indoors',
    'Remove excess clothing',
    'Cool body aggressively — wet cloths on neck, armpits, groin',
    'Fan the person while applying wet cloths',
    'If conscious — give cool water to drink slowly',
    'Do NOT give aspirin or paracetamol — they do not reduce heat-related fever',
    'Watch for seizures — do not restrain, protect head from injury',
  ],
  doNot: [
    'Do NOT give aspirin or paracetamol',
    'Do NOT leave alone',
    'Do NOT give alcohol',
  ],
  timeCritical: true,
},
{
  id: 'ENV_002',
  title: 'Hypothermia',
  severity: 'CRITICAL',
  keywords: ['hypothermia', 'too cold', 'freezing person', 'shivering uncontrollably', 'cold water rescue', 'flood victim cold', 'cold and confused', 'blue lips cold'],
  steps: [
    'Move person to warm shelter immediately',
    'Remove wet clothing carefully',
    'Cover with dry blankets — focus on torso, head, neck first',
    'Place warm water bottles wrapped in cloth to armpits, groin, and neck',
    'If conscious and able to swallow — give warm sweet drinks',
    'Do not rub limbs — this drives cold blood to core',
    'Handle gently — heart is vulnerable to irregular rhythms when cold',
  ],
  doNot: [
    'Do NOT rub or massage limbs',
    'Do NOT give alcohol',
    'Do NOT apply direct heat sources (fire, heating pads) to skin',
  ],
  timeCritical: true,
},
{
  id: 'ENV_003',
  title: 'Drowning / Near-Drowning',
  severity: 'CRITICAL',
  keywords: ['drowning', 'nearly drowned', 'water rescue', 'pulled from water not breathing', 'flood victim not breathing', 'fell in water', 'submerged in water'],
  steps: [
    'Remove person from water safely — do not put yourself at risk',
    'Check breathing immediately',
    'If not breathing — begin CPR immediately (start with 5 rescue breaths)',
    'For drowning CPR: 5 rescue breaths first, then 30 compressions, then 2 breaths',
    'Keep person horizontal — do not hold upside down to drain water',
    'Remove wet clothing and keep warm',
    'Even if person appears to recover — monitor for 24 hours (secondary drowning risk)',
  ],
  doNot: [
    'Do NOT hold upside down to drain water — it wastes time',
    'Do NOT assume person is fine after coughing up water',
    'Do NOT leave alone even after apparent recovery',
  ],
  timeCritical: true,
},
{
  id: 'ENV_004',
  title: 'Lightning Strike',
  severity: 'CRITICAL',
  keywords: ['lightning strike', 'struck by lightning', 'thunder lightning injury', 'lightning victim'],
  steps: [
    'Lightning victims do NOT carry electrical charge — it is safe to touch them',
    'Move to safety if still in storm area',
    'Check breathing and pulse immediately',
    'Begin CPR if not breathing — lightning victims often respond well to CPR',
    'Treat burns at entry and exit points with cool water',
    'Watch for spinal injuries from muscle contraction — move carefully',
  ],
  doNot: [
    'Do NOT hesitate to touch victim — they are not electrically charged',
    'Do NOT stand under trees or near metal in ongoing storm',
  ],
  timeCritical: true,
},
{
  id: 'ENV_005',
  title: 'Snakebite',
  severity: 'CRITICAL',
  keywords: ['snakebite', 'snake bite', 'bitten by snake', 'snake attack', 'fang marks', 'snake venom', 'cobra bite', 'viper bite'],
  steps: [
    'Keep person completely still — movement spreads venom faster',
    'Immobilize the bitten limb at heart level — not higher, not lower',
    'Remove rings, watches, tight clothing near bite before swelling starts',
    'Mark the edge of any swelling with pen and note time',
    'Keep person calm — fear increases heart rate and venom spread',
    'Try to remember snake appearance — do NOT try to catch or kill it',
  ],
  doNot: [
    'Do NOT cut and suck the venom',
    'Do NOT apply tourniquet',
    'Do NOT apply ice',
    'Do NOT give alcohol',
    'Do NOT let person walk if avoidable',
  ],
  timeCritical: true,
},

// ============ DISASTER-SPECIFIC ============
{
  id: 'DISAS_001',
  title: 'Earthquake — Trapped Under Rubble',
  severity: 'CRITICAL',
  keywords: ['trapped rubble', 'building collapsed', 'earthquake trapped', 'under debris', 'stuck in collapsed building', 'cant get out rubble', 'earthquake rescue'],
  steps: [
    'Cover your mouth with cloth to filter dust',
    'Do not light matches or lighters — possible gas leaks',
    'Signal rescuers: tap on pipes or walls in pattern — do not shout continuously (conserves energy, avoids dust)',
    'If trapped with others — stay together and take turns signaling',
    'Move as little as possible to conserve oxygen if space is small',
    'Do not try to move heavy debris without support — it may trigger further collapse',
    'If phone works — turn off screen to conserve battery, use only to signal',
  ],
  doNot: [
    'Do NOT use lighters or matches',
    'Do NOT shout continuously — tap on pipes instead',
    'Do NOT move debris that may be structural',
  ],
  timeCritical: true,
},
{
  id: 'DISAS_002',
  title: 'Flood Evacuation',
  severity: 'CRITICAL',
  keywords: ['flood', 'flooding', 'water rising', 'flash flood', 'flood evacuation', 'house flooding', 'water level rising fast'],
  steps: [
    'Move to highest ground immediately — do not wait',
    'Do not walk through moving water — 15cm of fast water can knock you down',
    'If driving and road floods — abandon vehicle and move to high ground on foot',
    'Carry only what is essential — documents, medication, water',
    'Turn off electricity at main breaker before leaving if safe to do so',
    'Avoid floodwater contact — it contains sewage and electrical hazards',
    'Do not cross flooded bridges',
  ],
  doNot: [
    'Do NOT walk in moving water above ankle level',
    'Do NOT drive through floodwater',
    'Do NOT touch electrical equipment in flood water',
  ],
  timeCritical: true,
},
{
  id: 'DISAS_003',
  title: 'Fire — Escape and Evacuation',
  severity: 'CRITICAL',
  keywords: ['building on fire', 'house fire', 'fire evacuation', 'fire escape', 'smoke everywhere', 'fire in building', 'room full of smoke', 'fire blocked exit'],
  steps: [
    'Alert everyone — shout "FIRE" and activate alarm if available',
    'Before opening any door — feel door with back of hand, if hot do NOT open',
    'Stay low — crawl below smoke level (cleaner air is near floor)',
    'Close doors behind you to slow fire spread',
    'If exit is blocked — go to window, signal for help, do not jump unless no other option',
    'If clothes catch fire — STOP, DROP, ROLL',
    'Meet at pre-agreed assembly point outside',
    'Never re-enter a burning building',
  ],
  doNot: [
    'Do NOT use elevators',
    'Do NOT open hot doors',
    'Do NOT re-enter building for belongings',
    'Do NOT stand up in smoke-filled areas',
  ],
  timeCritical: true,
},
{
  id: 'DISAS_004',
  title: 'Gas Leak',
  severity: 'CRITICAL',
  keywords: ['gas leak', 'smell gas', 'gas smell house', 'LPG leak', 'cylinder leaking', 'gas cylinder hissing', 'rotten egg smell indoors'],
  steps: [
    'Do NOT switch any electrical switches on or off',
    'Do NOT use mobile phone inside the building',
    'Open all windows and doors immediately',
    'Turn off gas at the main valve if safe to reach',
    'Evacuate everyone immediately',
    'Once outside — call for help from a distance',
    'Do not re-enter until cleared',
  ],
  doNot: [
    'Do NOT switch lights or appliances on or off',
    'Do NOT use mobile phone inside',
    'Do NOT smoke or use naked flame',
    'Do NOT re-enter until professionals clear the area',
  ],
  timeCritical: true,
},
{
  id: 'DISAS_005',
  title: 'Cyclone / Severe Storm Shelter',
  severity: 'URGENT',
  keywords: ['cyclone', 'hurricane', 'severe storm', 'tornado', 'strong winds shelter', 'cyclone warning', 'shelter from storm'],
  steps: [
    'Move to the most interior room of the building — away from windows',
    'If no shelter — lie flat in lowest ground available, in a ditch if possible',
    'Stay away from trees, power lines, and metal structures',
    'If in a vehicle — do not shelter under bridges (wind tunnel effect), park away from trees',
    'Protect head and neck with arms if debris is flying',
    'Do not go outside during the eye of the storm — it will resume',
  ],
  doNot: [
    'Do NOT shelter under bridges or overpasses',
    'Do NOT go outside during the eye assuming it is over',
    'Do NOT stay near windows',
  ],
  timeCritical: false,
},

// ============ NEUROLOGICAL ============
{
  id: 'NEURO_001',
  title: 'Seizure / Epileptic Fit',
  severity: 'URGENT',
  keywords: ['seizure', 'epileptic fit', 'convulsions', 'fitting', 'shaking uncontrollably', 'epilepsy attack', 'grand mal', 'falling shaking'],
  steps: [
    'Time the seizure — if over 5 minutes, it is an emergency',
    'Clear area of hard or sharp objects',
    'Place something soft under their head',
    'Turn person on their side after convulsions stop to prevent choking',
    'Stay with person until fully conscious',
    'After seizure — person will be confused, tired, and may not remember — reassure them calmly',
  ],
  doNot: [
    'Do NOT restrain the person',
    'Do NOT put anything in their mouth',
    'Do NOT give water until fully conscious',
  ],
  timeCritical: false,
},
{
  id: 'NEURO_002',
  title: 'Stroke',
  severity: 'CRITICAL',
  keywords: ['stroke', 'face drooping', 'arm weakness suddenly', 'speech slurred suddenly', 'sudden headache worst ever', 'face numb suddenly', 'FAST stroke', 'brain attack'],
  steps: [
    'Use FAST test: Face drooping? Arm weakness? Speech difficulty? Time to act',
    'Note exact time symptoms started — critical for treatment decisions',
    'Keep person calm and still — do not give food or water',
    'If conscious — lay in comfortable position with head and shoulders slightly raised',
    'If unconscious but breathing — recovery position',
    'Do not give aspirin for stroke — it can worsen some types of stroke',
  ],
  doNot: [
    'Do NOT give aspirin unless specifically directed',
    'Do NOT give food or water — swallowing may be impaired',
    'Do NOT leave alone',
  ],
  timeCritical: true,
},
{
  id: 'NEURO_003',
  title: 'Fainting / Loss of Consciousness',
  severity: 'URGENT',
  keywords: ['fainted', 'passed out', 'blacked out', 'lost consciousness', 'fell unconscious', 'suddenly collapsed', 'went limp', 'fainted in heat'],
  steps: [
    'Check for response — tap shoulder and shout',
    'Check breathing — look for chest rise',
    'If breathing — recovery position on their side',
    'If not breathing — begin CPR',
    'If simply fainted — lay flat, raise legs 30cm, loosen clothing',
    'Do not give food or water until fully alert',
    'Most fainting resolves in 1-2 minutes — if not, treat as something more serious',
  ],
  doNot: [
    'Do NOT give water until fully conscious and able to swallow',
    'Do NOT sit person up immediately',
    'Do NOT slap to revive',
  ],
  timeCritical: false,
},

// ============ CHILDBIRTH EMERGENCY ============
{
  id: 'BIRTH_001',
  title: 'Emergency Childbirth',
  severity: 'CRITICAL',
  keywords: ['giving birth', 'baby coming now', 'labor emergency', 'water broke', 'baby delivering', 'crowning', 'contractions very fast', 'emergency delivery'],
  steps: [
    'Stay calm — most births progress naturally without intervention',
    'Help mother into comfortable position — semi-reclined or on hands and knees',
    'Wash hands thoroughly if possible',
    'As baby crowns — support head gently, do not pull',
    'If cord around neck — gently slip over baby\'s head',
    'After head delivers — body usually follows with next push',
    'Keep baby warm immediately — dry and cover with whatever is available',
    'Do not cut cord unless you have clean sterile equipment — tie tightly in two places if necessary',
  ],
  doNot: [
    'Do NOT pull on the baby or cord',
    'Do NOT cut cord with unclean instruments',
    'Do NOT leave mother alone',
  ],
  timeCritical: true,
},

// ============ POISONING ============
{
  id: 'POISON_001',
  title: 'Poisoning / Ingestion',
  severity: 'CRITICAL',
  keywords: ['swallowed poison', 'ingested chemical', 'drank cleaning product', 'overdose medication', 'poisoning', 'child ate something dangerous', 'accidentally swallowed'],
  steps: [
    'Identify what was swallowed and how much if possible',
    'Do NOT induce vomiting unless specifically told to by medical professional',
    'If corrosive (bleach, acid, battery acid) — do not induce vomiting',
    'If conscious — give small sips of milk or water only for corrosive substances',
    'Keep any packaging or container to show responders',
    'If unconscious — recovery position, monitor airway',
  ],
  doNot: [
    'Do NOT induce vomiting for corrosive or petroleum substances',
    'Do NOT give anything by mouth if unconscious',
    'Do NOT leave alone',
  ],
  timeCritical: true,
},
{
  id: 'POISON_002',
  title: 'Carbon Monoxide Poisoning',
  severity: 'CRITICAL',
  keywords: ['carbon monoxide', 'CO poisoning', 'generator indoors headache', 'everyone headache same time', 'charcoal indoors burning', 'car engine running indoors', 'multiple people sick same room'],
  steps: [
    'Get everyone out of the building immediately',
    'Do NOT re-enter for any reason',
    'Fresh air is the treatment — get as much as possible',
    'If person is unconscious — CPR if needed, keep in fresh air',
    'CO is odorless and colorless — if multiple people feel sick simultaneously indoors, suspect CO',
  ],
  doNot: [
    'Do NOT re-enter building',
    'Do NOT assume fresh air means person is fine — CO can cause delayed effects',
  ],
  timeCritical: true,
},

// ============ EYE / WOUND ============
{
  id: 'WOUND_001',
  title: 'Eye Injury / Foreign Object in Eye',
  severity: 'URGENT',
  keywords: ['eye injury', 'something in eye', 'eye chemical', 'dust in eye', 'eye bleeding', 'eye pain cannot open', 'object stuck in eye'],
  steps: [
    'Do not rub the eye',
    'For dust/small particles — blink rapidly or flush with clean water from inner corner outward',
    'For chemical — flush with large amounts of clean water for 20 minutes, hold eye open',
    'For embedded object — do NOT remove, cover both eyes with soft cloth and keep still',
    'Covering BOTH eyes reduces eye movement which prevents further damage',
  ],
  doNot: [
    'Do NOT rub the eye',
    'Do NOT try to remove embedded objects',
    'Do NOT use cotton wool on eye',
  ],
  timeCritical: false,
},
{
  id: 'WOUND_002',
  title: 'Amputation / Severed Limb',
  severity: 'CRITICAL',
  keywords: ['severed limb', 'amputation', 'finger cut off', 'limb cut off', 'body part severed', 'machinery accident amputation'],
  steps: [
    'Control bleeding at stump — firm direct pressure, tourniquet if needed',
    'Keep tourniquet if applied — note time, do not remove',
    'Preserve severed part: wrap in clean damp cloth, place in plastic bag, place bag in ice water (do not let tissue touch ice directly)',
    'Keep both person and severed part cool',
    'Lay person flat to prevent shock',
    'Do not clean the severed part — wrap as is',
  ],
  doNot: [
    'Do NOT put severed part directly on ice',
    'Do NOT clean or scrub severed part',
    'Do NOT delay treating shock',
  ],
  timeCritical: true,
},

// ============ MENTAL HEALTH CRISIS ============
{
  id: 'MENTAL_001',
  title: 'Panic Attack',
  severity: 'STABLE',
  keywords: ['panic attack', 'anxiety attack', 'cannot breathe anxiety', 'heart racing fear', 'feeling of dying anxiety', 'trembling shaking anxiety', 'sudden intense fear'],
  steps: [
    'Stay calm yourself — your calmness transfers to them',
    'Speak slowly and clearly: "You are safe. This will pass. Breathe with me."',
    'Guide breathing: breathe in for 4 counts, hold 4, out for 6 counts',
    'Move to quiet location if possible — reduce stimulation',
    'Do not minimize their experience — it feels very real',
    'Stay with them until it passes — usually 5-20 minutes',
  ],
  doNot: [
    'Do NOT say "calm down" or "it\'s nothing"',
    'Do NOT leave them alone',
    'Do NOT crowd around them',
  ],
  timeCritical: false,
},

// ============ PUBLIC THREATS & VIOLENCE ============
{
  id: 'THREAT_001',
  title: 'Stalking / Being Followed',
  severity: 'URGENT',
  keywords: ['stalking', 'being followed', 'person following me', 'suspicious person behind me', 'creep following', 'followed late night'],
  steps: [
    'Do not go home or to a secluded area',
    'Walk quickly to a crowded public place (shop, restaurant, mall)',
    'Change your pace and cross the street to confirm they are following',
    'Call a trusted friend or family member and keep them on the phone',
    'Take a photo or note the appearance of the person discreetly',
    'If they persist or approach, shout loudly and ask bystanders for help'
  ],
  doNot: [
    'Do NOT confront the person directly',
    'Do NOT walk into empty alleys or parks',
    'Do NOT go to your house'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_002',
  title: 'Dog Attack / Chase',
  severity: 'URGENT',
  keywords: ['dog attack', 'street dog chase', 'dog biting', 'pack of dogs chasing', 'aggressive dog', 'dog bite'],
  steps: [
    'Stop moving immediately — running triggers their prey drive',
    'Avoid direct eye contact with the dog',
    'Turn slightly sideways and keep your hands in fists to protect fingers',
    'Speak in a firm, deep voice (e.g., "NO", "GO HOME")',
    'If attacked, use an object (bag, jacket) to put between you and the dog',
    'If knocked down, curl into a ball and protect your head, neck, and ears with your arms'
  ],
  doNot: [
    'Do NOT run away or scream',
    'Do NOT kick or hit the dog unless actively being mauled',
    'Do NOT stare into the dog\'s eyes'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_003',
  title: 'Mob Violence / Lynching Threat',
  severity: 'CRITICAL',
  keywords: ['mob lynching', 'crowd violence', 'angry mob chasing', 'riot', 'people attacking me', 'mob justice', 'surrounded by angry people'],
  steps: [
    'Do not run if already surrounded — sudden movement provokes attack',
    'Keep your hands visible and open',
    'Speak calmly and respectfully; avoid arguing or raising your voice',
    'Look for authority figures (police, elders, security guards) and move toward them',
    'If physical attack starts, protect your head and neck at all costs',
    'Seek refuge in a secure building (bank, police station, large store) if an escape path is open'
  ],
  doNot: [
    'Do NOT record the mob with your phone',
    'Do NOT argue, threaten, or fight back against multiple people',
    'Do NOT make sudden aggressive movements'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_004',
  title: 'Pickpocketing / Theft',
  severity: 'STABLE',
  keywords: ['pickpocket', 'wallet stolen', 'phone snatched', 'stolen on train', 'bus theft', 'robbed in crowd'],
  steps: [
    'Check if you have other valuables still on you and secure them immediately',
    'Alert people around you loudly: "My wallet/phone was just stolen!"',
    'Do not blindly chase the thief into an unfamiliar or crowded area',
    'Immediately block your bank cards and SIM card using another phone',
    'Report the incident to the transport authority (railway police) or local station',
    'Write down the exact time, location, and description of the suspect if seen'
  ],
  doNot: [
    'Do NOT chase a thief into an isolated area',
    'Do NOT physically engage if they are armed',
    'Do NOT delay blocking your cards'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_005',
  title: 'Acid Attack Threat / Attack',
  severity: 'CRITICAL',
  keywords: ['acid attack', 'thrown acid', 'burning liquid thrown', 'chemical thrown on face', 'acid threat'],
  steps: [
    'If threatened with acid, turn your back, protect your face, and run to a crowded area',
    'If acid is thrown: IMMEDIATELY flood the area with massive amounts of clean water',
    'Keep pouring water continuously for at least 30-45 minutes',
    'Remove contaminated clothing and jewelry quickly while flushing with water',
    'Ensure contaminated water does not run into healthy areas (e.g., wash away from eyes)',
    'Call an ambulance immediately'
  ],
  doNot: [
    'Do NOT wipe the acid with a cloth (it rubs it deeper)',
    'Do NOT use milk, oil, butter, or neutralizing chemicals',
    'Do NOT pull clothing over the head'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_006',
  title: 'Trapped in Elevator',
  severity: 'URGENT',
  keywords: ['elevator stuck', 'lift stuck', 'trapped in lift', 'no ventilation elevator', 'stuck in elevator no signal'],
  steps: [
    'Stay calm — elevators have backup brakes and will not free-fall',
    'Press the emergency call or alarm button multiple times',
    'If no response, bang on the door and shout for help',
    'Do not try to pry the doors open or climb out of the hatch',
    'If it is hot and stuffy, sit on the floor (air is cooler) and breathe slowly',
    'Use your phone flashlight sparingly to conserve battery'
  ],
  doNot: [
    'Do NOT try to pry the doors open and climb out',
    'Do NOT jump inside the elevator',
    'Do NOT use a lighter or match (consumes oxygen)'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_007',
  title: 'Locked in Hot Car',
  severity: 'CRITICAL',
  keywords: ['locked in car summer', 'child stuck in hot car', 'trapped in car heat', 'car doors wont open heat'],
  steps: [
    'If you are trapped: Unlock doors manually from inside or try rolling down windows',
    'If electronic locks fail, use a heavy object (seatbelt buckle, headrest peg) to break a side window',
    'Break the side window in the lower corner, not the center',
    'If a child/pet is trapped inside: Cover the windshield with a blanket to reduce heat',
    'If the child is unresponsive, break the window farthest from them immediately',
    'Call emergency services right away'
  ],
  doNot: [
    'Do NOT break the windshield (it is shatterproof glass)',
    'Do NOT wait for a locksmith if the person inside is sweating heavily or lethargic',
    'Do NOT leave the person alone'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_008',
  title: 'Severe Food Poisoning',
  severity: 'URGENT',
  keywords: ['food poisoning', 'ate roadside stall sick', 'severe vomiting diarrhea', 'stomach pain after eating', 'food infection'],
  steps: [
    'Stop eating solid foods for a few hours to let your stomach settle',
    'Sip small amounts of water or oral rehydration solution (ORS) frequently',
    'Do not take anti-diarrheal medication unless prescribed (your body is flushing toxins)',
    'Rest as much as possible',
    'If vomiting prevents keeping liquids down for 12+ hours, seek IV fluids',
    'Watch for signs of severe dehydration: dry mouth, no urination, dizziness'
  ],
  doNot: [
    'Do NOT drink large amounts of water at once (will cause vomiting)',
    'Do NOT take anti-diarrhea pills immediately',
    'Do NOT consume dairy, caffeine, or spicy foods'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_009',
  title: 'Electric Shock (Monsoon / Loose Wire)',
  severity: 'CRITICAL',
  keywords: ['electric shock monsoon', 'loose wire shock', 'water electrocution', 'stepped on live wire', 'street lamp shock'],
  steps: [
    'DO NOT touch the person if they are still in contact with the wire or electrified water',
    'Do NOT step into the puddle or water where the person was shocked',
    'Find a dry, non-conductive object (wooden stick, plastic pipe, dry cloth) to push the wire away',
    'Call emergency services and electricity board to cut power',
    'Once separated from current, check breathing and begin CPR if necessary',
    'Keep the person still and treat any visible burns with clean bandages'
  ],
  doNot: [
    'Do NOT touch the victim with bare hands',
    'Do NOT use wet or metal objects to separate the wire',
    'Do NOT walk through flooded streets near fallen poles'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_010',
  title: 'Building Collapse (Monsoon / Poor Construction)',
  severity: 'CRITICAL',
  keywords: ['building collapse', 'roof falling', 'house collapsed rain', 'trapped in debris', 'structural failure'],
  steps: [
    'If inside during collapse: Get under a sturdy desk or table, or stand in an interior doorway',
    'Cover your head and neck with your arms',
    'If trapped: Do not light a match. Cover your mouth with clothing to prevent dust inhalation',
    'Tap on a pipe or wall rhythmically so rescuers can hear you',
    'Shout only as a last resort to avoid inhaling dangerous dust',
    'If outside: Run away from the building and avoid power lines'
  ],
  doNot: [
    'Do NOT use elevators if the building is failing',
    'Do NOT move heavy debris yourself if trapped',
    'Do NOT use open flames'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_011',
  title: 'Boat Capsizing',
  severity: 'CRITICAL',
  keywords: ['boat capsize', 'boat sinking river', 'fell off boat', 'ferry flipped', 'boat accident pilgrimage'],
  steps: [
    'Grab a life jacket, floating cushion, or any buoyant debris immediately',
    'Swim away from the sinking boat to avoid being pulled under',
    'If trapped underneath, feel for the edge or look for light and swim toward it',
    'Do not waste energy panicking or swimming against strong currents',
    'Float on your back and tread water to conserve energy',
    'Stay together with other survivors'
  ],
  doNot: [
    'Do NOT try to save heavy luggage or valuables',
    'Do NOT swim against a strong current',
    'Do NOT swallow river water if possible'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_012',
  title: 'Stampede in Crowd',
  severity: 'CRITICAL',
  keywords: ['stampede', 'crushed in crowd', 'temple stampede', 'railway station rush', 'panic in crowd', 'cannot breathe in crowd'],
  steps: [
    'Keep your hands up by your chest like a boxer to protect your ribcage and breathing space',
    'Go with the flow of the crowd, do not push against it',
    'Stay on your feet at all costs',
    'If you drop something, leave it — bending down is lethal',
    'If you fall, curl into a tight ball, cover your head, and try to get up immediately',
    'Look for gaps and try to move diagonally toward the edge of the crowd'
  ],
  doNot: [
    'Do NOT push against the crowd movement',
    'Do NOT bend down to pick anything up',
    'Do NOT stand near walls, fences, or bottlenecks'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_013',
  title: 'Gas Cylinder Leak / Kitchen Fire',
  severity: 'CRITICAL',
  keywords: ['LPG leak', 'gas cylinder smell', 'kitchen fire', 'hissing gas cylinder', 'cooking gas blast'],
  steps: [
    'Immediately turn off the regulator valve on the cylinder',
    'Open all doors and windows to ventilate the area',
    'Do not switch ANY electrical appliances or lights on OR off (sparks cause explosions)',
    'Do not light matches or use mobile phones inside the kitchen',
    'Evacuate the house and call emergency services from outside',
    'If the cylinder is already on fire, evacuate immediately — do NOT try to extinguish it with water'
  ],
  doNot: [
    'Do NOT operate electrical switches',
    'Do NOT use exhaust fans to clear the gas',
    'Do NOT throw water on a burning gas cylinder'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_014',
  title: 'Tree Fallen on Vehicle / Person',
  severity: 'CRITICAL',
  keywords: ['tree fell on car', 'crushed by tree', 'storm tree fell', 'trapped under branch'],
  steps: [
    'If in a car: Check for downed power lines before exiting. If lines are touching the car, STAY INSIDE.',
    'If safe to exit, climb out carefully and move away from the tree',
    'If a person is trapped: Do NOT attempt to lift heavy trunks alone (shifting it may crush them further)',
    'Check the person\'s breathing and bleeding',
    'Call emergency services and forestry/fire department immediately',
    'Clear small debris from around their face to ensure they can breathe'
  ],
  doNot: [
    'Do NOT exit the car if power lines are involved',
    'Do NOT use an axe or chainsaw near a trapped person without professional help',
    'Do NOT move a person with suspected spinal injuries'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_015',
  title: 'Kidnapping Attempt',
  severity: 'CRITICAL',
  keywords: ['kidnapping attempt', 'abduction', 'grabbed by stranger', 'trying to take child', 'forced into car'],
  steps: [
    'Make maximum noise: SCREAM "Fire!" or "Help, kidnapping!" (people respond faster to "Fire")',
    'Drop your weight to the ground and go completely limp (dead weight is very hard to carry)',
    'Fight back aggressively: aim for eyes, throat, and groin',
    'If forced into a car trunk, kick out the taillights and wave your hand through the hole',
    'Leave behind items (bag, shoes) to create a trail of evidence',
    'If a child is grabbed, grab the child back and attack the kidnapper fiercely'
  ],
  doNot: [
    'Do NOT go quietly to a secondary location (your chances of survival drop drastically)',
    'Do NOT negotiate during the physical grab',
    'Do NOT worry about being polite'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_016',
  title: 'Lost Child in Crowd',
  severity: 'URGENT',
  keywords: ['lost child', 'missing kid crowd', 'child separated in market', 'lost in kumbh mela', 'cannot find son daughter'],
  steps: [
    'Do not panic and do not run randomly. Stay near the spot where you last saw them for a few minutes',
    'Shout their name loudly, along with a description (e.g., "Looking for a boy in a red shirt!")',
    'Alert security guards, police, or announcement desks immediately',
    'Show a recent photo of the child to people around you',
    'If the child was taught to go to a landmark or a police officer, check those locations',
    'Assign specific people to search specific directions'
  ],
  doNot: [
    'Do NOT leave the venue entirely',
    'Do NOT assume they went home',
    'Do NOT wait hours to notify the police'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_017',
  title: 'Fake Police / Toll Scam',
  severity: 'STABLE',
  keywords: ['fake police', 'scammed by cops', 'highway toll scam', 'extortion on road', 'fake official demanding money'],
  steps: [
    'Stay inside your locked vehicle and only roll down the window slightly',
    'Politely ask for their ID card and note their name and badge number',
    'Tell them you are calling the local police station or a lawyer to verify',
    'Do not hand over your original documents; show them through the glass or give copies',
    'If they become aggressive or try to enter the car, start recording video',
    'If on a dark highway, drive slowly to the nearest well-lit public area or petrol pump before stopping'
  ],
  doNot: [
    'Do NOT unlock your doors or exit the vehicle in a secluded area',
    'Do NOT hand over original ID/RC unless at a formal checkpoint',
    'Do NOT pay bribes or "fines" without a formal receipt'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_018',
  title: 'Hit-and-Run Victim',
  severity: 'CRITICAL',
  keywords: ['hit and run', 'struck by car', 'bus hit pedestrian', 'auto rickshaw accident', 'run over by vehicle'],
  steps: [
    'Note the vehicle\'s number plate, color, and model immediately (or ask bystanders to)',
    'Do not move the victim if they have suspected spinal or neck injuries',
    'Check for severe bleeding and apply direct pressure',
    'Call an ambulance and police immediately',
    'If moving them is absolutely necessary (e.g., burning car), move them as a log-roll',
    'Take photos of the scene, skid marks, and vehicle debris'
  ],
  doNot: [
    'Do NOT chase the fleeing vehicle yourself',
    'Do NOT move an injured victim unless in immediate danger',
    'Do NOT give the victim water'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_019',
  title: 'Fire in Slum / High-Rise',
  severity: 'CRITICAL',
  keywords: ['slum fire', 'high rise fire', 'apartment fire', 'massive fire building', 'fire spreading fast'],
  steps: [
    'Alert neighbors immediately by shouting and banging on doors',
    'Evacuate immediately — do not try to gather belongings',
    'If in a high-rise, use stairs, NEVER the elevator',
    'Crawl low under smoke to avoid toxic gas inhalation',
    'In a slum, move perpendicular to the wind direction to escape spreading flames',
    'If trapped, seal door gaps with wet cloth, go to a balcony/window, and wave brightly colored cloth'
  ],
  doNot: [
    'Do NOT use elevators',
    'Do NOT run if your clothes catch fire (Stop, Drop, and Roll)',
    'Do NOT throw water on electrical fires'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_020',
  title: 'Monkey Attack',
  severity: 'URGENT',
  keywords: ['monkey attack', 'macaque biting', 'monkey stole bag', 'chased by monkeys', 'aggressive monkeys hill station'],
  steps: [
    'Do not make eye contact, bare your teeth, or smile (monkeys see teeth as a threat)',
    'Do not panic or run; back away slowly and smoothly',
    'If they grab your bag or food, LET IT GO. Do not fight them for it',
    'Show your empty hands to prove you have no food',
    'If bitten or scratched, wash the wound with soap and water immediately for 15 minutes',
    'Seek medical attention immediately for Rabies and Tetanus shots'
  ],
  doNot: [
    'Do NOT smile or show teeth',
    'Do NOT fight them for stolen items',
    'Do NOT hit them with sticks (it aggravates the troop)'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_021',
  title: 'Snake in Home / Car',
  severity: 'URGENT',
  keywords: ['snake in house', 'cobra in car', 'snake under bed', 'found snake', 'venomous snake room'],
  steps: [
    'Freeze and slowly back away. Give the snake a clear exit path',
    'Keep children and pets away from the area',
    'If in a room, close the door and block the bottom gap with a rolled-up towel',
    'If in a car, pull over safely, exit the vehicle, and leave the doors open',
    'Call local snake rescuers, forest department, or fire brigade',
    'Keep an eye on the snake from a safe distance so you know where it is hiding'
  ],
  doNot: [
    'Do NOT try to hit, kill, or capture the snake',
    'Do NOT throw water or chemicals at it',
    'Do NOT assume a small snake is harmless'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_022',
  title: 'Road Rage Assault',
  severity: 'URGENT',
  keywords: ['road rage', 'angry driver fighting', 'attacked on road', 'pulled out of car', 'driver assault', 'highway fight'],
  steps: [
    'Do not engage, shout back, or make obscene gestures',
    'Keep your windows rolled up and doors locked',
    'If followed, do not drive home. Drive to a police station, hospital, or crowded petrol pump',
    'Use your phone to record the incident and note their license plate',
    'If they block your car and approach on foot, honk continuously to attract attention',
    'Call the police immediately'
  ],
  doNot: [
    'Do NOT step out of your vehicle',
    'Do NOT drive home',
    'Do NOT try to ram their vehicle'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_023',
  title: 'Followed by Suspicious Bike',
  severity: 'URGENT',
  keywords: ['followed by bike', 'men on motorcycle trailing', 'suspicious bikers', 'chased by bike late night'],
  steps: [
    'Do not panic. Maintain a steady speed and do not take isolated shortcuts',
    'Make four right turns (a complete circle) to confirm you are being followed',
    'Drive to a well-lit, crowded area, police station, or 24/7 petrol pump',
    'Do not stop your vehicle under any circumstances',
    'Call emergency contacts or police, keep them on speakerphone',
    'If they try to block you, honk continuously and drive on the wrong side or over a median if absolutely necessary to escape'
  ],
  doNot: [
    'Do NOT drive home',
    'Do NOT stop at red lights on deserted roads if you are being actively chased',
    'Do NOT exit your vehicle'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_024',
  title: 'Stuck in Floodwater (Underpass)',
  severity: 'CRITICAL',
  keywords: ['car stuck in flood', 'trapped in underpass water', 'vehicle sinking rain', 'drowning inside car'],
  steps: [
    'Unbuckle seatbelts and unlock doors immediately before the electrical system shorts out',
    'Roll down the windows as soon as water touches the door. Do not wait',
    'If windows won\'t roll down, use a heavy object (or headrest peg) to break a side window',
    'Climb out through the window and get to the roof of the car',
    'Do not try to open the door against water pressure — it is nearly impossible',
    'Abandon the car and swim to safety or wait for rescue on the roof'
  ],
  doNot: [
    'Do NOT stay inside waiting for rescue as water rises',
    'Do NOT try to break the windshield',
    'Do NOT try to save belongings'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_025',
  title: 'Drug / Alcohol Overdose',
  severity: 'CRITICAL',
  keywords: ['drug overdose', 'alcohol poisoning', 'passed out party', 'unconscious from drugs', 'blue lips overdose', 'cannot wake up drunk'],
  steps: [
    'Check responsiveness — rub their sternum (chest bone) hard with your knuckles',
    'If unresponsive and breathing, roll them into the recovery position (on their side) to prevent choking on vomit',
    'If breathing is slow, shallow, or stopped, begin CPR',
    'Call an ambulance immediately. Tell them exactly what was taken if known (doctors prioritize saving lives, not policing)',
    'Do not let them "sleep it off" if they are unresponsive',
    'Stay with them and monitor breathing constantly'
  ],
  doNot: [
    'Do NOT let them "sleep it off"',
    'Do NOT put them in a cold shower',
    'Do NOT try to make them vomit'
  ],
  timeCritical: true,
},

{
  id: 'THREAT_026',
  title: 'Phone Snatching',
  severity: 'STABLE',
  keywords: ['phone snatched', 'mobile stolen street', 'bike snatched phone', 'robbed on road', 'snatching while using it'],
  steps: [
    'Do not chase the bike or try to grab them — they may be armed',
    'Memorize the bike color, make, and license plate number if possible',
    'Ask a bystander to let you use their phone to call your carrier and block the SIM',
    'Use Find My Device from another phone to lock/erase the device immediately',
    'File an e-FIR or visit the nearest police station to report the theft',
    'Change your email and banking passwords as soon as you have secure internet access'
  ],
  doNot: [
    'Do NOT chase the thieves on foot or another vehicle',
    'Do NOT delay blocking your banking apps',
    'Do NOT call your own phone and negotiate'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_027',
  title: 'Bull / Animal Charge',
  severity: 'URGENT',
  keywords: ['bull charging', 'cow attacking', 'stray bull festival', 'animal charge city road'],
  steps: [
    'Do not run straight away — Bulls are faster than humans',
    'Sidestep quickly at the last second (like a matador) rather than outrunning it',
    'Look for a solid barrier (car, tree, wall, gate) and put it between you and the animal',
    'If no barrier exists, throw an object (bag, jacket, hat) away from you to distract it',
    'If knocked down, curl into a tight ball and protect your head and neck',
    'Do not make sudden loud noises that might further agitate the animal'
  ],
  doNot: [
    'Do NOT run in a straight line away from the animal',
    'Do NOT wave your arms or shout directly at it',
    'Do NOT try to hit the animal to scare it away'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_028',
  title: 'Roof / Structure Collapse',
  severity: 'CRITICAL',
  keywords: ['roof leaking heavily', 'ceiling collapsed', 'monsoon roof falling', 'house cracking heavy rain'],
  steps: [
    'Evacuate the structure immediately at the first sign of severe sagging, cracking sounds, or major leaks',
    'Turn off the main electrical breaker before leaving if it is safe and quick to do so',
    'If the roof begins to fall while you are inside, get under a sturdy desk or table',
    'Protect your head and neck with your arms',
    'Once outside, do not stand near the exterior walls of the failing structure',
    'Call emergency services and alert neighbors in adjoining structures'
  ],
  doNot: [
    'Do NOT stay inside to save belongings or try to catch leaks with buckets if the structure is groaning',
    'Do NOT re-enter the building until inspected by professionals',
    'Do NOT use electrical appliances if the roof is leaking heavily'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_029',
  title: 'Electric Pole Fallen on Car',
  severity: 'CRITICAL',
  keywords: ['electric pole fell car', 'live wire on car', 'storm wire vehicle', 'power line hit car'],
  steps: [
    'STAY INSIDE THE CAR. The rubber tires insulate the vehicle. You are safe inside',
    'Do not touch any metal parts of the car\'s interior',
    'Call emergency services and tell them a live wire is on your vehicle',
    'Warn anyone approaching to stay far away',
    'ONLY IF THE CAR IS ON FIRE: You must jump out without touching the car and the ground at the same time',
    'To jump out: open door, stand on the edge, jump clear, land with both feet together, and shuffle away without lifting your feet'
  ],
  doNot: [
    'Do NOT step out of the car with one foot while touching the car with your hand',
    'Do NOT allow anyone to touch the outside of the car to help you',
    'Do NOT try to push the wire away'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_030',
  title: 'Locked in Public Toilet',
  severity: 'URGENT',
  keywords: ['locked in public toilet', 'stuck in bathroom', 'toilet door jammed', 'no signal inside washroom'],
  steps: [
    'Stay calm and conserve your energy and oxygen if the space is small',
    'Check if the hinges are on the inside; if so, you might be able to remove the hinge pins with a key or coin',
    'If the door opens inward, pulling it won\'t work. Look for a gap under the door to slide a message out',
    'Bang on the door and shout for help at intervals (e.g., every 5 minutes) rather than constantly',
    'If there is a window or vent, try to reach it to call for help',
    'Do not panic-kick the door unless you are strong enough to break the lock/frame; you may injure yourself'
  ],
  doNot: [
    'Do NOT exhaust yourself by screaming continuously',
    'Do NOT try to climb out of small windows if you might get stuck',
    'Do NOT panic; someone will eventually use the facility'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_031',
  title: 'Firecracker Burn Injury',
  severity: 'URGENT',
  keywords: ['firecracker burn', 'diwali burn', 'rocket hit eye', 'cracker burst in hand'],
  steps: [
    'Cool the burn immediately with running tap water for at least 20 minutes',
    'Remove any rings or tight items from the affected area before swelling begins',
    'Cover the burn loosely with a clean, dry, non-fluffy cloth or cling film',
    'If a cracker bursts near the eye, DO NOT wash it. Cover both eyes and seek immediate medical help',
    'If fingers are severely injured or amputated, wrap them in clean cloth, place in a plastic bag, and put the bag on ice',
    'Seek medical attention for any deep burn, face burn, or blast injury'
  ],
  doNot: [
    'Do NOT apply ice, butter, toothpaste, or ink to the burn',
    'Do NOT pop any blisters that form',
    'Do NOT rub the eye if hit by a spark'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_032',
  title: 'Fell into Manhole / Drain',
  severity: 'CRITICAL',
  keywords: ['fell into manhole', 'open drain fall', 'stuck in sewer', 'swept away in gutter', 'uncovered manhole'],
  steps: [
    'Try to grab onto the edge or any ladder/rung immediately',
    'Shout for help loudly. Sewers contain toxic gases (methane, hydrogen sulfide) so rescue must be fast',
    'If swept into a drain by water, try to protect your head and grab any stationary object',
    'Keep your head above water and avoid swallowing the highly contaminated water',
    'If you are above water but trapped, do not light a match or lighter (risk of gas explosion)',
    'Once rescued, seek immediate medical attention for cuts and potential severe infections'
  ],
  doNot: [
    'Do NOT use lighters or matches due to explosive sewer gases',
    'Do NOT let go of a hold if you have one',
    'Do NOT delay getting a tetanus shot and antibiotics after rescue'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_033',
  title: 'Bus / Train Brake Failure',
  severity: 'CRITICAL',
  keywords: ['bus brake failure', 'train derailed', 'vehicle out of control', 'driver lost brakes', 'missing track train'],
  steps: [
    'Hold on tightly to fixed, sturdy parts of the vehicle (seat frames, handrails)',
    'Brace for impact: Put your head down between your knees and cover the back of your head with your hands',
    'If standing, wedge yourself between seats or hold on with both hands and bend your knees slightly',
    'Do not jump from a fast-moving vehicle; the impact with the ground is often fatal',
    'Wait until the vehicle comes to a complete stop before attempting to evacuate',
    'Once stopped, exit quickly but calmly, watching for oncoming traffic or fires'
  ],
  doNot: [
    'Do NOT jump out of the moving vehicle',
    'Do NOT stand up or move around the cabin',
    'Do NOT panic and push others during evacuation'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_034',
  title: 'Child in Borewell',
  severity: 'CRITICAL',
  keywords: ['child in borewell', 'kid fell in open well', 'trapped in deep hole', 'borewell rescue', 'falling in borewell'],
  steps: [
    'Call emergency services, police, and disaster response forces IMMEDIATELY. This requires specialized equipment',
    'Do NOT attempt to lower a rope for the child to grab unless they are old enough to tie it securely around themselves',
    'Lower an oxygen tube or air pipe down the hole if available (compressor hose, medical oxygen)',
    'Do not throw food or large items down the hole that could block the airway or hit the child',
    'Keep the crowd away from the edge to prevent soil from caving in on the child',
    'Communicate with the child constantly to keep them awake and calm'
  ],
  doNot: [
    'Do NOT let untrained people try to climb down',
    'Do NOT crowd the edge of the hole',
    'Do NOT drop anything heavy down the hole'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_035',
  title: 'Gas Poisoning (Room Heater)',
  severity: 'CRITICAL',
  keywords: ['carbon monoxide heater', 'generator gas poisoning', 'coal heater indoors', 'winter gas poisoning', 'waking up dizzy gas'],
  steps: [
    'If you feel dizzy, nauseous, or have a headache while using a heater, leave the room IMMEDIATELY',
    'Open all doors and windows to let fresh air in',
    'Turn off the heater, generator, or coal fire ONLY if you can do so safely on the way out',
    'Get everyone out into fresh open air',
    'If someone is unconscious, drag them to fresh air and begin CPR if they are not breathing',
    'Call an ambulance. Carbon monoxide poisoning requires pure oxygen treatment'
  ],
  doNot: [
    'Do NOT ignore symptoms assuming you are just tired',
    'Do NOT stay in the room to try and fix the heater',
    'Do NOT assume opening one small window is enough ventilation for a coal/gas heater'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_036',
  title: 'Bee / Wasp Swarm Attack',
  severity: 'URGENT',
  keywords: ['swarm of bees', 'wasp attack', 'chased by bees', 'hornet attack', 'multiple bee stings', 'chased by wasp'],
  steps: [
    'Run away immediately in a straight line. Do not flail your arms',
    'Cover your face and head with your shirt or jacket as you run',
    'Seek shelter in a fully enclosed space (car, building) and shut the doors/windows',
    'Do NOT jump into water — bees will wait for you to come up for air',
    'Once safe, scrape stingers off with a fingernail or credit card. Do not pinch them',
    'Watch for signs of severe allergic reaction (anaphylaxis) like throat swelling or difficulty breathing'
  ],
  doNot: [
    'Do NOT stand still and swat at them',
    'Do NOT jump into a pool or river',
    'Do NOT pinch stingers to pull them out (it squeezes more venom in)'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_037',
  title: 'Auto / Cab Hijacking',
  severity: 'CRITICAL',
  keywords: ['cab hijacking', 'auto rickshaw kidnapped', 'driver took wrong route', 'strangers entered cab', 'taxi kidnapping'],
  steps: [
    'If the driver deviates from the route or strangers enter the vehicle, demand to stop immediately',
    'If they refuse, share your live location with a contact and dial the police emergency number',
    'Make a scene: scream, honk the horn, or try to steer the vehicle into a minor curb to force a stop',
    'If the vehicle is moving slowly, be prepared to jump out, tucking and rolling',
    'Use whatever you have as a weapon (keys, pen, deodorant spray) aimed at eyes and throat',
    'Do not agree to go to an ATM or a secondary location quietly'
  ],
  doNot: [
    'Do NOT stay silent and hope it\'s a mistake',
    'Do NOT go to a secondary location',
    'Do NOT surrender your phone unless physically forced'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_038',
  title: 'Celebratory Firing Injury',
  severity: 'CRITICAL',
  keywords: ['celebratory firing hit', 'stray bullet injury', 'shot at wedding', 'bullet wound accident', 'hit by bullet'],
  steps: [
    'Take cover immediately to avoid further stray bullets',
    'Call an ambulance and police right away',
    'Apply firm, direct pressure to the bleeding wound with a clean cloth',
    'If the wound is on a limb and bleeding heavily, apply a tourniquet above the wound',
    'Keep the victim calm and still to slow their heart rate and bleeding',
    'Do not try to remove the bullet'
  ],
  doNot: [
    'Do NOT try to extract the bullet',
    'Do NOT give the victim anything to eat or drink',
    'Do NOT move the victim unless the location is unsafe'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_039',
  title: 'Lost in Jungle / Forest',
  severity: 'URGENT',
  keywords: ['lost in forest', 'trekking lost', 'jungle no gps', 'cannot find way back trekking', 'lost in wild'],
  steps: [
    'S.T.O.P. — Stop, Think, Observe, Plan. Do not run blindly',
    'Stay in one place if you believe someone knows where you are and will look for you',
    'If you must move, follow water downstream (it usually leads to civilization)',
    'Make yourself visible/audible: wear bright colors, blow a whistle, make a smoky fire if safe',
    'Build a shelter before dark and stay off the cold ground',
    'Do not eat unknown plants or berries, no matter how hungry you are'
  ],
  doNot: [
    'Do NOT keep walking aimlessly, especially at night',
    'Do NOT eat unknown plants or mushrooms',
    'Do NOT try to follow animal trails (they don\'t lead to humans)'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_040',
  title: 'Heart Attack in Traffic Jam',
  severity: 'CRITICAL',
  keywords: ['heart attack traffic jam', 'medical emergency stuck on road', 'chest pain in car', 'ambulance no access heart attack'],
  steps: [
    'Have the person chew an adult aspirin (325mg) if they are conscious and not allergic',
    'Turn on hazard lights and honk continuously to alert surrounding drivers and traffic police',
    'Call emergency services and tell them your exact location in the jam',
    'If you cannot move forward, try to pull to the extreme left/shoulder',
    'If the person loses consciousness and stops breathing, recline the seat fully and begin CPR immediately inside the car, or pull them out onto the road if safe',
    'Ask bystanders on bikes for help to clear a path or fetch a nearby doctor'
  ],
  doNot: [
    'Do NOT wait quietly in traffic',
    'Do NOT give water or food',
    'Do NOT leave the person alone'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_041',
  title: 'Severe Food Allergy (Street Food)',
  severity: 'CRITICAL',
  keywords: ['allergic reaction street food', 'peanut allergy reaction', 'seafood allergy throat closing', 'swelling after eating streetfood'],
  steps: [
    'Use an EpiPen immediately if the person has one. Inject into the outer thigh',
    'Call an ambulance right away. Emphasize it is anaphylaxis',
    'Lay the person flat and raise their legs to combat shock',
    'If they are having trouble breathing, let them sit up slightly to breathe easier',
    'If they stop breathing, begin CPR',
    'Even if they improve after the EpiPen, they MUST go to the hospital (symptoms can return)'
  ],
  doNot: [
    'Do NOT wait to see if it gets worse before using the EpiPen',
    'Do NOT assume an antihistamine (like Allegra/Benadryl) is enough for severe reactions',
    'Do NOT let the person stand up or walk around'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_042',
  title: 'Fire in Cinema / Mall',
  severity: 'CRITICAL',
  keywords: ['cinema fire', 'mall fire', 'crowded building fire', 'smoke in theater', 'fire alarm mall'],
  steps: [
    'Evacuate immediately via the nearest EXIT signs, not necessarily the way you came in',
    'Do not use elevators. Use the fire escape stairs',
    'Stay low to the ground to avoid inhaling toxic smoke',
    'Cover your nose and mouth with a cloth, preferably wet',
    'Move quickly but calmly. Do not push in the stairs (prevents stampedes)',
    'Once outside, move far away from the building to allow fire trucks access'
  ],
  doNot: [
    'Do NOT use the elevator',
    'Do NOT try to finish your movie or meal',
    'Do NOT go to the roof unless stairs down are completely impassable'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_043',
  title: 'Drowning in Pool / River',
  severity: 'CRITICAL',
  keywords: ['drowning pool', 'river drowning', 'swept away picnic', 'struggling in water', 'drowning swimming pool'],
  steps: [
    'Reach or Throw, Don\'t Go: Throw a rope, branch, or floatation device',
    'Do NOT jump in to save them unless you are a trained lifeguard (panicked victims will drown you too)',
    'Once they are out of the water, check for breathing',
    'If not breathing, start CPR immediately (start with 5 rescue breaths for drowning victims)',
    'Keep them warm to prevent hypothermia',
    'Even if they recover, they must see a doctor (dry drowning risk)'
  ],
  doNot: [
    'Do NOT jump in the water if you are not a trained rescuer',
    'Do NOT try to push water out of their stomach',
    'Do NOT assume they are fine if they cough up water and seem okay'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_044',
  title: 'Gas Station Fire',
  severity: 'CRITICAL',
  keywords: ['petrol pump fire', 'gas station fire', 'car caught fire refueling', 'fuel fire', 'gas station caught fire'],
  steps: [
    'Leave the area immediately. Run far away from the pumps',
    'Hit the emergency shut-off button if it is safely within reach on your way out',
    'Do NOT try to pull the fuel nozzle out of the car if the fire is at the nozzle (this will spray burning fuel everywhere)',
    'Call the fire department immediately',
    'If you are in your car and the pump catches fire, abandon the car and run'
  ],
  doNot: [
    'Do NOT pull the nozzle out of the car',
    'Do NOT try to extinguish a large fuel fire yourself',
    'Do NOT use your phone near the active fire'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_045',
  title: 'Blackmail / Cyber Extortion',
  severity: 'STABLE',
  keywords: ['blackmailed private photos', 'cyber extortion', 'threatened with pictures', 'online scammer demanding money', 'video call scam', 'blackmailer threats'],
  steps: [
    'Do NOT pay the money. Paying guarantees they will ask for more, it does not stop them',
    'Stop all communication with the blackmailer immediately',
    'Take screenshots of all threats, messages, and profiles before blocking them',
    'Deactivate or heavily restrict privacy settings on your social media accounts instantly',
    'Report the incident to the national cyber crime portal or local police cyber cell',
    'Tell a trusted friend or family member for emotional support'
  ],
  doNot: [
    'Do NOT pay the ransom',
    'Do NOT continue talking to them or begging',
    'Do NOT delete the evidence before taking screenshots'
  ],
  timeCritical: false,
},
{
  id: 'THREAT_046',
  title: 'Elevator Free Fall',
  severity: 'CRITICAL',
  keywords: ['elevator falling', 'lift rope snapped', 'lift free fall', 'elevator dropping fast', 'snapped lift rope'],
  steps: [
    'Do not jump. Jumping right before impact is a myth and will likely cause severe head injury',
    'Lie flat on your back on the floor of the elevator if there is space',
    'Cover your face and head with your arms to protect against falling debris from the ceiling',
    'If you cannot lie down, sit on the floor, bend your knees, and hold onto the handrails',
    'Wait for rescue. Do not try to force the doors open after the crash unless there is a fire'
  ],
  doNot: [
    'Do NOT try to jump at the moment of impact',
    'Do NOT stand up straight with locked knees',
    'Do NOT panic-move around'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_047',
  title: 'Suicide Attempt (Jumper)',
  severity: 'CRITICAL',
  keywords: ['suicide attempt', 'person jumping building', 'someone on bridge edge', 'threatening to jump', 'jumping from bridge building'],
  steps: [
    'Call emergency services and police immediately. Request a negotiator',
    'Stay calm and speak to the person in a gentle, non-judgmental tone from a safe distance',
    'Ask for their name and use it. Ask open-ended questions to keep them talking',
    'Do not physically try to grab them unless they are actively slipping and you can do so safely without falling yourself',
    'Keep crowds back and stop anyone from filming or shouting at them',
    'Listen more than you speak. Let them vent their pain'
  ],
  doNot: [
    'Do NOT dare them to jump or say "you won\'t do it"',
    'Do NOT make sudden movements towards them',
    'Do NOT argue about whether their problems are valid'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_048',
  title: 'Followed by Suspicious Car (Night)',
  severity: 'URGENT',
  keywords: ['followed by car night', 'suspicious vehicle trailing', 'chased by car', 'someone following me driving', 'followed by suspicious car'],
  steps: [
    'Lock all doors and keep windows rolled up',
    'Do not drive home. Drive to the nearest police station, hospital, or 24/7 petrol pump',
    'Make four consecutive right turns (a circle) to confirm you are being followed',
    'Call the police and keep them on the line, providing your location and the car\'s description',
    'Stay on main, well-lit roads. Avoid shortcuts or dark alleys',
    'If forced to stop, honk the horn continuously and do not unlock the doors'
  ],
  doNot: [
    'Do NOT drive to your house',
    'Do NOT stop to confront them',
    'Do NOT exit your vehicle'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_049',
  title: 'Child Choking on Coin / Toy',
  severity: 'CRITICAL',
  keywords: ['child choking coin', 'kid swallowed toy', 'toddler choking', 'baby cannot breathe plastic', 'child choking on toy'],
  steps: [
    'If the child can cough or cry, let them try to cough it up. Do not interfere yet',
    'If they cannot breathe, cough, or cry: Stand or kneel behind them',
    'Give 5 firm back blows between the shoulder blades',
    'If object doesn\'t dislodge, give 5 abdominal thrusts (Heimlich maneuver) just above the navel',
    'Alternate 5 back blows and 5 thrusts until the object is out or the child becomes unconscious',
    'If they lose consciousness, begin CPR and check the mouth for the object before rescue breaths'
  ],
  doNot: [
    'Do NOT put your fingers in their mouth unless you can see the object and easily sweep it out',
    'Do NOT hold them upside down by the feet',
    'Do NOT give them water'
  ],
  timeCritical: true,
},
{
  id: 'THREAT_050',
  title: 'Airplane Emergency Landing',
  severity: 'CRITICAL',
  keywords: ['airplane emergency landing', 'flight engine failure', 'plane crash position', 'brace for impact', 'airplane mid flight failure'],
  steps: [
    'Listen strictly to the flight attendants\' instructions',
    'Adopt the brace position: bend forward, rest your head against the seat in front of you, hands over the back of your head',
    'Keep your seatbelt fastened tightly and low across your hips',
    'Memorize the location of the nearest emergency exit (count the rows to it)',
    'Leave ALL luggage behind during evacuation',
    'If there is smoke, stay as low as possible while moving to the exit'
  ],
  doNot: [
    'Do NOT take your bags or luggage',
    'Do NOT unbuckle until the plane comes to a complete stop',
    'Do NOT inflate your life jacket inside the plane (inflate it at the door)'
  ],
  timeCritical: true,
},
]
