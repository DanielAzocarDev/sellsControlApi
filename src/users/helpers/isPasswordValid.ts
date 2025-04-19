export const isPasswordValid = (password: string): boolean => {
  // Al menos 8 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un caracter especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/;

  return passwordRegex.test(password)
}