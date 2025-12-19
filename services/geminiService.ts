import { GoogleGenAI, Type, Schema } from "@google/genai";
import { YoutubeTranscript } from 'youtube-transcript';
import { Playlist, StudyData } from '../types';

const HEAD_AND_NECK_VIDEOS = [
  { title: "Head & Neck Anatomy | Embryology & Pharyngeal Arches | INBDE", url: "https://www.youtube.com/watch?v=4n2H2eQOmc8" },
  { title: "Head & Neck Anatomy | Bones of the Skull | INBDE", url: "https://www.youtube.com/watch?v=NQtXvfJCtxo" },
  { title: "Head & Neck Anatomy | Foramina of the Skull | INBDE", url: "https://www.youtube.com/watch?v=Yc0xxRAuwG0" },
  { title: "Head & Neck Anatomy | Fossae of the Skull | INBDE", url: "https://www.youtube.com/watch?v=z7TIYC6mfo4" },
  { title: "Head & Neck Anatomy | Fascial Space Infections | INBDE", url: "https://www.youtube.com/watch?v=wux4X9AGOCg" },
  { title: "Head & Neck Anatomy | Muscles of Mastication | INBDE", url: "https://www.youtube.com/watch?v=reqF1EORKSg" },
  { title: "Head & Neck Anatomy | Muscles of Facial Expression | INBDE", url: "https://www.youtube.com/watch?v=cqoOAz8i6nI" },
  { title: "Head & Neck Anatomy | Triangles of the Neck & Neck Muscles | INBDE", url: "https://www.youtube.com/watch?v=Ewj3Wf9D4zw" },
  { title: "Head & Neck Anatomy | Tongue Muscles | INBDE", url: "https://www.youtube.com/watch?v=Zz3cO2MhwhQ" },
  { title: "Head & Neck Anatomy | Soft Palate Muscles | INBDE", url: "https://www.youtube.com/watch?v=4dIGQ3L2YG4" },
  { title: "Head & Neck Anatomy | Pharynx & Larynx Muscles | INBDE", url: "https://www.youtube.com/watch?v=hPmpU72Cgsg" },
  { title: "Head & Neck Anatomy | Ear Muscles | INBDE", url: "https://www.youtube.com/watch?v=VTDQt-KO0YQ" },
  { title: "Head & Neck Anatomy | Eye Muscles | INBDE", url: "https://www.youtube.com/watch?v=FhHqKGLeZkI" },
  { title: "Head & Neck Anatomy | Cranial Nerves | INBDE", url: "https://www.youtube.com/watch?v=1gB90u2JOYg" },
  { title: "Head & Neck Anatomy | Salivary Glands | INBDE", url: "https://www.youtube.com/watch?v=EF-YTC5yHi0" },
  { title: "Head & Neck Anatomy | TMJ Anatomy | INBDE", url: "https://www.youtube.com/watch?v=UjT_8kOnITE" },
  { title: "Head & Neck Anatomy | Craniofacial Arteries | INBDE", url: "https://www.youtube.com/watch?v=m97am1kHpoo" },
  { title: "Head & Neck Anatomy | Craniofacial Veins | INBDE", url: "https://www.youtube.com/watch?v=xcyUm5ZEzng" },
  { title: "Head & Neck Anatomy | Craniofacial Lymphatics | INBDE", url: "https://www.youtube.com/watch?v=BODFN9kzQA8" },
  { title: "Head & Neck Anatomy | PRACTICE QUESTIONS | INBDE", url: "https://www.youtube.com/watch?v=PG6ZFCYt5S4" }
];

const PHARMACOLOGY_VIDEOS = [
  { title: "Local Anesthetics | Categories and Calculations | INBDE, ADAT", url: "https://www.youtube.com/watch?v=5Ujl1VbAcgc" },
  { title: "Local Anesthetics | Injections and Techniques | INBDE, ADAT", url: "https://www.youtube.com/watch?v=eWXuKFSnkIY" },
  { title: "Pharmacology | Antibiotics | INBDE, ADAT", url: "https://www.youtube.com/watch?v=e72G5VKkJng" },
  { title: "Pharmacology | Analgesics | INBDE, ADAT", url: "https://www.youtube.com/watch?v=ZnbDfR2g9rw" },
  { title: "Pharmacology | Pharmacokinetics | INBDE, ADAT", url: "https://www.youtube.com/watch?v=53s41reBCFQ" },
  { title: "Pharmacology | Pharmacodynamics | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Cq5Zi_3mrfo" },
  { title: "Pharmacology | Autonomic Nervous System | INBDE, ADAT", url: "https://www.youtube.com/watch?v=md1vLC2Kwag" },
  { title: "Pharmacology | Cardiovascular Pharmacology | INBDE, ADAT", url: "https://www.youtube.com/watch?v=caJZweuzQO8" },
  { title: "Pharmacology | Central Nervous System | INBDE, ADAT", url: "https://www.youtube.com/watch?v=XcOlxfYynGk" },
  { title: "Pharmacology | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Fng3PLGg6ZI" }
];

