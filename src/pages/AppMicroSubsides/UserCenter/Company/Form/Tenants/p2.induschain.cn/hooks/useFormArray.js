import { useArray } from '@dragon/hooks'

const useFormArray = (init = [], max = 1) => {
  const [formArray, { push, remove, set }] = useArray(init)

  // 是否可添加
  const canAdd = formArray.length <= max - 1

  return [
    formArray,
    {
      push,
      remove,
      set,
      canAdd
    }
  ]
}

export default useFormArray
