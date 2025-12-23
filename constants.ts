import { Playlist } from './types';

// ============================================================================
// INBDE EXAM INFORMATION
// ============================================================================

export interface ExamInfo {
  name: string;
  fullName: string;
  description: string;
  format: {
    totalQuestions: number;
    scoredQuestions: number;
    pilotQuestions: number;
    days: number;
    sessionsPerDay: number;
    questionsPerSession: number;
    timePerSession: string;
    totalTime: string;
  };
  scoring: {
    passingScore: number;
    scoreRange: string;
    reportDelay: string;
  };
  eligibility: string[];
  testingWindows: string;
  retakePolicy: string;
  cost: string;
}

export const INBDE_INFO: ExamInfo = {
  name: 'INBDE',
  fullName: 'Integrated National Board Dental Examination',
  description: 'The INBDE is a comprehensive examination that assesses the ability to apply foundational knowledge and clinical decision-making skills to provide safe, independent, and competent patient care. It replaced the previous NBDE Part I and Part II exams in August 2020.',
  format: {
    totalQuestions: 500,
    scoredQuestions: 400,
    pilotQuestions: 100,
    days: 2,
    sessionsPerDay: 4,
    questionsPerSession: 62,
    timePerSession: '65 minutes',
    totalTime: '8 hours 40 minutes per day'
  },
  scoring: {
    passingScore: 75,
    scoreRange: '49-99',
    reportDelay: '3-4 weeks after testing'
  },
  eligibility: [
    'Currently enrolled in or graduated from a CODA-accredited dental program',
    'International dental graduates with advanced standing in a US dental school',
    'Valid government-issued photo ID required'
  ],
  testingWindows: 'Year-round at Prometric testing centers',
  retakePolicy: 'Candidates may retake the exam up to 3 times within 12 months. A 90-day waiting period is required between attempts.',
  cost: '$545 USD (as of 2024)'
};

// ============================================================================
// INBDE CONTENT DOMAINS (Foundation Knowledge + Patient Care Assessment)
// ============================================================================

export interface ContentDomain {
  id: string;
  name: string;
  percentage: string;
  description: string;
  topics: string[];
}

export const FOUNDATION_KNOWLEDGE_DOMAINS: ContentDomain[] = [
  {
    id: 'fk1',
    name: 'Anatomic Sciences',
    percentage: '10-15%',
    description: 'Gross anatomy, histology, and embryology relevant to dentistry',
    topics: [
      'Head and neck anatomy (bones, muscles, nerves, blood vessels)',
      'Oral and dental anatomy',
      'Histology of oral tissues',
      'Embryology and craniofacial development',
      'Neuroanatomy relevant to dentistry'
    ]
  },
  {
    id: 'fk2',
    name: 'Biochemistry and Physiology',
    percentage: '8-12%',
    description: 'Molecular and cellular processes relevant to oral health',
    topics: [
      'Carbohydrate, lipid, and protein metabolism',
      'Nutrition and oral health',
      'Saliva composition and functions',
      'Bone and tooth mineralization',
      'Cardiovascular, respiratory, and renal physiology'
    ]
  },
  {
    id: 'fk3',
    name: 'Microbiology and Immunology',
    percentage: '8-12%',
    description: 'Infectious agents and host defense mechanisms',
    topics: [
      'Oral microbiome and dental biofilm',
      'Cariogenic and periodontopathic bacteria',
      'Viral infections (HSV, HPV, HIV, Hepatitis)',
      'Fungal infections (Candida)',
      'Innate and adaptive immunity',
      'Infection control protocols'
    ]
  },
  {
    id: 'fk4',
    name: 'Pathology',
    percentage: '10-15%',
    description: 'Disease processes affecting oral and systemic health',
    topics: [
      'Oral pathology (cysts, tumors, developmental disorders)',
      'Inflammation and healing',
      'Neoplasia (benign and malignant)',
      'Systemic diseases with oral manifestations',
      'Immunologic diseases',
      'Genetic disorders'
    ]
  },
  {
    id: 'fk5',
    name: 'Dental Materials',
    percentage: '5-10%',
    description: 'Properties and applications of dental materials',
    topics: [
      'Restorative materials (amalgam, composite, glass ionomer)',
      'Impression materials',
      'Dental cements',
      'Metals and alloys',
      'Ceramics and polymers',
      'Biocompatibility'
    ]
  }
];