const ORAL_RADIOLOGY_VIDEOS = [
  { title: "Fundamentals of X-Rays", url: "https://www.youtube.com/watch?v=SZFqei91R9w" },
  { title: "X-Ray Settings", url: "https://www.youtube.com/watch?v=BxHmsb1Gnyg" },
  { title: "Radiation Dose", url: "https://www.youtube.com/watch?v=GxHsvxywvtE" },
  { title: "Film vs. Digital Imaging", url: "https://www.youtube.com/watch?v=UFsr49CdfJQ" },
  { title: "Types of Radiographs", url: "https://www.youtube.com/watch?v=Rj6QTrOG3hI" },
  { title: "Radiographic Interpretation", url: "https://www.youtube.com/watch?v=SZFqei91R9w&list=PLVmK7sDA_arEPhqt_QjcHwJfbMCFFcs9W&index=6" },
  { title: "PRACTICE QUESTIONS", url: "https://www.youtube.com/watch?v=wDTtl31n1m4" }
];

const ORAL_PATHOLOGY_VIDEOS = [
  { title: "Oral Pathology | Developmental Conditions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=3zcuZ6U7vQA" },
  { title: "Oral Pathology | Mucosal Reactive Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=wzthel3wEcw" },
  { title: "Oral Pathology | Mucosal Infections | INBDE, ADAT", url: "https://www.youtube.com/watch?v=X1rF7Iv5Q_k" },
  { title: "Oral Pathology | Mucosal Immunologic Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=FLjpsVbUbT0" },
  { title: "Oral Pathology | Mucosal Premalignant Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=TYzW59l-nXo" },
  { title: "Oral Pathology | Mucosal Malignant Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=I8XPdNC_Xk8" },
  { title: "Oral Pathology | Connective Tissue Benign Tumors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=rw7gzh25h9o" },
  { title: "Oral Pathology | Connective Tissue Malignant Tumors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=M4l0Vr-gR7o" },
  { title: "Oral Pathology | Salivary Gland Reactive Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=AMV0fQn2QWM" },
  { title: "Oral Pathology | Salivary Gland Benign Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=_8xHh1tk7jY" },
  { title: "Oral Pathology | Salivary Gland Malignant Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Uxv9lSQGiws" },
  { title: "Oral Pathology | Lymphoid Neoplasms | INBDE, ADAT", url: "https://www.youtube.com/watch?v=uMu231idsR0" },
  { title: "Oral Pathology | Odontogenic Cysts | INBDE, ADAT", url: "https://www.youtube.com/watch?v=UPjbNPz_WXs" },
  { title: "Oral Pathology | Odontogenic Tumors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Wp26KRnGfGg" },
  { title: "Oral Pathology | Fibro-Osseous Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=qHpoMDLKGDo" },
  { title: "Oral Pathology | Giant Cell Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=fRahDN7_wDg" },
  { title: "Oral Pathology | Bone Inflammatory Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=-a5-EHnZ_XA" },
  { title: "Oral Pathology | Bone Malignant Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=EHzEbKDgeRU" },
  { title: "Oral Pathology | Hereditary Conditions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=betY_3dGG_M" },
  { title: "Oral Pathology | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=r6gbhR7JTMo" }
];

const PATIENT_MANAGEMENT_VIDEOS = [
  { title: "Patient Management | Ethics & Professional Liability | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Ae4-HGCl2ro" },
  { title: "Patient Management | Communication & Interpersonal Skills | INBDE, ADAT", url: "https://www.youtube.com/watch?v=OQbQOdynzBs" },
  { title: "Patient Management | Health Behavior Change | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Vs84cKOX06M" },
  { title: "Patient Management | Anxiety & Pain Control | INBDE, ADAT", url: "https://www.youtube.com/watch?v=lIKsYXHp0lU" },
  { title: "Patient Management | Public Health & Epidemiology | INBDE, ADAT", url: "https://www.youtube.com/watch?v=CmION0EvzLc" },
  { title: "Patient Management | Prevention of Oral Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=jsYDNY7gtB0" },
  { title: "Patient Management | Evidence-Based Dentistry | INBDE, ADAT", url: "https://www.youtube.com/watch?v=XqzL4f6L_Fo" },
  { title: "Patient Management | Infection Control | INBDE, ADAT", url: "https://www.youtube.com/watch?v=hgk8-2Fweb8" },
  { title: "Patient Management | Materials & Equipment Safety | INBDE, ADAT", url: "https://www.youtube.com/watch?v=xnI1hm5g1K4" },
  { title: "Patient Management | Insurance Terms & Healthcare Systems | INBDE, ADAT", url: "https://www.youtube.com/watch?v=vA0svVty9a0" },
  { title: "Patient Management | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=8jpO19qalIo" }
];

