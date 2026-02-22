import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ChevronRight, FileCode, AlertCircle, ExternalLink, ArrowLeft, Lock, Gavel, Eye, Github } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";

const TRACKER_DATA = [
  {
    state: 'WA',
    bill: 'HB 2320',
    sponsor: 'Rep. Osman Salahuddin',
    url: 'https://app.leg.wa.gov/BillSummary/?BillNumber=2320&Year=2026',
    pdfUrl: 'https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/House%20Bills/2320-S.E.pdf',
    status: 'PASSED HOUSE',
    mechanism: 'Private-use prohibition, digital code liability',
    category: 'Files/Hardware',
    description: 'Prohibits private use of 3D printers and CNC mills for firearm parts and expands liability for digital manufacturing code.'
  },
  {
    state: 'WA',
    bill: 'HB 2321',
    sponsor: 'Rep. Osman Salahuddin',
    url: 'https://app.leg.wa.gov/billsummary/?BillNumber=2321&Year=2026',
    pdfUrl: 'https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/House%20Bills/2321.pdf',
    status: 'STALLED',
    mechanism: 'Blocking features, anti-circumvention',
    category: 'Hardware/Software',
    description: 'Requires blocking features that cannot be defeated by users and imposes compliance standards on printer software controls.'
  },
  {
    state: 'NY',
    bill: 'A2228',
    sponsor: 'Asm. Jenifer Rajkumar',
    url: 'https://www.nysenate.gov/legislation/bills/2025/A2228',
    pdfUrl: 'https://legislation.nysenate.gov/pdf/bills/2025/A2228',
    status: 'STALLED',
    mechanism: 'Scope expansion to subtractive manufacturing',
    category: 'Hardware/Files',
    description: 'Extends mandates to 3D printers, CNC mills, and other subtractive manufacturing pathways.'
  },
  {
    state: 'NY',
    bill: 'S.9005',
    sponsor: 'Budget Bill (Part C)',
    url: 'https://www.nysenate.gov/legislation/bills/2025/S9005',
    pdfUrl: 'https://legislation.nysenate.gov/pdf/bills/2025/S9005A',
    status: 'IN COMMITTEE',
    mechanism: 'Budget rider restrictions',
    category: 'Hardware/Files',
    description: 'Buries similar 3D printer restrictions inside the state budget bill.'
  },
  {
    state: 'NY',
    bill: 'A10005',
    sponsor: 'Budget Bill (Part C)',
    url: 'https://www.nysenate.gov/legislation/bills/2025/A10005',
    pdfUrl: 'https://legislation.nysenate.gov/pdf/bills/2025/A10005',
    status: 'IN COMMITTEE',
    mechanism: 'Assembly companion budget rider',
    category: 'Hardware/Files',
    description: 'Assembly companion to S.9005 that embeds the same 3D printer restrictions in the budget; currently in Ways and Means Committee.'
  },
  {
    state: 'CA',
    bill: 'AB 1263',
    sponsor: 'Asm. Mike A. Gipson',
    url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260AB1263',
    pdfUrl: 'https://leginfo.legislature.ca.gov/faces/billPdf.xhtml?bill_id=202520260AB1263',
    status: 'LAW',
    mechanism: 'Mandate expansion to 3D and CNC',
    category: 'Hardware/Files',
    description: 'Extends mandate language to cover both 3D printers and CNC mills.'
  },
  {
    state: 'CA',
    bill: 'AB 2047',
    sponsor: 'Asm. Rebecca Bauer-Kahan',
    url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260AB2047',
    pdfUrl: 'https://leginfo.legislature.ca.gov/faces/billPdf.xhtml?bill_id=202520260AB2047',
    status: 'IN COMMITTEE',
    mechanism: 'DOJ roster, certified algorithms, slicer coupling',
    category: 'Hardware/Software',
    description: 'Requires DOJ to publish performance standards for blocking technology by July 1, 2027. Bans sale of noncompliant printers starting March 1, 2029.'
  },
  {
    state: 'CO',
    bill: 'HB26-1144',
    sponsor: 'Rep. Gilchrist / Rep. Boesenecker / Sen. Sullivan / Sen. Wallace',
    url: 'https://leg.colorado.gov/bills/HB26-1144',
    pdfUrl: 'https://leg.colorado.gov/bill_files/111311/download',
    status: 'PASSED COMMITTEE',
    mechanism: 'Manufacture ban, instruction restrictions',
    category: 'Files/Hardware',
    description: 'Prohibits distributing digital instructions used to program a 3D printer or CNC machine to make firearms.'
  },
  {
    state: 'MN',
    bill: 'HF 3407 / SF 3661',
    sponsor: 'Rep. Dave Pinto',
    url: 'https://www.revisor.mn.gov/bills/94/2026/0/HF/3407/',
    pdfUrl: 'https://www.revisor.mn.gov/bills/94/2026/0/HF/3407/versions/0/pdf/',
    status: 'IN COMMITTEE',
    mechanism: 'Ghost gun ban, license-only 3D printing, CAD file restrictions',
    category: 'Files/Hardware',
    description: 'Prohibits sale and possession of ghost guns, limits 3D firearm printing to federally licensed manufacturers, and bans distribution of firearm design files. Introduced February 17, 2026; referred to Public Safety and Judiciary committees.'
  }
];

const VIDEO_DATA = [
  { id: 'kS-9ISzMhBM', title: "Washington wants your 3D printer to spy on you - here's the bill", channel: 'Louis Rossmann', youtube: 'https://www.youtube.com/watch?v=kS-9ISzMhBM' },
  { id: 'QvBVZIJWejs', title: 'No Longer Fiction. The 3D Printing Ban Is Here', channel: 'Loyal Moses', youtube: 'https://www.youtube.com/watch?v=QvBVZIJWejs' },
  { id: '0yE17gZ9aeM', title: 'Regulate 3D Printing?', channel: '3D Printing Nerd', youtube: 'https://www.youtube.com/watch?v=0yE17gZ9aeM' },
  { id: 'fvpRXbo-zyE', title: "3D Printing Ban Laws Won't Work...", channel: 'LMG Clips', youtube: 'https://www.youtube.com/watch?v=fvpRXbo-zyE' },
  { id: 'tGEVra9U91I', title: '3D Printer Ban Company Exposed', channel: 'Loyal Moses', youtube: 'https://www.youtube.com/watch?v=tGEVra9U91I' },
  { id: 'LNWoibDrdD4', title: 'You Could End Up In JAIL For This!! - Making Awesome 252', channel: '3D Musketeers', youtube: 'https://www.youtube.com/watch?v=LNWoibDrdD4' },
  { id: 's6Iwoq2faMk', title: 'The 3D Printing Ban and How They Did It', channel: 'Loyal Moses', youtube: 'https://www.youtube.com/watch?v=s6Iwoq2faMk' },
  { id: 'AaT-oJRLYTE', title: '3D Printing Could Be Over.', channel: 'PSR', youtube: 'https://www.youtube.com/watch?v=AaT-oJRLYTE' },
  { id: 'wOpIrk4tn9I', title: 'They Want To BAN 3D Printed Firearms', channel: '3D Musketeers', youtube: 'https://www.youtube.com/watch?v=wOpIrk4tn9I' },
  { id: 'Nhz6vao13bs', title: 'California Just Killed Open Source', channel: 'Loyal Moses', youtube: 'https://www.youtube.com/watch?v=Nhz6vao13bs' }
];