export const PATIENT_CARE_DOMAINS: ContentDomain[] = [
  {
    id: 'pc1',
    name: 'Patient Assessment and Diagnosis',
    percentage: '15-20%',
    description: 'Comprehensive evaluation and diagnostic decision-making',
    topics: [
      'Medical history evaluation',
      'Clinical examination techniques',
      'Radiographic interpretation',
      'Risk assessment',
      'Differential diagnosis',
      'Treatment planning'
    ]
  },
  {
    id: 'pc2',
    name: 'Restorative and Prosthetic Dentistry',
    percentage: '15-20%',
    description: 'Restoration and replacement of tooth structure',
    topics: [
      'Caries management and prevention',
      'Direct restorations',
      'Indirect restorations (crowns, bridges)',
      'Complete and partial dentures',
      'Dental implants',
      'Occlusion and TMD'
    ]
  },
  {
    id: 'pc3',
    name: 'Periodontics',
    percentage: '10-15%',
    description: 'Prevention and treatment of periodontal diseases',
    topics: [
      'Periodontal anatomy and biology',
      'Periodontal disease classification',
      'Non-surgical periodontal therapy',
      'Surgical periodontal procedures',
      'Periodontal-systemic connections',
      'Maintenance therapy'
    ]
  },
  {
    id: 'pc4',
    name: 'Endodontics',
    percentage: '8-12%',
    description: 'Pulp biology and root canal therapy',
    topics: [
      'Pulp and periapical pathology',
      'Endodontic diagnosis',
      'Root canal treatment procedures',
      'Endodontic emergencies',
      'Traumatic dental injuries',
      'Surgical endodontics'
    ]
  },
  {
    id: 'pc5',
    name: 'Oral Surgery',
    percentage: '8-12%',
    description: 'Surgical procedures in dentistry',
    topics: [
      'Exodontia techniques',
      'Surgical extractions',
      'Management of impacted teeth',
      'Pre-prosthetic surgery',
      'Oral pathology surgery',
      'Medical emergencies'
    ]
  },
  {
    id: 'pc6',
    name: 'Orthodontics and Pediatric Dentistry',
    percentage: '8-12%',
    description: 'Growth, development, and orthodontic principles',
    topics: [
      'Craniofacial growth and development',
      'Occlusal development',
      'Orthodontic diagnosis and treatment',
      'Pediatric behavior management',
      'Preventive dentistry for children',
      'Space management'
    ]
  },
  {
    id: 'pc7',
    name: 'Pharmacology',
    percentage: '8-12%',
    description: 'Drugs used in dental practice',
    topics: [
      'Local anesthetics',
      'Analgesics (opioid and non-opioid)',
      'Antibiotics',
      'Anti-inflammatory drugs',
      'Anxiolytics and sedatives',
      'Drug interactions and adverse effects'
    ]
  },
  {
    id: 'pc8',
    name: 'Practice and Profession',
    percentage: '5-10%',
    description: 'Ethics, law, and professional responsibilities',
    topics: [
      'Ethical principles and codes of conduct',
      'Informed consent',
      'Patient communication',
      'HIPAA and patient confidentiality',
      'Risk management',
      'Evidence-based dentistry'
    ]
  }
];

// ============================================================================
// STUDY SCHEDULE RECOMMENDATIONS
// ============================================================================

export interface StudyPhase {
  phase: number;
  name: string;
  duration: string;
  focus: string[];
  tips: string[];
}

export const RECOMMENDED_STUDY_SCHEDULE: StudyPhase[] = [
  {
    phase: 1,
    name: 'Foundation Review',
    duration: '4-6 weeks',
    focus: [
      'Anatomic Sciences (Head & Neck Anatomy)',
      'Biochemistry and Physiology',
      'Microbiology and Immunology'
    ],
    tips: [
      'Create visual aids for anatomical structures',
      'Focus on high-yield nerves and foramina',
      'Review oral microbiome basics'
    ]
  },
  {
    phase: 2,
    name: 'Clinical Sciences',
    duration: '6-8 weeks',
    focus: [
      'Pharmacology',
      'Oral Pathology',
      'Oral Medicine',
      'Oral Radiology'
    ],
    tips: [
      'Master local anesthetic calculations',
      'Create comparison charts for lesions',
      'Practice radiograph interpretation daily'
    ]
  },
  {
    phase: 3,
    name: 'Clinical Disciplines',
    duration: '6-8 weeks',
    focus: [
      'Endodontics',
      'Periodontics',
      'Prosthodontics',
      'Operative Dentistry'
    ],
    tips: [
      'Focus on diagnosis and treatment planning',
      'Review periodontal classifications',
      'Understand material properties'
    ]
  },
  {
    phase: 4,
    name: 'Specialty Areas',
    duration: '4-6 weeks',
    focus: [
      'Orthodontics',
      'Pediatric Dentistry',
      'Oral Surgery',
      'Ethics and Patient Management'
    ],
    tips: [
      'Review growth and development',
      'Master behavior management techniques',
      'Study medical emergency protocols'
    ]
  },
  {
    phase: 5,
    name: 'Integration and Practice',
    duration: '2-4 weeks',
    focus: [
      'Case-based integration',
      'Practice examinations',
      'Weak area review'
    ],
    tips: [
      'Take full-length practice exams',
      'Simulate exam conditions',
      'Focus on time management'
    ]
  }
];

