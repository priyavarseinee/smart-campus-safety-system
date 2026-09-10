// Christ University Kengeri Campus Blocks & Zones
export const CHRIST_KENGERI_BLOCKS = [
  "Main Gate",
  "KNS",
  "Block 1 (MBA)",
  "Block 2 (ECE, CSE)",
  "Block 3 (Sciences & Humanities, AIML)",
  "Block 4 (Library, South Canteen)",
  "Block 4 (Girls Hostel)",
  "Block 5 (Psychology, BBA)",
  "Block 6 (EEE, Mechanical)",
  "Architecture Block",
  "Devadan Hall (CIVIL)",
  "Devadan Hostel",
  "Basketball Court",
  "Chapel",
  "Other (Specify Custom Location)"
];

// Defined Incident Categories with Specific Helpline & Emergency Desk Numbers
export const INCIDENT_CATEGORIES = [
  { id: 'medical', label: 'Medical Emergency / Ambulance', priority: 'HIGH', helpline: '+91 9442868933', department: 'Campus Ambulance & Health Center Desk' },
  { id: 'fire', label: 'Fire Emergency / Rescue', priority: 'HIGH', helpline: '+91 9442868933', department: 'Fire Squad & Disaster Response Team' },
  { id: 'harassment', label: 'Harassment / Ragging / Bullying', priority: 'HIGH', helpline: '+91 9442868933', department: "Women's Safety & Anti-Ragging Cell" },
  { id: 'cybercrime', label: 'Cybercrime / Online Threat', priority: 'MEDIUM', helpline: '+91 9442868933', department: 'Campus Cyber Cell & Digital Security Desk' },
  { id: 'accident', label: 'Accident / Severe Injury', priority: 'HIGH', helpline: '+91 9442868933', department: 'First Aid & Trauma Response Desk' },
  { id: 'threat', label: 'Security Threat / Assault', priority: 'HIGH', helpline: '+91 8639527123', department: 'Chief Security Officer & Rapid Patrol' },
  { id: 'suspicious', label: 'Suspicious Activity', priority: 'MEDIUM', helpline: '+91 8639527123', department: 'CCTV Surveillance & Control Room' },
  { id: 'infrastructure', label: 'Infrastructure Hazard / Light / Lift', priority: 'LOW', helpline: '+91 9442868933', department: 'Campus Maintenance & Lift Control' }
];

// Step-by-Step Security Response Procedures for All Emergency Categories
export const CATEGORY_PROGRESS_UPDATES = {
  medical: [
    "Step 1: Security Officer called Campus Health Center & dispatched Campus Ambulance (+91 9442868933).",
    "Step 2: Paramedic staff & ambulance arriving shortly at student location.",
    "Step 3: Paramedic team arrived on spot; emergency first-aid administered.",
    "Step 4: Patient stabilized and safely escorted to Campus Health Center."
  ],
  fire: [
    "Step 1: Security Officer dispatched fire response squad & alerted Fire Control (+91 9442868933).",
    "Step 2: Fire response team deployed with extinguishers & safety gear to block.",
    "Step 3: Fire area cordoned off and suppression active by trained personnel.",
    "Step 4: Fire completely extinguished, area ventilated and declared safe by Fire Marshal."
  ],
  harassment: [
    "Step 1: Security Officer alerted Women's Safety Cell & Anti-Ragging Squad (+91 9442868933).",
    "Step 2: Women Safety Officer & Student Counselor dispatched to location.",
    "Step 3: Statement recorded, offender identified and escorted to Security Office.",
    "Step 4: Protection ensured, case escalated to Anti-Ragging Committee & resolved."
  ],
  cybercrime: [
    "Step 1: Security Officer logged report & alerted Campus Cyber Crime Cell (+91 9442868933).",
    "Step 2: IT Security team tracing digital log & securing student credentials.",
    "Step 3: Evidence documented, offender IP/account blocked on campus network.",
    "Step 4: Account restored, student advised and incident report closed by Cyber Cell."
  ],
  accident: [
    "Step 1: Security Guard contacted First Aid & Trauma Response Desk (+91 9442868933).",
    "Step 2: Trauma response team dispatched to spot with medical kit.",
    "Step 3: Injured student attended, emergency bandage and first aid provided.",
    "Step 4: Student safely transferred for medical evaluation; case report logged."
  ],
  threat: [
    "Step 1: Security Officer alerted Rapid Patrol & Chief Security (+91 8639527123).",
    "Step 2: Armed patrol team dispatched to intercept and secure zone.",
    "Step 3: Threat neutralized, involved parties questioned and separated.",
    "Step 4: Campus area secured, threat cleared and logged with Chief Security Officer."
  ],
  suspicious: [
    "Step 1: Security Guard notified CCTV Control Room (+91 8639527123) & nearby patrol.",
    "Step 2: High-definition CCTV zoomed in on location; patrol intercepting.",
    "Step 3: Suspicious individual / item inspected and verified by security team.",
    "Step 4: Clearance confirmed, no danger found or unauthorized person escorted out."
  ],
  infrastructure: [
    "Step 1: Security Officer contacted Estate Maintenance & Electrician (+91 9442868933).",
    "Step 2: Maintenance technicians dispatched to cordoned hazard zone.",
    "Step 3: Electrical repair / lift rescue in progress by engineering team.",
    "Step 4: Hazard fully repaired, safety inspection verified and area reopened."
  ],
  other: [
    "Step 1: Security Officer logged report & alerted Security Control (+91 8639527123).",
    "Step 2: Patrol team dispatched to location.",
    "Step 3: On-site inspection and response active.",
    "Step 4: Incident fully resolved and cleared."
  ]
};