const ORAL_MEDICINE_VIDEOS = [
  { title: "Oral Medicine | Antibiotic Prophylaxis | INBDE", url: "https://www.youtube.com/watch?v=E4waBH2mT5E" },
  { title: "Oral Medicine | Hypertension | INBDE", url: "https://www.youtube.com/watch?v=GpcYL0Aep38" },
  { title: "Oral Medicine | Diabetes | INBDE", url: "https://www.youtube.com/watch?v=MLmLr0KW3f0" },
  { title: "Oral Medicine | ASA Classification | INBDE", url: "https://www.youtube.com/watch?v=-8QB3Rbeqoc" },
  { title: "Oral Medicine | CPR | INBDE", url: "https://www.youtube.com/watch?v=pfFrVkgguvo" },
  { title: "Oral Medicine | COPD & Asthma | INBDE", url: "https://www.youtube.com/watch?v=WqBw1n4u4gU" },
  { title: "Oral Medicine | Steroids & Adrenal Insufficiency | INBDE", url: "https://www.youtube.com/watch?v=QltDNMtEScY" },
  { title: "Oral Medicine | Bisphosphonates | INBDE", url: "https://www.youtube.com/watch?v=rWB9PF77DL8" },
  { title: "Oral Medicine | INR & Bleeding | INBDE", url: "https://www.youtube.com/watch?v=i2rMu91EFuI" },
  { title: "Oral Medicine | Substance Abuse | INBDE", url: "https://www.youtube.com/watch?v=nlTjZr7fW3o" },
  { title: "Oral Medicine | Thyroid Diseases | INBDE", url: "https://www.youtube.com/watch?v=DsB2sMw59Fw" },
  { title: "Oral Medicine | Parathyroid Diseases | INBDE", url: "https://www.youtube.com/watch?v=7hUTO2ui8vE" },
  { title: "Oral Medicine | Pregnancy | INBDE", url: "https://www.youtube.com/watch?v=gcdjtc8MCJg" },
  { title: "Oral Medicine | Pain & Infection Management | INBDE", url: "https://www.youtube.com/watch?v=UTfQhftePto" },
  { title: "Oral Medicine | High Cholesterol | INBDE", url: "https://www.youtube.com/watch?v=GP9Z0xZFiyA" },
  { title: "Oral Medicine | Cancer, Chemotherapy, and Radiation | INBDE", url: "https://www.youtube.com/watch?v=jHbqbzF_Glc" },
  { title: "Oral Medicine | HIV & AIDS | INBDE", url: "https://www.youtube.com/watch?v=MvrSAx0RVGk" },
  { title: "Oral Medicine | GERD & Peptic Ulcers | INBDE", url: "https://www.youtube.com/watch?v=WbFVRyeNrkw" },
  { title: "Oral Medicine | Sleep Apnea | INBDE", url: "https://www.youtube.com/watch?v=YzfNAtuUPRI" },
  { title: "Oral Medicine | Hepatitis | INBDE", url: "https://www.youtube.com/watch?v=knFBu_1-OdQ" },
  { title: "Oral Medicine | Smoking | INBDE", url: "https://www.youtube.com/watch?v=asRFWxvUY6s" },
  { title: "Oral Medicine | Tuberculosis | INBDE", url: "https://www.youtube.com/watch?v=J430y8UMqoE" },
  { title: "Oral Medicine | Multiple Myeloma | INBDE", url: "https://www.youtube.com/watch?v=8W1W__xrIH0" },
  { title: "Oral Medicine | Betel Nut | INBDE", url: "https://www.youtube.com/watch?v=7aw8kL43Eqc" },
  { title: "Oral Medicine | PRACTICE QUESTIONS | INBDE", url: "https://www.youtube.com/watch?v=88TcsTT2ezQ" }
];

const BIOSTATISTICS_VIDEOS = [
  { title: "Biostatistics | Introduction to Clinical Research | INBDE, ADAT", url: "https://www.youtube.com/watch?v=a7i08EIgj4Y" },
  { title: "Biostatistics | Variables | INBDE, ADAT", url: "https://www.youtube.com/watch?v=esuclyl6OiA" },
  { title: "Biostatistics | Sampling & Allocation | INBDE, ADAT", url: "https://www.youtube.com/watch?v=uIbLH-8_wys" },
  { title: "Biostatistics | Research Bias | INBDE, ADAT", url: "https://www.youtube.com/watch?v=o0Iqobm5PYU" },
  { title: "Biostatistics | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=WfeGzK_m0Vg" }
];