// ============================================================================
// HIGH-YIELD TOPICS BY SUBJECT
// ============================================================================

export interface HighYieldTopic {
  subject: string;
  topics: string[];
}

export const HIGH_YIELD_TOPICS: HighYieldTopic[] = [
  {
    subject: 'Head and Neck Anatomy',
    topics: [
      'Cranial nerves (especially V, VII, IX, X, XII)',
      'Trigeminal nerve branches and distributions',
      'Local anesthetic injection sites',
      'Muscles of mastication (origin, insertion, innervation)',
      'Fascial spaces and spread of infection',
      'TMJ anatomy and function',
      'Skull foramina and structures passing through',
      'Salivary glands and ducts',
      'Blood supply to head and neck',
      'Lymphatic drainage patterns'
    ]
  },
  {
    subject: 'Pharmacology',
    topics: [
      'Local anesthetic mechanisms and calculations (MRDs)',
      'Epinephrine contraindications and drug interactions',
      'Analgesic ladder and NSAID/opioid comparison',
      'Antibiotic selection and prophylaxis guidelines',
      'Drug interactions with dental medications',
      'Pharmacokinetics (absorption, distribution, metabolism, excretion)',
      'Autonomic nervous system pharmacology',
      'Anxiolytics and sedation protocols',
      'Hemostatic agents',
      'Corticosteroids in dentistry'
    ]
  },
  {
    subject: 'Oral Pathology',
    topics: [
      'Odontogenic cysts (dentigerous, OKC, radicular)',
      'Odontogenic tumors (ameloblastoma, odontoma)',
      'Oral cancer (OSCC) risk factors and presentation',
      'Premalignant lesions (leukoplakia, erythroplakia)',
      'Vesiculobullous diseases',
      'Salivary gland tumors',
      'Bone pathology (fibrous dysplasia, Paget disease)',
      'Developmental anomalies',
      'Viral infections (HSV, HPV)',
      'Fungal infections (candidiasis)'
    ]
  },
  {
    subject: 'Oral Medicine',
    topics: [
      'ASA classification system',
      'Medical emergency management protocols',
      'Antibiotic prophylaxis indications',
      'Management of anticoagulated patients',
      'Diabetes and dental implications',
      'Cardiovascular disease considerations',
      'Bisphosphonate-related osteonecrosis (BRONJ)',
      'Immunocompromised patient management',
      'Drug-induced oral conditions',
      'Pregnancy considerations in dental treatment'
    ]
  },
  {
    subject: 'Oral Radiology',
    topics: [
      'X-ray physics and production',
      'Digital vs film radiography',
      'Radiation protection and ALARA principle',
      'Radiographic anatomy and landmarks',
      'Periapical vs bitewing vs panoramic indications',
      'CBCT applications',
      'Common radiographic pathology patterns',
      'Exposure errors and troubleshooting',
      'Radiation dose calculations',
      'Selection criteria guidelines'
    ]
  },
  {
    subject: 'Periodontics',
    topics: [
      'New periodontal classification (2017)',
      'Periodontal probing and charting',
      'Scaling and root planing techniques',
      'Periodontal surgical procedures',
      'Periodontal-systemic link',
      'Risk factors for periodontal disease',
      'Mucogingival conditions',
      'Periodontal regeneration',
      'Maintenance protocols',
      'Implant-related periodontal issues'
    ]
  },
  {
    subject: 'Endodontics',
    topics: [
      'Pulp vitality testing',
      'Endodontic diagnosis categories',
      'Root canal treatment steps',
      'Working length determination',
      'Obturation techniques',
      'Endodontic emergencies',
      'Traumatic dental injuries management',
      'Internal and external resorption',
      'Endodontic-periodontal lesions',
      'Retreatment considerations'
    ]
  },
  {
    subject: 'Prosthodontics',
    topics: [
      'Kennedy classification of edentulism',
      'Complete denture principles',
      'RPD components and design',
      'Crown preparation guidelines',
      'Impression materials comparison',
      'Occlusion principles',
      'Dental implant considerations',
      'Cementation protocols',
      'Shade selection',
      'Fixed vs removable prosthesis selection'
    ]
  },
  {
    subject: 'Operative Dentistry',
    topics: [
      'Caries detection and risk assessment',
      'Cavity preparation principles',
      'Composite resin technique',
      'Amalgam restorations',
      'Bonding agents generations',
      'Pulp protection',
      'Class I-VI preparations',
      'Direct vs indirect restorations',
      'Material selection criteria',
      'Minimally invasive dentistry'
    ]
  },
  {
    subject: 'Orthodontics',
    topics: [
      'Angle classification',
      'Cephalometric analysis basics',
      'Growth and development',
      'Space analysis',
      'Early intervention timing',
      'Functional appliances',
      'Fixed appliance mechanics',
      'Retention principles',
      'Craniofacial anomalies',
      'Orthognathic surgery indications'
    ]
  },
  {
    subject: 'Pediatric Dentistry',
    topics: [
      'Tooth development and eruption',
      'Behavior management techniques',
      'Pulp therapy in primary teeth',
      'Space maintainers',
      'Fluoride therapy',
      'Sealants',
      'Early childhood caries',
      'Traumatic injuries in children',
      'Medical conditions affecting children',
      'Child abuse recognition'
    ]
  },
  {
    subject: 'Oral Surgery',
    topics: [
      'Extraction techniques and principles',
      'Impacted third molar classification',
      'Surgical complications management',
      'Medical emergencies in dental office',
      'Biopsy techniques',
      'Implant surgery basics',
      'TMJ disorders',
      'Odontogenic infections',
      'Pre-prosthetic surgery',
      'Orofacial pain differential'
    ]
  },
  {
    subject: 'Ethics',
    topics: [
      'ADA Code of Ethics principles',
      'Autonomy and informed consent',
      'Beneficence and nonmaleficence',
      'Justice in healthcare',
      'Veracity and confidentiality',
      'Professional boundaries',
      'Ethical dilemma resolution',
      'HIPAA compliance',
      'Child abuse reporting',
      'Impaired colleague situations'
    ]
  },
  {
    subject: 'Biostatistics',
    topics: [
      'Study design types',
      'Sensitivity and specificity',
      'Positive and negative predictive values',
      'Statistical significance (p-value)',
      'Confidence intervals',
      'Types of bias',
      'Evidence-based dentistry hierarchy',
      'Risk assessment (OR, RR)',
      'Sampling methods',
      'Variables types'
    ]
  },
  {
    subject: 'Patient Management',
    topics: [
      'Patient communication strategies',
      'Motivational interviewing',
      'Health behavior change models',
      'Anxiety management',
      'Special needs patients',
      'Geriatric considerations',
      'Cultural competency',
      'Infection control protocols',
      'OSHA regulations',
      'Quality improvement'
    ]
  }
];

