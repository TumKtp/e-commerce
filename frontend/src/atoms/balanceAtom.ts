import { atom, useRecoilState } from "recoil"

const balanceState = atom<number | undefined>({
  key: "balanceState",
  default: undefined,
})

export const useBalance = () => {
  const [balance, setBalance] = useRecoilState(balanceState)
  return { balance, setBalance }
}
