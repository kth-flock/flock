import { FieldWrapper } from "./formInputs";
import { useFocusWithin } from "../hooks/useFocusWithin";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchBar() {
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();
  return (
    <FieldWrapper
      isFocused={isFocused}
      onClick={() => ref.current?.focus()}
      icon={<FaMagnifyingGlass />}
    >
      test
    </FieldWrapper>
  );
}