// ============================================================================
// PLAYLISTS WITH ENHANCED DESCRIPTIONS
// ============================================================================

export const PLAYLISTS: Playlist[] = [
  {
    id: '1',
    title: 'Head and Neck Anatomy',
    url: 'https://www.youtube.com/watch?v=4n2H2eQOmc8&list=PLVmK7sDA_arEKUbDuKoqUMSnIMNBXYiqV',
    description: 'Master the essential anatomy of the head and neck region. Topics include cranial nerves (V, VII, IX, X, XII), muscles of mastication and facial expression, skull foramina, fascial spaces, TMJ anatomy, salivary glands, and blood supply. High-yield for local anesthesia injection sites and understanding the spread of dental infections.'
  },
  {
    id: '2',
    title: 'Pharmacology',
    url: 'https://www.youtube.com/watch?v=5Ujl1VbAcgc&list=PLVmK7sDA_arEg4z9_0VLOLcSevD_a0cu-',
    description: 'Comprehensive review of dental pharmacology including local anesthetics (calculations, MRDs, mechanism), analgesics (NSAIDs, opioids), antibiotics (selection, prophylaxis), pharmacokinetics/dynamics, autonomic nervous system drugs, and cardiovascular pharmacology. Essential for safe prescribing and managing drug interactions.'
  },
  {
    id: '3',
    title: 'Oral Medicine',
    url: 'https://www.youtube.com/watch?v=E4waBH2mT5E&list=PLVmK7sDA_arE3O69nG21aZgHcmhtBkY5z',
    description: 'Learn to manage medically complex dental patients. Covers ASA classification, antibiotic prophylaxis guidelines, diabetes management, cardiovascular considerations, anticoagulation therapy, bisphosphonates/BRONJ, thyroid disorders, pregnancy, HIV/AIDS, substance abuse, and medical emergencies in the dental setting.'
  },
  {
    id: '4',
    title: 'Oral Radiology',
    url: 'https://www.youtube.com/watch?v=SZFqei91R9w&list=PLVmK7sDA_arEPhqt_QjcHwJfbMCFFcs9W',
    description: 'Master radiographic interpretation and X-ray physics. Topics include radiation physics, digital vs film imaging, exposure settings, radiation safety (ALARA), types of radiographs (PA, BW, panoramic, CBCT), interpretation of common pathologies, and selection criteria. Critical for diagnosis and treatment planning.'
  },
  {
    id: '5',
    title: 'Oral Pathology',
    url: 'https://www.youtube.com/watch?v=3zcuZ6U7vQA&list=PLVmK7sDA_arHJZOV12PLjTTZp6FuxxLR1',
    description: 'Comprehensive study of oral and maxillofacial pathology. Covers developmental conditions, reactive mucosal lesions, infections (viral, fungal), immunologic diseases, premalignant/malignant lesions, odontogenic cysts and tumors, salivary gland pathology, bone lesions, and hereditary conditions. Essential for diagnosis.'
  },
  {
    id: '6',
    title: 'Biostatistics',
    url: 'https://www.youtube.com/watch?v=a7i08EIgj4Y&list=PLVmK7sDA_arGu6yjajbPForsl4-VxAafh',
    description: 'Master research methodology and statistical concepts for evidence-based dentistry. Topics include study design types, sensitivity/specificity, predictive values, statistical significance, confidence intervals, bias types, hierarchy of evidence, risk assessment (OR, RR), and sampling methods.'
  },
  {
    id: '7',
    title: 'Orthodontics',
    url: 'https://www.youtube.com/watch?v=Hb1b3YPHiTE&list=PLVmK7sDA_arETCox6MazjCZ3GpWRKRZdw',
    description: 'Understand orthodontic diagnosis and treatment principles. Covers craniofacial growth and development, Angle classification, cephalometric analysis, occlusion development, biology of tooth movement, wire/bracket mechanics, early treatment, comprehensive orthodontics, retention, and orthognathic surgery indications.'
  },
  {
    id: '8',
    title: 'Periodontics',
    url: 'https://www.youtube.com/watch?v=Pm8s9aqs7Ug&list=PLVmK7sDA_arHjTU6piDWxVkSMr7C0EmgL',
    description: 'Comprehensive periodontal education covering diagnosis, new 2017 classification system, plaque and local factors, pathogenesis, treatment planning, prognosis, non-surgical therapy (SRP), surgical procedures, flap design, adjunctive therapy, and maintenance. Includes the periodontal-systemic link.'
  },
  {
    id: '9',
    title: 'Endodontics',
    url: 'https://www.youtube.com/watch?v=7EsHL8Sacg0&list=PLVmK7sDA_arGlxE4-46tofq5drs-mfCsi',
    description: 'Master pulp biology and root canal therapy. Topics include pulp testing and diagnosis, pulpal/periapical pathology classifications, root canal treatment procedures, working length determination, obturation, surgical endodontics, procedural complications, traumatic injuries, and case difficulty assessment.'
  },
  {
    id: '10',
    title: 'Prosthodontics',
    url: 'https://www.youtube.com/watch?v=BgkDDtOztEQ&list=PLVmK7sDA_arGD5eeTOlnGjXBcTTVCGR82',
    description: 'Comprehensive prosthodontic education covering fixed and removable prostheses. Topics include Kennedy classification, complete dentures, RPD design (connectors, rests, clasps), crown preparations, impression materials, dental materials, implant prosthodontics, cementation, and shade selection principles.'
  },
  {
    id: '11',
    title: 'Pediatric Dentistry',
    url: 'https://www.youtube.com/watch?v=PLAMJJfZ-eo&list=PLVmK7sDA_arFbjxk4KHeqgMj5UCVWtl7p',
    description: 'Learn pediatric dental care from infancy through adolescence. Covers tooth development and eruption, developmental disturbances, primary tooth anatomy and treatment, pulp therapy, space management, behavior management techniques, dental trauma in children, and special healthcare needs.'
  },
  {
    id: '12',
    title: 'Oral Surgery',
    url: 'https://www.youtube.com/watch?v=xdhp4L_w2hc&list=PLVmK7sDA_arEdAp-W5JKaGXg2FZArgd8B',
    description: 'Master oral and maxillofacial surgery principles. Topics include extraction techniques (simple and surgical), impacted teeth management, implant surgery, trauma and orthognathic surgery, orofacial pain, TMJ disorders, biopsy techniques, and medical emergency management in the dental office.'
  },
  {
    id: '13',
    title: 'Operative Dentistry',
    url: 'https://www.youtube.com/watch?v=6U2ZTAWnVvo&list=PLVmK7sDA_arGtXVQCLL8tlS22YTsjyxPW',
    description: 'Comprehensive restorative dentistry education. Covers dental caries (etiology, detection, risk assessment), diagnosis and treatment planning, instrumentation, cavity preparation principles (Classes I-VI), amalgam and composite restorations, bonding agents, and material selection for direct restorations.'
  },
  {
    id: '14',
    title: 'Ethics',
    url: 'https://www.youtube.com/watch?v=_17oaXMduE8&list=PLVmK7sDA_arFJUy8VvqJC3i8TnH7YT6b0',
    description: 'Master ethical principles and professional responsibility in dentistry. Covers the ADA Code of Ethics, autonomy and informed consent, nonmaleficence, beneficence, justice, veracity, confidentiality, abuse/neglect recognition and reporting, and ethical decision-making frameworks.'
  },
  {
    id: '15',
    title: 'Patient Management',
    url: 'https://www.youtube.com/watch?v=Ae4-HGCl2ro&list=PLVmK7sDA_arGID0KfDt7DgFjnjmMy2srL',
    description: 'Develop patient management and communication skills. Topics include professional ethics and liability, communication strategies, health behavior change, anxiety and pain control, public health and epidemiology, prevention, evidence-based dentistry, infection control, and healthcare systems/insurance.'
  }
];

