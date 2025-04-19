export const isPasswordValid = (password: string): boolean => {
  // Al menos 8 caracteres, al menos una letra mayúscula, una letra minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  return passwordRegex.test(password)
}