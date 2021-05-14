function validatePasswordChange(pass1, pass2) {
  if (pass1 === pass2) {
    if (pass1.length < 8) return false;
    if (Number(pass1) % 1 === 0) return false;
  } else {
    return false;
  }
  return true;
}

export { validatePasswordChange }