const ORTHODONTICS_VIDEOS = [
  { title: "Orthodontics | Growth & Development | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Hb1b3YPHiTE" },
  { title: "Orthodontics | Craniofacial Anomalies | INBDE, ADAT", url: "https://www.youtube.com/watch?v=jMx8Gu7QxpM" },
  { title: "Orthodontics | Development of Occlusion | INBDE, ADAT", url: "https://www.youtube.com/watch?v=ZGge3rNtO60" },
  { title: "Orthodontics | Diagnosis & Treatment Planning | INBDE, ADAT", url: "https://www.youtube.com/watch?v=sf3TWeXHMOY" },
  { title: "Orthodontics | Biology of Tooth Movement | INBDE, ADAT", url: "https://www.youtube.com/watch?v=wV4jxJGeiMI" },
  { title: "Orthodontics | Mechanical Principles of Tooth Movement | INBDE, ADAT", url: "https://www.youtube.com/watch?v=OX9gR4F9NK8" },
  { title: "Orthodontics | Orthodontic Wires & Brackets | INBDE, ADAT", url: "https://www.youtube.com/watch?v=fc_bPRtp8Q0" },
  { title: "Orthodontics | Early Treatment | INBDE, ADAT", url: "https://www.youtube.com/watch?v=IRxyWfmXLXA" },
  { title: "Orthodontics | Comprehensive Treatment & Appliances | INBDE, ADAT", url: "https://www.youtube.com/watch?v=gMKsubigjN0" },
  { title: "Orthodontics | Retention | INBDE, ADAT", url: "https://www.youtube.com/watch?v=vT9Tj_pMOgM" },
  { title: "Orthodontics | Orthognathic Surgery & Complications | INBDE, ADAT", url: "https://www.youtube.com/watch?v=snWs8b3k_2U" },
  { title: "Orthodontics | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=PnBGIMJeCQ0" }
];

const PERIODONTICS_VIDEOS = [
  { title: "Periodontics | Diagnosis & Periodontal Exam | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Pm8s9aqs7Ug" },
  { title: "Periodontics | Classifications | INBDE, ADAT", url: "https://www.youtube.com/watch?v=mAKlXxrykbg" },
  { title: "Periodontics | New Classification System | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Yeq6LO3q4Vo" },
  { title: "Periodontics | Plaque | INBDE, ADAT", url: "https://www.youtube.com/watch?v=DqzfJTCAc4g" },
  { title: "Periodontics | Local Factors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=2RkiPyrUxw8" },
  { title: "Periodontics | Pathogenesis | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Q7o9D2xxWVk" },
  { title: "Periodontics | Treatment Planning | INBDE, ADAT", url: "https://www.youtube.com/watch?v=ctvAcgDGm7Y" },
  { title: "Periodontics | Prognosis | INBDE, ADAT", url: "https://www.youtube.com/watch?v=KEd9lits-So" },
  { title: "Periodontics | Non-Surgical Therapy | INBDE, ADAT", url: "https://www.youtube.com/watch?v=PROYfLW3PAU" },
  { title: "Periodontics | Surgical Therapy | INBDE, ADAT", url: "https://www.youtube.com/watch?v=ewjt-8MRbxY" },
  { title: "Periodontics | Flap Design | INBDE, ADAT", url: "https://www.youtube.com/watch?v=M6--iIfNQQw" },
  { title: "Periodontics | Adjunctive Therapy | INBDE, ADAT", url: "https://www.youtube.com/watch?v=YVlsHc5SvOs" },
  { title: "Periodontics | Prevention & Maintenance | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Pl0nGwSl1aA" },
  { title: "Periodontics | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=BAHu4lPXn64" }
];

const ENDODONTICS_VIDEOS = [
  { title: "Endodontics | Pulp Biology and Tooth Pain | INBDE, ADAT", url: "https://www.youtube.com/watch?v=7EsHL8Sacg0" },
  { title: "Endodontics | Pulpal and Periapical Diagnoses | INBDE, ADAT", url: "https://www.youtube.com/watch?v=DYUnnxaogoI" },
  { title: "Endodontics | Root Canal Treatment | INBDE, ADAT", url: "https://www.youtube.com/watch?v=5PF3Ju25LNc" },
  { title: "Endodontics | Surgical Treatment | INBDE, ADAT", url: "https://www.youtube.com/watch?v=nWxkQQQB3qw" },
  { title: "Endodontics | Procedural Complications | INBDE, ADAT", url: "https://www.youtube.com/watch?v=SGnIYlqel2s" },
  { title: "Endodontics | Traumatic Injuries | INBDE, ADAT", url: "https://www.youtube.com/watch?v=LXyZBwIhHHs" },
  { title: "Endodontics | Adjunctive Treatment | INBDE, ADAT", url: "https://www.youtube.com/watch?v=U6XA28g9tEE" },
  { title: "Endodontics | Case Difficulty | INBDE, ADAT", url: "https://www.youtube.com/watch?v=gGivfordSe4" },
  { title: "Endodontics | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=crA3cOwKXmc" }
];

