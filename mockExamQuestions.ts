// Real-world style INBDE mock exam questions
// Based on actual exam format and high-yield topics

export interface MockExamQuestion {
    id: number;
    subject: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export const MOCK_EXAM_QUESTIONS: MockExamQuestion[] = [
    // Head and Neck Anatomy
    {
        id: 1,
        subject: "Head and Neck Anatomy",
        question: "Which cranial nerve provides sensory innervation to the anterior two-thirds of the tongue for taste?",
        options: ["Trigeminal nerve (CN V)", "Facial nerve (CN VII)", "Glossopharyngeal nerve (CN IX)", "Hypoglossal nerve (CN XII)"],
        correctAnswer: "Facial nerve (CN VII)",
        explanation: "The facial nerve (CN VII) via the chorda tympani provides taste sensation to the anterior two-thirds of the tongue. The trigeminal nerve provides general sensation, while CN IX provides taste to the posterior third."
    },
    {
        id: 2,
        subject: "Head and Neck Anatomy",
        question: "The inferior alveolar nerve block anesthetizes all of the following EXCEPT:",
        options: ["Mandibular teeth on the injected side", "Lower lip on the injected side", "Buccal gingiva of mandibular molars", "Lingual gingiva of mandibular teeth"],
        correctAnswer: "Buccal gingiva of mandibular molars",
        explanation: "The inferior alveolar nerve block does not anesthetize the buccal gingiva of mandibular molars because this area is innervated by the long buccal nerve, which requires a separate injection."
    },
    {
        id: 3,
        subject: "Head and Neck Anatomy",
        question: "Which muscle is NOT a muscle of mastication?",
        options: ["Masseter", "Temporalis", "Lateral pterygoid", "Buccinator"],
        correctAnswer: "Buccinator",
        explanation: "The buccinator is a muscle of facial expression innervated by CN VII. The four muscles of mastication are the masseter, temporalis, medial pterygoid, and lateral pterygoid, all innervated by CN V3."
    },
    {
        id: 4,
        subject: "Head and Neck Anatomy",
        question: "A dental infection spreading from the mandibular third molar is most likely to enter which fascial space first?",
        options: ["Sublingual space", "Submandibular space", "Lateral pharyngeal space", "Parapharyngeal space"],
        correctAnswer: "Submandibular space",
        explanation: "Infections from mandibular third molars typically spread to the submandibular space first because the root apices are usually below the mylohyoid muscle attachment."
    },
    {
        id: 5,
        subject: "Head and Neck Anatomy",
        question: "Which foramen transmits the maxillary division of the trigeminal nerve?",
        options: ["Foramen ovale", "Foramen rotundum", "Foramen spinosum", "Superior orbital fissure"],
        correctAnswer: "Foramen rotundum",
        explanation: "The foramen rotundum transmits V2 (maxillary division). The foramen ovale transmits V3 (mandibular division), and the foramen spinosum transmits the middle meningeal artery."
    },
    {
        id: 6,
        subject: "Head and Neck Anatomy",
        question: "The parotid duct opens into the oral cavity opposite which tooth?",
        options: ["Maxillary first premolar", "Maxillary second premolar", "Maxillary first molar", "Maxillary second molar"],
        correctAnswer: "Maxillary second molar",
        explanation: "Stensen's duct (parotid duct) opens into the vestibule of the oral cavity opposite the maxillary second molar via the parotid papilla."
    },
    {
        id: 7,
        subject: "Head and Neck Anatomy",
        question: "Which nerve exits through the stylomastoid foramen?",
        options: ["Trigeminal nerve", "Facial nerve", "Glossopharyngeal nerve", "Vagus nerve"],
        correctAnswer: "Facial nerve",
        explanation: "The facial nerve (CN VII) exits the skull through the stylomastoid foramen before branching to innervate the muscles of facial expression."
    },
    {
        id: 8,
        subject: "Head and Neck Anatomy",
        question: "The blood supply to the temporomandibular joint is primarily from the:",
        options: ["Internal carotid artery", "External carotid artery", "Superficial temporal artery", "Maxillary artery"],
        correctAnswer: "Superficial temporal artery",
        explanation: "The TMJ receives blood supply primarily from the superficial temporal and maxillary arteries, both branches of the external carotid artery."
    },

    // Pharmacology
    {
        id: 9,
        subject: "Pharmacology",
        question: "What is the maximum recommended dose (MRD) of lidocaine 2% with 1:100,000 epinephrine for a 70 kg adult?",
        options: ["4.4 mg/kg", "7.0 mg/kg", "3.2 mg/kg", "6.6 mg/kg"],
        correctAnswer: "7.0 mg/kg",
        explanation: "The MRD of lidocaine with epinephrine is 7.0 mg/kg (or 500 mg absolute maximum for adults). Without epinephrine, the MRD is 4.4 mg/kg."
    },
    {
        id: 10,
        subject: "Pharmacology",
        question: "Which of the following antibiotics is the drug of choice for dental infections in penicillin-allergic patients?",
        options: ["Erythromycin", "Clindamycin", "Metronidazole", "Tetracycline"],
        correctAnswer: "Clindamycin",
        explanation: "Clindamycin is the preferred antibiotic for dental infections in penicillin-allergic patients due to its excellent bone penetration and coverage of oral flora including anaerobes."
    },
    {
        id: 11,
        subject: "Pharmacology",
        question: "The mechanism of action of local anesthetics involves:",
        options: ["Blocking potassium channels", "Blocking sodium channels", "Activating calcium channels", "Blocking chloride channels"],
        correctAnswer: "Blocking sodium channels",
        explanation: "Local anesthetics work by blocking voltage-gated sodium channels, preventing depolarization and nerve impulse transmission."
    },
    {
        id: 12,
        subject: "Pharmacology",
        question: "Which NSAID is contraindicated in patients with aspirin-exacerbated respiratory disease (AERD)?",
        options: ["Celecoxib", "Acetaminophen", "Ibuprofen", "Tramadol"],
        correctAnswer: "Ibuprofen",
        explanation: "Non-selective NSAIDs like ibuprofen inhibit COX-1 and can trigger severe bronchospasm in AERD patients. Celecoxib (COX-2 selective) is generally safer for these patients."
    },
    {
        id: 13,
        subject: "Pharmacology",
        question: "Antibiotic prophylaxis for infective endocarditis in penicillin-allergic patients should include:",
        options: ["Amoxicillin 2g", "Azithromycin 500mg", "Metronidazole 500mg", "Erythromycin 500mg"],
        correctAnswer: "Azithromycin 500mg",
        explanation: "For penicillin-allergic patients requiring IE prophylaxis, azithromycin 500mg, clarithromycin 500mg, or clindamycin 600mg are recommended alternatives."
    },
    {
        id: 14,
        subject: "Pharmacology",
        question: "Which drug interaction is of greatest concern when prescribing erythromycin?",
        options: ["Increased sedation with benzodiazepines", "Decreased anticoagulant effect with warfarin", "Cardiac arrhythmias with drugs that prolong QT interval", "Decreased efficacy of oral contraceptives"],
        correctAnswer: "Cardiac arrhythmias with drugs that prolong QT interval",
        explanation: "Erythromycin inhibits CYP3A4 and can prolong the QT interval. Combined with other QT-prolonging drugs, this increases the risk of potentially fatal cardiac arrhythmias."
    },
    {
        id: 15,
        subject: "Pharmacology",
        question: "The antidote for opioid overdose is:",
        options: ["Flumazenil", "Naloxone", "Atropine", "Epinephrine"],
        correctAnswer: "Naloxone",
        explanation: "Naloxone is an opioid receptor antagonist that rapidly reverses opioid-induced respiratory depression. Flumazenil is the antidote for benzodiazepine overdose."
    },
    {
        id: 16,
        subject: "Pharmacology",
        question: "A patient on warfarin therapy requires dental extractions. The recommended INR level for safe extraction is:",
        options: ["Less than 2.0", "2.0-3.0", "3.0-4.0", "Greater than 4.0"],
        correctAnswer: "2.0-3.0",
        explanation: "Most dental procedures can be performed safely with INR in the therapeutic range (2.0-3.0). Stopping warfarin increases thromboembolism risk and is generally not recommended for routine dental procedures."
    },

    // Oral Pathology
    {
        id: 17,
        subject: "Oral Pathology",
        question: "Which odontogenic cyst is most likely to recur after treatment?",
        options: ["Dentigerous cyst", "Radicular cyst", "Odontogenic keratocyst", "Lateral periodontal cyst"],
        correctAnswer: "Odontogenic keratocyst",
        explanation: "The odontogenic keratocyst (OKC) has a high recurrence rate (25-60%) due to its thin, friable lining, satellite cysts, and tendency for incomplete removal."
    },
    {
        id: 18,
        subject: "Oral Pathology",
        question: "Which oral lesion has the highest rate of malignant transformation?",
        options: ["Leukoplakia", "Erythroplakia", "Lichen planus", "Oral submucous fibrosis"],
        correctAnswer: "Erythroplakia",
        explanation: "Erythroplakia has the highest malignant transformation rate (91% show dysplasia or carcinoma), significantly higher than leukoplakia (3-5%)."
    },
    {
        id: 19,
        subject: "Oral Pathology",
        question: "The most common location for oral squamous cell carcinoma is:",
        options: ["Dorsal tongue", "Lateral tongue and floor of mouth", "Hard palate", "Buccal mucosa"],
        correctAnswer: "Lateral tongue and floor of mouth",
        explanation: "The lateral border of the tongue and floor of the mouth are the most common locations for oral SCC. These areas pool saliva containing carcinogens."
    },
    {
        id: 20,
        subject: "Oral Pathology",
        question: "Which virus is associated with oral hairy leukoplakia?",
        options: ["Herpes simplex virus", "Human papillomavirus", "Epstein-Barr virus", "Cytomegalovirus"],
        correctAnswer: "Epstein-Barr virus",
        explanation: "Oral hairy leukoplakia is caused by EBV replication in epithelial cells and is commonly seen in immunocompromised patients, particularly those with HIV/AIDS."
    },
    {
        id: 21,
        subject: "Oral Pathology",
        question: "Ameloblastoma most commonly occurs in which location?",
        options: ["Maxillary anterior region", "Mandibular anterior region", "Mandibular posterior/ramus region", "Maxillary posterior region"],
        correctAnswer: "Mandibular posterior/ramus region",
        explanation: "Approximately 80% of ameloblastomas occur in the mandible, with the posterior body and ramus being the most common location."
    },
    {
        id: 22,
        subject: "Oral Pathology",
        question: "Which salivary gland tumor is most likely to be malignant?",
        options: ["Pleomorphic adenoma", "Warthin tumor", "Mucoepidermoid carcinoma", "Oncocytoma"],
        correctAnswer: "Mucoepidermoid carcinoma",
        explanation: "Mucoepidermoid carcinoma is the most common malignant salivary gland tumor. Pleomorphic adenoma and Warthin tumor are benign neoplasms."
    },
    {
        id: 23,
        subject: "Oral Pathology",
        question: "Periapical cemento-osseous dysplasia is most commonly found in:",
        options: ["Young Caucasian males", "Middle-aged African American females", "Elderly Asian males", "Adolescent females"],
        correctAnswer: "Middle-aged African American females",
        explanation: "PCOD shows a strong predilection for middle-aged African American women and typically affects the mandibular anterior teeth."
    },

    // Oral Medicine
    {
        id: 24,
        subject: "Oral Medicine",
        question: "A patient with uncontrolled diabetes presenting for dental treatment would have an HbA1c level greater than:",
        options: ["5%", "6%", "7%", "9%"],
        correctAnswer: "9%",
        explanation: "HbA1c >9% indicates poor glycemic control. Elective dental treatment should be postponed until better control is achieved. Well-controlled diabetics have HbA1c <7%."
    },
    {
        id: 25,
        subject: "Oral Medicine",
        question: "Which ASA classification describes a patient with severe systemic disease that limits activity but is not incapacitating?",
        options: ["ASA I", "ASA II", "ASA III", "ASA IV"],
        correctAnswer: "ASA III",
        explanation: "ASA III indicates severe systemic disease that limits activity but is not incapacitating (e.g., controlled CHF, stable angina). ASA IV indicates incapacitating disease."
    },
    {
        id: 26,
        subject: "Oral Medicine",
        question: "Medication-related osteonecrosis of the jaw (MRONJ) is most commonly associated with:",
        options: ["Methotrexate", "Bisphosphonates", "Corticosteroids", "Beta-blockers"],
        correctAnswer: "Bisphosphonates",
        explanation: "MRONJ is most commonly associated with bisphosphonates, especially IV formulations used for cancer treatment. Risk factors include dental extractions and poor oral hygiene."
    },
    {
        id: 27,
        subject: "Oral Medicine",
        question: "The most common medical emergency in the dental office is:",
        options: ["Myocardial infarction", "Stroke", "Syncope (vasovagal)", "Anaphylaxis"],
        correctAnswer: "Syncope (vasovagal)",
        explanation: "Vasovagal syncope is the most common medical emergency in dental practice, often triggered by anxiety, pain, or the sight of blood or needles."
    },
    {
        id: 28,
        subject: "Oral Medicine",
        question: "Antibiotic prophylaxis for dental procedures is currently recommended by the AHA for patients with:",
        options: ["Mitral valve prolapse", "Rheumatic heart disease", "Prosthetic cardiac valve", "Coronary artery disease"],
        correctAnswer: "Prosthetic cardiac valve",
        explanation: "Current AHA guidelines recommend IE prophylaxis only for high-risk conditions: prosthetic valves, previous IE, certain congenital heart conditions, and cardiac transplant recipients with valvulopathy."
    },
    {
        id: 29,
        subject: "Oral Medicine",
        question: "In a patient experiencing an anaphylactic reaction, the first drug to administer is:",
        options: ["Diphenhydramine", "Epinephrine", "Hydrocortisone", "Albuterol"],
        correctAnswer: "Epinephrine",
        explanation: "Epinephrine is the first-line treatment for anaphylaxis. Intramuscular injection (0.3-0.5 mg) should be administered immediately. Antihistamines and corticosteroids are secondary treatments."
    },
    {
        id: 30,
        subject: "Oral Medicine",
        question: "A patient taking which medication requires a 24-hour drug holiday before dental implant placement?",
        options: ["Aspirin", "Clopidogrel", "Warfarin", "None - medications should not be stopped"],
        correctAnswer: "None - medications should not be stopped",
        explanation: "Current evidence suggests that stopping antiplatelet medications increases cardiovascular risk without significant benefit in reducing dental bleeding. Local hemostatic measures are preferred."
    },

    // Oral Radiology
    {
        id: 31,
        subject: "Oral Radiology",
        question: "Which radiographic technique best shows the interproximal bone level?",
        options: ["Periapical", "Bitewing", "Panoramic", "Occlusal"],
        correctAnswer: "Bitewing",
        explanation: "Bitewing radiographs are ideal for evaluating interproximal bone levels, caries detection, and assessment of existing restorations due to minimal vertical angulation."
    },
    {
        id: 32,
        subject: "Oral Radiology",
        question: "The ALARA principle stands for:",
        options: ["Always Lower All Radiation Amounts", "As Low As Reasonably Achievable", "All Levels Are Relatively Acceptable", "Adequate Levels Are Required Always"],
        correctAnswer: "As Low As Reasonably Achievable",
        explanation: "ALARA (As Low As Reasonably Achievable) is the guiding principle for radiation protection, minimizing patient exposure while obtaining diagnostic quality images."
    },
    {
        id: 33,
        subject: "Oral Radiology",
        question: "Which error results in elongation of teeth on a periapical radiograph?",
        options: ["Excessive vertical angulation", "Insufficient vertical angulation", "Horizontal overlap", "Bent film"],
        correctAnswer: "Insufficient vertical angulation",
        explanation: "Insufficient vertical angulation (too flat) causes elongation. Excessive vertical angulation causes foreshortening. The bisecting angle technique requires correct angulation."
    },
    {
        id: 34,
        subject: "Oral Radiology",
        question: "On a panoramic radiograph, the radiolucent area between the maxillary incisors represents the:",
        options: ["Incisive foramen", "Mental foramen", "Nasal fossa", "Maxillary sinus"],
        correctAnswer: "Incisive foramen",
        explanation: "The incisive foramen appears as a radiolucent area between the maxillary central incisors on panoramic and periapical radiographs."
    },
    {
        id: 35,
        subject: "Oral Radiology",
        question: "The radiation dose from a full mouth series is approximately:",
        options: ["10-20 μSv", "50-100 μSv", "150-200 μSv", "500-1000 μSv"],
        correctAnswer: "50-100 μSv",
        explanation: "A digital FMX delivers approximately 50-100 μSv. For comparison, a panoramic is about 10-20 μSv, and a chest X-ray is about 100 μSv."
    },
    {
        id: 36,
        subject: "Oral Radiology",
        question: "CBCT imaging is most appropriate for:",
        options: ["Routine caries detection", "Periodontal bone level assessment", "Implant planning and impacted teeth", "Routine endodontic diagnosis"],
        correctAnswer: "Implant planning and impacted teeth",
        explanation: "CBCT provides 3D imaging essential for implant planning, evaluating impacted teeth, and assessing complex anatomy. It should not be used for routine diagnostics due to higher radiation dose."
    },

    // Periodontics
    {
        id: 37,
        subject: "Periodontics",
        question: "According to the 2017 periodontal classification, Stage III periodontitis is characterized by:",
        options: ["CAL 1-2mm, bone loss up to 15%", "CAL 3-4mm, bone loss up to 33%", "CAL ≥5mm, bone loss extending to middle third of root", "CAL ≥5mm, bone loss extending to apical third of root"],
        correctAnswer: "CAL ≥5mm, bone loss extending to middle third of root",
        explanation: "Stage III periodontitis is defined by CAL ≥5mm, radiographic bone loss extending to the middle third of the root, and/or tooth loss due to periodontitis (≤4 teeth)."
    },
    {
        id: 38,
        subject: "Periodontics",
        question: "The primary etiologic factor in periodontal disease is:",
        options: ["Genetic factors", "Bacterial plaque biofilm", "Occlusal trauma", "Systemic disease"],
        correctAnswer: "Bacterial plaque biofilm",
        explanation: "Bacterial plaque biofilm is the primary etiologic factor. Host response, genetics, and systemic factors are modifying factors that affect disease progression."
    },
    {
        id: 39,
        subject: "Periodontics",
        question: "Which bacteria is most strongly associated with aggressive periodontitis?",
        options: ["Streptococcus mutans", "Aggregatibacter actinomycetemcomitans", "Lactobacillus", "Candida albicans"],
        correctAnswer: "Aggregatibacter actinomycetemcomitans",
        explanation: "A. actinomycetemcomitans is strongly associated with localized aggressive periodontitis due to its leukotoxin production and ability to invade epithelial cells."
    },
    {
        id: 40,
        subject: "Periodontics",
        question: "The width of attached gingiva is measured from the:",
        options: ["Free gingival margin to the base of the sulcus", "Base of the sulcus to the mucogingival junction", "Free gingival margin to the mucogingival junction", "Free gingival margin to the cemento-enamel junction"],
        correctAnswer: "Free gingival margin to the mucogingival junction",
        explanation: "The width of attached gingiva is measured from the free gingival margin to the mucogingival junction, minus the sulcus/pocket depth."
    },
    {
        id: 41,
        subject: "Periodontics",
        question: "Scaling and root planing is most effective for pocket depths:",
        options: ["1-3mm", "4-6mm", "7-9mm", "Greater than 9mm"],
        correctAnswer: "4-6mm",
        explanation: "SRP is most effective for moderate pocket depths (4-6mm). Shallow pockets may not benefit significantly, and deep pockets often require surgical access."
    },
    {
        id: 42,
        subject: "Periodontics",
        question: "Which condition is characterized by excessive gingival display during smiling?",
        options: ["Altered passive eruption", "Gummy smile", "Gingival recession", "Mucogingival defect"],
        correctAnswer: "Gummy smile",
        explanation: "Gummy smile (excessive gingival display) can result from altered passive eruption, vertical maxillary excess, short upper lip, or hypermobile lip."
    },

    // Endodontics
    {
        id: 43,
        subject: "Endodontics",
        question: "Which pulp test determines the health of the pulp tissue vasculature?",
        options: ["Cold test", "Electric pulp test", "Laser Doppler flowmetry", "Heat test"],
        correctAnswer: "Laser Doppler flowmetry",
        explanation: "Laser Doppler flowmetry directly measures pulp blood flow, assessing vasculature. Cold, heat, and EPT test nerve response, which may remain even in necrotic pulps."
    },
    {
        id: 44,
        subject: "Endodontics",
        question: "Symptomatic irreversible pulpitis is characterized by:",
        options: ["No response to vitality testing", "Brief pain that subsides after removal of stimulus", "Spontaneous pain and lingering pain to thermal stimuli", "Pain only upon percussion"],
        correctAnswer: "Spontaneous pain and lingering pain to thermal stimuli",
        explanation: "Symptomatic irreversible pulpitis presents with spontaneous pain, lingering pain (>30 seconds) after thermal stimuli, and often refers pain. RCT or extraction is required."
    },
    {
        id: 45,
        subject: "Endodontics",
        question: "The working length in endodontics should ideally terminate:",
        options: ["At the radiographic apex", "0.5-1mm short of the radiographic apex", "2mm short of the radiographic apex", "At the cemento-dentinal junction"],
        correctAnswer: "0.5-1mm short of the radiographic apex",
        explanation: "The working length should terminate at the apical constriction, typically 0.5-1mm short of the radiographic apex. This allows for natural healing and prevents extrusion."
    },
    {
        id: 46,
        subject: "Endodontics",
        question: "Which irrigant is most effective against Enterococcus faecalis in root canals?",
        options: ["Sodium hypochlorite", "Chlorhexidine", "EDTA", "Hydrogen peroxide"],
        correctAnswer: "Sodium hypochlorite",
        explanation: "Sodium hypochlorite is the gold standard irrigant due to its antimicrobial efficacy, tissue dissolution, and effectiveness against E. faecalis in biofilms."
    },
    {
        id: 47,
        subject: "Endodontics",
        question: "Internal resorption appears radiographically as:",
        options: ["A well-defined radiolucent area within the root", "An irregular radiolucent area on the root surface", "A diffuse periapical radiolucency", "Root shortening"],
        correctAnswer: "A well-defined radiolucent area within the root",
        explanation: "Internal resorption appears as a well-defined, symmetrical, balloon-like radiolucency within the root canal space, where the canal walls are undermined."
    },
    {
        id: 48,
        subject: "Endodontics",
        question: "A phoenix abscess is characterized by:",
        options: ["A chronic periapical lesion becoming symptomatic", "An abscess after recent trauma", "A draining sinus tract", "An abscess in primary teeth"],
        correctAnswer: "A chronic periapical lesion becoming symptomatic",
        explanation: "A phoenix abscess occurs when a previously asymptomatic chronic periapical lesion becomes acutely symptomatic, often due to disruption of the lesion's balance."
    },

    // Prosthodontics
    {
        id: 49,
        subject: "Prosthodontics",
        question: "According to Kennedy classification, a bilateral distal extension partial denture is classified as:",
        options: ["Class I", "Class II", "Class III", "Class IV"],
        correctAnswer: "Class I",
        explanation: "Kennedy Class I is a bilateral edentulous area located posterior to the remaining natural teeth (bilateral distal extension). Class II is unilateral distal extension."
    },
    {
        id: 50,
        subject: "Prosthodontics",
        question: "The minimum occlusal reduction for a full metal crown is:",
        options: ["0.5mm", "1.0mm", "1.5mm", "2.0mm"],
        correctAnswer: "1.5mm",
        explanation: "Full metal crowns require minimum 1.5mm occlusal reduction for adequate metal thickness and strength. PFM crowns need 2.0mm for metal and porcelain."
    },
    {
        id: 51,
        subject: "Prosthodontics",
        question: "Which major connector is contraindicated for patients with a prominent torus palatinus?",
        options: ["Palatal strap", "Anterior-posterior palatal strap", "Complete palatal coverage", "U-shaped palatal connector"],
        correctAnswer: "Complete palatal coverage",
        explanation: "Complete palatal coverage is contraindicated with prominent torus palatinus as it can cause rocking, poor retention, and tissue trauma. A U-shaped or strap design should be used."
    },
    {
        id: 52,
        subject: "Prosthodontics",
        question: "The retromolar pad in complete denture construction provides:",
        options: ["Posterior limit of the mandibular denture", "Area of primary stress-bearing support", "Reference for the occlusal plane", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "The retromolar pad serves multiple functions: it defines the posterior limit, provides stress-bearing support, and its upper portion marks the occlusal plane level."
    },
    {
        id: 53,
        subject: "Prosthodontics",
        question: "Which cement provides the best long-term retention for permanent crowns?",
        options: ["Zinc phosphate cement", "Glass ionomer cement", "Resin cement", "Zinc oxide eugenol"],
        correctAnswer: "Resin cement",
        explanation: "Resin cements provide superior bond strength and are especially indicated for all-ceramic restorations and teeth with minimal retention form."
    },
    {
        id: 54,
        subject: "Prosthodontics",
        question: "The ferrule effect in crown preparation requires:",
        options: ["1.5-2mm of parallel dentin wall above the finish line", "A beveled margin", "Flared crown margins", "Subgingival margin placement"],
        correctAnswer: "1.5-2mm of parallel dentin wall above the finish line",
        explanation: "The ferrule effect requires 1.5-2mm of sound, parallel coronal dentin above the preparation margin to resist fracture and increase crown retention."
    },

    // Pediatric Dentistry
    {
        id: 55,
        subject: "Pediatric Dentistry",
        question: "The primary dentition is typically complete by what age?",
        options: ["12 months", "18 months", "30 months", "48 months"],
        correctAnswer: "30 months",
        explanation: "Primary dentition is usually complete by 30 months (2.5 years), with all 20 primary teeth erupted. The second primary molars are typically the last to erupt."
    },
    {
        id: 56,
        subject: "Pediatric Dentistry",
        question: "Which space maintainer is indicated for premature loss of a primary second molar before the first permanent molar has erupted?",
        options: ["Band and loop", "Distal shoe", "Nance appliance", "Lower lingual holding arch"],
        correctAnswer: "Distal shoe",
        explanation: "A distal shoe space maintainer is indicated when the primary second molar is lost before eruption of the first permanent molar. It guides the permanent molar eruption."
    },
    {
        id: 57,
        subject: "Pediatric Dentistry",
        question: "Pulpotomy in primary teeth involves removal of:",
        options: ["Only necrotic pulp tissue", "Coronal pulp only", "All pulp tissue", "Only the infected root canals"],
        correctAnswer: "Coronal pulp only",
        explanation: "Pulpotomy involves removal of the coronal pulp tissue, leaving vital radicular pulp. It's indicated when caries exposure is minimal and radicular pulp is vital."
    },
    {
        id: 58,
        subject: "Pediatric Dentistry",
        question: "The tell-show-do behavior management technique is most effective for:",
        options: ["Severe dental phobia", "Pre-cooperative patients", "Cooperative anxious patients", "Patients with special needs"],
        correctAnswer: "Cooperative anxious patients",
        explanation: "Tell-show-do is effective for cooperative anxious children who can understand explanations. It involves explaining (tell), demonstrating (show), and performing (do) procedures."
    },
    {
        id: 59,
        subject: "Pediatric Dentistry",
        question: "Early childhood caries (ECC) is defined as:",
        options: ["Any caries in children under 3 years", "One or more decayed teeth in children under 6 years", "Caries only on anterior teeth", "Bottle-related caries only"],
        correctAnswer: "One or more decayed teeth in children under 6 years",
        explanation: "ECC is defined as the presence of one or more decayed (cavitated or non-cavitated), missing, or filled tooth surfaces in any primary tooth in a child under 6 years."
    },
    {
        id: 60,
        subject: "Pediatric Dentistry",
        question: "The optimal fluoride concentration in community water fluoridation is:",
        options: ["0.3 ppm", "0.7 ppm", "1.5 ppm", "2.0 ppm"],
        correctAnswer: "0.7 ppm",
        explanation: "The optimal fluoride level is 0.7 ppm (mg/L) as recommended by the US Public Health Service. This provides caries prevention while minimizing fluorosis risk."
    },

    // Oral Surgery
    {
        id: 61,
        subject: "Oral Surgery",
        question: "Which nerve is most at risk during extraction of mandibular third molars?",
        options: ["Buccal nerve", "Inferior alveolar nerve", "Mental nerve", "Mylohyoid nerve"],
        correctAnswer: "Inferior alveolar nerve",
        explanation: "The inferior alveolar nerve is most at risk during mandibular third molar extraction due to its proximity to the root apices. This can result in paresthesia of the lower lip."
    },
    {
        id: 62,
        subject: "Oral Surgery",
        question: "The Winter classification for impacted third molars refers to:",
        options: ["Depth of impaction", "Angular position of the tooth", "Relationship to the ramus", "Root morphology"],
        correctAnswer: "Angular position of the tooth",
        explanation: "Winter's classification describes the angulation of impacted third molars: mesioangular, distoangular, vertical, horizontal, and inverted positions."
    },
    {
        id: 63,
        subject: "Oral Surgery",
        question: "Dry socket (alveolar osteitis) is best treated with:",
        options: ["Antibiotics only", "Irrigation and dressing placement", "Immediate re-extraction", "Bone grafting"],
        correctAnswer: "Irrigation and dressing placement",
        explanation: "Dry socket treatment involves gentle irrigation to remove debris and placement of medicated dressing (eugenol-based). Antibiotics are not typically necessary."
    },
    {
        id: 64,
        subject: "Oral Surgery",
        question: "Ludwig's angina is a rapidly spreading infection involving which spaces?",
        options: ["Sublingual and submandibular spaces bilaterally", "Buccal space only", "Parotid space", "Pterygomandibular space"],
        correctAnswer: "Sublingual and submandibular spaces bilaterally",
        explanation: "Ludwig's angina is a rapidly spreading bilateral cellulitis of the submandibular, sublingual, and submental spaces, often from infected mandibular molars."
    },
    {
        id: 65,
        subject: "Oral Surgery",
        question: "The most appropriate initial management of a patient with a suspected jaw fracture is:",
        options: ["Immediate surgical fixation", "Soft diet and observation", "Stabilization and imaging", "Antibiotic prescription"],
        correctAnswer: "Stabilization and imaging",
        explanation: "Initial management includes stabilization (Barton bandage), airway assessment, imaging (panoramic, CT), and appropriate referral. Surgery timing depends on fracture type."
    },
    {
        id: 66,
        subject: "Oral Surgery",
        question: "Which biopsy technique is preferred for a suspicious lesion highly suspected to be malignant?",
        options: ["Excisional biopsy", "Incisional biopsy", "Fine needle aspiration", "Brush biopsy"],
        correctAnswer: "Incisional biopsy",
        explanation: "Incisional biopsy is preferred for suspected malignancies to obtain representative tissue without compromising surgical margins for definitive treatment."
    },

    // Operative Dentistry
    {
        id: 67,
        subject: "Operative Dentistry",
        question: "The ideal etch time for enamel bonding is:",
        options: ["5 seconds", "15 seconds", "30 seconds", "60 seconds"],
        correctAnswer: "15 seconds",
        explanation: "Phosphoric acid etch (35-37%) should be applied to enamel for 15 seconds (up to 30 seconds for unprepared enamel). Over-etching can damage the enamel structure."
    },
    {
        id: 68,
        subject: "Operative Dentistry",
        question: "Which cavity classification describes a lesion on the gingival third of the facial surface of a premolar?",
        options: ["Class I", "Class III", "Class IV", "Class V"],
        correctAnswer: "Class V",
        explanation: "Class V cavities are located on the gingival third of the facial or lingual surfaces of any tooth, not involving proximal surfaces."
    },
    {
        id: 69,
        subject: "Operative Dentistry",
        question: "The purpose of the acid-etch technique is to:",
        options: ["Sterilize the enamel surface", "Create micro-mechanical retention", "Strengthen the enamel", "Remove all bacteria"],
        correctAnswer: "Create micro-mechanical retention",
        explanation: "Acid etching creates micro-porosities in enamel (5-50 microns) that allow resin infiltration and micro-mechanical retention for bonding."
    },
    {
        id: 70,
        subject: "Operative Dentistry",
        question: "Which material is most appropriate for a deep carious lesion close to the pulp?",
        options: ["Zinc phosphate cement", "Glass ionomer cement", "Calcium hydroxide liner", "Composite resin"],
        correctAnswer: "Calcium hydroxide liner",
        explanation: "Calcium hydroxide stimulates reparative dentin formation and has antibacterial properties, making it ideal as a liner in deep cavities near the pulp."
    },
    {
        id: 71,
        subject: "Operative Dentistry",
        question: "The primary difference between amalgam and composite restorations regarding cavity preparation is:",
        options: ["Amalgam requires more tooth removal", "Composite requires extension for prevention", "Amalgam is more conservative", "No difference exists"],
        correctAnswer: "Amalgam requires more tooth removal",
        explanation: "Amalgam requires specific resistance and retention form with adequate bulk, while composite bonds to tooth structure allowing more conservative preparations."
    },
    {
        id: 72,
        subject: "Operative Dentistry",
        question: "Incremental placement of composite resin is performed to:",
        options: ["Increase working time", "Reduce polymerization shrinkage stress", "Improve aesthetics", "Reduce technique sensitivity"],
        correctAnswer: "Reduce polymerization shrinkage stress",
        explanation: "Incremental layering (2mm increments) reduces the C-factor and allows shrinkage to occur toward the bonded surface, minimizing gap formation and stress."
    },

    // Orthodontics
    {
        id: 73,
        subject: "Orthodontics",
        question: "Angle Class II Division 1 malocclusion is characterized by:",
        options: ["Normal molar relationship with crowding", "Distal molar relationship with proclined maxillary incisors", "Mesial molar relationship with prognathic mandible", "Distal molar relationship with retroclined maxillary incisors"],
        correctAnswer: "Distal molar relationship with proclined maxillary incisors",
        explanation: "Class II Division 1 has a Class II molar relationship with labially inclined (proclined) maxillary incisors, often showing increased overjet."
    },
    {
        id: 74,
        subject: "Orthodontics",
        question: "The most active period of mandibular growth occurs:",
        options: ["During infancy", "During early childhood", "During adolescence", "After skeletal maturity"],
        correctAnswer: "During adolescence",
        explanation: "Peak mandibular growth occurs during the adolescent growth spurt, making this the optimal time for functional appliance therapy to modify mandibular growth."
    },
    {
        id: 75,
        subject: "Orthodontics",
        question: "Which cephalometric landmark is located at the most posterior-superior point of the external acoustic meatus?",
        options: ["Nasion", "Porion", "Sella", "Basion"],
        correctAnswer: "Porion",
        explanation: "Porion is located at the uppermost point on the margin of the external acoustic meatus. It's used to establish the Frankfort horizontal plane."
    },
    {
        id: 76,
        subject: "Orthodontics",
        question: "The optimal force for orthodontic tooth movement is:",
        options: ["Light, continuous force", "Heavy, intermittent force", "Heavy, continuous force", "Light, intermittent force"],
        correctAnswer: "Light, continuous force",
        explanation: "Light, continuous forces (10-20g for tipping, 50-75g for bodily movement) produce the most efficient tooth movement with minimal root resorption."
    },
    {
        id: 77,
        subject: "Orthodontics",
        question: "A serial extraction procedure is used for:",
        options: ["Mixed dentition crowding", "Class III malocclusion", "Open bite", "Crossbite correction"],
        correctAnswer: "Mixed dentition crowding",
        explanation: "Serial extraction involves sequential removal of primary teeth and first premolars in severe crowding cases to guide eruption and reduce future crowding."
    },
    {
        id: 78,
        subject: "Orthodontics",
        question: "Which type of orthodontic movement has the highest risk for root resorption?",
        options: ["Tipping", "Bodily movement", "Intrusion", "Rotation"],
        correctAnswer: "Intrusion",
        explanation: "Intrusive movements concentrate force at the root apex, creating the highest risk of root resorption. Heavy forces and prolonged treatment increase this risk."
    },

    // Ethics
    {
        id: 79,
        subject: "Ethics",
        question: "The ethical principle that requires dentists to act in the best interest of the patient is:",
        options: ["Autonomy", "Beneficence", "Justice", "Veracity"],
        correctAnswer: "Beneficence",
        explanation: "Beneficence obligates healthcare providers to act in the patient's best interest. It must be balanced with patient autonomy and other ethical principles."
    },
    {
        id: 80,
        subject: "Ethics",
        question: "Informed consent requires all of the following EXCEPT:",
        options: ["Diagnosis and proposed treatment", "Risks and benefits", "Alternative treatments", "Guarantee of success"],
        correctAnswer: "Guarantee of success",
        explanation: "Informed consent requires disclosure of diagnosis, proposed treatment, risks, benefits, alternatives, and consequences of no treatment. No treatment can be guaranteed."
    },
    {
        id: 81,
        subject: "Ethics",
        question: "A dentist suspects child abuse. The dentist is legally required to:",
        options: ["Document findings and monitor", "Report to appropriate authorities", "Discuss with the suspected abuser", "Wait for more evidence"],
        correctAnswer: "Report to appropriate authorities",
        explanation: "Healthcare providers are mandated reporters. Suspected child abuse must be reported to appropriate authorities (child protective services) regardless of certainty."
    },
    {
        id: 82,
        subject: "Ethics",
        question: "HIPAA regulations protect:",
        options: ["Provider malpractice liability", "Patient health information privacy", "Insurance company records", "Hospital accreditation status"],
        correctAnswer: "Patient health information privacy",
        explanation: "HIPAA (Health Insurance Portability and Accountability Act) protects the privacy of patient health information and sets standards for its electronic exchange."
    },
    {
        id: 83,
        subject: "Ethics",
        question: "The principle of 'do no harm' is known as:",
        options: ["Beneficence", "Nonmaleficence", "Justice", "Autonomy"],
        correctAnswer: "Nonmaleficence",
        explanation: "Nonmaleficence (primum non nocere) obligates healthcare providers to avoid causing harm to patients. It's foundational to medical ethics."
    },
    {
        id: 84,
        subject: "Ethics",
        question: "A patient refuses recommended treatment. The dentist should:",
        options: ["Refuse to provide any treatment", "Respect the patient's decision and document it", "Convince the patient by any means", "Proceed with treatment anyway"],
        correctAnswer: "Respect the patient's decision and document it",
        explanation: "Competent adults have the right to refuse treatment. The dentist should ensure the patient understands consequences, respect their autonomy, and document the refusal."
    },

    // Biostatistics
    {
        id: 85,
        subject: "Biostatistics",
        question: "A screening test with high sensitivity will:",
        options: ["Have few false positives", "Have few false negatives", "Have high specificity", "Rule in disease effectively"],
        correctAnswer: "Have few false negatives",
        explanation: "High sensitivity means few false negatives (good at detecting disease when present). A sensitive test is good for ruling OUT disease (SnNOUT)."
    },
    {
        id: 86,
        subject: "Biostatistics",
        question: "The p-value represents:",
        options: ["The probability of disease", "The probability of obtaining results at least as extreme as observed, if null hypothesis is true", "The strength of the effect", "The sample size"],
        correctAnswer: "The probability of obtaining results at least as extreme as observed, if null hypothesis is true",
        explanation: "The p-value is the probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true."
    },
    {
        id: 87,
        subject: "Biostatistics",
        question: "Which study design provides the strongest evidence for causation?",
        options: ["Case-control study", "Cross-sectional study", "Randomized controlled trial", "Cohort study"],
        correctAnswer: "Randomized controlled trial",
        explanation: "RCTs provide the strongest evidence because randomization minimizes bias and confounding, allowing causal inference. They're at the top of the evidence hierarchy."
    },
    {
        id: 88,
        subject: "Biostatistics",
        question: "Selection bias in a study occurs when:",
        options: ["Participants are lost to follow-up", "Sample does not represent the target population", "Measurement is inaccurate", "Confounders are not controlled"],
        correctAnswer: "Sample does not represent the target population",
        explanation: "Selection bias occurs when study participants systematically differ from the target population, limiting generalizability of results."
    },
    {
        id: 89,
        subject: "Biostatistics",
        question: "A 95% confidence interval indicates that:",
        options: ["95% of sample values fall within the interval", "There is 95% probability the true parameter falls within the interval", "If the study were repeated 100 times, about 95 intervals would contain the true parameter", "The sample is 95% accurate"],
        correctAnswer: "If the study were repeated 100 times, about 95 intervals would contain the true parameter",
        explanation: "A 95% CI means if we repeated the study many times, 95% of calculated intervals would contain the true population parameter."
    },
    {
        id: 90,
        subject: "Biostatistics",
        question: "Positive predictive value depends on:",
        options: ["Sensitivity only", "Specificity only", "Disease prevalence", "Sample size only"],
        correctAnswer: "Disease prevalence",
        explanation: "PPV depends on prevalence: in low-prevalence populations, even highly specific tests may have low PPV due to more false positives relative to true positives."
    },

    // Patient Management
    {
        id: 91,
        subject: "Patient Management",
        question: "Motivational interviewing is best described as:",
        options: ["Telling patients what to do", "A patient-centered counseling approach", "A form of behavioral therapy", "A punishment-based approach"],
        correctAnswer: "A patient-centered counseling approach",
        explanation: "Motivational interviewing is a collaborative, patient-centered approach that explores and resolves ambivalence to facilitate behavior change."
    },
    {
        id: 92,
        subject: "Patient Management",
        question: "The most effective method to reduce dental anxiety in adults is:",
        options: ["Sedation only", "Behavior management techniques", "Rushing through treatment", "Avoiding discussing the procedure"],
        correctAnswer: "Behavior management techniques",
        explanation: "Behavior management (communication, tell-show-do, distraction, relaxation) is most effective for anxiety. Sedation is reserved for cases where behavioral techniques are insufficient."
    },
    {
        id: 93,
        subject: "Patient Management",
        question: "Standard precautions in infection control should be used for:",
        options: ["HIV-positive patients only", "Patients with known infections", "All patients", "Elderly patients only"],
        correctAnswer: "All patients",
        explanation: "Standard precautions treat all patients as potentially infectious. They apply to blood, body fluids, secretions, non-intact skin, and mucous membranes."
    },
    {
        id: 94,
        subject: "Patient Management",
        question: "Which communication technique involves restating what the patient said?",
        options: ["Open-ended questioning", "Reflective listening", "Confrontation", "Directing"],
        correctAnswer: "Reflective listening",
        explanation: "Reflective listening involves restating or paraphrasing what the patient said to confirm understanding and show empathy."
    },
    {
        id: 95,
        subject: "Patient Management",
        question: "The primary purpose of sterilization monitoring using biological indicators is to:",
        options: ["Verify physical parameters", "Confirm microbial kill", "Monitor staff compliance", "Satisfy legal requirements"],
        correctAnswer: "Confirm microbial kill",
        explanation: "Biological indicators (spore tests) are the gold standard for verifying sterilization effectiveness, confirming that microbial kill has occurred."
    },
    {
        id: 96,
        subject: "Patient Management",
        question: "Hand hygiene should be performed:",
        options: ["Only before treating patients", "Only after treating patients", "Before and after patient contact", "Only when visibly soiled"],
        correctAnswer: "Before and after patient contact",
        explanation: "Hand hygiene should be performed before and after patient contact, after removing gloves, and when hands are visibly contaminated."
    },

    // Additional questions for variety
    {
        id: 97,
        subject: "Pharmacology",
        question: "Which local anesthetic is contraindicated in patients with methemoglobinemia?",
        options: ["Lidocaine", "Prilocaine", "Articaine", "Mepivacaine"],
        correctAnswer: "Prilocaine",
        explanation: "Prilocaine's metabolite (o-toluidine) can cause methemoglobinemia, especially in patients with existing methemoglobin disorders or when using large doses."
    },
    {
        id: 98,
        subject: "Oral Pathology",
        question: "Which syndrome is characterized by multiple odontogenic keratocysts, basal cell carcinomas, and skeletal abnormalities?",
        options: ["Gardner syndrome", "Gorlin-Goltz syndrome", "Peutz-Jeghers syndrome", "McCune-Albright syndrome"],
        correctAnswer: "Gorlin-Goltz syndrome",
        explanation: "Gorlin-Goltz (Nevoid Basal Cell Carcinoma) syndrome features multiple OKCs, BCCs, palmar/plantar pits, calcified falx cerebri, and bifid ribs."
    },
    {
        id: 99,
        subject: "Head and Neck Anatomy",
        question: "Which salivary gland produces predominantly serous secretion?",
        options: ["Parotid gland", "Submandibular gland", "Sublingual gland", "Minor salivary glands"],
        correctAnswer: "Parotid gland",
        explanation: "The parotid gland produces almost purely serous (watery) secretion. The submandibular is mixed (mostly serous), and sublingual is predominantly mucous."
    },
    {
        id: 100,
        subject: "Endodontics",
        question: "What is the recommended concentration of sodium hypochlorite for root canal irrigation?",
        options: ["0.5-1%", "1-3%", "2.5-6%", "10-15%"],
        correctAnswer: "2.5-6%",
        explanation: "Sodium hypochlorite 2.5-6% is commonly used in endodontics. Higher concentrations provide better tissue dissolution and antimicrobial effect but with more potential for tissue damage."
    }
];