const BILL_ANALYSIS_DATA = {
  'CA AB 2047': {
    title: 'California AB 2047: Integrated Preprint Software Mandates',
    core_issue: 'Slicer Coupling & Algorithmic Detection',
    url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260AB2047',
    pdfUrl: 'https://leginfo.legislature.ca.gov/faces/billPdf.xhtml?bill_id=202520260AB2047',
    summary: 'AB 2047 regulates 3D printers by establishing a requirement for embedded "blocking technology." It tasks the Department of Justice with publishing performance standards for this mechanism. Additionally, the bill defines "integrated preprint software design," creating a regulatory framework that couples hardware operation to specific, certified slicing software.',
    markdown_text: `
## Civil Code
### Title 21.1. Firearm Printing Prevention Act

**Section 3273.632 (f):** _"'Firmware design' means integration of a firearms blueprint detection algorithm directly into a three-dimensional printer’s firmware, such that any geometric code received by the printer must be evaluated by the algorithm before the printer will proceed to print..."_

> **Analysis:** This definition establishes a requirement that closely couples slicing software with firmware. Hardcoding the detection algorithm into the firmware presents compliance challenges for manufacturers utilizing open-source microcontroller architectures and standardized protocols like G-Code.

**Section 3273.632 (h):** _"'Integrated pre-print software design' means a limitation of a three-dimensional printer’s operation to accept geometric code for printing exclusively from a single slicer or other preprint software... and integration of a firearms blueprint detection algorithm into that preprint software..."_

> **Analysis:** The legislative text specifies that a printer must accept code from a "single slicer." This diverges from the general interoperability of standard G-Code that forms the basis of current consumer and industrial additive manufacturing.

**Section 3273.633 (a):** _"The department or other relevant state agency may create, maintain, and regularly update a library of firearm blueprint files and illegal firearm parts blueprint files for use by firearm blueprint detection algorithm designers..."_

> **Analysis:** This establishes a state-maintained file library for algorithmic training, introducing new data-flow requirements for users prototyping proprietary designs and creating a continuous update burden for hardware manufacturers to stay in compliance.

### Verification and Compliance

**Section 3273.636 (c)(2):** _"The lists shall be updated no less frequently than on a quarterly basis and made accessible on the department’s internet website. Retailers or distributors of three-dimensional printers shall consult the lists posted on the department’s internet website to ensure their inventory for sales in California consists of three-dimensional printers in compliance with this title."_

> **Analysis:** This requires retailers to consult a state-maintained roster prior to sale. Printers that have not undergone the "department-certified" workflow and submitted self-attestation records would not appear on this list and therefore could not be legally sold in the state.
`
  },
  'NY S.9005': {
    title: 'New York S.9005: Hardware Blocking & File Libraries',
    core_issue: 'Hardware Modification Bans & File Surveillance',
    url: 'https://www.nysenate.gov/legislation/bills/2025/S9005',
    pdfUrl: 'https://legislation.nysenate.gov/pdf/bills/2025/S9005A',
    summary: 'A retail restriction amending the General Business Law to prohibit the sale or delivery of unequipped 3D printers. It establishes a state-maintained library of digital blueprint files to continuously train detection algorithms, extending regulatory workflows to geometric CAD data. It also introduces felony penalties for the distribution of digital manufacturing code.',
    markdown_text: `
## Penal Law
### Section 265.00. Definitions.

**Subdivision 38:** _"'Three-dimensional printer' means: (a) any machine capable of rendering a three-dimensional object from a digital design file using additive manufacturing; or (b) any machine capable of making three-dimensional modifications to an object from a digital design file using subtractive manufacturing."_

> **Analysis:** The text expands the definition of 'printer' to include traditional CNC milling and subtractive manufacturing tools. This reflects a broader scope to regulate automated manufacturing equipment regardless of the underlying technique.

**Subdivision 39:** _"'Digital firearm manufacturing code' means any digital instructions in the form of computer-aided design files or other code or instructions stored and displayed in electronic format as a digital model that may be used to program a three-dimensional printer or a computer numerical control (CNC) milling machine..."_

> **Analysis:** The definition explicitly includes general-purpose CAD and CAM formats. As basic geometric shapes can be incorporated into regulated items, this broad definition could create legal ambiguity around the distribution of general mechanical engineering models.

### Section 265.10. Limits.

**Subdivision 11:** _"Any person who sells, offers to sell, transfers, distributes, or otherwise disposes of a digital firearm manufacturing code to any person who does not hold... a valid type seven federal firearms license, is guilty of a class E felony."_

> **Analysis:** This regulates the distribution of specific digital files. Because "manufacturing code" can apply to standard industry formats like STEP, STL, and G-Code, this language introduces new compliance liabilities for engineering education, file-sharing platforms, and digital archiving services.

## Executive Law
### Section 837-aa. Firearm prevention technology requirements for three-dimensional printers.

**Subdivision 1 (b):** _"'Blocking technology' means hardware, software, firmware, or other integrated technological measures capable of ensuring a three-dimensional printer will not proceed to print any print job unless the underlying three-dimensional printing file has been evaluated by a firearms blueprint detection algorithm and determined not to be a printing file that would produce a firearm or illegal firearm parts."_

> **Analysis:** This establishes a pre-print validation requirement. All scheduled print jobs must be evaluated by the detection algorithm to determine compliance before the hardware is permitted to initiate the manufacturing process.

**Subdivision 3 (b):** _"The division shall... be authorized to create and maintain a library of firearms blueprint files and illegal firearm parts blueprint files... The library shall be made available to three-dimensional printer manufacturers, vendors with demonstrated expertise in software development, or experts in computational design or public safety, for the development or improvement of blocking technology and firearm blueprint detection algorithms."_

> **Analysis:** This establishes a state-maintained file library for algorithmic training. For a printer or slicer to implement this detection, it would need to cross-reference user files against external or regularly updated databases. This introduces new data-flow requirements for users prototyping proprietary designs and creates a continuous update burden for hardware manufacturers.

## General Business Law
### Section 396-eeee. Three-dimensional printers.

**Subdivision 1:** _"No person, firm or corporation shall sell or deliver any three-dimensional printer in the state of New York unless such printer is equipped with blocking technology..."_

> **Analysis:** This serves as a retail restriction on printers lacking the newly defined blocking technology.
`
  },
  'WA HB 2321': {
    title: 'Washington HB 2321: Three-Dimensional Printer Blocking Tech',
    core_issue: 'Required Software Control Processes',
    url: 'https://app.leg.wa.gov/billsummary/?BillNumber=2321&Year=2026',
    pdfUrl: 'https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/House%20Bills/2321.pdf',
    summary: 'HB 2321 regulates 3D printers by establishing a requirement for embedded "blocking features." It mandates a software controls process with a detection algorithm to intercept and analyze files prior to printing, and introduces a state-maintained database of files to update these detection systems.',
    markdown_text: `
## Title 19 RCW - New Chapter

### Definitions & Prohibitions

**Sec. 1 (2):** _"'Equipped with blocking features' means a three-dimensional printer has integrated a software controls process that deploys a firearms blueprint detection algorithm, such that those features identify and reject print requests for firearms or illegal firearm parts with a high degree of reliability and cannot be overridden or otherwise defeated by a user with significant technical skill."_

> **Analysis:** The requirement that the block "cannot be overridden" or "otherwise defeated" poses a direct conflict with open-source firmware architectures. By definition, open-source firmware is intended to be modified and configured by the user. Complying with this section would likely require manufacturers to adopt locked, proprietary control systems.

**Sec. 1 (6):** _"'Software controls process' means a system designed to stop a three-dimensional printer from initiating any print job unless the underlying three-dimensional printing file has been evaluated by a firearms blueprints detection algorithm and determined not to be a printing file that would produce a firearm or illegal firearm parts."_

> **Analysis:** This establishes a pre-print validation requirement. All scheduled print jobs must be evaluated by the detection algorithm to determine compliance before the hardware is permitted to initiate the manufacturing process.

### Hardware Sale Restrictions

**Sec. 3 (1):** _"After July 1, 2027, no person who manufactures, wholesales, or sells any three-dimensional printer may sell or otherwise transfer for consideration a three-dimensional printer in this state unless: (a) The three-dimensional printer is equipped with blocking features..."_

> **Analysis:** This establishes a specific timeline for when hardware sale restrictions take effect in the state for devices lacking the requisite blocking features.

### Algorithmic Standards and Database

**Sec. 6 (2) (b):** _"Integrated preprint software design. Limitation of a three-dimensional printer's operation to accept geometric code for printing exclusively from a single slicer or other preprint software... and integration of a firearms blueprint detection algorithm into that preprint software..."_

> **Analysis:** Similar to other legislation, this restricts a printer's valid inputs to a "single slicer", diverging from the standard interoperability of G-Code.

**Sec. 8 (1):** _"By August 1, 2026, the attorney general shall create and maintain a database of firearms blueprint files and illegal firearm parts blueprint files, including, at a minimum, by conducting reasonable searches of public internet forums, and shall maintain and update the database at least once per year..."_

> **Analysis:** This establishes a state-maintained file library for algorithmic training, introducing new data-flow requirements for users prototyping proprietary designs and creating a continuous update burden for hardware manufacturers to stay in compliance.
`
  },
  'WA HB 2320': {
    title: 'Washington HB 2320: Code as Contraband',
    core_issue: 'First Amendment & Digital File Possession',
    url: 'https://app.leg.wa.gov/BillSummary/?BillNumber=2320&Year=2026',
    pdfUrl: 'https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/House%20Bills/2320-S.E.pdf',
    summary: 'HB 2320 regulates the distribution and possession of digital additive manufacturing code. It expands definitions to cover CNC milling and 3D printing, and establishes new legal liability for data files—specifically CAD models, STL meshes, and G-Code toolpaths—under specific circumstances, introducing new regulatory frameworks around computer code.',
    markdown_text: `
## Chapter 9.41 RCW Modifications

### Definitions

**Sec. 2 (11):** _"'Digital firearm manufacturing code' means any digital instructions in the form of computer-aided design files or other code or instructions stored and displayed in electronic format as a digital model that may be used to program a three-dimensional printer or a computer numerical control (CNC) milling machine to manufacture or produce a firearm..."_

> **Analysis:** The definition explicitly includes general-purpose CAD and CAM formats. As basic geometric shapes can be incorporated into regulated items, this broad definition could create legal ambiguity around the distribution of general mechanical engineering models.

**Sec. 2 (49):** _"'Three-dimensional printer' means a computer-aided manufacturing device capable of producing a three-dimensional object from a three-dimensional digital model through an additive manufacturing process..."_

> **Analysis:** The text expands the scope of regulated hardware to any device utilizing additive manufacturing based on digital models.

### Distribution & Possession Limits

**Sec. 6 (5):** _"No person may sell, transfer, distribute, or offer to sell digital firearm manufacturing code for a firearm to a person who is not licensed to manufacture firearms under 18 U.S.C. Sec. 923."_

> **Analysis:** This regulates the distribution of specific digital files. Because "manufacturing code" can apply to standard industry formats like STEP, STL, and G-Code, this language introduces new compliance liabilities for engineering education, file-sharing platforms, and digital archiving services.

**Sec. 6 (6):** _"No person may possess digital firearm manufacturing code for a firearm with an intent to distribute the code to a person who is not licensed... or with an intent to manufacture a firearm using a three-dimensional printer or computer numerical control milling machine."_

> **Analysis:** This regulates the possession of specific digital files when coupled with certain intents, extending the legal framework to the data currently stored on user devices.
`
  },
  'CO HB26-1144': {
    title: 'Colorado HB26-1144: Ban on 3D Printing & CNC File Sharing',
    core_issue: 'Broad Definition of Additive & Subtractive Prohibitions',
    url: 'https://leg.colorado.gov/bills/HB26-1144',
    pdfUrl: 'https://leg.colorado.gov/bill_files/111311/download',
    summary: 'HB26-1144 extends manufacturing regulations into the CAM (Computer Aided Manufacturing) and CNC (Computer Numerical Control) ecosystem. It specifically addresses both additive and subtractive material processes and regulates the possession and distribution of the corresponding digital instructions.',
    markdown_text: `
## C.R.S. 18-12-118
### Unlawful three-dimensional printing

**18-12-118 (1) (a):** _"A PERSON SHALL NOT MANUFACTURE OR PRODUCE A FIREARM OR FIREARM COMPONENT BY MEANS OF THREE-DIMENSIONAL PRINTING USING A THREE-DIMENSIONAL PRINTER, CNC MILLING MACHINE, OR SIMILAR DEVICE."_

> **Analysis:** The text explicitly regulates subtractive CNC milling alongside additive 3D printing.

**18-12-118 (2) (a):** _"A PERSON SHALL NOT POSSESS, IN CIRCUMSTANCES THAT INDICATE INTENT TO MANUFACTURE A FIREARM... OR INTENT TO DISTRIBUTE... DIGITAL INSTRUCTIONS THAT MAY BE USED TO PROGRAM A THREE-DIMENSIONAL PRINTER OR A CNC MILLING MACHINE TO MANUFACTURE OR PRODUCE A FIREARM OR FIREARM COMPONENT."_

> **Analysis:** This regulates the possession of standard digital instructions, such as G-Code and CAD files, based on intent. Regulating the possession of generic structural modeling data introduces legal complexities for the local storage of general CAM data for engineering purposes.

**18-12-118 (3) (a):** _"A PERSON SHALL NOT OFFER TO SELL AND SHALL NOT DISTRIBUTE BY ANY MEANS, INCLUDING DISTRIBUTION OVER THE INTERNET... DIGITAL INSTRUCTIONS THAT MAY BE USED TO PROGRAM A THREE-DIMENSIONAL PRINTER OR A CNC MILLING MACHINE TO MANUFACTURE OR PRODUCE A FIREARM OR FIREARM COMPONENT."_

> **Analysis:** This establishes a distribution ban for these digital instructions over the internet, affecting CAD sharing websites and platforms that host digital mechanical engineering models.

**18-12-118 (4) (b):** _"'DIGITAL INSTRUCTIONS' MEANS DIGITAL CODE IN THE FORM OF COMPUTER-AIDED DESIGN FILES OR OTHER CODE OR INSTRUCTIONS STORED AND DISPLAYED IN ELECTRONIC FORMAT AS A DIGITAL MODEL."_

> **Analysis:** This explicitly names CAD files within the definition of digital instructions, applying regulatory focus to the digital design files prior to physical manufacturing.

**18-12-118 (4) (f):** _"'THREE-DIMENSIONAL PRINTING' OR '3-D PRINTING' MEANS ADDITIVE MANUFACTURING THAT BUILDS THREE-DIMENSIONAL OBJECTS... AND SUBTRACTIVE MANUFACTURING THAT CREATES OBJECTS BY REMOVING MATERIAL FROM A WORKPIECE BY USE OF A CNC MILLING MACHINE OR SIMILAR DEVICE."_

> **Analysis:** This definition conflates standard additive manufacturing (3D printing) with distinct industrial subtractive processes (CNC milling) under a single legal umbrella.
`
  },
  'MN HF 3407 / SF 3661': {
    title: 'Minnesota HF 3407 / SF 3661: Ghost Gun Prohibition & Design File Restrictions',
    core_issue: 'Serialization & Design File Distribution',
    url: 'https://www.revisor.mn.gov/bills/94/2026/0/HF/3407/',
    pdfUrl: 'https://www.revisor.mn.gov/bills/94/2026/0/HF/3407/versions/0/pdf/',
    summary: 'Prohibits the sale and possession of ghost guns, limits 3D printing of firearms to federally licensed manufacturers, and bans the distribution of 3D printer firearm design files to individuals in the state.',
    markdown_text: `
## Minnesota Statutes Chapter 624

### Definitions
**Section 1 [624.7145] Subd. 1 (c):** _"'Ghost gun' means a firearm... (3) is manufactured by a three-dimensional printer or computer numerical control milling machine by a person who is not a federally licensed firearm manufacturer."_

> **Analysis:** This definition explicitly classifies any 3D-printed or CNC-milled firearm produced by a non-licensee as a prohibited "ghost gun," regardless of whether it otherwise complies with state law.

### Manufacturing Bans
**Section 2 [624.7146] Subd. 3 (a):** _"It is unlawful for a person, other than a federal firearms licensee, to manufacture a firearm using a computer numerical control milling machine or three-dimensional printer."_

> **Analysis:** This section establishes a flat prohibition on the use of common desktop manufacturing tools for firearms production by private individuals.

### Digital File Prohibitions
**Section 2 [624.7146] Subd. 4 (a):** _"It is unlawful to sell, transfer, or distribute to a person in the state... digital instructions in the form of computer-aided design files or other code or instructions... that may be used to program a three-dimensional printer to manufacture a ghost gun."_

> **Analysis:** This regulates the distribution of digital design data. By targeting CAD files and "other code," it introduces legal risk for hosting or sharing mechanical engineering models that could be used for manufacturing regulated items.`
  },
  'CA AB 1263': {
    title: 'California AB 1263: Expansion of Manufacturing Prohibitions',
    core_issue: 'Facilitation Liability & Website Presumptions',
    url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260AB1263',
    pdfUrl: 'https://leginfo.legislature.ca.gov/faces/billPdf.xhtml?bill_id=202520260AB1263',
    summary: 'Expands the scope of unlawful firearm manufacturing to include aiding or abetting the process. It broadens the definition of "digital manufacturing code" to include CAM files and creates a legal presumption that website operators violate the law if their platform encourages file distribution.',
    markdown_text: `
## Civil Code
### Section 3273.60. Definitions.

**Subdivision (a):** _"'Digital firearm manufacturing code' means any digital instructions in the form of computer-aided design files, computer-aided manufacturing files, or other code... to manufacture or produce a firearm, large-capacity magazine... or firearm accessory."_

> **Analysis:** Adding "computer-aided manufacturing files" (CAM) explicitly brings toolpaths, G-Code, and slicer settings into the regulatory definition, broadening the range of files subject to distribution restrictions.

### Section 3273.61. Civil Actions.

**Subdivision (f):** _"There shall be a rebuttable presumption that a person has violated... if... (2) the internet website... encourages individuals to upload or disseminate digital firearm manufacturing code or to use digital firearm manufacturing code to manufacture firearms..."_

> **Analysis:** This creates a significant legal burden for platform operators. If a website is found to "encourage" sharing, the burden of proof shifts to the owner to show they are not in violation of distribution bans.

## Penal Code
### Section 29186. Unlawful Manufacture.

**Subdivision (a):** _"It is unlawful to knowingly or willfully cause another person to engage in the unlawful manufacture of firearms, or to knowingly or willfully aid, abet, promote, or facilitate the unlawful manufacture of firearms."_

> **Analysis:** This section creates a misdemeanor offense for actions that "facilitate" or "promote" private manufacturing, potentially affecting technical support, educational content, or software development used in the maker community.`
  }
};

