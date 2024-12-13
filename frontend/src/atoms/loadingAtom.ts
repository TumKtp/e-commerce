import { atom, useRecoilState } from "recoil"

const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
})

export const useLoading = () => {
  const [isLoading, setLoading] = useRecoilState(loadingState)
  return { isLoading, setLoading }
}