const PROSTHODONTICS_VIDEOS = [
  { title: "Prosthodontics | General Considerations | INBDE, ADAT", url: "https://www.youtube.com/watch?v=BgkDDtOztEQ" },
  { title: "Prosthodontics | Occlusion & Articulators | INBDE, ADAT", url: "https://www.youtube.com/watch?v=0FL4KBfLlJg" },
  { title: "Prosthodontics | Maxillary Edentulous Anatomy | INBDE, ADAT", url: "https://www.youtube.com/watch?v=OhqheV6Jl3k" },
  { title: "Prosthodontics | Mandibular Edentulous Anatomy | INBDE, ADAT", url: "https://www.youtube.com/watch?v=2No3_SGYWhk" },
  { title: "Prosthodontics | Pre-Prosthetic Surgery | INBDE, ADAT", url: "https://www.youtube.com/watch?v=VZKBb_bb_uc" },
  { title: "Prosthodontics | Complete Dentures - Vertical Dimension & Determinants | INBDE, ADAT", url: "https://www.youtube.com/watch?v=lFPt6LbnjeA" },
  { title: "Prosthodontics | Complete Dentures - Phonetics | INBDE, ADAT", url: "https://www.youtube.com/watch?v=nfi_-09Io5A" },
  { title: "Prosthodontics | Support, Stability, & Retention | INBDE, ADAT", url: "https://www.youtube.com/watch?v=QihnP-ajxBI" },
  { title: "Prosthodontics | Denture Processing & Materials | INBDE, ADAT", url: "https://www.youtube.com/watch?v=KAsotp6l99s" },
  { title: "Prosthodontics | Kennedy Classification | INBDE, ADAT", url: "https://www.youtube.com/watch?v=jW3DWinvLaU" },
  { title: "Prosthodontics | Major & Minor Connectors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=go3XJ302hk4" },
  { title: "Prosthodontics | Rests & Proximal Plates | INBDE, ADAT", url: "https://www.youtube.com/watch?v=cdA7CnLGPxc" },
  { title: "Prosthodontics | Clasp Design & Selection | INBDE, ADAT", url: "https://www.youtube.com/watch?v=-wbvkvqQxtQ" },
  { title: "Prosthodontics | Tooth Preparation | INBDE, ADAT", url: "https://www.youtube.com/watch?v=LMJLocFwrT4" },
  { title: "Prosthodontics | Pontic & Connector Design | INBDE, ADAT", url: "https://www.youtube.com/watch?v=xLEpnKafyX4" },
  { title: "Prosthodontics | Impression Materials | INBDE, ADAT", url: "https://www.youtube.com/watch?v=C2ure3tZuZ4" },
  { title: "Prosthodontics | Gypsum Materials | INBDE, ADAT", url: "https://www.youtube.com/watch?v=T6L_Q3TY63I" },
  { title: "Prosthodontics | Metal Alloys | INBDE, ADAT", url: "https://www.youtube.com/watch?v=nMMSi735VEM" },
  { title: "Prosthodontics | Mechanical Properties | INBDE, ADAT", url: "https://www.youtube.com/watch?v=ZVYFKRBK0Tc" },
  { title: "Prosthodontics | Provisional Crowns | INBDE, ADAT", url: "https://www.youtube.com/watch?v=cwqr460lHLw" },
  { title: "Prosthodontics | Metal-Ceramic & All-Ceramic Crowns | INBDE, ADAT", url: "https://www.youtube.com/watch?v=SfCj6FLCGPM" },
  { title: "Prosthodontics | Shade Selection | INBDE, ADAT", url: "https://www.youtube.com/watch?v=z4x8IxQ92XQ" },
  { title: "Prosthodontics | Dental Cements | INBDE, ADAT", url: "https://www.youtube.com/watch?v=XV2vQEfJccE" },
  { title: "Prosthodontics | Lab Processing of Crowns | INBDE, ADAT", url: "https://www.youtube.com/watch?v=mjmaykudgyA" },
  { title: "Prosthodontics | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=MGwlw0iIDRE" }
];

