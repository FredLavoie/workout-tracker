/**
 * Utility function to validate that the new password is of a minimum length, isn't just a
 * number and that it was entered with the same characters both times.
 * 
 * @param {string} pass1 new password
 * @param {string} pass2 new password
 * @return {boolean} if the data is valid, return true, else return false
 */
export function validatePasswordChange(pass1, pass2) {
  if (pass1 === pass2) {
    if (pass1.length < 8) return false;
    if (Number(pass1) % 1 === 0) return false;
    return true;
  }
  return false;
}