// Complete Official 57-Student Dataset Transcribed from Official Register & Contact Sheet
export const PRESET_STUDENTS = [
  { slNo: 1, regNo: '2460370', name: 'HARSHDEEP SHARMA', email: 'harshdeep.sharma@btech.christuniversity.in', phone: '9492601634', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 2, regNo: '2460397', name: 'LAYA SHAJU', email: 'laya.shaju@btech.christuniversity.in', phone: '7594862779', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 3, regNo: '2462001', name: 'AANON THOMAS LINO', email: 'aanon.thomas@btech.christuniversity.in', phone: '9036907045', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 4, regNo: '2462004', name: 'ABEL ALEXANDER', email: 'abel.alexander@btech.christuniversity.in', phone: '8848618006', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 5, regNo: '2462007', name: 'ABHISHEK NATH', email: 'abhishek.nath@btech.christuniversity.in', phone: '9986322522', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 6, regNo: '2462013', name: 'ABISHEK K S', email: 'abishek.ks@btech.christuniversity.in', phone: '8660990521', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 7, regNo: '2462016', name: 'ADITHYA BOOPESH', email: 'adithya.boopesh@btech.christuniversity.in', phone: '9108736460', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 8, regNo: '2462020', name: 'AKSHATHA N', email: 'akshatha.n@btech.christuniversity.in', phone: '6362795028', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 9, regNo: '2462023', name: 'ALAN GEORGE JOSEPH', email: 'alan.georgejoseph@btech.christuniversity.in', phone: '8606783984', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 10, regNo: '2462026', name: 'ALEN SAIJO', email: 'alen.saijo@btech.christuniversity.in', phone: '9778440752', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 11, regNo: '2462029', name: 'ALIVIYA JOBY', email: 'aliviya.joby@btech.christuniversity.in', phone: '9188711128', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 12, regNo: '2462032', name: 'ALVIN V THARIAN', email: 'alvin.v@btech.christuniversity.in', phone: '7736075343', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 13, regNo: '2462035', name: 'ANJANA THOMAS', email: 'anjana.thomas@btech.christuniversity.in', phone: '8800676509', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 14, regNo: '2462038', name: 'ANN LIYA SANTU', email: 'ann.liya@btech.christuniversity.in', phone: '9868210781', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 15, regNo: '2462041', name: 'ANNMARIE VINISH', email: 'annmarie.vinish@btech.christuniversity.in', phone: '8921323033', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 16, regNo: '2462044', name: 'ANUSH JOWIN A', email: 'anush.jowin@btech.christuniversity.in', phone: '7892027931', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 17, regNo: '2462047', name: 'ARYAN SHARMA', email: 'aryan.sharma@btech.christuniversity.in', phone: '8310090388', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 18, regNo: '2462053', name: 'AVREL LEANDRA PINTO', email: 'avrel.leandra@btech.christuniversity.in', phone: '8197290928', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 19, regNo: '2462056', name: 'BENNETT ROY', email: 'bennett.roy@btech.christuniversity.in', phone: '8619408731', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 20, regNo: '2462060', name: 'DARAIN BRIT A', email: 'darain.brit@btech.christuniversity.in', phone: '7795021842', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 21, regNo: '2462063', name: 'DEVANANDA VANIYAN SURENDRAN', email: 'devananda.vaniyan@btech.christuniversity.in', phone: '8590214826', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 22, regNo: '2462066', name: 'DUGGEMPUDI PRAVEEN KUMAR REDDY', email: 'duggempudi.praveen@btech.christuniversity.in', phone: '6304747298', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 23, regNo: '2462069', name: 'FEMI K E', email: 'femi.ke@btech.christuniversity.in', phone: '8903576353', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 24, regNo: '2462072', name: 'GEORGE THOMAS', email: 't.george@btech.christuniversity.in', phone: '7902864562', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 25, regNo: '2462075', name: 'GOKULAKRISHNAN', email: 'gokulakrishnan.m@btech.christuniversity.in', phone: '7010827200', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 26, regNo: '2462078', name: 'JASON CYRUS I', email: 'jason.cyrus@btech.christuniversity.in', phone: '9901308818', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 27, regNo: '2462082', name: 'JERUSHA S', email: 'jerusha.s@btech.christuniversity.in', phone: '9019527918', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 28, regNo: '2462086', name: 'JINKALA SHAHANAZ', email: 'jinkala.shahanaz@btech.christuniversity.in', phone: '9390053317', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 29, regNo: '2462089', name: 'JONATHAN ANTHONY CARRASCO', email: 'jonathan.anthony@btech.christuniversity.in', phone: '9146731959', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 30, regNo: '2462092', name: 'JOSHUA KURIAKOSE MATHEW', email: 'joshua.kuriakose@btech.christuniversity.in', phone: '8089304254', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 31, regNo: '2462095', name: 'JULIUS B THOMAS', email: 'julius.b@btech.christuniversity.in', phone: '8867185027', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 32, regNo: '2462100', name: 'KRIPA MARIA JESTIN', email: 'kripa.maria@btech.christuniversity.in', phone: '9544376538', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 33, regNo: '2462106', name: 'KURAGAYALA RACHEL', email: 'kuragayala.rachel@btech.christuniversity.in', phone: '9014889077', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 34, regNo: '2462110', name: 'M E LIJO PAUL', email: 'm.e@btech.christuniversity.in', phone: '7418658638', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 35, regNo: '2462113', name: 'MERVIN A', email: 'mervin.a@btech.christuniversity.in', phone: '9345464915', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 36, regNo: '2462120', name: 'NEVAN MIRANDA', email: 'nevan.miranda@btech.christuniversity.in', phone: '7892713876', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 37, regNo: '2462124', name: 'PIERRE JEAN D\'SOUZA', email: 'pierre.jean@btech.christuniversity.in', phone: '8421350793', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 38, regNo: '2462127', name: 'PRIYAVARSEINEE ANTHIYUR SOMASUNDARAM', email: 'priyavarseinee.anthiyur@btech.christuniversity.in', phone: '9442868933', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 39, regNo: '2462130', name: 'R JERPHIN', email: 'r.jerphin@btech.christuniversity.in', phone: '7305695032', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 40, regNo: '2462133', name: 'RAHUL J PRAKASH', email: 'rahul.jprakash@btech.christuniversity.in', phone: '9495942745', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 41, regNo: '2462136', name: 'REYAN V RINOJ', email: 'reyan.v@btech.christuniversity.in', phone: '8754582005', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 42, regNo: '2462142', name: 'SAN MARIA JOBY', email: 'san.maria@btech.christuniversity.in', phone: '8105929341', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 43, regNo: '2462187', name: 'SABHARIMANIVEL', email: 'sabharimanivel.b@btech.christuniversity.in', phone: '7708787165', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 44, regNo: '2462148', name: 'SHERYN ANAND', email: 'sheryn.anand@btech.christuniversity.in', phone: '9731188225', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 45, regNo: '2462151', name: 'SONAL JOY', email: 'sonal.joy@btech.christuniversity.in', phone: '9110476459', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 46, regNo: '2462154', name: 'SREESHNAVE S R', email: 'sreeshnave.s@btech.christuniversity.in', phone: '8123615601', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 47, regNo: '2462157', name: 'STEVEN MATHEW BINU', email: 'steven.mathew@btech.christuniversity.in', phone: '7025050288', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 48, regNo: '2462160', name: 'TANISHA CHHETRI', email: 'tanisha.chhetri@btech.christuniversity.in', phone: '8016232407', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 49, regNo: '2462166', name: 'UMESHWAR KUMAR PANDIT', email: 'umeshwar.kumar@btech.christuniversity.in', phone: '8431273450', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 50, regNo: '2462169', name: 'VINAYAK VIVEK', email: 'vinayak.vivek@btech.christuniversity.in', phone: '8088904945', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 51, regNo: '2462174', name: 'YANDAPALLI ARRIN NISCHAL PAUL', email: 'yandapalli.arrin@btech.christuniversity.in', phone: '9182886023', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 52, regNo: '2462184', name: 'MISHAEL JULIAN', email: 'mishael.julian@btech.christuniversity.in', phone: '9513222074', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 53, regNo: '2462190', name: 'SHERWIN RICHARD RANJITH', email: 'sherwin.richard@btech.christuniversity.in', phone: '8078322743', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 54, regNo: '2462191', name: 'SHOMIK SAHU', email: 'shomik.sahu@btech.christuniversity.in', phone: '9790835779', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 55, regNo: '2462192', name: 'PAUL JESTIN ABHISHEK', email: 'paul.jestin@btech.christuniversity.in', phone: '7093499350', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 56, regNo: '2462835', name: 'ABHISHAN FRANCIS', email: 'abhishan.francis@btech.christuniversity.in', phone: '9778358669', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' },
  { slNo: 57, regNo: '2463021', name: 'GUTHA NIHITHA', email: 'gutha.nihitha@btech.christuniversity.in', phone: '8639527123', className: '4BTAD - AI & DS', dept: 'AI & DS', course: 'B.Tech', year: '2024-2028' }
];
