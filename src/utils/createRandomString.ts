export function createRandomString(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const l = () => letters[Math.floor(Math.random() * letters.length)]
  const randomID = () => l() + l() + l() + l() + l() + l() + l() + l() + l()
  return randomID()
}
