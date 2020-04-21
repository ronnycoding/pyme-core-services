
export default function useFackeData() {
  async function getDataUsers(num = 10) {
    const res = await fetch(`https://randomuser.me/api/?results=${num}&gender=female`)
    return res.json()
  }

  return {
    getDataUsers,
  }
}