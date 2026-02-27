// Thai Validation Engine — client-side only

export interface ThaiValidationPreset {
  id: string;
  nameEn: string;
  nameTh: string;
  pattern: string;
  flags: string;
  description: string;
  descriptionTh: string;
  example: string;
  counterExample: string;
}

export const thaiPresets: ThaiValidationPreset[] = [
  {
    id: "thai-name",
    nameEn: "Thai Name Only",
    nameTh: "ชื่อภาษาไทย",
    pattern: "^[ก-๙\\s]+$",
    flags: "u",
    description: "Thai characters and spaces only",
    descriptionTh: "อักษรไทยและช่องว่างเท่านั้น",
    example: "สมชาย ใจดี",
    counterExample: "Somchai123",
  },
  {
    id: "thai-english-name",
    nameEn: "Thai + English Name",
    nameTh: "ชื่อไทย + อังกฤษ",
    pattern: "^[ก-๙A-Za-z\\s]+$",
    flags: "u",
    description: "Thai characters, English letters, and spaces",
    descriptionTh: "อักษรไทย อักษรอังกฤษ และช่องว่าง",
    example: "สมชาย Somchai",
    counterExample: "สมชาย@123",
  },
  {
    id: "thai-phone",
    nameEn: "Thai Phone Number",
    nameTh: "เบอร์โทรศัพท์ไทย",
    pattern: "^(?:\\+66|0)[689]\\d{8}$",
    flags: "",
    description: "Thai mobile: 08X, 09X, 06X or +66...",
    descriptionTh: "เบอร์มือถือไทย: 08X, 09X, 06X หรือ +66...",
    example: "0812345678",
    counterExample: "1234567890",
  },
  {
    id: "thai-phone-landline",
    nameEn: "Thai Landline",
    nameTh: "เบอร์โทรบ้าน/สำนักงาน",
    pattern: "^0[2-9]\\d{7,8}$",
    flags: "",
    description: "Thai landline: 02-XXX-XXXX format",
    descriptionTh: "เบอร์โทรบ้าน: 02-XXX-XXXX",
    example: "021234567",
    counterExample: "0812345678",
  },
  {
    id: "thai-id",
    nameEn: "Thai ID Card (13 digits)",
    nameTh: "บัตรประชาชนไทย",
    pattern: "^\\d{13}$",
    flags: "",
    description: "13-digit Thai national ID number",
    descriptionTh: "เลขบัตรประชาชน 13 หลัก",
    example: "1234567890123",
    counterExample: "123456789",
  },
  {
    id: "thai-postal",
    nameEn: "Thai Postal Code",
    nameTh: "รหัสไปรษณีย์ไทย",
    pattern: "^\\d{5}$",
    flags: "",
    description: "5-digit Thai postal code",
    descriptionTh: "รหัสไปรษณีย์ 5 หลัก",
    example: "10110",
    counterExample: "1011",
  },
  {
    id: "thai-address",
    nameEn: "Thai Address Input",
    nameTh: "บ้านเลขที่ / ที่อยู่",
    pattern: "^[ก-๙A-Za-z0-9\\s/\\-\\.]+$",
    flags: "u",
    description: "Thai address: letters, numbers, /, -, spaces",
    descriptionTh: "ที่อยู่ไทย: อักษร ตัวเลข / - ช่องว่าง",
    example: "123/4 ซ.สุขุมวิท 55",
    counterExample: "123@home",
  },
  {
    id: "otp-6",
    nameEn: "OTP 6 Digits",
    nameTh: "OTP 6 หลัก",
    pattern: "^\\d{6}$",
    flags: "",
    description: "6-digit numeric OTP code",
    descriptionTh: "รหัส OTP ตัวเลข 6 หลัก",
    example: "123456",
    counterExample: "12345",
  },
  {
    id: "thai-digits-only",
    nameEn: "Thai Digits Only",
    nameTh: "ตัวเลขไทยเท่านั้น",
    pattern: "^[๐-๙]+$",
    flags: "u",
    description: "Thai numeral characters only (๐๑๒๓๔๕๖๗๘๙)",
    descriptionTh: "เลขไทยเท่านั้น (๐-๙)",
    example: "๑๒๓๔๕",
    counterExample: "12345",
  },
  {
    id: "arabic-digits-only",
    nameEn: "Arabic Digits Only",
    nameTh: "ตัวเลขอารบิกเท่านั้น",
    pattern: "^[0-9]+$",
    flags: "",
    description: "Arabic numeral characters only (0-9)",
    descriptionTh: "เลขอารบิกเท่านั้น (0-9)",
    example: "12345",
    counterExample: "๑๒๓๔๕",
  },
];