const PEDIATRIC_DENTISTRY_VIDEOS = [
  { title: "Pediatric Dentistry | Tooth Development and Eruption | INBDE, ADAT", url: "https://www.youtube.com/watch?v=PLAMJJfZ-eo" },
  { title: "Pediatric Dentistry | Developmental Disturbances of Teeth | INBDE, ADAT", url: "https://www.youtube.com/watch?v=_e_B8rTl_rU" },
  { title: "Pediatric Dentistry | Primary Tooth Anatomy | INBDE, ADAT", url: "https://www.youtube.com/watch?v=PsubtLiLToU" },
  { title: "Pediatric Dentistry | Primary Tooth Treatment | INBDE, ADAT", url: "https://www.youtube.com/watch?v=uLz-Ur_Drk4" },
  { title: "Pediatric Dentistry | Space Management | INBDE, ADAT", url: "https://www.youtube.com/watch?v=wtfyOlHGeJY" },
  { title: "Pediatric Dentistry | Pediatric Soft Tissue | INBDE, ADAT", url: "https://www.youtube.com/watch?v=po0Vy9N4kQ4" },
  { title: "Pediatric Dentistry | Dental Trauma | INBDE, ADAT", url: "https://www.youtube.com/watch?v=HGMWudXAnIE" },
  { title: "Pediatric Dentistry | Child Behavior | INBDE, ADAT", url: "https://www.youtube.com/watch?v=QhvpsBma4ac" },
  { title: "Pediatric Dentistry | Behavior Management | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Kd6hy5kndsI" },
  { title: "Pediatric Dentistry | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=WGrvg7ZuPEc" }
];

const ORAL_SURGERY_VIDEOS = [
  { title: "Oral Surgery | Impaction & Extraction Facts | INBDE, ADAT", url: "https://www.youtube.com/watch?v=xdhp4L_w2hc" },
  { title: "Oral Surgery | Instrumentation for Extraction | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Crfag75ztP4" },
  { title: "Oral Surgery | Simple Extraction | INBDE, ADAT", url: "https://www.youtube.com/watch?v=mdE7H8maXcY" },
  { title: "Oral Surgery | Surgical Extraction | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Sr1nJJmi_CY" },
  { title: "Oral Surgery | Implants | INBDE, ADAT", url: "https://www.youtube.com/watch?v=DjxoB2XuDXE" },
  { title: "Oral Surgery | Trauma & Orthognathic Surgery | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Q1U1rOO6t4I" },
  { title: "Oral Surgery | Orofacial Pain | INBDE, ADAT", url: "https://www.youtube.com/watch?v=D3uYW0jEsGs" },
  { title: "Oral Surgery | Temporomandibular Joint Disorders | INBDE, ADAT", url: "https://www.youtube.com/watch?v=YF4nuCNbHs8" },
  { title: "Oral Surgery | Biopsy Techniques | INBDE, ADAT", url: "https://www.youtube.com/watch?v=zB08AVntCUc" },
  { title: "Oral Surgery | Medical Emergencies | INBDE, ADAT", url: "https://www.youtube.com/watch?v=qwIbwnxbzLU" },
  { title: "Oral Surgery | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=Ca0GC0Ph43k" }
];

const OPERATIVE_DENTISTRY_VIDEOS = [
  { title: "Operative Dentistry | Dental Caries | INBDE, ADAT", url: "https://www.youtube.com/watch?v=6U2ZTAWnVvo" },
  { title: "Operative Dentistry | Diagnosis & Treatment Planning | INBDE, ADAT", url: "https://www.youtube.com/watch?v=wMguKv63fWQ" },
  { title: "Operative Dentistry | Instrumentation | INBDE, ADAT", url: "https://www.youtube.com/watch?v=J1S-SgJEuCo" },
  { title: "Operative Dentistry | Cavity Preparation | INBDE, ADAT", url: "https://www.youtube.com/watch?v=WdqJlT1h8xA" },
  { title: "Operative Dentistry | Amalgam | INBDE, ADAT", url: "https://www.youtube.com/watch?v=rrcQfnURiyI" },
  { title: "Operative Dentistry | Composite Resin & Glass Ionomer | INBDE, ADAT", url: "https://www.youtube.com/watch?v=-wxW5fJtzfU" },
  { title: "Operative Dentistry | PRACTICE QUESTIONS | INBDE, ADAT", url: "https://www.youtube.com/watch?v=klcJZEHK_q8" }
];

