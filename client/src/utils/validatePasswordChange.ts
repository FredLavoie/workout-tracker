/**
 * Utility function to validate that the new password is of a minimum length, isn't just a
 * number and that it was entered with the same characters both times.
 * 
 * @param pass1 new password
 * @param pass2 new password
 * @return if the data is valid, return true, else return false
 */
export function validatePasswordChange(pass1: string, pass2: string): boolean {
  if (pass1 === pass2) {
    if (pass1.length < 8) return false;
    if (Number(pass1) % 1 === 0) return false;
    return true;
  }
  return false;
}
