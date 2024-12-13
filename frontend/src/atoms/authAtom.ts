import { User } from "@/types"
import { atom, useRecoilState } from "recoil"

const userState = atom<User | undefined>({
  key: "userState",
  default: undefined,
})

export const useUser = () => {
  const [user, setUser] = useRecoilState(userState)
  return { user, setUser }
}