// ── Thai ID Checksum Validator ──
export function validateThaiIdChecksum(id: string): { valid: boolean; reason: string; reasonTh: string } {
  if (!/^\d{13}$/.test(id)) {
    return { valid: false, reason: "Must be exactly 13 digits", reasonTh: "ต้องเป็นตัวเลข 13 หลักเท่านั้น" };
  }
  const digits = id.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  if (digits[12] !== checkDigit) {
    return { valid: false, reason: `Checksum failed: expected last digit ${checkDigit}`, reasonTh: `ผลรวมตรวจสอบไม่ถูกต้อง: หลักสุดท้ายควรเป็น ${checkDigit}` };
  }
  return { valid: true, reason: "Valid Thai ID", reasonTh: "เลขบัตรประชาชนถูกต้อง" };
}

// ── Thai Phone Normalizer ──
export function normalizeThaiPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+66")) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("66") && cleaned.length === 11) return "0" + cleaned.slice(2);
  return cleaned;
}

// ── Thai Failure Reasons ──
export function getThaiFailureReasons(presetId: string, input: string): { en: string; th: string }[] {
  const reasons: { en: string; th: string }[] = [];
  
  switch (presetId) {
    case "thai-phone": {
      const cleaned = input.replace(/[\s\-]/g, "");
      if (!/^(\+66|0)/.test(cleaned)) reasons.push({ en: "Must start with 0 or +66", th: "ต้องขึ้นต้นด้วย 0 หรือ +66" });
      const afterPrefix = cleaned.startsWith("+66") ? cleaned.slice(3) : cleaned.slice(1);
      if (afterPrefix.length > 0 && !/^[689]/.test(afterPrefix)) reasons.push({ en: "Second digit must be 6, 8, or 9", th: "หลักที่สองต้องเป็น 6, 8 หรือ 9" });
      const totalDigits = cleaned.startsWith("+66") ? cleaned.length - 1 : cleaned.length;
      if (totalDigits !== 10) reasons.push({ en: `Must be 10 digits total (got ${totalDigits})`, th: `ต้องมีทั้งหมด 10 หลัก (มี ${totalDigits} หลัก)` });
      if (/[^\d+]/.test(cleaned)) reasons.push({ en: "Contains non-numeric characters", th: "มีอักขระที่ไม่ใช่ตัวเลข" });
      break;
    }
    case "thai-id": {
      if (input.length !== 13) reasons.push({ en: `Must be 13 digits (got ${input.length})`, th: `ต้องมี 13 หลัก (มี ${input.length} หลัก)` });
      if (/\D/.test(input)) reasons.push({ en: "Must contain only digits", th: "ต้องเป็นตัวเลขเท่านั้น" });
      if (/^\d{13}$/.test(input)) {
        const check = validateThaiIdChecksum(input);
        if (!check.valid) reasons.push({ en: check.reason, th: check.reasonTh });
      }
      break;
    }
    case "thai-name": {
      if (/[A-Za-z]/.test(input)) reasons.push({ en: "English letters not allowed", th: "ไม่อนุญาตให้ใช้อักษรอังกฤษ" });
      if (/\d/.test(input)) reasons.push({ en: "Numbers not allowed", th: "ไม่อนุญาตให้ใช้ตัวเลข" });
      if (/[!@#$%^&*()_+={}[\]:;"'<>,?/\\|`~]/.test(input)) reasons.push({ en: "Special characters not allowed", th: "ไม่อนุญาตให้ใช้อักขระพิเศษ" });
      if (input.trim().length === 0) reasons.push({ en: "Cannot be empty", th: "ต้องไม่เป็นค่าว่าง" });
      break;
    }
    case "thai-postal": {
      if (input.length !== 5) reasons.push({ en: `Must be 5 digits (got ${input.length})`, th: `ต้องมี 5 หลัก (มี ${input.length} หลัก)` });
      if (/\D/.test(input)) reasons.push({ en: "Must contain only digits", th: "ต้องเป็นตัวเลขเท่านั้น" });
      break;
    }
    default: {
      if (input.trim().length === 0) reasons.push({ en: "Input is empty", th: "ค่าว่าง" });
      else reasons.push({ en: "Input does not match the expected format", th: "ข้อมูลไม่ตรงตามรูปแบบที่กำหนด" });
    }
  }
  return reasons;
}

// ── Unicode Character Explanation ──
export interface UnicodeExplanation {
  range: string;
  label: string;
  labelTh: string;
}

export function getUnicodeExplanations(pattern: string): UnicodeExplanation[] {
  const explanations: UnicodeExplanation[] = [];
  if (/ก-ฮ|ก-๙|\u0E00/.test(pattern)) {
    explanations.push({ range: "ก-ฮ", label: "Thai consonants", labelTh: "พยัญชนะไทย" });
  }
  if (/[ะ-ๆ]|สระ/.test(pattern) || /\u0E30-\u0E3A/.test(pattern)) {
    explanations.push({ range: "ะ-ๆ", label: "Thai vowels & marks", labelTh: "สระและเครื่องหมายไทย" });
  }
  if (/๐-๙|\u0E50/.test(pattern)) {
    explanations.push({ range: "๐-๙", label: "Thai digits (0-9)", labelTh: "ตัวเลขไทย" });
  }
  if (/\\u0E00|0E7F/.test(pattern)) {
    explanations.push({ range: "\\u0E00-\\u0E7F", label: "Full Thai Unicode block", labelTh: "บล็อก Unicode ไทยทั้งหมด" });
  }
  if (/A-Z/.test(pattern)) {
    explanations.push({ range: "A-Z", label: "English uppercase", labelTh: "อักษรอังกฤษตัวพิมพ์ใหญ่" });
  }
  if (/a-z/.test(pattern)) {
    explanations.push({ range: "a-z", label: "English lowercase", labelTh: "อักษรอังกฤษตัวพิมพ์เล็ก" });
  }
  if (/0-9|\\d/.test(pattern)) {
    explanations.push({ range: "0-9", label: "Arabic digits", labelTh: "ตัวเลขอารบิก" });
  }
  if (/\\s/.test(pattern)) {
    explanations.push({ range: "\\s", label: "Whitespace", labelTh: "ช่องว่าง" });
  }
  return explanations;
}

// ── Thai Character Class Checkboxes ──
export interface ThaiCharClassConfig {
  thaiConsonants: boolean;    // ก-ฮ
  thaiVowels: boolean;        // สระ
  thaiToneMarks: boolean;     // วรรณยุกต์
  thaiDigits: boolean;        // ๐-๙
  arabicDigits: boolean;      // 0-9
  spaces: boolean;
  specialChars: boolean;
  englishLetters: boolean;
}

export function createDefaultThaiCharClass(): ThaiCharClassConfig {
  return {
    thaiConsonants: true,
    thaiVowels: true,
    thaiToneMarks: true,
    thaiDigits: false,
    arabicDigits: false,
    spaces: true,
    specialChars: false,
    englishLetters: false,
  };
}

export function buildThaiCharacterClass(config: ThaiCharClassConfig): string {
  const parts: string[] = [];
  if (config.thaiConsonants) parts.push("ก-ฮ");
  if (config.thaiVowels) parts.push("ะ-ๆ");
  if (config.thaiToneMarks) parts.push("่-๋");
  if (config.thaiDigits) parts.push("๐-๙");
  if (config.arabicDigits) parts.push("0-9");
  if (config.englishLetters) parts.push("A-Za-z");
  if (config.spaces) parts.push("\\s");
  if (config.specialChars) parts.push("\\-_\\.\\/");
  if (parts.length === 0) return ".";
  return `[${parts.join("")}]`;
}