const STATE_DATA = [
  { id: 'CA', name: 'California', bills: ['AB 1263', 'AB 2047'], lookupUrl: 'https://findyourrep.legislature.ca.gov/' },
  { id: 'CO', name: 'Colorado', bills: ['HB26-1144'], lookupUrl: 'https://leg.colorado.gov/FindMyLegislator' },
  { id: 'MN', name: 'Minnesota', bills: ['HF 3407 / SF 3661'], lookupUrl: 'https://www.gis.lcc.mn.gov/iMaps/districts/' },
  { id: 'NY', name: 'New York', bills: ['A2228', 'S.9005', 'A10005'], lookupUrl: 'https://www.nysenate.gov/find-my-senator' },
  { id: 'WA', name: 'Washington', bills: ['HB 2320', 'HB 2321'], lookupUrl: 'https://app.leg.wa.gov/districtfinder/' },
  { id: 'OTHER', name: 'Other State', bills: ['General Toolchain Mandates'], lookupUrl: 'https://openstates.org/find_your_legislator/' }
];

function formatPublicAuthorName(rawName?: string) {
  const trimmed = (rawName || '').trim();
  if (!trimmed) return 'Anonymous Website Poster';

  const toCapitalCase = (part: string) => {
    if (!part) return part;
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  };

  const parts = trimmed.split(/\s+/).filter(Boolean).map(toCapitalCase);
  if (parts.length === 1) return parts[0];

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

function shuffledVoices<T extends { author: string; title: string; quote: string }>(voices: T[]) {
  return [...voices].sort((a, b) => {
    const aKey = `${a.author}|${a.title}|${a.quote}`;
    const bKey = `${b.author}|${b.title}|${b.quote}`;
    return hashString(aKey) - hashString(bKey);
  });
}

async function submitVoiceViaHttp(payload: { quote: string; author: string; title: string }) {
  const baseUrl = import.meta.env.VITE_CONVEX_SITE_URL as string | undefined;
  if (!baseUrl) {
    throw new Error("Missing VITE_CONVEX_SITE_URL");
  }

  const response = await fetch(`${baseUrl}/submit-voice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Failed to submit story.";
    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      message = response.status === 429
        ? "Rate limit exceeded. Please try again tomorrow."
        : message;
    }
    throw new Error(message);
  }
}

export default function App() {
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const parts = hash.split('/');
    const view = ['overview', 'tracker', 'action', 'why', 'videos', 'explainers', 'voices'].includes(parts[0]) ? parts[0] : 'overview';
    const subView = parts[1] ? decodeURIComponent(parts[1]) : null;
    return { view, subView };
  };

  const [currentView, setCurrentView] = useState(getInitialRoute().view);
  const [currentSubView, setCurrentSubView] = useState(getInitialRoute().subView);

  useEffect(() => {
    const handleHashChange = () => {
      const { view, subView } = getInitialRoute();
      setCurrentView(view);
      setCurrentSubView(subView);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: string, subView?: string) => {
    if (subView) {
      window.location.hash = `/${view}/${encodeURIComponent(subView)}`;
    } else {
      window.location.hash = `/${view}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans text-sm">
      <nav className="bg-slate-900 text-white px-6 py-2 flex flex-col md:flex-row justify-between md:items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <img src="/favicon.svg" className="w-6 h-6" alt="Freedom to Print Logo" />
            <span className="font-bold tracking-tight">Freedom <span className="text-red-500">to Print</span></span>
          </div>
          <div className="hidden lg:flex space-x-6 text-xs uppercase tracking-wide overflow-x-auto">
            <button onClick={() => navigate('overview')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'overview' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Overview</button>
            <button onClick={() => navigate('tracker')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'tracker' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Legislation</button>
            <button onClick={() => navigate('action')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'action' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Take Action</button>
            <button onClick={() => navigate('why')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'why' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Why It Won't Work</button>
            <button onClick={() => navigate('videos')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'videos' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Videos</button>
            <button onClick={() => navigate('voices')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'voices' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Voices</button>
            <button onClick={() => navigate('explainers')} className={`whitespace-nowrap hover:text-slate-300 transition-colors ${currentView === 'explainers' ? 'text-white border-b-2 border-white font-bold' : 'text-slate-400'}`}>Policy & Bill Briefs</button>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <div className="flex lg:hidden space-x-6 text-xs uppercase tracking-wide overflow-x-auto">
          </div>
          <a
            href="http://github.com/zimengxiong/freedomtoprint"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-[10px] uppercase tracking-wider"
          >
            <Github className="w-3 h-3" />
            <span>Suggest Changes</span>
          </a>
        </div>
      </nav>

      <main className="flex-grow px-6 py-2 w-full">
        {currentView === 'overview' && <Overview navigate={navigate} />}
        {currentView === 'tracker' && <Tracker />}
        {currentView === 'action' && <ActionCenter />}
        {currentView === 'why' && <WhyPage />}
        {currentView === 'videos' && <Videos />}
        {currentView === 'voices' && <Voices />}
        {currentView === 'explainers' && <Explainers selectedBillKey={currentSubView} setSelectedBillKey={(k) => navigate('explainers', k || undefined)} />}
      </main>

      <footer className="border-t border-slate-300 bg-white px-6 py-4 mt-4">
        <div className="max-w-6xl mx-auto text-xs text-slate-600 space-y-2">
          <p>
            <span className="font-bold text-slate-800">Disclaimer:</span> This website is for informational and civic engagement purposes only and is not legal advice.
          </p>
          <p>
            Bill status and summaries may change quickly. Verify details with official state legislature sources before taking action.
          </p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

function Overview({ navigate }: { navigate: (view: string) => void }) {
  const voicesData = useQuery(api.voices.getApproved);
  const allVoices = voicesData ?? [];
  const mixedVoices = useMemo(() => shuffledVoices(voicesData ?? []), [voicesData]);
  return (
    <div className="space-y-6 pb-8">
      <section className="relative h-[460px] flex items-center justify-center overflow-hidden border-b-8 border-red-600 bg-black -mx-6 -mt-2">
        <img
          src="/hero_defiant_printer.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125 saturate-50"
          alt="Defiant 3D Printer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.85] italic">
            They want to take <br />
            <span className="text-red-600 underline decoration-white/20 underline-offset-8">your printer.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-tight font-medium drop-shadow-lg">
            State mandates are moving to turn your hardware into a surveillance device. If you don't act now, the era of open-source manufacturing is over.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('action')}
              className="w-full md:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              Take Action <ChevronRight className="w-6 h-6 ml-2" />
            </button>
            <a
              href="https://www.change.org/p/protecting-3d-design-the-fight-against-washington-hb2320"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-10 py-5 bg-white text-black font-black text-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl"
            >
              Sign the Petition
            </a>
            <button
              onClick={() => navigate('tracker')}
              className="w-full md:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-black text-xl uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all hover:border-white/40 shadow-xl"
            >
              Read the Bills
            </button>
          </div>
        </div>
      </section>

      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="bg-white p-6 border-t-8 border-slate-900 shadow-2xl flex flex-col group hover:border-red-600 transition-all hover:-translate-y-1">
          <div className="flex items-center space-x-3 mb-6 text-slate-900 border-b border-slate-100 pb-3">
            <Lock className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black uppercase tracking-tight">Software Chains</h2>
          </div>
          <p className="text-slate-600 mb-8 flex-grow leading-relaxed text-base">
            Mandates for "Blocking Technology" and "Slicer Coupling" would make it a crime to use open-source firmware or un-certified software.
          </p>
          <button onClick={() => navigate('explainers')} className="inline-flex items-center font-black text-red-600 hover:text-red-700 transition-colors uppercase text-sm tracking-[0.2em]">
            Read the Briefs <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-white p-6 border-t-8 border-slate-900 shadow-2xl flex flex-col group hover:border-red-600 transition-all hover:-translate-y-1">
          <div className="flex items-center space-x-3 mb-6 text-slate-900 border-b border-slate-100 pb-3">
            <Eye className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black uppercase tracking-tight">CAD Surveillance</h2>
          </div>
          <p className="text-slate-600 mb-8 flex-grow leading-relaxed text-base">
            Legislation in multiple states proposes state-maintained libraries of "banned" geometries and required real-time file scanning.
          </p>
          <button onClick={() => navigate('tracker')} className="inline-flex items-center font-black text-red-600 hover:text-red-700 transition-colors uppercase text-sm tracking-[0.2em]">
            Monitor the Bills <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-white p-6 border-t-8 border-slate-900 shadow-2xl flex flex-col group hover:border-red-600 transition-all hover:-translate-y-1">
          <div className="flex items-center space-x-3 mb-6 text-slate-900 border-b border-slate-100 pb-3">
            <Gavel className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black uppercase tracking-tight">Code is Contraband</h2>
          </div>
          <p className="text-slate-600 mb-8 flex-grow leading-relaxed text-base">
            Washington HB 2320 and similar bills seek to criminalize the mere possession of digital manufacturing code without a license.
          </p>
          <button onClick={() => navigate('action')} className="inline-flex items-center font-black text-red-600 hover:text-red-700 transition-colors uppercase text-sm tracking-[0.2em]">
            Take Action Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <section className="px-6 py-12 bg-slate-100 -mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 border-b-4 border-slate-900 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">What others are saying</h2>
            <button
              onClick={() => navigate('voices')}
              className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-widest flex items-center gap-1"
            >
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mixedVoices.slice(0, 16).map((voice, idx) => (
              <div key={`${voice.author}|${voice.title}|${voice.quote}|${idx}`} className="flex flex-col space-y-3 bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
                  "{voice.quote}"
                </p>
                <div className="pt-2 border-t border-slate-50">
                  <div className="font-bold text-slate-900 text-xs">{voice.author}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{voice.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('voices')}
              className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-colors"
            >
              View All {allVoices.length} Community Voices
            </button>
          </div>
        </div>
      </section>

      <ShareStorySection />
    </div>
  );
}

function ShareStorySection() {
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [snippet, setSnippet] = useState('');
  const [profession, setProfession] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async () => {
    if (!snippet.trim() || !profession.trim()) return;
    setStatus('submitting');
    try {
      await submitVoiceViaHttp({
        quote: snippet,
        author: formatPublicAuthorName(authorName),
        title: profession,
      });
      setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="bg-slate-900 text-white p-12 text-center space-y-6">
      <h3 className="text-3xl font-black uppercase tracking-tighter italic">Your voice is missing.</h3>
      <p className="text-slate-400 max-w-2xl mx-auto">Are you a maker, educator, or business owner? Tell us how these bills would affect your work.</p>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-xl uppercase tracking-widest transition-transform hover:scale-105 inline-block"
        >
          Share Your Story
        </button>
      ) : status === 'success' ? (
        <div className="bg-green-700 text-white p-6 max-w-2xl mx-auto border-2 border-green-500 rounded">
          <h4 className="font-bold uppercase tracking-widest mb-2">Thank you!</h4>
          <p className="text-sm">Your story has been submitted and is now live on the dashboard.</p>
          <button onClick={() => { setShowForm(false); setStatus('idle'); setAuthorName(''); setSnippet(''); setProfession(''); }} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-widest">Submit Another</button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-slate-800 p-8 border border-slate-700 text-left space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2">Your Name (Optional)</label>
            <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Leave blank for Anonymous Website Poster" className="w-full bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2">Your Profession / Title</label>
            <input value={profession} onChange={e => setProfession(e.target.value)} placeholder="e.g. Hobbyist, STEM Educator, Precision Machinist" className="w-full bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2">Your Story Snippet</label>
            <textarea value={snippet} onChange={e => setSnippet(e.target.value)} placeholder="How would this ban affect you?" className="w-full bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-red-500 min-h-[120px] resize-y" />
          </div>
          <div className="flex gap-4 pt-2">
            <button disabled={status === 'submitting'} onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm py-4 disabled:opacity-50 transition-colors">
              {status === 'submitting' ? 'Submitting...' : 'Submit Story'}
            </button>
            <button disabled={status === 'submitting'} onClick={() => setShowForm(false)} className="px-6 border border-slate-600 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-sm disabled:opacity-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function Voices() {
  const voicesData = useQuery(api.voices.getApproved);
  const mixedVoices = useMemo(() => shuffledVoices(voicesData ?? []), [voicesData]);

  return (
    <div className="space-y-8 pb-12">
      <header className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Community Voices</h2>
        <p className="text-slate-700">Makers, educators, and engineers detail the real-world impact of these legislative mandates.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mixedVoices.map((voice, idx) => (
          <div key={`${voice.author}|${voice.title}|${voice.quote}|${idx}`} className="bg-white border border-slate-300 p-8 flex flex-col space-y-6 shadow-sm">
            <p className="text-xl font-serif italic text-slate-900 leading-relaxed">
              "{voice.quote}"
            </p>
            <div className="pt-4 border-t border-slate-100">
              <div className="font-black text-slate-900 text-base">{voice.author}</div>
              <div className="text-xs font-bold text-red-600 uppercase tracking-[0.1em]">{voice.title}</div>
            </div>
          </div>
        ))}
      </div>

      <ShareStorySection />
    </div>
  );
}

function Videos() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Community Videos</h2>
        <p className="text-slate-700">Watch creator breakdowns covering bill language, likely impacts, and technical feasibility.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VIDEO_DATA.map((video) => (
          <a
            key={video.id}
            href={video.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-slate-300 hover:border-slate-500 transition-colors bg-white"
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full aspect-video object-cover border-b border-slate-300"
              loading="lazy"
            />
            <div className="p-3">
              <p className="font-bold text-slate-900 text-sm leading-snug">{video.title}</p>
              <p className="text-xs text-slate-600 mt-1">{video.channel}</p>
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-blue-700 mt-2">
                Watch <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function WhyPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Why It Won&apos;t Work</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-300 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5 font-bold" />
            <h3 className="text-sm font-black uppercase tracking-widest">The "Dual-Use" Trap</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4">
            "If a student designs a high-tension spring for robotics or a precision pin for a medical device, they are modeling components that overlap with firearm parts. Without a path to prove intent, the files that enable innovation become a legal liability."
          </p>
          <p className="text-sm text-slate-800 leading-relaxed">
            Legislation that bans files based on potential application ignores the reality of engineering. Countless parts—springs, pins, rails, and brackets—are essential to robotics and aerospace but share identical geometry with restricted components. By criminalizing these foundational building blocks, the law forces schools and makerspaces into a legal minefield where innocent engineering is indistinguishable from a felony.
          </p>
        </div>

        <div className="bg-white border border-slate-300 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-slate-900">
            <FileCode className="w-5 h-5 font-bold" />
            <h3 className="text-sm font-black uppercase tracking-widest">Engineering & Creative Exile</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4">
            "If 3D models become illegal or even just risky to have on computers it will send Washington’s students, engineering businesses, and all robotics away."
          </p>
          <p className="text-sm text-slate-800 leading-relaxed">
            Washington is known for tech and engineering, but these bills would end that legacy. Not only will engineering be affected, but also videogame and 3D animation studios. The very digital assets used in movies and games to animate objects could be manufactured, making them "contraband" and stripping creators of their art and freedom.
          </p>
        </div>

        <div className="bg-white border border-slate-300 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-slate-900">
            <Gavel className="w-5 h-5 font-bold" />
            <h3 className="text-sm font-black uppercase tracking-widest">Technical Reality & Inefficacy</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4">
            "The hardware store has more easily accessible firearm parts than a 3D printer that will function much more than their printed counterparts."
          </p>
          <p className="text-sm text-slate-800 leading-relaxed">
            Bad actors will not be stopped. Firearm parts that are 3D printed are prone to failure due to layer lines and technical difficulty. Malevolent individuals would simply move on to hardware store materials, which are more resilient and accessible. These bills do not stop crime; they only obstruct law-abiding citizens trying to improve the world.
          </p>
        </div>
      </div>
    </div>
  );
}

function Tracker() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Legislation</h2>
        <p className="text-slate-700">Monitoring state-level bills targeting additive manufacturing hardware and digital design files.</p>
      </header>

      <div className="bg-white border border-slate-300 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-900 font-bold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Bill</th>
              <th className="px-4 py-3">Primary Sponsor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Mechanism</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {TRACKER_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 align-top">{row.state}</td>
                <td className="px-4 py-3 align-top flex flex-col space-y-2">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 font-bold hover:text-blue-900 hover:underline inline-flex items-center gap-1"
                    >
                      {row.bill}
                      <ExternalLink className="w-3 h-3 text-blue-500" />
                    </a>
                  ) : (
                    <span className="font-bold">{row.bill}</span>
                  )}
                  {row.pdfUrl && (
                    <a
                      href={row.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-700 px-2 py-1 border border-slate-300 inline-block w-fit hover:bg-slate-200 transition-colors"
                    >
                      PDF
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-slate-700 font-medium">{row.sponsor || '—'}</td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-block whitespace-nowrap px-2 py-0.5 text-xs font-bold uppercase tracking-wide border ${row.status === 'PASSED HOUSE'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : row.status === 'LAW'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : row.status === 'PASSED COMMITTEE'
                          ? 'bg-orange-50 text-orange-900 border-orange-300'
                          : row.status === 'STALLED'
                            ? 'bg-slate-200 text-slate-900 border-slate-400'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top font-medium">{row.category}</td>
                <td className="px-4 py-3 align-top">
                  <div className="font-bold mb-1 text-slate-900">{row.mechanism}</div>
                  <div className="text-slate-700 leading-snug">{row.description}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionCenter() {
  const [selectedState, setSelectedState] = useState(STATE_DATA[0]);
  const [selectedBills, setSelectedBills] = useState<string[]>([STATE_DATA[0].bills[0]]);
  const [stance, setStance] = useState('oppose');
  const [contactMode, setContactMode] = useState<'email' | 'phone'>('email');
  const [zipCode, setZipCode] = useState('');
  const [zipLookupStatus, setZipLookupStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [zipLookupError, setZipLookupError] = useState('');
  const [selectedRep, setSelectedRep] = useState('[Representative/Senator Name]');
  const [city, setCity] = useState('[City]');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [customActionText, setCustomActionText] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'failed' | 'submitted'>('idle');
  const [detectedStory, setDetectedStory] = useState('');

  const getLetterText = useCallback(() => {
    const billsText = selectedBills.length > 1
      ? `pending legislation including ${selectedBills.join(' and ')}`
      : selectedBills[0] || 'this legislation';

    if (stance === 'oppose') {
      return `Dear ${selectedRep},

I am a ${profession || 'constituent'} in ${city} writing about ${billsText}. I support enforcement against illegal manufacturing. I oppose legislation that regulates general purpose 3D printers and slicing software.

I am concerned that this legislation would impose mandates requiring blocking technology or state-controlled file libraries which risk severe overbreadth. They impact engineering education and legitimate prototyping. They create anti-competitive lock-in by forcing specific slicer pathways. They raise security concerns through mandated monitoring software.

Please oppose ${billsText} as written. The legislature must focus on illegal end-use enforcement rather than toolchain mandates.

I also ask you to visit local maker spaces, school STEM labs, and small manufacturing shops, and to speak directly with makers and educators affected by this bill before any vote, so policy decisions are based on firsthand understanding of lawful use and real-world impacts.

Sincerely,
${name || '[Your Name]'}
${city}, ${selectedState.id === 'OTHER' ? '' : selectedState.id}`;
    }

    return `Dear ${selectedRep},

I am a ${profession || 'constituent'} in ${city} writing about ${billsText}. I urge you to amend this legislation to protect general purpose additive manufacturing.

I am concerned about provisions that lack explicit exemptions for educational institutions and certified manufacturing labs. Legislation in this area must not require users to operate a single approved slicer path, nor should the state apply criminal penalties for firmware modifications unrelated to illegal firearm manufacture.

I ask that you amend ${billsText} to focus on prosecuting illegal conduct without restricting the general purpose tools used by schools and small businesses.

I also ask you to visit local maker spaces, school STEM labs, and small manufacturing shops, and to speak directly with makers and educators affected by this bill before any vote, so policy decisions are based on firsthand understanding of lawful use and real-world impacts.

Sincerely,
${name || '[Your Name]'}
${city}, ${selectedState.id === 'OTHER' ? '' : selectedState.id}`;
  }, [city, name, profession, selectedBills, selectedRep, selectedState.id, stance]);

  const getCallScriptText = useCallback(() => {
    const billsText = selectedBills.length > 1
      ? `these bills (${selectedBills.join(', ')})`
      : selectedBills[0] || 'this bill';

    const ask =
      stance === 'oppose'
        ? `to oppose ${billsText} as written`
        : `to amend ${billsText} to protect lawful educational and small-business use`;

    return `Hello, my name is ${name || '[Your Name]'}, and I am a ${profession || 'constituent'} in ${city}.

I am calling to respectfully ask ${selectedRep} ${ask}.

I support enforcement against illegal conduct, but this legislation risks overbroad restrictions on general-purpose 3D printers, firmware, and design software.

Please focus on illegal end-use enforcement rather than restrictions on general manufacturing tools.

Please also visit local maker spaces, school STEM labs, and small shops, and speak with makers and educators in the community before any vote, so this policy reflects how these tools are actually used and avoids unintended harm to lawful users.

Thank you for your time.`;
  }, [city, name, profession, selectedBills, selectedRep, stance]);

  const getActionText = useCallback(
    () => (contactMode === 'phone' ? getCallScriptText() : getLetterText()),
    [contactMode, getCallScriptText, getLetterText]
  );

  useEffect(() => {
    setCustomActionText(getActionText());
  }, [getActionText]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateObj = STATE_DATA.find(s => s.id === e.target.value);
    if (stateObj) {
      setSelectedState(stateObj);
      setSelectedBills([stateObj.bills[0]]);
      setSelectedRep('[Representative/Senator Name]');
    }
  };

  const handleZipLookup = async () => {
    const normalizedZip = zipCode.trim();
    if (!/^\d{5}$/.test(normalizedZip)) {
      setZipLookupStatus('error');
      setZipLookupError('Enter a valid 5-digit ZIP code.');
      return;
    }

    setZipLookupStatus('loading');
    setZipLookupError('');

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${normalizedZip}`);
      if (!response.ok) {
        throw new Error('ZIP code not found.');
      }

      const data = await response.json();
      const place = data?.places?.[0];
      const fetchedCity = place?.['place name'];
      const fetchedStateAbbr = place?.['state abbreviation'];

      if (!fetchedCity || !fetchedStateAbbr) {
        throw new Error('ZIP lookup returned incomplete data.');
      }

      setCity(fetchedCity);
      const matchedState = STATE_DATA.find((s) => s.id === fetchedStateAbbr) || STATE_DATA.find((s) => s.id === 'OTHER');
      if (matchedState) {
        setSelectedState(matchedState);
        setSelectedBills([matchedState.bills[0]]);
      }

      setZipLookupStatus('idle');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ZIP lookup failed.';
      setZipLookupStatus('error');
      setZipLookupError(message);
    }
  };



  return (
    <div className="space-y-6">
      <header className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Take Action</h2>
        <p className="text-slate-700">Protect the future of open hardware and distributed manufacturing.</p>
      </header>

      <div className="bg-red-600 text-white p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-black uppercase tracking-tight italic leading-none mb-1">Sign the Official Petition</h3>
          <p className="text-red-100 font-medium tracking-tight">Support the fight against Washington HB 2320 and similar tech-blocking mandates.</p>
        </div>
        <a
          href="https://www.change.org/p/protecting-3d-design-the-fight-against-washington-hb2320"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-red-600 px-8 py-4 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-lg"
        >
          Sign on Change.org
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-1">
          <div className="space-y-4 bg-slate-50 p-4 border border-slate-300">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-2 flex justify-between items-center">
              1. Find Your State
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="ZIP Code"
                className="w-full border border-slate-400 focus:border-slate-800 p-2 text-sm bg-white outline-none"
                value={zipCode}
                maxLength={5}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setZipCode(digitsOnly);
                  if (zipLookupStatus === 'error') {
                    setZipLookupStatus('idle');
                    setZipLookupError('');
                  }
                }}
              />
              <button
                onClick={handleZipLookup}
                disabled={zipLookupStatus === 'loading' || zipCode.length !== 5}
                className="bg-slate-900 text-white px-4 py-2 font-bold hover:bg-slate-700 disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {zipLookupStatus === 'loading' ? 'Looking...' : 'Auto-Fill'}
              </button>
            </div>
            <p className="text-xs text-slate-700">
              Enter a ZIP code to auto-fill city and state, then use the official portal below to identify your specific legislator.
            </p>
            {zipLookupStatus === 'error' && (
              <div className="text-xs text-red-700 font-bold">
                {zipLookupError}
              </div>
            )}
            <div className="pt-2 text-xs mt-1">
              <a
                href={selectedState.lookupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-bold"
              >
                Official {selectedState.name} Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4 bg-white p-4 border border-slate-300">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-2">2. Letter Configuration</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase">State</label>
              <select
                className="w-full border border-slate-400 p-2 text-sm bg-white outline-none"
                value={selectedState.id}
                onChange={handleStateChange}
              >
                {STATE_DATA.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 uppercase">Target Bills</label>
                <button
                  onClick={() => {
                    const activeBills = selectedState.bills.filter(b => {
                      const track = TRACKER_DATA.find(t => t.bill === b);
                      return !track || track.status !== 'LAW';
                    });
                    setSelectedBills(activeBills);
                  }}
                  className="text-[10px] font-black uppercase text-red-600 hover:text-red-700"
                >
                  Select All Active
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-400 p-2 space-y-2 bg-white">
                {selectedState.bills.map(b => {
                  const isLaw = TRACKER_DATA.find(t => t.bill === b)?.status === 'LAW';
                  return (
                    <label key={b} className={`flex items-start space-x-2 text-sm ${isLaw ? 'opacity-50 grayscale' : 'cursor-pointer hover:bg-slate-50'}`}>
                      <input
                        type="checkbox"
                        className="mt-1"
                        disabled={isLaw}
                        checked={selectedBills.includes(b)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBills([...selectedBills, b]);
                          } else {
                            setSelectedBills(selectedBills.filter(id => id !== b));
                          }
                        }}
                      />
                      <span className="flex-grow">
                        {b} {isLaw && <span className="text-[10px] bg-slate-200 px-1 ml-1 text-slate-600 font-bold uppercase">Passed</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 pb-2">
              <label className="text-xs font-bold text-slate-800 uppercase">Personal Details</label>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Representative/Senator Name"
                  value={selectedRep === '[Representative/Senator Name]' ? '' : selectedRep}
                  onChange={(e) => setSelectedRep(e.target.value || '[Representative/Senator Name]')}
                  className="w-full border border-slate-400 p-2 text-sm bg-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-400 p-2 text-sm bg-white outline-none" />
                <input type="text" placeholder="Profession (e.g. Educator, Engineer)" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full border border-slate-400 p-2 text-sm bg-white outline-none" />
                <input type="text" placeholder="City" value={city === '[City]' ? '' : city} onChange={(e) => setCity(e.target.value)} className="w-full border border-slate-400 p-2 text-sm bg-white outline-none" />
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <label className="text-xs font-bold text-slate-800 uppercase">Contact Method</label>
              <div className="flex flex-col space-y-2">
                <label className={`flex items-center space-x-2 text-sm p-3 border cursor-pointer transition-colors ${contactMode === 'email' ? 'bg-slate-100 border-slate-900 font-bold' : 'border-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" value="email" checked={contactMode === 'email'} onChange={() => setContactMode('email')} />
                  <span>Email / Written Message</span>
                </label>
                <label className={`flex items-center space-x-2 text-sm p-3 border cursor-pointer transition-colors ${contactMode === 'phone' ? 'bg-slate-100 border-slate-900 font-bold' : 'border-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" value="phone" checked={contactMode === 'phone'} onChange={() => setContactMode('phone')} />
                  <span>Phone Call Script</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <label className="text-xs font-bold text-slate-800 uppercase">Position</label>
              <div className="flex flex-col space-y-2">
                <label className={`flex items-center space-x-2 text-sm p-3 border cursor-pointer transition-colors ${stance === 'oppose' ? 'bg-slate-100 border-slate-900 font-bold' : 'border-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" value="oppose" checked={stance === 'oppose'} onChange={() => setStance('oppose')} />
                  <span>Oppose Completely</span>
                </label>
                <label className={`flex items-center space-x-2 text-sm p-3 border cursor-pointer transition-colors ${stance === 'amend' ? 'bg-slate-100 border-slate-900 font-bold' : 'border-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" value="amend" checked={stance === 'amend'} onChange={() => setStance('amend')} />
                  <span>Recommend Amendments</span>
                </label>
              </div>
            </div>


          </div>
        </div>

        <div className="md:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-slate-300 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{contactMode === 'phone' ? '3. Generated Call Script' : '3. Generated Correspondence'}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Recipient: <span className="font-bold">{selectedRep}</span></p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(customActionText);
                const btn = document.getElementById('copyBtn');
                if (btn) {
                  btn.innerText = 'COPIED!';
                  btn.classList.add('bg-green-700');
                  setTimeout(() => {
                    btn.innerText = 'COPY';
                    btn.classList.remove('bg-green-700');
                  }, 2000);
                }
              }}
              id="copyBtn"
              className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-3 py-2 hover:bg-slate-700 flex items-center gap-1"
            >
              <FileCode className="w-4 h-4" />
              Copy
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 text-xs text-slate-700 flex items-start space-x-2 mb-4 font-bold">
            <AlertCircle className="w-4 h-4 text-slate-700 flex-shrink-0" />
            <p>
              {contactMode === 'phone'
                ? 'Use this as your phone script. Feel free to personalize the text below to include your own experiences.'
                : "Use this text for email or contact forms. We strongly suggest you personalize the letter below to share your own story."}
            </p>
          </div>

          <textarea
            value={customActionText}
            onChange={(e) => {
              setCustomActionText(e.target.value);
              setSubmissionStatus('idle');
            }}
            className="w-full flex-grow min-h-[400px] border border-slate-400 p-4 text-sm font-mono text-slate-900 bg-slate-50 resize-y focus:outline-none focus:border-slate-800"
          />

          <div className="mt-4 border-t-2 border-slate-900 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Add your voice to the Overview</h4>
                <p className="text-xs text-slate-600">We'll attempt to isolate your personal story from the template to feature it.</p>
              </div>
              <button
                onClick={() => {
                  const original = getActionText();
                  const current = customActionText;

                  const getPersonalStory = (tmpl: string, cur: string) => {
                    const originalBlocks = tmpl.split('\n').map(b => b.trim()).filter(b => b.length > 0);
                    const currentBlocks = cur.split('\n').map(b => b.trim()).filter(b => b.length > 0);

                    const locationLine = `${city}, ${selectedState.id === 'OTHER' ? '' : selectedState.id}`.trim();

                    return currentBlocks.filter(block => {
                      if (originalBlocks.some(ob => ob === block)) return false;

                      if (block.startsWith('Dear ')) return false;
                      if (block.includes('Sincerely,')) return false;
                      if (block === name || block === '[Your Name]') return false;
                      if (block.includes(locationLine)) return false;

                      if (block.includes('constituent') && block.includes('writing about')) return false;

                      return true;
                    }).join('\n\n');
                  };

                  const story = getPersonalStory(original, current);
                  setDetectedStory(story || '');
                  setSubmissionStatus('success');
                }}
                className={`px-6 py-2 font-black uppercase tracking-widest text-xs transition-all ${submissionStatus === 'submitted' ? 'bg-green-700 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {submissionStatus === 'submitted' ? 'Story Submitted!' : 'Share My Story'}
              </button>
            </div>

            {submissionStatus === 'success' && (
              <div className="mt-4 p-4 bg-slate-100 border-2 border-slate-900 border-dashed animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Preview & Refine Your Section</h5>
                  <button onClick={() => setSubmissionStatus('idle')} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors">Cancel</button>
                </div>
                {detectedStory.length === 0 ? (
                  <p className="text-xs text-red-600 mb-3 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Could not isolate your changes. Please copy and paste your personal story below.
                  </p>
                ) : (
                  <p className="text-xs text-slate-800 mb-3 font-medium">If the detection below includes parts of the template or feels wrong, please edit it down to just your personal message.</p>
                )}
                <textarea
                  value={detectedStory}
                  onChange={(e) => {
                    setDetectedStory(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onFocus={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  placeholder="Paste your personal story or reason here..."
                  className="w-full min-h-[120px] p-3 text-sm border border-slate-300 bg-white font-serif italic outline-none focus:border-slate-800 overflow-hidden"
                />
                <button
                  onClick={async () => {
                    setSubmissionStatus('submitted');
                    if (detectedStory.trim()) {
                      try {
                        await submitVoiceViaHttp({
                          quote: detectedStory,
                          author: formatPublicAuthorName(name),
                          title: profession || "Community Member"
                        });
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  className="mt-3 w-full bg-slate-900 text-white py-2 font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
                >
                  Confirm & Feature My Story
                </button>
              </div>
            )}

            {submissionStatus === 'submitted' && (
              <div className="mt-3 p-3 bg-green-50 border border-green-300 text-xs text-green-900 font-bold uppercase flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Story shared and published.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

function RenderMarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-4 font-serif text-base text-slate-800 leading-relaxed bg-[#fbfbfb] p-6 border border-slate-300">
      {lines.map((line, idx) => {
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold font-sans mt-6 mb-2 border-b border-slate-300 pb-2">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-base font-bold font-sans mt-4 mb-1 text-slate-700 uppercase tracking-widest">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('> **Analysis:**')) {
          return (
            <div key={idx} className="bg-slate-100 border-l-4 border-slate-800 p-4 my-4 font-sans text-sm">
              <span className="font-bold block mb-1 uppercase tracking-widest text-xs">Analysis</span>
              {line.replace('> **Analysis:**', '').trim()}
            </div>
          );
        }
        if (line.startsWith('**') && line.includes(':**')) {
          const parts = line.split(':**');
          if (parts.length > 1) {
            const heading = parts[0].replace(/^\*\*/, '').trim();
            const content = parts.slice(1).join(':**').replace(/_/g, '');
            return <p key={idx} className="mt-2 text-slate-900"><strong className="font-bold">{heading}:</strong> {content}</p>
          }
        }
        if (line.trim() === '') return null;
        return <p key={idx} className="mt-2">{line}</p>;
      })}
    </div>
  )
}

function Explainers({ selectedBillKey, setSelectedBillKey }: { selectedBillKey: string | null, setSelectedBillKey: (k: string | null) => void }) {
  if (selectedBillKey && BILL_ANALYSIS_DATA[selectedBillKey as keyof typeof BILL_ANALYSIS_DATA]) {
    const analysis = BILL_ANALYSIS_DATA[selectedBillKey as keyof typeof BILL_ANALYSIS_DATA];
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedBillKey(null)}
          className="flex items-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Briefs
        </button>

        <header className="border-b-2 border-slate-800 pb-4 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{analysis.core_issue}</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{analysis.title}</h2>
          <div className="bg-white border border-slate-300 p-4 font-bold text-slate-700 text-sm mb-4">
            {analysis.summary}
          </div>
          <div className="flex space-x-4">
            {analysis.url && (
              <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-blue-900 hover:underline">
                View Bill on State Website <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
            {analysis.pdfUrl && (
              <a href={analysis.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 hover:underline">
                View PDF <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </header>

        <div className="mt-8">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-4">Annotated Relevant Legislative Text</h3>
          <RenderMarkdownText text={analysis.markdown_text} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-300 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Policy & Bill Briefs</h2>

      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(BILL_ANALYSIS_DATA).map(([key, brief]) => (
          <div key={key} className="bg-white border border-slate-300 p-5 flex flex-col h-full hover:border-slate-400 transition-colors">
            <div className="mb-3 border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">{brief.core_issue}</span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{brief.title}</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed flex-grow mt-2">
              {brief.summary}
            </p>
            <button
              onClick={() => setSelectedBillKey(key)}
              className="mt-6 font-bold bg-slate-100 border border-slate-300 text-slate-900 px-4 py-2 text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-between"
            >
              Read Annotated Text
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
