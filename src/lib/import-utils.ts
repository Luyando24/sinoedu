/**
 * Utility functions for intelligent data import matching and extraction.
 */

/**
 * Calculates the Levenshtein distance between two strings.
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Returns a similarity score between 0 and 1.
 */
export function getSimilarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - getLevenshteinDistance(longer.toLowerCase(), shorter.toLowerCase())) / longerLength;
}

/**
 * Common header aliases for auto-mapping.
 */
export const HEADER_ALIASES: Record<string, string[]> = {
  title: ['program', 'program name', 'course', 'course name', 'degree'],
  university_id: ['university', 'school', 'institution', 'uni', 'college'],
  program_id_code: ['id', 'code', 'program id', 'program code', 'reference'],
  level: ['degree level', 'category', 'program level'],
  location: ['city', 'province', 'area'],
  duration: ['time', 'length', 'period'],
  tuition_fee: ['cost', 'price', 'fees', 'tuition'],
  language: ['taught language', 'instruction language'],
  intake: ['start date', 'admission date'],
  application_deadline: ['deadline', 'closing date'],
  description: ['about', 'details', 'summary', 'info', 'about the program', 'program description'],
  requirements: ['entry requirements', 'eligibility', 'admission criteria', 'general requirements'],
  required_documents: ['required documents', 'documents', 'required docs', 'application documents', 'document list'],
  general_info: ['details (general info)', 'general info', 'notes', 'extra info'],
  scholarship_id: ['scholarship type', 'scholarship name', 'scholarship'],
  scholarship_details: ['scholarship details', 'scholarship info', 'scholarship description', 'scholarship text'],
  accommodation_details: ['accommodation', 'accommodation fee', 'housing', 'dormitory fee', 'accommodation details'],
  registration_fee: ['registration fee', 'application fee', 'admin fee', 'registration'],
  fee_structure: ['fee structure', 'fee structure details', 'other fees', 'fees breakdown', 'cost breakdown'],
  additional_info: ['additional information', 'additional info', 'more info', 'notes', 'extra information'],
};

/**
 * Attempts to extract specific field values from a text block.
 */
export function extractFieldsFromText(text: string): Record<string, string> {
  const extracted: Record<string, string> = {};

  // Tuition patterns
  const tuitionPatterns = [
    /(?:tuition|cost|fee)\s*[:=-]?\s*([\d,.]+\s*(?:rmb|usd|yuan|\$|€))/i,
    /([\d,.]+\s*(?:rmb|usd|yuan|\$|€))\s*(?:per year|annually|\/year)/i,
    /(?:rmb|usd|\$)\s*([\d,.]+)/i
  ];

  for (const pattern of tuitionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extracted.tuition_fee = match[1].trim();
      break;
    }
  }

  // Duration patterns
  const durationPatterns = [
    /(\d+)\s*(?:years?|months?)/i,
    /(?:duration|length)\s*[:=-]?\s*([^,\n.]+)/i
  ];

  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.duration = match[0].trim();
      break;
    }
  }

  // Language patterns
  if (/english[- ]taught|taught in english/i.test(text)) extracted.language = 'English';
  else if (/chinese[- ]taught|taught in chinese/i.test(text)) extracted.language = 'Chinese';

  // Location patterns
  const locationPatterns = [
    /(?:location|city|study in)\s*[:=-]?\s*([^,\n.]+)/i,
    /located in\s+([^,\n.]+)/i
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extracted.location = match[1].trim();
      break;
    }
  }

  // Intake patterns
  const intakePatterns = [
    /(?:intake|start date|admission)\s*[:=-]?\s*([^,\n.]{1,50}?)(?=\s+(?:age|level|duration|tuition|deadline|requirements|note|info|registration)|$)/i,
    /(spring|autumn|september|march|april|october)\s+(?:\d{4})?\s*(?:intake)/i
  ];

  for (const pattern of intakePatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.intake = (match[1] || match[0]).trim();
      break;
    }
  }

  return extracted;
}

/**
 * Maps a generic header to the internal database field name.
 */
export function mapHeader(header: string): string | null {
  const lowerHeader = header.toLowerCase().trim();
  
  // Direct match
  if (HEADER_ALIASES[lowerHeader]) return lowerHeader;

  // Alias match
  for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(lowerHeader)) return key;
  }

  return null;
}
