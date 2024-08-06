export const handleFirebaseError = (error: any, setMsg: Function) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      setMsg("El correo electrónico ya está en uso.")
      break
    case "auth/invalid-email":
      setMsg("El correo electrónico no es válido.")
      break
    case "auth/weak-password":
      setMsg("La contraseña es demasiado débil.")
      break
    default:
      setMsg("Ocurrió un error al intentar registrarse. Por favor, intenta nuevamente.")
      break
  }
}
export const handleFirebaseLoginError = (error: any, setMsg: Function) => {
  switch (error.code) {
    case "auth/wrong-password":
      setMsg("La contraseña es incorrecta.")
      break
    case "auth/user-not-found":
      setMsg("No se encontró ningún usuario con este correo electrónico.")
      break
    case "auth/invalid-email":
      setMsg("El correo electrónico no es válido.")
      break
    case "auth/user-disabled":
      setMsg("La cuenta ha sido deshabilitada.")
      break
    default:
      setMsg("Ocurrió un error al intentar iniciar sesión. Por favor, intenta nuevamente.")
      break
  }
}