const ETHICS_VIDEOS = [
  { title: "Ethics | Introduction to ADA Code | INBDE", url: "https://www.youtube.com/watch?v=_17oaXMduE8" },
  { title: "Ethics | Autonomy | INBDE", url: "https://www.youtube.com/watch?v=ZxU8dAfH9KM" },
  { title: "Ethics | Nonmaleficence | INBDE", url: "https://www.youtube.com/watch?v=HYZnrFdz5zc" },
  { title: "Ethics | Beneficence | INBDE", url: "https://www.youtube.com/watch?v=tKH3dwwVBzg" },
  { title: "Ethics | Justice | INBDE", url: "https://www.youtube.com/watch?v=uLfK2hLHc7c" },
  { title: "Ethics | Veracity | INBDE", url: "https://www.youtube.com/watch?v=fdEODBHcibs" },
  { title: "Ethics | Abuse & Neglect | INBDE", url: "https://www.youtube.com/watch?v=PoTZZObJ20E" },
  { title: "Ethics | PRACTICE QUESTIONS | INBDE", url: "https://www.youtube.com/watch?v=AKpOqk_PCg8" }
];

const fetchTranscript = async (url: string): Promise<string> => {
  try {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error) {
    console.warn(`Failed to fetch transcript for ${url}:`, error);
    return '';
  }
};

const generatePrompt = (playlist: Playlist, videoTranscripts: Record<string, string>) => {
  const isHeadAndNeck = playlist.title.includes('Head and Neck');
  const isPharmacology = playlist.title.includes('Pharmacology');
  const isOralRadiology = playlist.title.includes('Oral Radiology');
  const isOralPathology = playlist.title.includes('Oral Pathology');
  const isPatientManagement = playlist.title.includes('Patient Management');
  const isOralMedicine = playlist.title.includes('Oral Medicine');
  const isBiostatistics = playlist.title.includes('Biostatistics');
  const isOrthodontics = playlist.title.includes('Orthodontics');
  const isPeriodontics = playlist.title.includes('Periodontics');
  const isEndodontics = playlist.title.includes('Endodontics');
  const isProsthodontics = playlist.title.includes('Prosthodontics');
  const isPediatricDentistry = playlist.title.includes('Pediatric Dentistry');
  const isOralSurgery = playlist.title.includes('Oral Surgery');
  const isOperativeDentistry = playlist.title.includes('Operative Dentistry');
  const isEthics = playlist.title.includes('Ethics');

  let videoContext = '';
  let videosToProcess: { title: string, url: string }[] = [];

  if (isHeadAndNeck) videosToProcess = HEAD_AND_NECK_VIDEOS;
  else if (isPharmacology) videosToProcess = PHARMACOLOGY_VIDEOS;
  else if (isOralRadiology) videosToProcess = ORAL_RADIOLOGY_VIDEOS;
  else if (isOralPathology) videosToProcess = ORAL_PATHOLOGY_VIDEOS;
  else if (isPatientManagement) videosToProcess = PATIENT_MANAGEMENT_VIDEOS;
  else if (isOralMedicine) videosToProcess = ORAL_MEDICINE_VIDEOS;
  else if (isBiostatistics) videosToProcess = BIOSTATISTICS_VIDEOS;
  else if (isOrthodontics) videosToProcess = ORTHODONTICS_VIDEOS;
  else if (isPeriodontics) videosToProcess = PERIODONTICS_VIDEOS;
  else if (isEndodontics) videosToProcess = ENDODONTICS_VIDEOS;
  else if (isProsthodontics) videosToProcess = PROSTHODONTICS_VIDEOS;
  else if (isPediatricDentistry) videosToProcess = PEDIATRIC_DENTISTRY_VIDEOS;
  else if (isOralSurgery) videosToProcess = ORAL_SURGERY_VIDEOS;
  else if (isOperativeDentistry) videosToProcess = OPERATIVE_DENTISTRY_VIDEOS;
  else if (isEthics) videosToProcess = ETHICS_VIDEOS;

  if (videosToProcess.length > 0) {
    videoContext = `
    For this specific "${playlist.title}" playlist, you MUST use the following videos.
    I have provided the TRANSCRIPT for some videos to help you generate accurate flashcards.
    
    ${videosToProcess.map((v, i) => {
      const transcript = videoTranscripts[v.url] ? `\n    TRANSCRIPT: ${videoTranscripts[v.url].substring(0, 5000)}... (truncated)` : '';
      return `${i + 1}. ${v.title}: ${v.url}${transcript}`;
    }).join('\n    ')}
    `;
  } else {
    // Fallback for other playlists
    videoContext = `
    1. Identify EVERY video in this playlist ("${playlist.title}").
    2. For each video, retrieve the specific YouTube URL (e.g., https://www.youtube.com/watch?v=...).
    `;
  }

  return `
    You are an expert tutor specializing in the INBDE dental examination.
    
    TASK: Generate comprehensive study materials for the "${playlist.title}" playlist.
    
    ${videoContext}
    
    For EACH video listed above, create an independent study module with:
    - "videoTitle": The exact title of the video
    - "videoUrl": The specific YouTube link provided above
    - "summary": A detailed 3-4 paragraph high-yield summary of key clinical concepts
    - "flashcards": Exactly 5 detailed flashcards (Front/Back format) using the provided TRANSCRIPT if available.
    - "multipleChoice": Exactly 3 clinical scenario MCQs with 4 options each, correct answer, and detailed explanation
    - "trueFalse": Exactly 3 True/False statements with detailed reasoning
    
    CRITICAL: The output MUST be a valid JSON object with:
    - "playlistTitle": "${playlist.title}"
    - "playlistUrl": "${playlist.url}"
    - "modules": An array containing one object for EACH video above
    
    Ensure 100% accuracy to Dr. Ryan's Mental Dental curriculum.
  `;
};

const studyDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    playlistTitle: { type: Type.STRING },
    playlistUrl: { type: Type.STRING },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          videoTitle: { type: Type.STRING },
          videoUrl: { type: Type.STRING },
          summary: { type: Type.STRING },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              },
              required: ["front", "back"]
            }
          },
          multipleChoice: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          },
          trueFalse: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                statement: { type: Type.STRING },
                isTrue: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING }
              },
              required: ["statement", "isTrue", "explanation"]
            }
          }
        },
        required: ["videoTitle", "videoUrl", "summary", "flashcards", "multipleChoice", "trueFalse"]
      }
    }
  },
  required: ["playlistTitle", "playlistUrl", "modules"]
};

export const generatePlaylistData = async (apiKey: string, playlist: Playlist): Promise<StudyData> => {
  const ai = new GoogleGenAI({ apiKey });

  // 1. Identify which videos we are processing
  let videosToFetch: { title: string, url: string }[] = [];
  if (playlist.title.includes('Head and Neck')) videosToFetch = HEAD_AND_NECK_VIDEOS;
  else if (playlist.title.includes('Pharmacology')) videosToFetch = PHARMACOLOGY_VIDEOS;
  else if (playlist.title.includes('Oral Radiology')) videosToFetch = ORAL_RADIOLOGY_VIDEOS;
  else if (playlist.title.includes('Oral Pathology')) videosToFetch = ORAL_PATHOLOGY_VIDEOS;
  else if (playlist.title.includes('Patient Management')) videosToFetch = PATIENT_MANAGEMENT_VIDEOS;
  else if (playlist.title.includes('Oral Medicine')) videosToFetch = ORAL_MEDICINE_VIDEOS;
  else if (playlist.title.includes('Biostatistics')) videosToFetch = BIOSTATISTICS_VIDEOS;
  else if (playlist.title.includes('Orthodontics')) videosToFetch = ORTHODONTICS_VIDEOS;
  else if (playlist.title.includes('Periodontics')) videosToFetch = PERIODONTICS_VIDEOS;
  else if (playlist.title.includes('Endodontics')) videosToFetch = ENDODONTICS_VIDEOS;
  else if (playlist.title.includes('Prosthodontics')) videosToFetch = PROSTHODONTICS_VIDEOS;
  else if (playlist.title.includes('Pediatric Dentistry')) videosToFetch = PEDIATRIC_DENTISTRY_VIDEOS;
  else if (playlist.title.includes('Oral Surgery')) videosToFetch = ORAL_SURGERY_VIDEOS;
  else if (playlist.title.includes('Operative Dentistry')) videosToFetch = OPERATIVE_DENTISTRY_VIDEOS;
  else if (playlist.title.includes('Ethics')) videosToFetch = ETHICS_VIDEOS;

  // 2. Fetch transcripts (in parallel, but limited to avoid rate limits if necessary)
  const videoTranscripts: Record<string, string> = {};

  // We'll try to fetch transcripts for the first 5 videos to save time/bandwidth for now, 
  // or all of them if the user wants deep analysis. Let's do all but handle errors gracefully.
  const transcriptPromises = videosToFetch.map(async (v) => {
    const text = await fetchTranscript(v.url);
    if (text) videoTranscripts[v.url] = text;
  });

  await Promise.all(transcriptPromises);

  try {
    // Use gemini-1.5-flash-latest which is stable and has better quota
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: generatePrompt(playlist, videoTranscripts),
      config: {
        responseMimeType: 'application/json',
        responseSchema: studyDataSchema,
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");

    const data = JSON.parse(text) as StudyData;

    // Ensure required fields
    data.playlistTitle = playlist.title;
    data.playlistUrl = playlist.url;

    if (!data.modules || !Array.isArray(data.modules)) {
      data.modules = [];
    }

    return data;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};