type Lang = "en" | "th";

const errorMessages: Record<string, Record<Lang, string>> = {
  required: { en: "{label} is required", th: "{label} จำเป็นต้องกรอก" },
  minLength: { en: "Minimum length is {min} characters", th: "ความยาวขั้นต่ำคือ {min} ตัวอักษร" },
  maxLength: { en: "Maximum length is {max} characters", th: "ความยาวสูงสุดคือ {max} ตัวอักษร" },
  exactLength: { en: "Must be exactly {exact} characters", th: "ต้องมี {exact} ตัวอักษรพอดี" },
  mustIncludeNumber: { en: "Must include at least one number", th: "ต้องมีตัวเลขอย่างน้อย 1 ตัว" },
  mustIncludeUppercase: { en: "Must include at least one uppercase letter", th: "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว" },
  mustIncludeLowercase: { en: "Must include at least one lowercase letter", th: "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว" },
  mustIncludeSpecial: { en: "Must include at least one special character", th: "ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว" },
  thaiOnly: { en: "Thai characters only", th: "อักษรไทยเท่านั้น" },
  englishOnly: { en: "English characters only", th: "อักษรอังกฤษเท่านั้น" },
  invalidEmail: { en: "Invalid email format", th: "รูปแบบอีเมลไม่ถูกต้อง" },
  invalidPhone: { en: "Invalid phone number", th: "หมายเลขโทรศัพท์ไม่ถูกต้อง" },
  invalidNumber: { en: "Invalid number format", th: "รูปแบบตัวเลขไม่ถูกต้อง" },
  invalidDate: { en: "Invalid date format (YYYY-MM-DD)", th: "รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)" },
  invalidPrice: { en: "Invalid price format", th: "รูปแบบราคาไม่ถูกต้อง" },
  invalidSlug: { en: "Invalid slug format", th: "รูปแบบ slug ไม่ถูกต้อง" },
  noEmoji: { en: "Emoji characters are not allowed", th: "ไม่อนุญาตให้ใช้ emoji" },
  noConsecutiveSpaces: { en: "No consecutive spaces allowed", th: "ไม่อนุญาตช่องว่างติดกัน" },
  passwordMatch: { en: "Passwords must match", th: "รหัสผ่านต้องตรงกัน" },
  enumInvalid: { en: "Must be one of: {values}", th: "ต้องเป็นหนึ่งใน: {values}" },
  customPatternFail: { en: "Does not match required pattern", th: "ไม่ตรงกับ pattern ที่กำหนด" },
  atLeastOneRequired: { en: "At least one field required: {fields}", th: "ต้องกรอกอย่างน้อยหนึ่งฟิลด์: {fields}" },
  fieldRequiredIf: { en: "{label} is required when {condition}", th: "{label} จำเป็นเมื่อ {condition}" },
  mustBeLessThan: { en: "{a} must be less than {b}", th: "{a} ต้องน้อยกว่า {b}" },
};

export function getErrorMessage(
  key: string,
  lang: Lang,
  params?: Record<string, string | number>
): string {
  const templates = errorMessages[key];
  if (!templates) return key;
  let msg = templates[lang] || templates.en;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      msg = msg.replace(`{${k}}`, String(v));
    }
  }
  return msg;
}

export function generateErrorMessages(
  lang: Lang,
  fieldLabel: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    exactLength?: number;
    mustIncludeNumber?: boolean;
    mustIncludeUppercase?: boolean;
    mustIncludeLowercase?: boolean;
    mustIncludeSpecial?: boolean;
    thaiOnly?: boolean;
    englishOnly?: boolean;
    noEmoji?: boolean;
  }
): Record<string, string> {
  const msgs: Record<string, string> = {};
  if (rules.required) msgs.required = getErrorMessage("required", lang, { label: fieldLabel });
  if (rules.minLength) msgs.minLength = getErrorMessage("minLength", lang, { min: rules.minLength });
  if (rules.maxLength) msgs.maxLength = getErrorMessage("maxLength", lang, { max: rules.maxLength });
  if (rules.exactLength) msgs.exactLength = getErrorMessage("exactLength", lang, { exact: rules.exactLength });
  if (rules.mustIncludeNumber) msgs.mustIncludeNumber = getErrorMessage("mustIncludeNumber", lang);
  if (rules.mustIncludeUppercase) msgs.mustIncludeUppercase = getErrorMessage("mustIncludeUppercase", lang);
  if (rules.mustIncludeLowercase) msgs.mustIncludeLowercase = getErrorMessage("mustIncludeLowercase", lang);
  if (rules.mustIncludeSpecial) msgs.mustIncludeSpecial = getErrorMessage("mustIncludeSpecial", lang);
  if (rules.thaiOnly) msgs.thaiOnly = getErrorMessage("thaiOnly", lang);
  if (rules.englishOnly) msgs.englishOnly = getErrorMessage("englishOnly", lang);
  if (rules.noEmoji) msgs.noEmoji = getErrorMessage("noEmoji", lang);
  return msgs;
}

export const allErrorKeys = Object.keys(errorMessages);
