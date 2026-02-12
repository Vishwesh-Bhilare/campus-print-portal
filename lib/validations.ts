export function isValidMMCOEEmail(email: string): boolean {
  return email.endsWith("@mmcoe.edu.in");
}

export function validatePrintStatus(status: string): boolean {
  return ["pending", "ready", "collected"].includes(status);
}

export function validateCopies(copies: number): boolean {
  return Number.isInteger(copies) && copies > 0 && copies <= 1000;
}

export function validatePrintType(type: string): boolean {
  return ["black_white", "color"].includes(type);
}
