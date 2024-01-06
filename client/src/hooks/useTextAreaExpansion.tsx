import { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react'

const useTextAreaExpansion = () => {
  const textAreaExpansion = (
    e: ChangeEvent<HTMLTextAreaElement>,
    reference: RefObject<HTMLTextAreaElement>,
    setState: Dispatch<SetStateAction<string>>
  ) => {
    setState(e.target.value)

    if (reference.current) {
      reference.current.style.height = 'auto'
      reference.current.style.height = `${reference.current.scrollHeight}px`
    }
  };

  return textAreaExpansion
};

export default useTextAreaExpansion