// ============================================================================
// QUICK FACTS FOR EXAM DAY
// ============================================================================

export const EXAM_DAY_TIPS: string[] = [
  'Arrive at least 30 minutes before your scheduled appointment',
  'Bring two forms of valid ID (one must be government-issued photo ID)',
  'No personal items allowed in testing room (lockers provided)',
  'Breaks are optional but recommended between sessions',
  'Each session is 65 minutes with approximately 62 questions',
  'Questions cannot be bookmarked across sessions',
  'Use process of elimination for difficult questions',
  'Read each question stem completely before looking at options',
  'Trust your first instinct unless you have a clear reason to change',
  'Manage your time - approximately 1 minute per question',
  'Stay calm and confident - you have prepared for this!'
];

// ============================================================================
// STUDY RESOURCES
// ============================================================================

export interface StudyResource {
  name: string;
  description: string;
  url: string;
  type: 'website' | 'video' | 'book' | 'course' | 'flashcards' | 'practice';
  isPaid: boolean;
  icon: string;
}

export interface ResourceCategory {
  category: string;
  description: string;
  resources: StudyResource[];
}

export const STUDY_RESOURCES: ResourceCategory[] = [
  {
    category: 'Official Resources',
    description: 'Official exam information and registration',
    resources: [
      {
        name: 'ADA INBDE Official Page',
        description: 'Official exam information, registration, and candidate guide from the American Dental Association',
        url: 'https://www.ada.org/education/testing/inbde',
        type: 'website',
        isPaid: false,
        icon: '🏛️'
      },
      {
        name: 'JCNDE Candidate Guide',
        description: 'Complete candidate guide with exam specifications and content outline',
        url: 'https://www.ada.org/education/testing/inbde',
        type: 'website',
        isPaid: false,
        icon: '📋'
      }
    ]
  },
  {
    category: 'Video Courses',
    description: 'Comprehensive video-based learning resources',
    resources: [
      {
        name: 'Mental Dental (Dr. Ryan)',
        description: 'Comprehensive free YouTube video series covering all INBDE topics with high-yield content',
        url: 'https://www.youtube.com/@MentalDental',
        type: 'video',
        isPaid: false,
        icon: '🎬'
      },
      {
        name: 'Dental Bootcamp',
        description: 'Structured INBDE preparation course with video lectures, practice questions, and study materials',
        url: 'https://bootcamp.com/inbde',
        type: 'course',
        isPaid: true,
        icon: '🎓'
      },
      {
        name: 'Boards and Beyond Dental',
        description: 'Concise video lectures organized by topic for efficient board review',
        url: 'https://www.boardsbeyond.com/',
        type: 'video',
        isPaid: true,
        icon: '📹'
      }
    ]
  },
  {
    category: 'Question Banks',
    description: 'Practice questions and mock exams',
    resources: [
      {
        name: 'Dental Decks',
        description: 'Classic flashcard system with thousands of board-style questions covering all subjects',
        url: 'https://www.dentaldecks.com/',
        type: 'flashcards',
        isPaid: true,
        icon: '📚'
      },
      {
        name: 'Crush Dental Boards',
        description: 'Large question bank with detailed explanations and performance tracking',
        url: 'https://www.crushdentalboards.com/',
        type: 'practice',
        isPaid: true,
        icon: '💪'
      },
      {
        name: 'INBDE Mastery App',
        description: 'Mobile app with practice questions, flashcards, and progress tracking',
        url: 'https://inbdemastery.com/',
        type: 'practice',
        isPaid: true,
        icon: '📱'
      }
    ]
  },
  {
    category: 'Textbooks & Study Guides',
    description: 'Comprehensive reference materials',
    resources: [
      {
        name: 'First Aid for the INBDE',
        description: 'High-yield facts and exam strategies in the classic First Aid format',
        url: 'https://www.amazon.com/First-INBDE-Third-Jason-Portnof/dp/1264264933',
        type: 'book',
        isPaid: true,
        icon: '📖'
      },
      {
        name: 'Mosby\'s Review for the NBDE',
        description: 'Comprehensive review book with practice questions and rationales',
        url: 'https://www.elsevier.com/books/mosbys-review-for-the-nbde/mosby/978-0-323-22562-1',
        type: 'book',
        isPaid: true,
        icon: '📘'
      },
      {
        name: 'BRS Physiology',
        description: 'Board Review Series book excellent for physiology and biochemistry foundations',
        url: 'https://www.lww.com/Product/9781975153601',
        type: 'book',
        isPaid: true,
        icon: '🧬'
      }
    ]
  },
  {
    category: 'Anatomy Resources',
    description: 'Specialized anatomy study tools',
    resources: [
      {
        name: 'Netter\'s Head and Neck Anatomy',
        description: 'Gold standard anatomy atlas with detailed illustrations of head and neck structures',
        url: 'https://www.elsevier.com/books/netters-head-and-neck-anatomy-for-dentistry/norton/978-0-323-39202-5',
        type: 'book',
        isPaid: true,
        icon: '🦷'
      },
      {
        name: 'Anatomy Zone (YouTube)',
        description: 'Free 3D anatomy videos covering head and neck structures',
        url: 'https://www.youtube.com/@AnatomyZone',
        type: 'video',
        isPaid: false,
        icon: '🎥'
      },
      {
        name: 'Kenhub',
        description: 'Interactive anatomy learning platform with quizzes and 3D models',
        url: 'https://www.kenhub.com/',
        type: 'website',
        isPaid: true,
        icon: '🔬'
      }
    ]
  },
  {
    category: 'Community & Forums',
    description: 'Connect with other INBDE candidates',
    resources: [
      {
        name: 'Student Doctor Network - INBDE Forum',
        description: 'Active forum with discussions, study tips, and score reports from past test-takers',
        url: 'https://forums.studentdoctor.net/forums/dat-inbde-discussions.62/',
        type: 'website',
        isPaid: false,
        icon: '👥'
      },
      {
        name: 'Reddit r/DentalSchool',
        description: 'Subreddit with INBDE discussions, study strategies, and peer support',
        url: 'https://www.reddit.com/r/DentalSchool/',
        type: 'website',
        isPaid: false,
        icon: '💬'
      }
    ]
  }
];